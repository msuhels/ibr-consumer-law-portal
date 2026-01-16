import React, { useState, useEffect } from 'react';
import ChatsChannelMenu from './ChatsChannelMenu';
import ChatsDirectMessages from './ChatsDirectMessage';
import Cookies from "js-cookie";
import Loder from '../../partials/Loder';

function ChatsSidebar({
    msgSidebarOpen,
    setMsgSidebarOpen,
    setChatID,
    chatID,
    allUsers,
    setAllUsers,
    getChatUsers,
    setSearchUser,
    searchUser,
    pageNumber,
    setPageNumber,
    totlaPage,
    isGetUser,
    socket,
    isSearch
}) {
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [search, setSearch] = useState('');

    return (
        <div id="messages-sidebar"
            className={`absolute bg-[#FBFCFC] z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${msgSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="sticky top-16 bg-[#FBFCFC] dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border boreder-[#EEEFF1] rounded-[20px] md:w-72 xl:w-80 h-[calc(100dvh-138px)]">
                <div>
                    <div className="sticky top-0 z-10">
                        <div className="flex items-center bg-[#FBFCFC] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 h-16">
                            <div className="w-full flex items-center justify-between">
                                <ChatsChannelMenu />
                                {/* <div>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 8.75V15.9375C15 16.1427 14.9596 16.3459 14.8811 16.5354C14.8025 16.725 14.6874 16.8973 14.5424 17.0424C14.3973 17.1874 14.225 17.3025 14.0354 17.3811C13.8459 17.4596 13.6427 17.5 13.4375 17.5H4.0625C3.6481 17.5 3.25067 17.3354 2.95765 17.0424C2.66462 16.7493 2.5 16.3519 2.5 15.9375V6.5625C2.5 6.1481 2.66462 5.75067 2.95765 5.45765C3.25067 5.16462 3.6481 5 4.0625 5H10.6047" stroke="#080D18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17.9665 2.08009C17.9094 2.01737 17.8402 1.96688 17.763 1.93166C17.6859 1.89644 17.6024 1.87723 17.5176 1.87518C17.4328 1.87314 17.3485 1.8883 17.2698 1.91976C17.191 1.95122 17.1195 1.99832 17.0594 2.05821L16.5762 2.53907C16.5177 2.59767 16.4848 2.67713 16.4848 2.75997C16.4848 2.84282 16.5177 2.92227 16.5762 2.98087L17.0192 3.42306C17.0482 3.45223 17.0827 3.47538 17.1207 3.49118C17.1588 3.50697 17.1995 3.5151 17.2407 3.5151C17.2818 3.5151 17.3226 3.50697 17.3606 3.49118C17.3986 3.47538 17.4331 3.45223 17.4622 3.42306L17.9333 2.95431C18.1715 2.71642 18.1938 2.32892 17.9665 2.08009ZM15.5993 3.51564L8.5477 10.5547C8.50495 10.5973 8.47387 10.6501 8.45747 10.7082L8.1313 11.6797C8.12348 11.7061 8.12293 11.734 8.1297 11.7607C8.13646 11.7873 8.15029 11.8117 8.16973 11.8311C8.18918 11.8505 8.2135 11.8644 8.24015 11.8711C8.2668 11.8779 8.29478 11.8774 8.32114 11.8695L9.29184 11.5434C9.34991 11.527 9.40278 11.4959 9.44536 11.4531L16.4844 4.40079C16.5495 4.33497 16.5861 4.24612 16.5861 4.15353C16.5861 4.06094 16.5495 3.97208 16.4844 3.90626L16.0958 3.51564C16.0298 3.44992 15.9406 3.41302 15.8475 3.41302C15.7544 3.41302 15.6652 3.44992 15.5993 3.51564Z" fill="#080D18"/>
                                </svg>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-4 overflow-auto ">
                    {/* <form className="relative">
                            <label className="sr-only">
                                Search
                            </label>
                            <input
                                onChange={(e) => { setSearchUser(e.target.value) }}
                                value={searchUser}
                                className="form-input w-full pl-9 bg-white dark:bg-slate-800" type="search"
                                placeholder="Search…"
                            />
                            <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                                {!isSearch ?
                                    <svg
                                        className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2"
                                        viewBox="0 0 16 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                        <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                                    </svg>
                                    :
                                    <div className='ml-3'>
                                        <Loder />
                                    </div>
                                }
                            </button>
                        </form> */}
                        <ChatsDirectMessages
                            msgSidebarOpen={msgSidebarOpen}
                            setMsgSidebarOpen={setMsgSidebarOpen}
                            setSearch={setSearch}
                            search={search}
                            setChatID={setChatID}
                            chatID={chatID}
                            allUsers={allUsers}
                            setAllUsers={setAllUsers}
                            socket={socket}
                        />
                        <div>
                            <div className='flex justify-center mt-3'>
                                {isGetUser ?
                                    <Loder />
                                    :
                                    <>
                                        {pageNumber < totlaPage ?
                                            <button
                                                onClick={() => setPageNumber(pageNumber + 1)}
                                                className='text-indigo-500'>
                                                More...
                                            </button>
                                            : null
                                        }
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatsSidebar;