import React, { useEffect, useRef, useState } from "react";
import UserAvatar from "../../images/user-128.png";
import User01 from "../../images/user-40-11.jpg";
import User02 from "../../images/user-40-12.jpg";
import ChatImage from "../../images/chat-image.jpg";
import { GET_MESSAGE } from "../../API/api";
import axios from "axios";
import Loder from "../../partials/Loder";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Moment from "moment";

function ChatsBody({ chatID, messageList, setMessageList, currentChatUser }) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  let prevTimestamp = null;

  const [isFetched, setIsFetched] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalpage, setTotalpage] = useState(0);
  const getAllMessages = async () => {
    setIsFetched(false);
    try {
      const response = await axios.post(
        GET_MESSAGE,
        { chat_id: chatID, pageNumber },
        { headers: { Authorization: "Bearer " + token } }
      );
      setMessageList(response.data.chats);
      setTotalpage(response.data.total_page);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(true);
      console.log(error);
    }
  };
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

  const formatTimestamp = (timestamp) => {
    const now = Moment();
    const messageTime = Moment(timestamp);

    if (now.diff(messageTime, "days") < 1) {
      // If the message was sent today, display "today"
      return "Today";
    } else if (now.diff(messageTime, "days") === 1) {
      // If the message was sent yesterday, display "yesterday"
      return "Yesterday";
    } else if (now.diff(messageTime, "weeks") < 1) {
      // If the message was sent within the last week, display "x days ago"
      return messageTime.fromNow();
    } else {
      // If the message was sent more than a week ago, display the full date
      return messageTime.format("MMM DD, YYYY");
    }
  };
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container whenever messageList changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <>
      {chatID ? (
        <div
          ref={chatContainerRef}
          className="overflow-y-auto no-scrollbar grow px-4 sm:px-6 md:px-8 md:mx-16 py-6 bg-white"
        >
          <div className="">
            {!isFetched ? (
              <div className="flex h-screen">
                <div className="m-auto">
                  <Loder />
                </div>
              </div>
            ) : (
              <>
                {pageNumber < totalpage && (
                  <div className="text-center">
                    <button
                      className="text-[#bd0808] underline"
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      Read More
                    </button>
                  </div>
                )}
                {messageList &&
                  messageList.map((messageContent, i) => {
                    if (chatID == messageContent.chat_id) {
                      let title = formatTimestamp(messageContent.createdAt);

                      // Check if the current message's timestamp is different from the previous one
                      const renderTitle = prevTimestamp !== title;

                      // Update the previous timestamp with the current one
                      prevTimestamp = title;
                      let createdAt = Moment(messageContent.createdAt).format(
                        "H:mm"
                      );

                      return (
                        <>
                          {renderTitle && title && (
                            <div className="flex justify-between items-center px-8 sm:px-16 mb-8 md:ml-8 md:mr-8">
                              <span className="border border-solid border-[#EEEFF1] flex-grow "></span>
                              <span className="text-white bg-black rounded-full px-3 py-1 mx-2 text-sm">
                                {title}
                              </span>
                              <span className="border border-solid border-[#EEEFF1] flex-grow "></span>
                            </div>
                          )}
                          <div key={i} className="mt-4">
                            <div
                              className={`flex items-start mb-4 last:mb-0 ${
                                messageContent?.sender_id == user._id
                                  ? "justify-end"
                                  : ""
                              } `}
                            >
                              <div>
                                <div className="text-[8px] text-right mb-1">
                                  <span
                                    className={`flex ${
                                      messageContent?.sender_id == user._id
                                        ? "justify-end"
                                        : ""
                                    }`}
                                  >
                                    {/* {messageContent?.sender_id == user._id ? 'You' : `${currentChatUser[0]?.owner[0]?.name}`} */}
                                    {/* {messageContent?.sender_id === currentChatUser[0]?.client_id ? `${currentChatUser[0]?.client[0]?.name}` :
                                messageContent?.sender_id === currentChatUser[0]?.agent_id ? `${currentChatUser[0]?.agent[0]?.name}` :
                                  messageContent?.sender_id == user._id ? "You"
                                    : "admin"} */}
                                    <img
                                      class="rounded-full border-[1.5px] border-red-700 content-fit"
                                      src={UserAvatar}
                                      width="30"
                                      height="30"
                                      alt="User"
                                    />
                                  </span>
                                </div>
                                {messageContent?.videos && (
                                  <div
                                    className="flex justify-start cursor-pointer mb-3"
                                    onClick={() => {
                                      if (messageContent?.videos) {
                                        window.open(
                                          messageContent.videos,
                                          "_blank"
                                        );
                                      } else {
                                        console.error("No document URL found");
                                      }
                                    }}
                                  >
                                    {/* Determine SVG Based on File Type */}
                                    {(() => {
                                      const fileUrl =
                                        messageContent?.videos || "";
                                      const fileExtension = fileUrl
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();

                                      const svgClasses =
                                        "bg-gray-200 border border-gray-400 rounded p-3";

                                      switch (fileExtension) {
                                        case "mp4":
                                        case "mov":
                                        case "avi":
                                          return (
                                            <svg
                                              className={svgClasses}
                                              xmlns="http://www.w3.org/2000/svg"
                                              x-bind:width="size"
                                              x-bind:height="size"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              x-bind:stroke-width="stroke"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              width="200"
                                              height="200"
                                              stroke-width="2"
                                            >
                                              <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
                                              <path d="M10 9l5 3l-5 3z"></path>
                                            </svg>
                                          );

                                        default:
                                          return (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className={svgClasses}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              width="200"
                                              height="200"
                                            >
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                                              <path d="M14 3v5h5"></path>
                                              <text
                                                x="9"
                                                y="17"
                                                fontSize="8"
                                                fill="currentColor"
                                              >
                                                FILE
                                              </text>
                                            </svg>
                                          );
                                      }
                                    })()}
                                  </div>
                                )}
                                {messageContent?.documents && (
                                  <div
                                    className="flex justify-start cursor-pointer mb-2 mt-2"
                                    onClick={() => {
                                      if (messageContent?.documents) {
                                        window.open(
                                          messageContent.documents,
                                          "_blank"
                                        );
                                      } else {
                                        console.error("No document URL found");
                                      }
                                    }}
                                  >
                                    {/* Determine SVG Based on File Type */}
                                    {(() => {
                                      const fileUrl =
                                        messageContent?.documents || "";
                                      const fileExtension = fileUrl
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();

                                      const svgClasses =
                                        "bg-gray-200 border border-gray-400 rounded p-2";

                                      switch (fileExtension) {
                                        case "pdf":
                                          return (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className={svgClasses}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              width="200"
                                              height="200"
                                            >
                                              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                              <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                                              <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6"></path>
                                              <path d="M17 18h2"></path>
                                              <path d="M20 15h-3v6"></path>
                                              <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"></path>
                                            </svg>
                                          );
                                        case "doc":
                                        case "docx":
                                          return (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className={svgClasses}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              width="200"
                                              height="200"
                                            >
                                              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                              <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                                              <path d="M2 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"></path>
                                              <path d="M17 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"></path>
                                              <path d="M9.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5z"></path>
                                              <path d="M19.5 15l3 6"></path>
                                              <path d="M19.5 21l3 -6"></path>
                                            </svg>
                                          );
                                        case "mp4":
                                        case "mov":
                                        case "avi":
                                          return (
                                            <svg
                                              className={svgClasses}
                                              xmlns="http://www.w3.org/2000/svg"
                                              x-bind:width="size"
                                              x-bind:height="size"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              x-bind:stroke-width="stroke"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              width="200"
                                              height="200"
                                              stroke-width="2"
                                            >
                                              <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
                                              <path d="M10 9l5 3l-5 3z"></path>
                                            </svg>
                                          );

                                        default:
                                          return (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className={svgClasses}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              width="200"
                                              height="200"
                                            >
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                                              <path d="M14 3v5h5"></path>
                                              <text
                                                x="9"
                                                y="17"
                                                fontSize="8"
                                                fill="currentColor"
                                              >
                                                FILE
                                              </text>
                                            </svg>
                                          );
                                      }
                                    })()}
                                  </div>
                                )}
                                {messageContent?.doc && (
                                  <div className="flex justify-end">
                                    <img
                                      src={messageContent?.doc}
                                      width={200}
                                      alt="signature"
                                      style={{ borderRadius: "40px" }}
                                      className=" my-3"
                                    />
                                  </div>
                                )}
                                {messageContent.message && (
                                  <div
                                    className={` ${
                                      messageContent?.sender_id == user._id
                                        ? "bg-black text-white border border-[#D4D5DB]"
                                        : "bg-[#EEF0F0] text-black"
                                    } text-sm px-6 py-2.5 rounded-full  mb-1`}
                                  >
                                    {messageContent.message}
                                  </div>
                                )}

                                <div
                                  className={`text-xs text-slate-500 font-medium ${
                                    messageContent?.sender_id == user._id
                                      ? "text-right"
                                      : ""
                                  }`}
                                >
                                  {createdAt}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })}
                <div
                  className="flex items-start mb-4 last:mb-0"
                  style={{ display: "none" }}
                >
                  <div>
                    <div className="text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1">
                      <svg
                        className="fill-current text-slate-400 dark:text-slate-500"
                        viewBox="0 0 15 3"
                        width="15"
                        height="3"
                      >
                        <circle cx="1.5" cy="1.5" r="1.5">
                          <animate
                            attributeName="opacity"
                            dur="1s"
                            values="0;1;0"
                            repeatCount="indefinite"
                            begin="0.1"
                          />
                        </circle>
                        <circle cx="7.5" cy="1.5" r="1.5">
                          <animate
                            attributeName="opacity"
                            dur="1s"
                            values="0;1;0"
                            repeatCount="indefinite"
                            begin="0.2"
                          />
                        </circle>
                        <circle cx="13.5" cy="1.5" r="1.5">
                          <animate
                            attributeName="opacity"
                            dur="1s"
                            values="0;1;0"
                            repeatCount="indefinite"
                            begin="0.3"
                          />
                        </circle>
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grow flex justify-center items-center px-4 sm:px-6 md:px-5 bg-white inline-block">
          <p className="text-center font-bold text-4xl">Let's chat</p>
        </div>
      )}
    </>
  );
}

export default ChatsBody;
