import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomPieChart = ({ data }) => {

    const options = {
        plugins: {
            legend: {
                display: false // Hides the legend
            },
            tooltip: {
                enabled: true
            }
        },
        aspectRatio: 1,
        cutout: '60%',
        layout: {
            padding: {
                top: 4,
                bottom: 4,
                left: 24,
                right: 24,
            },
        },
        maintainAspectRatio: false, // Allows chart to take up full container space
        elements: {
            arc: {
                borderWidth: 5 // Remove border around arcs
            }
        }
    };

    const renderChart = () => (
        <div className='flex flex-col lg:flex-row justify-center items-center bg-[#FFFFFF]'>
            <div className='w-full lg:w-1/2 py-6'>
                <Doughnut data={data} options={options} height={300} width={400} />
            </div>
            <div className='w-full lg:w-1/2 py-6 flex items-center p-5'>
                <ul className='w-full list-none pl-0 grid grid-cols-2 md:grid-cols-1 gap-3'>
                    {data.labels.map((label, index) => (
                        <li key={index} className='py-2 flex items-center'>
                            <span
                                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                                className='w-5 h-5 inline-block mr-2'>
                            </span>
                            {label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );


    const isEmptyData = data?.datasets[0]?.data.every(value => value === 0);

    return (
        <div className='bg-[#F8F9F9] border border-[#EEEFF1] py-8 px-4'>
            {isEmptyData ? <div className='text-center'>No data Found</div> : renderChart()}
        </div>
    );
};

export default CustomPieChart;
