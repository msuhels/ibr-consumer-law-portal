import React, { useState, useEffect, useRef } from "react";
import Header from "../partials/Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  GET_DISPUT_RECORDS,
  GET_BANK_ADDRESS,
  GET_TO_ADDRESS_DATA,
  DELETE_RESOLVED_DISPUT_RECORDS,
  RESOLVED_DISPUT_RECORDS,
  GET_DATA_OF_USER_CLIENT,
  CHECK_TRIAL_USED_STATUS,
  UPDATE_TRIAL_USED_STATUS,
  DELETE_DISPUT_RECORDS,
  UPDATE_AI_RESPONSE,
  CHECK_USER_BILLING_DETAILS,
  GET_USER_DETAILS,
  CREATE_USERS_ACTIVITY,
  GET_USER_PLAN_DETAILS,
} from "../API/api";
import axios from "axios";
import Loder from "../partials/Loder";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import moment from "moment";
import ModalOpenAiReport from "../components/ModalOpenAiReport";
import InquiryModalOpenAiReport from "../components/InquiryModalOpenAiReport";
import DerogatoryModalOpenAiReport from "../components/DerogatoryModalOpenAiReport";
import ModalCustomLetterReport from "../components/ModalCustomLetterReport";
import ModalChangestatus from "../components/ModalChangestatus";
import DropdownEditMenu from "../components/DropdownEditMenu";
import head_logo from "../ConsumerlawLogo.png";
import Footer from "../partials/Footer";
import DropdownMoreMenu from "../components/DropdownMoreMenu";
import Tooltip from "../components/Tooltip";
import DashboardSidebar from "../partials/DashboardSidebar";
import ModalEditToaddressDetails from "../components/ModalEditToaddressDetails";
import SubNavbar from "../components/SubNavbar";
import AiReportPage from "./AiReportPage";
import AiCustomReportPage from "./AiCustomReportPage";
import DerogatoryAiReportPage from "./DerogatoryAiReportPage";
import PublicAiReportPage from "./PublicAiReportPage";

function Dispute() {

  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inquiryDispute, setInquiryDispute] = useState(null);
  const [publicDispute, setPublicDispute] = useState(null);
  const [inqDerogatoryDispute, setDerogatoryDispute] = useState(null);
  const [resolvedInqDerogatoryDispute, setresolvedInqDerogatoryDispute] =
    useState(null);
  const [isDisputeInquiry, setIsDisputeInquiry] = useState(null);
  const [isDisputeInquiryType, setIsDisputeInquiryType] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [derogatoryModalOpen, setDerogatoryModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [ModalCompleted, setModalCompleted] = useState(false);
  const [openAiDataResponse, setopenAiDataResponse] = useState("");
  const [openAiDataResponseAgency, setopenAiDataResponseAgency] = useState("");
  const [isShowStep, setIsShowStep] = useState(0);
  const [userInquiryDataResponse, setUserInquiryDataResponse] = useState("");
  const [userDetails, setUserdetails] = useState(null);
  const [isOpenId, setIsOpenId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [fromAddressModalOpen, setFromAddressModalOpen] = useState(false);
  const [disputeval, setDisputeval] = useState("");
  const [disputeCustomValue, setDisputeCustomValue] = useState(null);
  const [openAiResponseExperian, setopenAiResponseExperian] = useState("");
  const [openAiResponseTransUnion, setopenAiResponseTransUnion] = useState("");
  const [openAiResponseEquifax, setopenAiResponseEquifax] = useState("");
  const [openAiDerogatoryBankResponse, setOpenAiDerogatoryBankResponse] =
    useState("");
  const [BankDataExperian, setBankDataExperian] = useState("");
  const [BankDataTransUnion, setBankDataTransUnion] = useState("");
  const [BankDataEquifax, setBankDataEquifax] = useState("");
  const [BankDataBank, setBankDataBank] = useState("");
  const [checkTrialStatus, setCheckTrialStatus] = useState(false);
  const [userPlanDetail, setUserPlanDetail] = useState(null);
  const [showLetter, setShowLetter] = useState({});
  const [showGenerateLetter, setShowGenerateLetter] = useState({});
  const [reGenerateLetterLoader, setReGenerateLetterLoader] = useState(false);

  const [toAddressDetails, setToAddressDetails] = useState({
    to_address: "",
    to_city: "",
    to_state: selectedState,
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });
  const [toAddressDetails1, setToAddressDetails1] = useState({
    to_address: "",
    to_city: "",
    to_state: selectedState,
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const handleLetterMouseEnter = (letterID) => {
    setShowLetter((prevState) => ({
      ...prevState,
      [letterID]: true,
    }));
  };

  const handleLetterMouseLeave = (letterID) => {
    setShowLetter((prevState) => ({
      ...prevState,
      [letterID]: false,
    }));
  };

  const handleGenerateLetterMouseEnter = (letterID) => {
    setShowGenerateLetter((prevState) => ({
      ...prevState,
      [letterID]: true,
    }));
  };

  const handleGenerateLetterMouseLeave = (letterID) => {
    setShowGenerateLetter((prevState) => ({
      ...prevState,
      [letterID]: false,
    }));
  };

  const userActivity = async (
    activityName,
    externalPage,
    pagetype,
    activityStatus,
    description
  ) => {
    try {
      const response = await axios.post(
        CREATE_USERS_ACTIVITY,
        {
          user_id: user?._id,
          activity: activityName,
          externalPage: externalPage,
          pagetype: pagetype,
          activityStatus: activityStatus,
          description: description,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  const getDisputeData = async () => {
    try {
      let URL = GET_DISPUT_RECORDS(id);
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      // console.log("response",response.data);
      setPublicDispute(response?.data?.public);
      setInquiryDispute(response?.data?.inquiry);
      setDerogatoryDispute(response.data.derogatory);
      setresolvedInqDerogatoryDispute(response.data.resolved_data);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const [messages, setMessages] = useState([
    {
      message: "Hello! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);

  const resolvedData = async (data_id, data, type) => {
    let disputeType = "";
    let disputeItem = "";

    if (type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = data?.inquiry["Creditor Name"];
    } else if (type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = data?.derogatory["bankName"];
    } else if (type === "public") {
      disputeType = "Public";
      disputeItem = data?.public?.bankName;
    }
    try {
      const response = await axios.post(
        RESOLVED_DISPUT_RECORDS,
        {
          id: data_id,
          userid: id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data) {
        getDisputeData();
      }
      if (response.data.message) {
        userActivity(
          "Delete",
          "",
          "",
          "success",
          `Delete Dispute ${disputeType}-${disputeItem}`
        );
      } else {
        userActivity(
          "Delete",
          "",
          "",
          "failed",
          `Delete Dispute ${disputeType}-${disputeItem}, Failed!`
        );
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      userActivity(
        "Resolved",
        "",
        "",
        "failed",
        `Dispute Resolved ${disputeType}-${disputeItem}, Failed!`
      );
    }
  };

  const deleteresolved = async (data_id) => {
    try {
      const response = await axios.post(
        DELETE_RESOLVED_DISPUT_RECORDS,
        {
          id: data_id,
          userid: id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data) {
        getDisputeData();
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getDataOfUserClient = async () => {
    try {
      const response = await axios.post(
        GET_DATA_OF_USER_CLIENT,
        {
          id: id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data.status === "false") {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getDataOfUserClient();
    getDisputeData();
  }, [openAiDataResponse]);

  const disputeInquiry = async (data, i, type) => {
    setIsDisputeInquiryType(type);
    setIsDisputeInquiry(i);
    let requestData = {
      aws_id: id,
      data: data,
      type: type,
    };
    let BankData = "";
    const Bank_name = data?.inquiry["Creditor Name"];
    const Agency_name = data?.inquiry["Credit Bureau"];
    const Date = data?.inquiry["Date of inquiry"];
    var msg = "";
    var msg1 = "";
    if (type === "inquiry") {
      msg = `Write me an inquiry deletion letter to send to ${Bank_name} for an inquiry reported on my ${Agency_name} consumer report on ${Date}.`;
      msg1 = `Write a detailed dispute letter mentioning the law in a polite tone sent to ${Agency_name} requesting the deletion of an inquiry made by ${Bank_name} on ${Date} from my ${Agency_name} consumer report.`;
    } else if (type === "derogatory") {
      if (data.accountStatusData === "Closed") {
        msg = `write me a late payment deletion letter regarding a closed account to send to  ${data.bankName} based on this case ${data.latePaymentSummary} ,past due`;
      } else {
        msg = `write me a late payment deletion letter to send to ${data.bankName} based on this case ${data.latePaymentSummary} ,past due`;
      }
    } else {
      msg = "";
    }

    const gptResponse = await processMessageToChatGPT(msg);
    if (gptResponse.message) {
      try {
        const response = await axios.post(
          GET_BANK_ADDRESS,
          {
            userid: user?._id,
            bank_name: Bank_name,
          },
          { headers: { Authorization: "Bearer " + token } }
        );
        BankData = response.data.creditorData;
      } catch (error) {
        console.log(error.response.data);
      }
      setToAddressDetails({
        to_address: BankData?.address,
        to_city: BankData?.city,
        to_state: BankData?.state,
        to_zip: BankData?.zip_code,
        to_phone: BankData?.phone,
        to_country: "US",
      });
      let res = gptResponse.message;
      res = res.replace(/Your Name/g, userDetails?.name);
      let to_address = "[Bank Address]";
      let to_city = "[Bank City]";
      let to_state = "[Bank State]";
      let to_zip = "[Bank Zipcode]";
      if (BankData?.address) {
        to_address = BankData?.address;
      }
      if (BankData?.city) {
        to_city = BankData?.city;
      }
      if (BankData?.state) {
        to_state = BankData?.state;
      }
      if (BankData?.zip_code) {
        to_zip = BankData?.zip_code;
      }
      const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
      const lines = res.split("\n");
      const filteredLines = lines.slice(12);
      const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
      const userAddress = [
        userDetails?.name,
        userDetails.address,
        locationDetails,
        " ",
        Bank_name,
        to_address,
        bankLocationDetails,
        " ",
      ];

      const modifiedLines = userAddress.concat(filteredLines);
      const modifiedResponse = modifiedLines.join("\n");
      let startIndex = res.indexOf("Your Name");
      res = res.substring(startIndex - 1);
      res = res.replace(/Your Name/g, userDetails?.name);

      // res = userDetails.name ? res.replaceAll("Your Name", userDetails.name) : res;
      // res = userDetails.address ? res.replaceAll("Address", userDetails.address) : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("City, State Zip", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("[City, State, ZIP Code]", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      // res = userDetails.phone ? res.replaceAll("[Phone Number]", userDetails.phone) : res;
      // res = userDetails.email ? res.replaceAll("[Email Address]", userDetails.email) : res;
      // res = res.replaceAll("DATE", moment().format("DD-MM-YYYY"));
      setopenAiDataResponse(modifiedResponse);
    }

    const gptResponse1 = await processMessageToChatGPT(msg1);
    if (gptResponse1.message) {
      let to_address = "[Bank Address]";
      let to_city = "[Bank City]";
      let to_state = "[Bank State]";
      let to_zip = "[Bank Zipcode]";
      if (data?.inquiry["Credit Bureau"] === "Experian") {
        setToAddressDetails1({
          to_address: "P.O.Box 4500",
          to_city: "Allen",
          to_state: "Texas",
          to_zip: "75013",
          to_phone: "(888) 397-3742",
          to_country: "US",
        });

        to_address = "P.O.Box 4500";
        to_city = "Allen";
        to_state = "Texas";
        to_zip = "75013";
      } else if (data?.inquiry["Credit Bureau"] === "TransUnion") {
        setToAddressDetails1({
          to_address: "P.O.Box 2000",
          to_city: "Chester",
          to_state: "Pennsyl vania",
          to_zip: "19016",
          to_phone: "(800) 916-8800",
          to_country: "US",
        });
        to_address = "P.O.Box 2000";
        to_city = "Chester";
        to_state = "Pennsyl vania";
        to_zip = "19016";
      } else if (data?.inquiry["Credit Bureau"] === "Equifax") {
        setToAddressDetails1({
          to_address: "P.O. Box 740256",
          to_city: "Atlanta",
          to_state: "Georgia",
          to_zip: "30374",
          to_phone: "(866) 349-5191",
          to_country: "US",
        });

        to_address = "P.O. Box 740256";
        to_city = "Atlanta";
        to_state = "Georgia";
        to_zip = "30374";
      }

      let res = gptResponse1.message;
      res = res.replace(/Your Name/g, userDetails?.name);
      const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
      const lines = res.split("\n");
      const filteredLines = lines.slice(12);
      const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
      const userAddress = [
        userDetails?.name,
        userDetails.address,
        locationDetails,
        " ",
        Agency_name,
        to_address,
        bankLocationDetails,
        " ",
      ];
      const modifiedLines = userAddress.concat(filteredLines);
      const modifiedResponse = modifiedLines.join("\n");
      // Split the response into lines
      let startIndex = res.indexOf("Your Name");
      res = res.substring(startIndex - 1);
      res = res.replace(/Your Name/g, userDetails?.name);

      res = userDetails.name
        ? res.replaceAll("Your Name", userDetails.name)
        : res;
      // res = userDetails.address ? res.replaceAll("Address", userDetails.address) : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("City, State Zip", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("[City, State, ZIP Code]", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      // res = userDetails.phone ? res.replaceAll("[Phone Number]", userDetails.phone) : res;
      // res = userDetails.email ? res.replaceAll("[Email Address]", userDetails.email) : res;
      // res = res.replaceAll("DATE", moment().format("DD-MM-YYYY"));
      setopenAiDataResponseAgency(modifiedResponse);
    }
    if (type === "inquiry") {
      // setInquiryModalOpen(true);
      setIsShowStep(1);
    } else {
      setSearchModalOpen(true);
    }
    setUserInquiryDataResponse(requestData);
    setIsDisputeInquiry(null);
    setReGenerateLetterLoader(false);
    getDisputeData();
    try {
      const response = await axios.post(
        UPDATE_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "genrate_letter",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      CheckButtonStatus();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const disputeDerogatory = async (data, i, type) => {
   
    setIsDisputeInquiryType(type);
    setIsDisputeInquiry(i);
    var msgExperian = "";
    var msgTransUnion = "";
    var msgEquifax = "";
    var msgBank = "";
    var gptResponseExperian = "";
    var gptResponseTransUnion = "";
    var gptResponseEquifax = "";
    var gptResponseBank = "";

    let requestData = {
      aws_id: id,
      data: data,
      type: type,
    };
    if (data?.derogatory?.lateIndivisualSummary?.Experian) {
      try {
        if (data?.derogatory?.accountStatusData === "Closed") {
          msgExperian = `write me a late payment deletion letter regarding a closed account to send to experian based on this case ${data?.derogatory?.lateIndivisualSummary?.Experian} ,past due for Experian`;
        } else {
          msgExperian = `write me a late payment deletion letter to send to experian based on this case ${data?.derogatory?.lateIndivisualSummary?.Experian} ,past due for Experian`;
        }
        gptResponseExperian = await processMessageToChatGPT(msgExperian);
        if (gptResponseExperian.message) {
          let res = gptResponseExperian.message;
          let startIndex = res.indexOf("Your Name");
          res = res.substring(startIndex - 1);

          let to_address = "[Bank Address]";
          let to_city = "[Bank City]";
          let to_state = "[Bank State]";
          let to_zip = "[Bank Zipcode]";
          setBankDataExperian({
            address: "P.O.Box 4500",
            city: "Allen",
            state: "Texas",
            zip_code: "75013",
            phone: "(888) 397-3742",
            country: "US",
          });
          to_address = "P.O.Box 4500";
          to_city = "Allen";
          to_state = "Texas";
          to_zip = "75013";

          const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
          const lines = res.split("\n");
          const filteredLines = lines.slice(12);
          const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
          const userAddress = [
            userDetails?.name,
            userDetails?.address,
            locationDetails,
            " ",
            "Experian",
            to_address,
            bankLocationDetails,
            " ",
          ];
          const modifiedLines = userAddress.concat(filteredLines);
          const modifiedResponse = modifiedLines.join("\n");
          setopenAiResponseExperian(modifiedResponse);
        }
        setReGenerateLetterLoader(false);
      } catch (error) {
        console.log(error.response.data);
      }
    }

    if (data?.derogatory?.lateIndivisualSummary?.TransUnion) {
      try {
        if (data?.derogatory?.accountStatusData === "Closed") {
          msgTransUnion = `write me a late payment deletion letter regarding a closed account to send to transunion based on this case ${data?.derogatory?.lateIndivisualSummary?.TransUnion} ,past due for TransUnion`;
        } else {
          msgTransUnion = `write me a late payment deletion letter to send to transunion based on this case ${data?.derogatory?.lateIndivisualSummary?.TransUnion} ,past due for TransUnion`;
        }
        gptResponseTransUnion = await processMessageToChatGPT(msgTransUnion);

        if (gptResponseTransUnion.message) {
          let res = gptResponseTransUnion.message;
          res = res.replace(/Your Name/g, userDetails?.name);

          let startIndex = res.indexOf("Your Name");
          res = res.substring(startIndex - 1);
          let to_address = "[Bank Address]";
          let to_city = "[Bank City]";
          let to_state = "[Bank State]";
          let to_zip = "[Bank Zipcode]";

          setBankDataTransUnion({
            address: "P.O.Box 2000",
            city: "Chester",
            state: "Pennsyl vania",
            zip_code: "19016",
            phone: "(800) 916-8800",
            country: "US",
          });
          to_address = "P.O.Box 2000";
          to_city = "Chester";
          to_state = "Pennsyl vania";
          to_zip = "19016";

          const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
          const lines = res.split("\n");
          const filteredLines = lines.slice(12);
          const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
          const userAddress = [
            userDetails?.name,"aaayanaaa",
            userDetails.address,
            locationDetails,
            " ",
            "TransUnion",
            to_address,
            bankLocationDetails,
            " ",
          ];
          const modifiedLines = userAddress.concat(filteredLines);
          const modifiedResponse = modifiedLines.join("\n");
          setopenAiResponseTransUnion(modifiedResponse);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }

    if (data?.derogatory?.lateIndivisualSummary?.Equifax) {
      try {
        if (data?.derogatory?.accountStatusData === "Closed") {
          msgEquifax = `write me a late payment deletion letter regarding a closed account to send to Equifax based on this case ${data?.derogatory?.lateIndivisualSummary?.Equifax} ,past due for Equifax`;
        } else {
          msgEquifax = `write me a late payment deletion letter to send to Equifax based on this case ${data?.derogatory?.lateIndivisualSummary?.Equifax} ,past due for Equifax`;
        }

        gptResponseEquifax = await processMessageToChatGPT(msgEquifax);
        if (gptResponseEquifax.message) {
          let res = gptResponseEquifax.message;
          res = res.replace(/Your Name/g, userDetails?.name);
          //remove firstline
          let startIndex = res.indexOf("Your Name");
          res = res.substring(startIndex - 1);
          let to_address = "[Bank Address]";
          let to_city = "[Bank City]";
          let to_state = "[Bank State]";
          let to_zip = "[Bank Zipcode]";
          setBankDataEquifax({
            address: "P.O. Box 740256",
            city: "Atlanta",
            state: "Georgia",
            zip_code: "30374",
            phone: "(866) 349-5191",
            country: "US",
          });

          to_address = "P.O. Box 740256";
          to_city = "Atlanta";
          to_state = "Georgia";
          to_zip = "30374";
          const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
          const lines = res.split("\n");
          const filteredLines = lines.slice(12);
          const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
          const userAddress = [
            userDetails?.name,
            userDetails.address,
            locationDetails,
            " ",
            "Equifax",
            to_address,
            bankLocationDetails,
            " ",
          ];
          const modifiedLines = userAddress.concat(filteredLines);
          const modifiedResponse = modifiedLines.join("\n");
          setopenAiResponseEquifax(modifiedResponse);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }

    if (data?.derogatory?.bankName) {
      try {
        const response = await axios.post(
          GET_BANK_ADDRESS,
          {
            userid: user?._id,
            bank_name: data?.derogatory?.bankName,
          },
          { headers: { Authorization: "Bearer " + token } }
        );
        setBankDataBank(response.data.creditorData);
        if (data?.derogatory?.accountStatusData === "Closed") {
          msgBank = `write me a late payment deletion letter regarding a closed account to send to  ${
            data?.derogatory?.bankName
          } based on this case 
          ${
            data?.derogatory?.lateIndivisualSummary?.TransUnion
              ? `${data.derogatory.lateIndivisualSummary.TransUnion} for TransUnion.`
              : ""
          }
          ${
            data?.derogatory?.lateIndivisualSummary?.Experian
              ? `${data.derogatory.lateIndivisualSummary.Experian} for Experian.`
              : ""
          }
          ${
            data?.derogatory?.lateIndivisualSummary?.Equifax
              ? `${data.derogatory.lateIndivisualSummary.Equifax} for Equifax.`
              : ""
          }
         ,past due `;
        } else {
          msgBank = `write me a late payment deletion letter regarding a closed account to send to  
          ${data?.derogatory?.bankName} based on this case 
          ${
            data?.derogatory?.lateIndivisualSummary?.TransUnion
              ? `${data.derogatory.lateIndivisualSummary.TransUnion} for TransUnion.`
              : ""
          }
          ${
            data?.derogatory?.lateIndivisualSummary?.Experian
              ? `${data.derogatory.lateIndivisualSummary.Experian} for Experian.`
              : ""
          }
          ${
            data?.derogatory?.lateIndivisualSummary?.Equifax
              ? `${data.derogatory.lateIndivisualSummary.Equifax} for Equifax.`
              : ""
          }
          past due`;
        }
        msgBank = msgBank.replace(/\s+/g, " ").trim();
        gptResponseBank = await processMessageToChatGPT(msgBank);
        if (gptResponseBank.message) {
          let res = gptResponseBank.message;
          res = res.replace(/Your Name/g, userDetails?.name);
          //remove firstline
          let startIndex = res.indexOf("Your Name");
          res = res.substring(startIndex - 1);
          let to_address = "[Bank Address]";
          let to_city = "[Bank City]";
          let to_state = "[Bank State]";
          let to_zip = "[Bank Zipcode]";
          if (response.data.creditorData?.address) {
            to_address = response.data.creditorData?.address;
          }
          if (response.data.creditorData?.city) {
            to_city = response.data.creditorData?.city;
          }
          if (response.data.creditorData?.state) {
            to_state = response.data.creditorData?.state;
          }
          if (response.data.creditorData?.zip_code) {
            to_zip = response.data.creditorData?.zip_code;
          }
          const bankLocationDetails = `${to_city}, ${to_state}, ${to_zip}`;
          const lines = res.split("\n");
          const filteredLines = lines.slice(12);
          const locationDetails = `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`;
          const userAddress = [
            userDetails?.name,
            userDetails.address,
            locationDetails,
            " ",
            data?.derogatory?.bankName,
            to_address,
            bankLocationDetails,
            " ",
          ];
          const modifiedLines = userAddress.concat(filteredLines);
          const modifiedResponse = modifiedLines.join("\n");
          setOpenAiDerogatoryBankResponse(modifiedResponse);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }

    setIsShowStep(5);
    // setDerogatoryModalOpen(true);
    setUserInquiryDataResponse(requestData);
    setIsDisputeInquiry(null);
    getDisputeData();

    try {
      const response = await axios.post(
        UPDATE_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "genrate_letter",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      CheckButtonStatus();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const disputePublicRecord = async (data, i, type) => {
    setIsDisputeInquiryType(type);
    setIsDisputeInquiry(i);

    var agencyName = "";
    if (data?.public?.TableData?.Type[0].Experian) {
      agencyName = "Experian";
    } else if (data?.public?.TableData?.Type[0].TransUnion) {
      agencyName = "TransUnion";
    } else if (data?.public?.TableData?.Type[0].Equifax) {
      agencyName = "Equifax";
    }

    let requestData = {
      aws_id: id,
      data: data,
      type: type,
    };

    var msg = "";
    if (type === "public") {
      if (data?.public?.TableData?.Type[0].Experian) {
        msg = `Write me a bankruptcy deletion letter for  ${agencyName}  for a bankruptcy ${data?.public?.TableData?.Type[0].Experian} and reference: ${data?.public?.TableData?.["Reference#"].Experian} filed on ${data?.public?.TableData?.["Date Filed/Reported"].Experian} using consumer law Pursuant to 15USC1681b, I am demanding to see in writing where I gave written instruction or permission to report this erroneous information on my Consumer Report. as its in direct violation 15USC1681. No consent is identity theft and these violations are Aggravated Identity theft, pursuant to 18USC1028b(1)(A)(ii).`;
      }
      if (data?.public?.TableData?.Type[0].TransUnion) {
        msg = `Write me a bankruptcy deletion letter for  ${agencyName}  for a bankruptcy ${data?.public?.TableData?.Type[0].TransUnion} and reference: ${data?.public?.TableData?.["Reference#"].TransUnion} filed on ${data?.public?.TableData?.["Date Filed/Reported"].TransUnion} using consumer law Pursuant to 15USC1681b, I am demanding to see in writing where I gave written instruction or permission to report this erroneous information on my Consumer Report. as its in direct violation 15USC1681. No consent is identity theft and these violations are Aggravated Identity theft, pursuant to 18USC1028b(1)(A)(ii).`;
      }
      if (data?.public?.TableData?.Type[0].Equifax) {
        msg = `Write me a bankruptcy deletion letter for  ${agencyName}  for a bankruptcy ${data?.public?.TableData?.Type[0].Equifax} and reference: ${data?.public?.TableData?.["Reference#"].Equifax} filed on ${data?.public?.TableData?.["Date Filed/Reported"].Equifax} using consumer law Pursuant to 15USC1681b, I am demanding to see in writing where I gave written instruction or permission to report this erroneous information on my Consumer Report. as its in direct violation 15USC1681. No consent is identity theft and these violations are Aggravated Identity theft, pursuant to 18USC1028b(1)(A)(ii).`;
      }
    } else {
      msg = "";
    }
    const gptResponse = await processMessageToChatGPT(msg);
    if (gptResponse.message) {
      let res = gptResponse.message;
      res = res.replace(/Your Name/g, userDetails?.name);
      // Split the response into lines
      let startIndex = res.indexOf("Your Name");
      res = res.substring(startIndex - 1);

      res = userDetails.name
        ? res.replaceAll("Your Name", userDetails.name)
        : res;
      res = userDetails.address
        ? res.replaceAll("Address", userDetails.address)
        : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("City, State Zip", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      // res = (userDetails.city || userDetails.state || userDetails.zip) ? res.replace("[City, State, ZIP Code]", `${userDetails.city}, ${userDetails.state}, ${userDetails.zip}`) : res;
      res = userDetails.phone
        ? res.replaceAll("[Phone Number]", userDetails.phone)
        : res;
      res = userDetails.email
        ? res.replaceAll("[Email Address]", userDetails.email)
        : res;
      res = res.replaceAll("DATE", moment().format("DD-MM-YYYY"));

      // setSearchModalOpen(true);
      setIsShowStep(7);
      setopenAiDataResponse(res);
      setUserInquiryDataResponse(requestData);
      setIsDisputeInquiry(null);
      getDisputeData();
    }
    setReGenerateLetterLoader(false);
    try {
      const response = await axios.post(
        UPDATE_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "genrate_letter",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      CheckButtonStatus();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  // const handleSendRequest = async (message) => {
  //   const newMessage = {
  //     message,
  //     direction: 'outgoing',
  //     sender: "user",
  //   };

  //   try {
  //     const response = await processMessageToChatGPT([...messages, newMessage]);
  //     const content = response.choices[0]?.message?.content;
  //     return content;
  //   } catch (error) {
  //     setIsDisputeInquiry(null)
  //     console.error("Error processing message:", error);
  //   } finally {
  //   }
  // };

  async function processMessageToChatGPT(chatMessages) {
    // const apiMessages = chatMessages.map((messageObject) => {
    //   const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
    //   return { role, content: messageObject.message };
    // });

    const apiRequestBody = {
      // "model": "gpt-3.5-turbo",
      model: "gpt-3.5-turbo-0613",
      query: chatMessages,
    };

    const response = await fetch(
      "https://consumerlaw-production.up.railway.app/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody),
      }
    );
    return response.json();
  }

  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserdetails(response.data.UserDetails);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
    CheckButtonStatus();
    getUserPlanDetail();
  }, []);

  const expand = async (val) => {
    setIsOpenId(val._id);
  };

  const close = async () => {
    setIsOpenId(null);
  };

  const changeStatus = async (val) => {
    setDisputeval(val);
    setStatusModalOpen(true);
  };

  const CheckUserBillingSendingDetails = async (
    val,
    i,
    type,
    letterType,
    time
  ) => {
    try {
      if (time === "regenrate") {
        setReGenerateLetterLoader(true);
      }
      const response = await axios.post(
        CHECK_USER_BILLING_DETAILS,
        {
          userid: id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response?.data?.status === "valid") {
        if (letterType === "custom") {
          disputeCustommLetter(val, i, type);
        } else {
          if (type === "inquiry") {
            disputeInquiry(val, i, type);
          } else if (type === "derogatory") {
            disputeDerogatory(val, i, type);
          } else if (type === "public") {
            disputePublicRecord(val, i, type);
          }
        }
      } else {
        setFromAddressModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error to do procress");
    }
  };

  const disputeCustommLetter = async (val, i, type) => {
    let requestData = {
      data: val,
      type: type,
    };
    // setCustomModalOpen(true);
    setIsShowStep(3);
    setDisputeCustomValue(requestData);
    try {
      const response = await axios.post(
        UPDATE_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "genrate_letter",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      CheckButtonStatus();
      setReGenerateLetterLoader(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const CheckButtonStatus = async () => {
    try {
      const response = await axios.post(
        CHECK_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "genrate_letter",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data?.message === "limit-expire") {
        setCheckTrialStatus(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  // const deletedisputeInquiry = async (val, i, type) => {
  //   let requestData = {
  //     data: val,
  //     type: type
  //   }
  //   try {
  //     const response = await axios.post(DELETE_DISPUT_RECORDS,
  //       { requestData },
  //       { headers: { "Authorization": "Bearer " + token } });
  //     if (response.data) {
  //       getDisputeData();
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message || "Something went Wrong");
  //   }
  // };

  const deletedisputeInquiry = async (data, type) => {
    let disputeType = "";
    let disputeItem = "";

    if (type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = data?.inquiry["Creditor Name"];
    } else if (type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = data?.derogatory["bankName"];
    } else if (type === "public") {
      disputeType = "Public";
      disputeItem = data?.public?.bankName;
    }
    try {
      const response = await axios.post(
        DELETE_DISPUT_RECORDS,
        {
          data: data,
          userid: id,
          type: type,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data) {
        getDisputeData();
      }
      if (response.data.message) {
        userActivity(
          "Delete",
          "",
          "",
          "success",
          `Delete Dispute ${disputeType}-${disputeItem}`
        );
      } else {
        userActivity(
          "Delete",
          "",
          "",
          "failed",
          `Delete Dispute ${disputeType}-${disputeItem}, Failed!`
        );
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      userActivity(
        "Delete",
        "",
        "",
        "failed",
        `Delete Dispute ${disputeType}-${disputeItem}, Failed!`
      );
    }
  };

  const getToAddressData = async () => {
    let URL = GET_TO_ADDRESS_DATA(openAiDataResponse?._id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setToAddressDetails({
        to_id: response.data.ToAddressData._id,
        to_letter_id: response.data.ToAddressData.openAiDataResponse?._id,
        to_address: response.data.ToAddressData.address,
        to_city: response.data.ToAddressData.city,
        to_state: response.data.ToAddressData.state,
        to_zip: response.data.ToAddressData.zip,
        to_phone: response.data.ToAddressData.phone,
        to_country: response.data.ToAddressData.country,
      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const getToAddressData1 = async () => {
    let URL = GET_TO_ADDRESS_DATA(openAiDataResponseAgency?._id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setToAddressDetails({
        to_id: response.data.ToAddressData._id,
        to_letter_id: response.data.ToAddressData.openAiDataResponseAgency?._id,
        to_address: response.data.ToAddressData.address,
        to_city: response.data.ToAddressData.city,
        to_state: response.data.ToAddressData.state,
        to_zip: response.data.ToAddressData.zip,
        to_phone: response.data.ToAddressData.phone,
        to_country: response.data.ToAddressData.country,
      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const handleToAddressChange = (e) => {
    const { name, value } = e.target;
    setToAddressDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToAddressChange1 = (e) => {
    const { name, value } = e.target;
    setToAddressDetails1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getUserPlanDetail = async () => {
    try {
      const response = await axios.get(GET_USER_PLAN_DETAILS, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserPlanDetail(response?.data?.User);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const ChangeDisputeStep = (val) => {
    setIsShowStep(val);
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ? (
        <SubNavbar />
      ) : (
        ""
      )}
      <div className="flex sm:h-[100dvh] bg-white">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="relative p-5 flex flex-col flex-1  overflow-y-auto overflow-x-auto md:overflow-visible ">
          {isShowStep === 0 && (
            <>
              <main className="grow">
                <div className=" w-full">
                  <div className="sm:flex sm:justify-between sm:items-center mb-5">
                    <div className="mb-4 sm:mb-0 flex">
                      {/* <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Dispute </h1> */}
                      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">
                        Generate Letters{" "}
                      </h1>
                      {/* <img width={35} src={head_logo}></img> */}
                    </div>
                  </div>

                  {userPlanDetail && userPlanDetail?.is_trial === "true" ? (
                    <div className="sm:flex sm:justify-between sm:items-center mb-5">
                      <div className="mb-4 sm:mb-0 flex">
                        <h1>
                          <span className="text-1xl md:text-1xl text-slate-800 dark:text-slate-100 font-bold me-3">
                            Note:{" "}
                          </span>
                          You are only allowed to generate 9 Dispute Letters per
                          week.
                          <span style={{ color: "blue" }}>
                            <a href="/plans" className="ml-1">
                              Click Here to upgrade plan
                            </a>
                          </span>
                        </h1>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Inquiries
                      </h2>
                    </header>
                    <div>
                      <div className="overflow-x-auto p-4">
                        <div className="shownav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                              <tr>
                                <th className="py-3 px-5 rounded-l-lg">
                                  <div className="font-semibold text-center">
                                    Creditor Name
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center">
                                    Type of Business
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center">
                                    Date of inquiry
                                  </div>
                                </th>
                                <th
                                  className={`py-3 px-5 ${
                                    user.role == "client" ? "rounded-r-lg" : ""
                                  }`}
                                >
                                  <div className="font-semibold text-center">
                                    {" "}
                                    CONSUMER REPORTING AGENCY
                                  </div>
                                </th>
                                {user.role != "client" && (
                                  <th
                                    className="py-3 px-5 rounded-r-lg"
                                    style={{ width: "35%" }}
                                  >
                                    <div className="font-semibold text-center">
                                      Action
                                    </div>
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <>
                              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                                {inquiryDispute &&
                                  inquiryDispute?.map((val, i) => (
                                    <tr key={i}>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.inquiry["Creditor Name"]}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.inquiry["Type of Business"]}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.inquiry["Date of inquiry"]}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.inquiry["Credit Bureau"]}
                                        </div>
                                      </td>
                                      {user.role != "client" && (
                                        <td
                                          className="py-3 text-center flex justify-start"
                                          style={{ width: "125%" }}
                                        >
                                          {val?.ai_Report != "0" ? (
                                            <>
                                              <div className="flex items-center">
                                                <DropdownMoreMenu className="relative inline-flex">
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        resolvedData(
                                                          val?._id,
                                                          val,
                                                          "inquiry"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Resolved
                                                    </button>
                                                  </li>
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        changeStatus(val)
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Edit
                                                    </button>
                                                  </li>
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        deletedisputeInquiry(
                                                          val,
                                                          "inquiry"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Delete
                                                    </button>
                                                  </li>
                                                </DropdownMoreMenu>
                                                <>
                                                  {isDisputeInquiry == i &&
                                                  isDisputeInquiryType ===
                                                    "inquiry" ? (
                                                    <>
                                                      {showLetter[val?._id] && (
                                                        <span
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            margin:
                                                              "30px -100px",
                                                          }}
                                                        >
                                                          Use Letter Template
                                                        </span>
                                                      )}
                                                      <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2">
                                                        <Loder />{" "}
                                                        <span className="ms-1">
                                                          Regenerating letter
                                                        </span>
                                                      </button>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#000000"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                      </button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {checkTrialStatus ===
                                                      true ? (
                                                        ""
                                                      ) : (
                                                        <>
                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                            onClick={() =>
                                                              CheckUserBillingSendingDetails(
                                                                val,
                                                                i,
                                                                "inquiry"
                                                              )
                                                            }
                                                            onMouseEnter={() =>
                                                              handleGenerateLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleGenerateLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            {/* Generate letter */}
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-reload"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                              <path d="M20 4v5h-5" />
                                                            </svg>{" "}
                                                            Regenerate letter
                                                          </button>

                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 tm-background text-white shadow-sm me-2"
                                                            onClick={() =>
                                                              CheckUserBillingSendingDetails(
                                                                val,
                                                                i,
                                                                "inquiry",
                                                                "custom"
                                                              )
                                                            }
                                                            onMouseEnter={() =>
                                                              handleLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-notes"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                              <path d="M9 7l6 0" />
                                                              <path d="M9 11l6 0" />
                                                              <path d="M9 15l4 0" />
                                                            </svg>
                                                            Use Letter Template
                                                          </button>
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <DropdownMoreMenu className="relative inline">
                                                {/* <DropdownEditMenu className="relative inline-flex"> */}
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      deletedisputeInquiry(
                                                        val,
                                                        "inquiry"
                                                      )
                                                    }
                                                    className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Delete
                                                  </button>
                                                </li>
                                              </DropdownMoreMenu>
                                              {isDisputeInquiry == i &&
                                              isDisputeInquiryType ===
                                                "inquiry" ? (
                                                <>
                                                  <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2">
                                                    <Loder />{" "}
                                                    <span className="ms-1">
                                                      Generate letter
                                                    </span>
                                                  </button>

                                                  {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2' disabled>Custom letter</button> */}
                                                  <button
                                                    className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                    disabled
                                                    onMouseEnter={() =>
                                                      handleLetterMouseEnter(
                                                        val?._id
                                                      )
                                                    }
                                                    onMouseLeave={() =>
                                                      handleLetterMouseLeave(
                                                        val?._id
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      class="icon icon-tabler icon-tabler-notes"
                                                      width="18"
                                                      height="18"
                                                      viewBox="0 0 24 24"
                                                      stroke-width="1.5"
                                                      stroke="#ffff"
                                                      fill="none"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                    >
                                                      <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                      />
                                                      <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                      <path d="M9 7l6 0" />
                                                      <path d="M9 11l6 0" />
                                                      <path d="M9 15l4 0" />
                                                    </svg>
                                                    Use Letter Template
                                                  </button>
                                                  {showLetter[val?._id] && (
                                                    <span
                                                      style={{
                                                        position: "absolute",
                                                        margin: "30px -100px",
                                                      }}
                                                    >
                                                      Use Letter Template
                                                    </span>
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {checkTrialStatus === true ? (
                                                    <>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* <span className='me-2'> Generate letter</span> */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        Generate letter
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                    </>
                                                  ) : (
                                                    <>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "inquiry"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* Generate letter */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        Generate letter
                                                      </button>
                                                      {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 tm-background text-white shadow-sm me-2"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "inquiry",
                                                            "custom"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                      </button>
                                                      {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            </>
                          </table>
                        </div>

                        <div className="hidenav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {inquiryDispute?.map((val, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <th className="py-3 px-5 w-1/3">
                                      <div className="font-semibold text-left">
                                        Creditor Name
                                      </div>
                                    </th>
                                    <td className="py-3 px-5 w-2/3 break-words">
                                      <div className="text-left">
                                        {val?.inquiry["Creditor Name"]}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="py-3 px-5 w-1/3">
                                      <div className="font-semibold text-left">
                                        Type of Business
                                      </div>
                                    </th>
                                    <td className="py-3 px-5 w-2/3 break-words">
                                      <div className="text-left">
                                        {val?.inquiry["Type of Business"]}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="py-3 px-5 w-1/3">
                                      <div className="font-semibold text-left">
                                        Date of Inquiry
                                      </div>
                                    </th>
                                    <td className="py-3 px-5 w-2/3 break-words">
                                      <div className="text-left">
                                        {val?.inquiry["Date of inquiry"]}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="py-3 px-5 w-1/3">
                                      <div className="font-semibold text-left">
                                        Consumsser Reporting Agency
                                      </div>
                                    </th>
                                    <td className="py-3 px-5 w-2/3 break-words">
                                      <div className="text-left">
                                        {val?.inquiry["Credit Bureau"]}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="py-3 px-5 w-1/3">
                                      <div className="font-semibold text-left">
                                        Action
                                      </div>
                                    </th>
                                    <td className="py-3 px-5 w-2/3 break-words">
                                      <div className="flex items-start justify-left ">
                                        {val?.ai_Report === "0" ? (
                                          <>
                                            {isDisputeInquiry == i &&
                                            isDisputeInquiryType ===
                                              "inquiry" ? (
                                              <>
                                                {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2' disabled>Custom letter</button> */}
                                                <button
                                                  className=" mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                  disabled
                                                  onMouseEnter={() =>
                                                    handleLetterMouseEnter(
                                                      val?._id
                                                    )
                                                  }
                                                  onMouseLeave={() =>
                                                    handleLetterMouseLeave(
                                                      val?._id
                                                    )
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="icon icon-tabler icon-tabler-notes"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#ffff"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                  >
                                                    <path
                                                      stroke="none"
                                                      d="M0 0h24v24H0z"
                                                      fill="none"
                                                    />
                                                    <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                    <path d="M9 7l6 0" />
                                                    <path d="M9 11l6 0" />
                                                    <path d="M9 15l4 0" />
                                                  </svg>
                                                </button>

                                                {showLetter[val?._id] && (
                                                  <span
                                                    style={{
                                                      position: "absolute",
                                                      margin: "30px -100px",
                                                    }}
                                                  >
                                                    Use Letter Template
                                                  </span>
                                                )}
                                                <button className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm">
                                                  {" "}
                                                  <Loder />
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                <DropdownMoreMenu className="relative inline-flex">
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        deletedisputeInquiry(
                                                          val,
                                                          "inquiry"
                                                        )
                                                      }
                                                      className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Delete
                                                    </button>
                                                  </li>
                                                </DropdownMoreMenu>
                                                {checkTrialStatus === true ? (
                                                  <>
                                                    <button
                                                      className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-4 py-4 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                      disabled
                                                      onMouseEnter={() =>
                                                        handleLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-reload"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#ffff"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                        <path d="M20 4v5h-5" />
                                                      </svg>
                                                      <Tooltip
                                                        size="lg"
                                                        bg="light"
                                                      >
                                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                          You are under free
                                                          trial plan, Please
                                                          upgrade your plan.
                                                          Under free trial plan
                                                          you can generate 3
                                                          letters per week.
                                                        </div>
                                                      </Tooltip>
                                                    </button>
                                                    {showLetter[val?._id] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -100px",
                                                        }}
                                                      >
                                                        Use Letter Template
                                                      </span>
                                                    )}

                                                    <button
                                                      className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-4 py-4 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                      disabled
                                                      onMouseEnter={() =>
                                                        handleGenerateLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleGenerateLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      {/* <span className='me-2'> Generate letter</span> */}
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-reload"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#ffff"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                        <path d="M20 4v5h-5" />
                                                      </svg>
                                                      <Tooltip
                                                        size="lg"
                                                        bg="light"
                                                      >
                                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                          You are under free
                                                          trial plan, Please
                                                          upgrade your plan.
                                                          Under free trial plan
                                                          you can generate 3
                                                          letters per week.
                                                        </div>
                                                      </Tooltip>
                                                    </button>
                                                    {showGenerateLetter[
                                                      val?._id
                                                    ] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -80px",
                                                        }}
                                                      >
                                                        Generate letter
                                                      </span>
                                                    )}
                                                  </>
                                                ) : (
                                                  <>
                                                    <button
                                                      className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                      onClick={() =>
                                                        CheckUserBillingSendingDetails(
                                                          val,
                                                          i,
                                                          "inquiry",
                                                          "custom"
                                                        )
                                                      }
                                                      onMouseEnter={() =>
                                                        handleLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-notes"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#ffff"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                        <path d="M9 7l6 0" />
                                                        <path d="M9 11l6 0" />
                                                        <path d="M9 15l4 0" />
                                                      </svg>
                                                    </button>
                                                    {showLetter[val?._id] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -100px",
                                                        }}
                                                      >
                                                        Use Letter Template
                                                      </span>
                                                    )}

                                                    <button
                                                      className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                      onClick={() =>
                                                        CheckUserBillingSendingDetails(
                                                          val,
                                                          i,
                                                          "inquiry"
                                                        )
                                                      }
                                                      onMouseEnter={() =>
                                                        handleGenerateLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleGenerateLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      {/* Generate letter */}
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-reload"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#ffff"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                        <path d="M20 4v5h-5" />
                                                      </svg>
                                                    </button>
                                                    {showGenerateLetter[
                                                      val?._id
                                                    ] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -80px",
                                                        }}
                                                      >
                                                        Generate letter
                                                      </span>
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {/* <div className='text-right' > */}
                                            {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm' onClick={() => resolvedData(val?._id)} >Resolved</button> */}
                                            {/* <div className="relative text-center">
                                            <button className="border cursor-pointer p-2" onFocus={() => expand(val)}>
                                              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                              </svg>
                                            </button>
                                            {isOpenId == val._id && (
                                              <div className="absolute mt-2 w-48  bg-white border rounded-lg shadow-xl z-10" onBlur={close}>
                                                <div className="py-1 ">
                                                  <button onClick={() => changeStatus(val)} className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                    Edit
                                                  </button>
                                                  <button className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div> */}
                                            <div className="flex items-start justify-center ">
                                              <DropdownMoreMenu className="relative inline-flex">
                                                <li>
                                                  <>
                                                    {isDisputeInquiry == i &&
                                                    isDisputeInquiryType ===
                                                      "inquiry" ? (
                                                      <>
                                                        {showLetter[
                                                          val?._id
                                                        ] && (
                                                          <span
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              margin:
                                                                "30px -100px",
                                                            }}
                                                          >
                                                            Use Letter Template
                                                          </span>
                                                        )}
                                                        <button className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center">
                                                          <span className="me-2 ">
                                                            Regenerating
                                                          </span>
                                                          <Loder />
                                                        </button>
                                                      </>
                                                    ) : (
                                                      <>
                                                        {checkTrialStatus ===
                                                        true ? (
                                                          ""
                                                        ) : (
                                                          <>
                                                            <button
                                                              onClick={() =>
                                                                CheckUserBillingSendingDetails(
                                                                  val,
                                                                  i,
                                                                  "inquiry"
                                                                )
                                                              }
                                                              onMouseEnter={() =>
                                                                handleGenerateLetterMouseEnter(
                                                                  val?._id
                                                                )
                                                              }
                                                              onMouseLeave={() =>
                                                                handleGenerateLetterMouseLeave(
                                                                  val?._id
                                                                )
                                                              }
                                                              className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center "
                                                            >
                                                              <span className="me-2">
                                                                Regenerate
                                                              </span>

                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="icon icon-tabler icon-tabler-reload"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="#000000"
                                                                fill="none"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                              >
                                                                <path
                                                                  stroke="none"
                                                                  d="M0 0h24v24H0z"
                                                                  fill="none"
                                                                />
                                                                <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                                <path d="M20 4v5h-5" />
                                                              </svg>
                                                            </button>
                                                          </>
                                                        )}
                                                      </>
                                                    )}
                                                  </>
                                                </li>
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      resolvedData(val?._id)
                                                    }
                                                    className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Resolved
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      changeStatus(val)
                                                    }
                                                    className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Edit
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      deletedisputeInquiry(
                                                        val,
                                                        "inquiry"
                                                      )
                                                    }
                                                    className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Delete
                                                  </button>
                                                </li>
                                              </DropdownMoreMenu>
                                              <button
                                                className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                onClick={() =>
                                                  CheckUserBillingSendingDetails(
                                                    val,
                                                    i,
                                                    "inquiry",
                                                    "custom"
                                                  )
                                                }
                                                onMouseEnter={() =>
                                                  handleLetterMouseEnter(
                                                    val?._id
                                                  )
                                                }
                                                onMouseLeave={() =>
                                                  handleLetterMouseLeave(
                                                    val?._id
                                                  )
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  class="icon icon-tabler icon-tabler-notes"
                                                  width="18"
                                                  height="18"
                                                  viewBox="0 0 24 24"
                                                  stroke-width="1.5"
                                                  stroke="#ffff"
                                                  fill="none"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                >
                                                  <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                  />
                                                  <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                  <path d="M9 7l6 0" />
                                                  <path d="M9 11l6 0" />
                                                  <path d="M9 15l4 0" />
                                                </svg>
                                              </button>
                                            </div>
                                            {/* <div>
                                      <DropdownEditMenu className="relative inline-flex">
                                        <li>
                                          <button onClick={() => resolvedData(val?._id)} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Resolved
                                          </button>
                                        </li>
                                        <li>
                                          <button onClick={() => changeStatus(val)} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Edit
                                          </button>
                                        </li>
                                        <li>
                                          <button onClick={() => deletedisputeInquiry(val, 'inquiry')} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Delete
                                          </button>
                                        </li>
                                      </DropdownEditMenu>
                                    </div> */}
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {inquiryDispute?.length === 0 && (
                          <>
                            <div className="m-4 text-center">
                              <h3>No Inquiry Found</h3>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Derogatory
                      </h2>
                    </header>
                    <div>
                      <div className="overflow-x-auto p-4">
                        <div className="shownav">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                              <tr>
                                <th className="py-3 px-5 rounded-l-lg">
                                  <div className="font-semibold text-center">
                                    CREDITOR NAME
                                  </div>
                                </th>
                                <th
                                  className={`py-3 px-5  ${
                                    user.role == "client" ? "rounded-r-lg" : ""
                                  }`}
                                >
                                  <div className="font-semibold text-center">
                                    Summary
                                  </div>
                                </th>
                                {user.role != "client" && (
                                  <th className="py-3 px-5 rounded-r-lg">
                                    <div className="font-semibold text-center">
                                      Actions
                                    </div>
                                  </th>
                                )}
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {inqDerogatoryDispute?.map((val, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="py-3 px-5">
                                      <div className="text-center">
                                        {val?.derogatory["bankName"]}
                                      </div>
                                    </td>
                                    <td
                                      className="py-3 px-5"
                                      style={{ width: "30%" }}
                                    >
                                      <div className="text-center">
                                        {val?.derogatory["latePaymentSummary"]}
                                      </div>
                                    </td>
                                    {user.role != "client" && (
                                      <td
                                        className="py-3 px-5 "
                                        style={{ width: "40%" }}
                                      >
                                        <div className="text-center flex justify-start">
                                          {val?.ai_Report != "0" ? (
                                            <div className="flex items-center">
                                              <>
                                                {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm' onClick={() => resolvedData(val?._id)} >Resolved</button> */}
                                                <DropdownMoreMenu className="relative inline-flex">
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        resolvedData(val?._id)
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Resolved
                                                    </button>
                                                  </li>
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        changeStatus(val)
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Edit
                                                    </button>
                                                  </li>
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        deletedisputeInquiry(
                                                          val,
                                                          "derogatory"
                                                        )
                                                      }
                                                      className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Delete
                                                    </button>
                                                  </li>
                                                </DropdownMoreMenu>
                                                {isDisputeInquiry == i &&
                                                isDisputeInquiryType ===
                                                  "derogatory" ? (
                                                  <>
                                                    {showLetter[val?._id] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -100px",
                                                        }}
                                                      >
                                                        Use Letter Template
                                                      </span>
                                                    )}
                                                    <button
                                                      className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                      onMouseEnter={() =>
                                                        handleGenerateLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleGenerateLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      {" "}
                                                      <Loder />
                                                      <span className="ms-1">
                                                        Regenerating letter
                                                      </span>
                                                    </button>

                                                    <button
                                                      className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                      disabled
                                                      onMouseEnter={() =>
                                                        handleLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-notes"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#000000"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                        <path d="M9 7l6 0" />
                                                        <path d="M9 11l6 0" />
                                                        <path d="M9 15l4 0" />
                                                      </svg>
                                                      Use Letter Template
                                                    </button>
                                                  </>
                                                ) : (
                                                  <>
                                                    {checkTrialStatus ===
                                                    true ? (
                                                      ""
                                                    ) : (
                                                      <>
                                                        <button
                                                          className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm  me-2"
                                                          onClick={() =>
                                                            CheckUserBillingSendingDetails(
                                                              val,
                                                              i,
                                                              "derogatory"
                                                            )
                                                          }
                                                          onMouseEnter={() =>
                                                            handleGenerateLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleGenerateLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          {/* Generate letter */}
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-reload"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                            <path d="M20 4v5h-5" />
                                                          </svg>
                                                          Regenerate letter
                                                        </button>

                                                        <button
                                                          className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                          onClick={() =>
                                                            CheckUserBillingSendingDetails(
                                                              val,
                                                              i,
                                                              "derogatory",
                                                              "custom"
                                                            )
                                                          }
                                                          onMouseEnter={() =>
                                                            handleLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-notes"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                            <path d="M9 7l6 0" />
                                                            <path d="M9 11l6 0" />
                                                            <path d="M9 15l4 0" />
                                                          </svg>
                                                          Use Letter Template
                                                        </button>
                                                      </>
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            </div>
                                          ) : (
                                            <>
                                              <DropdownMoreMenu className="relative inline">
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      deletedisputeInquiry(
                                                        val,
                                                        "derogatory"
                                                      )
                                                    }
                                                    className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Delete
                                                  </button>
                                                </li>
                                              </DropdownMoreMenu>
                                              {isDisputeInquiry == i &&
                                              isDisputeInquiryType ===
                                                "derogatory" ? (
                                                <>
                                                  <button
                                                    className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                    onMouseEnter={() =>
                                                      handleGenerateLetterMouseEnter(
                                                        val?._id
                                                      )
                                                    }
                                                    onMouseLeave={() =>
                                                      handleGenerateLetterMouseLeave(
                                                        val?._id
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    <Loder />
                                                    <span className="ms-1">
                                                      Generate letter
                                                    </span>
                                                  </button>
                                                  {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                  <button
                                                    className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm  "
                                                    disabled
                                                    onMouseEnter={() =>
                                                      handleLetterMouseEnter(
                                                        val?._id
                                                      )
                                                    }
                                                    onMouseLeave={() =>
                                                      handleLetterMouseLeave(
                                                        val?._id
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      class="icon icon-tabler icon-tabler-notes"
                                                      width="18"
                                                      height="18"
                                                      viewBox="0 0 24 24"
                                                      stroke-width="1.5"
                                                      stroke="#ffff"
                                                      fill="none"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                    >
                                                      <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                      />
                                                      <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                      <path d="M9 7l6 0" />
                                                      <path d="M9 11l6 0" />
                                                      <path d="M9 15l4 0" />
                                                    </svg>
                                                    Use Letter Template
                                                  </button>
                                                  {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                </>
                                              ) : (
                                                <>
                                                  {checkTrialStatus === true ? (
                                                    <>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* <span className='me-2'> Generate letter</span> */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        Generate letter
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                    </>
                                                  ) : (
                                                    <>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm  me-2"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "derogatory"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* Generate letter */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        Generate letter
                                                      </button>
                                                      {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "derogatory",
                                                            "custom"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                      </button>
                                                      {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                    </>
                                                  )}

                                                  {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm' onClick={() => deletedisputeInquiry(val ,'derogatory')}>Delete letter</button> */}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="hidenav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {inqDerogatoryDispute?.map((val, i) => {
                                return (
                                  <div key={i}>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          CREDITOR NAME
                                        </div>
                                      </th>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.derogatory["bankName"]}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          Summary
                                        </div>
                                      </th>
                                      <td
                                        className="py-3 px-5"
                                        style={{ width: "50%" }}
                                      >
                                        <div className="text-center">
                                          {
                                            val?.derogatory[
                                              "latePaymentSummary"
                                            ]
                                          }
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          Actions
                                        </div>
                                      </th>
                                      <td className="py-3 px-5 w-[250px]">
                                        <div className="flex items-start justify-center ">
                                          {val?.ai_Report === "0" ? (
                                            <>
                                              {isDisputeInquiry == i &&
                                              isDisputeInquiryType ===
                                                "derogatory" ? (
                                                <>
                                                  <button
                                                    className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                    disabled
                                                    onMouseEnter={() =>
                                                      handleLetterMouseEnter(
                                                        val?._id
                                                      )
                                                    }
                                                    onMouseLeave={() =>
                                                      handleLetterMouseLeave(
                                                        val?._id
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      class="icon icon-tabler icon-tabler-notes"
                                                      width="18"
                                                      height="18"
                                                      viewBox="0 0 24 24"
                                                      stroke-width="1.5"
                                                      stroke="#ffff"
                                                      fill="none"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                    >
                                                      <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                      />
                                                      <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                      <path d="M9 7l6 0" />
                                                      <path d="M9 11l6 0" />
                                                      <path d="M9 15l4 0" />
                                                    </svg>
                                                  </button>
                                                  {showLetter[val?._id] && (
                                                    <span
                                                      style={{
                                                        position: "absolute",
                                                        margin: "30px -100px",
                                                      }}
                                                    >
                                                      Use Letter Template
                                                    </span>
                                                  )}

                                                  <button
                                                    className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm"
                                                    onMouseEnter={() =>
                                                      handleGenerateLetterMouseEnter(
                                                        val?._id
                                                      )
                                                    }
                                                    onMouseLeave={() =>
                                                      handleGenerateLetterMouseLeave(
                                                        val?._id
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    <Loder />
                                                    {/* Generate letter */}
                                                  </button>
                                                  {showGenerateLetter[
                                                    val?._id
                                                  ] && (
                                                    <span
                                                      style={{
                                                        position: "absolute",
                                                        margin: "30px -80px",
                                                      }}
                                                    >
                                                      Generate letter
                                                    </span>
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {checkTrialStatus === true ? (
                                                    <>
                                                      <button
                                                        className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {showLetter[val?._id] && (
                                                        <span
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            margin:
                                                              "30px -100px",
                                                          }}
                                                        >
                                                          Use Letter Template
                                                        </span>
                                                      )}

                                                      <button
                                                        className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* <span className='me-2'> Generate letter</span> */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                        <Tooltip
                                                          size="lg"
                                                          bg="light"
                                                        >
                                                          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                            You are under free
                                                            trial plan, Please
                                                            upgrade your plan.
                                                            Under free trial
                                                            plan you can
                                                            generate 3 letters
                                                            per week.
                                                          </div>
                                                        </Tooltip>
                                                      </button>
                                                      {showGenerateLetter[
                                                        val?._id
                                                      ] && (
                                                        <span
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            margin:
                                                              "30px -80px",
                                                          }}
                                                        >
                                                          Generate letter
                                                        </span>
                                                      )}
                                                    </>
                                                  ) : (
                                                    <>
                                                      <DropdownMoreMenu className="relative inline-flex">
                                                        <li>
                                                          <button
                                                            onClick={() =>
                                                              deletedisputeInquiry(
                                                                val,
                                                                "derogatory"
                                                              )
                                                            }
                                                            className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                          >
                                                            Delete
                                                          </button>
                                                        </li>
                                                      </DropdownMoreMenu>
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "derogatory",
                                                            "custom"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                      </button>
                                                      {showLetter[val?._id] && (
                                                        <span
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            margin:
                                                              "30px -100px",
                                                          }}
                                                        >
                                                          Use Letter Template
                                                        </span>
                                                      )}

                                                      {/* <button className='mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm  me-2' onClick={() => CheckUserBillingSendingDetails(val, i, 'derogatory')}>Generate letter</button> */}
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm  me-2"
                                                        onClick={() =>
                                                          CheckUserBillingSendingDetails(
                                                            val,
                                                            i,
                                                            "derogatory"
                                                          )
                                                        }
                                                        onMouseEnter={() =>
                                                          handleGenerateLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleGenerateLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        {/* Generate letter */}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-reload"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                          <path d="M20 4v5h-5" />
                                                        </svg>
                                                      </button>
                                                      {showGenerateLetter[
                                                        val?._id
                                                      ] && (
                                                        <span
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            margin:
                                                              "30px -80px",
                                                          }}
                                                        >
                                                          Generate letter
                                                        </span>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <div className="">
                                              <DropdownEditMenu className="relative inline-flex">
                                                <li>
                                                  <li>
                                                    <>
                                                      {isDisputeInquiry == i &&
                                                      isDisputeInquiryType ===
                                                        "derogatory" ? (
                                                        <>
                                                          {showLetter[
                                                            val?._id
                                                          ] && (
                                                            <span
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                margin:
                                                                  "30px -100px",
                                                              }}
                                                            >
                                                              Use Letter
                                                              Template
                                                            </span>
                                                          )}
                                                          <button className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center">
                                                            <span className="me-2 ">
                                                              Regenerating
                                                            </span>
                                                            <Loder />
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          {checkTrialStatus ===
                                                          true ? (
                                                            ""
                                                          ) : (
                                                            <>
                                                              <button
                                                                onClick={() =>
                                                                  CheckUserBillingSendingDetails(
                                                                    val,
                                                                    i,
                                                                    "derogatory"
                                                                  )
                                                                }
                                                                onMouseEnter={() =>
                                                                  handleGenerateLetterMouseEnter(
                                                                    val?._id
                                                                  )
                                                                }
                                                                onMouseLeave={() =>
                                                                  handleGenerateLetterMouseLeave(
                                                                    val?._id
                                                                  )
                                                                }
                                                                className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center "
                                                              >
                                                                <span className="me-2">
                                                                  Regenerate
                                                                </span>

                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  class="icon icon-tabler icon-tabler-reload"
                                                                  width="18"
                                                                  height="18"
                                                                  viewBox="0 0 24 24"
                                                                  stroke-width="1.5"
                                                                  stroke="#000000"
                                                                  fill="none"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                >
                                                                  <path
                                                                    stroke="none"
                                                                    d="M0 0h24v24H0z"
                                                                    fill="none"
                                                                  />
                                                                  <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                                  <path d="M20 4v5h-5" />
                                                                </svg>
                                                              </button>
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  </li>
                                                  <button
                                                    onClick={() =>
                                                      resolvedData(
                                                        val?._id,
                                                        val,
                                                        "derogatory"
                                                      )
                                                    }
                                                    className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Resolved
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      changeStatus(val)
                                                    }
                                                    className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Edit
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    onClick={() =>
                                                      deletedisputeInquiry(
                                                        val,
                                                        "derogatory"
                                                      )
                                                    }
                                                    className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                  >
                                                    Delete
                                                  </button>
                                                </li>
                                              </DropdownEditMenu>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </div>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {inqDerogatoryDispute?.length === 0 && (
                          <>
                            <div className="m-4 text-center">
                              <h3>No Derogatory Found</h3>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Public Record
                      </h2>
                    </header>
                    <div>
                      <div className="overflow-x-auto p-4">
                        <div className="shownav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                              <tr>
                                <th className="py-3 px-5 rounded-l-lg">
                                  <div className="font-semibold text-center">
                                    Account Name
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center">
                                    Type
                                  </div>
                                </th>
                                <th
                                  className={`py-3 px-5 ${
                                    user.role != "client" && "rounded-r-lg"
                                  }`}
                                >
                                  <div className="font-semibold text-center">
                                    Date Filed/Reported
                                  </div>
                                </th>
                                {user.role != "client" && (
                                  <th className="py-3 px-5 rounded-r-lg">
                                    <div className="font-semibold text-center">
                                      Action
                                    </div>
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <>
                              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                                {publicDispute &&
                                  publicDispute?.map((val, i) => {
                                    return (
                                      <tr key={i}>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.public["bankName"]}
                                          </div>
                                        </td>
                                        <td className="py-3 px-5 text-center">
                                          Public Information
                                          {/* {val?.public?.TableData?.Type[0].Equifax &&
                                      <div className="text-center">{val?.public?.TableData?.Type[0].Equifax}</div>
                                    }
                                    {val?.public?.TableData?.Type[0].Experian &&
                                      <div className="text-center">{val?.public?.TableData?.Type[0].Experian}</div>
                                    }
                                    {val?.public?.TableData?.Type[0].TransUnion &&
                                      <div className="text-center">{val?.public?.TableData?.Type[0].TransUnion}</div>
                                    } */}
                                        </td>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.public?.TableData?.[
                                              "Date Filed/Reported"
                                            ][0].Equifax && (
                                              <div className="text-center">
                                                {
                                                  val?.public?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0].Equifax
                                                }
                                              </div>
                                            )}
                                            {val?.public?.TableData?.[
                                              "Date Filed/Reported"
                                            ][0].Experian && (
                                              <div className="text-center">
                                                {
                                                  val?.public?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0].Experian
                                                }
                                              </div>
                                            )}
                                            {val?.public?.TableData?.[
                                              "Date Filed/Reported"
                                            ][0].TransUnion && (
                                              <div className="text-center">
                                                {
                                                  val?.public?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0].TransUnion
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        {user.role != "client" && (
                                          <td className="py-3 px-5 flex justify-start">
                                            <div className="text-center">
                                              {val?.ai_Report != "0" ? (
                                                <>
                                                  {/* <div className='text-right' > */}
                                                  {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm' onClick={() => resolvedData(val?._id)} >Resolved</button> */}
                                                  {/* <div className="relative text-center">
                                         <button className="border cursor-pointer p-2" onFocus={() => expand(val)}>
                                           <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                           </svg>
                                         </button>
                                         {isOpenId == val._id && (
                                           <div className="absolute mt-2 w-48  bg-white border rounded-lg shadow-xl z-10" onBlur={close}>
                                             <div className="py-1 ">
                                               <button onClick={() => changeStatus(val)} className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                 Edit
                                               </button>
                                               <button className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                 Delete
                                               </button>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div> */}
                                                  <div className="flex">
                                                    <>
                                                      <DropdownMoreMenu className="relative inline">
                                                        <li>
                                                          <button
                                                            onClick={() =>
                                                              resolvedData(
                                                                val?._id,
                                                                val,
                                                                "public"
                                                              )
                                                            }
                                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                          >
                                                            Resolved
                                                          </button>
                                                        </li>
                                                        <li>
                                                          <button
                                                            onClick={() =>
                                                              changeStatus(val)
                                                            }
                                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                          >
                                                            Edit
                                                          </button>
                                                        </li>
                                                        <li>
                                                          <button
                                                            onClick={() =>
                                                              deletedisputeInquiry(
                                                                val,
                                                                "public"
                                                              )
                                                            }
                                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                          >
                                                            Delete
                                                          </button>
                                                        </li>
                                                      </DropdownMoreMenu>
                                                      {isDisputeInquiry == i &&
                                                      isDisputeInquiryType ===
                                                        "public" ? (
                                                        <>
                                                          {showLetter[
                                                            val?._id
                                                          ] && (
                                                            <span
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                margin:
                                                                  "30px -100px",
                                                              }}
                                                            >
                                                              Use Letter
                                                              Template
                                                            </span>
                                                          )}
                                                          <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2">
                                                            {" "}
                                                            <Loder />
                                                            <span className="ms-1">
                                                              Regenerating
                                                              letter
                                                            </span>{" "}
                                                          </button>
                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                            disabled
                                                            onMouseEnter={() =>
                                                              handleLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-notes"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#000000"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                              <path d="M9 7l6 0" />
                                                              <path d="M9 11l6 0" />
                                                              <path d="M9 15l4 0" />
                                                            </svg>
                                                            Use Letter Template
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          {checkTrialStatus ===
                                                          true ? (
                                                            ""
                                                          ) : (
                                                            <>
                                                              <button
                                                                className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                                onClick={() =>
                                                                  CheckUserBillingSendingDetails(
                                                                    val,
                                                                    i,
                                                                    "public"
                                                                  )
                                                                }
                                                                onMouseEnter={() =>
                                                                  handleGenerateLetterMouseEnter(
                                                                    val?._id
                                                                  )
                                                                }
                                                                onMouseLeave={() =>
                                                                  handleGenerateLetterMouseLeave(
                                                                    val?._id
                                                                  )
                                                                }
                                                              >
                                                                {/* Generate letter */}
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  class="icon icon-tabler icon-tabler-reload"
                                                                  width="18"
                                                                  height="18"
                                                                  viewBox="0 0 24 24"
                                                                  stroke-width="1.5"
                                                                  stroke="#ffff"
                                                                  fill="none"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                >
                                                                  <path
                                                                    stroke="none"
                                                                    d="M0 0h24v24H0z"
                                                                    fill="none"
                                                                  />
                                                                  <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                                  <path d="M20 4v5h-5" />
                                                                </svg>
                                                                Regenerate
                                                                letter
                                                              </button>
                                                              <button
                                                                className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                                onClick={() =>
                                                                  CheckUserBillingSendingDetails(
                                                                    val,
                                                                    i,
                                                                    "public",
                                                                    "custom"
                                                                  )
                                                                }
                                                                onMouseEnter={() =>
                                                                  handleLetterMouseEnter(
                                                                    val?._id
                                                                  )
                                                                }
                                                                onMouseLeave={() =>
                                                                  handleLetterMouseLeave(
                                                                    val?._id
                                                                  )
                                                                }
                                                              >
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  class="icon icon-tabler icon-tabler-notes"
                                                                  width="18"
                                                                  height="18"
                                                                  viewBox="0 0 24 24"
                                                                  stroke-width="1.5"
                                                                  stroke="#ffff"
                                                                  fill="none"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                >
                                                                  <path
                                                                    stroke="none"
                                                                    d="M0 0h24v24H0z"
                                                                    fill="none"
                                                                  />
                                                                  <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                                  <path d="M9 7l6 0" />
                                                                  <path d="M9 11l6 0" />
                                                                  <path d="M9 15l4 0" />
                                                                </svg>
                                                                Use Letter
                                                                Template
                                                              </button>
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  </div>
                                                </>
                                              ) : (
                                                <>
                                                  <DropdownMoreMenu className="relative inline">
                                                    {/* <DropdownEditMenu className="relative inline-flex"> */}
                                                    <li>
                                                      <button
                                                        onClick={() =>
                                                          deletedisputeInquiry(
                                                            val,
                                                            "public"
                                                          )
                                                        }
                                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                      >
                                                        Delete
                                                      </button>
                                                    </li>
                                                  </DropdownMoreMenu>
                                                  {isDisputeInquiry == i &&
                                                  isDisputeInquiryType ===
                                                    "public" ? (
                                                    <>
                                                      <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2">
                                                        {" "}
                                                        <Loder />
                                                        <span className="ms-1">
                                                          Generate letter
                                                        </span>{" "}
                                                      </button>

                                                      {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2' disabled>Custom letter</button> */}
                                                      <button
                                                        className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                        disabled
                                                        onMouseEnter={() =>
                                                          handleLetterMouseEnter(
                                                            val?._id
                                                          )
                                                        }
                                                        onMouseLeave={() =>
                                                          handleLetterMouseLeave(
                                                            val?._id
                                                          )
                                                        }
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          class="icon icon-tabler icon-tabler-notes"
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="#ffff"
                                                          fill="none"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        >
                                                          <path
                                                            stroke="none"
                                                            d="M0 0h24v24H0z"
                                                            fill="none"
                                                          />
                                                          <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                          <path d="M9 7l6 0" />
                                                          <path d="M9 11l6 0" />
                                                          <path d="M9 15l4 0" />
                                                        </svg>
                                                        Use Letter Template
                                                      </button>
                                                      {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {checkTrialStatus ===
                                                      true ? (
                                                        <>
                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                            disabled
                                                            onMouseEnter={() =>
                                                              handleGenerateLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleGenerateLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            {/* <span className='me-2'> Generate letter</span> */}
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-reload"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                              <path d="M20 4v5h-5" />
                                                            </svg>
                                                            Generate letter
                                                            <Tooltip
                                                              size="lg"
                                                              bg="light"
                                                            >
                                                              <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                                You are under
                                                                free trial plan,
                                                                Please upgrade
                                                                your plan. Under
                                                                free trial plan
                                                                you can generate
                                                                3 letters per
                                                                week.
                                                              </div>
                                                            </Tooltip>
                                                          </button>
                                                          {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                            disabled
                                                            onMouseEnter={() =>
                                                              handleLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-notes"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                              <path d="M9 7l6 0" />
                                                              <path d="M9 11l6 0" />
                                                              <path d="M9 15l4 0" />
                                                            </svg>
                                                            Use Letter Template
                                                            <Tooltip
                                                              size="lg"
                                                              bg="light"
                                                            >
                                                              <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                                You are under
                                                                free trial plan,
                                                                Please upgrade
                                                                your plan. Under
                                                                free trial plan
                                                                you can generate
                                                                3 letters per
                                                                week.
                                                              </div>
                                                            </Tooltip>
                                                          </button>
                                                          {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                        </>
                                                      ) : (
                                                        <>
                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                            onClick={() =>
                                                              CheckUserBillingSendingDetails(
                                                                val,
                                                                i,
                                                                "public"
                                                              )
                                                            }
                                                            onMouseEnter={() =>
                                                              handleGenerateLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleGenerateLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            {/* Generate letter */}
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-reload"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                              <path d="M20 4v5h-5" />
                                                            </svg>
                                                            Generate letter
                                                          </button>
                                                          {/* {showGenerateLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -80px' }}>Generate letter</span>} */}

                                                          <button
                                                            className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                            onClick={() =>
                                                              CheckUserBillingSendingDetails(
                                                                val,
                                                                i,
                                                                "public",
                                                                "custom"
                                                              )
                                                            }
                                                            onMouseEnter={() =>
                                                              handleLetterMouseEnter(
                                                                val?._id
                                                              )
                                                            }
                                                            onMouseLeave={() =>
                                                              handleLetterMouseLeave(
                                                                val?._id
                                                              )
                                                            }
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              class="icon icon-tabler icon-tabler-notes"
                                                              width="18"
                                                              height="18"
                                                              viewBox="0 0 24 24"
                                                              stroke-width="1.5"
                                                              stroke="#ffff"
                                                              fill="none"
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                            >
                                                              <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                              />
                                                              <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                              <path d="M9 7l6 0" />
                                                              <path d="M9 11l6 0" />
                                                              <path d="M9 15l4 0" />
                                                            </svg>
                                                            Use Letter Template
                                                          </button>
                                                          {/* {showLetter[val?._id] && <span style={{ position: 'absolute', margin: '30px -100px' }}>Use Letter Template</span>} */}
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </>
                          </table>
                        </div>

                        <div className="hidenav">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3 px-5">
                            <div className="font-semibold text-center">Creditor Name</div>
                          </th>
                          <th className="py-3 px-5">
                            <div className="font-semibold text-center">Type of Business</div>
                          </th>
                          <th className="py-3 px-5">
                            <div className="font-semibold text-center">Date of inquiry</div>
                          </th>
                          <th className="py-3 px-5">
                            <div className="font-semibold text-center"> CONSUMER REPORTING AGENCY</div>
                          </th>
                        </tr>
                      </thead> */}
                            <>
                              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                                {inquiryDispute?.map((val, i) => {
                                  return (
                                    <div key={i}>
                                      <tr>
                                        <th className="py-3 px-5">
                                          <div className="font-semibold text-center">
                                            Creditor Name
                                          </div>
                                        </th>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.inquiry["Creditor Name"]}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5">
                                          <div className="font-semibold text-center">
                                            Type of Business
                                          </div>
                                        </th>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.inquiry["Type of Business"]}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5">
                                          <div className="font-semibold text-center">
                                            Date of inquiry
                                          </div>
                                        </th>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.inquiry["Date of inquiry"]}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5">
                                          <div className="font-semibold text-center">
                                            {" "}
                                            CONSUMER REPORTING AGENCY
                                          </div>
                                        </th>
                                        <td className="py-3 px-5">
                                          <div className="text-center">
                                            {val?.inquiry["Credit Bureau"]}
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5">
                                          <div className="font-semibold text-center">
                                            Action
                                          </div>
                                        </th>
                                        <td className="py-3 px-5 w-[250px]">
                                          <div className="flex items-start justify-center ">
                                            {val?.ai_Report === "0" ? (
                                              <>
                                                <DropdownMoreMenu className="relative inline-flex">
                                                  <li>
                                                    <button
                                                      onClick={() =>
                                                        deletedisputeInquiry(
                                                          val,
                                                          "inquiry"
                                                        )
                                                      }
                                                      className="mb-2 block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                    >
                                                      Delete
                                                    </button>
                                                  </li>
                                                </DropdownMoreMenu>
                                                {isDisputeInquiry == i &&
                                                isDisputeInquiryType ===
                                                  "inquiry" ? (
                                                  <>
                                                    {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2' disabled>Custom letter</button> */}
                                                    <button
                                                      className=" mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                      disabled
                                                      onMouseEnter={() =>
                                                        handleLetterMouseEnter(
                                                          val?._id
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        handleLetterMouseLeave(
                                                          val?._id
                                                        )
                                                      }
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="icon icon-tabler icon-tabler-reload"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="#ffff"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      >
                                                        <path
                                                          stroke="none"
                                                          d="M0 0h24v24H0z"
                                                          fill="none"
                                                        />
                                                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                        <path d="M20 4v5h-5" />
                                                      </svg>
                                                    </button>
                                                    {showLetter[val?._id] && (
                                                      <span
                                                        style={{
                                                          position: "absolute",
                                                          margin: "30px -100px",
                                                        }}
                                                      >
                                                        Use Letter Template
                                                      </span>
                                                    )}

                                                    <button className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm">
                                                      {" "}
                                                      <Loder />
                                                    </button>
                                                  </>
                                                ) : (
                                                  <>
                                                    {checkTrialStatus ===
                                                    true ? (
                                                      <>
                                                        <button
                                                          className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-4 py-4 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                          disabled
                                                          onMouseEnter={() =>
                                                            handleLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-reload"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                            <path d="M20 4v5h-5" />
                                                          </svg>
                                                          <Tooltip
                                                            size="lg"
                                                            bg="light"
                                                          >
                                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                              You are under free
                                                              trial plan, Please
                                                              upgrade your plan.
                                                              Under free trial
                                                              plan you can
                                                              generate 3 letters
                                                              per week.
                                                            </div>
                                                          </Tooltip>
                                                        </button>
                                                        {showLetter[
                                                          val?._id
                                                        ] && (
                                                          <span
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              margin:
                                                                "30px -100px",
                                                            }}
                                                          >
                                                            Use Letter Template
                                                          </span>
                                                        )}

                                                        <button
                                                          className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-4 py-4 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2"
                                                          disabled
                                                          onMouseEnter={() =>
                                                            handleGenerateLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleGenerateLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          {/* <span className='me-2'> Generate letter</span> */}
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-reload"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                            <path d="M20 4v5h-5" />
                                                          </svg>
                                                          <Tooltip
                                                            size="lg"
                                                            bg="light"
                                                          >
                                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                              You are under free
                                                              trial plan, Please
                                                              upgrade your plan.
                                                              Under free trial
                                                              plan you can
                                                              generate 3 letters
                                                              per week.
                                                            </div>
                                                          </Tooltip>
                                                        </button>
                                                        {showGenerateLetter[
                                                          val?._id
                                                        ] && (
                                                          <span
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              margin:
                                                                "30px -80px",
                                                            }}
                                                          >
                                                            Generate letter
                                                          </span>
                                                        )}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <button
                                                          className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-2"
                                                          onClick={() =>
                                                            CheckUserBillingSendingDetails(
                                                              val,
                                                              i,
                                                              "inquiry",
                                                              "custom"
                                                            )
                                                          }
                                                          onMouseEnter={() =>
                                                            handleLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-notes"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                            <path d="M9 7l6 0" />
                                                            <path d="M9 11l6 0" />
                                                            <path d="M9 15l4 0" />
                                                          </svg>
                                                        </button>
                                                        {showLetter[
                                                          val?._id
                                                        ] && (
                                                          <span
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              margin:
                                                                "30px -100px",
                                                            }}
                                                          >
                                                            Use Letter Template
                                                          </span>
                                                        )}

                                                        <button
                                                          className="mb-2 inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm me-3"
                                                          onClick={() =>
                                                            CheckUserBillingSendingDetails(
                                                              val,
                                                              i,
                                                              "inquiry"
                                                            )
                                                          }
                                                          onMouseEnter={() =>
                                                            handleGenerateLetterMouseEnter(
                                                              val?._id
                                                            )
                                                          }
                                                          onMouseLeave={() =>
                                                            handleGenerateLetterMouseLeave(
                                                              val?._id
                                                            )
                                                          }
                                                        >
                                                          {/* Generate letter */}
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="icon icon-tabler icon-tabler-reload"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="#ffff"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          >
                                                            <path
                                                              stroke="none"
                                                              d="M0 0h24v24H0z"
                                                              fill="none"
                                                            />
                                                            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                            <path d="M20 4v5h-5" />
                                                          </svg>
                                                        </button>
                                                        {showGenerateLetter[
                                                          val?._id
                                                        ] && (
                                                          <span
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              margin:
                                                                "30px -80px",
                                                            }}
                                                          >
                                                            Generate letter
                                                          </span>
                                                        )}
                                                      </>
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {/* <div className='text-right' > */}
                                                {/* <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full p-2  tm-background text-white shadow-sm' onClick={() => resolvedData(val?._id)} >Resolved</button> */}
                                                {/* <div className="relative text-center">
                                            <button className="border cursor-pointer p-2" onFocus={() => expand(val)}>
                                              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                              </svg>
                                            </button>
                                            {isOpenId == val._id && (
                                              <div className="absolute mt-2 w-48  bg-white border rounded-lg shadow-xl z-10" onBlur={close}>
                                                <div className="py-1 ">
                                                  <button onClick={() => changeStatus(val)} className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                    Edit
                                                  </button>
                                                  <button className="block w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div> */}
                                                <div>
                                                  <DropdownMoreMenu className="relative inline-flex">
                                                    <li>
                                                      <>
                                                        {isDisputeInquiry ==
                                                          i &&
                                                        isDisputeInquiryType ===
                                                          "inquiry" ? (
                                                          <>
                                                            {showLetter[
                                                              val?._id
                                                            ] && (
                                                              <span
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  margin:
                                                                    "30px -100px",
                                                                }}
                                                              >
                                                                Use Letter
                                                                Template
                                                              </span>
                                                            )}
                                                            <button className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center">
                                                              <span className="me-2 ">
                                                                Regenerating
                                                              </span>
                                                              <Loder />
                                                            </button>
                                                          </>
                                                        ) : (
                                                          <>
                                                            {checkTrialStatus ===
                                                            true ? (
                                                              ""
                                                            ) : (
                                                              <>
                                                                <button
                                                                  onClick={() =>
                                                                    CheckUserBillingSendingDetails(
                                                                      val,
                                                                      i,
                                                                      "inquiry"
                                                                    )
                                                                  }
                                                                  onMouseEnter={() =>
                                                                    handleGenerateLetterMouseEnter(
                                                                      val?._id
                                                                    )
                                                                  }
                                                                  onMouseLeave={() =>
                                                                    handleGenerateLetterMouseLeave(
                                                                      val?._id
                                                                    )
                                                                  }
                                                                  className=" flex  w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white items-center "
                                                                >
                                                                  <span className="me-2">
                                                                    Regenerate
                                                                  </span>

                                                                  <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    class="icon icon-tabler icon-tabler-reload"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 24 24"
                                                                    stroke-width="1.5"
                                                                    stroke="#000000"
                                                                    fill="none"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                  >
                                                                    <path
                                                                      stroke="none"
                                                                      d="M0 0h24v24H0z"
                                                                      fill="none"
                                                                    />
                                                                    <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                                                    <path d="M20 4v5h-5" />
                                                                  </svg>
                                                                </button>
                                                              </>
                                                            )}
                                                          </>
                                                        )}
                                                      </>
                                                    </li>
                                                    <li>
                                                      <button
                                                        onClick={() =>
                                                          resolvedData(val?._id)
                                                        }
                                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                      >
                                                        Resolved
                                                      </button>
                                                    </li>
                                                    <li>
                                                      <button
                                                        onClick={() =>
                                                          changeStatus(val)
                                                        }
                                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                      >
                                                        Edit
                                                      </button>
                                                    </li>
                                                    <li>
                                                      <button
                                                        onClick={() =>
                                                          deletedisputeInquiry(
                                                            val,
                                                            "inquiry"
                                                          )
                                                        }
                                                        className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                                      >
                                                        Delete
                                                      </button>
                                                    </li>
                                                  </DropdownMoreMenu>
                                                </div>
                                                {/* <div>
                                      <DropdownEditMenu className="relative inline-flex">
                                        <li>
                                          <button onClick={() => resolvedData(val?._id)} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Resolved
                                          </button>
                                        </li>
                                        <li>
                                          <button onClick={() => changeStatus(val)} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Edit
                                          </button>
                                        </li>
                                        <li>
                                          <button onClick={() => deletedisputeInquiry(val, 'inquiry')} className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white">
                                            Delete
                                          </button>
                                        </li>
                                      </DropdownEditMenu>
                                    </div> */}
                                              </>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    </div>
                                  );
                                })}
                              </tbody>
                            </>
                          </table>
                        </div>
                        {publicDispute?.length === 0 && (
                          <>
                            <div className="m-4 text-center">
                              <h3>No Public Record Found</h3>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Resolved Inquiries / Derogatory
                      </h2>
                    </header>
                    <div>
                      <div className="overflow-x-auto p-4">
                        <div className="shownav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                              <th className="py-3 px-5 rounded-l-lg">
                                <div className="font-semibold text-center">
                                  CREDITOR NAME
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-center">
                                  Type
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-center">
                                  Date Of Resolved
                                </div>
                              </th>
                              <th className="py-3 px-5 rounded-r-lg">
                                <div className="font-semibold text-center"></div>
                              </th>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {resolvedInqDerogatoryDispute?.map((val, i) => {
                                let disputeType = "";
                                let disputeItem = "";

                                if (val?.type === "inquiry") {
                                  disputeType = "Inquiry";
                                  disputeItem = val?.inquiry["Creditor Name"];
                                } else if (val?.type === "derogatory") {
                                  disputeType = "Derogatory";
                                  disputeItem = val?.derogatory["bankName"];
                                } else if (val?.type === "public") {
                                  disputeType = "Public";
                                  disputeItem = val?.public?.bankName;
                                }
                                return (
                                  <tr key={i} className="uppercase">
                                    <td className="py-3 px-5">
                                      <div className="text-center">
                                        {disputeItem}
                                      </div>
                                    </td>
                                    <td className="py-3 px-5">
                                      <div className="text-center">
                                        {val?.type}
                                      </div>
                                    </td>
                                    <td className="py-3 px-5">
                                      <div className="text-center">
                                        {moment(val.updatedAt).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </div>
                                    </td>
                                    <td className="w-[250px] text-center">
                                      <DropdownMoreMenu className="relative inline-flex">
                                        <li>
                                          <button
                                            onClick={() =>
                                              deleteresolved(val?._id)
                                            }
                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                          >
                                            Delete
                                          </button>
                                        </li>
                                      </DropdownMoreMenu>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="hidenav">
                          <table className="table-auto w-full dark:text-slate-300">
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {resolvedInqDerogatoryDispute?.map((val, i) => {
                                let disputeType = "";
                                let disputeItem = "";

                                if (val?.type === "inquiry") {
                                  disputeType = "Inquiry";
                                  disputeItem = val?.inquiry["Creditor Name"];
                                } else if (val?.type === "derogatory") {
                                  disputeType = "Derogatory";
                                  disputeItem = val?.derogatory["bankName"];
                                } else if (val?.type === "public") {
                                  disputeType = "Public";
                                  disputeItem = val?.public?.bankName;
                                }
                                return (
                                  <div key={i} className="uppercase">
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          CREDITOR NAME
                                        </div>
                                      </th>
                                      {disputeItem}
                                    </tr>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          Type
                                        </div>
                                      </th>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {val?.type}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          Date Of Resolved
                                        </div>
                                      </th>
                                      <td className="py-3 px-5">
                                        <div className="text-center">
                                          {moment(val.updatedAt).format(
                                            "YYYY-MM-DD"
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th className="py-3 px-5">
                                        <div className="font-semibold text-center">
                                          Action
                                        </div>
                                      </th>
                                      <td className="py-3 px-5 w-[250px]">
                                        <div className="flex items-start justify-center ">
                                          <DropdownMoreMenu className="relative inline-flex">
                                            <li>
                                              <button
                                                onClick={() =>
                                                  deleteresolved(val?._id)
                                                }
                                                className="block w-full px-4 py-2 text-gray-800 hover:bg-red-700 hover:text-white"
                                              >
                                                Delete
                                              </button>
                                            </li>
                                          </DropdownMoreMenu>
                                        </div>
                                      </td>
                                    </tr>
                                  </div>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {resolvedInqDerogatoryDispute?.length === 0 && (
                          <>
                            <div className="m-4 text-center">
                              <h3>No Resolved Data Found</h3>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </>
          )}
          {isShowStep != 0 &&
            isShowStep != 3 &&
            isShowStep != 5 &&
            isShowStep != 7 && (
              <AiReportPage
                isShowStep={isShowStep}
                ChangeDisputeStep={ChangeDisputeStep}
                getLettersList={getDisputeData}
                idd="quick-find-modal"
                toAddressDetails={toAddressDetails}
                toAddressDetails1={toAddressDetails1}
                handleToAddressChange1={handleToAddressChange1}
                getToAddressData={getToAddressData}
                getToAddressData1={getToAddressData1}
                handleToAddressChange={handleToAddressChange}
                ModalCompleted={ModalCompleted}
                setModalCompleted={setModalCompleted}
                openAiDataResponse={openAiDataResponse}
                openAiDataResponseAgency={openAiDataResponseAgency}
                userInquiryDataResponse={userInquiryDataResponse}
                searchId="quick-find"
                getDisputeData={getDisputeData}
                modalOpen={inquiryModalOpen}
                setModalOpen={setInquiryModalOpen}
              />
            )}
          {isShowStep === 3 && (
            <AiCustomReportPage
              isShowStep={isShowStep}
              ChangeDisputeStep={ChangeDisputeStep}
              userDetails={userDetails}
              userPlanDetail={userPlanDetail}
              disputeCustomValue={disputeCustomValue}
              setDisputeCustomValue={setDisputeCustomValue}
              modalOpen={customModalOpen}
              userInquiryDataResponse={disputeCustomValue}
              setModalOpen={setCustomModalOpen}
              getDisputeData={getDisputeData}
            ></AiCustomReportPage>
          )}

          {isShowStep === 5 && (
            <DerogatoryAiReportPage
              isShowStep={isShowStep}
              ChangeDisputeStep={ChangeDisputeStep}
              idd="quick-find-modal"
              BankDataEquifax={BankDataEquifax}
              BankDataBank={BankDataBank}
              BankDataTransUnion={BankDataTransUnion}
              BankDataExperian={BankDataExperian}
              openAiResponseEquifax={openAiResponseEquifax}
              setopenAiResponseEquifax={setopenAiResponseEquifax}
              openAiDerogatoryBankResponse={openAiDerogatoryBankResponse}
              setOpenAiDerogatoryBankResponse={setOpenAiDerogatoryBankResponse}
              openAiResponseTransUnion={openAiResponseTransUnion}
              setopenAiResponseTransUnion={setopenAiResponseTransUnion}
              openAiResponseExperian={openAiResponseExperian}
              setopenAiResponseExperian={setopenAiResponseExperian}
              ModalCompleted={ModalCompleted}
              setModalCompleted={setModalCompleted}
              openAiDataResponse={openAiDataResponse}
              userInquiryDataResponse={userInquiryDataResponse}
              searchId="quick-find"
              getDisputeData={getDisputeData}
              modalOpen={derogatoryModalOpen}
              setModalOpen={setDerogatoryModalOpen}
            ></DerogatoryAiReportPage>
          )}

          {isShowStep === 7 && (
            <PublicAiReportPage
              isShowStep={isShowStep}
              ChangeDisputeStep={ChangeDisputeStep}
              getLettersList={getDisputeData}
              idd="quick-find-modal"
              toAddressDetails={toAddressDetails}
              getToAddressData={getToAddressData}
              handleToAddressChange={handleToAddressChange}
              ModalCompleted={ModalCompleted}
              setModalCompleted={setModalCompleted}
              openAiDataResponse={openAiDataResponse}
              userInquiryDataResponse={userInquiryDataResponse}
              searchId="quick-find"
              getDisputeData={getDisputeData}
              modalOpen={searchModalOpen}
              setModalOpen={setSearchModalOpen}
            ></PublicAiReportPage>
          )}

          {/* <DerogatoryModalOpenAiReport idd="quick-find-modal" BankDataEquifax={BankDataEquifax} BankDataTransUnion={BankDataTransUnion} BankDataExperian={BankDataExperian} openAiResponseEquifax={openAiResponseEquifax} setopenAiResponseEquifax={setopenAiResponseEquifax} openAiResponseTransUnion={openAiResponseTransUnion} setopenAiResponseTransUnion={setopenAiResponseTransUnion} openAiResponseExperian={openAiResponseExperian} setopenAiResponseExperian={setopenAiResponseExperian} ModalCompleted={ModalCompleted} setModalCompleted={setModalCompleted} openAiDataResponse={openAiDataResponse} userInquiryDataResponse={userInquiryDataResponse} searchId="quick-find" getDisputeData={getDisputeData} modalOpen={derogatoryModalOpen} setModalOpen={setDerogatoryModalOpen} /> */}
          <InquiryModalOpenAiReport
            getLettersList={getDisputeData}
            idd="quick-find-modal"
            toAddressDetails={toAddressDetails}
            toAddressDetails1={toAddressDetails1}
            handleToAddressChange1={handleToAddressChange1}
            getToAddressData={getToAddressData}
            getToAddressData1={getToAddressData1}
            handleToAddressChange={handleToAddressChange}
            ModalCompleted={ModalCompleted}
            setModalCompleted={setModalCompleted}
            openAiDataResponse={openAiDataResponse}
            openAiDataResponseAgency={openAiDataResponseAgency}
            userInquiryDataResponse={userInquiryDataResponse}
            searchId="quick-find"
            getDisputeData={getDisputeData}
            modalOpen={inquiryModalOpen}
            setModalOpen={setInquiryModalOpen}
          />
          {/* <ModalOpenAiReport /> */}
          {/* <ModalCustomLetterReport idd="quick-find-modal" userDetails={userDetails} searchId="quick-find" disputeCustomValue={disputeCustomValue} setDisputeCustomValue={setDisputeCustomValue} modalOpen={customModalOpen} userInquiryDataResponse={disputeCustomValue} setModalOpen={setCustomModalOpen} getDisputeData={getDisputeData} /> */}
          <ModalChangestatus
            idd="quick-find-modal"
            searchId="quick-find"
            modalOpen={statusModalOpen}
            setModalOpen={setStatusModalOpen}
            setDisputeval={setDisputeval}
            disputeval={disputeval}
            getDisputeData={getDisputeData}
          />
          <ModalEditToaddressDetails
            modalOpen={fromAddressModalOpen}
            setModalOpen={setFromAddressModalOpen}
          ></ModalEditToaddressDetails>
        </div>
      </div>

      {/* <Footer></Footer> */}
    </>
  );
}

export default Dispute;
