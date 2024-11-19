import { Router } from 'express';
const router = Router();
import prisma from '../db.js';
import z from 'zod';

// Controladores (puedes mover estos a un archivo separado)
const getEstados = async (req, res) => {
    const querySchema = z.object({
        fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Fecha debe tener el formato ISO string",
        }),
    });
    try {
        const { fecha: fecha_filtro_str} = querySchema.parse(req.query);
        let estados = await prisma.estado.findMany();
        let estadoMap = new Map();
        estados.forEach(estado => {
            estadoMap.set(estado.id_estado, estado.nombre_est);
        })
        const predicciones_agregadas = await prisma.prediccion.groupBy({
            by: ['id_estado'],
            where: {
                fecha: new Date(fecha_filtro_str)
            },
            _avg: {
                tmax: true,
                tmin: true,
            },
        });
        let infoMap = predicciones_agregadas.map(prediccion => {
            let nombre = estadoMap.get(prediccion.id_estado);
            return {
                tmax: parseFloat(parseFloat(prediccion._avg.tmax).toFixed(3)),
                tmin: parseFloat(parseFloat(prediccion._avg.tmin).toFixed(3)),
                id_estado: prediccion.id_estado,
                nombre
            }
        })
        let maxTmp = infoMap.reduce((max, estado) => {
            return estado.tmax > max ? estado.tmax : max;
        }, 0);
        let minTmp = infoMap.reduce((min, estado) => {
            return estado.tmin < min ? estado.tmin : min;
        }, Infinity);
        res.json({ data: infoMap, maxTmp, minTmp });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener los estados' });
    }
}
router.get('/estados', getEstados);

export default router;