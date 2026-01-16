import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Notification from '../../components/Notification';
import head_logo from "../../ConsumerlawLogo.png"
import AllNotification from '../../components/AllNotification';
import Footer from '../../partials/Footer';
import axios from 'axios';
import { GET_ALL_NOTIFICATION } from "../../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

function NotificationPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationWarningOpen, setNotificationWarningOpen] = useState(true);
    const [notificationErrorOpen, setNotificationErrorOpen] = useState(true);
    const [notificationSuccessOpen, setNotificationSuccessOpen] = useState(true);
    const [notificationInfoOpen, setNotificationInfoOpen] = useState(true);
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [allNotification, setAllNotification] = useState([]);

    const getAllNotification = async () => {
        try {
            const response = await axios.get(GET_ALL_NOTIFICATION,
                { headers: { "Authorization": "Bearer " + token } }
            );
            setAllNotification(response?.data?.notifications);
        } catch (error) {
            toast.error("Something went Wrong");
        }
    }

    useEffect(() => {
        getAllNotification();
    }, []);

    return (
        <>
            <div className="flex h-[100dvh] overflow-hidden">
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="grow bg-white dark:bg-[#FFFFFF]">
                        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                            <div className="sm:flex sm:justify-between sm:items-center mb-8">
                                <div className="mb-4 sm:mb-0 flex" >
                                    <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Notification</h1>
                                    {/* <img width={35} src={head_logo}></img> */}
                                </div>
                            </div>
                            <div className="border-slate-200 dark:border-slate-700">
                                <div className="space-y-8 mt-8">
                                    <div>
                                        <div className="space-y-3">
                                            {allNotification.length > 0 && allNotification.map((val, i) => {
                                                return (
                                                    <>
                                                        <AllNotification type="warning" open={notificationWarningOpen} setOpen={setNotificationWarningOpen}>
                                                            <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">{val?.title}</div>
                                                            <div>{val?.description}</div>
                                                            {val && val?.notifyLink ?
                                                                <div className="my-4">
                                                                    <a className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" target="_blank" href={`https://${val?.notifyLink}`}>
                                                                        {/* Action -&gt; */}
                                                                        {val?.notifyBtn}
                                                                    </a>
                                                                </div>
                                                                :
                                                                ""
                                                            }
                                                        </AllNotification>
                                                    </>
                                                )
                                            })}
                                            {/* <AllNotification type="warning" open={notificationWarningOpen} setOpen={setNotificationWarningOpen}>
                                                <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">Merged Pull Request</div>
                                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod tempor incididunt ut labore et dolore.</div>
                                            </AllNotification>

                                            <AllNotification type="success" open={notificationSuccessOpen} setOpen={setNotificationSuccessOpen}>
                                                <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">Merged Pull Request</div>
                                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod tempor incididunt ut labore et dolore.</div>
                                            </AllNotification>

                                            <AllNotification type="error" open={notificationErrorOpen} setOpen={setNotificationErrorOpen}>
                                                <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">Merged Pull Request</div>
                                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod tempor incididunt ut labore et dolore.</div>
                                            </AllNotification>

                                            <AllNotification open={notificationInfoOpen} setOpen={setNotificationInfoOpen}>
                                                <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">Merged Pull Request</div>
                                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod tempor incididunt ut labore et dolore.</div>
                                            </AllNotification> */}

                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </main>

                    {/* <Footer></Footer> */}
                </div>
            </div>

        </>
    );
}

export default NotificationPage;