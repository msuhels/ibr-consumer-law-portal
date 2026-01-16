import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import moment from 'moment'
import PayBg from '../images/credit-page.png';
// import consumer_logo from '../images/consumer_logo.png';
import consumer_logo from "../images/logo-dark-mode.png";
import score_iq_logo from '../images/myScoreIQ-Logo-1.png';
import idenity_iq_logo from '../images/idenityIq.png';
import ModalBlank from '../components/ModalBlank';
import User from '../images/user-64-13.jpg';
import Header from '../partials/Header';
import { toast } from 'react-toastify';
import ModalAction from '../components/ModalAction';
import axios from 'axios'; // Import Axios for making API requests
import { UPLOAD_DOC_AWS, GET_DOC_FROM_AWS, GET_DOC_LIST_FROM_AWS, REGISTER_IDENTITY_USER, GET_USER_DETAILS, GET_IDENTITY_SSN_NUMBER, GET_DATA_OF_USER_CLIENT, GET_IDENTITY_USER_DETAILS, UPDATE_IDENTITY_USER_DETAILS, GET_HTML_DATA_FROM_IDENTIITY_IQ, GET_USER_SCORE_PROGRESS, DELETE_USER_SCORE_PROGRESS, READ_HTML_RESPONSE, READ_HTML_RESPONSE_MYSCOREIQ, CHECK_HTML_RESPONSE, CREATE_USERS_ACTIVITY } from "../API/api.js"
import Footer from '../partials/Footer';
import { useNavigate } from "react-router-dom";
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'


function CreditReport() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [card, setCard] = useState(true);
  const [list, setList] = useState([]);
  const [file, setFile] = useState(null);
  const [userSsnID, setuserSsnID] = useState();
  const [isData, setIsData] = useState(false);
  const [isProgressData, setIsProgressData] = useState("");
  const [isKeyId, setIsKeyId] = useState("");
  const [isBucketName, setIsBucketName] = useState("");
  const [getUsername, setgetUsername] = useState("");
  const [showEdit, setshowEdit] = useState(false);
  const [showIdentityEdit, setShowIdentityEdit] = useState(false);
  const [isIdentityVaue, setIsIdentityVaue] = useState(false);
  const [isProcressType, setIsProcressType] = useState("");


  const [isIdentityTwoVaue, setIsIdentityTwoVaue] = useState(false);

  const [changeButton, setIsChangeButton] = useState(false);
  const [changeButtonTwo, setIsChangeButtonTwo] = useState(false);

  const [isDocUploadedDate, setIsDocUploadedDate] = useState("");
  const [loaderGetting, setIsloaderGetting] = useState(false);
  const [isEditusername, setIsEditusername] = useState("");
  const [isEditpassword, setIsEditpassword] = useState("");
  // const [isEditsecurityAnswer, setIsEditsecurityAnswer] = useState("****");
  const [isEditsecurityAnswer, setIsEditsecurityAnswer] = useState("");
  const [isEditsequrityAnswerOption, setIsEditSequrityAnswerOption] = useState("");

  const [isIdentityEditusername, setIsIdentityEditusername] = useState("");
  const [isIdentityEditpassword, setIsIdentityEditpassword] = useState("");
  // const [isIdentityEditsecurityAnswer, setIsIdentityEditsecurityAnswer] = useState("****");
  const [isIdentityEditsecurityAnswer, setIsIdentityEditsecurityAnswer] = useState("");
  const [isIdentityEditsecurityAnswerOption, setIsIdentityEditsecurityAnswerOption] = useState("");

  const [loaderUpload, setloaderUpload] = useState(false);
  const [changeStepOne, setIsChangeStepOne] = useState(false);
  const [changeStepTwo, setIsChangeStepTwo] = useState(false);
  const [changeStepThree, setIsChangeStepThree] = useState(false);
  const [changeStepFour, setIsChangeStepFour] = useState(false);
  const [changeStepFive, setIsChangeStepFive] = useState(false);
  const [UserData, setUserData] = useState("");
  // const [isUploadButtonEnable, setIsUploadButtonEnable] = useState(false);

  const [changeStepOneLoader, setIsChangeStepOneLoader] = useState(false);
  const [changeStepTwoLoader, setIsChangeStepTwoLoader] = useState(false);
  const [changeStepThreeLoader, setIsChangeStepThreeLoader] = useState(false);
  const [changeStepFourLoader, setIsChangeStepFourLoader] = useState(false);
  const [changeStepFiveLoader, setIsChangeStepFiveLoader] = useState(false);
  const [isOpenStep, setIsOpenStep] = useState(1);


  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const stopButtonRef = useRef(null); // Create a ref for the "Stop" button


  const [form, setForm] = useState({
    username: "",
    password: '',
    // securityAnswer: userSsnID,
    securityAnswer: '',
    sequrityAnswerOption: ''
  });

  const [identityForm, setIdentityForm] = useState({
    username: "",
    password: '',
    // securityAnswer: userSsnID,
    securityAnswer: '',
    sequrityAnswerOption: ''
  });

  const [validation, setValidation] = useState({
    username: true,
    password: true,
    securityAnswer: true,
    sequrityAnswerOption: true,
  });

  const getSSNNumber = async () => {
    try {
      const response = await axios.post(GET_IDENTITY_SSN_NUMBER, {
        clientId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      // setuserSsnID(response.data[0].SSN);
      // setForm({
      //   ...form,
      //   securityAnswer: response.data[0].SSN,
      // });
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };

  const getAwsData = async () => {
    // setsetLoader(true);
    try {
      const response = await axios.post(GET_DOC_LIST_FROM_AWS, {
        userid: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.aws_list) {
        setList(response.data.aws_list)
      }
      // setsetLoader(false);
    } catch (error) {
      // setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getScoreIqdata = async () => {
    try {
      const response = await axios.post(GET_IDENTITY_USER_DETAILS, {
        userid: id,
        type: "scoreIq"

      },
        { headers: { "Authorization": "Bearer " + token } });
      setIsEditusername(response.data.userData.name);
      setIsEditSequrityAnswerOption(response.data.userData.security_ans_option);
      setIsEditsecurityAnswer(response.data.userData.security_que_ans);
      setIsEditpassword(response.data.userData.password);
      setIsDocUploadedDate(response.data.LastfileUploaded)
      if (response.data.userData) {
        setIsIdentityVaue(true);
        setshowEdit(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };


  const getIdentitydata = async () => {
    try {
      const response = await axios.post(GET_IDENTITY_USER_DETAILS, {
        userid: id,
        type: "indentityIq"
      },
        { headers: { "Authorization": "Bearer " + token } });
      // setIsIdentityEditusername(response.data.userData);
      setIsIdentityEditusername(response.data.userData.name);
      setIsIdentityEditsecurityAnswerOption(response.data.userData.security_ans_option);
      setIsIdentityEditsecurityAnswer(response.data.userData.security_que_ans);
      setIsIdentityEditpassword(response.data.userData.password);
      setIsDocUploadedDate(response.data.LastfileUploaded);
      if (response.data.userData) {
        setIsIdentityTwoVaue(true);
        setShowIdentityEdit(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };

  const EditScoreIqDetails = async () => {
    setIsEditusername(isEditusername);
    setIsEditpassword(isEditpassword);
    setIsEditsecurityAnswer(isEditsecurityAnswer);
    setIsEditSequrityAnswerOption(isEditsequrityAnswerOption);
    setIsIdentityVaue(false);
    setIsChangeButton(true);
  };
  const EditIdentityDetails = async () => {
    setIsIdentityEditusername(isIdentityEditusername);
    setIsIdentityEditpassword(isIdentityEditpassword);
    setIsIdentityEditsecurityAnswer(isIdentityEditsecurityAnswer);
    setIsIdentityEditsecurityAnswerOption(isIdentityEditsecurityAnswerOption);
    setIsIdentityTwoVaue(false);
    setIsChangeButtonTwo(true);
  };


  const UpdateScoreDetails = async (type) => {
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
    if (!isEditsequrityAnswerOption) {
      newValidation.sequrityAnswerOption = false;
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
        type: type,
      },
        { headers: { "Authorization": "Bearer " + token } });

      if (response.data.data === null) {
        toast.error("Something Went Wrong");
      } else {
        toast.success(response.data.message);
        userActivity("Update Details", "", "", "success", `${type}, ${response.data.message}.`);
      }
      if (isEditpassword) {
        newValidation.password = true;
        isValid = true;
      }
      if (isEditsecurityAnswer) {
        newValidation.securityAnswer = true;
        isValid = true;
      }
      setIsIdentityVaue(true);
      setValidation(newValidation);
      setIsChangeButton(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };



  const UpdateIdentityDetails = async (type) => {
    let isValid = true;
    const newValidation = { ...validation };

    if (!isIdentityEditusername) {
      newValidation.username = false;
      isValid = false;
    }

    if (!isIdentityEditpassword) {
      newValidation.password = false;
      isValid = false;
    }
    if (!isIdentityEditsecurityAnswer) {
      newValidation.securityAnswer = false;
      isValid = false;
    }
    if (!isIdentityEditsecurityAnswerOption) {
      newValidation.sequrityAnswerOption = false;
      isValid = false;
    }
    setValidation(newValidation);

    if (!isValid) {
      return;
    }
    try {
      const response = await axios.post(UPDATE_IDENTITY_USER_DETAILS, {
        name: isIdentityEditusername,
        password: isIdentityEditpassword,
        security_que_ans: isIdentityEditsecurityAnswer,
        security_ans_option: isIdentityEditsecurityAnswerOption,
        user_id: id,
        type: type,
      },
        { headers: { "Authorization": "Bearer " + token } });

      if (response.data.data === null) {
        toast.error("Something Went Wrong");
      } else {
        toast.success(response.data.message);
        userActivity("Update Details", "", "", "success", `${type}, ${response.data.message}.`);
      }
      if (isIdentityEditpassword) {
        newValidation.password = true;
        isValid = true;
      }
      if (isIdentityEditsecurityAnswer) {
        newValidation.securityAnswer = true;
        isValid = true;
      }
      if (isIdentityEditsecurityAnswerOption) {
        newValidation.sequrityAnswerOption = true;
        isValid = true;
      }
      setIsIdentityTwoVaue(true);
      setValidation(newValidation);
      setIsChangeButtonTwo(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }

  };

  useEffect(() => {
    getAwsData();
    getScoreIqdata();
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
      // const IsDaysLeft = isDate8DaysOld(response?.data?.UserDetails.lastDocUploadedDate)
      // if (IsDaysLeft && IsDaysLeft === true && response?.data?.UserDetails?.role !== "mentee") {
      //   setIsUploadButtonEnable(false);
      // } else {
      //   if (response?.data?.UserDetails.lastDocUploadedDate && response?.data?.UserDetails.payment_status === 1 && response?.data?.UserDetails?.plan_name === "1" || response?.data?.UserDetails?.plan_name === "5" && response?.data?.UserDetails?.role !== "mentee" && response?.data?.UserDetails?.is_trial === "true") {
      //     setIsUploadButtonEnable(true);
      //   } else {
      //     setIsUploadButtonEnable(false);
      //   }
      // }

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
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Reset validation when the input changes
    setValidation({ ...validation, [name]: true });
  };

  const handleIdentityFormChange = (e) => {
    const { name, value } = e.target;
    setIdentityForm({ ...identityForm, [name]: value });
    // Reset validation when the input changes
    setValidation({ ...validation, [name]: true });
  };

  const handleSubmit = async (e) => {
    // setForm({
    //   ...form,
    //   securityAnswer: userSsnID,
    // });
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
    if (!form.sequrityAnswerOption) {
      newValidation.sequrityAnswerOption = false;
      isValid = false;
    }
    setValidation(newValidation);

    if (!isValid) {
      return;
    }
    // console.log('form?.sequrityAnswerOption1:', form?.sequrityAnswerOption)
    // return

    try {
      const response = await axios.post(REGISTER_IDENTITY_USER, {
        form: form,
        userid: id,
        type: "myScoreIq",
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message);
      getScoreIqdata(id);
      setForm({
        username: '',
        password: '',
        securityAnswer: '',
        sequrityAnswerOption: ''
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };


  const handleIdentitySubmit = async (e) => {
    // setIdentityForm({
    //   ...identityForm,
    //   securityAnswer: userSsnID,
    // });
    e.preventDefault();
    // Validate the identityForm
    let isValid = true;
    const newValidation = { ...validation };

    if (!identityForm.username) {
      newValidation.username = false;
      isValid = false;
    }

    if (!identityForm.password) {
      newValidation.password = false;
      isValid = false;
    }
    if (!identityForm.securityAnswer) {
      newValidation.securityAnswer = false;
      isValid = false;
    }
    if (!identityForm.sequrityAnswerOption) {
      newValidation.sequrityAnswerOption = false;
      isValid = false;
    }
    setValidation(newValidation);

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post(REGISTER_IDENTITY_USER, {
        form: identityForm,
        userid: id,
        type: "identity",
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message);
      getIdentitydata(id)
      setIdentityForm({
        username: '',
        password: '',
        securityAnswer: '',
        sequrityAnswerOption: ''
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
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

  const getLatestReportFromScoreIq = async (value) => {
    setIsProcressType("MyScoreIQ")
    deleteprogressByID(value);
    setIsloaderGetting(true);
    startFetchingData();
    setIsChangeStepFive(false);
    setIsChangeStepFiveLoader(false)
    setIsChangeStepTwo(false)
    setIsChangeStepThree(false)
    setIsChangeStepFour(false)
    setIsChangeStepTwoLoader(false)
    setIsChangeStepThreeLoader(false)
    setIsChangeStepFourLoader(false);
    setIsChangeStepFive(false);
    try {

      const response = await axios.post(GET_HTML_DATA_FROM_IDENTIITY_IQ, {
        userId: value,
        type: "scoreIq"
      },
        { headers: { "Authorization": "Bearer " + token } });

      if (response?.data) {
        const Key = response.data?.aws_data?.Key;
        const Bucket = response.data?.aws_data?.Bucket;
        const version = response.data?.aws_data?.version;
        await readHtmlFile(Key, Bucket);
        setTimeout(async () => {
          await deleteprogressByID(value);
        }, 3000);
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

  const getLatestReportFromIdentity = async (value) => {
    setIsProcressType("IdentityIQ")
    deleteprogressByID(value);
    setIsloaderGetting(true);
    startFetchingData();
    setIsChangeStepFive(false);
    setIsChangeStepFiveLoader(false)
    setIsChangeStepTwo(false)
    setIsChangeStepThree(false)
    setIsChangeStepFour(false)
    setIsChangeStepTwoLoader(false)
    setIsChangeStepThreeLoader(false)
    setIsChangeStepFourLoader(false);
    setIsChangeStepFive(false);
    try {

      const response = await axios.post(GET_HTML_DATA_FROM_IDENTIITY_IQ, {
        userId: value,
        type: "identityIq"

      },
        { headers: { "Authorization": "Bearer " + token } });

      if (response?.data) {
        const Key = response.data?.aws_data?.Key;
        const Bucket = response.data?.aws_data?.Bucket;
        const version = response.data?.aws_data?.version;
        await readHtmlFile(Key, Bucket);
        setTimeout(async () => {
          await deleteprogressByID(value);
        }, 3000);
        setIsChangeStepFive(true);
        setIsChangeStepFiveLoader(false);
        setIsChangeStepOne(false);
        setIsChangeStepTwo(false);
        setIsChangeStepThree(false);
        setIsChangeStepFour(false);
        setIsChangeStepOneLoader(false);
        setIsChangeStepTwoLoader(false);
        setIsChangeStepThreeLoader(false);
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
      setIntegrationModalOpen(false);
      setIsChangeStepOne(false);
      setIsChangeStepTwo(false);
      setIsChangeStepThree(false);
      setIsChangeStepFiveLoader(false);
      setIsChangeStepFour(false);
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
        getAwsData();
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
    const intervalId = setInterval(fetchData, 1000);
    setIntervalId(intervalId);

    setTimeout(() => {
      clearInterval(intervalId);
      setIsRunning(false);
      setIntegrationModalOpen(false);
    }, 90000);
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

  const sequrityAnswersOption = [
    "What is your pet's name?",
    "What was the name of your first school?",
    "Who was your childhood hero?",
    "What is your all-time favorite sport team?",
    "What is your father's middle name?",
    "What was your high school mascot?",
    "What make was your first car or bike?",
    "Where did you first meet your spouse?",
    "Last four digits of your SSN?"
  ];

  return (
    <>
      <Header />
      {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex sm:h-[100dvh] px-8  bg-white">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex mx-5 flex-col flex-1 ">
          <main className="grow">
            <div className="relative	pb-10	">
              <div className="">
                <div className="about-  pb-5 ">
                  <div className="container-fluid col-6">
                    <div className="">
                      <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
                        Import Your Credit Report
                      </h1>
                      <p className="mt-3 mb-4" >
                        We have partnered with IdentityIQ/MyScoreIQ to provide you the tools to safely import your consumer report. If you don’t have an account with myScoreIQ.
                        <a className='text-[red]' href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9" target="_blank" >Start here</a>
                      </p>
                      <p>When using Manual Upload Tool, make sure you export the HTML file from your myScoreIQ account (no PDF allowed)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:grid md:grid-cols-4 gap-1 mb-10 ">
              <div className='mt-3'>
                <div className='border p-3 rounded-2xl border-slate-150'>
                  <button
                    onClick={() => setIsOpenStep(1)}
                    className={`w-full mt-4 ${isOpenStep == 1 ? ' bg-[#bd0808] text-white' : 'bg-[#F4F5F6] text-black'}  rounded-3xl p-2`}>
                    Connect to myscore IQ
                  </button>
                  <button
                    onClick={() => setIsOpenStep(4)}
                    className={`w-full mt-4 ${isOpenStep == 4 ? ' bg-[#bd0808] text-white' : 'bg-[#F4F5F6] text-black'}  rounded-3xl p-2`}>
                    Connect to Identity IQ
                  </button>

                  <button
                    onClick={() => setIsOpenStep(2)}
                    className={`w-full mt-4 ${isOpenStep == 2 ? ' bg-[#bd0808] text-white' : 'bg-[#F4F5F6] text-black'}  rounded-3xl p-2`}>
                    Upload Credit Report
                  </button>
                  <button
                    onClick={() => setIsOpenStep(3)}
                    className={`w-full mt-4 ${isOpenStep == 3 ? ' bg-[#bd0808] text-white' : 'bg-[#F4F5F6] text-black'}  rounded-3xl p-2`}>
                    How to get started
                  </button>
                </div>
              </div>
              <div className='col-span-3 mt-3 md:mx-5 md:mr-24 border p-3 rounded-2xl border-slate-150'>
                {isOpenStep == 1 &&
                  <div>
                    <div className=" mb-6">
                      <div className="md:flex justify-between items-center mb-3">
                        <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-3">Connect to myscore IQ</h1>
                        <a href="https://youtu.be/bMfSF9Xubnw" target="_blank" className='text-blue-500'>Looking for help? Check out the video.
                        </a>
                      </div>

                      <div className="text-sm">
                        Sign In To Your MyscoreIQ account below to Import your consumer report
                      </div>
                    </div>
                    <button
                      ref={stopButtonRef}
                      style={{ display: 'none' }}
                      onClick={stopFetchingData}
                    >
                      Stop API
                    </button>
                    {/* <div className="flex justify-center mb-6">
                      <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                        <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
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
                    </div> */}
                    {card && (
                      <div>
                        {!showEdit ?
                          <>
                            <div className="space-y-4 w-full">
                              <form >
                                <div className='mb-3'>
                                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    myscoreIQ Username
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityVaue == true} name="username" onChange={handleFormChange} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Enter myscoreIQ username" />
                                  </div>
                                  {!validation.username && <p className="text-red-500 mt-1 ml-2">myScoreIQ Username is required</p>}
                                </div>
                                <div className='mb-3'>
                                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    myscoreIQ Password
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityVaue == true} name="password" value={form.password} onChange={handleFormChange} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Enter myscoreIQ password" />
                                  </div>
                                  {!validation.password && <p className="text-red-500 mt-1 ml-2">myScoreIQ Password is required</p>}
                                </div>
                                <div className="mb-3">
                                  <label
                                    className="block text-md font-semibold mb-2" style={{ color: '#080D18' }}
                                    htmlFor="card-name"
                                  >
                                    Sequrity Question
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <select
                                      id="card-name"
                                      name="sequrityAnswerOption"
                                      value={form.sequrityAnswerOption}
                                      onChange={handleFormChange}
                                      // autoComplete="state"
                                      className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    >
                                      <option value="">Choose Your Secret Question</option>
                                      {/* Map through sequrityAnswersOption to generate options */}
                                      {sequrityAnswersOption.map((sequrityAnswerOption, index) => (
                                        <option key={index} value={sequrityAnswerOption}>
                                          {sequrityAnswerOption}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {!validation.sequrityAnswerOption && <p className="text-red-500 mt-1 ml-2">Security Question is required</p>}
                                </div>
                                <div className='mb-3'>
                                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    {/* Last 4 digits of your SSN? */}
                                    Please enter the answer to your security question
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityVaue == true} value={form.securityAnswer} name="securityAnswer"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // if (/^\d{0,4}$/.test(value)) {
                                        handleFormChange(e)
                                        // }
                                      }}
                                      className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Security Question Answer" />
                                  </div>
                                  {!validation.securityAnswer && <p className="text-red-500 mt-1 ml-2">Security Question Answer is required</p>}
                                </div>
                                <div className="mt-8">
                                  <div className="mb-4 mt-4">
                                    <button onClick={handleSubmit} className="py-2 px-4 rounded-3xl tm-background text-white rounded-3xl">Connect to myscore IQ</button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </>
                          :
                          <>
                            <div className="space-y-4">
                              <div className='mb-3'>
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  myScoreIQ Username
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isEditusername} disabled={isIdentityVaue == true} name="username" onChange={(e) => setIsEditusername(e.target.value)} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="myScoreIQ Username" />
                                </div>
                                {!validation.username && <p className="text-red-500 mt-1">myScoreIQ Username is required</p>}
                              </div>
                              <div className='mb-3'>
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  myScoreIQ Password
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isEditpassword} disabled={isIdentityVaue == true} name="password" onChange={(e) => setIsEditpassword(e.target.value)} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="myScoreIQ Password" />
                                </div>
                                {!validation.password && <p className="text-red-500 mt-1">myScoreIQ Password is required</p>}
                              </div>

                              <div className="mb-3">
                                <label
                                  className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }}
                                  htmlFor="card-name"
                                >
                                  Sequrity Question
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    disabled={isIdentityVaue == true}
                                    id="card-name"
                                    name="sequrityAnswerOption"
                                    value={isEditsequrityAnswerOption}
                                    onChange={(e) => setIsEditSequrityAnswerOption(e.target.value)}
                                    // autoComplete="state"
                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Choose Your Secret Question</option>
                                    {/* Map through sequrityAnswersOption to generate options */}
                                    {sequrityAnswersOption.map((sequrityAnswerOption, index) => (
                                      <option key={index} value={sequrityAnswerOption}>
                                        {sequrityAnswerOption}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {!validation.sequrityAnswerOption && <p className="text-red-500 mt-1">Security Question is required</p>}
                              </div>

                              <div className='mb-3'>
                                <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  {/* Last four digits of your SSN? */}
                                  Please enter the answer to your security question
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isEditsecurityAnswer} disabled={isIdentityVaue == true} name="securityAnswer"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // if (/^\d{0,4}$/.test(value)) {
                                      setIsEditsecurityAnswer(e.target.value)
                                      // }
                                    }}
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Security Question Answer" />
                                </div>
                                {!validation.securityAnswer && <p className="text-red-500 mt-1">Security Question Answer is required</p>}
                              </div>
                              <div className="mt-8">
                                {!changeButton ?
                                  <>
                                    {loaderGetting
                                      ?
                                      <>
                                        <div className="mb-4 mt-4">
                                          <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                            <div className='flex justify-center'>
                                              <svg className="animate-spin w-4 h-5 fill-current shrink-0" viewBox="0 0 16 16">
                                                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                              </svg>
                                              <span className="ml-2">Getting Report...</span>
                                            </div>
                                          </button>
                                        </div>
                                      </>
                                      :
                                      <div className="mb-4 mt-4">
                                        <button onClick={() => getLatestReportFromScoreIq(id)} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Next</button>
                                      </div>
                                    }
                                     <div className="mb-4 mt-4">
                                      <button onClick={EditScoreIqDetails} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Edit Login Details</button>
                                    </div>
                                    {/* {isUploadButtonEnable
                                      ?
                                      <p className='text-sm text-red-500'>NOTE: You can only import 1 Consumer Report every 7 Days</p>
                                      :
                                      ""
                                    } */}
                                    <div className="text-sm">Last imported: <span>{isDocUploadedDate ? moment(isDocUploadedDate).format("YYYY-MM-DD") : "-"} </span></div>
                                    { user?.plan_name == "1" || user?.plan_name == "5" && 
                                      <div className="mb-4 mt-4">
                                        <a href="/plans" className="py-2 px-4 rounded-3xl w-full tm-background text-white">Click Here to upgrade plan</a>
                                      </div>
                                    }

                                  </>
                                  :
                                  <div className="mb-4 mt-4">
                                    <button onClick={(e) => { UpdateScoreDetails("ScoreIQ") }} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Update</button>
                                  </div>
                                }
                              </div>
                            </div>
                            {/* <button className="py-2 px-4 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="integration-modal" onClick={(e) => { e.stopPropagation(); setIntegrationModalOpen(true); }}>Integration</button> */}
                          </>
                        }
                      </div>
                    )}
                  </div>
                }
                {isOpenStep == 4 &&
                  <div>
                    <div className=" mb-6">
                      <div className='md:flex justify-between items-center mb-3 '>
                        <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-3">Connect to Identity IQ</h1>
                        <a href="https://youtu.be/bMfSF9Xubnw" target="_blank" className='text-blue-500'>Looking for help? Check out the video.
                        </a>
                      </div>
                      <div className="text-sm">
                        Sign In To Your IdentityIQ account below to Import your consumer report
                      </div>
                    </div>
                    <button
                      ref={stopButtonRef}
                      style={{ display: 'none' }}
                      onClick={stopFetchingData}
                    >
                      Stop API
                    </button>
                    {/* <div className="flex justify-center mb-6">
                      <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                        <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
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
                    </div> */}
                    {card && (
                      <div>
                        {!showIdentityEdit ?
                          <>
                            <div className="space-y-4 w-full">
                              <form >
                                <div className='mb-3'>
                                  <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    IdentityIQ Username
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityTwoVaue == true} name="username" onChange={handleIdentityFormChange} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Enter IdentityIQ username" />
                                  </div>
                                  {!validation.username && <p className="text-red-500 mt-1 ml-2">IdentityIQ Username is required</p>}
                                </div>
                                <div className='mb-3'>
                                  <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    IdentityIQ Password
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityTwoVaue == true} name="password" onChange={handleIdentityFormChange} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Enter IdentityIQ password" />
                                  </div>
                                  {!validation.password && <p className="text-red-500 mt-1 ml-2">IdentityIQ Password is required</p>}
                                </div>
                                <div className="mb-3">
                                  <label
                                    className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }}
                                    htmlFor="card-name"
                                  >
                                    Sequrity Question
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <select
                                      id="card-name"
                                      name="sequrityAnswerOption"
                                      value={identityForm.sequrityAnswerOption}
                                      onChange={handleIdentityFormChange}
                                      // autoComplete="state"
                                      className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    >
                                      <option value="">Choose Your Secret Question</option>
                                      {/* Map through sequrityAnswersOption to generate options */}
                                      {sequrityAnswersOption.map((sequrityAnswerOption, index) => (
                                        <option key={index} value={sequrityAnswerOption}>
                                          {sequrityAnswerOption}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {!validation.sequrityAnswerOption && <p className="text-red-500 mt-1 ml-2">Security Question is required</p>}
                                </div>
                                <div className='mb-3'>
                                  <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                    {/* Last 4 digits of your SSN? */}
                                    Please enter the answer to your security question
                                  </label>
                                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                    <input id="card-name" disabled={isIdentityTwoVaue == true} value={identityForm?.securityAnswer} name="securityAnswer"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // if (/^\d{0,4}$/.test(value)) {
                                        handleIdentityFormChange(e);
                                        // }
                                      }} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Security Question Answer" />
                                  </div>
                                  {!validation.securityAnswer && <p className="text-red-500 mt-1 ml-2">Security Question Answer is required</p>}
                                </div>
                                <div className="mt-8">
                                  <div className="mb-4 mt-4">
                                    <button onClick={handleIdentitySubmit} className="py-2 px-4 rounded-3xl tm-background text-white rounded-3xl">Connect to IdentityIQ</button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </>
                          :
                          <>

                            <div className="space-y-4">
                              <div className='mb-3'>
                                <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  IdentityIQ Username
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isIdentityEditusername} disabled={isIdentityTwoVaue == true} name="username" onChange={(e) => setIsIdentityEditusername(e.target.value)} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="IdentityIQ Username" />
                                </div>
                                {!validation.username && <p className="text-red-500 mt-1">IdentityIQ Username is required</p>}
                              </div>
                              <div className='mb-3'>
                                <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  IdentityIQ Password
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isIdentityEditpassword} disabled={isIdentityTwoVaue == true} name="password" onChange={(e) => setIsIdentityEditpassword(e.target.value)} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="IdentityIQ Password" />
                                </div>
                                {!validation.password && <p className="text-red-500 mt-1">IdentityIQ Password is required</p>}
                              </div>

                              <div className="mb-3">
                                <label
                                  className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }}
                                  htmlFor="card-name"
                                >
                                  Sequrity Question
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    disabled={isIdentityTwoVaue == true}
                                    id="card-name"
                                    name="sequrityAnswerOption"
                                    value={isIdentityEditsecurityAnswerOption}
                                    onChange={(e) => setIsIdentityEditsecurityAnswerOption(e.target.value)}
                                    // autoComplete="state"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Choose Your Secret Question</option>
                                    {/* Map through sequrityAnswersOption to generate options */}
                                    {sequrityAnswersOption.map((sequrityAnswerOption, index) => (
                                      <option key={index} value={sequrityAnswerOption}>
                                        {sequrityAnswerOption}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {!validation.sequrityAnswerOption && <p className="text-red-500 mt-1">Security Question is required</p>}
                              </div>

                              <div className='mb-3'>
                                <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="card-name">
                                  {/* Last four digits of your SSN? */}
                                  Please enter the answer to your security question
                                </label>
                                <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input id="card-name" value={isIdentityEditsecurityAnswer}
                                    disabled={isIdentityTwoVaue == true} name="securityAnswer"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // if (/^\d{0,4}$/.test(value)) {
                                      setIsIdentityEditsecurityAnswer(e.target.value)
                                      // }
                                    }}
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" placeholder="Security Question Answer" />
                                </div>
                                {!validation.securityAnswer && <p className="text-red-500 mt-1">Security Question Answer is required</p>}

                              </div>
                              <div className="mt-8">
                                {!changeButtonTwo ?
                                  <>
                                   

                                    {loaderGetting
                                      ?
                                      <>
                                        <div className="mb-4 mt-4">
                                          <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                            <div className='flex justify-center'>
                                              <svg className="animate-spin w-4 h-5 fill-current shrink-0" viewBox="0 0 16 16">
                                                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                              </svg>
                                              <span className="ml-2">Getting Report...</span>
                                            </div>
                                          </button>
                                        </div>
                                      </>
                                      :
                                      <div className="mb-4 mt-4">
                                        <button onClick={() => getLatestReportFromIdentity(id)} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Next</button>
                                      </div>
                                    }
                                     <div className="mb-4 mt-4">
                                      <button onClick={EditIdentityDetails} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Edit Login Details</button>
                                    </div>
                                    {/* {isUploadButtonEnable
                                      ?
                                      <p className='text-sm text-red-500'>NOTE: You can only import 1 Consumer Report every 7 Days</p>
                                      :
                                      ""
                                    } */}
                                    <div className="text-sm">Last imported: <span>{isDocUploadedDate ? moment(isDocUploadedDate).format("YYYY-MM-DD") : "-"} </span></div>
                                    {user?.plan_name == "1" || user?.plan_name == "5" && 
                                      <div className="mb-4 mt-4">
                                        <a href="/plans" className="py-2 px-4 rounded-3xl w-full tm-background text-white">Click Here to upgrade plan</a>
                                      </div>
                                    }

                                  </>
                                  :
                                  <div className="mb-4 mt-4">
                                    <button onClick={(e) => { UpdateIdentityDetails("Identity") }} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Update</button>
                                  </div>
                                }

                              </div>
                            </div>
                            {/* <button className="py-2 px-4 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="integration-modal" onClick={(e) => { e.stopPropagation(); setIntegrationModalOpen(true); }}>Integration</button> */}
                          </>
                        }

                      </div>
                    )}
                  </div>
                }


                {isOpenStep == 2 &&
                  <div>
                    <div className=" mb-6">
                      <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Upload Credit Report</h1>
                      <div className="text-sm"></div>
                      <div className="text-sm">
                        Upload Credit Report To ConsumerLaw Ai incase you are having issues exporting  your credit report from IdentityIQ , myscoreIQ or importing  using Safari. Please try using Google Chrome.
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
                    {/* <div className="flex justify-center mb-6">
                      <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                        <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                        </span>
                        <button
                          className={`relative flex-1 text-sm font-medium p-1 duration-150 ease-in-out ${card ? '' : 'tm-color'}`}

                        >
                          Upload Credit Report
                        </button>
                      </div>
                    </div> */}
                    {card && (
                      <div>
                        <div>
                          <div className="mb-4">
                            <label className="form-contorl bn w-full mb-5" htmlFor="card-name">
                              Upload Report
                            </label>
                            <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                              <input
                                name="file"
                                id="fileInput"
                                className="form-contorl btn w-full form-input p-3 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none"
                                type="file"
                                onChange={handleFileChange}
                              />
                            </div>

                            {loaderUpload
                              ?
                              <button className=" btn-sm py-2 px-4 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                <div className='flex'>
                                  <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                  </svg>
                                  <span className="ml-2">Uploading...</span>
                                </div>
                              </button>
                              :
                              <>
                                <button onClick={handleUpload} className=" btn-sm py-2 px-4 mt-4 rounded-3xl  tm-background text-white">Upload</button>
                              </>
                            }


                            {
                              list?.length && list?.length > 0 ?
                                <Link to={`/credit-report-list/${id}`} download className="btn-sm py-2 px-4 mt-4 rounded-3xl mx-3 tm-background text-white"
                                  onClick={() => userActivity("View", "", "", "", "View Doc List")}
                                >  Next</Link>
                                :
                                ""
                            }

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                }

                {isOpenStep == 3 &&
                  <div >
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 ">How to get started?</h1>
                    </header>
                    <div className="p-3">
                      <div className="md:grid md:grid-cols-2 gap-4 ">
                        <div className="w-full mt-3">
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
                        <div className="w-full mt-3">
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
                }
              </div>
            </div>


            {/* <div className='flex justify-center '>
              <div className="">
                <div className="bg-white dark:bg-slate-800 px-8 pb-6 rounded-b shadow-lg h-full">
                  <div className='flex flex-col md:flex-row p-4'>
                    <div>
                      <div className="text-center mb-6">
                        <h1 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Connect To myScoreIQ</h1>
                        <div className="text-sm">
                          Sign In To Your MyscoreIQ account below <br /> to Import your consumer report
                        </div>
                      </div>
                      <button
                        ref={stopButtonRef}
                        style={{ display: 'none' }}
                        onClick={stopFetchingData}
                      >
                        Stop API
                      </button>
                      <div className="flex justify-center mb-6">
                        <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                          <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
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
                                      <button onClick={handleSubmit} className="py-2 px-4 rounded-3xl w-full tm-background text-white">SAVE</button>
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
                                        <button onClick={EditIdentityDetails} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Edit Login Details</button>
                                      </div>

                                      {loaderGetting
                                        ?
                                        <>
                                          <div className="mb-4 mt-4">
                                            <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
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
                                            <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                              <span className="ml-2">Connect to Get Latest Report</span>
                                            </button>
                                            :
                                            <button onClick={() => getLatestReportFromIdentity(id)} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Connect to Get Latest Report</button>
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
                                          <a href="/plans" className="py-2 px-4 rounded-3xl w-full tm-background text-white">Click Here to upgrade plan</a>
                                        </div>
                                      }

                                    </>
                                    :
                                    <div className="mb-4 mt-4">
                                      <button onClick={UpdateIdentityDetails} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Update</button>
                                    </div>
                                  }

                                </div>
                              </div>
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
                      <div className="flex justify-center mb-6">
                        <div className="relative flex w-full p-1 bg-slate-50 dark:bg-slate-700/30 rounded">
                          <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
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
                                <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                  <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                  </svg>
                                  <span className="ml-2">Uploading...</span>
                                </button>
                                :
                                <>
                                  {isUploadButtonEnable
                                    ?
                                    <button className="py-2 px-4 rounded-3xl w-full  bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                                      <span className="ml-2">Upload</span>
                                    </button>
                                    :
                                    <button onClick={handleUpload} className="py-2 px-4 rounded-3xl w-full tm-background text-white">Upload</button>

                                  }
                                </>
                              }
                            </div>
                            <Link to={`/credit-report-list/${id}`} download className="py-2 px-4 rounded-3xl w-full tm-background text-white"
                              onClick={() => userActivity("View", "", "", "", "View Doc List")}
                            >View Doc List</Link>
                            <a href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9" target="_blank" className="py-2 px-4 rounded-3xl w-full tm-background text-white mt-3"
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
            </div> */}
            <ModalAction id="integration-modal" modalOpen={integrationModalOpen} setModalOpen={setIntegrationModalOpen}>
              <div className="mb-5 mt-3 text-center">
                <div className="inline-flex items-center justify-center space-x-3 mb-4">
                  <img src={consumer_logo} width="120" height="100" alt="" />
                  <svg className="h-4 w-4 fill-current text-slate-400" viewBox="0 0 16 16">
                    <path d="M5 3V0L0 4l5 4V5h8a1 1 0 000-2H5zM11 11H3a1 1 0 000 2h8v3l5-4-5-4v3z" />
                  </svg>
                  {isProcressType === "MyScoreIQ" ?
                    <img src={score_iq_logo} width="100" height="100" alt="" />
                    :
                    <img src={idenity_iq_logo} width="100" height="100" alt="" />
                  }
                </div>
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Connect Consumer-Law with {isProcressType}</div>
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
                    <div>Connecting to {isProcressType}</div>
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
            {/* <button className="py-2 px-4 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="success-modal" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}>Success Modal</button> */}
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

                    <button className="py-2 px-4 rounded-3xl tm-background text-white" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(false); }}>Close</button>
                    <Link
                      className="py-2 px-4 rounded-3xl tm-background text-white"
                      to={`/credit-report-list/${id}`}
                    >
                      NEXT
                    </Link>
                  </div>
                </div>
              </div>
            </ModalBlank>
          </main >
        </div>
      </div>
      {/* <Footer></Footer>  */}
    </>
  );
}

export default CreditReport;