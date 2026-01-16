import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo-dark-mode.png";
import AuthImage from "../images/signin-background-man.png";
import AuthDecoration from "../images/signupClientImg.png";
import axios from "axios";
import { toast } from "react-toastify";
// import AuthImage from '../images/human-login.png';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { CookiesUrl } from "../Config";
import ModalCookies from "../components/ModalCookies";
import { useParams } from "react-router-dom";
import CompanyLogoCommonComp from "../components/CompanyLogoCommonComp.jsx";
import CompanyAuthImage from "../images/signup-backgrounds.png";

function Signin({ BackendUrl, FrontendUrl }) {
  const { id, subId } = useParams();
  const [cookies, setCookie] = useCookies(["user_token"]);
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [isUserId, setIsUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyLogo, setCompanyLogo] = useCookies(["company_logo"]);
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + 24 * 60 * 60 * 1000);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idd: id || "",
    subid: subId || "",
    email: "",
    password: "",
  });

  const [otp, setOpt] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendSMS, setResendSMS] = useState("");
  const [loaderSignin, setloaderSignin] = useState(false);
  const [loaderResendemail, setloaderResendemail] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    setloaderSignin(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BackendUrl}/user/login-user`,
        formData
      );
      const userDataJSON = JSON.stringify(response.data);
      const userData = JSON.parse(userDataJSON);
      const user = userData.user;

      setloaderSignin(false);

      setCookie("user_token", userDataJSON, {
        domain: CookiesUrl, 
        path: "/", 
        expires: expirationTime || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        secure: true, 
      });
      if (
        user?.plan_name !== "1" &&
        user?.plan_name !== "5" &&
        user.role !== "client"
      ) {
        navigate(`/home`);
      } else {
        navigate(`/dashboard/${response.data?.user?._id}`);
      }
    } catch (error) {
      if (error?.response?.data?.resendEmail) {
        if (error?.response?.data?.email_verify === false) {
          setResendEmail(error?.response?.data?.resendEmail);
        }
        if (error?.response?.data?.email_verify === true) {
          setResendSMS(error?.response?.data?.resendEmail);
        }
      }
      setloaderSignin(false);
      toast.error(
        error.response.data.message ||
          "Sign in failed. Please check your credentials."
      );
    }
  };

  const resendVerifyEmail = async () => {
    console.log(resendEmail,"resendEmailresendEmail")
    setloaderResendemail(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/user/resend-verify-email`,
        {
          email: resendEmail,
          domain_url: FrontendUrl,
        }
      );
      toast.success(
        response.data.message || "Verification Email Send Successfully"
      );
      setloaderResendemail(false);
      setResendEmail("");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Sign in failed. Please check your credentials."
      );
      setloaderResendemail(false);
    }
  };

  const resendSmsOtp = async (resendEmail) => {
    setloaderResendemail(true);
    try {
      const response = await axios.post(`${BackendUrl}/user/resend-sms-otp`, {
        email: resendEmail,
        domain_url: FrontendUrl,
      });
      console.log("resend res", response);
      toast.success(
        response.data.message || "Verification code Send Successfully"
      );
      setloaderResendemail(false);
      setBasicModalOpen(true);
      setIsUserId(response.data?.user_id);
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Sign in failed. Please check your credentials."
      );
      setloaderResendemail(false);
    }
  };

  const handleVeriyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BackendUrl}/user/verify-sms-otp`, {
        otp: otp,
        userId: isUserId,
      });
      toast.success(response.data.message);
      setBasicModalOpen(false);
      setResendSMS("");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getUserData = async () => {
    let URL = `${BackendUrl}/user/get-mainuser-for-member-only/${subId}`;
    try {
        const response = await axios.get(URL);
        const company_logo = response?.data?.UserDetails?.company_logo;
        setUserData(response?.data);
        setCompanyLogo("company_logo", company_logo, {
          domain: CookiesUrl, 
          path: "/", 
          expires: expirationTime  || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          secure: true, 
        });
    } catch (error) {
        toast.error("Something went Wrong");
    }
};

useEffect(() => {
    if (subId) {
        getUserData();
    }
}, [subId]);

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="flex-1">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
            {/* <img
              src={logo}
              width={200}
              alt="logo"
            /> */}
          {subId ?
            <CompanyLogoCommonComp subId={subId} />
          : 
          (<a className="block" href="https://www.consumerlawdispute.ai">
            <img width={200} src={logo}></img>
            </a>)
          } 
        </div>
      </div>
      <div className="relative md:flex">
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <div className="max-w-sm mx-auto w-full px-4 py-8">
              {/* <div className='text-center'>
                <a className="flex block justify-center" href="https://www.consumerlawdispute.ai">
                  <img
                    src={logo}
                    width={200}
                    alt="logo"
                  />
                </a>
              </div> */}
              <h6 className="text-slate-800 dark:text-slate-100 mt-4  text-center">
                Team member login
              </h6>
              <div className="p-5 rounded" style={{ background: "#FBFBFC" }}>
                <form onSubmit={handleFormSubmit}>
                  <h1 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6 text-center">
                    Hello Again!
                  </h1>
                  <div className="space-y-4">
                    <div>
                      <input
                        style={{ background: "#F4F5F6" }}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email or user ID"
                        className="form-input w-full rounded-full"
                        type="email"
                      />
                    </div>
                    <div>
                      <div className="relative w-full">
                        <input
                          style={{ background: "#F4F5F6" }}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className="form-input w-full rounded-full pr-10"
                          type={showPassword ? "text" : "password"}
                          autoComplete="on"
                        />
                        {/* Eye Button */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x-bind:width="size"
                              x-bind:height="size"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              x-bind:strokeWidth="stroke"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              width="24"
                              height="24"
                              strokeWidth="2"
                            >
                              <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                              <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                              <path d="M3 3l18 18"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x-bind:width="size"
                              x-bind:height="size"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              x-bind:strokeWidth="stroke"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              width="24"
                              height="24"
                              strokeWidth="2"
                            >
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 mb-4">
                    <button className="btn btn-sm tm-background w-full text-white">
                      Sign In
                    </button>
                  </div>
                  <div className="mr-1 text-center ">
                    {id && subId ? (
                      <Link
                        to={`/forgot-password/${id}/${subId}`}
                        className="text-slate-800 dark:text-slate-100 font-bold mb-6 text-center"
                      >
                        Forgot Password
                      </Link>
                    ) : (
                      <Link
                        to="/forgot-password"
                        className="text-slate-800 dark:text-slate-100 font-bold mb-6 text-center"
                      >
                        Forgot Password
                      </Link>
                    )}
                  </div>
                  {resendEmail && (
                    <div className="mr-1 text-center ">
                      <button
                        type="button"
                        onClick={() => resendVerifyEmail()}
                        className="text-red-800 dark:text-red-100 font-bold  text-center"
                      >
                        Resend Verification Email{" "}
                      </button>
                    </div>
                  )}
                </form>
              </div>
              <div
                className="text-center border-slate-200 dark:border-slate-700"
                style={{ fontSize: "10px" }}
              >
                *For Security, User IDs and passwords cannot be shared. All
                users must have their own User ID, All visits are logged.
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full md:w-1/2">
          <div
            className="hidden md:block absolute top-0 bottom-0 right-0 w-full h-full"
            aria-hidden="true"
          >
            {!subId ?
            <img
              className="object-cover object-center w-full h-full"
              src={AuthImage}
              width="760"
              height="1024"
              alt="Authentication"
            />
            :
            <img
              className="object-cover object-center w-full h-full"
              src={CompanyAuthImage}
              width="760"
              height="1024"
              alt="Authentication"
            />
          }
          </div>
          <div className="absolute top-0 left-10 w-full p-4 mt-5 md:mt-0">
            {!subId ?
            <h1 className="text-4xl font-bold left-7 m-5 text-white">
              Welcome to Consumer
              <br />
              Law Dispute AI
            </h1>
            :
            <h1 className="text-4xl font-bold left-7 m-5 text-white">
              Welcome to {userData && userData?.UserDetails?.name ? (
                <>
                  {userData?.UserDetails?.name}
                </>
              ) : (
              <>
                
              </>
              )}
            </h1>
            }
            {!subId &&
            <div className="flex flex-wrap w-full text-white">
              <div className="w-full flex gap-10 mb-2 ms-5">
                
               
                <span className="flex items-center">
                  <svg
                    className="me-1"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M21.998 11.002L13.598 21.002L9.99799 17.002"
                      stroke="white"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Consumer Law Based
                </span>
                <span className="flex items-center">
                  <svg
                    className="me-1"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M21.998 11.002L13.598 21.002L9.99799 17.002"
                      stroke="white"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Custom Support
                </span>
                <span className="flex items-center">
                  <svg
                    className="me-1"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M21.998 11.002L13.598 21.002L9.99799 17.002"
                      stroke="white"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Legal Assistance
                </span>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signin;
