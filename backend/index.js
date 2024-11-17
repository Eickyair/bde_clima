import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

// Configurar CORS para permitir cualquier origen
app.use(cors({
    origin: '*',
}));
app.get('/api/estados/tmps', async (req, res) => {
    const fecha_filtro_str = req.query.fecha;
    const id_estado = req.query.id_estado;
    const nombres_municipios = await prisma.municipio.findMany({
        where: {
            id_estado: parseInt(id_estado)
        }
    });
    const nombres_municipios_map = new Map()
    nombres_municipios.forEach(municipio => {
        nombres_municipios_map.set(municipio.id_municipio, municipio.nombre_mun);
    })
    const predicciones = await prisma.prediccion.findMany({
        where: {
            fecha: new Date(fecha_filtro_str),
            id_estado: parseInt(id_estado)
        }
    })
    let p = predicciones.map(prediction => {
        let municipio = nombres_municipios_map.get(prediction.id_municipio);
        return {
            tmax: parseFloat(prediction.tmax),
            tmin: parseFloat(prediction.tmin),
            id_municipio: prediction.id_municipio,
            nombre : municipio
        }
    })
    console.log(p);
    res.json({data: p});
});
app.get('/api/mapas/municipios/tmp', async (req, res) => {
    const query_params = req.query;
    const date_filter_str = query_params.fecha;
    const date = new Date(date_filter_str);
    const date_two_days_ahead = new Date(date);
    const state_id = query_params.id_estado;
    date_two_days_ahead.setDate(date_two_days_ahead.getDate() + 2);

    const date_five_days_before = new Date(date);
    date_five_days_before.setDate(date_five_days_before.getDate() - 5);

    const municipality_id = query_params.id_municipio;
    const nombres_municipios = await prisma.municipio.findMany({
        where: {
            id_estado: parseInt(state_id)
        }
    });
    const nombres_municipios_map = new Map()
    nombres_municipios.forEach(municipio => {
        nombres_municipios_map.set(municipio.id_municipio, municipio.nombre_mun);
    });
    const predictions = await prisma.prediccion.findMany({
        where: {
            fecha:{
                gte: date_five_days_before,
                lte: date_two_days_ahead
            },
            id_municipio: parseInt(municipality_id),
            id_estado: parseInt(state_id)
        },
        orderBy: {
            fecha: 'desc'
        }
    });
    let p = predictions.map(prediction => {
        let municipio = nombres_municipios_map.get(prediction.id_municipio);
        console.log(municipio);
        return {
            tmax: parseFloat(prediction.tmax),
            tmin: parseFloat(prediction.tmin),
            fecha: prediction.fecha.toISOString().split('T')[0],
            nombre : municipio
        }
    });
    res.json({data: p});
});
app.get('/api/municipios', async (req, res) => {
    const query_params = req.query;
    const fecha_filtro_str = query_params.fecha;
    const id_municipio = query_params.id_municipio;
    res.json({fecha_filtro_str, id_municipio});
})
app.get('/api/mapas/estados', async (req, res) => {
    const query_params = req.query;
    const fecha_filtro_str = query_params.fecha;
    const estados = await prisma.estado.findMany({
        include: {
            municipio: {
                include : {
                    prediccion: {
                        where: {
                            fecha: new Date(fecha_filtro_str)
                        }
                    }
                }
            }
        },
    })
    let noInfo = true;
    const estados_con_prediccion = estados.map(estado => {
        let registro = {
            promedio_minimas_tmp : 0,
            promedio_maximas_tmp : 0,
        }
        estado.municipio.forEach(municipio => {
            municipio.prediccion.forEach(prediccion => {
                noInfo = false;
                registro.promedio_minimas_tmp += parseFloat(prediccion.tmin);
                registro.promedio_maximas_tmp += parseFloat(prediccion.tmax);
            })
        })
        registro.promedio_minimas_tmp = registro.promedio_minimas_tmp / estado.municipio.length;
        registro.promedio_maximas_tmp = registro.promedio_maximas_tmp / estado.municipio.length;
        return {
            ...estado,
            municipio : [],
            ...registro
        }
    })
    res.json({data: estados_con_prediccion, noInfo});
});
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});