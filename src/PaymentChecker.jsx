import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios'; // Import Axios for making API requests
import { BackendUrl } from './Config';
import { CHECK_USER_SUBSCRIPTION_EXIST, CHECK_USER_SUBSCRIPTION } from "./API/api"
import { Link } from 'react-router-dom';

const PaymentChecker = ({ children }) => {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showSuscriptionPopup, setIsShowSuscriptionPopup] = useState(false);
  const [memberSubscriptionExpirePopup, setIsMemberSubscriptionExpirePopup] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");


  const checkPaymentStatus = async (userId) => {
    try {
      const response1 = await axios.post(CHECK_USER_SUBSCRIPTION, { id: userId });
      if (response1.data.data.role === "client") {
        if (!response1.data.data?.agreement_sign || response1.data.data.agreement_sign === undefined || response1.data.data.agreement_sign === 0) {
          return navigate(`/client-agreement/${userId}`);
        }

      }
      if (response1.data.check_payment_status === false) {
        if (response1.data.data.role === "agent") {
          return navigate("/check-subscription");
        } else if (response1.data.data.role === "agency_agent" || response1.data.data.role === "client") {
          setOwnerEmail(response1?.data?.owner_email);
          setIsMemberSubscriptionExpirePopup(true);
        }
      } else {
        const response = await axios.post(`${BackendUrl}/user/verify-user-payment`, { id: userId });
        if (!response.data.payment_status) {
          if (user.role != "mentee") {
            return navigate("/plans");
          }
        }
      }
    } catch (error) {
      console.log("Something went wrong");
    } finally {
      const response = await axios.post(CHECK_USER_SUBSCRIPTION_EXIST, { id: userId });
      if (response.data?.billingStatus === false) {
        setIsShowSuscriptionPopup(true)
      } else {
        setIsShowSuscriptionPopup(false)
      }
      setIsLoading(false); // Set loading to false when the request is complete
    }
  }

  useEffect(() => {
    const userToken = Cookies.get("user_token");
    if (userToken) {
      const userData = JSON.parse(userToken);
      if (userData.user._id) {
        checkPaymentStatus(userData.user._id);
      }
    } else {
      navigate("/signin");
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (showSuscriptionPopup) {
    return (
      <>
        {showSuscriptionPopup &&
          <div className="progress-loader-container ">
            <div className="plan-loadera mt-3" style={{ padding: "0px!important" }}>
              <div className="p-5 flex space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-500/30">
                  <svg className="w-4 h-4 shrink-0 fill-current text-red-500" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
                </div>
                <div>
                  <div className="mb-2">
                    <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Subscription billing Alert!</div>
                  </div>
                  <div className="text-sm mb-10">
                    <div className="space-y-2">
                      <p>Please fill your subscription billing details first,<br />to do futher operation.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end space-x-2">
                    <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setIsShowSuscriptionPopup(false); }}>Close</button>
                    <Link to={'/subscription'} className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setIsShowSuscriptionPopup(false); }}>Fill Billing Details</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </>
    );
  }

  if (memberSubscriptionExpirePopup) {
    return (
      <>
        {memberSubscriptionExpirePopup &&
          <div className="progress-loader-container ">
            <div className="plan-loadera mt-3" style={{ padding: "0px!important" }}>
              <div className="p-5 flex space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-500/30">
                  <svg className="w-4 h-4 shrink-0 fill-current text-red-500" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
                </div>
                <div>
                  <div className="mb-2">
                    <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Access Denied!</div>
                  </div>
                  <div className="text-sm mb-10">
                    <div className="space-y-2">
                      <p>Please contact the admin at <b>{ownerEmail}</b></p>
                    </div>
                  </div>
                  {/* <div className="flex flex-wrap justify-end space-x-2">
                    <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setIsShowSuscriptionPopup(false); }}>Close</button>
                    <Link to={'/subscription'} className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setIsShowSuscriptionPopup(false); }}>Fill Billing Details</Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        }
      </>
    )
  }



  return <>{children}</>;
};

export default PaymentChecker;
