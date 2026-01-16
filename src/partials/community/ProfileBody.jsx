import React, { useState, useEffect, useRef } from 'react';
import ExplorePrompt1 from '../../pages/component/ExplorePrompt1';
import ExplorePrompt2 from '../../pages/component/ExplorePrompt2';
import ExplorePrompt3 from '../../pages/component/ExplorePrompt3';
import ExplorePrompt4 from '../../pages/component/ExplorePrompt4';
import ai_robot_img from "../../images/Ai-robert.png";
import { OPEN_AI_CHAT, GET_ALL_OPEN_AI_CHAT, GET_CHAT_ID_WITH_DATA, DELETE_USER_CHAT_THREAD } from "../../API/api"
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { useParams } from "react-router-dom";
import moment from 'moment';
import ModalBasic from '../../components/ModalBasic';
import MondalBasicOne from '../../components/ModalBasicOne';
import mike_img from '../../images/mike.png';
import stop_mike_img from "../../images/stop_mike_img.png"
import UserAvatar from '../../images/userImage1.png';
import ai_head from '../../images/ai-head.png';
import copied_img from "../../images/copied-icon.png";
import arrowImg from "../../images/dashboard_img/arrow.png";

function ProfileBody({
  profileSidebarOpen,
  setProfileSidebarOpen
}) {

  const [showExplorePrompt1, setShowExplorePrompt1] = useState(false);
  const [showExplorePrompt2, setShowExplorePrompt2] = useState(false);
  const [showExplorePrompt3, setShowExplorePrompt3] = useState(false);
  const [showExplorePrompt4, setShowExplorePrompt4] = useState(false);
  const [MyModalOpen, setMyModalOpen] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteThreadId, setDeleteThreadId] = useState('');

  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const firstName = user?.name?.split(' ')[0];

  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [isChatId, setIsChatId] = useState('');
  const [isOpenAiChat, setIsOpenAiChat] = useState([]);
  const [showAiTyping, setShowAiTyping] = useState(false);
  const [loaderUpload, setloaderUpload] = useState(false);
  const [isChatIdData, setIsChatIdData] = useState([]);
  const [messagesPerPage, setIsMessagesPerPage] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);




  useEffect(() => {
    // alert("hey")
    // Check if the SpeechRecognition API is available in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;


      const newRecognition = new SpeechRecognition();


      newRecognition.continuous = true;
      newRecognition.interimResults = true;


      newRecognition.onstart = () => {
        setListening(true);
      };


      newRecognition.onresult = (event) => {
        let newTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          newTranscript += event.results[i][0].transcript;
        }
        setTranscript(newTranscript);
        setInputMessage(newTranscript)
      };


      newRecognition.onend = () => {
        setListening(false);
      };


      setRecognition(newRecognition);
    } else {
      // SpeechRecognition API not available, provide a fallback input field
      console.warn('SpeechRecognition API is not available in this browser.');
    }

  }, []);
  const [cardCss, setCardCss]=useState('')
  const handleLetterMouseEnter = (letterID) => {
    setCardCss(letterID);
  };
  const handleLetterMouseLeave = (letterID) => {
    setCardCss(letterID);
  };

  const startListening = () => {
    if (recognition && !listening) {
      recognition.start();
    }
  };


  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
    }
  };


  useEffect(() => {
    {
      getChatIdOfAiWithData();
      if (isChatId) {
        getOpenAiChat(isChatId);
      }
    }
  }, []);

  const handleOpenAI = async () => {
    if (!inputMessage) {
      toast.error("Please enter a prompt");
      return
    }
    if (showExplorePrompt1) {
      setShowExplorePrompt1(true);
    } else if (showExplorePrompt2) {
      setShowExplorePrompt2(true);
    } else if (showExplorePrompt3) {
      setShowExplorePrompt3(true);
    } else if (showExplorePrompt4) {
      setShowExplorePrompt4(true);
    }
    setShowChatBox(true);
    stopListening()
    var data = 10;
    setloaderUpload(true);
    setShowAiTyping(true);
    setTimeout(() => {
      scrollToBottom();
    }, 1000);

    console.log("?asdhgkjhsahdkahsjdasjkh")
    try {
      const response = await axios.post(OPEN_AI_CHAT,
        {
          chatId: isChatId,
          userid: id,
          message: inputMessage,
          role: "user"
        },
        { headers: { "Authorization": "Bearer " + token } });
      scrollToBottom();
      setIsChatId(response?.data?.aiData?.chat_id);
      setInputMessage('');
      getOpenAiChat(data, response?.data?.aiData?.chat_id);
      scrollToBottom();
      setShowAiTyping(false)
      getChatIdOfAiWithData();
      setTimeout(() => {
        setShowAiTyping(false)
        scrollToBottom();
        getOpenAiChat(data, response?.data?.aiData?.chat_id);
      }, 1000);
      setTimeout(() => {
        setShowAiTyping(false)
        scrollToBottom();
      }, 10000);
      setloaderUpload(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const getOpenAiChat = async (data, isChatIdD) => {
    try {
      const response = await axios.post(GET_ALL_OPEN_AI_CHAT, {
        payload: {
          isChatId: isChatIdD,
          limit: data,
        }
      },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setIsOpenAiChat(response.data?.chats);
      setIsMessagesPerPage(data);
      getChatIdOfAiWithData();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const getChatIdOfAiWithData = async () => {
    try {
      const response = await axios.post(GET_CHAT_ID_WITH_DATA, { userID: user?._id },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setIsChatIdData(response?.data?.chatIdData);
    } catch (error) {
      toast.error(error || "Something went Wrong");
    }
  };

  const getChatData = async (chat_id) => {
    setInputMessage("");
    setloaderUpload(false);
    setShowAiTyping(false);
    setProfileSidebarOpen(!profileSidebarOpen)
    setShowChatBox(true)
    setIsChatId(chat_id)
    var data = 10;
    getOpenAiChat(data, chat_id);
  };

  const calculateTextAreaRows = (text) => {
    const rows = text.split('\n').length;
    return rows < 5 ? rows : 2;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOpenAI();
    }
  };

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  const openNewChat = async (chat_id) => {
    setProfileSidebarOpen(!profileSidebarOpen)
    setShowChatBox(false);
    setShowExplorePrompt1(false);
    setShowExplorePrompt2(false);
    setShowExplorePrompt3(false);
    setShowExplorePrompt4(false);
    getOpenAiChat(chat_id);
    setIsChatId("")
  };
  const handleLoadMore = () => {
    var data = messagesPerPage + 10;
    getOpenAiChat(data, isChatId);

  };

  const handleButtonClick = () => {
    setProfileSidebarOpen(!profileSidebarOpen)
    const button = document.querySelector('.toggle-button');
    button.classList.toggle('display-none');
  };


  function getText(e) {
    navigator.clipboard.writeText(e);
    toast.success("Text Copied Successfully");
  }

  function openDeletePopupModal(id) {
    setOpenDeleteModal(true);
    setDeleteThreadId(id)

  }


  const deleteChat = async () => {
    try {
      const response = await axios.post(DELETE_USER_CHAT_THREAD, { userID: user?._id, threadId: deleteThreadId },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      getChatIdOfAiWithData();
      setOpenDeleteModal(false);
      setDeleteThreadId("");
      toast.success("Chat deleted successfully");

    } catch (error) {
      toast.error(error || "Something went Wrong");
    }

  }
  return (
    <>
      <div
        id="profile-sidebar"
        className={`absolute z-20 top-0 mb-6 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px  transition-transform duration-200 ease-in-out ${!profileSidebarOpen ? 'visible' : 'hidden'
          }`}
      >
        <div className=" aiChatSideBar sticky top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-72 xl:w-80 h-[calc(100dvh-150px)]">
          <div>
            <div className="sticky top-0 z-10">
              <div className="flex items-center  dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 h-16" style={{ background: "#FBFCFC" }}>
                <div className=" relative w-full flex items-center justify-between">
                  <div className="relative">
                    <div className="grow flex items-center truncate">
                      <div className="truncate p-1 rounded ">
                        <button className="flex items-center justify-between  " onClick={() => openNewChat("")}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_33_8475)">
                              <path d="M18 8.75V15.9375C18 16.1427 17.9596 16.3459 17.8811 16.5354C17.8025 16.725 17.6874 16.8973 17.5424 17.0424C17.3973 17.1874 17.225 17.3025 17.0354 17.3811C16.8459 17.4596 16.6427 17.5 16.4375 17.5H7.0625C6.6481 17.5 6.25067 17.3354 5.95765 17.0424C5.66462 16.7493 5.5 16.3519 5.5 15.9375V6.5625C5.5 6.1481 5.66462 5.75067 5.95765 5.45765C6.25067 5.16462 6.6481 5 7.0625 5H13.6047" stroke="#080D18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M20.9665 2.08009C20.9094 2.01737 20.8402 1.96688 20.763 1.93166C20.6859 1.89644 20.6024 1.87723 20.5176 1.87518C20.4328 1.87314 20.3485 1.8883 20.2698 1.91976C20.191 1.95122 20.1195 1.99832 20.0594 2.05821L19.5762 2.53907C19.5177 2.59767 19.4848 2.67713 19.4848 2.75997C19.4848 2.84282 19.5177 2.92227 19.5762 2.98087L20.0192 3.42306C20.0482 3.45223 20.0827 3.47538 20.1207 3.49118C20.1588 3.50697 20.1995 3.5151 20.2407 3.5151C20.2818 3.5151 20.3226 3.50697 20.3606 3.49118C20.3986 3.47538 20.4331 3.45223 20.4622 3.42306L20.9333 2.95431C21.1715 2.71642 21.1938 2.32892 20.9665 2.08009ZM18.5993 3.51564L11.5477 10.5547C11.505 10.5973 11.4739 10.6501 11.4575 10.7082L11.1313 11.6797C11.1235 11.7061 11.1229 11.734 11.1297 11.7607C11.1365 11.7873 11.1503 11.8117 11.1697 11.8311C11.1892 11.8505 11.2135 11.8644 11.2402 11.8711C11.2668 11.8779 11.2948 11.8774 11.3211 11.8695L12.2918 11.5434C12.3499 11.527 12.4028 11.4959 12.4454 11.4531L19.4844 4.40079C19.5495 4.33497 19.5861 4.24612 19.5861 4.15353C19.5861 4.06094 19.5495 3.97208 19.4844 3.90626L19.0958 3.51564C19.0298 3.44992 18.9406 3.41302 18.8475 3.41302C18.7544 3.41302 18.6652 3.44992 18.5993 3.51564Z" fill="#080D18" />
                            </g>
                            <defs>
                              <filter id="filter0_d_33_8475" x="-1" y="0" width="28" height="28" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_8475" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_33_8475" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">New Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="toggle-button  opacity-80 hover:opacity-100"
                    onClick={handleButtonClick}
                    aria-controls="profile-sidebar"
                  >
                    <span className="sr-only">Close sidebar</span>
                    {/* <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                    </svg> */}
                    <img src={arrowImg} className={`w-8 ${!profileSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />

                  </button>
                </div>
              </div>
            </div>
            <div className="px-5 h-[100dvh] flex flex-col ">
              <div className="mt-4">
                <div className="text-xs font-semibold text-black mb-3">Recent</div>
                <ul className="mb-6">
                  {isChatIdData?.map((data, index) => {
                    var momentDate = moment(data.created_at);
                    if (moment().diff(momentDate, 'days') > 1) {
                      momentDate = momentDate.format('YYYY-MM-DD');
                    } else {
                      momentDate = momentDate.fromNow();
                    }
                    return (
                      <>
                        <li className={` -mx-2 flex items-center  ${data?.chat_id === isChatId ? "bg-indigo-500/30" : ""}`} key={index}>

                          <button className={`w-full p-2 rounded`} onClick={() => getChatData(data?.chat_id)}>
                            <div className="grow truncate">
                              <div className="flex items-center">
                                <div className="relative mr-2 ml-2">
                                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.66602 11.7502H13.3327M6.66602 7.5835H9.99935" stroke="#393939" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.08169 16.3335C3.99827 16.2269 3.18664 15.9015 2.64232 15.3572C1.66602 14.3809 1.66602 12.8095 1.66602 9.66683V9.25016C1.66602 6.10746 1.66602 4.53612 2.64232 3.5598C3.61864 2.5835 5.18998 2.5835 8.33268 2.5835H11.666C14.8087 2.5835 16.3801 2.5835 17.3563 3.5598C18.3327 4.53612 18.3327 6.10746 18.3327 9.25016V9.66683C18.3327 12.8095 18.3327 14.3809 17.3563 15.3572C16.3801 16.3335 14.8087 16.3335 11.666 16.3335C11.1989 16.3439 10.8269 16.3794 10.4615 16.4627C9.46285 16.6926 8.5381 17.2036 7.62424 17.6492C6.32209 18.2842 5.67102 18.6017 5.26242 18.3044C4.48076 17.7222 5.2448 15.9184 5.41602 15.0835" stroke="#393939" stroke-width="1.5" stroke-linecap="round" />
                                  </svg>

                                </div>
                                <div className="">
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {data?.message && (data.message.length > 30 ? data.message.substring(0, 22) + "..." : data.message)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                          <button onClick={() => openDeletePopupModal(data?._id)} >
                            <svg width="50" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 3.5L4.125 13.5C4.15469 14.0778 4.575 14.5 5.125 14.5H10.875C11.4272 14.5 11.8397 14.0778 11.875 13.5L12.5 3.5" stroke="#080D18" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M2.5 3.5H13.5H2.5Z" fill="#080D18" />
                              <path d="M2.5 3.5H13.5" stroke="#080D18" stroke-miterlimit="10" stroke-linecap="round" />
                              <path d="M6 3.5V2.25C5.99971 2.15143 6.01891 2.05377 6.0565 1.96265C6.09409 1.87152 6.14932 1.78873 6.21903 1.71903C6.28873 1.64933 6.37152 1.59409 6.46265 1.55651C6.55377 1.51892 6.65143 1.49971 6.75 1.5H9.25C9.34857 1.49971 9.44623 1.51892 9.53735 1.55651C9.62848 1.59409 9.71127 1.64933 9.78097 1.71903C9.85068 1.78873 9.90591 1.87152 9.9435 1.96265C9.98109 2.05377 10.0003 2.15143 10 2.25V3.5M8 5.5V12.5M5.75 5.5L6 12.5M10.25 5.5L10 12.5" stroke="#080D18" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>

                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>

              {/* <div className="sticky bottom-0 z-10 mt-auto" >
                <ul className="mt-2 border-t border-slate-200 dark:border-slate-700" style={{ background: "#FBFCFC" }}>
                  <li className="-mx-2">
                    <button className={`w-full px-2 py-1 rounded `}
                    // onClick={() => getChatData(data?.chat_id)}
                    >
                      <div className="grow truncate">
                        <div className="flex items-center">
                          <div className="relative mr-2">
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.08398 10.5002C2.08398 6.76821 2.08398 4.90224 3.24335 3.74286C4.40273 2.5835 6.2687 2.5835 10.0007 2.5835C13.7326 2.5835 15.5986 2.5835 16.758 3.74286C17.9173 4.90224 17.9173 6.76821 17.9173 10.5002C17.9173 14.2321 17.9173 16.0981 16.758 17.2575C15.5986 18.4168 13.7326 18.4168 10.0007 18.4168C6.2687 18.4168 4.40273 18.4168 3.24335 17.2575C2.08398 16.0981 2.08398 14.2321 2.08398 10.5002Z" stroke="#161616" stroke-width="1.5" />
                              <path d="M8.33398 8.00016C8.33398 7.07969 9.08015 6.3335 10.0007 6.3335C10.9212 6.3335 11.6673 7.07969 11.6673 8.00016C11.6673 8.33195 11.5704 8.6411 11.4032 8.90083C10.9052 9.67491 10.0007 10.413 10.0007 11.3335V11.7502" stroke="#161616" stroke-width="1.5" stroke-linecap="round" />
                              <path d="M9.99414 14.6665H10.0031" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-black">
                              Help
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                  <li className="-mx-2">
                    <button className={`w-full px-2 py-1 rounded `}
                    // onClick={() => getChatData(data?.chat_id)}
                    >
                      <div className="grow truncate">
                        <div className="flex items-center">
                          <div className="relative mr-2">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0007 18.3337C14.603 18.3337 18.334 14.6027 18.334 10.0003C18.334 5.39795 14.603 1.66699 10.0007 1.66699C6.26925 1.66699 3.14587 4.1194 2.08398 7.50033H4.16732" stroke="#161616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10 6.66699V10.0003L11.6667 11.667" stroke="#161616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M1.66602 10C1.66602 10.2811 1.67868 10.5591 1.70347 10.8333M7.49935 18.3333C7.21468 18.2397 6.93661 18.1303 6.66602 18.0065M2.67384 14.1667C2.51314 13.857 2.36979 13.5361 2.24516 13.2052M4.02537 16.0887C4.2801 16.3632 4.5519 16.6201 4.83897 16.8577" stroke="#161616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-black">
                              Activity
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                  <li className="-mx-2">
                    <button className={`w-full px-2 py-1 rounded `}
                    // onClick={() => getChatData(data?.chat_id)}
                    >
                      <div className="grow truncate">
                        <div className="flex items-center">
                          <div className="relative mr-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.7177 9.58317L12.1344 9.16642C12.502 8.79884 12.6858 8.615 12.9271 8.69125C13.1684 8.76759 13.2065 8.98575 13.2828 9.42209C13.3156 9.60975 13.3327 9.80284 13.3327 9.99984C13.3327 11.8408 11.8403 13.3332 9.99935 13.3332C9.55727 13.3332 9.13535 13.2471 8.74935 13.0908M8.33268 10.4458L7.87922 10.8993C7.51735 11.2611 7.33641 11.4421 7.09748 11.3697C6.85857 11.2973 6.81589 11.0834 6.73055 10.6558C6.68822 10.4438 6.66602 10.2244 6.66602 9.99984C6.66602 8.15889 8.1584 6.6665 9.99935 6.6665C10.4414 6.6665 10.8633 6.75255 11.2493 6.9088" stroke="#161616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M17.5085 11.7469C17.9434 11.6296 18.1609 11.5709 18.2468 11.4588C18.3327 11.3467 18.3327 11.1663 18.3327 10.8055V9.1941C18.3327 8.83335 18.3327 8.65294 18.2468 8.54085C18.1608 8.42869 17.9434 8.37002 17.5085 8.25275C15.8832 7.81443 14.8659 6.1152 15.2854 4.5005C15.4008 4.05643 15.4584 3.8344 15.4033 3.70418C15.3483 3.57395 15.1903 3.48422 14.8741 3.30474L13.4368 2.48871C13.1267 2.3126 12.9716 2.22454 12.8324 2.24329C12.6932 2.26204 12.5362 2.41871 12.222 2.73205C11.006 3.94517 8.99402 3.94512 7.77797 2.73197C7.46387 2.41863 7.30683 2.26196 7.16762 2.2432C7.02842 2.22445 6.87332 2.31251 6.56312 2.48863L5.12588 3.30466C4.80979 3.48413 4.65174 3.57386 4.59667 3.70406C4.54158 3.83427 4.59924 4.05633 4.71456 4.50044C5.13382 6.11519 4.11578 7.81446 2.4902 8.25277C2.05528 8.37002 1.83782 8.42869 1.75192 8.54077C1.66602 8.65294 1.66602 8.83335 1.66602 9.1941V10.8055C1.66602 11.1663 1.66602 11.3467 1.75192 11.4588C1.83781 11.5709 2.05527 11.6296 2.4902 11.7469C4.11552 12.1852 5.13275 13.8844 4.71328 15.4991C4.59792 15.9432 4.54024 16.1652 4.59532 16.2954C4.6504 16.4257 4.80845 16.5154 5.12456 16.6949L6.56181 17.5109C6.87202 17.687 7.02713 17.7751 7.16635 17.7564C7.30557 17.7376 7.46258 17.5809 7.77661 17.2675C8.99327 16.0534 11.0067 16.0534 12.2234 17.2674C12.5374 17.5809 12.6944 17.7375 12.8337 17.7563C12.9728 17.775 13.128 17.6869 13.4382 17.5109L14.8754 16.6948C15.1916 16.5154 15.3497 16.4256 15.4047 16.2954C15.4598 16.1651 15.4021 15.9431 15.2867 15.499C14.867 13.8844 15.8834 12.1853 17.5085 11.7469Z" stroke="#161616" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-black">
                              Settings
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

        </div>

      </div>

      <div
        className={`grow flex flex-col  w-full transition-transform duration-300 ease-in-out  ${profileSidebarOpen ? 'translate-x-0' : 'translate-x-0'
          }`}
      >

        <div className={`relative px-4 sm:px-6 pb-4 mt-0 lg:mt-0 sm:mt-16  md:mt-0 ${!showChatBox?'xl:px-16 xl:mx-16 ':''}`}>
          <div className={`${profileSidebarOpen?'mb-6 py-2':'py-2'}`}>
            <button
              className="toggle-button  absolute top-2 left-4 sm:left-6 opacity-80 hover:opacity-100"
              onClick={handleButtonClick}
              aria-controls="profile-sidebar"
            >
              <span className="sr-only">Close sidebar</span>
              {/* <svg
              className={`fill-current h-6 w-6 ${profileSidebarOpen ? "hidden" : "block"} `}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg> */}
            <img src={arrowImg} className={`w-8 ${!profileSidebarOpen ? 'rotate-0 hidden' : 'rotate-180 block' }`} />
            </button>
          </div>
          {/* <button
                className=" absolute top-4 left-4 sm:left-6 text-white opacity-80 hover:opacity-100"
                onClick={() => setProfileSidebarOpen(!profileSidebarOpen)}
                aria-controls="profile-sidebar"
                aria-expanded={profileSidebarOpen}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="black" stroke="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                </svg>
              </button> */}
          <div className={`${!showChatBox?'lg:px-10 ':''}`}>
          <div className="flex-1 space-y-5  xl:mb-0">
            {!showChatBox &&
              <>
                <div>
                  <h1 className="mb-2 text-5xl">
                    <span className="aiChatSideBarHeading  font-bold">Welcome, {user?firstName:''}</span>
                  </h1>
                  <div className="text-sm  text-black space-y-2">
                    <p>
                      Start the conversation with our custom, trained AI model that will help
                      <br></br>
                      you through out your credit repair journey
                    </p>
                  </div>
                </div>

                {/* Departments */}
                <div className=''>
                  <h2 className="text-[#ADAEB2]  text-3xl font-semibold mb-8 mt-12">Explore prompts more deeply and effectively</h2>
                  {/* Cards */}

                  {!showExplorePrompt1 && !showExplorePrompt2 && !showExplorePrompt3 && !showExplorePrompt4 &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20" >

                      <div className={`aiChatSideBarBackground1 ${profileSidebarOpen?'min-h-[300px] lg:min-h-[400px]':'min-h-[300px]'}`} onClick={() => setShowExplorePrompt1(true)}
                       onMouseEnter={() => handleLetterMouseEnter('1')}
                       onMouseLeave={() => handleLetterMouseLeave('')}
                      >
                        <div  className=" px-4 py-6 h-full flex flex-col gap-16 justify-between cursor-pointer ">
                          <div>
                            <span className={`font-medium text-black text-2xl ${cardCss === '1' ?' text-white':''}`}>Explore Credit Repair Prompts</span>
                          </div>
                          <div>
                            {cardCss === '1' ?
                       
                             <svg   width="33" height="34" viewBox="0 0 33 34"  fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="blackArrow" d="M27.7751 5.50952C21.4294 -0.836216 11.1399 -0.836216 4.79417 5.50952C-1.55156 11.8552 -1.55156 22.1448 4.79417 28.4905C11.1399 34.8362 21.4294 34.8362 27.7751 28.4905C34.1209 22.1448 34.1209 11.8552 27.7751 5.50952ZM21.0748 22.3039C20.9106 22.3045 20.7479 22.2729 20.5959 22.2106C20.444 22.1484 20.3058 22.0569 20.1893 21.9413C20.0727 21.8256 19.9801 21.6882 19.9167 21.5367C19.8532 21.3853 19.8203 21.2229 19.8196 21.0587L19.797 15.2554L12.4177 22.6348C12.1832 22.8692 11.8653 23.0009 11.5338 23.0009C11.2023 23.0009 10.8843 22.8692 10.6499 22.6348C10.4155 22.4003 10.2838 22.0824 10.2838 21.7509C10.2838 21.4194 10.4155 21.1014 10.6499 20.867L18.0292 13.4877L12.226 13.465C12.0617 13.4643 11.8992 13.4312 11.7478 13.3677C11.5963 13.3042 11.4588 13.2114 11.3432 13.0948C11.2276 12.9781 11.1361 12.8399 11.0739 12.6878C11.0117 12.5358 10.9801 12.373 10.9808 12.2088C10.9815 12.0446 11.0146 11.8821 11.0781 11.7306C11.1416 11.5791 11.2344 11.4417 11.351 11.326C11.4677 11.2104 11.606 11.1189 11.758 11.0567C11.91 10.9945 12.0728 10.9629 12.237 10.9636L21.0422 10.9973C21.372 10.9986 21.688 11.1302 21.9212 11.3634C22.1545 11.5967 22.2861 11.9126 22.2873 12.2425L22.321 21.0476C22.3218 21.212 22.2902 21.3749 22.228 21.527C22.1658 21.6792 22.0742 21.8175 21.9584 21.9342C21.8427 22.0509 21.705 22.1436 21.5534 22.207C21.4018 22.2705 21.2391 22.3034 21.0748 22.3039Z" 
                            fill="#FFFFFF"/>
                            </svg>
                     
                            :
                        
                            <svg width="57" height="57" className='h-12 w-12' viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_669_2943)">
                              <path d="M33.0687 32.3375L33.0344 23.5329L24.2299 23.4987M32.4251 24.1422L23.5327 33.0347" stroke="#060606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M38.8901 38.8908C44.7458 33.0351 44.7458 23.5333 38.8901 17.6776C33.0344 11.8219 23.5326 11.8219 17.6769 17.6776C11.8212 23.5333 11.8212 33.0351 17.6769 38.8908C23.5326 44.7465 33.0344 44.7465 38.8901 38.8908Z" stroke="#060606" stroke-width="2" stroke-miterlimit="10"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_669_2943">
                              <rect width="40" height="40" fill="white" transform="translate(0 28.2842) rotate(-45)"/>
                              </clipPath>
                              </defs>
                            </svg>
                         
                            }
                           
                          </div>
                        </div>
                      </div>

                      <div className={`aiChatSideBarBackground1 ${profileSidebarOpen?'min-h-[300px] lg:min-h-[380px]':'min-h-[300px]'}`}  onClick={() => setShowExplorePrompt2(true)}
                        onMouseEnter={() => handleLetterMouseEnter('2')}
                        onMouseLeave={() => handleLetterMouseLeave('')}
                      >
                          <div className="px-4 py-6 h-full flex  flex-col gap-16 justify-between">
                            <div>
                             <span className={`font-medium text-black text-2xl ${cardCss === '2' ?'text-white':''}`}>Explore FDCPA prompts</span>
                            </div>
                            <div>
                            {cardCss === '2' ?
                       
                             <svg   width="33" height="34" viewBox="0 0 33 34"  fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="blackArrow" d="M27.7751 5.50952C21.4294 -0.836216 11.1399 -0.836216 4.79417 5.50952C-1.55156 11.8552 -1.55156 22.1448 4.79417 28.4905C11.1399 34.8362 21.4294 34.8362 27.7751 28.4905C34.1209 22.1448 34.1209 11.8552 27.7751 5.50952ZM21.0748 22.3039C20.9106 22.3045 20.7479 22.2729 20.5959 22.2106C20.444 22.1484 20.3058 22.0569 20.1893 21.9413C20.0727 21.8256 19.9801 21.6882 19.9167 21.5367C19.8532 21.3853 19.8203 21.2229 19.8196 21.0587L19.797 15.2554L12.4177 22.6348C12.1832 22.8692 11.8653 23.0009 11.5338 23.0009C11.2023 23.0009 10.8843 22.8692 10.6499 22.6348C10.4155 22.4003 10.2838 22.0824 10.2838 21.7509C10.2838 21.4194 10.4155 21.1014 10.6499 20.867L18.0292 13.4877L12.226 13.465C12.0617 13.4643 11.8992 13.4312 11.7478 13.3677C11.5963 13.3042 11.4588 13.2114 11.3432 13.0948C11.2276 12.9781 11.1361 12.8399 11.0739 12.6878C11.0117 12.5358 10.9801 12.373 10.9808 12.2088C10.9815 12.0446 11.0146 11.8821 11.0781 11.7306C11.1416 11.5791 11.2344 11.4417 11.351 11.326C11.4677 11.2104 11.606 11.1189 11.758 11.0567C11.91 10.9945 12.0728 10.9629 12.237 10.9636L21.0422 10.9973C21.372 10.9986 21.688 11.1302 21.9212 11.3634C22.1545 11.5967 22.2861 11.9126 22.2873 12.2425L22.321 21.0476C22.3218 21.212 22.2902 21.3749 22.228 21.527C22.1658 21.6792 22.0742 21.8175 21.9584 21.9342C21.8427 22.0509 21.705 22.1436 21.5534 22.207C21.4018 22.2705 21.2391 22.3034 21.0748 22.3039Z"
                             fill="#FFFFFF"/>
                            </svg>

                            :
                        
                            <svg width="57" height="57"  className='h-12 w-12'  viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_669_2943)">
                              <path d="M33.0687 32.3375L33.0344 23.5329L24.2299 23.4987M32.4251 24.1422L23.5327 33.0347" stroke="#060606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M38.8901 38.8908C44.7458 33.0351 44.7458 23.5333 38.8901 17.6776C33.0344 11.8219 23.5326 11.8219 17.6769 17.6776C11.8212 23.5333 11.8212 33.0351 17.6769 38.8908C23.5326 44.7465 33.0344 44.7465 38.8901 38.8908Z" stroke="#060606" stroke-width="2" stroke-miterlimit="10"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_669_2943">
                              <rect width="40" height="40" fill="white" transform="translate(0 28.2842) rotate(-45)"/>
                              </clipPath>
                              </defs>
                            </svg>
                         
                            }
                            </div>
                        </div>
                      </div>


                      <div className={`aiChatSideBarBackground1 ${profileSidebarOpen?'min-h-[300px] lg:min-h-[380px]':'min-h-[300px]'}`}  onClick={() => setShowExplorePrompt3(true)}
                       onMouseEnter={() => handleLetterMouseEnter('3')}
                       onMouseLeave={() => handleLetterMouseLeave('')}
                      >
                        <div className="px-4 py-6 h-full flex  flex-col gap-16 justify-between">
                          <div className="">
                            <span className={`font-medium text-black text-2xl ${cardCss === '3' ?'text-white':''}`}>Explore TILA prompts</span>
                          </div>
                          <div>
                          {cardCss === '3' ?
                       
                       <svg   width="33" height="34" viewBox="0 0 33 34"  fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path id="blackArrow" d="M27.7751 5.50952C21.4294 -0.836216 11.1399 -0.836216 4.79417 5.50952C-1.55156 11.8552 -1.55156 22.1448 4.79417 28.4905C11.1399 34.8362 21.4294 34.8362 27.7751 28.4905C34.1209 22.1448 34.1209 11.8552 27.7751 5.50952ZM21.0748 22.3039C20.9106 22.3045 20.7479 22.2729 20.5959 22.2106C20.444 22.1484 20.3058 22.0569 20.1893 21.9413C20.0727 21.8256 19.9801 21.6882 19.9167 21.5367C19.8532 21.3853 19.8203 21.2229 19.8196 21.0587L19.797 15.2554L12.4177 22.6348C12.1832 22.8692 11.8653 23.0009 11.5338 23.0009C11.2023 23.0009 10.8843 22.8692 10.6499 22.6348C10.4155 22.4003 10.2838 22.0824 10.2838 21.7509C10.2838 21.4194 10.4155 21.1014 10.6499 20.867L18.0292 13.4877L12.226 13.465C12.0617 13.4643 11.8992 13.4312 11.7478 13.3677C11.5963 13.3042 11.4588 13.2114 11.3432 13.0948C11.2276 12.9781 11.1361 12.8399 11.0739 12.6878C11.0117 12.5358 10.9801 12.373 10.9808 12.2088C10.9815 12.0446 11.0146 11.8821 11.0781 11.7306C11.1416 11.5791 11.2344 11.4417 11.351 11.326C11.4677 11.2104 11.606 11.1189 11.758 11.0567C11.91 10.9945 12.0728 10.9629 12.237 10.9636L21.0422 10.9973C21.372 10.9986 21.688 11.1302 21.9212 11.3634C22.1545 11.5967 22.2861 11.9126 22.2873 12.2425L22.321 21.0476C22.3218 21.212 22.2902 21.3749 22.228 21.527C22.1658 21.6792 22.0742 21.8175 21.9584 21.9342C21.8427 22.0509 21.705 22.1436 21.5534 22.207C21.4018 22.2705 21.2391 22.3034 21.0748 22.3039Z"
                       fill="#FFFFFF"/>
                      </svg>
               
                      :
                  
                      <svg width="57" height="57" viewBox="0 0 57 57" className='h-12 w-12'  fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_669_2943)">
                        <path d="M33.0687 32.3375L33.0344 23.5329L24.2299 23.4987M32.4251 24.1422L23.5327 33.0347" stroke="#060606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38.8901 38.8908C44.7458 33.0351 44.7458 23.5333 38.8901 17.6776C33.0344 11.8219 23.5326 11.8219 17.6769 17.6776C11.8212 23.5333 11.8212 33.0351 17.6769 38.8908C23.5326 44.7465 33.0344 44.7465 38.8901 38.8908Z" stroke="#060606" stroke-width="2" stroke-miterlimit="10"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_669_2943">
                        <rect width="40" height="40" fill="white" transform="translate(0 28.2842) rotate(-45)"/>
                        </clipPath>
                        </defs>
                      </svg>
                   
                      }
                            </div>
                        </div>
                      </div>

                      <div className={`aiChatSideBarBackground1 ${profileSidebarOpen?'min-h-[300px] lg:min-h-[380px]':'min-h-[300px]'}`}  onClick={() => setShowExplorePrompt4(true)}
                       onMouseEnter={() => handleLetterMouseEnter('4')}
                       onMouseLeave={() => handleLetterMouseLeave('')}
                      >
                        <div className="px-4 py-6 h-full flex  flex-col gap-16 justify-between">
                          <div className="">
                            <span className={`font-medium text-black text-2xl ${cardCss === '4' ?'text-white':''}`}>Explore FCRA prompts</span>
                          </div>
                          <div>
                          {cardCss === '4' ?
                       
                       <svg   width="33" height="34" viewBox="0 0 33 34"  fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path id="blackArrow" d="M27.7751 5.50952C21.4294 -0.836216 11.1399 -0.836216 4.79417 5.50952C-1.55156 11.8552 -1.55156 22.1448 4.79417 28.4905C11.1399 34.8362 21.4294 34.8362 27.7751 28.4905C34.1209 22.1448 34.1209 11.8552 27.7751 5.50952ZM21.0748 22.3039C20.9106 22.3045 20.7479 22.2729 20.5959 22.2106C20.444 22.1484 20.3058 22.0569 20.1893 21.9413C20.0727 21.8256 19.9801 21.6882 19.9167 21.5367C19.8532 21.3853 19.8203 21.2229 19.8196 21.0587L19.797 15.2554L12.4177 22.6348C12.1832 22.8692 11.8653 23.0009 11.5338 23.0009C11.2023 23.0009 10.8843 22.8692 10.6499 22.6348C10.4155 22.4003 10.2838 22.0824 10.2838 21.7509C10.2838 21.4194 10.4155 21.1014 10.6499 20.867L18.0292 13.4877L12.226 13.465C12.0617 13.4643 11.8992 13.4312 11.7478 13.3677C11.5963 13.3042 11.4588 13.2114 11.3432 13.0948C11.2276 12.9781 11.1361 12.8399 11.0739 12.6878C11.0117 12.5358 10.9801 12.373 10.9808 12.2088C10.9815 12.0446 11.0146 11.8821 11.0781 11.7306C11.1416 11.5791 11.2344 11.4417 11.351 11.326C11.4677 11.2104 11.606 11.1189 11.758 11.0567C11.91 10.9945 12.0728 10.9629 12.237 10.9636L21.0422 10.9973C21.372 10.9986 21.688 11.1302 21.9212 11.3634C22.1545 11.5967 22.2861 11.9126 22.2873 12.2425L22.321 21.0476C22.3218 21.212 22.2902 21.3749 22.228 21.527C22.1658 21.6792 22.0742 21.8175 21.9584 21.9342C21.8427 22.0509 21.705 22.1436 21.5534 22.207C21.4018 22.2705 21.2391 22.3034 21.0748 22.3039Z"
                       fill="#FFFFFF"/>
                      </svg>
               
                      :
                  
                      <svg width="57" height="57" viewBox="0 0 57 57" className='h-12 w-12'  fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_669_2943)">
                        <path d="M33.0687 32.3375L33.0344 23.5329L24.2299 23.4987M32.4251 24.1422L23.5327 33.0347" stroke="#060606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38.8901 38.8908C44.7458 33.0351 44.7458 23.5333 38.8901 17.6776C33.0344 11.8219 23.5326 11.8219 17.6769 17.6776C11.8212 23.5333 11.8212 33.0351 17.6769 38.8908C23.5326 44.7465 33.0344 44.7465 38.8901 38.8908Z" stroke="#060606" stroke-width="2" stroke-miterlimit="10"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_669_2943">
                        <rect width="40" height="40" fill="white" transform="translate(0 28.2842) rotate(-45)"/>
                        </clipPath>
                        </defs>
                      </svg>
                   
                      }
                            </div>
                        </div>
                      </div>
                    </div>
                  }

                </div>
              </>
            }

            <div className={`${(showChatBox) && (showExplorePrompt1 || showExplorePrompt2 || showExplorePrompt3 || showExplorePrompt4) ? "flex flex-col xl:flex-row xl:space-x-16" : {}}`} >

              <div className="flex-1 " >
                <div className="">
                  <div>
                    {(showChatBox) && (showExplorePrompt1 || showExplorePrompt2 || showExplorePrompt3 || showExplorePrompt4) &&
                      <div>
                        <h1 className='text-3xl font-bold mb-2 text-black'>Prompts</h1>
                      </div>
                    }
                    {showExplorePrompt1 &&
                      <>
                        <ExplorePrompt1 setShowExplorePrompt1={setShowExplorePrompt1} inputMessage={inputMessage} setInputMessage={setInputMessage} showExplorePrompt1={showExplorePrompt1} showChatBox={showChatBox} ></ExplorePrompt1>
                      </>
                    }
                    {showExplorePrompt2 &&
                      <>
                        <ExplorePrompt2 setShowExplorePrompt2={setShowExplorePrompt2} inputMessage={inputMessage} setInputMessage={setInputMessage} showExplorePrompt2={showExplorePrompt2} showChatBox={showChatBox}></ExplorePrompt2>
                      </>
                    }
                    {showExplorePrompt3 &&
                      <>
                        <ExplorePrompt3 setShowExplorePrompt3={setShowExplorePrompt3} inputMessage={inputMessage} setInputMessage={setInputMessage} showExplorePrompt3={showExplorePrompt3} showChatBox={showChatBox} ></ExplorePrompt3>
                      </>
                    }
                    {showExplorePrompt4 &&
                      <>
                        <ExplorePrompt4 setShowExplorePrompt4={setShowExplorePrompt4} inputMessage={inputMessage} setInputMessage={setInputMessage} showExplorePrompt4={showExplorePrompt4} showChatBox={showChatBox}></ExplorePrompt4>
                      </>
                    }
                  </div>

                  {(showChatBox) && (showExplorePrompt1 || showExplorePrompt2 || showExplorePrompt3 || showExplorePrompt4) &&
                    <div className="pb-5 mt-5 sticky bottom-0 z-10 bg-white">
                      <div>
                        <h1 className='text-sm text-[#080D18]'>More prompts for you below </h1>
                      </div>
                      <div className="flex justify-between my-3 text-[#080D18]">
                        {!showExplorePrompt1 &&
                          <div className='mr-2'>
                            <button className="btn bg-[#F4F5F6] " onClick={() => { setShowExplorePrompt1(true); setShowExplorePrompt2(false); setShowExplorePrompt3(false); setShowExplorePrompt4(false); }} >
                              <span className=' text-sm font-medium'>Explore credit repair</span>
                            </button>
                          </div>
                        }
                        {!showExplorePrompt2 &&
                          <div className='mx-2 '>
                            <button className="btn bg-[#F4F5F6]" onClick={() => { setShowExplorePrompt2(true); setShowExplorePrompt1(false); setShowExplorePrompt3(false); setShowExplorePrompt4(false); }}>
                              <span className=' text-sm font-medium '>Explore FDCPA prompts</span>
                            </button>
                          </div>
                        }
                        {!showExplorePrompt3 &&
                          <div className='mx-2'>
                            <button className="btn bg-[#F4F5F6]" onClick={() => { setShowExplorePrompt3(true); setShowExplorePrompt1(false); setShowExplorePrompt2(false); setShowExplorePrompt4(false); }} >
                              <span className=' text-sm font-medium'>Explore TILA prompts</span>
                            </button>
                          </div>
                        }
                        {!showExplorePrompt4 &&
                          <div className='ml-2'>
                            <button className="btn bg-[#F4F5F6]" onClick={() => { setShowExplorePrompt4(true); setShowExplorePrompt1(false); setShowExplorePrompt2(false); setShowExplorePrompt3(false); }} >
                              <span className=' text-sm font-medium'>Explore FCRA prompts</span>
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>

              </div>
              <div class='' style={{ margin: "unset" }}>
                <div class="h-full bg-[#EEEFF1] w-[1px] border-between"></div>
              </div>


              <div className="flex-1" style={{ marginLeft: "0" }} >

                <div className={`${!showChatBox && " mb-8"}`}>
                  {showChatBox &&
                    <h1 className='text-3xl font-bold mb-2 text-black'>Conversations</h1>
                  }
                  {showChatBox &&
                    <>
                      <div className="h-[calc(100dvh-36dvh)] overflow-y-auto overflow-auto text-[#080D18]  no-scrollbar shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 divide-slate-200 dark:divide-slate-700">
                        {isOpenAiChat.length > 0 &&
                          <>
                            <div className='text-center text-green-500 '>
                              {
                                isOpenAiChat.length >= messagesPerPage && (
                                  <>
                                    <button className='mt-3 mb-3' onClick={handleLoadMore}>Load More...</button>
                                    <hr></hr>
                                  </>
                                )
                              }
                            </div>

                          </>
                        }

                        {isOpenAiChat?.slice().reverse().map((mail, index) => {

                          const timeAgo = moment(mail.created_at).fromNow();


                          return (
                            <>
                              <div className=" grow px-4 sm:px-6 md:px-5 mb-8">
                                {mail?.role === "ai" ?
                                  <>
                                    <svg className="ml-4" width="27" height="80" viewBox="0 0 27 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 1V50.6863C1 52.808 1.84285 54.8429 3.34315 56.3431L25.5 78.5" stroke="#FEE5E4" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                    <div className="flex items-start mb-4 last:mb-0" style={{ marginLeft: "40px" }}>
                                      <div>
                                        <span className="text-xs ml-2">One reply</span>
                                        <div className="">

                                          <div className="mt-2" style={{ float: "left" }}>
                                            <img className="rounded-full  border-[1.5px] border-red-700 content-fit ai-bg-icon" src={ai_head} width="30" height="30" alt="User" />
                                          </div>
                                          <div className="px-2 ml-5 pl-5">
                                            <div className="text-md font-semibold flex">
                                              <span>Consumer Law AI</span>
                                              <button className=" py-1 rounded-md" onClick={() => getText(mail.message)}>
                                                <img className=" ms-2" src={copied_img} width="20" height="12" alt="User" />
                                                <span style={{ fontSize: "10px", color: "blue" }}></span>
                                              </button>
                                            </div>
                                            <div>
                                              <pre style={{ maxWidth: '100%', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                                {mail.message}
                                              </pre>
                                            </div>


                                            {/* <div>
                                              <span className="text-xs text-gray-500">{timeAgo}</span>
                                            </div> */}

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                  :
                                  <>

                                    <div className="flex items-start mb-4 last:mb-0 mt-12">
                                      <div>
                                        <div className="flex">
                                          <div style={{ minWidth: "40px" }}>
                                            <img className="rounded-full  border-[1.5px] border-red-700 content-fit" src={UserAvatar} width="30" height="30" alt="User" />

                                          </div>
                                          <div className="px-2">
                                            <div className="text-md font-semibold">
                                              {user?.name}
                                            </div>
                                            <pre style={{ maxWidth: '100%', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                              {mail.message}
                                            </pre>
                                            <div>
                                              <span className="text-xs text-gray-500">{timeAgo}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                }
                              </div>
                            </>
                          );
                        })}

                        {showAiTyping &&
                          <div className="flex items-start mb-4 last:mb-0">
                            <div>
                              {/* <h1 className="mt-4  text-sm font-semibold text-slate-800 dark:text-slate-100 text-left truncate mb-4">CONSUMER AI</h1> */}
                              <div className="flex text-sm bg-white  text-slate-800 dark:text-slate-100 p-3 rounded-tl-none   mb-1 items-center">
                                <h4 className='me-3'>Consumer AI Typing</h4>
                                <svg className="fill-current text-slate-400 dark:text-slate-500" viewBox="0 0 15 3" width="15" height="3">
                                  <circle cx="1.5" cy="1.5" r="1.5">
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
                                  </circle>
                                  <circle cx="7.5" cy="1.5" r="1.5">
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                  </circle>
                                  <circle cx="13.5" cy="1.5" r="1.5">
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
                                  </circle>
                                </svg>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </>
                  }
                </div>
                <div ref={bottomRef}></div>
                {/* 
                  <div className=''>
                    <label for="chat" className="sr-only">Your message</label>
                    <div className="flex items-center py-2 px-3 bg-gray-100 rounded-lg dark:bg-gray-700 mt-5">
                      <textarea
                        value={inputMessage}
                        rows={calculateTextAreaRows(inputMessage)}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ resize: 'none' }}
                        id="chat"
                        className=" block  mx-4 p-2.5  w-full border-0 bg-gray-100"
                        placeholder="Type your message here..."
                      ></textarea>
                      <button onClick={() => { handleOpenAI() }} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg className="w-6 h-6 rotate-90" stroke="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                      </button>
                      <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 28H20M24 13V15C24 19.4 20.4 23 16 23M16 23C11.6 23 8 19.4 8 15V13M16 23V28" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M16 20C15.3401 19.9985 14.6871 19.8644 14.08 19.6056C13.4728 19.3469 12.9239 18.9688 12.4657 18.4938C11.5276 17.5478 11.0009 16.2698 11 14.9375V8.00004C10.9975 7.34271 11.1251 6.69138 11.3754 6.08359C11.6258 5.47581 11.994 4.9236 12.4588 4.45879C12.9236 3.99399 13.4758 3.62579 14.0836 3.37542C14.6914 3.12506 15.3427 2.99748 16 3.00004C18.8038 3.00004 21 5.19629 21 8.00004V14.9375C21 17.7288 18.7569 20 16 20Z" fill="black" />
                        </svg>
                      </button>
                    </div>
                  </div> */}

                <div className="sticky bottom-0 mt-10 ">
                  <div className=" items-center justify-between bg-white  aiChatInput w-full">
                    <div className="flex items-center py-4 px-3 bg-[#FBFCFC] rounded-3xl ">
                      <textarea
                        value={inputMessage}
                        rows={calculateTextAreaRows(inputMessage)}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // style={{ resize: 'none' }}
                        id="chat"
                        className=" block  mx-4 p-2.5  w-full focus:ring-[#FBFCFC] text-black bg-[#FBFCFC] border-none "
                        placeholder="Type your message here..."
                      ></textarea>

                      {loaderUpload ?
                        <button className="hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                          <svg className="animate-spin w-6 h-6 fill-current shrink-0" stroke="black" fill="black" viewBox="0 0 16 16">
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                        </button>
                        :
                        <button onClick={() => { handleOpenAI() }} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                          <svg className="w-6 h-6 rotate-90" stroke="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                      }


                      {listening ?
                        <button onClick={() => stopListening()} >
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-stop-filled" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="black" fill="black" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" stroke-width="0" fill="currentColor" />
                          </svg>
                        </button>
                        :
                        <button onClick={() => startListening()} type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 28H20M24 13V15C24 19.4 20.4 23 16 23M16 23C11.6 23 8 19.4 8 15V13M16 23V28" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16 20C15.3401 19.9985 14.6871 19.8644 14.08 19.6056C13.4728 19.3469 12.9239 18.9688 12.4657 18.4938C11.5276 17.5478 11.0009 16.2698 11 14.9375V8.00004C10.9975 7.34271 11.1251 6.69138 11.3754 6.08359C11.6258 5.47581 11.994 4.9236 12.4588 4.45879C12.9236 3.99399 13.4758 3.62579 14.0836 3.37542C14.6914 3.12506 15.3427 2.99748 16 3.00004C18.8038 3.00004 21 5.19629 21 8.00004V14.9375C21 17.7288 18.7569 20 16 20Z" fill="black" />
                          </svg>
                        </button>
                      }

                    </div>
                  </div>
                </div>
              </div>

            </div>


          </div>
          </div>
        </div>

       


        {openDeleteModal &&
          <div className="progress-loader-container ">
            <div className="plan-loadera " style={{ padding: "0px!important" }}>
              <div className='flex justify-end mt-2 mr-3' >
                <button onClick={(e) => { e.stopPropagation(); setOpenDeleteModal(false); }} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" stroke-width="0" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <div className="p-3 flex space-x-4 ">
                <div className="flex justify-center col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                  <div className="text-center ">
                    <div className="my-5">
                      <div>
                        <h4 className="text-lg leading-snug text-slate-800 dark:text-slate-100 font-semibold ">Are you sure to delete chat?<br /></h4>
                      </div>
                      <div>
                      </div>
                    </div>
                    <div>
                      <button onClick={(e) => { deleteChat() }} className="btn tm-background text-white">
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      {MyModalOpen &&
          <div className="progress-loader-container ">
            <div className="plan-loadera mt-3 ai-chat-popup" style={{ padding: "0px!important", }}>
              <div className='flex justify-end pe-5 pt-4'>
                <button onClick={(e) => { e.stopPropagation(); setMyModalOpen(false); }} >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15L1 1M15 1L1 15" stroke="#080D18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                </button>
              </div>
              <div className="p-5 flex space-x-4 ms-5 me-5">
                <div className="grid grid-cols-12 ms-5 me-5">
                  <div className="flex justify-center col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                    <img src={ai_robot_img} width={300} alt="ai-chat-img" />
                  </div>
                  <div className="flex justify-center col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                    <div className="text-center my-5 pt-5">
                      <div className="my-5">
                        <div>
                          <h1 className="text-3xl leading-snug text-[#080D18] dark:text-text-[#080D18] font-semibold mb-2 pt-4">Welcome to Consumer <br /> Law AI</h1>
                        </div>
                        <div>
                          <span className="text-sm text-[#080D18] dark:text-text-[#080D18] ">Let’s get you started to get the best on-hand <br /> experience. Are you ready for the show?</span>
                        </div>
                      </div>
                      <div>
                        <button onClick={(e) => { e.stopPropagation(); setMyModalOpen(false); }} className="py-2 px-2 rounded-[18px] tm-background text-white">
                          <span className="text-sm ">Get started</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
    </>

  );
}

export default ProfileBody;