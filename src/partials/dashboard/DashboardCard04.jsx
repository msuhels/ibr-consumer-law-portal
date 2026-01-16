import React, { useState, useEffect } from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard04({ processData }) {
  const [newArray, setNewArray] = useState([]);

  useEffect(() => {
    const reportDates = processData?.mergedValues?.map(item => item.reportDate);

    // Check if reportDates is not empty
    if (reportDates && reportDates.length > 0) {
      const updatedArray = reportDates.map(date => {
        const [month, day, year] = date.split('/');
        return `${month}/01/${year}`;
      });

      // Filter out empty values
      const filteredArray = updatedArray.filter(value => value.trim() !== '');

      // Take only the first 4 values
      const slicedArray = filteredArray.slice(0, 4);

      setNewArray(slicedArray);
    }
  }, []);

  useEffect(() => {
  }, [newArray]);

  const chartData = {
    labels: newArray,
    datasets: [
      {
        label: 'Indirect',
        data: [
          300, 800, 500, 400, 700, 800,
        ],
        backgroundColor: tailwindConfig().theme.colors.indigo[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

  return newArray.length > 0 && <BarChart data={chartData} width={600} />;
}

export default DashboardCard04;
