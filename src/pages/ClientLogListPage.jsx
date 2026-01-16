import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_CLIENT_ACTIVITY } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'

function ClientLogListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isLeadData, setIsLeadData] = useState([]);
  const [setLoader, setsetLoader] = useState(false);
  const [clientActivitylogs, setClientActivitylogs] = useState([]);





  const getClientActivities = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_CLIENT_ACTIVITY, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
      setClientActivitylogs(response.data)
      setsetLoader(false);
    } catch (error) {
      console.log("Something went Wrong");
      setsetLoader(false);
    }
  };

  useEffect(() => {
    getClientActivities();
  }, []);

  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* <div className="flex h-[100dvh] overflow-hidden px-8 bg-white"> */}
      {/* <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* <AgencyHeader /> */}


        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }
        <main className="grow">
          {(user?.role === "agent" || user?.role === "agency_agent") ?
            <SubNavbar />
            :
            ""
          }


          <div className="py-8 mx-4 sm:mx-8">
            <div className='shownav'>
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                  <h2 className="font-semibold text-slate-100 dark:text-slate-100">Clients log List</h2>
                </header>
                <div>
                  <div className="overflow-x-auto p-4">
                    <table className="table-auto w-full dark:text-slate-300">
                      <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                            <div className="font-semibold text-left">User Email</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                            <div className="font-semibold text-left">IP Address</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Login/Logout</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Location</div>
                          </th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {clientActivitylogs && clientActivitylogs?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize font-bold tm-color">
                                {/* <Link to={`/dashboard/${data?.user_table_id}`}> */}
                                {data?.email ? data?.email : "-"}
                                {/* </Link> */}
                              </td>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                {data?.ipAddress ? data?.ipAddress : "-"}
                              </td>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                {data?.timestamp ? moment(data?.timestamp).format('MM/DD/YYYY hh:mm:ss A') : "-"}
                              </td>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                {data?.location ? data?.location : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {clientActivitylogs.length === 0 &&
                      <div className='pt-4 text-center '>No Data Found</div>
                    }
                  </div>
                </div>
              </div>
            </div>


            <div className='hidenav'>
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">Client logs<span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2>
                </header>
                <div className="px-5 overflow-x-auto">
                  <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                      {clientActivitylogs && clientActivitylogs?.map((data, index) => {
                        return (
                          <>
                            <div key={index} style={{ paddingBottom: "20px", marginTop: "20px" }}>
                              <table className="table-auto w-full dark:text-slate-300">
                                <tbody className="">
                                  <tr style={{ borderBottomWidth: "0px" }}>
                                    <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      <div className="font-semibold text-left">USER EMAIL</div>
                                    </th>
                                    <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      {/* <Link to={`/dashboard/${data?.user_table_id}`}> */}
                                      {data?.email ? data?.email : "-"}
                                      {/* </Link> */}
                                    </td>
                                  </tr>
                                  <tr style={{ borderBottomWidth: "0px" }}>
                                    <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      <div className="font-semibold text-left">IP Address</div>
                                    </th>
                                    <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      {data?.ipAddress ? data?.ipAddress : "-"}
                                    </td>
                                  </tr>
                                  <tr style={{ borderBottomWidth: "0px" }}>
                                    <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      <div className="font-semibold text-left">Login/Logout</div>
                                    </th>
                                    <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      {data?.timestamp ? moment(data?.timestamp).format('MM/DD/YYYY hh:mm:ss A') : "-"}
                                      <span className={`${data?.activity === "Logout" ? "text-red-500" : "text-green-500"}`}> ({data?.activity})</span>
                                    </td>
                                  </tr>
                                  <tr style={{ borderBottomWidth: "0px" }}>
                                    <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      <div className="font-semibold text-left">Location</div>
                                    </th>
                                    <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                      {data?.location ? data?.location : "-"}
                                    </td>
                                  </tr>

                                </tbody>
                              </table>

                            </div>
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                  {clientActivitylogs.length === 0 &&
                    <div className='pt-4 text-center mb-3'>No Data Found</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>

      </div>
      {/* </div> */}

      {/* <Footer></Footer> */}
    </>

  );
}

export default ClientLogListPage;
