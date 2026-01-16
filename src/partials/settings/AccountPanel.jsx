import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  GET_USER_DETAILS,
  UPDATE_USER_DETAILS,
  UPLOAD_IMAGES_ON_AWS,
  UPDATE_USER_PASSWORD,
  CANCLE_SUBSCRIPTION_AFTER_END_DATE,
  RUN_CRON_TO_CHECK_SUBCRIPTION,
  GET_AWS_DOCUMENT_DATA,
} from "../../API/api.js";
import Cookies from "js-cookie";
import SubscriptionPanel from "../../partials/settings/SubscriptionPanel";
import UserAvatar from "../../images/user-128.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "../../images/user-avatar-80.png";
import ModalBasic from "../../components/ModalBasic.jsx";
import site_logo from "../../images/logo-light-mode.png";
import { CookiesUrl } from "../../Config.js";
import { useCookies } from "react-cookie";

function AccountPanel() {
  const [modifiedDate, setmodifiedDate] = useState("");
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [companyLogo, setCompanyLogo] = useCookies(["company_logo"]);
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + 24 * 60 * 60 * 1000);
  const [sync, setSync] = useState(false);
  const [userData, setUserData] = useState("");
  const [isSubscriptionData, setIsSubscriptionData] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [CropModalOpen, setCropModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userdetails, setUserdetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    company_website:"",
    second_phone:"",
    fax_number:""
  });
  const [validation, setValidation] = useState({
    name: true,
  });

  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
    cpassword: "",
  });

  const handleInputs = (e) => {
    let value;
    value = e.target.value;

    setUserPassword({ ...userPassword, [e.target.name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdetails({ ...userdetails, [name]: value });
    setValidation({ ...validation, [name]: true });
  };

  const getUserData = async () => {
    setIsLoading(true);
    let URL = GET_USER_DETAILS(user._id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserData(response?.data?.UserDetails);
      // Assuming userData?.start_date contains the date string in the format 'YYYY-MM-DD'
      var startDate = response?.data?.UserDetails?.start_date
        ? new Date(response?.data?.UserDetails.start_date)
        : null;
      if (startDate && response?.data?.UserDetails?.is_trial === "true") {
        startDate.setDate(startDate.getDate() - 14);
        setmodifiedDate(startDate.toISOString().split("T")[0]);
      }
      setUserdetails({
        name: response.data.UserDetails.name,
        email: response.data.UserDetails.email,
        address: response.data.UserDetails.address,
        city: response.data.UserDetails.city,
        state: response.data.UserDetails.state,
        zip: response.data.UserDetails.zip,
        phone: response.data.UserDetails.phone,
        company_website: response.data.UserDetails.company_website,
        second_phone: response.data.UserDetails.second_phone,
        fax_number: response.data.UserDetails.fax_number,
      });
      if (response.data?.SubscriptionData) {
        setIsSubscriptionData(response.data?.SubscriptionData);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    let isValid = true;
    const newValidation = { ...validation };

    if (!userdetails.name.trim()) {
      newValidation.name = false;
      isValid = false;
    }
    setValidation(newValidation);
    if (!isValid) {
      return;
    }

    const userDetailsWithID = {
      ...userdetails,
      user_id: user._id,
    };
    await axios
      .post(UPDATE_USER_DETAILS, userDetailsWithID, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res) {
          // getUserData()
          window.location.reload();
          toast.success("User updated successfully!");
        }
      })
      .catch((error) => {
        // toast.error(error);
        toast.error(error.response.data.message);
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (userPassword.cpassword !== userPassword.newPassword) {
      toast.error("Confirm Password Not Match");
      return;
    }
    axios
      .post(UPDATE_USER_PASSWORD, userPassword, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        toast.success("Password Changed successfully");
        setUserPassword({
          oldPassword: "",
          newPassword: "",
          cpassword: "",
        });
      })
      .catch((response) => {
        toast.error(response.response.data.msg);
      });
  };

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsyl vania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "Washington D.C.",
  ];

  const cancleSubScription = async (subId) => {
    try {
      const response = await axios.post(
        CANCLE_SUBSCRIPTION_AFTER_END_DATE,
        {
          subId: subId,
          userid: user._id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      getUserData();
      toast.success(response?.data?.msg || "Subscription canceled successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const runCronUrl = async () => {
    try {
      const response = await axios.post(
        RUN_CRON_TO_CHECK_SUBCRIPTION,
        {
          userid: user._id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      getUserData();
      toast.success(response?.data?.msg || "Subscription canceled successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Sets the image preview URL
        setCropModalOpen(true); // Opens the modal
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = async (type, userid) => {
    const cropper = fileInputRef.current?.cropper;

    if (!cropper) {
      toast.error("Image cropper is not initialized");
      return;
    }

    cropper.getCroppedCanvas().toBlob(async (blob) => {
      if (!blob) {
        toast.error("Failed to process the cropped image.");
        return;
      }

      const file = new File([blob], `cropped-image-${userid}.png`, {
        type: blob.type,
      });
      await handleUpload(type, file);
      setTimeout(() => {
        if (file) {
          window.location.reload();
        }
      }, 500);
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (type, file) => {
    try {
      let filee = file ? file : selectedFile;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (!filee) {
        toast.error("Please select a Document");
        return;
      }

      if (!allowedTypes.includes(filee.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, JPG)");
        return;
      }

      if (filee.size > maxSize) {
        toast.error("Image size exceeds 5MB limit");
        return;
      }
      const formData = new FormData();
      formData.append("image", filee);
      formData.append("documentType", type);
      formData.append("user_id", userData?._id);
      const apiresponse = await axios.post(UPLOAD_IMAGES_ON_AWS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      // setSelectedDocumentType('');
      if (type == "company_logo") {
        const company_logo = apiresponse?.data?.data?.Location;
        setCompanyLogo("company_logo", company_logo, {
          domain: CookiesUrl,
          expires: expirationTime,
        });
      }
      setSelectedFile(null);
      getUserData();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // if (documentTypeInputRef.current) {
      //   documentTypeInputRef.current.selectedIndex = 0;
      // }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      // toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="grow">
        <div className="px-0 lg:px-4 md:px-4 sm:px-0">
          <div className="p-6 space-y-6">
            <section>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="mr-4">
                  <img
                    className="rounded-full"
                    src={
                      userData?.profile_pic ? userData?.profile_pic : UserAvatar
                    }
                    width="100"
                    height="100"
                    alt="User upload"
                  />
                </div>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="form-input rm-input w-full px-3 py-2 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none"
                  />
                </div>
                <div className="">
                  <button
                    className="py-2 px-5 btn tm-background text-white ml-3 z-0"
                    onClick={() => handleUpload("profile_pic")}
                  >
                    {userData?.profile_pic
                      ? "Update Profile Picture"
                      : "Upload"}
                  </button>
                </div>
              </div>
            </section>

            {/* Company Picture */}
            {userData?.role == "agent" &&
              !(userData?.plan_name === "1" || userData?.plan_name === "5") && (
                <div className="py-3 space-y-6">
                  <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
                    Company Logo
                  </h2>
                  <section>
                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="mr-4">
                        <img
                          className=""
                          src={
                            userData?.company_logo
                              ? userData?.company_logo
                              : site_logo
                          }
                          width="100"
                          height="100"
                          alt="User upload"
                        />
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          type="file"
                          aria-controls="feedback-modal"
                          onChange={(e) => {
                            e.stopPropagation();
                            onImageChange(e);
                          }}
                          className="form-input rm-input w-full px-3 py-2 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none"
                        />
                      </div>
                      <div className="">
                        <button
                          className="py-2 px-5 btn tm-background text-white ml-3 z-0"
                          onClick={() => handleUpload("company_logo")}
                        >
                          {userData?.company_logo
                            ? "Update Company Logo"
                            : "Upload"}
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="grow">
        {/* Panel body */}
        <form
          className="space-y-8 divide-gray-200 rounded-xl bg-white px-0 lg:px-4 md:px-4 sm:px-0"
          onSubmit={updateUser}
        >
          <div className="p-6 space-y-6">
            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
              My Profile
            </h2>
            {/* Picture */}

            {/* Business Profile */}
            <section>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-1/3">
                  <label
                    className="block text-md font-semibold mb-2"
                    style={{ color: "#080D18" }}
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <input
                      id="name"
                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                      type="text"
                      name="name"
                      value={userdetails.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter name here"
                    />
                  </div>
                  {!validation.name && (
                    <p className="text-red-500 mt-1">Name is required</p>
                  )}
                </div>
                <div className="sm:w-1/3">
                  <label
                    className="block text-md font-semibold mb-2"
                    style={{ color: "#080D18" }}
                    htmlFor="business-id"
                  >
                    Email
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <input
                      id="email"
                      name="email"
                      value={userdetails.email}
                      onChange={handleChange}
                      type="email"
                      autoComplete="email"
                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>
            {user?.role === "agent" && (
              <>
              <section>
                <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                  Mailing Address
                </h2>
                <div className="mt-5">
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="name"
                      >
                        Address
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          id="address"
                          name="address"
                          value={userdetails.address}
                          onChange={handleChange}
                          autoComplete="address"
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          placeholder="Enter address here"
                        />
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        City
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          name="city"
                          id="city"
                          value={userdetails.city}
                          onChange={handleChange}
                          autoComplete="city"
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          placeholder="Enter city here"
                        />
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        State
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <select
                          name="state"
                          value={userdetails.state}
                          onChange={handleChange}
                          autoComplete="state"
                          className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        >
                          <option value="">Select a state</option>
                          {/* Map through states to generate options */}
                          {states.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        Zip
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          name="zip"
                          value={userdetails.zip}
                          onChange={handleChange}
                          autoComplete="zip"
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          maxLength={5}
                          placeholder="Enter code here"
                        />
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        Phone
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          name="phone"
                          value={userdetails.phone}
                          onChange={handleChange}
                          autoComplete="phone"
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          placeholder="Enter phone number here"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* //additional info */}
              <section>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                Additional Information
              </h2>
              <div className="mt-5">
                <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                  <div className="sm:w-1/3">
                    <label
                      className="block text-md font-semibold mb-2"
                      style={{ color: "#080D18" }}
                      htmlFor="name"
                    >
                    Company Website
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                      <input
                        id="company_website"
                        name="company_website"
                        value={userdetails.company_website}
                        onChange={handleChange}
                        autoComplete="company_website"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        type="text"
                        placeholder="Enter website url here"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:w-1/3">
                    <label
                      className="block text-md font-semibold mb-2"
                      style={{ color: "#080D18" }}
                      htmlFor="business-id"
                    >
                    Second Phone
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                      <input
                        name="second_phone"
                        value={userdetails.second_phone}
                        onChange={handleChange}
                        autoComplete="second_phone"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        type="text"
                        placeholder="Enter second phone number here"
                      />
                    </div>
                  </div>
                  <div className="sm:w-1/3">
                    <label
                      className="block text-md font-semibold mb-2"
                      style={{ color: "#080D18" }}
                      htmlFor="business-id"
                    >
                    Fax Number
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                      <input
                        name="fax_number"
                        value={userdetails.fax_number}
                        onChange={handleChange}
                        autoComplete="fax_number"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        type="text"
                        placeholder="Enter fax number here"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </section>
              </>
            )}
          </div>
          {/* Panel footer */}
          <footer>
            <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
              <div className="flex self-end">
                <button
                  type="submit"
                  className="btn tm-background text-white ml-3 z-0"
                >
                  Update Changes
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>

      <div className="grow">
        {/* Panel body */}
        <form
          className="space-y-8 divide-gray-200 bg-white px-0 lg:px-4 md:px-4 sm:px-0"
          onSubmit={updatePassword}
        >
          <div className="p-6 space-y-6">
            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
              Change Password
            </h2>
            <section>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-1/3">
                  <label
                    className="block text-md font-semibold mb-2"
                    style={{ color: "#080D18" }}
                    htmlFor="name"
                  >
                    Old Password
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <input
                      id="oldPassword"
                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                      type="password"
                      name="oldPassword"
                      value={userPassword.oldPassword}
                      onChange={handleInputs}
                      autoComplete="oldPassword"
                      placeholder="Enter old password"
                    />
                  </div>
                </div>
                <div className="sm:w-1/3">
                  <label
                    className="block text-md font-semibold mb-2"
                    style={{ color: "#080D18" }}
                    htmlFor="business-id"
                  >
                    New Password
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <input
                      id="newPassword"
                      name="newPassword"
                      value={userPassword.newPassword}
                      onChange={handleInputs}
                      type="password"
                      autoComplete="password"
                      placeholder="Enter new password"
                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                    />
                  </div>
                </div>
                <div className="sm:w-1/3">
                  <label
                    className="block text-md font-semibold mb-2"
                    style={{ color: "#080D18" }}
                    htmlFor="business-id"
                  >
                    Confirm Password
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <input
                      id="cpassword"
                      name="cpassword"
                      value={userPassword.cpassword}
                      onChange={handleInputs}
                      type="password"
                      autoComplete="cpassword"
                      placeholder="Confirm new password"
                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Panel footer */}
          <footer>
            <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
              <div className="flex self-end">
                <button
                  type="submit"
                  className="btn tm-background text-white ml-3"
                >
                  Update Password
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>

      {userData?.role != "mentee" &&
        userData?.role != "agency_agent" &&
        userData?.role != "client" && (
          <div className="grow">
            <div className="px-0 lg:px-4 md:px-4 sm:px-0">
              <div className="p-6 space-y-6">
                <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
                  Subscription Details
                </h2>
                {/* Picture */}

                <section>
                  {/* <div className="flex items-center">
    <div className="mr-4">
      <img className="w-20 h-20 rounded-full" src={Image} width="80" height="80" alt="User upload" />
    </div>
    <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Change</button>
  </div> */}
                </section>
                {/* Business Profile */}
                <section>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        Type of plan
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          value={
                            userData?.current_plan_sorting
                              ? userData.current_plan_sorting
                              : userData?.is_trial === "true"
                              ? "Free Trial"
                              : ""
                          }
                          type="text"
                          disabled
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        />
                      </div>
                    </div>
                    {userData?.is_trial === "true" ? (
                      <div className="sm:w-1/3">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          {" "}
                          Start Date
                        </label>
                        <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                          <input
                            className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                            type="text"
                            value={
                              userData?.start_date ? userData?.start_date : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="sm:w-1/3">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          {" "}
                          Start Date
                        </label>
                        <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                          <input
                            className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                            type="text"
                            value={
                              userData?.start_date ? userData?.start_date : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    <div className="sm:w-1/3">
                      <label
                        className="block text-md font-semibold mb-2"
                        style={{ color: "#080D18" }}
                        htmlFor="business-id"
                      >
                        {" "}
                        End Date
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <input
                          value={userData?.start_date ? userData?.end_date : ""}
                          type="text"
                          disabled
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        />
                      </div>
                    </div>
                    {userData?.is_trial != "true" && (
                      <div className="sm:w-1/3">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          {" "}
                          Renewal Date
                        </label>
                        <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                          <input
                            value={
                              userData?.renewal_date
                                ? userData?.renewal_date
                                : ""
                            }
                            type="text"
                            disabled
                            className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      <div className="m-1.5">
        <ModalBasic
          id="feedback-modal"
          modalOpen={CropModalOpen}
          setModalOpen={setCropModalOpen}
          title="Crop the Image"
        >
          <Cropper
            src={image}
            style={{ height: 400, width: "100%", minWidth: "500px" }}
            // Cropper.js options
            initialAspectRatio={1}
            guides={true}
            ref={fileInputRef}
          />
          <div>
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  type="button"
                  className="mx-1 px-4 py-2 rounded-3xl focus:outline-none bg-gray-300 text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCropModalOpen(false);
                    setImage(null);
                  }}
                >
                  Cansel
                </button>
                <button
                  className="btn tm-background text-white"
                  onClick={() => {
                    cropImage("company_logo", userData?._id);
                    setCropModalOpen(false);
                  }}
                >
                  {userData?.company_logo ? "Update Logo" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </ModalBasic>
      </div>
      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-10 lg:px-10 md:px-10 sm:px-0 py-5 border-t border-slate-200 dark:border-slate-700">
          <div className="flex self-end">
            {isSubscriptionData?.authorizeNet_subscriptionId && (
              <>
                {userData?.to_do_cancle_subscription != 1 && (
                  <>
                    <Link
                      to="/plans"
                      className="btn tm-background text-white ml-3"
                    >
                      Update Subscription
                    </Link>
                    <button
                      onClick={() =>
                        cancleSubScription(
                          isSubscriptionData?.authorizeNet_subscriptionId
                        )
                      }
                      className="btn tm-background text-white ml-3"
                    >
                      Cancel Subscription
                    </button>
                  </>
                )}
                <Link
                  to="/updated-card-details"
                  className="btn tm-background text-white ml-3"
                >
                  Update Card Details
                </Link>
              </>
            )}
          </div>
          {userData?.to_do_cancle_subscription === 1 && (
            <h4 className="text-red-800 dark:text-slate-100 font-bold mb-5 ">
              You have canceled your subscription and your account will be
              deactivated on the {userData?.end_date ? userData?.end_date : ""}
            </h4>
          )}
        </div>
        {/* <button onClick={() => runCronUrl()} className="btn tm-background text-white ml-3">Cron hit</button> */}
      </footer>
      {user?.role === "agent" && <SubscriptionPanel userData={userData} />}
    </>
  );
}

export default AccountPanel;
