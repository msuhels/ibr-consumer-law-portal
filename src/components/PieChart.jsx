import React, { useState, useEffect } from 'react';
import { Doughnut } from "react-chartjs-2";
import { Chart, Title } from "chart.js";
Chart.register(Title);

function PieChart({ data, score }) {

    return (
        <>
            <div className='chartDiv mt-5'>
                <Doughnut
                    data={data}
                    lable="263"
                    options={{
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            },
                            // title: {
                            //     display: true,
                            //     text: score,
                            //     position: "bottom",
                            // },
                            
                        },
                        rotation: -90,
                        circumference: 180,
                        cutout: "60%",
                        maintainAspectRatio: false,
                        responsive: true,
                        animation: { animateScale: true }
                    }}
                />
                {/* <div
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center"
                    }}
                >
                    <div>Text Here</div>
                </div> */}
            </div>
        </>
    );
}

export default PieChart;