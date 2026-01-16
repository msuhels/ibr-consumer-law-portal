import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for making API requests
import { toast } from "react-toastify";
// import AuthImage from '../images/auth-image.jpg';
import AuthImage from "../images/forgetPage.png";
import AuthDecoration from "../images/auth-decoration.png";
import logo from "../images/consumer_logo.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CompanyLogoCommonComp from "../components/CompanyLogoCommonComp.jsx";

function ForgotPassword({ BackendUrl, FrontendUrl }) {
  const { id, subId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loaderSignin, setloaderSignin] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setEmailError('');
  //   // Validate email format
  //   if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  //     setEmailError('Please enter a email address.');
  //     return;
  //   }
  //   setloaderSignin(true)
  //   try {
  //     const response = await axios.post(`${BackendUrl}/user/forgot-password`, { email: email, domain_url: FrontendUrl });
  //     toast.success(response.data.msg);
  //     setloaderSignin(false);
  //   } catch (error) {
  //     toast.error(error.response.data.msg || "Something went Wrong");
  //     setloaderSignin(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a email address.");
      return;
    }
    setloaderSignin(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/user/forgot-password-byotp`,
        { email: email, userId: id, agentId: subId }
      );
      toast.success(response.data.msg);
      setloaderSignin(false);
      if (subId && id) {
        navigate(`/verify-code/${id}/${subId}`);
      } else {
        navigate("/verify-code");
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Something went Wrong");
      setloaderSignin(false);
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="flex-1">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* <img src={logo} width={200} alt="logo" /> */}
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
        <div className="md:w-1/2 px-5">
          <div className="min-h-[100dvh] h-full px-5  flex">
            <div className=" px-3 py-10">
              <svg
                onClick={handleBackClick}
                width="20"
                height="20"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.25 25L6.25 16L15.25 7M7.5 16H25.75"
                  stroke="#080D18"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="max-wsm mx-auto w-full px-5 py-8   rounded-[20px]">
              <h1 className="text-4xl text-slate-800 dark:text-slate-100 font-black	">
                Forget Password
              </h1>
              <p className="text-lg text-slate-800 dark:text-slate-100 mt-2	mb-6">
                Enter email used to register account{" "}
              </p>
              <form>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-md font-semibold mb-2"
                      htmlFor="email"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      className={`form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none ${emailError ? "border-rose-500" : ""
                        }`}
                      type="email"
                      value={email}
                      placeholder="Enter email here "
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                      <p className="text-rose-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  {loaderSignin ? (
                    <button
                      className="btn mt-5 w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                      disabled
                    >
                      <svg
                        className="animate-spin w-4 h-4 fill-current shrink-0"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                      <span className="ml-2">Sign Up</span>
                    </button>
                  ) : (
                    <button
                      className="btn w-full tm-background text-white mt-5"
                      onClick={handleSubmit}
                    >
                      Send Reset Link
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="hidden   md:block absolute top-0 bottom-0 right-0 md:w-1/2"
          aria-hidden="true"
        >
          <img
            className="object-cover object-center w-full h-full"
            src={AuthImage}
            width="100"
            height="100"
            alt="Authentication"
          />
          {/* <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={AuthDecoration} width="218" height="224" alt="Authentication decoration" /> */}
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
