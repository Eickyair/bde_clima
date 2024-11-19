import { Router } from "express";
import prisma from "../db.js";
import z from "zod";
const router = Router();


const getMunicipiosByIdEstado = async (req, res) => {
    const paramsSchema = z.object({
        id_estado: z.string().transform((val) => parseInt(val, 10)),
    });
    const querySchema = z.object({
        fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Fecha debe tener el formato ISO string",
        }),
    });
    try {
        const { fecha: fecha_filtro_str } = querySchema.parse(req.query);
        const { id_estado } = paramsSchema.parse(req.params)
        let predicciones_municipios = await prisma.prediccion.findMany({
            where: {
                fecha: new Date(fecha_filtro_str),
                id_estado
            },
            select : {
                tmax: true,
                tmin: true,
                id_municipio: true
            }
        });
        predicciones_municipios = predicciones_municipios.map(prediccion => {
            return {
                tmax: parseFloat(prediccion.tmax),
                tmin: parseFloat(prediccion.tmin),
                id_municipio: prediccion.id_municipio
            }
        })
        const maxTmp = Math.max(...predicciones_municipios.map(prediccion => prediccion.tmax));
        const minTmp = Math.min(...predicciones_municipios.map(prediccion => prediccion.tmin));
        res.json({ data: predicciones_municipios, id_estado, fecha: fecha_filtro_str, maxTmp, minTmp });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estados' });
    }
};


router.get('/:id_estado', getMunicipiosByIdEstado);

export default router;