import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import AuthImage from '../images/human-login.png';
import AuthImage from '../images/humanLogin1.webp';
import AuthDecoration from '../images/auth-decoration_red.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo-dark-mode.png';
import { useCookies } from 'react-cookie';
import { CookiesUrl } from '../Config';
import ModalCookies from "../components/ModalCookies";
import { GET_USER_EMAIL_REGISTER } from "../API/api"



function Signin({ BackendUrl, FrontendUrl }) {
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + 24 * 60 * 60 * 1000); // 24 minutes in milliseconds
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [isUserId, setIsUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userEmailList, setUserEmailList] = useState("");


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [otp, setOpt] = useState('');
  const [loginstep, setLoginstep] = useState(1);
  const [resendSMS, setResendSMS] = useState("");
  const [loaderSignin, setloaderSignin] = useState(false);
  const [loaderResendemail, setloaderResendemail] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setUserEmail(value);
  };
  const handleEmailSubmit = async (e) => {
    setloaderSignin(true);
    e.preventDefault();
    try {
      const response = await axios.post(GET_USER_EMAIL_REGISTER, {
        userEmail: userEmail,
      });
      if (response?.data?.users?.length === 1) {
        setLoginstep(3);
      } else {
        setLoginstep(2);
        setUserEmailList(response?.data?.users)
      }
      setloaderSignin(false);
    } catch (error) {
      setloaderSignin(false);
      toast.error(error.response.data.message || error.response.data.error || "Something went wrong");
    }
  };


  const resendVerifyEmail = async (resendEmail) => {
    setloaderResendemail(true);
    try {
      const response = await axios.post(`${BackendUrl}/user/resend-verify-email`, {
        email: resendEmail,
        domain_url: FrontendUrl
      });
      toast.success(response.data.message || 'Verification Email Send Successfully');
      setloaderResendemail(false);
      setResendEmail("");
    } catch (error) {
      toast.error(error.response.data.message || 'Sign in failed. Please check your credentials.');
      setloaderResendemail(false);
    }
  };
  const resendSmsOtp = async (resendEmail) => {
    setloaderResendemail(true);
    try {
      const response = await axios.post(`${BackendUrl}/user/resend-sms-otp`, {
        email: resendEmail,
        domain_url: FrontendUrl
      });
      console.log("resend res", response);
      toast.success(response.data.message || 'Verification code Send Successfully');
      setloaderResendemail(false);
      setBasicModalOpen(true)
      setIsUserId(response.data?.user_id)
    } catch (error) {
      toast.error(error.response.data.message || 'Sign in failed. Please check your credentials.');
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
      setBasicModalOpen(false)
      setResendSMS('')
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  }
  return (
    <>
      <main className="bg-white login-page-section-two-img">

        <div className="relative md:flex container">

          {/* Content */}
          <div className="md:w-1/2">
            <div className="min-h-[100dvh] h-full flex flex-col after:flex-1 p-5">
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                  {/* Logo */}
                  <a className="block" href="https://www.consumerlawdispute.ai">
                    <img
                      src={logo}
                      width={200}
                      alt="logo"
                    />
                  </a>
                </div>
              </div>
              <div className="w-full ">
                <div className="  flex flex-col after:flex-1">
                  <div className="flex-1">
                    <div className="px-4 pt-12 pb-8">
                      <div className="max-w-md mx-auto w-full">
                        <div className="relative">
                          <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
                          <ul className="relative flex justify-between w-full">
                            <li>
                              <button className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold   ${loginstep === 1 ? "text-white tm-background" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`} onClick={() => { setLoginstep(1) }}>1</button>
                            </li>
                            <li>
                              <Link className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold   ${loginstep === 2 ? "text-white tm-background" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`} onClick={() => { setLoginstep(2) }}>2</Link>
                            </li>
                            <li>
                              <Link className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold   ${loginstep === 3 ? "text-white tm-background" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`} onClick={() => { setLoginstep(3) }}>3</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {loginstep === 1 &&
                    <div className="px-4 py-8">
                      <div className="max-w-md mx-auto">
                        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold">Welcome Back</h1>
                        <p className='text-muted mb-6'>Add below information to your account</p>
                        <form onSubmit={handleEmailSubmit}>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-md font-semibold mb-2" htmlFor="email">
                                Email Address
                              </label>
                              <input
                                id="email"
                                className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                type="email"
                                name="email"
                                value={userEmail}
                                onChange={handleEmailChange}
                                placeholder='Enter email address'
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-6 mb-5">
                            {/* Add any other elements you need, like a "Forgot Password" link */}
                            <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                              <input
                                class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value=""
                                id="exampleCheck2" />
                              <label
                                class="inline-block pl-[0.15rem] hover:cursor-pointer"
                                for="exampleCheck2">
                                Remember me
                              </label>
                            </div>

                            <div className="mr-1">
                              <Link className="text-sm underline tm-color" to="/forgot-password">
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {loaderSignin
                              ?
                              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                </svg>
                                <span className="ml-2">Next Step -&gt;</span>
                              </button>
                              :
                              <button className="btn tm-background text-white  ml-auto" type="submit">Next Step -&gt;</button>
                            }
                          </div>
                        </form>
                      </div>
                    </div>
                  }


                  {loginstep === 2 &&
                    <div className="px-4 py-8">
                      <div className="max-w-md mx-auto">
                        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold">Welcome Back</h1>
                        <p className='text-muted mb-6'>Add below information to your account</p>
                        <form>
                          <div className="space-y-3 mb-8">
                            {userEmailList && userEmailList.map((val, index) => {
                              let pera = "";
                              if (val?.role === "client") {
                                pera = `${val?.name} as client in ${val?.agent_name} agency`;
                              } else if (val?.role === "agent") {
                                pera = `${val?.name} as ${val?.current_plan_sorting} user`;
                              }
                              else if (val?.role === "agency_agent") {
                                pera = `${val?.name} as agent  in ${val?.agent_name} agency`;
                              }
                              return (
                                <>
                                  <label className="relative block cursor-pointer">
                                    <input type="radio" name="radio-buttons" className="peer sr-only" defaultChecked />
                                    <div className="flex items-center bg-white text-sm font-medium text-slate-800 dark:text-slate-100 p-4 rounded dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out">
                                      <span>{index + 1}. {pera} </span>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-400 dark:peer-checked:border-indigo-500 rounded pointer-events-none" aria-hidden="true"></div>
                                  </label>
                                </>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-between mt-6 mb-5">
                            {/* Add any other elements you need, like a "Forgot Password" link */}
                            <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                              <input
                                class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value=""
                                id="exampleCheck2" />
                              <label
                                class="inline-block pl-[0.15rem] hover:cursor-pointer"
                                for="exampleCheck2">
                                Remember me
                              </label>
                            </div>

                            <div className="mr-1">
                              <Link className="text-sm underline tm-color" to="/forgot-password">
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {loaderSignin
                              ?
                              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                </svg>
                                <span className="ml-2">Next Step -&gt;</span>
                              </button>
                              :
                              <button className="btn tm-background text-white  ml-auto" type="submit">Next Step -&gt;</button>
                            }
                          </div>
                        </form>
                      </div>
                    </div>
                  }


                  {loginstep === 3 &&
                    <div className="px-4 py-8">
                      <div className="max-w-md mx-auto">
                        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold">Welcome Back</h1>
                        <p className='text-muted mb-6'>Add below information to your account</p>
                        <form >
                          <div className="space-y-4">
                            <div>
                              <label className="block text-md font-semibold mb-2" htmlFor="password">
                                Password
                              </label>
                              <input
                                id="password"
                                className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder='Enter password'
                                autoComplete="on"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-6 mb-5">
                            {/* Add any other elements you need, like a "Forgot Password" link */}
                            <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                              <input
                                class="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value=""
                                id="exampleCheck2" />
                              <label
                                class="inline-block pl-[0.15rem] hover:cursor-pointer"
                                for="exampleCheck2">
                                Remember me
                              </label>
                            </div>

                            <div className="mr-1">
                              <Link className="text-sm underline tm-color" to="/forgot-password">
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {loaderSignin
                              ?
                              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                </svg>
                                <span className="ml-2">Login</span>
                              </button>
                              :
                              <button className="btn tm-background text-white  ml-auto" type="submit">Login</button>
                            }
                          </div>
                        </form>
                      </div>
                    </div>
                  }

                </div>
              </div>

            </div>
          </div>
          <div className="hidden md:block absolute inset-y-auto bottom-0 right-0 md:w-1/2" style={{ paddingLeft: "100px" }} >
            <img
              className="w-full h-auto"
              src={AuthImage}
              alt="Authentication"
            />
          </div>
        </div>
      </main>

      <ModalCookies id="basic-modal" modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title="Enter Authentication Code">
        <div className="p-1">
          <div className="overflow-x-auto ">
            {/* <div className=""> */}
            <form onSubmit={handleVeriyOtp}>
              <div className="space-y-3">
                <div>
                  {/* <label className="block text-sm font-medium mb-1" htmlFor="name">
                                  OTP
                                </label> */}
                  <input id="default" className="form-input w-full" type="text" name='name'
                    value={otp}
                    onChange={(e) => setOpt(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-center space-x-2">
                  {/* <button type="button" className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(false); }}>Cancel</button> */}
                  <button type="submit" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white tm-background" >Verify</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </ModalCookies>
    </>
  );
}

export default Signin;