import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { GET_USER_DETAILS } from "../API/api.js";
import axios from 'axios';
import SubHeader from "../components/SubHeader";
const SubNavbar = () => {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id } = useParams();
  const [userData, setUserData] = useState("");
  const [setLoader, setsetLoader] = useState(false);
  const location = useLocation();
  const showSubHeader = location.pathname !== `/subscription/${id}` && location.pathname !== `/plans/${id}`;
  const isButtonActive = (url) => {
    if (location.pathname.includes("/agency-dashboard/65c0a8dc65d2c3347e79d57e")) {
      // Code to run if URL contains "/dashboard/"
      // For example, console.log("Dashboard URL is active");
      return location.pathname === url ? 'active-dash-btn' : 'inactive-btn';
    } else {
      return location.pathname === url ? 'active-btn' : 'inactive-btn';
    }
  };

  const getUserData = async () => {
    setsetLoader(true);
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL, { headers: { "Authorization": "Bearer " + token } });
      setUserData(response?.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      console.log("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div className="px-1 sm:px-8 lg:px-8  py-4 w-full bg-[#F8F9F9]">
        {/* Welcome banner */}
        <div className="sm:flex sm:items-center sm:justify-center ">
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          </div>
          <div class="flex flex-row flex-wrap">
            <>
              {(user?.plan_name === "1" || user?.plan_name === "5") &&
                <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                    <Link to={`/dashboard/${id || user?._id}`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/home`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.125 8.28125V17.5C3.125 17.6658 3.19085 17.8247 3.30806 17.9419C3.42527 18.0592 3.58424 18.125 3.75 18.125H7.5V12.8125C7.5 12.5639 7.59877 12.3254 7.77459 12.1496C7.9504 11.9738 8.18886 11.875 8.4375 11.875H11.5625C11.8111 11.875 12.0496 11.9738 12.2254 12.1496C12.4012 12.3254 12.5 12.5639 12.5 12.8125V18.125H16.25C16.4158 18.125 16.5747 18.0592 16.6919 17.9419C16.8092 17.8247 16.875 17.6658 16.875 17.5V8.28125" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18.75 10L10.4254 2.0313C10.2301 1.82505 9.77344 1.82271 9.57461 2.0313L1.25 10M15.625 6.99224V2.50005H13.75V5.19536" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="ml-2">Dashboard</span>
                    </Link>
                  </div>
                </div>
              }
            </>
            {!(user?.plan_name === "1" || user?.plan_name === "5") &&
              <>
                <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                    <Link to={`/home`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/home`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.125 8.28125V17.5C3.125 17.6658 3.19085 17.8247 3.30806 17.9419C3.42527 18.0592 3.58424 18.125 3.75 18.125H7.5V12.8125C7.5 12.5639 7.59877 12.3254 7.77459 12.1496C7.9504 11.9738 8.18886 11.875 8.4375 11.875H11.5625C11.8111 11.875 12.0496 11.9738 12.2254 12.1496C12.4012 12.3254 12.5 12.5639 12.5 12.8125V18.125H16.25C16.4158 18.125 16.5747 18.0592 16.6919 17.9419C16.8092 17.8247 16.875 17.6658 16.875 17.5V8.28125" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18.75 10L10.4254 2.0313C10.2301 1.82505 9.77344 1.82271 9.57461 2.0313L1.25 10M15.625 6.99224V2.50005H13.75V5.19536" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="ml-2">Home</span>
                    </Link>
                  </div>
                </div>
                <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                    <Link to={`/agency-dashboard/`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/agency-dashboard/`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.96875 1.875H2.65625C2.22478 1.875 1.875 2.22478 1.875 2.65625V7.96875C1.875 8.40022 2.22478 8.75 2.65625 8.75H7.96875C8.40022 8.75 8.75 8.40022 8.75 7.96875V2.65625C8.75 2.22478 8.40022 1.875 7.96875 1.875Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.3438 1.875H12.0312C11.5998 1.875 11.25 2.22478 11.25 2.65625V7.96875C11.25 8.40022 11.5998 8.75 12.0312 8.75H17.3438C17.7752 8.75 18.125 8.40022 18.125 7.96875V2.65625C18.125 2.22478 17.7752 1.875 17.3438 1.875Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.96875 11.25H2.65625C2.22478 11.25 1.875 11.5998 1.875 12.0312V17.3438C1.875 17.7752 2.22478 18.125 2.65625 18.125H7.96875C8.40022 18.125 8.75 17.7752 8.75 17.3438V12.0312C8.75 11.5998 8.40022 11.25 7.96875 11.25Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.3438 11.25H12.0312C11.5998 11.25 11.25 11.5998 11.25 12.0312V17.3438C11.25 17.7752 11.5998 18.125 12.0312 18.125H17.3438C17.7752 18.125 18.125 17.7752 18.125 17.3438V12.0312C18.125 11.5998 17.7752 11.25 17.3438 11.25Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span className="ml-2">{userData?.UserDetails?.role === "agent" ? "Agency Dashboard" : "Agent Dashboard"}</span>
                    </Link>
                  </div>
                </div>


                <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                    <Link to={`/leads`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6] px-3 py-2  shadow-sm text-black ${isButtonActive(`/leads`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className='text' xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7035 6.5625C15.5891 8.15117 14.4106 9.375 13.1254 9.375C11.8403 9.375 10.6598 8.15156 10.5473 6.5625C10.4301 4.90977 11.5774 3.75 13.1254 3.75C14.6735 3.75 15.8207 4.93984 15.7035 6.5625Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.1248 11.875C10.5791 11.875 8.1311 13.1395 7.51781 15.602C7.43656 15.9277 7.64086 16.25 7.97563 16.25H18.2745C18.6092 16.25 18.8123 15.9277 18.7323 15.602C18.119 13.1 15.6709 11.875 13.1248 11.875Z" stroke="black" stroke-width="1" stroke-miterlimit="10" />
                        <path d="M7.81312 7.26328C7.72171 8.53203 6.76937 9.53125 5.7428 9.53125C4.71624 9.53125 3.76234 8.53242 3.67249 7.26328C3.57913 5.94336 4.50609 5 5.7428 5C6.97952 5 7.90648 5.96758 7.81312 7.26328Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.04726 11.9531C7.34218 11.6301 6.56562 11.5059 5.74257 11.5059C3.71132 11.5059 1.75429 12.5156 1.26405 14.4824C1.1996 14.7426 1.36288 15 1.63007 15H6.01601" stroke="black" stroke-width="1" stroke-miterlimit="10" stroke-linecap="round" />
                      </svg>
                      <span className="ml-2">Leads</span>
                    </Link>
                  </div>
                </div>

                <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                    <Link to={`/clients`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6] px-3 py-2  shadow-sm text-black ${isButtonActive(`/clients`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className='text' xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7035 6.5625C15.5891 8.15117 14.4106 9.375 13.1254 9.375C11.8403 9.375 10.6598 8.15156 10.5473 6.5625C10.4301 4.90977 11.5774 3.75 13.1254 3.75C14.6735 3.75 15.8207 4.93984 15.7035 6.5625Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.1248 11.875C10.5791 11.875 8.1311 13.1395 7.51781 15.602C7.43656 15.9277 7.64086 16.25 7.97563 16.25H18.2745C18.6092 16.25 18.8123 15.9277 18.7323 15.602C18.119 13.1 15.6709 11.875 13.1248 11.875Z" stroke="black" stroke-width="1" stroke-miterlimit="10" />
                        <path d="M7.81312 7.26328C7.72171 8.53203 6.76937 9.53125 5.7428 9.53125C4.71624 9.53125 3.76234 8.53242 3.67249 7.26328C3.57913 5.94336 4.50609 5 5.7428 5C6.97952 5 7.90648 5.96758 7.81312 7.26328Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.04726 11.9531C7.34218 11.6301 6.56562 11.5059 5.74257 11.5059C3.71132 11.5059 1.75429 12.5156 1.26405 14.4824C1.1996 14.7426 1.36288 15 1.63007 15H6.01601" stroke="black" stroke-width="1" stroke-miterlimit="10" stroke-linecap="round" />
                      </svg>
                      <span className="ml-2">Clients</span>
                    </Link>
                  </div>
                </div>
              </>
            }
            {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") && !(userData?.UserDetails?.plan_name == "2" || userData?.UserDetails?.plan_name == "6") && userData?.UserDetails?.role === "agent" ?
              <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                <div className='flex flex-col'>
                  <Link to={`/agents`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6] px-3 py-2  shadow-sm text-black ${isButtonActive(`/agents`)}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className='text' xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.7035 6.5625C15.5891 8.15117 14.4106 9.375 13.1254 9.375C11.8403 9.375 10.6598 8.15156 10.5473 6.5625C10.4301 4.90977 11.5774 3.75 13.1254 3.75C14.6735 3.75 15.8207 4.93984 15.7035 6.5625Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M13.1248 11.875C10.5791 11.875 8.1311 13.1395 7.51781 15.602C7.43656 15.9277 7.64086 16.25 7.97563 16.25H18.2745C18.6092 16.25 18.8123 15.9277 18.7323 15.602C18.119 13.1 15.6709 11.875 13.1248 11.875Z" stroke="black" stroke-width="1" stroke-miterlimit="10" />
                      <path d="M7.81312 7.26328C7.72171 8.53203 6.76937 9.53125 5.7428 9.53125C4.71624 9.53125 3.76234 8.53242 3.67249 7.26328C3.57913 5.94336 4.50609 5 5.7428 5C6.97952 5 7.90648 5.96758 7.81312 7.26328Z" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.04726 11.9531C7.34218 11.6301 6.56562 11.5059 5.74257 11.5059C3.71132 11.5059 1.75429 12.5156 1.26405 14.4824C1.1996 14.7426 1.36288 15 1.63007 15H6.01601" stroke="black" stroke-width="1" stroke-miterlimit="10" stroke-linecap="round" />
                    </svg>
                    <span className="ml-2">Agents </span>
                  </Link>
                </div>
              </div>
              :
              <> </>
            }

            {/* <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                      <Link to={`/agency-dashboard/2`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6] px-3 py-2  shadow-sm text-black ${isButtonActive(`/agency-dashboard/2`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9375 3.75H4.0625C2.85438 3.75 1.875 4.72938 1.875 5.9375V14.0625C1.875 15.2706 2.85438 16.25 4.0625 16.25H15.9375C17.1456 16.25 18.125 15.2706 18.125 14.0625V5.9375C18.125 4.72938 17.1456 3.75 15.9375 3.75Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.875 7.5H18.125M5 11.7188H6.875V12.5H5V11.7188Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                      </svg>
                        <span className="ml-2">Billings & Payments</span>
                      </Link>
                    </div>
                </div> */}

            <div className='w-1/2 sm:w-auto  px-1 mb-2'>
              <div className='flex flex-col'>
                <Link to={`/letter-generator`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/letter-generator`)}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9173 13.333C12.4959 13.7426 10.834 14.8328 10.834 15.4163M10.834 15.4163C10.834 15.9998 12.4959 17.0901 12.9173 17.4997M10.834 15.4163H17.5007" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.16667 18.3337H8.93942C6.22172 18.3337 4.86288 18.3337 3.91923 17.6688C3.64885 17.4783 3.40882 17.2524 3.20642 16.9979C2.5 16.1097 2.5 14.8308 2.5 12.2731V10.1518C2.5 7.68253 2.5 6.44788 2.89078 5.46178C3.51901 3.87651 4.84762 2.62606 6.53197 2.03478C7.57969 1.66699 8.8915 1.66699 11.5152 1.66699C13.0144 1.66699 13.764 1.66699 14.3627 1.87716C15.3252 2.21503 16.0843 2.92958 16.4433 3.83544C16.6667 4.39893 16.6667 5.10444 16.6667 6.51548V10.8337" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M2.5 10.0003C2.5 8.46624 3.74365 7.22255 5.27778 7.22255C5.8326 7.22255 6.4867 7.31977 7.02614 7.17523C7.50543 7.04679 7.8798 6.67243 8.00823 6.19313C8.15278 5.65369 8.05556 4.99959 8.05556 4.44477C8.05556 2.91064 9.29925 1.66699 10.8333 1.66699" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="ml-2">Letter Library</span>
                </Link>
              </div>
            </div>

            <div className='w-1/2 sm:w-auto  px-1 mb-2'>
              <div className='flex flex-col'>
                <Link to={`/affiliate`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/affiliate`)}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.99935 14.1667C11.8403 14.1667 13.3327 12.6743 13.3327 10.8333C13.3327 8.99238 11.8403 7.5 9.99935 7.5C8.1584 7.5 6.66602 8.99238 6.66602 10.8333C6.66602 12.6743 8.1584 14.1667 9.99935 14.1667Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.0007 5.00033C10.9211 5.00033 11.6673 4.25413 11.6673 3.33366C11.6673 2.41318 10.9211 1.66699 10.0007 1.66699C9.08018 1.66699 8.33398 2.41318 8.33398 3.33366C8.33398 4.25413 9.08018 5.00033 10.0007 5.00033Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.33268 18.3333C4.25316 18.3333 4.99935 17.5871 4.99935 16.6667C4.99935 15.7462 4.25316 15 3.33268 15C2.41221 15 1.66602 15.7462 1.66602 16.6667C1.66602 17.5871 2.41221 18.3333 3.33268 18.3333Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6667 18.3333C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667C18.3333 15.7462 17.5871 15 16.6667 15C15.7462 15 15 15.7462 15 16.6667C15 17.5871 15.7462 18.3333 16.6667 18.3333Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.0007 7.5V5M15.4173 15.4167L12.5007 13.3333M4.58398 15.4167L7.50065 13.3333" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="ml-2">Affliates</span>
                </Link>
              </div>
            </div>

            {/* <div className='w-1/2 sm:w-auto  px-1 mb-2'>
                  <div className='flex flex-col'>
                      <Link to={`/agency-dashboard/5`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/agency-dashboard/5`)}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.95884 11.0106C1.66466 9.09618 1.51757 8.13904 1.87949 7.2905C2.24141 6.44195 3.04437 5.86137 4.6503 4.70023L5.85017 3.83268C7.84792 2.38824 8.84677 1.66602 9.99935 1.66602C11.1519 1.66602 12.1508 2.38824 14.1485 3.83268L15.3484 4.70023C16.9543 5.86137 17.7573 6.44195 18.1192 7.2905C18.4811 8.13904 18.334 9.09618 18.0398 11.0106L17.789 12.643C17.3719 15.3568 17.1634 16.7137 16.1902 17.5232C15.2169 18.3327 13.7941 18.3327 10.9483 18.3327H9.05035C6.20462 18.3327 4.78177 18.3327 3.80852 17.5232C2.83526 16.7137 2.62674 15.3568 2.20971 12.643L1.95884 11.0106Z" stroke="#080D18" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M9.375 11.041C10.364 12.03 11.6667 13.0351 11.6667 13.0351L13.4524 11.2493C13.4524 11.2493 12.4473 9.94668 11.4583 8.95768C10.4693 7.96867 9.16667 6.96363 9.16667 6.96363L7.38095 8.74935C7.38095 8.74935 8.386 10.052 9.375 11.041ZM9.375 11.041L6.25 14.166M13.75 10.9518L11.3691 13.3327M9.46425 6.66602L7.08333 9.04693" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                        <span className="ml-2">dispute</span>
                      </Link>
                    </div>
                  </div> */}

            {/* <div className='w-1/2 sm:w-auto  px-1 mb-2'>
              <div className='flex flex-col'>
                <Link to={`/agency-dashboard/6`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/agency-dashboard/6`)}`}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6983 8.00894L11.2241 9.42061C11.0481 9.95716 10.7485 10.4449 10.3494 10.8444C9.95033 11.2439 9.46297 11.544 8.9266 11.7206L7.4991 12.1948C7.45084 12.2104 7.40877 12.2409 7.37893 12.2819C7.3491 12.323 7.33302 12.3724 7.33302 12.4231C7.33302 12.4738 7.3491 12.5233 7.37893 12.5643C7.40877 12.6053 7.45084 12.6358 7.4991 12.6514L8.9266 13.1256C9.45797 13.3023 9.94077 13.6006 10.3366 13.9967C10.7324 14.3928 11.0303 14.8758 11.2066 15.4073L11.6799 16.8364C11.6951 16.8851 11.7255 16.9277 11.7665 16.9579C11.8076 16.9881 11.8573 17.0044 11.9083 17.0044C11.9593 17.0044 12.0089 16.9881 12.05 16.9579C12.0911 16.9277 12.1214 16.8851 12.1366 16.8364L12.6283 15.4248C12.8048 14.8935 13.1027 14.4107 13.4983 14.0147C13.8939 13.6186 14.3764 13.3202 14.9074 13.1431L16.3358 12.6689C16.384 12.6533 16.4261 12.6228 16.4559 12.5818C16.4858 12.5408 16.5019 12.4913 16.5019 12.4406C16.5019 12.3899 16.4858 12.3405 16.4559 12.2994C16.4261 12.2584 16.384 12.2279 16.3358 12.2123L14.9258 11.7206C14.3892 11.5444 13.9016 11.2444 13.5025 10.8449C13.1033 10.4453 12.8039 9.95738 12.6283 9.42061L12.1541 7.99144C12.1408 7.95613 12.1194 7.92444 12.0915 7.89894C12.0637 7.87343 12.0303 7.85481 11.994 7.8446C11.9576 7.83438 11.9194 7.83284 11.8824 7.84011C11.8454 7.84738 11.8105 7.86325 11.7808 7.88644C11.7409 7.91781 11.7121 7.96015 11.6983 8.00894ZM4.67327 3.91477L4.3291 4.94061C4.20102 5.33088 3.983 5.68559 3.69262 5.97611C3.40224 6.26663 3.04765 6.48483 2.65744 6.61311L1.6191 6.95811C1.58439 6.96981 1.55423 6.9921 1.53286 7.02185C1.51149 7.05161 1.5 7.08731 1.5 7.12394C1.5 7.16057 1.51149 7.19628 1.53286 7.22603C1.55423 7.25578 1.58439 7.27807 1.6191 7.28977L2.65744 7.63561C3.04381 7.76396 3.39491 7.9807 3.68279 8.26858C3.97068 8.55647 4.18742 8.90757 4.31577 9.29394L4.65994 10.3339C4.67164 10.3687 4.69393 10.3988 4.72368 10.4202C4.75344 10.4416 4.78914 10.453 4.82577 10.453C4.8624 10.453 4.89811 10.4416 4.92786 10.4202C4.95761 10.3988 4.9799 10.3687 4.9916 10.3339L5.34994 9.30727C5.47858 8.92106 5.69542 8.57011 5.98326 8.28227C6.27111 7.99442 6.62205 7.77758 7.00827 7.64894L8.04577 7.30311C8.08048 7.29141 8.11065 7.26911 8.13201 7.23936C8.15338 7.20961 8.16488 7.1739 8.16488 7.13727C8.16488 7.10065 8.15338 7.06494 8.13201 7.03519C8.11065 7.00544 8.08048 6.98314 8.04577 6.97144L7.02077 6.61311C6.63059 6.48495 6.27603 6.26678 5.98578 5.97624C5.69552 5.68569 5.4777 5.33092 5.34994 4.94061L5.00494 3.90144C4.99191 3.86713 4.96842 3.83778 4.9378 3.81755C4.90718 3.79732 4.87098 3.78723 4.8343 3.7887C4.79763 3.79017 4.76235 3.80314 4.73345 3.82577C4.70456 3.84839 4.6835 3.87953 4.67327 3.91477ZM11.2141 1.06311L11.0416 1.57644C10.9777 1.77158 10.8689 1.94897 10.7238 2.09431C10.5788 2.23964 10.4016 2.34884 10.2066 2.41311L9.68744 2.58561C9.67444 2.58984 9.66262 2.59708 9.65295 2.60675C9.64328 2.61642 9.63604 2.62824 9.63182 2.64124C9.62759 2.65424 9.6265 2.66806 9.62864 2.68156C9.63077 2.69507 9.63607 2.70788 9.6441 2.71894C9.65471 2.73413 9.66989 2.74552 9.68744 2.75144L10.2066 2.92394C10.3998 2.98812 10.5753 3.09649 10.7193 3.24043C10.8632 3.38437 10.9716 3.55992 11.0358 3.75311L11.2074 4.27311C11.2131 4.29077 11.2242 4.30617 11.2392 4.31711C11.2542 4.32804 11.2722 4.33393 11.2908 4.33393C11.3093 4.33393 11.3274 4.32804 11.3424 4.31711C11.3573 4.30617 11.3685 4.29077 11.3741 4.27311L11.5524 3.75977C11.6168 3.56668 11.7252 3.39122 11.8691 3.24731C12.0131 3.10339 12.1885 2.99496 12.3816 2.93061L12.9008 2.75811C12.9184 2.75245 12.9338 2.74134 12.9448 2.72636C12.9557 2.71138 12.9616 2.69332 12.9616 2.67477C12.9616 2.65623 12.9557 2.63817 12.9448 2.62319C12.9338 2.60821 12.9184 2.59709 12.9008 2.59144L12.3883 2.41311C12.1931 2.34902 12.0157 2.23988 11.8705 2.09453C11.7253 1.94919 11.6163 1.7717 11.5524 1.57644L11.3799 1.05644C11.3734 1.03929 11.3617 1.02461 11.3464 1.0145C11.3311 1.00438 11.313 0.999334 11.2946 1.00007C11.2763 1.00081 11.2586 1.00729 11.2442 1.0186C11.2297 1.02992 11.2192 1.04548 11.2141 1.06311Z" stroke="#080D18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="ml-2">Audit wizard</span>
                </Link>
              </div>
            </div> */}

            <div className='w-1/2 sm:w-auto  px-1 mb-2'>
              <div className='flex flex-col'>
                <Link to={`/creditors-furnishers`} className={`inline-flex items-center text-xs md:text-[16px] font-medium leading-5 justify-left bg-[#F4F5F6]  px-3 py-2  shadow-sm text-black ${isButtonActive(`/creditors-furnishers`)}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.51535 8.46827C7.22199 8.17576 6.82462 8.01151 6.41035 8.01151C5.99608 8.01151 5.59871 8.17576 5.30535 8.46827L5.03035 8.74327C4.61417 9.15621 4.28605 9.64926 4.06583 10.1926C3.84561 10.736 3.73786 11.3183 3.7491 11.9045C3.7641 12.8495 4.0741 13.742 4.6366 14.4783L2.05785 17.057C1.94066 17.1744 1.87488 17.3335 1.875 17.4993C1.87512 17.6652 1.94111 17.8242 2.05847 17.9414C2.17583 18.0586 2.33494 18.1244 2.50079 18.1242C2.66664 18.1241 2.82566 18.0581 2.94285 17.9408L5.53035 15.3533C6.27091 15.8877 7.16209 16.1731 8.07535 16.1683C9.24785 16.1683 10.4353 15.7145 11.3303 14.8183L11.4941 14.6545C11.7866 14.3612 11.9509 13.9638 11.9509 13.5495C11.9509 13.1352 11.7866 12.7379 11.4941 12.4445L7.5166 8.46702L7.51535 8.46827ZM10.6091 13.772L10.4466 13.9358C9.20285 15.1795 7.20035 15.2595 5.98535 14.1133C5.67919 13.8275 5.43407 13.4827 5.26478 13.0997C5.09549 12.7166 5.00554 12.3033 5.00035 11.8845C4.98785 11.032 5.31285 10.2295 5.91535 9.62702L6.19035 9.35202C6.2193 9.32285 6.25378 9.29975 6.29177 9.28408C6.32976 9.26841 6.3705 9.26049 6.4116 9.26077C6.49285 9.26077 6.5716 9.29077 6.63285 9.35202L10.6103 13.3295C10.6395 13.3585 10.6625 13.393 10.6783 13.431C10.694 13.469 10.7022 13.5097 10.7022 13.5508C10.7022 13.5919 10.694 13.6326 10.6783 13.6705C10.6625 13.7085 10.6395 13.743 10.6103 13.772H10.6091ZM17.9416 2.05702C17.8244 1.93985 17.6655 1.87402 17.4997 1.87402C17.334 1.87402 17.1751 1.93985 17.0578 2.05702L14.4703 4.64452C12.7578 3.39577 10.2578 3.59077 8.67035 5.17952L8.50785 5.34327C8.21534 5.63663 8.05109 6.034 8.05109 6.44827C8.05109 6.86253 8.21534 7.2599 8.50785 7.55327L12.4841 11.5308C12.7878 11.8358 13.1878 11.9883 13.5891 11.9883C13.9903 11.9883 14.3903 11.8358 14.6941 11.5308L14.9691 11.2558C15.3853 10.8428 15.7134 10.3498 15.9336 9.80641C16.1538 9.26306 16.2616 8.68069 16.2503 8.09452C16.239 7.16348 15.9278 6.2609 15.3628 5.52077L17.9416 2.94202C18.0585 2.82444 18.1242 2.66535 18.1242 2.49951C18.1242 2.33368 18.0585 2.17459 17.9416 2.05702ZM14.0841 10.3708L13.8091 10.6458C13.7801 10.6749 13.7456 10.698 13.7076 10.7137C13.6697 10.7295 13.629 10.7376 13.5878 10.7376C13.5467 10.7376 13.506 10.7295 13.4681 10.7137C13.4301 10.698 13.3956 10.6749 13.3666 10.6458L9.3891 6.66827C9.36 6.63924 9.33691 6.60475 9.32115 6.56679C9.3054 6.52882 9.29729 6.48812 9.29729 6.44702C9.29729 6.40591 9.3054 6.36521 9.32115 6.32724C9.33691 6.28928 9.36 6.25479 9.3891 6.22577L9.55285 6.06202C10.1814 5.43202 11.0341 5.07691 11.9241 5.07452C12.6866 5.07452 13.4378 5.34202 14.0128 5.88452C14.6353 6.46952 14.9841 7.26077 14.9978 8.11327C15.0059 8.53164 14.9291 8.94732 14.7723 9.33528C14.6155 9.72324 14.3818 10.0755 14.0853 10.3708" fill="#080D18" />
                  </svg>
                  <span className="ml-2">Creditors & Furnishers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        {showSubHeader &&
          <SubHeader />
        }
      </div>
    </>
  )
}

export default SubNavbar