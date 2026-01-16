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
import { useDispatch, useSelector } from "react-redux";

function Footer({ sidebarOpen, setSidebarOpen }) {
  const { appDetails } = useSelector(state => state.settings);
  const navigate = useNavigate();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));


  return (
    <>
      <footer className="bg-white dark:bg-gray-900" style={{ background: "#15171a" }}>
        <div className="mx-auto w-full max-w-screen-xl p-3 py-6 lg:py-8">
          {/* <div className="md:flex md:justify-between p-5 m-5"> */}
          <div className="md:flex">
            <div className="mb-6 lg:mr-5">
              {appDetails &&

                <>
                  {appDetails?.logo ?
                    <>
                      <img width={250} src={appDetails?.logo}></img>
                    </>
                    :
                    <>
                     
                        <img src={site_logo} width={250} alt="FlowBite Logo" />
                    </>}
                </>

              }
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  {/* <a href="#" className="text-white">The #1 AI Powered Consumer Law &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  Dispute Software.</a> */}
                  <a href="#" className="text-white">The #1 AI Powered Consumer <br /> Law Dispute Software.</a>
                </li>
              </ul>
            </div>
            {/* <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3"> */}
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 font-semibold  uppercase text-white">Services</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="http://www.consumerlawdispute.ai/about" className="hover:underline text-sm text-white">About Us</a>
                  </li>
                  <li className="mb-4">
                    <a href="http://www.consumerlawdispute.ai/contact" className="hover:underline text-sm text-white">Contact</a>
                  </li>
                  <li className="mb-4">
                    <a href="http://www.consumerlawdispute.ai/pricing" className="hover:underline text-sm text-white">Pricing</a>
                  </li>
                  <li className="mb-4">
                    <a href="https://consumerlawsecrets.freshdesk.com/support/home" className="hover:underline text-sm text-white">Help</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 font-semibold uppercase text-white">Quick Links</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="http://www.consumerlawdispute.ai/terms-conditions" className="hover:underline text-white text-sm">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="http://www.consumerlawdispute.ai/privacy-policy" className="hover:underline text-white text-sm">Privacy Policy</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 font-semibold uppercase text-white">Contacts</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline text-white text-sm">
                      <span className="font-bold	 ">Address: </span>
                      USA</a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline text-white text-sm">
                      <span className="font-bold">Email: </span>support@consumerlawdispute.ai</a>
                  </li>
                  {/* <li className="mb-4">
                    <a href="#" className="hover:underline text-white text-sm">
                      <span className="font-bold	 ">Phone: </span>
                      844-963-5463</a>
                  </li> */}
                </ul>
              </div>

            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          {/* <div className="sm:flex sm:items-center sm:justify-between"> */}
          <div className="text-center">
            <span className="text-sm text-gray-500 sm:text-center text-white">Copyright © 2023 ConsumerLawDispute. AI All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
