import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import PlansPanel from '../../partials/settings/PlansPanel';
import PayBg from '../../images/plann.png';
import AuthWrapper from '../../AuthWrapper';
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import react-toastify for showing notifications
import { useNavigate } from "react-router-dom";
import { GET_USER_DETAILS, UPDATE_USER_SUBSCRIPTION, START_USER_FREE_TRIAL } from "../../API/api";
import Footer from '../../partials/Footer';
import SubNavbar from '../../components/SubNavbar'

function Plans({ BackendUrl }) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [UserData, setUserData] = useState("");

  const navigate = useNavigate();
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUserData();
    if (UserData && UserData?.role === "mentee") {
      navigate("/profile");
    }
  }, []);
  
  useEffect(()=>{
    if (UserData && UserData?.role === "client") {
      navigate(`/dashboard/${UserData?._id}`);
    }
  },[UserData])

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };


  return (
    <AuthWrapper>
      <div className="flex h-[100dvh] overflow-hidden">

        {/* Sidebar */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
          {/*  Site header */}
          <Header />
          {(user?.role === "agent" || user?.role === "agency_agent") ?
            <SubNavbar />
            :
            ""
          }
          <main className="grow">
            <div className="relative pt-10	pb-10	bg-white">
              <div className="absolute inset-0 bg-slate-800 overflow-hidden bg-white" aria-hidden="true">
                {/* <img className="object-cover h-full w-full filter " src={PayBg} width="460" height="80" alt="Pay background" /> */}
              </div>
              <div className="relative px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="about- pt-5 pb-5 text-center">
                  <div className="container-fluid col-6">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="">
                          {UserData.payment_status === 1 ?
                            <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
                              Upgrade Your Plan</h1>
                            :
                            <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
                              Subscription</h1>
                          }

                          <p
                            className="mt-3 mb-4"
                          >
                            {/* Upgrade your plan today to unlock more features to help you navigate your credit journey. Save 20% when you upgrade for a yearly plan. */}
                            Select your plan today to unlock software features to help you navigate your credit journey. Save 20% when you enroll for a yearly plan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <PlansPanel BackendUrl={BackendUrl} />
          </main>
          {/* <Footer></Footer> */}
        </div>

      </div>
    </AuthWrapper>
  );
}

export default Plans;