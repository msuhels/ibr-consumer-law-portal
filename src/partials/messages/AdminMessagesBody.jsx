import React, { useEffect, useState } from 'react';

import User01 from '../../images/user-40-11.jpg';
import User02 from '../../images/user-40-12.jpg';
import ChatImage from '../../images/chat-image.jpg';
import { GET_MESSAGE } from "../../API/api"
import axios from 'axios';
import Loder from '../../partials/Loder';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import Moment from 'moment';

function AdminMessagesBody({ chatID, messageList, setMessageList, currentChatUser, }) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isFetched, setIsFetched] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalpage, setTotalpage] = useState(0);
  const getAllMessages = async () => {
    setIsFetched(false);
    try {
      const response = await axios.post(GET_MESSAGE, { chat_id: chatID, pageNumber }, { headers: { "Authorization": "Bearer " + token } });
      setMessageList(response.data.chats);
      setTotalpage(response.data.total_page);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(true);
      console.log(error)
    }
  }
  useEffect(() => {
    if (chatID) {
      setMessageList(null);
      getAllMessages();
    }
  }, [chatID, pageNumber]);
  useEffect(() => {
    if (chatID) {
      setPageNumber(1);
    }
  }, [chatID]);

  return (
    <>
      {chatID ?
        <div className="grow px-4 sm:px-6 md:px-5 py-6 bg-white">
          {!isFetched ?
            <div className='flex h-screen'>
              <div className="m-auto">
                <Loder />
              </div>
            </div>
            :
            <>
              {pageNumber < totalpage &&
                <div className='text-center'>
                  <button className='text-[#bd0808] underline' onClick={() => setPageNumber(pageNumber + 1)}>Read More</button>
                </div>}
              {messageList && messageList.map((messageContent, i) => {
                if (chatID == messageContent.chat_id) {
                  let createdAt = Moment(messageContent.createdAt).format('DD-MM-YYYY H:m A');
                  return (
                    <div key={i}>
                      <div className={`flex items-start mb-4 last:mb-0 ${messageContent?.sender_id == user._id ? 'justify-end' : ''} `} >
                        <div>
                          <div className="text-[8px] mt-2 ml-1">
                            <span>
                              {/* {messageContent?.sender_id == user._id ? 'You' : `${currentChatUser[0]?.owner[0]?.name}`} */}
                              {messageContent?.sender_id === currentChatUser[0]?.client_id ? `${currentChatUser[0]?.client[0]?.name}` :
                                messageContent?.sender_id === currentChatUser[0]?.agent_id ? `${currentChatUser[0]?.agent[0]?.name}` :
                                  messageContent?.sender_id == user._id ? "You"
                                    : "admin"}
                            </span>
                          </div>
                          <div className={` ${messageContent?.sender_id == user._id ? 'bg-[#bd0808] text-white' : 'bg-white text-slate-800'} text-sm  dark:bg-slate-800  dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1`}>
                            {messageContent.message}

                          </div>
                          <div className="text-xs text-slate-500 font-medium">{createdAt}</div>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
              <div className="flex items-start mb-4 last:mb-0" style={{ display: "none" }}>
                <div>
                  <div className="text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1">
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
            </>
          }
        </div>
        :
        <div className="grow flex justify-center items-center px-4 sm:px-6 md:px-5 bg-white inline-block">
          <p className='text-center font-bold text-4xl'>Let's chat</p>
        </div>
      }
    </>
  );
}

export default AdminMessagesBody;