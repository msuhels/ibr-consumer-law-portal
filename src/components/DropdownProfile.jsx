import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import Cookies from "js-cookie";
import UserAvatar from "../images/user-128.png";
import { useCookies } from "react-cookie";
import { CookiesUrl, FrontendUrl } from "../Config";
import { GET_USER_NAME_BY_ID, GET_USER_DETAILS, LOGOUT_USER } from "../API/api";
import axios from "axios";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownUsersNotificationsNew";
import Help from "../components/DropdownHelpNew";
import UserMenu from "../components/DropdownProfile";
import logoSrc from "../images/ai-head.png";
import UserAvatarDarkHeader from "../images/user-128-dark.png";
import { useNavigate } from "react-router-dom";


function DropdownProfile({ align }) {
  const [cookies, setCookie, removeCookie] = useCookies(["user_token"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });
  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const Logout_User = async () => {
    try {
      const response = await axios.post(
        LOGOUT_USER,
        { id: user?._id, email: user?.email },
        { headers: { Authorization: "Bearer " + token } }
      );
      removeCookie("user_token", { domain: CookiesUrl });
      removeCookie("company_logo", { domain: CookiesUrl });
      // window.location.href = FrontendUrl;
      // window.location.href = `${FrontendUrl}/${response?.data?.signInLink}`;
      if (response?.data?.signInLink && response?.data?.signInLink != "") {
        navigate(`${response?.data?.signInLink}`);
      } else {
        window.location.href = FrontendUrl;
      }
      Cookies.remove("user_token");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const getUserName = async () => {
    try {
      let URL = GET_USER_NAME_BY_ID(user._id);
      const response = await axios.get(URL);
      setUserName(response.data.UserDetails);
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getUserName();
    getUserData();
  }, []);

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="rounded-full border-[1.5px] border-red-700 content-fit"
          // src={userData?.profile_pic ? userData?.profile_pic : UserAvatar}
          src={userData?.profile_pic ? userData?.profile_pic : user?.role === "client" ? UserAvatar : UserAvatarDarkHeader}
          width="30"
          height="30"
          alt="User"
        />
        <div
          className={`flex items-center truncate  ${(user?.role === "agent" || user?.role === "agency_agent") &&
              !(user?.plan_name === "1" || user?.plan_name === "5")
              ? "text-white"
              : "text-black"
            }`}
        >
          <span className="truncate ml-2 mr-2 text-lg font-medium text-gray hidden md:block lg:block  ">
            {userName ? userName : user?.name}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-bla"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === "right" ? "right-0" : "left-0"
          }`}
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
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                to="/profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Profile
              </Link>
            </li>
            <li>
              {userData?.authorizeNet_subscriptionId &&
                userData.role != "agency_agent" && (
                  <>
                    {userData?.plan_name === "2" ||
                      userData?.plan_name === "6" ||
                      userData?.plan_name === "8" ||
                      userData?.plan_name === "4" ||
                      userData?.plan_name === "3" ||
                      userData?.plan_name === "7" ? (
                      <Link
                        className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                        to="/subscription"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        Subscription
                      </Link>
                    ) : (
                      <Link
                        className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                        to={`/subscription/${user._id}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        Subscription
                      </Link>
                    )}
                  </>
                )}
            </li>
            <li style={{ display: "none" }}>
              <Link
                className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                to={`/chat-messages`}
              >
                Chat
              </Link>
            </li>
            {userData?.role != "client" && userData?.role != "agency_agent" && (
              <>
                {userData?.plan_name === "1" || userData?.plan_name === "5" ? (
                  <li>
                    <Link
                      className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                      to={`/plans/${user._id}`}
                    >
                      Change Plan
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to={`/plans`}
                      className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                    >
                      Change Plan
                    </Link>
                  </li>
                )}
              </>
            )}
            {userData?.role === "agent" && userData?.plan_name === "3" || userData?.plan_name === "7" ?
              <li>
                <Link
                  to={`/email-services`}
                  className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                >
                  Email Service
                </Link>
              </li>
              :
              ""
            }

            {/* {(userData?.plan_name == "4" || userData?.plan_name == "8" || userData.role =="client" || userData.role =="agency_agent") && */}
            {userData.role != "client" && userData.role != "agency_agent" &&
              <li>
                <Link
                  to={`/request-delete-account`}
                  className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                >
                  Delete My Data
                </Link>
              </li>
            }
            {/* } */}

            <li>
              <Link
                className="font-medium text-sm text-slate-500 hover:text-slate-800 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                onClick={() => Logout_User()}
              >
                Sign Out
              </Link>
            </li>
          </ul>
          <hr className="mt-4 md:hidden " />
          <div className="flex gap-3 justify-between mt-4 px-5 md:hidden">
            <div className="relative inline-flex items-center">
              <Link
                to={`/consumer-ai`}
                className={` flex items-center justify-center bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 border rounded-xl`}
                aria-haspopup="true"
              >
                <span className="sr-only">Notifications</span>
                <img
                  src={logoSrc}
                  alt="Chatbot Logo"
                  className="w-13 h-10 rounded-full"
                />
              </Link>
            </div>
            <Help align="right" />
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
