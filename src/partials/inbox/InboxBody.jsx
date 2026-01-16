import React, { useState, useEffect, useRef } from 'react';
import Mail from './Mail';
import { OPEN_AI_CHAT, GET_ALL_OPEN_AI_CHAT, GET_CHAT_ID_WITH_DATA } from "../../API/api"
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { useParams } from "react-router-dom";
import moment from 'moment';
import ModalBasic from '../../components/ModalBasic';
import MondalBasicOne from '../../components/ModalBasicOne';
import mike_img from '../../images/mike.png';
import stop_mike_img from "../../images/stop_mike_img.png"

function InboxBody({
  inboxSidebarOpen,
  setInboxSidebarOpen,
}) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [isChatId, setIsChatId] = useState('');
  const [isOpenAiChat, setIsOpenAiChat] = useState([]);
  const [showAiTyping, setShowAiTyping] = useState(false);
  const [loaderUpload, setloaderUpload] = useState(false);
  const [isChatIdData, setIsChatIdData] = useState([]);
  const [messagesPerPage, setIsMessagesPerPage] = useState("");
  const [scrollbarModalOpen, setScrollbarModalOpen] = useState(false)
  const [scrollbarModalOpenTwo, setScrollbarModalOpenTwo] = useState(false)
  const [scrollbarModalOpenThree, setScrollbarModalOpenThree] = useState(false)
  const [scrollbarModalOpenFour, setScrollbarModalOpenFour] = useState(false)
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');


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
    stopListening()
    var data = 10;
    setloaderUpload(true);
    setShowAiTyping(true);
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
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
    setIsChatId(chat_id)
    var data = 10;
    getOpenAiChat(data, chat_id);
  };

  const calculateTextAreaRows = (text) => {
    const rows = text.split('\n').length;
    return rows < 5 ? rows : 2; // Limit to 5 rows
  };

  // Function to handle key down events (e.g., sending the message on Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding new line
      handleOpenAI(); // Sends the message
    }
  };

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  const openNewChat = async (chat_id) => {
    getOpenAiChat(chat_id);
    setIsChatId("")
  };
  const handleLoadMore = () => {
    var data = messagesPerPage + 10;
    getOpenAiChat(data, isChatId);

  };


  return (

    <>
      <div
        id="inbox-sidebar"
        className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${inboxSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="sticky top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-72 xl:w-80 h-[calc(100dvh-64px)]">
          <div>
            <div className="px-5 py-4">
              <div className="mt-4">
                <div className="text-xl font-bold text-slate-400 dark:text-slate-500 text-right mb-3 flex justify-end">
                  <h1 className='mr-2'>New Chat</h1>
                  <button onClick={() => openNewChat("")} className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 mr-3">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z" />
                    </svg>
                  </button>
                </div>
                <hr></hr>
                <ul className="mb-6">
                  {isChatIdData?.map((data, index) => {
                    var momentDate = moment(data.created_at);
                    if (moment().diff(momentDate, 'days') > 1) {
                      momentDate = momentDate.format('YYYY-MM-DD');
                    } else {
                      momentDate = momentDate.fromNow();
                    }
                    return (
                      <li className="-mx-2 mt-2">
                        <button style={data?.chat_id === isChatId ? { background: "#cd2021" } : {}} className="flex w-full p-2 rounded bg-indigo-100 dark:bg-indigo-500/30 text-left" onClick={() => getChatData(data?.chat_id)}>
                          <div className="grow truncate">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="truncate">
                                <div style={data?.chat_id === isChatId ? { color: "white" } : {}} className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate mb-0.5">
                                  {data?.isLog ? (data?.message.slice(0, 17) + '...') : data?.message}
                                </div>

                              </div>
                              <div style={data?.chat_id === isChatId ? { color: "white" } : {}} className="text-xs text-slate-500 font-medium">{momentDate}</div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${inboxSidebarOpen ? 'translate-x-1/3' : 'translate-x-0'
          }`}
      >

        <div className="sticky top-16">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-[#161F32] border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
            <div className="flex">
            </div>
            <div className="flex items-center">
              <div>
                <ul className="flex flex-wrap justify-center mb-2">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm tm-background text-white" aria-controls="scrollbar-modal" onClick={(e) => { e.stopPropagation(); setScrollbarModalOpen(true); }}>Explore Credit Repair Prompts</button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm tm-background text-white" onClick={(e) => { e.stopPropagation(); setScrollbarModalOpenTwo(true); }}>Explore FDCPA prompts</button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm tm-background text-white" onClick={(e) => { e.stopPropagation(); setScrollbarModalOpenThree(true); }}>Explore TILA prompts</button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover.border-slate-300 dark.hover-border-slate-600 shadow-sm tm-background text-white" onClick={(e) => { e.stopPropagation(); setScrollbarModalOpenFour(true); }}>Explore FCRA prompts
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grow px-4 sm:px-6 md:px-5 py-4">
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 px-6 divide-slate-200 dark:divide-slate-700">
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
              return (
                <>
                  <div className="grow px-4 sm:px-6 md:px-5 py-6">
                    {mail?.role === "ai" ?
                      <>
                        <div className="flex items-start mb-4 last:mb-0">
                          <div>
                            <div className="text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1">
                              <pre style={{ maxWidth: '100%', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                {mail.message}
                              </pre>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-500 font-medium">{moment(mail.created_at).format('h:mm A')}</div>
                            </div>
                          </div>
                        </div>
                      </>
                      :
                      <>
                        <div className="flex items-start mb-4 last:mb-0 justify-end">
                          <div>
                            <div className="text-sm bg-indigo-500 text-white p-3 rounded-lg rounded-tl-none border border-transparent shadow-md mb-1">
                              <pre style={{ maxWidth: '100%', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                {mail.message}
                              </pre>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-500 font-medium">{moment(mail.created_at).format('h:mm A')}</div>
                              {/* <svg className="w-5 h-3 shrink-0 fill-current text-emerald-500" viewBox="0 0 20 12">
                                <path d="M10.402 6.988l1.586 1.586L18.28 2.28a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0L8.988 8.402l-2.293 2.293a1 1 0 01-1.414 0l-3-3A1 1 0 013.695 6.28l2.293 2.293L12.28 2.28a1 1 0 011.414 1.414l-3.293 3.293z" />
                              </svg> */}
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
                  <h1 className="mt-4  text-sm font-semibold text-slate-800 dark:text-slate-100 text-left truncate mb-4">CONSUMER AI</h1>
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
        </div>
        <div ref={bottomRef}></div>

        {/* Footer */}
        <div className="sticky bottom-0">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
            {listening ?
              <button>
                <img src={stop_mike_img} className='mike-img' alt='mike img' height={20} width={20} onClick={() => stopListening()} />
              </button>
              :
              <button>
                <img src={mike_img} onClick={() => startListening()} alt='mike img' className='mike-img' height={20} width={20} />
              </button>
            }
            {/* Message input */}
            <div className="grow mr-3">
              <label htmlFor="message-input" className="sr-only">
                Type a message
              </label>

              <textarea
                className="form-input w-full bg-slate-100  border-transparent dark:border-transparent focus:bg-white  placeholder-slate-500 items-center mt-2"
                value={inputMessage}
                rows={calculateTextAreaRows(inputMessage)}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ resize: 'none' }}
              />
            </div>
            {loaderUpload ?
              <button className="btn tm-background hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                </svg>
                <span className="ml-2">Send ...</span>
              </button>
              :
              <button className="btn tm-background hover:bg-indigo-600 text-white whitespace-nowrap" onClick={() => { handleOpenAI() }}>Send</button>
            }
          </div>
        </div>
      </div>


      <ModalBasic id="scrollbar-modal" modalOpen={scrollbarModalOpen} setModalOpen={setScrollbarModalOpen} title="Explore Credit Repair Prompts">
        <MondalBasicOne id={"scrollbar-modal"} setModalOpen={setScrollbarModalOpen} scrollbarModalOpen={scrollbarModalOpen} />
      </ModalBasic>

      <ModalBasic id="scrollbar-modal-2" modalOpen={scrollbarModalOpenTwo} setModalOpen={setScrollbarModalOpenTwo} title="Explore FDCPA prompts">
        <MondalBasicOne id={"scrollbar-modal-2"} setModalOpen={setScrollbarModalOpenTwo} setScrollbarModalOpenTwo={setScrollbarModalOpenTwo} />
      </ModalBasic>

      <ModalBasic id="scrollbar-modal-3" modalOpen={scrollbarModalOpenThree} setModalOpen={setScrollbarModalOpenThree} title="Explore TILA prompts">
        <MondalBasicOne id={"scrollbar-modal-3"} setModalOpen={setScrollbarModalOpenThree} setScrollbarModalOpenThree={setScrollbarModalOpenThree} />
      </ModalBasic>

      <ModalBasic id="scrollbar-modal-4" modalOpen={scrollbarModalOpenFour} setModalOpen={setScrollbarModalOpenFour} title="Explore FCRA prompts">
        <MondalBasicOne id={"scrollbar-modal-4"} setModalOpen={setScrollbarModalOpenFour} setScrollbarModalOpenFour={setScrollbarModalOpenFour} />
      </ModalBasic>
    </>
  );
}

export default InboxBody;
