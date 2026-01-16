import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchModal from "../components/ModalSearch";
// import Notifications from "../components/DropdownNotifications";
import Notifications from "../components/DropdownUsersNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";
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

function Header({ sidebarOpen, setSidebarOpen }) {
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

      <nav className="flex items-center justify-between flex-wrap p-4 lg:hidden bg-white">
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
          <img src={sites_logo} width={120} alt="Logo" />
        </div>
        <UserMenu align="right" />

        <div
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
        >
          <hr className="mt-3" />

          <div className="text-sm lg:flex-grow">

            <div className=" items-center space-x-3">
              {
                userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" || userData?.UserDetails?.role === "agency_agent" ?
                  <>
                    <li className="m-1 ms-3 mt-4">
                      <Link to="/clients" className={`inline-flex items-center justify-center  ${isButtonActive('/clients')}`}>
                        
                        Clients</Link>
                    </li>


                    {(userData?.UserDetails?.plan_name === "4" || userData?.UserDetails?.plan_name === "8" || userData?.UserDetails?.plan_name === "3" || userData?.UserDetails?.plan_name === "7") &&
                      <li>
                        <Link to="/agents" className={`inline-flex items-center justify-center  ${isButtonActive('/agents')}`} >
                          Agents</Link>
                      </li>
                    }

                    {id !== undefined && id !== '' ?
                      <>
                        <li className="m-1">
                          <Link to={`/affiliate/${id}`} className={`inline-flex items-center justify-center  ${isButtonActive(`/affiliate/${id}`)}`}>
                            Affiliate 
                          </Link>
                        </li>
                        <li className="m-1">
                          <Link
                            to={`/letter-generator/${id}`}
                            className={`inline-flex items-center justify-center ${isButtonActive(`/letter-generator/${id}`)}`}
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
                        {userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" &&
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
                    {userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" &&
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
                  to={`/consumer-ai-box`}
                  className={`inline-flex items-center justify-center ${isButtonActive(`/consumer-ai-box`)}`}
                >
                  ConsumerLaw.ai
                </Link>
              </li>
              <hr className="mt-4" />
              <div className="flex gap-3 justify-between mt-4">
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
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <hr />
      <header className="sticky top-0 bg-white dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-30  hidden  lg:block xl:block" >
        <div className="px-4 sm:px-6 lg:px-8"  >
          <div className="flex items-center justify-between h-16 -mb-px">
            {appDetails && <a href="https://www.consumerlawdispute.ai/" >
              {appDetails?.logo ?
                <>
                  <img width={170} height={120} src={appDetails?.logo}></img>
                </>
                :
                <>
                  {currentTheme === 'light' ?
                    <img width={170} height={120} src={white_site_logo}></img> :

                    <img width={170} height={120} src={site_logo}></img>
                  }
                </>}

            </a>}
            <div className="flex">
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
            </div>
            <div className="flex items-center space-x-3">

              {userData?.UserDetails?.plan_name === "2" || userData?.UserDetails?.plan_name === "6" || userData?.UserDetails?.plan_name === "4" || userData?.UserDetails?.plan_name === "8" || userData?.UserDetails?.plan_name === "3" || userData?.UserDetails?.plan_name === "7" || userData?.UserDetails?.role === "agency_agent" ?
                <>
                  <div className="m-1">
                    <Link to="/clients" className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive('/clients')}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-rocket tm-color" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
                        <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
                        <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                      </svg>
                      Clients</Link>



                  </div>
                  {(userData?.UserDetails?.plan_name === "4" || userData?.UserDetails?.plan_name === "8" || userData?.UserDetails?.plan_name === "3" || userData?.UserDetails?.plan_name === "7") &&
                    <Link to="/agents" className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive('/agents')}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users-group me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                        <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                        <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                      </svg>
                      Agents</Link>
                  }
                  {id !== undefined && id !== '' ?
                    <>
                      {userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" &&
                        <div className="m-1">
                          <Link to={`/affiliate/${id}`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/${id}`)}`}>
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
                            Affiliate
                          </Link>
                        </div>
                      }
                      <div className="m-1">
                        <Link
                          to={`/letter-generator/${id}`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/letter-generator/${id}`)}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-text" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                            <path d="M9 9l1 0" />
                            <path d="M9 13l6 0" />
                            <path d="M9 17l6 0" />
                          </svg>
                          Letter Library
                        </Link>
                      </div>
                      <div className="m-1">
                        <Link
                          to={`/creditors-furnishers/${id}`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers/${id}`)}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-building-bank me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 21l18 0" />
                            <path d="M3 10l18 0" />
                            <path d="M5 6l7 -3l7 3" />
                            <path d="M4 10l0 11" />
                            <path d="M20 10l0 11" />
                            <path d="M8 14l0 3" />
                            <path d="M12 14l0 3" />
                            <path d="M16 14l0 3" />
                          </svg>
                          Creditors / Furnishers
                        </Link>
                      </div>
                    </>
                    :
                    <>
                      {userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" &&
                        <div className="m-1">
                          <Link to={`/affiliate/`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/`)}`}>
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
                            Affiliate
                          </Link>
                        </div>
                      }
                      <div className="m-1">
                        <Link
                          to={`/letter-generator`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/letter-generator`)}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-text" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                            <path d="M9 9l1 0" />
                            <path d="M9 13l6 0" />
                            <path d="M9 17l6 0" />
                          </svg>
                          Letter Library
                        </Link>
                      </div>
                      <div className="m-1">
                        <Link
                          to={`/creditors-furnishers`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers`)}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-building-bank me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 21l18 0" />
                            <path d="M3 10l18 0" />
                            <path d="M5 6l7 -3l7 3" />
                            <path d="M4 10l0 11" />
                            <path d="M20 10l0 11" />
                            <path d="M8 14l0 3" />
                            <path d="M12 14l0 3" />
                            <path d="M16 14l0 3" />
                          </svg>
                          Creditors / Furnishers
                        </Link>
                      </div>
                    </>
                  }
                </>
                :
                <>
                  {userData?.UserDetails?.plan_name !== "1" || userData?.UserDetails?.plan_name !== "5" &&
                    <div className="m-1">
                      <Link to={`/affiliate/`} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/`)}`}>
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
                        Affiliate
                      </Link>
                    </div>
                  }
                  <div className="m-1">
                    <Link
                      to={`/letter-generator/${user._id}`}
                      className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/letter-generator/${user._id}`)}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-text" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        <path d="M9 9l1 0" />
                        <path d="M9 13l6 0" />
                        <path d="M9 17l6 0" />
                      </svg>
                      Letter Library
                    </Link>
                  </div>
                  <div className="m-1">
                    <Link
                      to={`/creditors-furnishers/${user._id}`}
                      className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers/${user._id}`)}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-building-bank me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 21l18 0" />
                        <path d="M3 10l18 0" />
                        <path d="M5 6l7 -3l7 3" />
                        <path d="M4 10l0 11" />
                        <path d="M20 10l0 11" />
                        <path d="M8 14l0 3" />
                        <path d="M12 14l0 3" />
                        <path d="M16 14l0 3" />
                      </svg>
                      Creditors / Furnishers
                    </Link>
                  </div>
                </>
              }

              {/* <div>
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full ml-3 ${searchModalOpen && "bg-slate-200"
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
              </div> */}
              <Notifications align="right" />
              <Help align="right" />
              <ThemeToggle />

              {/* {userData?.UserDetails?.role === "agent" && */}
              <>
                {userData?.UserDetails?.plan_name === "1" || userData?.UserDetails?.plan_name === "5" ?
                  <>
                    {userData?.UserDetails?.plan_name === "2" || userData?.UserDetails?.plan_name === "6" ?
                      <div className="m-1">
                        <Link
                          to={`/plans`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/plans`)}`}
                        >
                          Upgrade Plan
                        </Link>
                      </div>
                      :
                      <div className="m-1">
                        <Link
                          to={`/plans/${user._id}`}
                          className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/plans/${user._id}`)}`}
                        >
                          Upgrade Plan
                        </Link>
                      </div>

                    }
                  </>
                  :
                  ""
                }
              </>
              {/* } */}
              {userData?.UserDetails?.is_trial != "true" &&
                <>
                  {userData?.UserDetails?.plan_name === "2" || userData?.UserDetails?.plan_name === "6" ?
                    <>
                      {id && id != undefined ?
                        <div className="m-1">
                          <Link
                            to={`/consumer-ai-box/${id}`}
                            className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai-box`)}`}
                          >
                            ConsumerLaw.ai
                          </Link>
                        </div>
                        :
                        <div className="m-1">
                          <Link
                            to={`/consumer-ai-box/`}
                            className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai-box`)}`}
                          >
                            ConsumerLaw.ai
                          </Link>
                        </div>

                      }
                    </>
                    :
                    <div className="m-1">
                      <Link
                        to={`/consumer-ai-box/${user._id}`}
                        className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai-box/${user._id}`)}`}
                      >
                        ConsumerLaw.ai
                      </Link>
                    </div>
                  }
                </>
              }
              <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" />
              <UserMenu align="right" />
            </div>
          </div>
        </div>
      </header>
      {/* <SubHeader /> */}
    </>
  );
}

export default Header;
