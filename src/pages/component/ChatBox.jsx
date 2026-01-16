import React, { useState, useEffect, useRef } from 'react';
import logoSrc from '../../images/ai-head.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GET_SEPARATE_CHAT_USERS, GET_MESSAGE, SEND_MESSAGE, CREATE_CHAT_ROOM } from "../../API/api";
import Cookies from "js-cookie";
import Moment from 'moment';
import { BackendDomainSocketUrl } from '../../Config';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import Loder from '../../partials/Loder';


const ChatBox = ({ id }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [curMessage, setcurMessage] = useState("");
  const [chatUsers, setChatUsers] = useState(null);
  const [isChatWindow, setIsChatWindow] = useState(false);
  const [chatDetails, setChatDetails] = useState(null);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isFetched, setIsFetched] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [messageList, setMessageList] = useState([]);
  const [totalpage, setTotalpage] = useState(0);
  const [isSend, setIsSend] = useState(false);
  const contentArea = useRef(null)
  const [socket, setSocket] = useState(null);

  const refresh = async () => {
    try {
      const response = await axios.get(CREATE_CHAT_ROOM, { headers: { "Authorization": "Bearer " + token } });
      getChatUsers();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      setIsFetched(false);
    }
  }

  const getChatUsers = async () => {
    try {
      let url = GET_SEPARATE_CHAT_USERS(id);
      const response = await axios.get(url, { headers: { "Authorization": "Bearer " + token } });
      setChatUsers(response?.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const selectChat = async (val) => {
    await socket.emit("start_chat");
    setChatDetails(val);
    setIsChatWindow(true);
  }

  const getAllMessages = async () => {
    setIsFetched(false);
    try {
      const response = await axios.post(GET_MESSAGE, { chat_id: chatDetails._id, pageNumber }, { headers: { "Authorization": "Bearer " + token } });
      setMessageList(response.data.chats);
      setTotalpage(response.data.total_page);
      if (pageNumber <= response.data.total_page) {
        setPageNumber(response.data.currentPage + 1);
      }
      setIsFetched(true);
      setTimeout(function () {
        if (contentArea?.current?.scrollTop) {
          contentArea.current.scrollTop = 99999999;
        }
      }, 3000);
    } catch (error) {
      setIsFetched(true);
      console.log(error)
    }
  }

  const send = async (e) => {
    e.preventDefault();
    if (curMessage) {
      setIsSend(true);
      let data = {}
      if (curMessage != "") {
        data = { chat_id: chatDetails?._id, message: curMessage, }
      }
      if (!chatDetails?._id && !curMessage) { return true; }

      try {
        const response = await axios.post(SEND_MESSAGE, data,
          { headers: { "Authorization": "Bearer " + token } }
        );
        await socket.emit("send_message", response?.data?.messages);
        setcurMessage('');
        setIsSend(false);
        toast.success("Message sent");
      } catch (error) {
        setIsSend(false);
        console.log(error);
      }
    }
  }


  useEffect(() => {
    if (socket == null) {
      let soketConnection = io(BackendDomainSocketUrl);
      setSocket(soketConnection);
    }
    if (socket) {
      socket.on('disconnect', (reason, details) => {
        console.log('Disconnected from server<=======================');
        console.log(reason, details.message, details.description, details.context);
      });

      socket.on("recieve_message", (messageData) => {
        // if (messageData) {
        //   setMessageList((list) => [...list, messageData]);
        // }
      });
    }
  }, [socket]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    setMessageList(null);
    getAllMessages();
    setPageNumber(1)
  }, [chatDetails]);

  useEffect(() => {
    setTimeout(function () {
      if (contentArea?.current?.scrollTop) {
        contentArea.current.scrollTop = 99999999;
      }
    }, 1000);
  }, [messageList, pageNumber, isChatWindow]);

  return (
    <>
      {chatUsers?.length > 0 &&
        <footer className="relative">
          <div className="fixed bottom-8 mr-20 right-12 z-50" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} >
            <div className=" rounded-full p-2 cursor-pointer" style={{ position: 'relative' }}>
              <div className="w-8 h-8 flex items-center justify-center  rounded-full false" aria-haspopup="true" aria-expanded="false">
                {!isOpen ?
                  <div className='bg-gray-200 p-3 rounded-full' onClick={() => setIsOpen(true)}>
                    <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path className="fill-current text-slate-500 dark:text-slate-400" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V12l2.699-1.542A7.454 7.454 0 006.5 11c3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0z"></path>
                      <path className="fill-current text-slate-400 dark:text-slate-500" d="M16 9.5c0-.987-.429-1.897-1.147-2.639C14.124 10.348 10.66 13 6.5 13c-.103 0-.202-.018-.305-.021C7.231 13.617 8.556 14 10 14c.449 0 .886-.04 1.307-.11L15 16v-4h-.012C15.627 11.285 16 10.425 16 9.5z"></path>
                    </svg>
                  </div>
                  :
                  <div className="mb-52 ">
                    <div className='h-[400px] w-[300px] mb-[300px] bg-white border border-gray-300 rounded-xl'>
                      {isChatWindow ?
                        <>
                          <div className='p-2 h-[40px] bg-[#bd0808] rounded-t-xl flex justify-end w-full'>
                            <div onClick={() => setIsOpen(false)}>
                              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </div>
                          </div>
                          <div className='h-[260px] overflow-y-scroll p-1' ref={contentArea}>
                            {pageNumber <= totalpage &&
                              <div className='text-center'>
                                <button className='text-[blue] text-[10px] underline' onClick={getAllMessages}>Read More</button>
                              </div>}
                            {messageList && messageList.map((messageContent, i) => {
                              if (chatDetails._id == messageContent.chat_id) {
                                let createdAt = Moment(messageContent.createdAt).format('DD-MM-YYYY H:m A');
                                return (
                                  <div key={i}>
                                    <div className={`flex items-start mb-4 last:mb-0 ${messageContent?.sender_id == user._id ? 'justify-end' : ''} `} >
                                      <div>
                                        <div className="text-[8px] mt-2 ml-1">
                                          <span>
                                            {/* {messageContent?.sender_id == user._id ? 'You' : `${chatDetails?.owner[0]?.name}`} */}
                                            {messageContent?.sender_id === chatDetails?.client_id ? `${chatDetails?.client[0]?.name}` :
                                              messageContent?.sender_id === chatDetails?.agent_id ? `${chatDetails?.agent[0]?.name}` :
                                                messageContent?.sender_id == user._id ? "You"
                                                  : "admin"}
                                          </span>
                                        </div>
                                        <div className={` ${messageContent?.sender_id == user._id ? 'bg-red-400 text-white' : 'bg-white text-slate-800'} dark:bg-slate-800  dark:text-slate-100 p-2 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1 text-[10px]`}>
                                          {messageContent.message}
                                        </div>
                                        <div className="text-[8px] text-slate-500 font-medium">{createdAt}</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            })}
                            {!isFetched &&
                              <div className='flex justify-center mt-10'>
                                <Loder />
                              </div>
                            }
                          </div>
                          <div className='border-t border-gray-200 h-[50px] '>
                            <form className="grow flex m-1" onSubmit={send}>
                              <div className="grow mr-3">
                                <label htmlFor="message-input" className="sr-only">Type a message</label>
                                <input id="message-input" value={curMessage} onChange={(e) => setcurMessage(e.target.value)} className=" rounded-xl form-input w-full bg-slate-100 text-[10px] dark:bg-slate-800 border-transparent dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500" type="text" placeholder="Aa" />
                              </div>
                              {isSend ?
                                <button type="button" disabled className="p-3 flex justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white">
                                  <Loder />
                                </button>
                                :
                                <button type="submit" className="px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white">
                                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="10" y1="14" x2="21" y2="3" />  <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" /></svg>
                                </button>
                              }

                            </form>
                          </div>
                        </>
                        :
                        <>
                          <div className='p-2 h-[40px] bg-[#bd0808] rounded-t-xl flex justify-end w-full'>
                            <div onClick={() => setIsOpen(false)}>
                              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </div>
                          </div>
                          <div className='h-[310px]'>
                            {chatUsers?.map((val, i) => {
                              let name;
                              let secondname;
                              if (user.role == 'agent') {
                                name = val?.client[0]?.name;
                                secondname = val?.agent[0]?.name;
                              }
                              if (val.type == "team member group" && user.role == 'client') {
                                name = val?.agent[0]?.name;
                                secondname = val?.owner[0]?.name;
                              }
                              if (user.role == 'agency_agent') {
                                name = val?.client[0]?.name;
                                secondname = val?.owner[0]?.name;
                              }
                              return (
                                <div key={i}
                                  onClick={() => { selectChat(val) }}
                                  className='hover:bg-red-400 hover:text-white p-2 border-b border-gray-200 '>
                                  <p className='text-[12px]'>{name} | {secondname}</p>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      }
                      <div className='border-t border-gray-200 h-[50px]'>
                        <div className='grid grid-cols-2 gap-0'>
                          <div onClick={() => setIsChatWindow(chatDetails ? true : false)} className={`${isChatWindow && 'border-t border-red-500'} p-2 flex justify-center`}>
                            <svg className={`h-5 w-5 ${isChatWindow && 'text-red-500'}`} viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />  <line x1="8" y1="9" x2="16" y2="9" />  <line x1="8" y1="13" x2="14" y2="13" /></svg>
                          </div>

                          <div onClick={() => setIsChatWindow(false)} className={`${!isChatWindow && 'border-t border-red-500'} p-2 flex justify-center`}>
                            <svg className={`h-5 w-5 ${!isChatWindow && 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />  <circle cx="12" cy="7" r="4" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </footer>
      }
    </>
  );
};

export default ChatBox;
