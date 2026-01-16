import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import AuthImage from '../images/AI-Robot-with-Letter-AI.png';
import AuthDecoration from '../images/auth-decoration_red.png';
import logo from '../images/logo-light-mode.png';
import ReCAPTCHA from "react-google-recaptcha";
import { CaptchaAppKey } from "../Config";

function AffiliateSignup({ BackendUrl, FrontendUrl }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [allAdminAffiliate, setAllAdminAffiliate] = useState([]);
    const [affiliateID, setAffiliateID] = useState(null);

    const getAllAdminAffiliated = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin/get-all-admin-affiliate`);
            setAllAdminAffiliate(response?.data?.allAffiliate);
        } catch (error) {
            toast.error(error.response.data.message || "Something went Wrong");
            setloaderSignup(false);
        }
    }

    useEffect(() => {
        getAllAdminAffiliated();
        setAffiliateID(id);
    }, []);

    useEffect(() => {
        if (allAdminAffiliate.length > 0) {
            const isIdMatched = allAdminAffiliate.some(affiliate => affiliate?.affiliateID === id && affiliate?.status === "active");
            if (!isIdMatched) {
                navigate("/signup");
            }
        }
    }, [navigate, id, allAdminAffiliate]);

    const [isVerified, setIsVerified] = useState(false);
    const [loaderSignup, setloaderSignup] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        referral: "",
        // affiliateID: ""
    });

    const [validation, setValidation] = useState({
        name: true,
        email: true,
        password: true,
        confirmPassword: true, // Add confirm password validation
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Reset validation when the input changes
        setValidation({ ...validation, [name]: true });
    };

    const validatePassword = (password) => {
        // Custom password validation logic
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (id !== "123456") {
        //     toast.error("Route doesn't exist");
        //     return
        // }
        // Validate the form
        let isValid = true;
        const newValidation = { ...validation };

        if (!form.name) {
            newValidation.name = false;
            isValid = false;
        }

        if (!form.email) {
            newValidation.email = false;
            isValid = false;
        }


        if (!form.password || !validatePassword(form.password)) {
            newValidation.password = false;
            isValid = false;
        }

        if (form.password !== form.confirmPassword) {
            newValidation.confirmPassword = false; // Passwords don't match
            isValid = false;
        }

        setValidation(newValidation);

        if (!isValid) {
            return;
        }
        setloaderSignup(true)

        try {
            const response = await axios.post(`${BackendUrl}/user/verify-affiliate-user`, {
                form: form,
                affiliateID: affiliateID,
                domain_url: FrontendUrl
            });
            toast.success(response.data.message);
            setloaderSignup(false);
            // newValidation.confirmPassword = true;
            // setForm({
            //     name: "",
            //     email: "",
            //     password: "",
            //     confirmPassword: "", // Reset confirm password field
            //     referral: "",
            // });
        } catch (error) {
            toast.error(error.response.data.message || "Something went Wrong");
            setloaderSignup(false);
        }
    };

    const handleRecaptchaChange = (response) => {
        // Check if response is truthy to determine if the user has verified the reCAPTCHA
        if (response) {
            setIsVerified(true);
        } else {
            setIsVerified(false);
        }
    };
    return (
        <>

            <div className="min-h-screen register-page-section-two-img items-center">
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
                <div className="flex justify-center">
                    <div className="mx-auto w-full lg:w-3/4 flex flex-col lg:flex-row justify-center p-3">
                        <div className="w-full lg:w-4/12 bg-cover rounded-l-lg lg:rounded-l-none mb-4 lg:mb-0" style={{ background: "#1F2732" }} >
                            {/* Form details */}
                            <div className="p-6 text-white">
                                <h1 className="text-2xl font-bold">Welcome to Consumer Law Dispute AI</h1>
                                <p className="mt-4 text-lg flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                    </svg>
                                    AI-Powered
                                </p>

                                <p className="mt-4 text-lg flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                    </svg>
                                    Consumer Law Based
                                </p>

                                <p className="mt-4 text-lg flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                    </svg>
                                    Real-Time Monitoring
                                </p>
                                <p className="mt-4 text-lg flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                    </svg>
                                    Cost-Effective Solution
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-5/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
                            <h3 className="pt-4 text-2xl  px-8 font-bold  text-gray-800 dark:text-white">Create your Account</h3>
                            <p className="dark:bg-gray-800 px-8">Add below information to your account</p>
                            <div className="px-8 pt-6 pb-8 mb-4 bg-white   rounded">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                                Full Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                value={form.name}
                                                onChange={handleFormChange}
                                                name="name"
                                                className={`form-input w-full ${!validation.name ? 'border-red-500' : ''}`}
                                                type="text"
                                            />
                                            {!validation.name && <p className="text-red-500 mt-1">Name is required</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="email"
                                                value={form.email}
                                                onChange={handleFormChange}
                                                name="email"
                                                className={`form-input w-full ${!validation.email ? 'border-red-500' : ''}`}
                                                type="email"
                                            />
                                            {!validation.email && <p className="text-red-500 mt-1">Email is required</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                value={form.password}
                                                onChange={handleFormChange}
                                                name="password"
                                                className={`form-input w-full ${!validation.password ? 'border-red-500' : ''}`}
                                                type="password"
                                                autoComplete="on"
                                            />
                                            {!validation.password && (
                                                <p className="text-red-500 mt-1">
                                                    Password is required and must contain at least 8 characters,
                                                    including one uppercase letter, one lowercase letter, one number,
                                                    and one special character (!@#$%^&*).
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                htmlFor="confirmPassword"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleFormChange}
                                                name="confirmPassword"
                                                className={`form-input w-full ${!validation.confirmPassword ? "border-red-500" : ""
                                                    }`}
                                                type="password"
                                                autoComplete="on"
                                            />
                                            {!validation.confirmPassword && (
                                                <p className="text-red-500 mt-1">Confirm Passwords do not match</p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                htmlFor="referral"
                                            >
                                                Referral Code
                                            </label>
                                            <input
                                                id="referral"
                                                value={form.referral}
                                                onChange={handleFormChange}
                                                name="referral"
                                                className={`form-input w-full`}
                                                type="text"
                                            />
                                        </div>
                                        <div style={{display: "none"}}>
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                htmlFor="affiliateID"
                                            >
                                                Affiliate Code
                                            </label>
                                            <input
                                                id="affiliateID"
                                                value={id}
                                                onChange={handleFormChange}
                                                name="affiliateID"
                                                className={`form-input w-full`}
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                                                    How did you hear about us?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <ReCAPTCHA sitekey={CaptchaAppKey}
                                            onChange={handleRecaptchaChange}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="mr-1">
                                            <label className="flex items-center">
                                            </label>
                                        </div>




                                        {isVerified && (
                                            <>
                                                {
                                                    loaderSignup
                                                        ?
                                                        <button className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                                            <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                                                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                                            </svg>
                                                            <span className="ml-2">Sign Up</span>
                                                        </button>
                                                        :
                                                        <>
                                                            {validation.name && validation.email && validation.password && (
                                                                <button
                                                                    type="submit"
                                                                    className="btn w-full tm-background text-white  whitespace-nowrap"
                                                                >
                                                                    Sign Up
                                                                </button>
                                                            )}
                                                        </>
                                                }
                                            </>
                                        )}
                                    </div>
                                </form>
                                {/* Footer */}
                                <div className="pt-5 mt-6 border-t border-slate-200 dark:border-slate-700">
                                    <div className="text-sm text-center">
                                        Have an account? <Link className="font-medium tm-color " to="/signin">Sign In</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </>
    )
}

export default AffiliateSignup;