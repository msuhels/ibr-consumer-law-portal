import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_ACTIVE_VIDEOS_LINKS } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'

function AdminAddedVideosLinks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [setLoader, setsetLoader] = useState(false);
  const [ActiveVideoLinks, setActiveVideoLinks] = useState(false);


  useEffect(() => {
    getActiveVideoLinks();
  }, []);


  const getActiveVideoLinks = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_ACTIVE_VIDEOS_LINKS, {},
        { headers: { "Authorization": "Bearer " + token } });
      setActiveVideoLinks(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };



  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex h-[100dvh] overflow-hidden px-8 bg-white">
        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">

          <main className="grow bg-white dark:bg-[#FFFFFF]">
            <div className="pl-2 py-2  w-full">
              <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700">
                <header className="px-5 py-4 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                  <h2 className="font-semibold text-3xl text-slate-100 dark:text-slate-100">Learning Hub</h2>
                </header>
                <div className="p-3">
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
                      {ActiveVideoLinks && ActiveVideoLinks.map((val, i) => {
                        return (
                          <div className="w-full">
                            <div className="w-full h-[300px] py-4">
                              <iframe
                                src={
                                  val?.video_link.includes("youtu.be")
                                    ? val?.video_link.replace("youtu.be/", "www.youtube.com/embed/")
                                    : val?.video_link.replace("watch?v=", "embed/")
                                }
                                className="w-full h-full rounded-[20px]"
                                frameBorder="0"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <div className="">
                              <p className='text-xl  text-[#080D18] font-bold capitalize'> {val?.video_title} </p>
                              <div className='my-3'>
                                <hr></hr>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {/* <div className='text-center my-3'>
                        <a href="https://www.consumerlawdispute.ai/learning-management" className='btn tm-background  py-2 px-5 rounded-3xl text-white'>Click to See more</a>
                      </div> */}
                  </div>
                </div>

              </div>

            </div>
          </main>

        </div>
      </div>

      {/* <Footer></Footer> */}
    </>

  );
}

export default AdminAddedVideosLinks;
