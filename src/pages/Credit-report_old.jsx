import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import moment from 'moment'
import PayBg from '../images/credit-page.png';
// import consumer_logo from '../images/consumer_logo.png';
import consumer_logo from "../images/logo-dark-mode.png";
import score_iq_logo from '../images/myScoreIQ-Logo-1.png';
import ModalBlank from '../components/ModalBlank';
import User from '../images/user-64-13.jpg';
import Header from '../partials/Header';
import { toast } from 'react-toastify';
import ModalAction from '../components/ModalAction';
import axios from 'axios'; // Import Axios for making API requests
import { UPLOAD_DOC_AWS, GET_DOC_FROM_AWS, REGISTER_IDENTITY_USER, GET_USER_DETAILS, GET_IDENTITY_SSN_NUMBER, GET_DATA_OF_USER_CLIENT, GET_IDENTITY_USER_DETAILS, UPDATE_IDENTITY_USER_DETAILS, GET_HTML_DATA_FROM_IDENTIITY_IQ, GET_USER_SCORE_PROGRESS, DELETE_USER_SCORE_PROGRESS, READ_HTML_RESPONSE, READ_HTML_RESPONSE_MYSCOREIQ, CHECK_HTML_RESPONSE, CREATE_USERS_ACTIVITY } from "../API/api.js"
import Footer from '../partials/Footer';
import { useNavigate } from "react-router-dom";
import DashboardSidebar from '../partials/DashboardSidebar';


function CreditReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [card, setCard] = useState(true);
  const [file, setFile] = useState(null);
  const [userSsnID, setuserSsnID] = useState();
  const [isData, setIsData] = useState(false);
  const [isProgressData, setIsProgressData] = useState("");
  const [isKeyId, setIsKeyId] = useState("");
  const [isBucketName, setIsBucketName] = useState("");
  const [getUsername, setgetUsername] = useState("");
  const [showEdit, setshowEdit] = useState(false);
  const [isIdentityVaue, setIsIdentityVaue] = useState(false);
  const [changeButton, setIsChangeButton] = useState(false);
  const [isEditusername, setIsEditusername] = useState("");
  const [isDocUploadedDate, setIsDocUploadedDate] = useState("");
  const [loaderGetting, setIsloaderGetting] = useState(false);
  const [isEditpassword, setIsEditpassword] = useState("*********");
  const [isEditsecurityAnswer, setIsEditsecurityAnswer] = useState("****");
  const [loaderUpload, setloaderUpload] = useState(false);
  const [changeStepOne, setIsChangeStepOne] = useState(false);
  const [changeStepTwo, setIsChangeStepTwo] = useState(false);
  const [changeStepThree, setIsChangeStepThree] = useState(false);
  const [changeStepFour, setIsChangeStepFour] = useState(false);
  const [changeStepFive, setIsChangeStepFive] = useState(false);
  const [UserData, setUserData] = useState("");
  const [isUploadButtonEnable, setIsUploadButtonEnable] = useState(false);

  const [changeStepOneLoader, setIsChangeStepOneLoader] = useState(false);
  const [changeStepTwoLoader, setIsChangeStepTwoLoader] = useState(false);
  const [changeStepThreeLoader, setIsChangeStepThreeLoader] = useState(false);
  const [changeStepFourLoader, setIsChangeStepFourLoader] = useState(false);
  const [changeStepFiveLoader, setIsChangeStepFiveLoader] = useState(false);


  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const stopButtonRef = useRef(null); // Create a ref for the "Stop" button


  const [form, setForm] = useState({
    username: "",
    password: '',
    securityAnswer: userSsnID,
  });

  const [validation, setValidation] = useState({
    username: true,
    password: true,
    securityAnswer: true,
  });

  const getSSNNumber = async () => {
    try {
      const response = await axios.post(GET_IDENTITY_SSN_NUMBER, {
        clientId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      setuserSsnID(response.data[0].SSN);
      setForm({
        ...form,
        securityAnswer: response.data[0].SSN,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };
  const getIdentitydata = async () => {
    try {
      const response = await axios.post(GET_IDENTITY_USER_DETAILS, {
        userid: id,

      },
        { headers: { "Authorization": "Bearer " + token } });
      setIsEditusername(response.data.userData);
      setIsDocUploadedDate(response.data.LastfileUploaded)
      if (response.data.userData) {
        setIsIdentityVaue(true);
        setshowEdit(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };

  const EditIdentityDetails = async () => {
    setIsEditusername(isEditusername);
    setIsEditpassword("");
    setIsEditsecurityAnswer("");
    setIsIdentityVaue(false);
    setIsChangeButton(true);
  };

  const UpdateIdentityDetails = async () => {
    let isValid = true;
    const newValidation = { ...validation };

    if (!isEditusername) {
      newValidation.username = false;
      isValid = false;
    }

    if (!isEditpassword) {
      newValidation.password = false;
      isValid = false;
    }
    if (!isEditsecurityAnswer) {
      newValidation.securityAnswer = false;
      isValid = false;
    }
    setValidation(newValidation);

    if (!isValid) {
      return;
    }
    try {
      const response = await axios.post(UPDATE_IDENTITY_USER_DETAILS, {
        name: isEditusername,
        password: isEditpassword,
        security_que_ans: isEditsecurityAnswer,
        user_id: id,
      },
        { headers: { "Authorization": "Bearer " + token } });

      if (response.data.data === null) {
        toast.error("Something Went Wrong");
      } else {
        toast.success(response.data.message);
        userActivity("Update Details", "", "", "success", `myScoreIQ, ${response.data.message}.`);
      }
      if (isEditpassword) {
        newValidation.password = true;
        isValid = true;
      }
      if (isEditsecurityAnswer) {
        newValidation.securityAnswer = true;
        isValid = true;
      }
      setValidation(newValidation);
      setIsChangeButton(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };

  useEffect(() => {
    getIdentitydata();
    getDataOfUserClient();
    getSSNNumber();
    getUserData()
  }, []);

  const getDataOfUserClient = async () => {
    try {
      const response = await axios.post(GET_DATA_OF_USER_CLIENT,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.status === "false") {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const isDate8DaysOld = (dateString) => {
    const dateUploaded = new Date(dateString); // Convert the date string to a Date object
    const today = new Date(); // Get today's date
    const differenceInTime = today.getTime() - dateUploaded.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 7;
  };

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data?.UserDetails);
      const IsDaysLeft = isDate8DaysOld(response?.data?.UserDetails.lastDocUploadedDate)
      if (IsDaysLeft && IsDaysLeft === true && response?.data?.UserDetails?.role !== "mentee") {
        setIsUploadButtonEnable(false);
      } else {
        if (response?.data?.UserDetails.lastDocUploadedDate && response?.data?.UserDetails.payment_status === 1 && response?.data?.UserDetails?.plan_name === "1" || response?.data?.UserDetails?.plan_name === "5" && response?.data?.UserDetails?.role !== "mentee" && response?.data?.UserDetails?.is_trial === "true") {
          setIsUploadButtonEnable(true);
        } else {
          setIsUploadButtonEnable(false);
        }
      }

    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const downLoadDocument = async () => {
    try {
      const response = await axios.post(GET_DOC_FROM_AWS, {
        Key: isKeyId,
        Bucket: isBucketName,
      }, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', isKeyId);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      setloaderSignup(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Reset validation when the input changes
    setValidation({ ...validation, [name]: true });
  };

  const handleSubmit = async (e) => {
    setForm({
      ...form,
      securityAnswer: userSsnID,
    });
    e.preventDefault();
    // Validate the form
    let isValid = true;
    const newValidation = { ...validation };

    if (!form.username) {
      newValidation.username = false;
      isValid = false;
    }

    if (!form.password) {
      newValidation.password = false;
      isValid = false;
    }
    if (!form.securityAnswer) {
      newValidation.securityAnswer = false;
      isValid = false;
    }
    setValidation(newValidation);

    if (!isValid) {
      return;
    }
    // setloaderSignup(true)

    try {
      const response = await axios.post(REGISTER_IDENTITY_USER, {
        form: form,
        userid: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message);
      getIdentitydata(id)
      setloaderSignup(false);
      setForm({
        username: '',
        password: '',
        securityAnswer: ''
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      setloaderSignup(false);
    }
  };

  useEffect(() => {
    if (responseData) {
      // If responseData is not null, click the "Stop" button
      stopButtonRef.current.click();
      setIsChangeStepOne(false)
      setIsChangeStepTwo(false)
      setIsChangeStepThree(false)
      setIsChangeStepFour(false)
      setIsChangeStepOneLoader(false)
      setIsChangeStepTwoLoader(false)
      setIsChangeStepThreeLoader(false)
      setIsChangeStepFourLoader(false);
      setIsChangeStepFiveLoader(false)
      setIsChangeStepFive(false);
    }
  }, [responseData]);

  const getLatestReportFromIdentity = async (value) => {
    deleteprogressByID(value);
    setIsloaderGetting(true);
    startFetchingData();
    try {
      const response = await axios.post(GET_HTML_DATA_FROM_IDENTIITY_IQ, {
        userId: value
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data) {
        const Key = response.data?.aws_data?.Key;
        const Bucket = response.data?.aws_data?.Bucket;
        const version = response.data?.aws_data?.version;
        await readHtmlFile(Key, Bucket);
        await deleteprogressByID(value);
        setIsChangeStepFive(true);
        setIsChangeStepFiveLoader(false)
        setIsChangeStepOne(false)
        setIsChangeStepTwo(false)
        setIsChangeStepThree(false)
        setIsChangeStepFour(false)
        setIsChangeStepOneLoader(false)
        setIsChangeStepTwoLoader(false)
        setIsChangeStepThreeLoader(false)
        setIsChangeStepFourLoader(false);
        setIsChangeStepFive(false);
        // userActivity("Connect to Get Latest Report, Connected.", "", "", "success");
        // console.log("Connect to Get Latest Report, Connected.");
      }
      setIsloaderGetting(false);
      setResponseData(response.data);
      getUserData();
      setTimeout(() => {
        setSuccessModalOpen(true);
      }, 1000);


    } catch (error) {
      deleteprogressByID(value);
      setIsloaderGetting(false);
      setIntegrationModalOpen(false)
      setIsChangeStepOne(false)
      setIsChangeStepTwo(false)
      setIsChangeStepThree(false)
      setIsChangeStepFiveLoader(false)
      setIsChangeStepFour(false)
      userActivity("Connect", "", "", "failed", "Connect Consumer-Law with My-Score-IQ, Failed!");
      toast.error(error.response.data.message || "Something went Wrong");
      setIsloaderGetting(false);
      stopButtonRef.current.click();
    }
  };

  const userActivity = async (activityName, externalPage, pagetype, activityStatus, description) => {
    try {
      const response = await axios.post(CREATE_USERS_ACTIVITY,
        {
          user_id: user?._id,
          activity: activityName,
          externalPage: externalPage,
          pagetype: pagetype,
          activityStatus: activityStatus,
          description: description
        },
        { headers: { "Authorization": "Bearer " + token } }
      );
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  }

  const handleUpload = async () => {

    if (!file) {
      toast.error("Please select a document");
      return;
    }

    // Check file size (in bytes)
    const maxSizeInBytes = 25 * 1024 * 1024; // 2 MB
    if (file.size > maxSizeInBytes) {
      toast.error("File size should not exceed 2 MB");
      return;
    }

    // Check file type
    if (!file.type.includes("html")) {
      toast.error("Only HTML files are allowed");
      return;
    }
    setloaderUpload(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(UPLOAD_DOC_AWS, {
        method: 'POST',
        body: formData,
        headers: {
          'userid': id, // Send userid in the request headers
          "Authorization": "Bearer " + token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsKeyId(data.data.Key);
        document.getElementById('fileInput').value = '';
        setIsBucketName(data.data.Bucket)
        getUserData();
        toast.success("File uploaded successfully");
        setIsData(true);
        setloaderUpload(false);
        setFile(null);
        userActivity("Upload", "", "", "", "Upload Credit Report");
      } else {
        setloaderUpload(false);
        const errorData = await response.json();
        // console.error('Error uploading file:', errorData);
        toast.error(errorData?.message);
      }
    } catch (error) {
      setloaderUpload(false);
      toast.error(error?.message);
      // console.error('Error:', error);
    }
  };
  const fetchData = async () => {
    setIntegrationModalOpen(true);
    setIsChangeStepOneLoader(true);
    try {
      const response = await axios.post(GET_USER_SCORE_PROGRESS, {
        userId: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.progress?.message === "login_success") {
        setIsChangeStepOneLoader(false)
        setIsChangeStepOne(true)
        setIsChangeStepTwoLoader(true)
      }
      if (response?.data?.progress?.message === "ssn_success") {
        setIsChangeStepOne(true)
        setIsChangeStepTwoLoader(false)
        setIsChangeStepTwo(true)
        setIsChangeStepThreeLoader(true)
      }
      if (response?.data?.progress?.message === "getting_report") {
        setIsChangeStepOne(true)
        setIsChangeStepTwo(true)
        setIsChangeStepThreeLoader(false);
        setIsChangeStepThree(true);
        setIsChangeStepFourLoader(true);
      }
      if (response?.data?.progress?.message === "auto_import_success") {
        setIsChangeStepOne(true)
        setIsChangeStepTwo(true)
        setIsChangeStepThree(true);
        setIsChangeStepFourLoader(false);
        setIsChangeStepFour(true);
        setIsChangeStepFiveLoader(true)
      }
    } catch (error) {
      setError(error);
      stopButtonRef.current.click(); // Click the "Stop" button on error
    }
  };

  const readHtmlFile = async (isKeyId, isBucketName) => {
    try {
      const response = await axios.post(READ_HTML_RESPONSE_MYSCOREIQ, {
        Key: isKeyId,
        Bucket: isBucketName,
      },
        { headers: { "Authorization": "Bearer " + token } });
      checkdata(response.data, isKeyId, isBucketName)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const checkdata = async (jsonDataResponse, isKeyId, isBucketName) => {
    try {
      const response = await axios.post(CHECK_HTML_RESPONSE, {
        data: jsonDataResponse,
        key: isKeyId,
        bucket: isBucketName
      },
        { headers: { "Authorization": "Bearer " + token } });
      // setprocessDataResponse(response.data);
      if (response.data) {
        // setSearchModalOpen(true)
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const startFetchingData = () => {
    setIsRunning(true);
    fetchData(); // Initial call
    const id = setInterval(fetchData, 1000);
    setIntervalId(id); // Store the interval ID in state
  };

  const stopFetchingData = () => {
    setIsRunning(false);
    clearInterval(intervalId); // Clear the interval using the stored interval ID
  };


  const deleteprogressByID = async (value) => {
    try {
      const response = await axios.post(DELETE_USER_SCORE_PROGRESS, {
        userId: value
      },
        { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };
  return (
    <>
      <Header />
      
      <div className="flex sm:h-[100dvh] overflow-hidden">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <main className="grow">
        <div className="relative pt-10	pb-10	">
          <div className="absolute inset-0 bg-slate-800 overflow-hidden" aria-hidden="true">
            <img className="object-cover h-full w-full filter " src={PayBg} width="460" height="80" alt="Pay background" />
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
            <div className="about- pt-5 pb-5 text-center">
              <div className="container-fluid col-6">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="">
                      <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Import Your Credit Report  </h1>
                      <p
                        className="mt-3 mb-4"
                      >
                        {/* Welcome to Credit Report */}
                        We have partnered with IdentityIQ/MyScoreIQ to provide you the tools to safely import your consumer report. If you don’t have an account with myScoreIQ. <a href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9" target="_blank" style={{ color: "blue" }}>Start here</a>

                      </p>
                      <p>When using Manual Upload Tool, make sure you export the HTML file from your myScoreIQ account (no PDF allowed)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center '>
          <div className="">
            <div className="bg-white dark:bg-slate-800 px-8 pb-6 rounded-b shadow-lg h-full">
              <div className='flex flex-col md:flex-row p-4'>
                {/* Card header */}
                <div>
                  <div className="text-center mb-6">
                    {/* <div className="mb-2">
                <img className="-mt-8 inline-flex rounded-full" src={User} width="64" height="64" alt="User" />
              </div> */}
                    {/* <h1 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">My Score Iq Report</h1>
                    <div className="text-sm">Sign-Up-My-Score-Iq</div> */}
                    <h1 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Connect To myScoreIQ</h1>
                    <div className="text-sm">
                      Sign In To Your MyscoreIQ account below <br /> to Import your consumer report
                    </div>
                  </div>
                  <button
                    ref={stopButtonRef}
                    style={{ display: 'none' }} // Hide the "Stop" button
                    onClick={stopFetchingData}
                  >
                    Stop API
                  </button>
                  {/* Toggle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                      <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                        {/* <span
                      className={`absolute inset-0 w-1/2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm transition duration-150 ease-in-out ${card ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    ></span> */}
                      </span>
                      <button
                        className={`relative flex-1 text-sm font-medium p-1 duration-150 ease-in-out`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCard(true);
                        }}
                      >
                        Connect To My Score IQ
                      </button>
                    </div>
                  </div>
                  {/* Card form */}
                  {card && (
                    <div>
                      {!showEdit ?
                        <>
                          <div className="space-y-4 w-full">
                            <form >
                              <div className='mb-3'>
                                <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                                  myScoreIQ Username
                                </label>
                                <input id="card-name" disabled={isIdentityVaue == true} name="username" onChange={handleFormChange} className="form-input w-full" type="text" placeholder="myScoreIQ Username" />
                                {!validation.username && <p className="text-red-500 mt-1">myScoreIQ Username is required</p>}
                              </div>
                              <div className='mb-3'>
                                <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                                  myScoreIQ Password
                                </label>
                                <input id="card-name" disabled={isIdentityVaue == true} name="password" onChange={handleFormChange} className="form-input w-full" type="password" placeholder="myScoreIQ Password" />
                                {!validation.password && <p className="text-red-500 mt-1">myScoreIQ Password is required</p>}
                              </div>
                              <div className='mb-3'>
                                <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                                Last four digits of your SSN?
                                </label>
                                <input id="card-name" maxLength={4} disabled={isIdentityVaue == true} value={form.securityAnswer} name="securityAnswer" onChange={handleFormChange} className="form-input w-full" type="password" placeholder="Security Question Answer" />
                                {!validation.securityAnswer && <p className="text-red-500 mt-1">Security Question Answer is required</p>}
                              </div>
                              <div className="mt-8">
                                <div className="mb-4 mt-4">
                                  <button onClick={handleSubmit} className="btn w-full tm-background text-white">SAVE</button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </>
                        :
                        <>
                          <div className="space-y-4">
                            <div className='mb-3'>
                              <label className="form-contorl bn w-full mb-4" htmlFor="card-name">
                                myScoreIQ Username
                              </label>
                              <input id="card-name" value={isEditusername} disabled={isIdentityVaue == true} name="username" onChange={(e) => setIsEditusername(e.target.value)} className="form-input w-full" type="text" placeholder="myScoreIQ Username" />
                              {!validation.username && <p className="text-red-500 mt-1">myScoreIQ Username is required</p>}
                            </div>
                            <div className='mb-3'>
                              <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                                myScoreIQ Password
                              </label>
                              <input id="card-name" value={isEditpassword} disabled={isIdentityVaue == true} name="password" onChange={(e) => setIsEditpassword(e.target.value)} className="form-input w-full" type="password" placeholder="myScoreIQ Password" />
                              {!validation.password && <p className="text-red-500 mt-1">myScoreIQ Password is required</p>}
                            </div>
                            <div className='mb-3'>
                              <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                              Last four digits of your SSN?
                              </label>
                              <input id="card-name" maxLength={4} value={isEditsecurityAnswer} disabled={isIdentityVaue == true} name="securityAnswer" onChange={(e) => setIsEditsecurityAnswer(e.target.value)} className="form-input w-full" type="password" placeholder="Security Question Answer" />
                              {!validation.securityAnswer && <p className="text-red-500 mt-1">Security Question Answer is required</p>}

                            </div>
                            <div className="mt-8">
                              {!changeButton ?
                                <>
                                  <div className="mb-4 mt-4">
                                    <button onClick={EditIdentityDetails} className="btn w-full tm-background text-white">Edit Login Details</button>
                                  </div>

                                  {loaderGetting
                                    ?
                                    <>
                                      <div className="mb-4 mt-4">
                                        <button className="btn w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                          </svg>
                                          <span className="ml-2">Getting Report...</span>
                                        </button>
                                      </div>
                                    </>
                                    :
                                    <div className="mb-4 mt-4">
                                      {isUploadButtonEnable
                                        ?
                                        <button className="btn w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                          <span className="ml-2">Connect to Get Latest Report</span>
                                        </button>
                                        :
                                        <button onClick={() => getLatestReportFromIdentity(id)} className="btn w-full tm-background text-white">Connect to Get Latest Report</button>
                                      }

                                    </div>
                                  }
                                  {isUploadButtonEnable
                                    ?
                                    <p className='text-sm text-red-500'>NOTE: You can only import 1 Consumer Report every 7 Days</p>
                                    :
                                    ""
                                  }
                                  <div className="text-sm">Last imported: <span>{isDocUploadedDate ? moment(isDocUploadedDate).format("YYYY-MM-DD") : "-"} </span></div>
                                  {UserData?.role != "mentee" &&
                                    <div className="mb-4 mt-4">
                                      <a href="/plans" className="btn w-full tm-background text-white">Click Here to upgrade plan</a>
                                    </div>
                                  }

                                </>
                                :
                                <div className="mb-4 mt-4">
                                  <button onClick={UpdateIdentityDetails} className="btn w-full tm-background text-white">Update</button>
                                </div>
                              }

                            </div>
                          </div>
                          {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="integration-modal" onClick={(e) => { e.stopPropagation(); setIntegrationModalOpen(true); }}>Integration</button> */}
                        </>
                      }

                    </div>
                  )}
                </div>
                <div class='m-5'>
                  <div class="h-full  bg-gray-300 w-[1px] mx-5"></div>
                </div>
                <div>
                  <div className="text-center mb-6">
                    <h1 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Upload Credit Report</h1>
                    <div className="text-sm">Upload Credit Report To ConsumerLaw Ai</div>
                    <div className="text-sm">
                      In case you are having issues exporting <br /> your credit report from myscoreIQ or importing <br /> using Safari. Please try using Google Chrome.
                    </div>
                  </div>
                  <button
                    ref={stopButtonRef}
                    style={{ display: 'none' }}
                    onClick={stopFetchingData}
                  >
                    Stop API
                  </button>
                  {/* Toggle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                      <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                        {/* <span
                      className={`absolute inset-0 w-1/2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm transition duration-150 ease-in-out  translate-x-full'
                        }`}
                    ></span> */}
                      </span>
                      <button
                        className={`relative flex-1 text-sm font-medium p-1 duration-150 ease-in-out ${card ? '' : 'tm-color'}`}

                      >
                        Upload Credit Report
                      </button>
                    </div>
                  </div>
                  {card && (
                    <div>
                      <div>
                        <div className="mb-4">
                          <label className="form-contorl bn w-full mb-5" htmlFor="card-name">
                            Upload Report
                          </label>
                          <div>
                            <input
                              name="file"
                              id="fileInput"
                              className="form-contorl btn w-full mb-4 mt-2"
                              style={{ border: "1px solid" }}
                              type="file"
                              onChange={handleFileChange}
                            />
                          </div>
                          {loaderUpload
                            ?
                            <button className="btn w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                              <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                              </svg>
                              <span className="ml-2">Uploading...</span>
                            </button>
                            :
                            <>
                              {isUploadButtonEnable
                                ?
                                <button className="btn w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                  <span className="ml-2">Upload</span>
                                </button>
                                :
                                <button onClick={handleUpload} className="btn w-full tm-background text-white">Upload</button>

                              }
                            </>
                          }
                        </div>
                        <Link to={`/credit-report-list/${id}`} download className="btn w-full tm-background text-white"
                          onClick={() => userActivity("View", "", "", "", "View Doc List")}
                        >View Doc List</Link>
                        <a href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9" target="_blank" className="btn w-full tm-background text-white mt-3"
                          onClick={() => userActivity("Page visit", "https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9", "external", "", "Sign Up To MyScore IQ")}
                        >Sign Up To MyScore IQ</a>

                      </div>
                    </div>
                  )}
                </div>
                <div class='m-5'>
                  <div class="h-full  bg-gray-300 w-[1px] mx-5"></div>
                </div>
                <div >
                  <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h1 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 ">How to get started?</h1>
                  </header>
                  <div className="p-3">
                    <div className="overflow-x-auto">
                      <div className="w-full">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src="https://www.youtube.com/embed/bMfSF9Xubnw"
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            uk-responsive
                            uk-video="automute: true"
                          ></iframe>
                        </div>
                      </div>
                      <br></br>
                      <div className="w-full">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src="https://www.youtube.com/embed/tQM9QTsFRkY"
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            uk-responsive
                            uk-video="automute: true"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalAction id="integration-modal" modalOpen={integrationModalOpen} setModalOpen={setIntegrationModalOpen}>
          <div className="mb-5 mt-3 text-center">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <img src={consumer_logo} width="120" height="100" alt="" />
              <svg className="h-4 w-4 fill-current text-slate-400" viewBox="0 0 16 16">
                <path d="M5 3V0L0 4l5 4V5h8a1 1 0 000-2H5zM11 11H3a1 1 0 000 2h8v3l5-4-5-4v3z" />
              </svg>
              <img src={score_iq_logo} width="100" height="100" alt="" />
            </div>
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Connect Consumer-Law with My-Score-IQ</div>
          </div>
          <div className="text-sm mb-5">
            <div className="font-medium text-slate-800 dark:text-slate-100 mb-3">Import Credit Report: </div>
            <ul className="space-y-2 mb-5">
              <li className="flex items-center">
                {changeStepOne ?
                  <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>
                  :
                  (changeStepOneLoader ?
                    <div className='mr-3'>
                      < svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    </div>
                    :
                    " "
                  )
                }
                <div>Connecting to MyScoreIQ</div>
              </li>
              <li className="flex items-center">
                {changeStepTwo ?
                  <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>
                  :
                  (changeStepTwoLoader ?
                    <div className='mr-3'>
                      < svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    </div>
                    :
                    " "
                  )
                }
                <div>Checking SSN number</div>
              </li>
              <li className="flex items-center">
                {changeStepThree ?
                  <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>
                  :
                  (changeStepThreeLoader ?
                    <div className='mr-3'>
                      < svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    </div>
                    :
                    " "
                  )
                }
                <div>Accessing Report Data</div>
              </li>
              <li className="flex items-center">
                {changeStepFour ?
                  <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>
                  :
                  (changeStepFourLoader ?
                    <div className='mr-3'>
                      < svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    </div>
                    :
                    " "
                  )
                }
                <div>Auto Import Running</div>
              </li>
              <li className="flex items-center">
                {changeStepFive ?
                  <svg className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>
                  :
                  (changeStepFiveLoader ?
                    <div className='mr-3'>
                      < svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    </div>
                    :
                    " "
                  )
                }
                <div>Generating Audit Report</div>
              </li>
            </ul>
          </div>
          {/* Modal footer */}
        </ModalAction>
        {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="success-modal" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}>Success Modal</button> */}
        <ModalBlank id="success-modal" modalOpen={successModalOpen} setModalOpen={setSuccessModalOpen}>
          <div className="  mb-5 pb-5 ">
            <div className="w-10 h-10 rounded-full">
            </div>
            <div>
              <div className="mb-5 text-center">
                <div className='mb-4' style={{ textAlign: "-webkit-center" }}>
                  <svg className="w-15 h-12 shrink-0 fill-current text-emerald-500" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Your Credit Report Import is now Complete!</div>
              </div>
              <div className="flex flex-wrap justify-center space-x-2">
                <Link
                  className="btn tm-background text-white"
                  to={`/credit-report-list/${id}`}
                >
                  Get Your Audit Report
                </Link>
                <button className="btn tm-background text-white" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(false); }}>Close</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </main >
      </div>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}

export default CreditReport;