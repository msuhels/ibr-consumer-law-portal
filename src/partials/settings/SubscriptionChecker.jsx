import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import react-toastify for showing notifications
import { useNavigate } from "react-router-dom";
import { GET_USER_DETAILS, UPDATE_USER_SUBSCRIPTION } from "../../API/api";
import ModalBlank from "../../components/ModalBlank";
import { BackendUrl } from "../../Config";
import Header from "../Header";
import PayBg from "../../images/plann.png";

function SubcriptionChecker() {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const userToken = Cookies.get("user_token");
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [loaderSignin, setloaderSignin] = useState(false);
  const [UserData, setUserData] = useState("");
  const [getplan, setGetPlan] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [upgradeNewPlan, setupgradeNewPlan] = useState(false);
  const [basicLoader, setPasicLoader] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [primiumLoader, setPrimiumLoaderr] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);
  const [isAdditionalDays, setIsAdditionalDays] = useState("");
  const [newPlanDetails, setNewPlanDetails] = useState([
    {
      plan_name: "",
      time: "",
      amount: "",
    },
  ]);
  const [isTrialStatus, setIsTrialStatus] = useState("");

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
    getPricingplan();
    getUserData();
  }, []);

  function getRemainingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceMs = end - start;

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }

  const upgradePlan = async (plan_name, time, amount) => {
    setNewPlanDetails([
      {
        plan_name: plan_name,
        time: time,
        amount: amount,
      },
    ]);
    const today = new Date();
    if (
      UserData?.plan_name === plan_name &&
      UserData?.interval_length === "12"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      (UserData?.plan_name === "6" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      (UserData?.plan_name === "2" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      UserData?.plan_name === "3" ||
      (UserData?.plan_name === "7" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    // const startDate = UserData?.start_date ? new Date(UserData.start_date) : null;
    if (UserData?.is_trial === "true") {
      setIsTrialStatus("incomplete");
      setupgradeNewPlan(true);
    } else {
      setIsTrialStatus("complete");
      const remainingDays = getRemainingDays(
        UserData?.start_date,
        UserData?.end_date
      );
      var planInDays = "";
      var planAmountPerDay = "";
      var remainingAmount = "";
      var newPlanInDays = "";
      var newPlanAmountPerDay = "";

      if (time === "MONTHLY") {
        newPlanInDays = 31;
      } else {
        newPlanInDays = 365;
      }

      if (UserData?.interval_length === "1") {
        planInDays = 31;
        planAmountPerDay = UserData?.plan_amount / planInDays;
        remainingAmount = planAmountPerDay * remainingDays;
        newPlanAmountPerDay = amount / newPlanInDays;
      } else {
        planInDays = 365;
        planAmountPerDay = UserData?.plan_amount / planInDays;
        remainingAmount = planAmountPerDay * remainingDays;
        newPlanAmountPerDay = amount / newPlanInDays;
      }
      setIsAdditionalDays(Math.floor(remainingAmount / newPlanAmountPerDay));
      setupgradeNewPlan(true);
    }
  };

  const buyUpgradedPlan = async () => {
    setloaderSignin(true);
    try {
      const response = await axios.post(
        UPDATE_USER_SUBSCRIPTION,
        {
          plan_name: newPlanDetails[0].plan_name,
          plan_time: newPlanDetails[0].time,
          plan_amount: newPlanDetails[0].amount,
          isAdditionalDays: isAdditionalDays,
          trialStatus: isTrialStatus,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.data) {
        getPricingplan();
        getUserData();
        setupgradeNewPlan(false);
        toast.success(response.data.msg);
        setloaderSignin(false);
      }
    } catch (error) {
      setloaderSignin(false);
      toast.error("Something went Wrong");
    }
  };

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

  const setDatasets = async (test) => {
    console.log(test, "test");
  };

  return (
    <>
      <div className="flex h-[100dvh] overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header></Header>
          <main className="grow">
            <div className="relative pt-10	pb-10	">
              {/* <div className="absolute inset-0 bg-slate-800 overflow-hidden" aria-hidden="true">
                                <img className="object-cover h-full w-full filter " src={PayBg} width="460" height="80" alt="Pay background" />
                            </div> */}
              <div className="relative px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="">
                  <div
                    className="plan-loadera2 mt-3"
                    style={{ padding: "0px!important" }}
                  >
                    <div className="sm:p-5 p-3 ">
                      {/* <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-500/30">
                  <svg className="w-4 h-4 shrink-0 fill-current text-red-500" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
                </div> */}
                      <div>
                        <div className="mb-2">
                          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Renew Subscripiton
                          </div>
                        </div>
                        {/* <div className="text-sm mb-6 sm:mb-8 flex ">
                                <button className="btn-sm w-full border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 p-4" disabled >Your expire account will be deleted on 01-01-2000 if no plan is chosen.</button>
                            </div> */}
                        <div className="">
                          <div className="sm:p-6 sm:space-y-4">
                            {UserData.payment_status === 1 &&
                            UserData.authorizeNet_subscriptionId ? (
                              <section>
                                <div className="text-sm mb-6 sm:mb-8 sm:flex sm:justify-between">
                                  <div className="space-y-2 mb-2 sm:mb-0 w-60 ">
                                    <p>
                                      You can subscribe, upgrade, downgrade and cancel your subscription at any time.
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <button
                                        className={`mx-1 px-4 py-2 rounded-md focus:outline-none ${
                                          isMonthly
                                            ? "bg-[#DDE0E3] text-[#080D18]"
                                            : "bg-white text-[#080D18]"
                                        }`}
                                        onClick={() => setIsMonthly(true)}
                                      >
                                        Monthly Plan
                                      </button>
                                      <button
                                        className={`mx-1 px-4 py-2 rounded-md focus:outline-none ${
                                          !isMonthly
                                            ? "bg-[#DDE0E3] text-[#080D18]"
                                            : "bg-white text-[#080D18]"
                                        }`}
                                        onClick={() => setIsMonthly(false)}
                                      >
                                        Yearly Plan (Save 20%)
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="container mt-4">
                                  {isMonthly ? (
                                    <>
                                      <div className="">
                                        {getplan && (
                                          <>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    {/* <div className="flex items-start">
                                                                                        <span className="text-2xl">$</span>
                                                                                        <span className="text-3xl">147</span>
                                                                                        <span className="text-slate-500 font-medium text-sm">
                                                                                            /month
                                                                                        </span>
                                                                                    </div> */}
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        147
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2 custom-margin">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Standard
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""} */}
                                                      </header>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For
                                                        Consumers
                                                      </p>
                                                    </div>
                                                    {UserData?.is_trial ===
                                                    "true" ? (
                                                      <>
                                                        <div className="flex items-end">
                                                          {/* <button
        className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
        disabled={UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? true : ""}
        onClick={() => upgradePlan("1", "MONTHLY", 147)}
    >
        {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" && UserData?.is_trial != "true" ? "Current Plan" : " Upgrade"}
    </button> */}

                                                          <>
                                                            <div>
                                                              <input
                                                                disabled={
                                                                  UserData?.plan_name &&
                                                                  UserData?.plan_name ===
                                                                    "1" &&
                                                                  UserData?.interval_length ===
                                                                    "1" &&
                                                                  UserData?.is_trial !=
                                                                    "true"
                                                                    ? true
                                                                    : ""
                                                                }
                                                                // className={`tm-color ${UserData.role === "mentee" ? "bg-gray-500	tm-color" : "tm-color"}`}
                                                                className={`${
                                                                  UserData?.plan_name &&
                                                                  UserData?.plan_name ===
                                                                    "1" &&
                                                                  UserData?.interval_length ===
                                                                    "1" &&
                                                                  UserData?.is_trial !=
                                                                    "true"
                                                                    ? "bg-gray-500	tm-color"
                                                                    : "tm-color"
                                                                }`}
                                                                onClick={() =>
                                                                  setTimeout(
                                                                    () => {
                                                                      upgradePlan(
                                                                        "1",
                                                                        "MONTHLY",
                                                                        147
                                                                      );
                                                                    },
                                                                    500
                                                                  )
                                                                }
                                                                type="checkbox"
                                                                id="scales"
                                                                name="scales"
                                                                // checked=""

                                                                style={{
                                                                  borderRadius:
                                                                    "50%",
                                                                  width: "25px",
                                                                  height:
                                                                    "25px",
                                                                }}
                                                              />
                                                              <label for="scales"></label>
                                                            </div>
                                                          </>
                                                        </div>
                                                        <p className="mt-2 text-red-400">
                                                          Currently you are on
                                                          Trial plan
                                                        </p>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <div className="flex items-end">
                                                          {/* <button
        className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
        disabled={UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? true : ""}
        onClick={() => upgradePlan("1", "MONTHLY", 147)}
    >
        {UserData?.plan_name && UserData?.plan_name === "1" && UserData?.interval_length === "1" ? "Current Plan" : " Upgrade"}
    </button> */}

                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "1" &&
                                                                UserData?.interval_length ===
                                                                  "1"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              // className={`tm-color ${UserData.role === "mentee" ? "bg-gray-500	tm-color" : "tm-color"}`}
                                                              className={` ${
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "1" &&
                                                                UserData?.interval_length ===
                                                                  "1"
                                                                  ? "bg-gray-500	tm-color"
                                                                  : "tm-color"
                                                              }`}
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    upgradePlan(
                                                                      "1",
                                                                      "MONTHLY",
                                                                      147
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        297
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Growth
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""} */}
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? true : ""}
onClick={() => upgradePlan("2", "MONTHLY", 297)}
>
{UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ? "Current Plan" : " Upgrade"}
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "2" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={`${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "2" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          onClick={() =>
                                                            setTimeout(() => {
                                                              upgradePlan(
                                                                "2",
                                                                "MONTHLY",
                                                                297
                                                              );
                                                            }, 500)
                                                          }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        399
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Boss Up
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""} */}
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? true : ""}
// onClick={() => upgradePlan("3", "MONTHLY", 399)}
>
 {UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? "Current Plan" : " Upgrade"}
Coming Soon
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "3" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={`${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "3" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          // onClick={() =>
                                                          //     setTimeout(() => {
                                                          //         upgradePlan("3", "MONTHLY", 399)
                                                          //     }, 500)
                                                          // }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        599
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Enterprise
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "2" && UserData?.interval_length === "1" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""} */}
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? true : ""}
// onClick={() => upgradePlan("4", "MONTHLY", 599)}
>
{UserData?.plan_name && UserData?.plan_name === "4" && UserData?.interval_length === "1" ? "Current Plan" : " Upgrade"}
Coming Soon
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "3" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={`${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "4" &&
                                                            UserData?.interval_length ===
                                                              "1"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          // onClick={() =>
                                                          //     setTimeout(() => {
                                                          //         upgradePlan("4", "MONTHLY", 599)
                                                          //     }, 500)
                                                          // }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="">
                                        {getplan && (
                                          <>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        1470
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2 custom-margin">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Standard
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""
                                                                                            } */}
                                                      </header>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For
                                                        Consumers
                                                      </p>
                                                    </div>
                                                    {UserData?.is_trial ===
                                                    "true" ? (
                                                      <>
                                                        <div className=" flex gap-4">
                                                          {/* <button
        className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
        disabled={UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? true : ""}
        onClick={() => upgradePlan("5", "YEARLY", 1470)}
    >
        {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" && UserData?.is_trial != "true" ? "Current Plan" : " Upgrade"}
    </button> */}

                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "5" &&
                                                                UserData?.interval_length ===
                                                                  "12" &&
                                                                UserData?.is_trial !=
                                                                  "true"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className={`${
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "5" &&
                                                                UserData?.interval_length ===
                                                                  "12" &&
                                                                UserData?.is_trial !=
                                                                  "true"
                                                                  ? "bg-gray-500	tm-color"
                                                                  : "tm-color"
                                                              }`}
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    upgradePlan(
                                                                      "5",
                                                                      "YEARLY",
                                                                      1470
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </div>
                                                        <p className="mt-2 text-red-400">
                                                          Currently you are on
                                                          Trial plan
                                                        </p>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <div className=" flex gap-4">
                                                          {/* <button
        className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
        disabled={UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? true : ""}
        onClick={() => upgradePlan("5", "YEARLY", 1470)}
    >
        {UserData?.plan_name && UserData?.plan_name === "5" && UserData?.interval_length === "12" ? "Current Plan" : " Upgrade"}
    </button> */}

                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "5" &&
                                                                UserData?.interval_length ===
                                                                  "12"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className={`${
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "5" &&
                                                                UserData?.interval_length ===
                                                                  "12"
                                                                  ? "bg-gray-500	tm-color"
                                                                  : "tm-color"
                                                              }`}
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    upgradePlan(
                                                                      "5",
                                                                      "YEARLY",
                                                                      1470
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        2970
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Growth
                                                        </h2>
                                                        {/* {UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ?
                                                                                                <button
                                                                                                    className={`btn-sm bg-green-500 text-white`}
                                                                                                    style={{ borderRadius: "10px" }}
                                                                                                >Active Plan
                                                                                                </button>
                                                                                                : ""} */}
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? true : ""}
onClick={() => upgradePlan("6", "YEARLY", 2970)}
>
{UserData?.plan_name && UserData?.plan_name === "6" && UserData?.interval_length === "12" ? "Current Plan" : " Upgrade"}
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "6" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={` ${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "6" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          onClick={() =>
                                                            setTimeout(() => {
                                                              upgradePlan(
                                                                "6",
                                                                "YEARLY",
                                                                2970
                                                              );
                                                            }, 500)
                                                          }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        3990
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Boss Up
                                                        </h2>
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? true : ""}
// onClick={() => upgradePlan("7", "YEARLY", 3990)}
>
{UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? "Current Plan" : " Upgrade"}
Coming Soon
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "7" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={`${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "7" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          // onClick={() =>
                                                          //     setTimeout(() => {
                                                          //         upgradePlan("7", "YEARLY", 3990)
                                                          //     }, 500)
                                                          // }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        5990
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Enterprise
                                                        </h2>
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {/* <button
className={`btn  w-full ${UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
disabled={UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? true : ""}
// onClick={() => upgradePlan("8", "YEARLY", 3990)}
>
{UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? "Current Plan" : " Upgrade"}
Coming Soon
</button> */}

                                                      <div>
                                                        <input
                                                          disabled={
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "8" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? true
                                                              : ""
                                                          }
                                                          className={`${
                                                            UserData?.plan_name &&
                                                            UserData?.plan_name ===
                                                              "8" &&
                                                            UserData?.interval_length ===
                                                              "12"
                                                              ? "bg-gray-500	tm-color"
                                                              : "tm-color"
                                                          }`}
                                                          // onClick={() =>
                                                          //     setTimeout(() => {
                                                          //         upgradePlan("7", "YEARLY", 3990)
                                                          //     }, 500)
                                                          // }
                                                          type="checkbox"
                                                          id="scales"
                                                          name="scales"
                                                          // checked=""

                                                          style={{
                                                            borderRadius: "50%",
                                                            width: "25px",
                                                            height: "25px",
                                                          }}
                                                        />
                                                        <label for="scales"></label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                              </div>
                                            </>
                                          </>
                                        )}
                                        
                                      </div>
                                    </>
                                  )}
                                </div>
                              </section>
                            ) : (
                              <section>
                                <div className="text-sm mb-6 sm:mb-8 flex justify-between">
                                  <div className="space-y-2 w-60">
                                    <p>
                                      You can subscribe, upgrade, downgrade and cancel your subscription at any time.
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-center">
                                      <button
                                        className={`mx-1 px-4 py-2 rounded-md focus:outline-none ${
                                          isMonthly
                                            ? "btnn-background text-white"
                                            : "bg-gray-300 text-gray-700"
                                        }`}
                                        onClick={() => setIsMonthly(true)}
                                      >
                                        Monthly Plan
                                      </button>
                                      <button
                                        className={`mx-1 px-4 py-2 rounded-md focus:outline-none ${
                                          !isMonthly
                                            ? "btnn-background text-white"
                                            : "bg-gray-300 text-gray-700"
                                        }`}
                                        onClick={() => setIsMonthly(false)}
                                      >
                                        Yearly Plan (Save 20%)
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="container mt-4">
                                  {isMonthly ? (
                                    <>
                                      <div className="">
                                        {getplan && (
                                          <>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        97
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                        {/* ( Start Your 14 Days Trial for $1 ) */}
                                                      </span>
                                                    </div>
                                                    <div className="mb-2 custom-margin">
                                                      <header className="flex items-center mb-2 justify-between">
                                                        <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                          Standard
                                                        </h2>
                                                      </header>
                                                      <p
                                                        className="mt-2 pb-1"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For
                                                        Consumers
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {basicLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     disabled={UserData.role === "mentee" ? true : ""}
                                                        //     className={`btn text-white w-full ${UserData.role === "mentee" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                                        //     onClick={() =>
                                                        //         navigate("/pay", {
                                                        //             state: {
                                                        //                 plan_name: "1",
                                                        //                 type: "MONTHLY",
                                                        //                 price: 1,
                                                        //                 subscription_amount: 147,
                                                        //                 trial: 14,
                                                        //                 plan_id: 1
                                                        //             },
                                                        //         })
                                                        //     }
                                                        // >
                                                        //     Buy Monthly
                                                        // </button>
                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData.role ===
                                                                "mentee"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className={`tm-color ${
                                                                UserData.role ===
                                                                "mentee"
                                                                  ? "bg-gray-500	tm-color"
                                                                  : "tm-color"
                                                              }`}
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/pay", {
                                                                    //     state: {
                                                                    //         plan_name: "1",
                                                                    //         type: "MONTHLY",
                                                                    //         price: 147,
                                                                    //         subscription_amount: 147,
                                                                    //         // trial: 14,
                                                                    //         plan_id: 1
                                                                    //     },
                                                                    // });
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb54d7f186503864dd2a0f"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              {/* <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        297
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Growth
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     disabled={UserData.role === "mentee" ? true : ""}
                                                        //     className="btn tm-background text-white w-full"
                                                        //     onClick={() =>
                                                        //         navigate("/renewal-pay", {
                                                        //             state: {
                                                        //                 plan_name: "2",
                                                        //                 type: "MONTHLY",
                                                        //                 price: 297,
                                                        //                 subscription_amount: 297,
                                                        //                 plan_id: 2
                                                        //             },
                                                        //         })
                                                        //     }
                                                        // >
                                                        //     Buy Monthly
                                                        // </button>
                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData.role ===
                                                                "mentee"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "2",
                                                                    //         type: "MONTHLY",
                                                                    //         price: 297,
                                                                    //         subscription_amount: 297,
                                                                    //         plan_id: 2
                                                                    //     },
                                                                    // })
                                                                    // setDatasets("hiiii");
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb54eef186503864dd2a11"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div> */}
                                            </>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        297
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Boss up
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     className="btn tm-background text-white w-full"
                                                        //     disabled={UserData?.plan_name && UserData?.plan_name === "3" && UserData?.interval_length === "1" ? true : ""}
                                                        // // onClick={() =>
                                                        // //     navigate("/renewal-pay", {
                                                        // //         state: {
                                                        // //             plan_name: "2",
                                                        // //             type: "MONTHLY",
                                                        // //             price: 297,
                                                        // //             subscription_amount: 297,
                                                        // //             plan_id: 2
                                                        // //         },
                                                        // //     })
                                                        // // }
                                                        // >
                                                        //     Buy Monthly
                                                        // </button>

                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "3" &&
                                                                UserData?.interval_length ===
                                                                  "1"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "3",
                                                                    //         type: "MONTHLY",
                                                                    //         price: 399,
                                                                    //         subscription_amount: 399,
                                                                    //         plan_id: 3
                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb555bf186503864dd2a13"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            {/* <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        599
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /month
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Enterprise
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     className="btn tm-background text-white w-full"
                                                        //     disabled={true}
                                                        // // onClick={() =>
                                                        // //     navigate("/renewal-pay", {
                                                        // //         state: {
                                                        // //             plan_name: "4",
                                                        // //             type: "MONTHLY",
                                                        // //             price: 599,
                                                        // //             plan_id: 4
                                                        // //         },
                                                        // //     })
                                                        // // }
                                                        // >
                                                        //     Buy Monthly
                                                        // </button>

                                                        <>
                                                          <div>
                                                            <input
                                                              // disabled={true}
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "4",
                                                                    //         type: "MONTHLY",
                                                                    //         price: 599,
                                                                    //         plan_id: 4
                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb5577f186503864dd2a15"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </> */}
                                          </>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="">
                                        {getplan && (
                                          <>
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        970
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                        {/* ( Start Your 14 Days Trial for $1 ) */}
                                                      </span>
                                                    </div>
                                                    <div className="mb-2 custom-margin">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Standard
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For
                                                        Consumers
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {basicLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     disabled={UserData.role === "mentee" ? true : ""}
                                                        //     className={`btn text-white w-full ${UserData.role === "mentee" ? "bg-gray-500	text-white" : "tm-background text-white"}`}
                                                        //     onClick={() =>
                                                        //         navigate("/renewal-pay", {
                                                        //             state: {
                                                        //                 plan_name: "5",
                                                        //                 type: "YEARLY",
                                                        //                 price: 1,
                                                        //                 subscription_amount: 1470,
                                                        //                 trial: 14,
                                                        //                 plan_id: 5
                                                        //             },
                                                        //         })
                                                        //     }
                                                        // >
                                                        //     Buy Yearly
                                                        // </button>

                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData.role ===
                                                                "mentee"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className={`tm-color w-full ${
                                                                UserData.role ===
                                                                "mentee"
                                                                  ? "bg-gray-500	tm-color"
                                                                  : "tm-color"
                                                              }`}
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "5",
                                                                    //         type: "YEARLY",
                                                                    //         price: 1470,
                                                                    //         subscription_amount: 1470,
                                                                    //         // trial: 14,
                                                                    //         plan_id: 5
                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb55bff186503864dd2a17"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            {/* <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        2970
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Growth
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     className="btn tm-background text-white w-full"
                                                        //     onClick={() =>
                                                        //         navigate("/renewal-pay", {
                                                        //             state: {
                                                        //                 plan_name: "6",
                                                        //                 type: "YEARLY",
                                                        //                 price: 2970,
                                                        //                 subscription_amount: 2970,
                                                        //                 plan_id: 6

                                                        //             },
                                                        //         })
                                                        //     }
                                                        // >
                                                        //     Buy Yearly
                                                        // </button>

                                                        <>
                                                          <div>
                                                            <input
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "6",
                                                                    //         type: "YEARLY",
                                                                    //         price: 2970,
                                                                    //         subscription_amount: 2970,
                                                                    //         plan_id: 6

                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb55cdf186503864dd2a19"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </> */}
                                            <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        2970
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Boss Up
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     className="btn tm-background text-white w-full"
                                                        //     disabled={UserData?.plan_name && UserData?.plan_name === "7" && UserData?.interval_length === "12" ? true : ""}
                                                        // // onClick={() =>
                                                        // //   navigate("/renewal-pay", {
                                                        // //     state: {
                                                        // //       plan_name: "7",
                                                        // //       type: "YEARLY",
                                                        // //       price: 2970,
                                                        // // plan_id:7,
                                                        // //     },
                                                        // //   })
                                                        // // }
                                                        // >
                                                        //     Buy Yearly
                                                        // </button>

                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "7" &&
                                                                UserData?.interval_length ===
                                                                  "12"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "7",
                                                                    //         type: "YEARLY",
                                                                    //         price: 2970,
                                                                    //         plan_id: 7,
                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb566344d79250624476de"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                            {/* <>
                                              <div className="text-sm mb-6 sm:mb-8 ">
                                                <div
                                                  className="border border-slate-200 dark:border-slate-700 sm:p-4 p-2 text-sm"
                                                  style={{
                                                    borderRadius: "20px",
                                                  }}
                                                >
                                                  <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 price-element">
                                                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4">
                                                      <span className="text-2xl">
                                                        $
                                                      </span>
                                                      <span className="text-3xl">
                                                        5990
                                                      </span>
                                                      <span className="text-slate-500 font-medium text-sm">
                                                        /Yearly
                                                      </span>
                                                    </div>
                                                    <div className="mb-2">
                                                      <h2 className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                                        Enterprise
                                                      </h2>
                                                      <p
                                                        className="mt-2"
                                                        style={{
                                                          fontSize: "smaller",
                                                        }}
                                                      >
                                                        Recommended For Credit
                                                        Repair Business Owners
                                                      </p>
                                                    </div>
                                                    <div className=" flex gap-4">
                                                      {primiumLoader ? (
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
                                                          <span className="ml-2">
                                                            Buy Plan
                                                          </span>
                                                        </button>
                                                      ) : (
                                                        // <button
                                                        //     className="btn tm-background text-white w-full"
                                                        //     disabled={UserData?.plan_name && UserData?.plan_name === "8" && UserData?.interval_length === "12" ? true : ""}
                                                        // // onClick={() =>
                                                        // //   navigate("/renewal-pay", {
                                                        // //     state: {
                                                        // //       plan_name: "8",
                                                        // //       type: "YEARLY",
                                                        // //       price: 2970,
                                                        // // plan_id:8
                                                        // //     },
                                                        // //   })
                                                        // // }
                                                        // >
                                                        //     Buy Yearly
                                                        // </button>
                                                        <>
                                                          <div>
                                                            <input
                                                              disabled={
                                                                UserData?.plan_name &&
                                                                UserData?.plan_name ===
                                                                  "8" &&
                                                                UserData?.interval_length ===
                                                                  "12"
                                                                  ? true
                                                                  : ""
                                                              }
                                                              className="tm-color"
                                                              onClick={() =>
                                                                setTimeout(
                                                                  () => {
                                                                    // navigate("/renewal-pay", {
                                                                    //     state: {
                                                                    //         plan_name: "8",
                                                                    //         type: "YEARLY",
                                                                    //         price: 5990,
                                                                    //         plan_id: 8
                                                                    //     },
                                                                    // })
                                                                    navigate(
                                                                      `/renewal-pay/${"65cb562544d79250624476dc"}`
                                                                    );
                                                                  },
                                                                  500
                                                                )
                                                              }
                                                              type="checkbox"
                                                              id="scales"
                                                              name="scales"
                                                              // checked=""

                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "25px",
                                                                height: "25px",
                                                              }}
                                                            />
                                                            <label for="scales"></label>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </> */}
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="space-y-2 w-100">
                                    <p>
                                    DISCLAIMER: You will be billed for the whole 30 days. If you have any billing questions or concerns please email: support@consumerlawdispute.ai
                                    </p>
                                  </div>
                              </section>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default SubcriptionChecker;
