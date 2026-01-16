import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchModal from "../components/ModalSearch";
// import Notifications from "../components/DropdownNotifications";
import Notifications from "../components/DropdownUsersNotificationsNew";
import Chats from '../components/DropdownChat'
import Help from "../components/DropdownHelpNew";
import UserMenu from "../components/AgencyDropdownProfile";
import ThemeToggle from "../components/ThemeToggleNew";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import { GET_USER_DETAILS, GET_PLAIN_INFO } from "../API/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
// import site_logo from "../images/consumer_logo.png"
// import white_site_logo from "../images/consumer-law-logo.png";
import sites_logo from "../images/logo-dark-mode.png";
import site_logo from "../images/logo-light-mode.png";
import white_site_logo from "../images/logo-dark-mode.png";

import { useThemeProvider } from '../utils/ThemeContext';
import { useDispatch, useSelector } from "react-redux";
import { GET_APPDETAILS } from "../store/setting/actions";

function AgencyHeader({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const { appDetails } = useSelector(state => state.settings);
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userData, setUserData] = useState("");
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const getId = id !== undefined && id !== '' ? id : user._id;

  const getDetails = async () => {
    let URL = GET_USER_DETAILS(user._id);
    let PLAIN_URL = GET_PLAIN_INFO(user._id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      const email = response.data.UserDetails.email;

      const res = await axios.get(PLAIN_URL, {
        headers: { Authorization: "Bearer " + token },
      });
      const password = res.data;

      Login(email, password);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const isButtonActive = (url) => {
    return location.pathname === url ? ' tm-color' : 'inactive-button-class ';
  };

  const Login = (email, password) => {
    axios
      .post("https://app.consumerlawdispute.com/api/auth/login", {
        email,
        password,
      })
      .then((res) => {
        window.location.href = "https://app.consumerlawdispute.com/dashboard";
      })
      .catch((res) => {
        toast.error(res.response.data.error)
      });
  };


  useEffect(() => {
    getUserData();
    dispatch(GET_APPDETAILS)
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


  return (
    <>

      <nav className="flex items-center sticky top-0 z-30 justify-around flex-wrap p-4 lg:hidden bg-[#080D18]">
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
          >
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-72">
          <a href="https://www.consumerlawdispute.ai/">
          <img src={site_logo} width={120} alt="Logo" />
          </a>
        </div>
        <UserMenu align="right" />

        <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}>
          <hr className="mt-3" />
          <div className="text-sm lg:flex-grow">
            <div className=" items-center space-x-3">
              {
                userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" || userData?.UserDetails?.role === "agency_agent" ?
                  <>

                    <></>
                    {id && id != undefined ?
        
                    <li className="m-1 ms-3">
                      <Link  to={`/dashboard/${id}`} className={`inline-flex items-center justify-center  ${isButtonActive('/dashboard')}`}>
                      Dashboard
                      </Link>
                    </li>
                    :
                    <li className="m-1 ms-3 ">
                      <Link  to={`/dashboard/${user._id}`} className={`inline-flex items-center justify-center  ${isButtonActive('/dashboard')}`}>
                      Dashboard
                      </Link>
                     </li>

                  }
                    {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") &&
                      <li className="m-1 ms-3">
                        <Link to="/clients" className={`inline-flex items-center justify-center  ${isButtonActive('/clients')}`}>
                          Clients</Link>
                      </li>
                    }
                    {(userData?.UserDetails?.plan_name === "4" || userData?.UserDetails?.plan_name === "8" || userData?.UserDetails?.plan_name === "3" || userData?.UserDetails?.plan_name === "7") &&
                      <li className=" m-1 ms-3 ">
                        <Link to="/agents" className={`inline-flex items-center justify-center  ${isButtonActive('/agents')}`} >
                          Agents</Link>
                      </li>
                    }
                    {id !== undefined && id !== '' ?
                      <>
                        {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") &&
                          <>
                            < li className="m-1">
                              <Link to={`/affiliate/${id}`} className={`inline-flex items-center justify-center  ${isButtonActive(`/affiliate/${id}`)}`}>
                                Affiliate
                              </Link>
                            </li>
                          </>
                        }
                        <li className="m-1 m-1 ms-3 ">
                          <Link to={`/letter-generator/${id}`} className={`inline-flex items-center justify-center ${isButtonActive(`/letter-generator/${id}`)}`}
                          >
                            Letter Library
                          </Link>
                        </li>
                        <li className="m-1">
                          <Link
                            to={`/creditors-furnishers/${id}`}
                            className={`inline-flex items-center justify-center ${isButtonActive(`/creditors-furnishers/${id}`)}`}
                          >
                            Creditors / Furnishers
                          </Link>
                        </li>
                      </>
                      :
                      <>
                        {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") &&
                          <li className="m-1">
                            <Link to={`/affiliate/`} className={`inline-flex items-center justify-center  ${isButtonActive(`/affiliate/`)}`}>
                              Affiliate
                            </Link>
                          </li>
                        }
                        <li className="m-1">
                          <Link
                            to={`/letter-generator`}
                            className={`inline-flex items-center justify-center  ${isButtonActive(`/letter-generator`)}`}
                          >
                            Letter Library
                          </Link>
                        </li>
                        <li className="m-1">
                          <Link
                            to={`/creditors-furnishers`}
                            className={`inline-flex items-center justify-center  ${isButtonActive(`/creditors-furnishers`)}`}
                          >

                            Creditors / Furnishers
                          </Link>
                        </li>
                      </>
                    }
                  </>
                  :
                  <>
                    {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") &&
                      <li className="m-1 ms-3 mt-4">
                        <Link to={`/affiliate/`} className={`inline-flex items-center justify-center  ${isButtonActive(`/affiliate/`)}`}>
                          Affiliate
                        </Link>
                      </li>
                    }
                    <li className="m-1">
                      <Link
                        to={`/letter-generator/${user._id}`}
                        className={`inline-flex items-center justify-center  ${isButtonActive(`/letter-generator/${user._id}`)}`}
                      >
                        Letter Library
                      </Link>
                    </li>
                    <li className="m-1">
                      <Link
                        to={`/creditors-furnishers/${user._id}`}
                        className={`inline-flex items-center justify-center ${isButtonActive(`/creditors-furnishers/${user._id}`)}`}
                      >
                        Creditors / Furnishers
                      </Link>
                    </li>
                  </>
              }

              <li className="m-1">
                <Link
                  to={`/consumer-ai`}
                  className={`inline-flex items-center justify-center ${isButtonActive(`/consumer-ai`)}`}
                >
                  ConsumerLaw.ai
                </Link>
              </li>

              <>
              { userData?.UserDetails?.role != 'client' && userData?.UserDetails?.role != 'agency_agent' && 
                <>
                {userData?.UserDetails?.plan_name === "1" || userData?.UserDetails?.plan_name === "5" ?
                  <li>
                    <Link
                      className={`inline-flex items-center justify-center ${isButtonActive(`/plans/${user._id}`)}`}
                      to={`/plans/${user._id}`}
                    >
                      Upgrade Plan
                    </Link>
                  </li>
                  :
                  <li>
                    <Link
                      to={`/plans`}
                      className={`inline-flex items-center justify-center ${isButtonActive(`/plans/`)}`}
                    >
                      Upgrade Plan
                    </Link>
                  </li>
                }
                </>
            }
              </>

              <hr className="mt-4" />
              <div className="flex gap-3 justify-between mt-4 px-5">
                <div>
                  <button
                    className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full  ${searchModalOpen && "bg-slate-200"
                      }`}
                    aria-controls="search-modal"
                  >
                    <span className="sr-only">Search</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="fill-current text-slate-500 dark:text-slate-400"
                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
                      />
                      <path
                        className="fill-current text-slate-400 dark:text-slate-500"
                        d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
                      />
                    </svg>
                  </button>
                  <SearchModal
                    id="search-modal"
                    searchId="search"
                  // modalOpen={searchModalOpen}
                  // setModalOpen={setSearchModalOpen}
                  />
                </div>
                <Notifications align="right" />
                <Help align="right" />
                {/* <ThemeToggle /> */}
              </div>
            </div>
          </div>
        </div>
      </nav >
      <hr />
      <header className="sticky top-0 bg-white dark:bg-[#080D18] z-30 hidden lg:block xl:block" >
        <div className="px-6 py-3  bg-[#080D18]"  >
          <div className="flex items-center justify-between h-16 -mb-px">
            <div className="flex justify-start "> 
                {appDetails && <a href="https://www.consumerlawdispute.ai/" >
                {/* {appDetails?.logo ?
                    <>
                    <img width={170} height={120} src={appDetails?.logo}></img>
                    </>
                    : */}
                <>
                <img width={170} height={120} src={site_logo}></img>
                </>
                </a>}
            </div>
            <div className="flex justify-start">
                <form className=" w-[500px] lg:w-[600px]">
                    <label for="voice-search" className="sr-only">Search</label>
                    <div className="relative">
                    <input
                        type="text"
                        id="voice-search"
                        className="w-full bg-gray-100 border-none text-gray-900 text-sm rounded-full block ps-3 px-1.5  py-2 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
                    <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                        <svg className="w-4 h-4 me-2 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                    </div>

                </form>
            </div>
            <div className="flex justify-between space-x-3">
              <button
                className="text-slate-500 hover:text-slate-600 md:hidden"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="5" width="16" height="2" />
                  <rect x="4" y="11" width="16" height="2" />
                  <rect x="4" y="17" width="16" height="2" />
                </svg>
              </button>
             
              {/* </div>
            <div className="flex items-center space-x-3"> */}


              <Chats/>
              <Notifications align="right" />
              <Help align="right" />
              <ThemeToggle />
              {userData?.UserDetails?.plan_name === "2" || userData?.UserDetails?.plan_name === "6" ?
                <>
                  {id && id != undefined ?
                    <div className="m-1 ">
                      <Link
                        to={`/dashboard/${id}`}
                        className={`inline-flex items-center text-white justify-center  text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/dashboard`)}`}
                      >
                        Dashboard
                      </Link>
                    </div>
                    :
                    <div className="m-1">
                      <Link
                        to={`/dashboard/`}
                        className={`inline-flex items-center text-white  justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/dashboard`)}`}
                      >
                        Dashboard
                      </Link>
                    </div>

                  }
                </>
                :
                <div className="m-1">
                  <Link
                    to={`/dashboard/${user._id}`}
                    className={`inline-flex items-center justify-center  text-white text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/dashboard/${user._id}`)}`}
                  >
                    Dashboard
                  </Link>
                </div>
              }
              {/* <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" /> */}
              <UserMenu align="right" />
            </div>
          </div>
        </div>
      </header >
      <div className="md:hidden">
        <SubHeader />
      </div>
    </>
  );
}

export default AgencyHeader;
