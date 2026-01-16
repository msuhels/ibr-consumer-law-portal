import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import react-toastify for showing notifications
import { useNavigate } from "react-router-dom";
import { GET_USER_DETAILS, UPDATE_USER_SUBSCRIPTION, START_USER_FREE_TRIAL, GET_TRANSACTION_INFO, CHANGE_USER_PLAN } from "../../API/api";
import ModalBlank from '../../components/ModalBlank';
import { useParams } from "react-router-dom";


function PlansPanel({ BackendUrl }) {
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const userToken = Cookies.get("user_token");
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [mainLoader, setMainLoader] = useState(true);
  const [loaderSignin, setloaderSignin] = useState(false);
  const [UserData, setUserData] = useState("");
  const [getplan, setGetPlan] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [upgradeNewPlan, setupgradeNewPlan] = useState(false);
  const [basicLoader, setPasicLoader] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [primiumLoader, setPrimiumLoaderr] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);
  const [isAdditionalDays, setIsAdditionalDays] = useState("");
  const [newPlanDetails, setNewPlanDetails] = useState([{
    plan_name: "",
    time: "",
    amount: "",
  }]);
  const [isTrialStatus, setIsTrialStatus] = useState("");
  const [changePlanInfo, setChangePlanInfo] = useState({ cardNumber: '', Amount: '' });

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };


  const getPricingplan = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/user/get-pricing-plan`);
      setGetPlan(response?.data?.Plan);
    } catch (error) {
      toast.error(
        error.response.data.message ||
        "Sign in failed. Please check your credentials."
      );
    }
  };

  const CreateSubscription = async (Price_id, plan) => {
    if (plan === "basic_plan") {
      setPasicLoader(true);
    } else {
      setPrimiumLoaderr(true);
    }
    try {
      const response = await axios.post(`${BackendUrl}user/buy-subsciption`, {
        priceID: Price_id,
        userData: userToken,
      });
      let clientSecret = response.data.clientSecret;
      if (plan === "basic_plan") {
        setPasicLoader(false);
      } else {
        setPrimiumLoaderr(false);
      }
      if (response?.data?.clientSecret) {
        navigate("/pay", {
          state: { clientSecret },
        });
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
        "Sign in failed. Please check your credentials."
      );
      if (plan === "basic_plan") {
        setPasicLoader(false);
      } else {
        setPrimiumLoaderr(false);
      }
    }
  };

  useEffect(() => {
    if (id === "65cb54d7f186503864dd2a0f" || id === "65cb555bf186503864dd2a13") {
      var days = "";
      if (id === "65cb555bf186503864dd2a13") {
        days = 30;
      } else {
        days = 14;
      }
      startFreeTrial(days);
    } else {
      getPricingplan();
      getUserData();
    }
  }, []);

  function getRemainingDays(startDate, endDate) {
    const start = new Date();
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceMs = end - start;

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }

  const getTransactionInfo = async () => {
    try {
      const response = await axios.get(GET_TRANSACTION_INFO, {
        headers: { "Authorization": "Bearer " + token }
      });
      if (response?.data) {
        setChangePlanInfo(response?.data)
      }
    } catch (error) {
      console.log("Something went Wrong");
    }
  }

  useEffect(() => {
    getTransactionInfo();
  }, [])

  const upgradePlan = async (plan_name, time, amount) => {
    setNewPlanDetails([{
      plan_name: plan_name,
      time: time,
      amount: amount,
    }])

    // if (UserData?.plan_name === plan_name && UserData?.interval_length === "12") {
    //   return setInfoModalOpen(true);
    // }

    // if (UserData?.plan_name > plan_name) {
    //   return setInfoModalOpen(true);
    // }
    if (UserData?.is_trial === "true") {
      if (changePlanInfo?.cardNumber) {
        setIsTrialStatus("incomplete");
        setupgradeNewPlan(true);
      }
    } else {
      if (changePlanInfo?.cardNumber) {
        setIsTrialStatus("complete");
        setupgradeNewPlan(true);
      }
    }
  };

  const buyUpgradedPlan = async () => {
    setloaderSignin(true);
    try {
      const response = await axios.post(CHANGE_USER_PLAN,
        {
          planName: newPlanDetails[0].plan_name,
          plan_time: newPlanDetails[0].time,
          plan_amount: newPlanDetails[0].amount,
        },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      if (response.data) {

        getPricingplan();
        getUserData();
        setupgradeNewPlan(false);
        if(response?.data?.status) {
          toast.success(response.data.message);
        }else {
          toast.error(response.data.message);
        }
        setloaderSignin(false);
      };

    } catch (error) {
      setloaderSignin(false);
      toast.error("Something went Wrong");
    }
  };


  const startFreeTrial = async (val) => {
    try {
      const response = await axios.post(START_USER_FREE_TRIAL,
        {
          user_id: user?._id,
          day: val,
        },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      toast.success(response?.data?.message);
      {
        response?.data?.plan_name === "1" || response?.data?.plan_name === "5" ?
          navigate(`/dashboard/${user?._id}`)
          :
          navigate(`/clients`)

      }
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const getUserData = async () => {
    setMainLoader(true)
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data?.UserDetails);
      setMainLoader(false)
    } catch (error) {
      console.log("Something went Wrong");
    }
  };
  return (

    <div className="grow bg-white">

      {/* Panel body */}
      <div className="p-6 space-y-6">
        {/* Plans */}

        {UserData.payment_status === 1 && UserData.authorizeNet_subscriptionId ?
          <section>
            <div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <button
                    className={`mx-1 px-4 py-2 rounded-3xl focus:outline-none ${isMonthly ? 'btnn-background text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    onClick={() => setIsMonthly(true)}
                  >
                    Monthly Plan
                  </button>
                  <button
                    className={`mx-1 px-4 py-2 rounded-3xl focus:outline-none ${!isMonthly ? 'btnn-background text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    onClick={() => setIsMonthly(false)}
                  >
                    Yearly Plan (Save 20%)
                  </button>
                  {/* <div className="relative inline-block w-10 mx-3 align-middle select-none">
               <input
                 type="checkbox"
                 name="toggle"
                 id="toggle"
                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                 onClick={handleToggle}
               />
               <label
                 htmlFor="toggle"
                 className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${isMonthly ? 'toggle-label-monthly' : 'toggle-label-yearly'
                   }`}
               ></label>
             </div> */}
                </div>
                <div className="container mt-4">
                  {isMonthly ? (
                    <>
                      <div className="gap-10 flex justify-center">
                        {getplan && (
                          <>
                            <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="flex items-center mb-2 justify-between">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Standard
                                    </h2>
                                    {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ?
                                      <button
                                        className={`btn-sm bg-green-500 text-white`}
                                        style={{ borderRadius: "10px" }}
                                      >Active Plan
                                      </button>
                                      : ""}
                                  </header>

                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Consumers
                                  </p>
                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">97</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>

                                  {UserData?.is_trial === "true" ?
                                    <>
                                      <div className=" flex gap-4">
                                        <button
                                          className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                          disabled={UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? true : ""}
                                          onClick={() => upgradePlan("1", "MONTHLY", 97)}
                                        >
                                          {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? "Current Plan" : " Choose Plan"}
                                        </button>
                                      </div>
                                      <p className="mt-2 text-red-400">Currently you are on Trial plan</p>
                                    </>
                                    :
                                    <>
                                      <div className=" flex gap-4">
                                        <button
                                          className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                          disabled={UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? true : ""}
                                          onClick={() => upgradePlan("1", "MONTHLY", 97)}
                                        >
                                          {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? "Current Plan" : " Choose Plan"}
                                        </button>
                                      </div>
                                    </>
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  {/* List */}
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        MOST POPULAR
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (1 per user)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Certified Mail Service</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>

                                      <div className="text-sm"> Bi-weekly Demo Calls </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="flex items-center mb-2 justify-between">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Growth
                                    </h2>
                                    {UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ?
                                      <button
                                        className={`btn-sm bg-green-500 text-white`}
                                        style={{ borderRadius: "10px" }}
                                      >Active Plan
                                      </button>
                                      : ""}
                                  </header>
                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>

                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">297</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? true : ""}
                                      onClick={() => upgradePlan("2", "MONTHLY", 297)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Import up to 400 consumer reports.
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Access to FB Community</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Voice command Dispute Rebuttals</div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                            <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      {/* Enterprise */}
                                      Boss Up
                                      {UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ?
                                        <button
                                          className={`btn-sm bg-green-500 text-white ms-3`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Plan
                                        </button>
                                        : ""}
                                    </h2>
                                  </header>
                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>
                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">297</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? true : ""}
                                      onClick={() => upgradePlan("3", "MONTHLY", 297)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 12 team members.</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited storage</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited Affiliates & Leads</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Private Label Client Portal</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 1500 active clients</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">All our core features</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            <>
                              {/* <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Enterprise
                                      {UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ?
                                        <button
                                          className={`btn-sm bg-green-500 text-white ms-3`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Plan
                                        </button>
                                        : ""}
                                    </h2>
                                  </header>
                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">599</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? true : ""}
                                      onClick={() => upgradePlan("4", "MONTHLY", 599)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 24 team members
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited Affiliates & Leads
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 2400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        SAAS Mode (for agencies)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Landing Pages & Web Widgets
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (Multiple Users)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div> */}
                            </>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="gap-10 flex justify-center">
                        {getplan && (
                          <>
                            <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="flex items-center mb-2 justify-between">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Standard
                                    </h2>
                                    {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ?
                                      <button
                                        className={`btn-sm bg-green-500 text-white`}
                                        style={{ borderRadius: "10px" }}
                                      >Active Plan
                                      </button>
                                      : ""
                                    }
                                  </header>
                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Consumers
                                  </p>
                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  {UserData?.is_trial === "true" ?
                                    <>
                                      <div className=" flex gap-4">
                                        <button
                                          className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                          disabled={UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? true : ""}
                                          onClick={() => upgradePlan("5", "YEARLY", 970)}
                                        >
                                          {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? "Current Plan" : " Choose Plan"}
                                        </button>
                                      </div>
                                      <p className="mt-2 text-red-400">Currently you are on Trial plan</p>
                                    </>
                                    :
                                    <>
                                      <div className=" flex gap-4">
                                        <button
                                          className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                          disabled={UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? true : ""}
                                          onClick={() => upgradePlan("5", "YEARLY", 970)}
                                        >
                                          {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? "Current Plan" : " Choose Plan"}
                                        </button>
                                      </div>
                                    </>
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  {/* List */}
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        MOST POPULAR
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (1 per user)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Certified Mail Service</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>

                                      <div className="text-sm">Bi-weekly Demo Calls </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="flex items-center mb-2 justify-between">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Growth
                                    </h2>
                                    {UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ?
                                      <button
                                        className={`btn-sm bg-green-500 text-white`}
                                        style={{ borderRadius: "10px" }}
                                      >Active Plan
                                      </button>
                                      : ""}
                                  </header>
                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">2970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? true : ""}
                                      onClick={() => upgradePlan("6", "YEARLY", 2970)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>

                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Import up to 400 consumer reports.
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                            <>
                              <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      {/* Enterprise */}
                                      Boss Up
                                    </h2>
                                    {UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "1" ?
                                      <button
                                        className={`btn-sm bg-green-500 text-white`}
                                        style={{ borderRadius: "10px" }}
                                      >Active Plan
                                      </button>
                                      : ""}
                                  </header>

                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>
                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">2970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? true : ""}
                                      onClick={() => upgradePlan("7", "YEARLY", 2970)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>

                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  {/* List */}
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 12 team members.</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited storage</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited Affiliates & Leads</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Private Label Client Portal</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 1500 active clients</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">All our core features</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            <>
                              {/* <div className="relative  col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Enterprise
                                      {UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "1" ?
                                        <button
                                          className={`btn-sm bg-green-500 text-white`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Plan
                                        </button>
                                        : ""}
                                    </h2>
                                  </header>

                                  <p className="mt-2 pb-1" style={{ fontSize: "smaller" }}>
                                    Recommended For Credit Repair Business Owners
                                  </p>
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">5990</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  <div className=" flex gap-4">
                                    <button
                                      className={`py-2 px-8 rounded-3xl  w-full ${UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                      disabled={UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? true : ""}
                                      onClick={() => upgradePlan("8", "YEARLY", 3990)}
                                    >
                                      {UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? "Current Plan" : " Choose Plan"}
                                    </button>
                                  </div>

                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 24 team members
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited Affiliates & Leads
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 2400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        SAAS Mode (for agencies)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Landing Pages & Web Widgets
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (Multiple Users)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div> */}
                            </>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </section>
          :
          <section>
            <div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <button
                    className={`mx-1 px-4 py-2 rounded-3xl focus:outline-none ${isMonthly ? 'btnn-background text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    onClick={() => setIsMonthly(true)}
                  >
                    Monthly Plan
                  </button>
                  <button
                    className={`mx-1 px-4 py-2 rounded-3xl focus:outline-none ${!isMonthly ? 'btnn-background text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    onClick={() => setIsMonthly(false)}
                  >
                    Yearly Plan (Save 20%)
                  </button>
                  {/* <div className="relative inline-block w-10 mx-3 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    onClick={handleToggle}
                  />
                  <label
                    htmlFor="toggle"
                    className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${isMonthly ? 'toggle-label-monthly' : 'toggle-label-yearly'
                      }`}
                  ></label>
                </div> */}
                </div>
                <div className="container mt-4">
                  {isMonthly ? (
                    <>
                      <div className=" gap-10 flex justify-center">
                        {getplan && (
                          <>
                            <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                       <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <div className="flex justify-between">
                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Standard
                                      </h2>
                                      {(UserData?.plan_name === "3" && UserData?.is_trial === "true") &&
                                        <button
                                          className={`btn-sm bg-green-500 text-white`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Trial Plan
                                        </button>
                                      }
                                    </div>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                    Recommended For Consumers
                                    </p>
                                    {/* <p className="mt-2 mb-2" >
                                      Try for $67 the first month, then
                                    </p> */}
                                  </header>

                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">97</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  {/* CTA */}
                                  {
                                    basicLoader ? (
                                      <button
                                        className="btn  bg-indigo-500  w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className="">
                                          {UserData.role === "mentee" ?
                                            <button
                                              className={`btn text-white w-full tm-background text-white `}
                                              onClick={() =>
                                                navigate(`/pay/${"65cb54d7f186503864dd2a0f"}`)
                                              }
                                            >
                                              Buy Monthly
                                            </button>
                                            :
                                            <>
                                              <button
                                                disabled={UserData.role === "mentee" ? true : ""}
                                                className={`btn text-white w-full tm-background text-white`}
                                                onClick={() =>
                                                  navigate(`/pay/${"65cb54d7f186503864dd2a0f"}`)
                                                }
                                              >
                                                Buy Monthly
                                              </button>
                                              {/* {(UserData.is_trial === null || UserData.is_trial === "") &&
                                                <div className="flex items-center justify-center mt-3">
                                                  <button
                                                    className={`btn text-white w-full tm-background text-white`}
                                                    onClick={() => startFreeTrial(14)}
                                                  >
                                                    Start 14 days free trial

                                                  </button>
                                                </div>
                                              } */}
                                            </>
                                          }

                                        </div>
                                      </>
                                    )
                                    // <button className="btn tm-background text-white w-full" onClick={() => CreateSubscription(plan.price_id, "primium")}>Buy Plan</button>
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        MOST POPULAR
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (1 per user)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Certified Mail Service</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>

                                      <div className="text-sm">Bi-weekly Demo Calls </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <div className="flex justify-between">
                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                        Growth
                                      </h2>
                                      {(UserData?.plan_name === "2" && UserData?.is_trial === "true") &&
                                        <button
                                          className={`btn-sm bg-green-500 text-white`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Trial Plan
                                        </button>
                                      }
                                    </div>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                    <p className="mt-2 mb-2" >
                                      Try for $67 the first month, then
                                    </p>
                                  </header>

                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">297</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            onClick={() =>
                                              navigate(`/pay/${"65cb54eef186503864dd2a11"}`)
                                            }
                                          >
                                            Buy Monthly
                                          </button>
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Import up to 400 consumer reports.
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                            <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <div className="flex justify-between">
                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                        Boss Up
                                      </h2>
                                      {(UserData?.plan_name === "3" && UserData?.is_trial === "true") &&
                                        <button
                                          className={`btn-sm bg-green-500 text-white`}
                                          style={{ borderRadius: "10px" }}
                                        >Active Trial Plan
                                        </button>
                                      }
                                    </div>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                    {/* <p className="mt-2 mb-2" >
                                      Try for $67 the first month, then
                                    </p> */}
                                  </header>

                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">297</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  {/* CTA */}
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            disabled={UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? true : ""}
                                            onClick={() =>
                                              navigate(`/pay/${"65cb555bf186503864dd2a13"}`)
                                            }
                                          >
                                            Buy Monthly
                                          </button>
                                        </div>
                                        {/* {(UserData.is_trial === null || UserData.is_trial === "") &&
                                          <div className="flex items-center justify-center">
                                            <button
                                              className={`btn tm-background text-white w-full mt-3`}
                                              onClick={() => startFreeTrial(30)}
                                            >
                                              Start 30 days free trial
                                            </button>
                                          </div>
                                        } */}

                                      </>
                                    )
                                    // <button className="btn tm-background text-white w-full" onClick={() => CreateSubscription(plan.price_id, "primium")}>Buy Plan</button>
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  {/* List */}
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 12 team members.</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited storage</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited Affiliates & Leads</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Private Label Client Portal</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 1500 active clients</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">All our core features</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">

                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Enterprise
                                    </h2>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                    <p className="mt-2 mb-2" >
                                      Try for $67 the first month, then
                                    </p>
                                  </header>

                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">599</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /month
                                    </span>
                                  </div>
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            onClick={() =>
                                              navigate(`/pay/${"65cb5577f186503864dd2a15"}`)
                                            }
                                          >
                                            Buy Monthly
                                          </button>
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 24 team members
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited Affiliates & Leads
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 2400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        SAAS Mode (for agencies)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Landing Pages & Web Widgets
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (Multiple Users)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" gap-10 flex justify-center">
                        {getplan && (
                          <>
                            <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Standard
                                    </h2>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Consumers
                                    </p>
                                  </header>
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  {
                                    basicLoader ? (
                                      <button
                                        className="btn  bg-indigo-500  w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          {UserData.role === "mentee" ?
                                            <button
                                              className={`btn text-white w-full tm-background text-white `}
                                              onClick={() =>
                                                navigate(`/pay/${"65cb55bff186503864dd2a17"}`)
                                              }
                                            >
                                              Buy Yearly
                                            </button>
                                            :
                                            <button
                                              disabled={UserData.role === "mentee" ? true : ""}
                                              className={`btn text-white w-full ${UserData.role === "mentee" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                              onClick={() =>
                                                navigate(`/pay/${"65cb55bff186503864dd2a17"}`)
                                              }
                                            >
                                              Buy Yearly
                                            </button>
                                          }

                                        </div>
                                      </>
                                    )}
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        MOST POPULAR
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (1 per user)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Certified Mail Service</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5 shrink-0 text-red-500 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Growth
                                    </h2>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                  </header>

                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">2970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            onClick={() =>
                                              navigate(`/pay/${"65cb55cdf186503864dd2a19"}`)
                                            }
                                          >
                                            Buy Yearly
                                          </button>
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Import up to 400 consumer reports.
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                            <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      {/* Enterprise */}
                                      Boss Up
                                    </h2>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                  </header>

                                  {/* Price */}
                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">2970</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  {/* CTA */}
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            disabled={UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? true : ""}
                                            onClick={() =>
                                              navigate(`/pay/${"65cb566344d79250624476de"}`)
                                            }
                                          >
                                            Buy Yearly
                                          </button>
                                        </div>
                                      </>
                                    )
                                    // <button className="btn tm-background text-white w-full" onClick={() => CreateSubscription(plan.price_id, "primium")}>Buy Plan</button>
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  {/* List */}
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 12 team members.</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited storage</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Unlimited Affiliates & Leads</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Private Label Client Portal</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">Up to 1500 active clients</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">All our core features</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to FB Community
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Premium Support
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                            {/* <>
                              <div className="relative col-span-12 lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                <div
                                  className=""
                                  aria-hidden="true"
                                ></div>
                                <div className="px-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
                                  <header className="mb-2">
                                    <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                      Enterprise
                                    </h2>
                                    <p className="mt-2" style={{ fontSize: "smaller" }}>
                                      Recommended For Credit Repair Business Owners
                                    </p>
                                  </header>

                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                    <span className="text-2xl">$</span>
                                    <span className="text-3xl">5990</span>
                                    <span className="text-slate-500 font-medium text-sm">
                                      /Yearly
                                    </span>
                                  </div>
                                  {
                                    primiumLoader ? (
                                      <button
                                        className="btn  bg-indigo-500 w-full hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                                        disabled
                                      >
                                        <svg
                                          className="animate-spin w-4 h-4 fill-current shrink-0"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                        <span className="ml-2">Buy Plan</span>
                                      </button>
                                    ) : (
                                      <>
                                        <div className=" flex gap-4">
                                          <button
                                            className="btn tm-background text-white w-full"
                                            disabled={UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? true : ""}
                                            onClick={() =>
                                              navigate(`/pay/${"65cb562544d79250624476dc"}`)
                                            }
                                          >
                                            Buy Yearly
                                          </button>
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                                <div className="px-5 pt-4 pb-5">
                                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                                    What's included
                                  </div>
                                  <ul>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 24 team members
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited storage
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Unlimited Affiliates & Leads
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Private Label Client Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        Up to 2400 active clients
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <div className="text-sm">
                                        All our core features
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        SAAS Mode (for agencies)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Premium Support</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">Bi-weekly Demo Calls</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Dispute Software
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Letter Generator
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Learning Portal
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Landing Pages & Web Widgets
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Access to Unlimited Dispute Letters Library
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Import (Multiple Users)
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Credit Report Audit Wizard
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">ConsumerLaw.ai Chat</div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Certified Mail Service
                                      </div>
                                    </li>
                                    <li className="flex items-center py-1">
                                      <svg
                                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                                        viewBox="0 0 12 12"
                                      >
                                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                      </svg>
                                      <div className="text-sm">
                                        Voice command Dispute Rebuttals
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </> */}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </section>
        }

      </div>



      {
        infoModalOpen &&
        <div className="progress-loader-container ">
          <div className="plan-loadera1 mt-3" style={{ padding: "0px!important", color: '#080D18' }}>
            <div className="px-5 pt-5 flex space-x-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-500/30">
                <svg className="w-4 h-4 shrink-0 fill-current text-indigo-500" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                </svg>
              </div>
              <div>
                <div className="mb-2">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Subscription Alert!</div>
                </div>
                <div className="text-sm mb-3">
                  <div className="space-y-2">
                    <p>To downgrade your Plan please cancel your subscription,<br /> after expiry date ends of current plan you can Choose Plan. <br />Till than you can keep using all plan features</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center space-x-2 mb-2">
              <button className="btn-sm bg-gray-100 border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-full dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setInfoModalOpen(false); }}>Close</button>
            </div>
          </div>
        </div>
      }

      {
        upgradeNewPlan &&
        <div className="progress-loader-container ">
          <div className="plan-loadera1 mt-3" style={{ padding: "0px!important" }}>
            <div className="p-5 flex space-x-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-500/30">
                <svg className="w-4 h-4 shrink-0 fill-current text-indigo-500" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                </svg>
              </div>
              <div>
                <div className="mb-2">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Subscription Alert!</div>
                </div>
                <div className="text-sm mb-10">
                  <div className="space-y-2">
                    {(changePlanInfo?.Amount && changePlanInfo?.cardNumber && newPlanDetails[0]?.amount) ?
                    `We will refund $${changePlanInfo?.Amount} for the unused days to the card ending in ${changePlanInfo?.cardNumber} from your current subscription. The refund will be processed within the next 24-48 hours. The card saved in your account will be charged for the new subscription. You will be able to change your plan again within the next 48 hours.`
                      :
                      "Please close the alert popup and again open it"
                    }
                  </div>
                </div>
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn  tm-background text-white ml-3" onClick={(e) => { e.stopPropagation(); setupgradeNewPlan(false); }}>Close</button>
                  {loaderSignin
                    ?
                    <button className="btn   bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                      <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                      <span className="ml-2">Change Subcription</span>
                    </button>
                    :
                    <button className="btn  tm-background text-white ml-3" onClick={(e) => { e.stopPropagation(); buyUpgradedPlan(); }}>
                      Change Subcription
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }


      {mainLoader &&
        <div className="loader-container" style={{ zIndex: 99999 }}>
          <div className="loader"></div>
        </div>
      }
    </div >



  );
}

export default PlansPanel;
