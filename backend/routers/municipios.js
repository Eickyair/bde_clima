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
        const municipios = await prisma.municipio.findMany({
            where: {
                id_estado
            }
        });
        const municipiosMap = new Map();
        municipios.forEach(municipio => {
            municipiosMap.set(municipio.id_municipio, municipio.nombre_mun);
        });
        let predicciones_municipios = await prisma.prediccion.findMany({
            where: {
                fecha: new Date(fecha_filtro_str),
                id_estado
            },
            select: {
                tmax: true,
                tmin: true,
                id_municipio: true,
            }
        });
        predicciones_municipios = predicciones_municipios.map(prediccion => {
            const nombre = municipiosMap.get(prediccion.id_municipio);
            return {
                tmax: parseFloat(prediccion.tmax),
                tmin: parseFloat(prediccion.tmin),
                id_municipio: prediccion.id_municipio,
                nombre
            }
        })
        const maxTmp = Math.max(...predicciones_municipios.map(prediccion => prediccion.tmax));
        const minTmp = Math.min(...predicciones_municipios.map(prediccion => prediccion.tmin));
        res.json({ data: predicciones_municipios, id_estado, fecha: fecha_filtro_str, maxTmp, minTmp });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estados' });
    }
};

const getMunicipio = async (req, res) => {
    const paramsSchema = z.object({
        id_estado: z.string().transform((val) => parseInt(val, 10)),
        id_municipio: z.string().transform((val) => parseInt(val, 10)),
    });
    const querySchema = z.object({
        fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Fecha debe tener el formato ISO string",
        }),
    });
    try {
        const { fecha: fecha_filtro_str } = querySchema.parse(req.query);
        const { id_estado, id_municipio } = paramsSchema.parse(req.params)
        const fecha_actual = new Date(fecha_filtro_str);
        const sieteDiasDespues = new Date(fecha_actual);
        sieteDiasDespues.setDate(sieteDiasDespues.getDate() + 7);
        const sieteDiasAntes = new Date(fecha_actual);
        sieteDiasAntes.setDate(sieteDiasAntes.getDate() - 7);
        const municipio = await prisma.municipio.findUnique({
            where: {
                id_estado_id_municipio: {
                    id_estado,
                    id_municipio
                }
            }
        });
        const estado = await prisma.estado.findUnique({
            where: {
                id_estado
            }
        });
        let prediccion_municipio = await prisma.prediccion.findMany({
            where: {
                fecha: {
                    gte: new Date(sieteDiasAntes),
                    lt: new Date(sieteDiasDespues)
                },
                id_estado,
                id_municipio
            },
            select: {
                tmax: true,
                tmin: true,
                fecha: true,
            }
        });
        res.json({ data: prediccion_municipio, id_estado, id_municipio, fecha: fecha_filtro_str, sieteDiasAntes, sieteDiasDespues, municipio, estado });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estados' });
    }
}


router.get('/:id_estado', getMunicipiosByIdEstado);
router.get('/:id_estado/:id_municipio', getMunicipio);

export default router;