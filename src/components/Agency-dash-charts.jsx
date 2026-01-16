import React, { useState } from 'react'
import LineChart from '../charts/LineChart05';
import { tailwindConfig, hexToRGB } from '../utils/Utils';
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const AgencyDashCharts = ({ data ,options , activeLineBtn ,setActiveLineBtn}) => {

  // const options = {
  //   plugins: {
  //     title: {
  //       display: false,
  //     },
  //     legend: {
  //       display: false
  //     },
  //     layout: {
  //       padding: 20,
  //     },
  //     tooltip: {
  //       callbacks: {
  //         title: () => false, // Disable tooltip title
  //         label: (context) => `${context.parsed.y} Clients`,
  //       },
  //     },
  //   },
  //   scales: {
  //     y: {
  //       ticks: {
  //         font: {
  //           size: 12, // Adjust font size for y-axis labels
  //         },
  //         // Define your own custom values for the y-axis ticks
  //         callback: function (value, index, values) {
  //           // Example: return custom values based on index
  //           return `${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100][index]} `; // Customize as needed
  //         }
  //       },
  //     },
  //   }
  // }

  return (
    <div className='bg-[#F8F9F9] border border-[#EEEFF1]'>
      <div className='flex flex-row py-6 px-8 text-black font-semibold'>
        {/* <div className={`px-4 pb-2 text-xl border-b-4 cursor-pointer ${activeBtn==='Revenue' ?'border-[#F41F1C] text-[#F41F1C]': ''}`} onClick={()=>setActiveBtn('Revenue')}>Revenue</div> */}
        <div className={`px-4 pb-2 border-b-4  text-xl  cursor-pointer ${activeLineBtn === '1' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveLineBtn('1')}>New Leads</div>
        <div className={`px-4 pb-2 border-b-4  text-xl  cursor-pointer ${activeLineBtn === '2' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveLineBtn('2')}>Active Clients</div>
        {/* <div className={`px-4 pb-2 border-b-4  text-xl  cursor-pointer ${activeBtn==='Affiliates' ?'border-[#F41F1C] text-[#F41F1C]': ''}`} onClick={()=>setActiveBtn('Affiliates')}>Affiliates</div> */}
      </div>
      <div className='bg-white mb-8 ml-3 mr-2 px-12 py-4'>
        {/* <LineChart data={chartData} width={800} height={300} /> */}
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default AgencyDashCharts



