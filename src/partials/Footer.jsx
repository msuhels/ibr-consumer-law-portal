import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import { GET_USER_DETAILS, GET_PLAIN_INFO } from "../API/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
// import site_logo from "../images/consumer-law-logo.png"
import site_logo from "../images/logo-light-mode.png";
import sites_logo from "../images/logo-dark-mode.png";
import { useDispatch, useSelector } from "react-redux";
import StickyAIHead from "../pages/component/StickyAIHead";
import CompanyLogo from "../components/CompanyLogo";

function Footer({ sidebarOpen, setSidebarOpen }) {
  const { appDetails } = useSelector(state => state.settings);
  const navigate = useNavigate();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [userData, setUserData] = useState("");

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);


  return (
    <>

      <footer className="bg-white dark:bg-gray-900 border-t-8 border-[#CB1A17]">
        <div className="mx-auto w-full max-w-screen-xl p-3 py-6 lg:py-8 pl-10">
          {/* <div className="md:flex md:justify-between p-5 m-5"> */}
          <div className="mb-6 lg:mr-5 md:flex md:justify-center pe-20">
            {/* {appDetails &&
              <>
                {appDetails?.logo ?
                  <> <img width={350} src={appDetails?.logo}></img> </>
                  : */}
            <>
              {/* <img src={sites_logo} width={250} alt="FlowBite Logo" /> */}
              {(user?.role === "agent" || user?.role === "agency_agent" || user?.role === "client") && !(user?.plan_name === "1" || user?.plan_name === "5") ?
                <CompanyLogo user={user} userData={userData} />
                :
                <img src={sites_logo} width={250} alt="FlowBite Logo" />
              }
            </>
            {/* }
              </>
            } */}
          </div>
          <div className="md:flex md:justify-center">

            {/* <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3"> */}
            <div className="grid md:grid-cols-3 gap-0">
              <div>
                <h2 className="mb-6 font-semibold text-black dark:text-white">Services</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-2">
                    <a href="http://www.consumerlawdispute.ai/about" className="hover:underline text-xs dark:text-white">About Us</a>
                  </li>
                  <li className="mb-2">
                    <a href="http://www.consumerlawdispute.ai/contact" className="hover:underline text-xs dark:text-white">Contact</a>
                  </li>
                  <li className="mb-2">
                    <a href="http://www.consumerlawdispute.ai/pricing" className="hover:underline text-xs dark:text-white">Pricing</a>
                  </li>
                  {/* <li className="mb-2">
                    <a href="https://consumerlawsecrets.freshdesk.com/support/home" className="hover:underline text-sm dark:text-white">Help</a>
                  </li> */}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 font-semibold text-black dark:text-white">Products</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-2">
                    <a href="http://www.consumerlawdispute.ai/terms-conditions" className="hover:underline dark:text-white text-xs">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="http://www.consumerlawdispute.ai/privacy-policy" className="hover:underline dark:text-white text-xs">Privacy Policy</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 font-semibold text-black dark:text-white">Contacts</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-2">
                    <a href="#" className="hover:underline dark:text-white text-xs">
                      <span className="">Address: </span> USA</a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="hover:underline dark:text-white text-xs">
                      support@consumerlawdispute.ai
                    </a>
                  </li>
                  {/* <li className="mb-2">
                    <a href="#" className="hover:underline dark:text-white text-xs">844-963-5463 </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="text-center">
            <span className="text-sm text-gray-500 sm:text-center dark:text-white">Copyright © 2024 ConsumerLawDispute. AI All Rights Reserved.
            </span>
          </div>
        </div>

        {/* {!(user?.plan_name === "1" || user?.plan_name === "5") && */}
        <StickyAIHead />
        {/* } */}
      </footer>
    </>
  );
}

export default Footer;
