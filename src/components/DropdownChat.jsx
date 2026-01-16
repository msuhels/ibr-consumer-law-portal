import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import axios from 'axios';
import { GET_ALL_NOTIFICATION, GET_UNREAD_NOTIFICATION, MADE_READ_NOTIFICATION } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
// import notificationsIcon from "../images/dashboard_img/notifications-outline.png";
function DropdownUsersChat({
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
        className={`w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 border rounded-xl ${dropdownOpen && 'bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Chats</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2027 15.0281C20.1559 14.8594 20.259 14.625 20.3574 14.4562C20.3875 14.406 20.4204 14.3575 20.4559 14.3109C21.2979 13.0598 21.7482 11.5862 21.7496 10.0781C21.7637 5.75625 18.1168 2.25 13.6074 2.25C9.67461 2.25 6.39336 4.92656 5.62461 8.47969C5.5096 9.00632 5.45146 9.54377 5.45117 10.0828C5.45117 14.4094 8.95742 18.0094 13.4668 18.0094C14.184 18.0094 15.1496 17.7937 15.6793 17.6484C16.209 17.5031 16.734 17.3109 16.8699 17.2594C17.0093 17.2068 17.1569 17.1798 17.3059 17.1797C17.4683 17.1791 17.6293 17.2109 17.7793 17.2734L20.4371 18.2156C20.4954 18.2403 20.557 18.2561 20.6199 18.2625C20.7194 18.2625 20.8148 18.223 20.8851 18.1527C20.9554 18.0823 20.9949 17.987 20.9949 17.8875C20.9917 17.8446 20.9838 17.8022 20.9715 17.7609L20.2027 15.0281Z" stroke="#080D18" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M3.11534 10.875C2.50054 11.9795 2.20314 13.2325 2.256 14.4954C2.30886 15.7584 2.70993 16.9822 3.41487 18.0314C3.52315 18.195 3.58409 18.3216 3.56534 18.4064C3.54659 18.4913 3.00612 21.3066 3.00612 21.3066C2.99312 21.3724 2.99805 21.4406 3.0204 21.5039C3.04274 21.5673 3.08169 21.6234 3.13315 21.6666C3.20183 21.7213 3.28722 21.7507 3.37503 21.75C3.42195 21.7501 3.46839 21.7406 3.51143 21.7219L6.14628 20.6906C6.32762 20.6191 6.52992 20.6225 6.70878 20.7C7.59659 21.0459 8.57815 21.2625 9.56018 21.2625C10.878 21.2639 12.1726 20.9163 13.3125 20.2552" stroke="#080D18" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        </svg>

        {/* <img src={notificationsIcon} /> */}
        {/* <div className={`absolute top-0 right-0 w-2.5 h-2.5 ${allNotification.length > 0 ? "bg-rose-500" : 'bg-gray-300'}  border-2 border-white dark:border-[#182235] rounded-full`}></div> */}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
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

export default DropdownUsersChat;