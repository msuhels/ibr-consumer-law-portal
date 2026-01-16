import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import axios from 'axios';
import { GET_ALL_NOTIFICATION, GET_UNREAD_NOTIFICATION, MADE_READ_NOTIFICATION } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import notificationsIcon from "../images/dashboard_img/notifications-outline.png";

function DropdownUsersNotifications({
  align
}) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allNotification, setAllNotification] = useState([]);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const getAllNotification = async () => {
    try {
      const response = await axios.get(GET_ALL_NOTIFICATION,
        { headers: { "Authorization": "Bearer " + token } }
      );
      // setAllNotification(response?.data?.notifications);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  }

  const getUsersUnreadNotification = async () => {
    try {
      const response = await axios.post(GET_UNREAD_NOTIFICATION,
        { user_id: user?._id },
        { headers: { "Authorization": "Bearer " + token } }
      );
      if (response?.data?.message === "No records") {
        setAllNotification([]);
      } else {
        setAllNotification(response?.data?.notifications
        );
      }

    } catch (error) {
      toast.error("Something went Wrong");
    }
  }

  useEffect(() => {
    getUsersUnreadNotification();
  }, []);

  const doReadNotification = async () => {
    try {
      const response = await axios.post(MADE_READ_NOTIFICATION,
        { user_id: user?._id },
        { headers: { "Authorization": "Bearer " + token } }
      );
      if (response?.data?.message === "true") {
        setAllNotification([]);
      }
    } catch (error) {
      toast.error("Something went Wrong");
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={trigger}
        className={`w-12 h-10 flex items-center justify-center bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 border rounded-xl ${dropdownOpen && 'bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <img src={notificationsIcon} />
        {/* <div className={`absolute top-0 right-0 w-2.5 h-2.5 ${allNotification.length > 0 ? "bg-rose-500" : 'bg-gray-300'}  border-2 border-white dark:border-[#182235] rounded-full`}></div> */}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full  sm:mr-0 min-w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-4">Notifications</div>
          <ul>
            {allNotification.length > 0 && allNotification?.slice(0, 3)?.map((val, i) => {

              const words = val?.description?.split(' ');
              const truncatedDescription = words?.slice(0, 9).join(' ');
              return (
                <>
                  <li key={i} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                    <Link
                      className="block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20"
                      to="/notification"
                      onClick={() => { setDropdownOpen(!dropdownOpen); doReadNotification(); }}
                    >
                      <span className="block text-sm mb-2">📣 <span className="font-medium text-slate-800 dark:text-slate-100">{val?.title}</span></span>
                      <span className="text-sm text-slate-500 dark:text-slate-100">
                        {truncatedDescription}...
                      </span>
                      <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">
                        {val.created_at
                          ? new Date(val?.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                          : "-"}
                      </span>
                    </Link>
                  </li>
                </>
              )
            })}

            {allNotification && allNotification.length < 1 ?
              <span className="text-sm text-slate-500 dark:text-slate-100 block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20">There are no recent notifications</span>
              : ""
            }
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownUsersNotifications;