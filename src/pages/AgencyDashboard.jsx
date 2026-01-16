import React, { useState, useEffect } from 'react'
import AgencyHeader from '../partials/AgencyHeader';
import axios from "axios";
import { toast } from "react-toastify";
import { GET_COUNT_OF_AGENCY_DASHBOARD_CARDS, GET_CLIENT_DATA } from "../API/api"
import { Link, NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import SubNavbar from '../components/SubNavbar';
import AgencyDashCharts from '../components/Agency-dash-charts';
import CustomPieChart from '../components/CustomPieChart';
import TopAffiliates from '../components/TopAffiliates';
import moment from 'moment'
import ClientStatus from '../components/ClientStatus';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
const AgencyDashboard = () => {
  const [isClientData, setIsClientData] = useState([]);
  const [loader, setsetLoader] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState("");
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [activeLineBtn, setActiveLineBtn] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const lineGraph = {
  //   labels: ["Jan 23", "Feb 23 ", "Mar 23 ", "Apr 23 ", "May 23 ", "Jun 23", "July 23", "Aug 23", "Sep 23", "Oct 23", "Nov 23", "Dec 23"],
  //   datasets: [
  //     {
  //       label: "First dataset",
  //       data: [15, 53, 85, 41, 44, 65, 0, 0, 0, 98],
  //       fill: true,
  //       backgroundColor: "rgba(251, 180, 179, 0.2)",
  //       borderColor: "rgba(244, 31, 28, 1)"
  //     },
  //   ] 
  // };

  const clientStagesData = {
    labels: ['New leads pending', 'Agreement Pending', 'Docs Pending', 'Report Pending', "Round 1 Letters Sent", "Round 2 Letters Sent", "Round 3 Letters Sent"],
    datasets: [
      {
        label: '#',
        data: [totalCount?.TotalNewLeadCount, totalCount?.agreementPendingCount, totalCount?.docsPendingCount, totalCount?.reportPendingCount, totalCount?.roundOneLettersCount, totalCount?.roundTwoLettersCount, totalCount?.roundThreeLettersCount],
        backgroundColor: [
          '#8875ED',
          '#FA8051',
          '#F22421',
          '#5859E0',
          '#8CDD35',
          '#080D18',
          '#0051ff',

        ],
      },
    ],
  };
  const clientStatusData = {
    labels: ['Active Clients', 'Inactive Clients', 'Suspended', 'Cancelled'],
    datasets: [
      {
        label: '#',
        data: [totalCount?.activeClientsCount, totalCount?.deactiveClientsCount, totalCount?.suspendedClientsCount, totalCount?.canceledClientsCount],
        backgroundColor: [
          '#8CDD35',
          '#FA8051',
          '#F22421',
          '#080D18'
        ],
      },
    ],
  };
  const [activeBtn, setActiveBtn] = useState('3');


  const getClientData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_CLIENT_DATA, {},
        { headers: { "Authorization": "Bearer " + token } });
      setIsClientData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const [lineGraph, setLineGraph] = useState({
    labels: [],
    datasets: [
      {
        label: "Clients Added",
        data: [],
        fill: true,
        backgroundColor: "rgba(251, 180, 179, 0.2)",
        borderColor: "rgba(244, 31, 28, 1)"
      },
    ]
  });

  const GetCountOfDashboardCard = async () => {
    try {
      const response = await axios.post(GET_COUNT_OF_AGENCY_DASHBOARD_CARDS, {
        user_id: user?._id,
      }, {
        headers: { "Authorization": "Bearer " + token }
      });
      const dashboardData = response?.data?.dashboardData;
      setTotalCount(dashboardData);
      console.log(activeLineBtn, "activeLineBtnactiveLineBtn");
      let clientsAddedPerMonth = "";
      if (activeLineBtn === "2") {
        clientsAddedPerMonth = dashboardData.clientsAddedPerMonth;
      } else {
        clientsAddedPerMonth = dashboardData.leadAddedPerMonth;
      }

      const labels = [];
      const data = new Array(6).fill(0); // Array of zeros with length 6
      for (let i = 5; i >= 0; i--) {
        const month = moment().subtract(i, 'months');
        labels.push(month.format('MMM YY'));
      }

      // Populate data array based on clientsAddedPerMonth
      clientsAddedPerMonth.forEach(client => {
        const monthIndex = moment(client.month, 'MMMM').month(); // Get the zero-based month index
        const labelIndex = labels.findIndex(label => monthIndex === moment(label, 'MMM YY').month() && client.year === moment().year());
        if (labelIndex !== -1) {
          data[labelIndex] = client.count;
        }
      });

      // Update lineGraph state
      setLineGraph({
        labels: labels,
        datasets: [
          {
            label: "Clients Added",
            data: data,
            fill: true,
            backgroundColor: "rgba(251, 180, 179, 0.2)",
            borderColor: "rgba(244, 31, 28, 1)"
          },
        ]
      });

    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };


  const maxDataValue = Math.max(...lineGraph.datasets[0].data);
  const yAxisMax = maxDataValue < 10 ? 10 : Math.ceil(maxDataValue / 10) * 10;

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false
      },
      layout: {
        padding: 20,
      },
      tooltip: {
        callbacks: {
          title: () => false, // Disable tooltip title
          label: (context) => `${context.parsed.y} Clients`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 12, // Adjust font size for y-axis labels
          },
          // Dynamically set the y-axis tick values
          stepSize: yAxisMax / 10, // Adjust the number of steps
          callback: function (value) {
            return value;
          }
        },
        max: yAxisMax, // Set the max value dynamically
      },
    }
  };

  useEffect(() => {
    GetCountOfDashboardCard();
    getClientData();
  }, [activeLineBtn]);

  useEffect(() => {
    filterData();
  }, [activeBtn, isClientData]);

  const filterData = () => {
    const filtered = isClientData?.filter((data) => data?.client_Status === activeBtn);
    setFilteredData(filtered);
  };

  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* <AgencyHeader /> */}
        <main className="grow mb-16">
          <SubNavbar />
          {/* <div className='custom-border py-8 lg:px-8 ms-3'> */}
          <div className='custom-border py-8 px-4 sm:px-8'>
            Overview
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4  px-8 py-5 bg-[#F8F9F9]" style={{ border: '1px solid rgba(244, 31, 28, 0.1)', color: '#080D18' }}>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">New Leads</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>{totalCount?.TotalNewLeadCount}</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">Active Clients</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>{totalCount?.activeClientsCount}</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">Suspended</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>{totalCount?.suspendedClientsCount}</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">Cancelled</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>{totalCount?.canceledClientsCount}</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">Dispute Filed</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>0</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
            <div className='px-5 pt-4 mr-2 bg-white flex-1' style={{ border: '1px solid rgba(248, 249, 249, 0.3)' }}>
              <div className="mb-6">
                <p class="title-font text-lg sm:text-lg">Inactive Clients</p>
              </div>
              <div className='flex items-center py-6'>
                <h1 className='text-6xl font-bold'>{totalCount?.deactiveClientsCount}</h1><span className='ml-1 text-[20px] font-semibold'></span>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6'>
            <div>
              <div className='text-3xl px-8  py-6 font-bold text-black'>Growth</div>
              <AgencyDashCharts data={lineGraph} options={options} activeLineBtn={activeLineBtn} setActiveLineBtn={setActiveLineBtn} />
            </div>
            <div className=''>
              <div className='text-3xl  font-bold py-6 text-black'>Client Stages</div>
              <CustomPieChart data={clientStagesData} />
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6'>
            <div>
              <div className='text-3xl px-6 py-6 font-bold text-black'>Clients</div>
              <div className='flex flex-row pt-4 px-4 text-black font-semibold'>
                <div className={`px-4 pb-2  border-b-4 cursor-pointer ${activeBtn === '3' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveBtn('3')}>Active Clients</div>
                <div className={`px-4 pb-2 border-b-4  cursor-pointer ${activeBtn === '4' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveBtn('4')}>Inactive</div>
                <div className={`px-4 pb-2 border-b-4  cursor-pointer ${activeBtn === '5' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveBtn('5')}>Suspended</div>
                <div className={`px-4 pb-2 border-b-4  cursor-pointer ${activeBtn === '6' ? 'border-[#F41F1C] text-[#F41F1C]' : ''}`} onClick={() => setActiveBtn('6')}>Cancelled</div>
              </div>
              {loader ? (
                <div className="flex justify-center items-center py-6">
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="m-5 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">Clients List</h2>
                  </header>
                  <div>
                    <div className="overflow-x-auto p-4">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                          <tr>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                              <div className="font-semibold text-left">Name</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Agent Name</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Added</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Start Date</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Last Login</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Client Stages</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Client Status</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                          {filteredData && filteredData.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize font-bold tm-color">
                                  {data?.name ? data?.name : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.agent_data ? data?.agent_data[0]?.name : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.created_at ? moment(data?.created_at).format('MM/DD/YYYY') : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.start_date ? moment(data?.start_date).format('MM/DD/YYYY') : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.last_login ? moment(data?.last_login).format('MM/DD/YYYY hh:mm:ss A') : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.client_stages === "1" && "New Lead"}
                                  {data?.client_stages === "2" && "Paid Client"}
                                  {data?.client_stages === "3" && "Agreement Pending"}
                                  {data?.client_stages === "4" && "Report Pending"}
                                  {data?.client_stages === "5" && "Documents Pending"}
                                  {data?.client_stages === "6" && "Round 1 Letters Sent"}
                                  {data?.client_stages === "7" && "Round 2 Letters Sent"}
                                  {data?.client_stages === "8" && "Round 3 Letters Sent"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  {data?.client_Status === "1" && "Leads"}
                                  {data?.client_Status === "2" && "Prospect"}
                                  {data?.client_Status === "3" && "Active Client"}
                                  {data?.client_Status === "4" && "Inactive Client"}
                                  {data?.client_Status === "5" && "Suspended"}
                                  {data?.client_Status === "6" && "Canceled"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className=''>
              <div className='text-3xl  font-bold py-6 px-6 text-black'>Client Status</div>
              <CustomPieChart data={clientStatusData} />
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default AgencyDashboard