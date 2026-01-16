import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import site_logo from "../images/consumer_logo.png"
import Cookies from "js-cookie";
import { GET_USER_DETAILS, GET_LATEST_ID_DOC_FROM_AWS } from "../API/api.js"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function SubHeader() {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [userData, setUserData] = useState("");
  const [latestDocIdFromAws, setlatestDocIdFromAws] = useState("");
  const isButtonActive = (url) => {
    return location.pathname === url ? 'btnn-background text-white' : 'inactive-button-class';
  };

  useEffect(() => {
    getUserData();
    getLatestIdOfAwsData()
  }, []);

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const getLatestIdOfAwsData = async () => {

    try {
      const response = await axios.post(GET_LATEST_ID_DOC_FROM_AWS, {
        userid: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data?.aws_list) {
        setlatestDocIdFromAws(response.data?.aws_list[0])
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getLatestIdOfAwsDataAndNavigate = async () => {

    try {
      const response = await axios.post(GET_LATEST_ID_DOC_FROM_AWS, {
        userid: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data?.aws_list) {
        setlatestDocIdFromAws(response.data?.aws_list[0])
        navigate(`/inquiry/${id}/${response.data?.aws_list[0]._id}`)

      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };
  return (
    <>

      {id &&
        <header className=" top-0 bg-white dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-auto" >

          <div className="px-4 sm:px-6 lg:px-8" >
            <div className="flex items-center h-full  pt-3 pb-3  overflow-hidden justify-center">
              <div className=" grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 m-1 ">
                <>
                  <div className="m-1 sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                    <div className='flex flex-col'>
                    <Link to={`/dashboard/${id}`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/dashboard/${id}`)}`}>
                      <svg className="shrink-0 h-4 w-4 me-1" viewBox="0 0 24 24">
                        <circle
                          className={`fill-current  ? 'text-indigo-300' : 'text-slate-400'}`}
                          cx="18.5"
                          cy="5.5"
                          r="4.5"
                        />
                        <circle
                          className={`fill-current  ? 'text-indigo-500' : 'text-slate-600'}`}
                          cx="5.5"
                          cy="5.5"
                          r="4.5"
                        />
                        <circle
                          className={`fill-current  ? 'text-indigo-500' : 'text-slate-600'}`}
                          cx="18.5"
                          cy="18.5"
                          r="4.5"
                        />
                        <circle
                          className={`fill-current  ? 'text-indigo-300' : 'text-slate-400'}`}
                          cx="5.5"
                          cy="18.5"
                          r="4.5"
                        />
                      </svg>
                      Dashboard</Link>
                    </div>
                  </div>
                  {user.role != "client" && 
                  <>
                    <div className="m-1  sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                      <div className="flex flex-col ">
                        <Link to={`/credit-report/${id}`} className={`inline-flex  justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/credit-report/${id}`)}`}>
                          <svg className="shrink-0 h-5 w-5 me-1" viewBox="0 0 24 24">
                            <path
                              className={`fill-current 'text-slate-400'}`}
                              d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z"
                            />
                            <path
                              className={`fill-current 'text-slate-700'}`}
                              d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z"
                            />
                            <path
                              className={`fill-current 'text-slate-600'}`}
                              d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z"
                            />
                          </svg>
                          Import Report</Link>
                        <span className="text-xs text-slate-400 mt-1 text-center">Step 1</span>
                      </div>
                    </div>
                    <div className="m-1 sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                      <div className="flex flex-col ">
                        <Link to={`/credit-report-list/${id}`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/credit-report-list/${id}`)}`}>
                          <svg className="shrink-0 h-5 w-5 me-1" viewBox="0 0 24 24">
                            <path
                              className={`fill-current  'text-slate-600'}`}
                              d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                            />
                            <path
                              className={`fill-current  'text-slate-400'}`}
                              d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                            />
                          </svg>
                          Audit Wizard</Link>
                        <span className="text-xs text-slate-400 mt-1 text-center">Step 2</span>
                      </div>
                    </div>
                    {latestDocIdFromAws && latestDocIdFromAws !== "undefined" &&
                      <>
                        <div className="m-1  sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                          <div className="flex flex-col">
                            <button onClick={() => getLatestIdOfAwsDataAndNavigate()} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/inquiry/${id}/${latestDocIdFromAws?._id}`)}`}>
                              <svg className="shrink-0 h-5 w-5 me-1" viewBox="0 0 24 24">
                                <path
                                  className={`fill-current  'text-slate-600'}`}
                                  d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                                />
                                <path
                                  className={`fill-current  'text-slate-400'}`}
                                  d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                                />
                                <path
                                  className={`fill-current  'text-slate-600'}`}
                                  d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                                />
                                <path
                                  className={`fill-current  'text-slate-400'}`}
                                  d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                                />
                              </svg>

                              Dispute</button>
                            <span className="text-xs text-slate-400 mt-1 text-center">Step 3</span>
                          </div>
                        </div>
                        <div className="m-1 sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                          <div className="flex flex-col ">
                            <Link to={`/dispute/${id}`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/dispute/${id}`)}`}>
                              <svg className="shrink-0 h-5 w-5 me-1" viewBox="0 0 24 24">
                                <path
                                  className={`fill-current  'text-slate-600'}`}
                                  d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                                />
                                <path
                                  className={`fill-current  'text-slate-400'}`}
                                  d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                                />
                                <path
                                  className={`fill-current  'text-slate-600'}`}
                                  d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                                />
                                <path
                                  className={`fill-current  'text-slate-400'}`}
                                  d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                                />
                              </svg>

                              Generate Letters</Link>
                            <span className="text-xs text-slate-400 mt-1 text-center">Step 4</span>
                          </div>
                        </div>
                        <div className="m-1  sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                          <div className="flex flex-col">
                            <Link to={`/send-letter/${id}`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/send-letter/${id}`)}`}>
                              <svg className="shrink-0 h-4 w-6 me-1" viewBox="0 0 24 24">
                                <path
                                  className={`fill-current  text-slate-600}`}
                                  d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                                />
                                <path
                                  className={`fill-current  text-slate-400'}`}
                                  d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                                />
                              </svg>
                              Send Letter</Link>
                            <span className="text-xs text-slate-400 mt-1 text-center">Step 5  </span>
                          </div>
                        </div>
                      </>
                    }
                  </>
                   } 
                </>

              </div>
            </div>
          </div>

        </header>

      }



    </>
  );
}

export default SubHeader;
