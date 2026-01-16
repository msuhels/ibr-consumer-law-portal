import React, { useState, useEffect, useRef } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import head_logo from "../ConsumerlawLogo.png"
import AdminMessagesSidebar from '../partials/messages/AdminMessagesSidebar';
import AdminMessagesHeader from '../partials/messages/AdminMessagesHeader';
import AdminMessagesBody from '../partials/messages/AdminMessagesBody';
import { io } from 'socket.io-client';
import AdminMessagesFooter from '../partials/messages/AdminMessagesFooter';
import Cookies from "js-cookie";
import axios from 'axios';
import { CHAT_USER, GET_CHAT_USERS, CREATE_CHAT_ROOM } from "../API/api"
import { toast } from 'react-toastify';
import { BackendDomainSocketUrl } from '../Config';

function AdminMessages() {
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const contentArea = useRef(null)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [msgSidebarOpen, setMsgSidebarOpen] = useState(true);
    const [chatID, setChatID] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [currentChatUser, setCurrentChatUser] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [totlaPage, setTotlaPage] = useState(1);
    const [isGetUser, setIsGetUser] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const refresh = async () => {
        try {
            const response = await axios.get(CREATE_CHAT_ROOM, { headers: { "Authorization": "Bearer " + token } });
            getChatUsers();
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }

    const getCurrentChatUser = async () => {
        try {
            const response = await axios.post(CHAT_USER,
                { chat_id: chatID, },
                { headers: { "Authorization": "Bearer " + token } }
            );
            setCurrentChatUser(response?.data);
        } catch (error) {
            toast.error("Something went Wrong");
        }
    }

    const getChatUsers = async () => {
        try {
            let URL = GET_CHAT_USERS(searchUser, pageNumber);
            const response = await axios.get(URL, { headers: { "Authorization": "Bearer " + token } });
            setAllUsers(response?.data?.chatUsers);
            setTotlaPage(response?.data?.total_page);
            setIsGetUser(false);
            setIsSearch(false);
        } catch (error) {
            console.log(error?.response?.data?.message);
            setIsGetUser(false);
            setIsSearch(false);
        }
    }

    useEffect(() => {
        if (contentArea.current.scrollTop > 150) {
            contentArea.current.scrollTop = 99999999;
        }
        getChatUsers();
    }, [messageList, searchUser, pageNumber]); // automatically scroll the chat and make the most recent message visible

    useEffect(() => {
        if (socket == null) {
            let soketConnection = io(BackendDomainSocketUrl);
            setSocket(soketConnection);
        }
        if (socket) {
            socket.on('disconnect', (reason, details) => {
                console.log(reason, details.message, details.description, details.context);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (chatID) {
            getCurrentChatUser();
        }
        setTimeout(() => {
            contentArea.current.scrollTop = 99999999;
        }, 3000);
    }, [chatID]);

    useEffect(() => {
        setIsGetUser(true);
    }, [searchUser, pageNumber]);

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if(searchUser){
            setIsSearch(true);
        }
    }, [searchUser]);



    return (
        <div className="flex h-[100dvh] overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden" ref={contentArea}>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="grow">
                    <div className=" lg:px-8pb-0 w-full max-w-9xl mx-auto">
                        <div className="relative flex h-[100vh] sm:h-full">
                            <AdminMessagesSidebar
                                msgSidebarOpen={msgSidebarOpen}
                                setMsgSidebarOpen={setMsgSidebarOpen}
                                setChatID={setChatID}
                                chatID={chatID}
                                allUsers={allUsers}
                                setAllUsers={setAllUsers}
                                getChatUsers={getChatUsers}
                                searchUser={searchUser}
                                setSearchUser={setSearchUser}
                                pageNumber={pageNumber}
                                setPageNumber={setPageNumber}
                                totlaPage={totlaPage}
                                isGetUser={isGetUser}
                                socket={socket}
                                isSearch={isSearch}
                            />

                            <div className={`grow static flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${msgSidebarOpen ? 'translate-x-1/3' : 'translate-x-0'}`}>
                                <AdminMessagesHeader
                                    msgSidebarOpen={msgSidebarOpen}
                                    setMsgSidebarOpen={setMsgSidebarOpen}
                                    chatID={chatID}
                                    currentChatUser={currentChatUser}
                                />

                                <AdminMessagesBody
                                    chatID={chatID}
                                    messageList={messageList}
                                    setMessageList={setMessageList}
                                    currentChatUser={currentChatUser}
                                />

                                <AdminMessagesFooter
                                    socket={socket}
                                    chatID={chatID}
                                    setMessageList={setMessageList}
                                    getChatUsers={getChatUsers}
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* <Footer></Footer> */}
            </div>
        </div>
    );
}

export default AdminMessages;