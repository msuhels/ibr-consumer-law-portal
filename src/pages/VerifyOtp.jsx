import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making API requests
import { toast } from 'react-toastify';
import AuthImage from '../images/forgetPage.png';
import AuthDecoration from '../images/auth-decoration.png';
import logo from '../images/consumer_logo.png';
import { useNavigate } from "react-router-dom";
import CompanyLogo from '../components/CompanyLogo';
import AuthCopmanyImage from '../images/forgetPage-company-img.png';
import CompanyLogoCommonComp from '../components/CompanyLogoCommonComp.jsx';

function VerifyOtp({ BackendUrl }) {
    const { id, subId } = useParams();
    const navigate = useNavigate();
    const [userOtp, setUserOtp] = useState('');
    const [loaderSignin, setloaderSignin] = useState(false);

    const handleBackClick = () => {
        navigate(-1);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setloaderSignin(true)
        try {
            const response = await axios.post(`${BackendUrl}/user/verify-reset-password-otp`, { otp: userOtp });
            if (response.data.message == "OTP is verifyed") {
                toast.success(response.data.message);
                setloaderSignin(false);
                navigate(`/reset-user-password/${response.data.user?.user_id}/${subId}`);
            } else {
                toast.error(response.data.message || "OTP is incorrect!");
                setloaderSignin(false);
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
                <div className="md:w-1/2 px-5">
                    <div className="min-h-[100dvh] h-full px-5  flex">
                        <div className=" px-3 py-10">
                            <svg onClick={handleBackClick} width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.25 25L6.25 16L15.25 7M7.5 16H25.75" stroke="#080D18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="max-wsm mx-auto w-full px-5 py-8   rounded-[20px]">
                            <h1 className="text-4xl text-slate-800 dark:text-slate-100 font-black	mb-6">Verify Authentication Code</h1>
                            {/* <p className="text-sm text-slate-800 dark:text-slate-100 mt-2	mb-6">Enter email used to register account </p> */}
                            <form>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="email">We have sent a verification code to your email. Please check and enter your code.<span className="text-rose-500">*</span></label>
                                        <input
                                            id="otp"
                                            className={`form-input w-full border-0 rounded-full`}
                                            style={{ background: "#F4F5F6" }}
                                            type="text"
                                            placeholder='Enter OTP here'
                                            value={userOtp}
                                            onChange={(e) => setUserOtp(e.target.value)}
                                        />
                                        {/* {emailError && <p className="text-rose-500 text-sm mt-1">dffs</p>} */}

                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button className="btn w-full tm-background text-white mt-6" onClick={handleSubmit} >Submit</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>

                {/* Image */}
                <div className="hidden   md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
                    <img className="object-cover object-center w-full h-full" src={AuthImage} width="100" height="100" alt="Authentication" />
                    {/* {subId ?
                        <img className="object-cover object-center w-full h-full" src={AuthCopmanyImage} width="100" height="100" alt="Authentication" />
                        :
                        <img className="object-cover object-center w-full h-full" src={AuthImage} width="100" height="100" alt="Authentication" />
                    } */}
                    {/* <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={AuthDecoration} width="218" height="224" alt="Authentication decoration" /> */}
                </div>

            </div>

        </main>
    );
}

export default VerifyOtp;