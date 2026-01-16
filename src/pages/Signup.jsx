
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../images/logo-dark-mode.png';
import AuthImage from '../images/registerBack.png';
import ReCAPTCHA from "react-google-recaptcha";
import { CaptchaAppKey } from "../Config";
import ModalBasic from "../components/ModalBasic";
import ModalCookies from "../components/ModalCookies";
import { useParams } from "react-router-dom";



function Signup({ BackendUrl, FrontendUrl }) {

  const { id } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [loaderSignup, setloaderSignup] = useState(false);
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [isUserId, setIsUserId] = useState("");
  const [planName, setPlanName] = useState('');

  const planMapping = {
    "65cb54d7f186503864dd2a0f": {
      idd: "1",
      name: "Standard Plan",
      amount: "97",
      term: "monthly",
      title1: "Credit report import ( 1 per user)",
      title2: "Access to dispute software",
      title3: "Access to letter generator",
      title4: "Access to learning portal",
      videoLink: "standard_monthly",

    },
    "65cb54eef186503864dd2a11": {
      idd: "2",
      name: "Growth Plan",
      amount: "297",
      term: "monthly",
      title1: "Import up to 400 consumer reports",
      title2: "Unlimited Storage",
      title3: "Private label client portal",
      title4: "Up to 400 active clients",
      videoLink: "standard_monthly",

    },
    "65cb555bf186503864dd2a13":
    {
      idd: "3",
      name: "Boss-Up Plan",
      amount: "297",
      term: "monthly",
      title1: "Up to 12 members",
      title2: "Unlimited storage",
      title3: "Unlimited affiliates and leads",
      title4: "Private label client portal",
      videoLink: "standard_monthly",

    },
    "65cb5577f186503864dd2a15":
    {
      idd: "4",
      name: "Enterprice Plan",
      amount: "599",
      term: "monthly",
      title1: "Up to 24 team members",
      title2: "Unlimited storage",
      title3: "Unlimited affiliates and leads",
      title4: "Private label client portal",
      videoLink: "standard_monthly",

    },
    "65cb55bff186503864dd2a17": {
      idd: "1",
      name: "Standard Plan",
      amount: "970",
      term: "yearly",
      title1: "Credit report import ( 1 per user)",
      title2: "Access to dispute software",
      title3: "Access to letter generator",
      title4: "Access to learning portal",
      videoLink: "standard_monthly",

    },
    "65cb55cdf186503864dd2a19": {
      idd: "2",
      name: "Growth Plan",
      amount: "2970",
      term: "yearly",
      title1: "Import up to 400 consumer reports",
      title2: "Unlimited Storage",
      title3: "Private label client portal",
      title4: "Up to 400 active clients",
      videoLink: "standard_yearly",

    },
    "65cb566344d79250624476de":
    {
      idd: "3",
      name: "Boss-Up Plan",
      amount: "2970",
      term: "yearly",
      title1: "Up to 12 members",
      title2: "Unlimited storage",
      title3: "Unlimited affiliates and leads",
      title4: "Private label client portal",
      videoLink: "standard_yearly",

    },
    "65cb562544d79250624476dc":
    {
      idd: "4",
      name: "Enterprice Plan",
      amount: "5990",
      term: "yearly",
      title1: "Up to 24 team members",
      title2: "Unlimited storage",
      title3: "Unlimited affiliates and leads",
      title4: "Private label client portal",
      videoLink: "standard_yearly",

    },
  };
  useEffect(() => {
    if (id && planMapping[id]) {
      setPlanName(planMapping[id]);
    }
  }, [id]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    ssn: "",
    dob: "",
    referral: "",
    comesform: "",
    phone: "",
    companyName: "",
  });

  const [otp, setOpt] = useState('');
  const [validation, setValidation] = useState({
    name: true,
    email: true,
    address: true,
    city: true,
    zip: true,
    state: true,
    password: true,
    confirmPassword: true, // Add confirm password validation
    phone: true
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setValidation({ ...validation, [name]: true });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{8,})/;
    return passwordRegex.test(password);
  };
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (!form.address) {
      newValidation.address = false;
      isValid = false;
    }

    if (!form.city) {
      newValidation.city = false;
      isValid = false;
    }

    if (!form.zip) {
      newValidation.zip = false;
      isValid = false;
    }

    if (!form.state) {
      newValidation.state = false;
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
    if (!form.phone || !validatePhoneNumber(form.phone)) {
      newValidation.phone = false;
      isValid = false;
    }


    setValidation(newValidation);

    if (!isValid) {
      return;
    }
    setloaderSignup(true)

    try {
      const response = await axios.post(`${BackendUrl}/user/verify-user`, {
        form: form,
        domain_url: FrontendUrl
      });
      setIsUserId(response?.data?.user_id);
      toast.success(response.data.message);
      setloaderSignup(false);
      // setBasicModalOpen(true)
      newValidation.confirmPassword = true;
      setForm({
        name: "",
        password: "",
        confirmPassword: "",
        referral: "",
        comesform: "",
        companyName: "",
      });
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

  const handleVeriyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BackendUrl}/user/verify-sms-otp`, {
        otp: otp,
        userId: isUserId,
      });
      toast.success(response.data.message);
      setBasicModalOpen(false)
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  }


  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];

  const todayDate = new Date().toISOString().slice(0, 10);
  return (
    <main className="bg-white dark:bg-slate-900">
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
      <div className="relative md:flex">
        <div className="hidden md:block min-h-[100dvh] md:w-1/2 relative" aria-hidden="true">
          <img className="object-cover min-h-[100dvh] object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
          <div className="absolute top-0  w-full p-5 mt-5 md:mt-0">
            <h1 className="text-2xl font-bold left-7 m-5 text-white">
              Join the {planName?.name} for ${planName?.amount}/{planName?.term}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-white">
              <div className="space-y-4">
                <div className="flex w-full gap-4 mb-2 ms-5">
                  <svg className="me-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    <path d="M21.998 11.002L13.598 21.002L9.99799 17.002" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{planName?.title1}</span>
                </div>
              </div>
              <div className="">

                <div className="flex items-center gap-2">
                  <svg className="me-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    <path d="M21.998 11.002L13.598 21.002L9.99799 17.002" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{planName?.title2}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-white">
              <div className="space-y-4">
                <div className="flex w-full gap-4 mb-2 ms-5">
                  <svg className="me-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    <path d="M21.998 11.002L13.598 21.002L9.99799 17.002" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{planName?.title3}</span>
                </div>
              </div>
              <div className="">

                <div className="flex items-center gap-2">
                  <svg className="me-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.9973 16C27.9973 9.375 22.6223 4 15.9973 4C9.37225 4 3.99725 9.375 3.99725 16C3.99725 22.625 9.37225 28 15.9973 28C22.6223 28 27.9973 22.625 27.9973 16Z" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    <path d="M21.998 11.002L13.598 21.002L9.99799 17.002" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{planName?.title4}</span>
                </div>
              </div>
            </div>


            <h1 className="underline text-sm font-bold left-7 m-5 text-white">
              Explore more options
            </h1>
            <button className="w-full bg-red-600 text-white font-bold py-2 px-4 mt-4">
              Special Message From CEO Daraine Delevante
            </button>
            <div className="w-full text-center text-1xl  text-white font-bold py-2 px-4 mt-4">
              <span className="p-5 mt-2 mb-2">
                Credit Repair Made Easy From the comfort of your own home, without ever
                having to leave your home to mail a single letter at the post office!
              </span>
            </div>
            <div>
              <iframe width="100%" height="270" src="https://www.youtube.com/embed/Ywv1uKaJQG0" title="Credit Repair Made Easy Webinar" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <button className="w-full bg-red-600 text-white font-bold py-2 px-4 mt-5">
              Don’t Miss Our Free Weekly Software Training!
            </button>
          </div>
        </div>

        <div className="md:w-1/2 right-0 absolute top-0 bottom-0">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <div className="max-w-s mx-auto w-full px-5">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">Create your Account</h1>
              <p className=" text-slate-800 dark:text-slate-100 ms-1 text-sm mb-6" >Enter the details required below to create account</p>
              {/* Form */}
              <form onSubmit={handleSubmit}  >
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
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
                        className={`form-input w-full border-0 rounded-full  ${!validation.name ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter full name here"
                        type="text"
                      />
                      {!validation.name && <p className="text-red-500 mt-1">Name is required</p>}
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
                        className={`form-input w-full border-0 rounded-full  ${!validation.password ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter password here"
                        type="password"
                        autoComplete="on"
                      />
                      {!validation.password && (
                        <p className="text-red-500 mt-1">
                          Password is required and must contain at least 8 characters,
                          including one uppercase letter, one lowercase letter, one number,
                          and one special character (!-@#$%^&*).
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="feedback">
                        Phone Number  <span className="text-rose-500">*</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        {/* <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          US +1
                        </span> */}
                        <input
                          type="text"
                          name="phone"
                          id="default"
                          value={form?.phone}
                          onChange={handleFormChange}
                          className={`form-input w-full border-0 rounded-full  ${!validation.phone ? 'border-red-500' : ''}`}
                          style={{ background: "#F4F5F6" }}
                          placeholder="US +1"
                        />
                      </div>
                      {!validation.phone && (
                        <p className="text-red-500 mt-1">
                          Phone number must be 10 digits long ,
                          country code (+1) is already include .
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="city">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="city"
                        value={form.city}
                        onChange={handleFormChange}
                        name="city"
                        className={`form-input w-full border-0 rounded-full  ${!validation.city ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter city here"
                        type="text"
                        autoComplete="on"
                      />
                      {!validation.city && (
                        <p className="text-red-500 mt-1">
                          City is required.
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="zip"
                      >
                        Zip <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="zip"
                        value={form.zip}
                        onChange={handleFormChange}
                        name="zip"
                        className={`form-input w-full border-0 rounded-full  ${!validation.city ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter zip here"
                        type="text"
                      />
                      {!validation.zip && (
                        <p className="text-red-500 mt-1">
                          zip is required.
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="dob"
                      >
                        Date of birth (Optional)
                      </label>
                      <input
                        id="dob"
                        value={form.dob}
                        onChange={handleFormChange}
                        name="dob"
                        className={`form-input w-full border-0 rounded-full  ${!validation.city ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter date here"
                        type="date"
                        max={todayDate} // Set max attribute to today's date
                      />
                    </div>

                    {!(id === "65cb54d7f186503864dd2a0f" || id === "65cb54eef186503864dd2a11" || id === "65cb55bff186503864dd2a17" || id === "65cb55cdf186503864dd2a19") &&
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="companyName"
                        >
                          Company Name
                        </label>
                        <input
                          id="companyName"
                          value={form.companyName}
                          onChange={handleFormChange}
                          name="companyName"
                          className={`form-input w-full border-0 rounded-full`}
                          style={{ background: "#F4F5F6" }}
                          placeholder="Enter company name here"
                          type="text"
                        />
                      </div>
                    }

                  </div>
                  <div className="">

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        value={form.email}
                        onChange={handleFormChange}
                        name="email"
                        className={`form-input w-full border-0 rounded-full  ${!validation.email ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter email here"
                        type="email"
                      />
                      {!validation.email && <p className="text-red-500 mt-1">Email is required</p>}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleFormChange}
                        name="confirmPassword"
                        className={`form-input w-full border-0 rounded-full  ${!validation.confirmPassword ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter confirm password here"
                        type="password"
                        autoComplete="on"
                      />
                      {!validation.confirmPassword && (
                        <p className="text-red-500 mt-1">Confirm Passwords do not match</p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="address"
                      >
                        Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="address"
                        value={form.address}
                        onChange={handleFormChange}
                        name="address"
                        className={`form-input w-full border-0 rounded-full  ${!validation.address ? 'border-red-500' : ''}`}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter address here"
                        type="text"
                      />
                      {!validation.address && (
                        <p className="text-red-500 mt-1">
                          address is required.
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mt-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                          State <span className="text-rose-500">*</span>
                        </label>
                      </div>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleFormChange}
                        autoComplete="state"
                        style={{ background: "#F4F5F6" }}
                        className="form-select w-full rounded-full"

                      >
                        <option value="">Select a state</option>
                        {/* Map through states to generate options */}
                        {states.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>

                      {!validation.state && (
                        <p className="text-red-500 mt-1">
                          state is required.
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="ssn"
                      >
                        Last 4 digit of SSN (Optional)
                      </label>
                      <input
                        id="ssn"
                        value={form.ssn}
                        onChange={handleFormChange}
                        name="ssn"
                        className={`form-input w-full border-0 rounded-full `}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter SSN here"
                        type="text"
                        maxLength={4}
                      />
                    </div>


                    <div>
                      <label
                        className="block text-sm font-medium mb-1 mt-4"
                        htmlFor="referral"
                      >
                        Referral Code
                      </label>
                      <input
                        id="referral"
                        value={form.referral}
                        onChange={handleFormChange}
                        name="referral"
                        className={`form-input w-full border-0 rounded-full `}
                        style={{ background: "#F4F5F6" }}
                        placeholder="Enter referral code here"
                        type="text"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mt-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                          How did you hear about us?
                        </label>
                      </div>
                      <select id="comesform" name='comesform'
                        className={`form-input w-full border-0 rounded-full `}
                        style={{ background: "#F4F5F6" }}
                        value={form.comesform}
                        onChange={handleFormChange}
                      >
                        <option value="" selected disabled>Select option</option>
                        <option value="Google">Internet Search, Google</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Linkedin">Linkedin</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Referral">Referral</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="mb-4">
                    <ReCAPTCHA sitekey={CaptchaAppKey}
                      onChange={handleRecaptchaChange}
                    />
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
                            <span className="ml-2">Create account</span>
                          </button>
                          :
                          <>
                            {validation.name && validation.email && validation.password && (
                              <button
                                type="submit"
                                className="btn w-full tm-background text-white  whitespace-nowrap"
                              >
                                Create account
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
                  Already have an account? <Link className="font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400" to="/signin">Sign In</Link>
                </div>
              </div>
            </div>

          </div>
        </div>


      </div>

    </main>
  );
}

export default Signup;