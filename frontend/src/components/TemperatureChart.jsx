import { Chart } from 'primereact/chart';
import { useTemperatureChart } from '../hooks/useTemperatureChart';
import { useMapas } from '../context/Mapas';
const TemperatureChart = ({ h, w }) => {
    const { idEstado, id_municipio, fecha } = useMapas()
    const { data, isLoading } = useTemperatureChart(idEstado, id_municipio, fecha);
    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><p>Cargando...</p></div>
    }
    if (!data) {
        return <></>
    }
    // Extraer las fechas y formatearlas a yyyy/mm/dd
    if (!data.municipio) {
        return <div className="h-[310px] flex items-center justify-center"><p className="text-2xl">Municipio Desconocido</p></div>
    }

    const chartLabels = data.data.map(item => {
        const date = new Date(item.fecha);
        const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '/');
        return formattedDate;
    });

    // Extraer los datos de tmax y tmin
    const tmaxData = data.data.map(item => parseFloat(item.tmax));
    const tminData = data.data.map(item => parseFloat(item.tmin));

    // Preparar los datos para el gráfico
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Temperatura Máxima (°C)',
                data: tmaxData,
                fill: false,
                borderColor: '#FF6384',
                tension: 0.1
            },
            {
                label: 'Temperatura Mínima (°C)',
                data: tminData,
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.1
            }
        ]
    };

    // Opciones del gráfico, incluyendo el título
    const options = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `${data.estado.nombre_est} - ${data.municipio.nombre_mun}`,
                font: {
                    size: 24
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                    font: {
                        size: 18
                    }
                },
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperatura (°C)',
                    font: {
                        size: 18
                    }
                },
                ticks: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    return (
        <div>
            <Chart type="line" data={chartData} style={{ width: w, height: h }} options={options} />
        </div>
    );
};

export default TemperatureChart;
