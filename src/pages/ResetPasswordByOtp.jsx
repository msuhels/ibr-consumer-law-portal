import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for making API requests
import { toast } from "react-toastify";
// import AuthImage from '../images/auth-image.jpg';
import AuthImage from "../images/forgetPage.png";
import AuthDecoration from "../images/auth-decoration.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import logo from "../images/consumer_logo.png";
import CompanyLogoCommonComp from "../components/CompanyLogoCommonComp.jsx";

function ResetPasswordByOtp({ BackendUrl }) {
  const { id, subId } = useParams();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  // const location = useLocation();
  // const [token, setToken] = useState('');

  // useEffect(() => {
  //     const searchParams = new URLSearchParams(location.search);
  //     const id = searchParams.get('id');
  //     setToken(id);
  // }, [location.search]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [matchPasswordError, setMatchPasswordError] = useState("");

  const validateForm = () => {
    setPasswordError("");
    setMatchPasswordError("");
    if (!password) {
      setPasswordError("Please enter a password.");
      return false;
    }
    if (password !== confirmPassword) {
      setMatchPasswordError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const reset_password = async (e) => {
    e.preventDefault();
    try {
      if (password === "") {
        toast.error("Password field Requried");
        return;
      }
      if (confirmPassword === "") {
        toast.error("Confirm Password field Requried");
        return;
      }
      if (confirmPassword !== password) {
        toast.error("Confirm Password Not Match");
        return;
      }
      const response = await axios.post(
        `${BackendUrl}/user/reset-password-byotp/${id}`,
        { password }
      );
      toast.success(response.data.message);

      if (subId && id) {
        navigate(-3);
      } else {
        navigate("/signin");
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Sign in failed. Please check again."
      );
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="flex-1">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* <img
                            src={logo}
                            width={200}
                            alt="logo"
                        /> */}
          {subId ? (
            <CompanyLogoCommonComp subId={subId} />
          ) : (
            <a className="block" href="https://www.consumerlawdispute.ai">
              <img width={200} src={logo}></img>
            </a>
          )}
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
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password<span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="password"
                      className={`form-input w-full border-0 rounded-full ${
                        passwordError ? "border-rose-500" : ""
                      }`}
                      type="password"
                      style={{ background: "#F4F5F6" }}
                      value={password}
                      placeholder="**** **** **"
                      required={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="text-rose-500 mt-2">{passwordError}</p>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password<span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      placeholder="**** **** **"
                      className={`form-input w-full border-0 rounded-full ${
                        matchPasswordError ? "border-rose-500" : ""
                      }`}
                      style={{ background: "#F4F5F6" }}
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {matchPasswordError && (
                      <p className="text-rose-500 mt-2">{matchPasswordError}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    className="btn w-full mt-6 tm-background text-white"
                    onClick={reset_password}
                  >
                    Change Password
                  </button>
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

export default ResetPasswordByOtp;
