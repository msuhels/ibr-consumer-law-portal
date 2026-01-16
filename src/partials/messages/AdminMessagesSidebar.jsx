import React, { useState, useEffect } from 'react';
import ChannelMenu from './ChannelMenu';
import DirectMessages from './DirectMessages';
import Channels from './Channels';
import AdminChannelMenu from './AdminChannelMenu';
import AdminDirectMessages from './AdminDirectMessages';
import Cookies from "js-cookie";
import axios from 'axios';
import { CREATE_CHAT_ROOM, GET_CHAT_USERS } from "../../API/api";
import { toast } from 'react-toastify';
import Loder from '../../partials/Loder';

function AdminMessagesSidebar({
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
            className={`absolute bg-white z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${msgSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="sticky top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-72 xl:w-80 h-[calc(100dvh-64px)]">
                <div>
                    <div className="sticky top-0 z-10">
                        <div className="flex items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 h-16">
                            <div className="w-full flex items-center justify-between">
                                <AdminChannelMenu />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-4 overflow-auto ">
                        <form className="relative">
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
                        </form>
                        <AdminDirectMessages
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

export default AdminMessagesSidebar;