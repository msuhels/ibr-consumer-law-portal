import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { LETTERS_GENERATOR_DATA_BY_FILTER, GET_BANK_ADDRESS, GET_ACTIVE_LETTERS_GENERATOR_LIST, UPDATE_USER_DETAILS, ADD_MULTIPLE_LETTER, GET_USER_DETAILS, EDIT_LETTERS_GENERATOR, ADD_TO_ADDRESS_DATA, UPDATE_AI_GENERATE_RESPONSE, UPDATE_AI_REPORT_STATUS, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import LetterAddressData from './LetterAddessData';
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { event } from 'jquery';

function ModalCustomLetterReport({
  idd,
  modalOpen,
  setModalOpen,
  updateButton,
  disputeCustomValue,
  setDisputeCustomValue,
  getDisputeData,
  userInquiryDataResponse
}) {
  const modalContent = useRef(null);
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isLetterGenerator, setLetterGenerator] = useState([]);
  const [isShowLetter, setShowLetter] = useState(false);
  const [isLetterData, setLetterData] = useState("");
  const [tabExperian, setTabExperian] = useState(false);
  const [tabTransUnion, setTabTransUnion] = useState(false);
  const [tabEquifax, setTabEquifax] = useState(false);
  const [responseTextTransUnion, setResponseTextTransUnion] = useState("");
  const [responseTextExperian, setResponseTextExperian] = useState("");
  const [responseTextEquifax, setResponseTextEquifax] = useState("");


  const [responseTextBank, setResponseTextBank] = useState("")
  const [responseTextAgency, setResponseTextAgency] = useState("")
  const [tabBank, setTabBank] = useState(false);
  const [tabAgency, setTabAgency] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [toAddressDetailsTransUnion, setToAddressDetailsTransUnion] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [toAddressDetailsExperian, setToAddressDetailsExperian] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [toAddressDetailsEquifax, setToAddressDetailsEquifax] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [userdetails, setUserdetails] = useState({
    user_id: id,
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [toAddressDetailsBank, setToAddressDetailsBank] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });
  const [toAddressDetailsAgency, setToAddressDetailsAgency] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });
  const [toAddressDetails, setToAddressDetails] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const handleToAddressChangeTransUnion = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsTransUnion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToAddressChangeExperian = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsExperian((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getActiveLetterGeneratorData();
  }, [search, selectedStatus]); // Fetch data when search term or selected status changes


  const handleToAddressChangeEquifax = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsEquifax((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToAddressChangeBank = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsBank((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleToAddressChangeAgency = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsAgency((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const replaceFun = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return null;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        // setResponseText(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        // setResponseText(string.toString())
        return string.toString();
      }
    }
  }

  useEffect(() => {
    const fetchData = async (bank) => {

      if (disputeCustomValue?.type === 'derogatory') {
        let BankData = {};
        try {
          const response = await axios.post(
            GET_BANK_ADDRESS,
            {
              userid: id,
              bank_name: bank,
            },
            { headers: { Authorization: 'Bearer ' + token } }
          );
          BankData = response.data.creditorData;
        } catch (error) {
          console.log(error.response.data);
        }
        setToAddressDetailsTransUnion({
          to_address: BankData?.address,
          to_city: BankData?.city,
          to_state: BankData?.state,
          to_zip: BankData?.zip_code,
          to_phone: BankData?.phone,
          to_country: 'US',
        });

        setToAddressDetailsExperian({
          to_address: BankData?.address,
          to_city: BankData?.city,
          to_state: BankData?.state,
          to_zip: BankData?.zip_code,
          to_phone: BankData?.phone,
          to_country: 'US',
        });

        setToAddressDetailsEquifax({
          to_address: BankData?.address,
          to_city: BankData?.city,
          to_state: BankData?.state,
          to_zip: BankData?.zip_code,
          to_phone: BankData?.phone,
          to_country: 'US',
        });
      }

      if (disputeCustomValue?.type === 'inquiry' && isLetterData.letter_discription) {
        let BankData = {};
        try {
          const response = await axios.post(
            GET_BANK_ADDRESS,
            {
              userid: id,
              bank_name: bank,
            },
            { headers: { Authorization: 'Bearer ' + token } }
          );
          BankData = response.data.creditorData;
        } catch (error) {
          console.log(error.response.data);
        }
        setToAddressDetailsBank({
          to_address: BankData?.address,
          to_city: BankData?.city,
          to_state: BankData?.state,
          to_zip: BankData?.zip_code,
          to_phone: BankData?.phone,
          to_country: 'US',
        });
      }
    };
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion) {
      setTabTransUnion(true);
      setTabExperian(false);
      setTabEquifax(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    } else if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian) {
      setTabExperian(true);
      setTabEquifax(false);
      setTabTransUnion(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    } else if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax) {
      setTabEquifax(true);
      setTabExperian(false);
      setTabTransUnion(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    }
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion) {
      const TransUnion = replaceFun(isLetterData.letter_discription);
      setResponseTextTransUnion(TransUnion);
    }
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian) {
      const Experian = replaceFun(isLetterData.letter_discription);
      setResponseTextExperian(Experian);
    }
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax) {
      const Equifax = replaceFun(isLetterData.letter_discription);

      setResponseTextEquifax(Equifax);
    }
    if (disputeCustomValue?.type === "inquiry") {
      if (isLetterData.letter_discription && !tabAgency) {
        if (disputeCustomValue?.data?.inquiry) {
          if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "Experian") {
            setToAddressDetailsAgency({
              to_address: "P.O.Box 4500",
              to_city: "Allen",
              to_state: "Texas",
              to_zip: "75013",
              to_phone: "(888) 397-3742",
              to_country: "US",
            });
          } else if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "TransUnion") {
            setToAddressDetailsAgency({
              to_address: "P.O.Box 2000",
              to_city: "Chester",
              to_state: "Pennsyl vania",
              to_zip: "19016",
              to_phone: "(800) 916-8800",
              to_country: "US",
            });
          }
          else if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "Equifax") {
            setToAddressDetailsAgency({
              to_address: "P.O. Box 740256",
              to_city: "Atlanta",
              to_state: "Georgia",
              to_zip: "30374",
              to_phone: "(866) 349-5191",
              to_country: "US",
            });
          }
        }
        fetchData(disputeCustomValue?.data?.inquiry['Creditor Name']);

        setTabBank(true);
        setTabAgency(false);
      } else if (isLetterData.letter_discription && !tabBank) {
        setTabAgency(true);
        setTabBank(false);
      }
      const letterData = replaceFun(isLetterData.letter_discription);
      setResponseTextBank(letterData);
      setResponseTextAgency(letterData);
    }
  }, [isLetterData]);

  const addMultipleLetter = async () => {
    let disputeType = "";
    let disputeItem = "";

    if (userInquiryDataResponse?.data?.type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = userInquiryDataResponse?.data?.inquiry['Creditor Name']
    }
    else if (userInquiryDataResponse?.data?.type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = userInquiryDataResponse?.data?.derogatory['bankName'];
    }
    else if (userInquiryDataResponse?.data?.type === "public") {
      disputeType = "Public";
      disputeItem = userInquiryDataResponse?.data?.public?.bankName
    }
    let letterType = "Custom";
    try {

      const response = await axios.post(ADD_MULTIPLE_LETTER, {
        toAddressDetailsEquifax: toAddressDetailsEquifax,
        responseTextOpenAiResponseEquifax: responseTextEquifax,
        toAddressDetailsExperian: toAddressDetailsExperian,
        responseTextOpenAiResponseExperian: responseTextExperian,
        toAddressDetailsTransUnion: toAddressDetailsTransUnion,
        responseTextOpenAiResponseTransUnion: responseTextTransUnion,
        userInquiryDataResponse: userInquiryDataResponse
      },
        { headers: { "Authorization": "Bearer " + token } });
      closeModal()
      // toast.success(response.data.message);
      // setModalOpen(false);
      // setModalCompleted(true);
      // getDisputeData();
      // setIsDisputeInquiry(null);
      if (response.data.message) {
        userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const handleTextChangeTransUnion = (event) => {
    setResponseTextTransUnion(event);
  };

  const handleTextChangeEquifax = (event) => {
    setResponseTextEquifax(event);
  };

  const handleTextChangeExperian = (event) => {
    setResponseTextExperian(event);
  };
  const handleResponseBankTextChange = (event) => {
    setResponseTextBank(event);
  }
  const handleResponseAgencyTextChange = (event) => {
    setResponseTextAgency(event);
  }
  const handleTextChange = (data) => {
    // const { name, value } = e.target;
    setLetterData({
      ...isLetterData,
      letter_discription: data,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdetails({ ...userdetails, [name]: value });

  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];

  const generatePDF = async () => {
    const pdf = new jsPDF();
    let fontSize = 10; // Reduced font size
    const textWidth = 190; // Adjust the text width as needed
    pdf.setFontSize(fontSize);
    // Split the text into lines that fit within the text width
    const lines = pdf.splitTextToSize(parse(isLetterData.letter_discription), textWidth);
    // Calculate the page height
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = 20;
    lines.forEach((line, index) => {
      if (currentY + fontSize > pageHeight - 1) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(15, currentY, line);
      currentY += fontSize; // Reduced line height
    });

    pdf.save('report.pdf');
    setModalOpen(false);
    // handleTabClick('contacts')
  };
  const generatePDF1 = async (isLetterData) => {
    const pdf = new jsPDF();
    let fontSize = 10; // Reduced font size
    const textWidth = 190; // Adjust the text width as needed
    pdf.setFontSize(fontSize);
    // Split the text into lines that fit within the text width
    const lines = pdf.splitTextToSize(parse(isLetterData), textWidth);
    // Calculate the page height
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = 20;
    lines.forEach((line, index) => {
      if (currentY + fontSize > pageHeight - 1) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(15, currentY, line);
      currentY += fontSize; // Reduced line height
    });

    pdf.save('report.pdf');
    setModalOpen(false);
    // handleTabClick('contacts')
  };

  const getActiveLetterGeneratorData = async () => {
    try {
      const response = await axios.post(
        LETTERS_GENERATOR_DATA_BY_FILTER,
        {
          userid: user._id,
        },
        {
          params: { search: search, exectMatch: selectedStatus },
          headers: { "Authorization": "Bearer " + token }
        });
      setLetterGenerator(response.data)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const closeModal = () => {
    setShowLetter(false)
    setModalOpen(false);
    getDisputeData();
    setSearch("");
  };


  const showLetter = async (id) => {
    try {
      const response = await axios.post(EDIT_LETTERS_GENERATOR, {
        letterId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.letterData) {
        setLetterData(response?.data?.letterData);
        setShowLetter(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const backStep = () => {
    setShowLetter(false)
  };

  const disputeLetter = async () => {
    try {
      const response = await axios.post(UPDATE_AI_REPORT_STATUS, { id: disputeCustomValue?.data?._id, responseText: isLetterData.letter_discription }, { headers: { "Authorization": "Bearer " + token } });
      setModalOpen(false);
      getDisputeData();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const handleToAddressChange = (e) => {
    const { name, value } = e.target;
    setToAddressDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addToAddressData = async (data) => {
    try {
      const response = await axios.post(ADD_TO_ADDRESS_DATA, { toAddressDetails, generateID: data?._id, letterID: data?.dispute_id, }, { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  const addToAddressData1 = async (data, toAddressDetails) => {
    try {
      const response = await axios.post(ADD_TO_ADDRESS_DATA, { toAddressDetails, generateID: data?._id, letterID: data?.dispute_id, }, { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const updateAiGenrateResponse = async () => {
    let disputeType = "";
    let disputeItem = "";

    if (userInquiryDataResponse?.data?.type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = userInquiryDataResponse?.data?.inquiry['Creditor Name']
    }
    else if (userInquiryDataResponse?.data?.type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = userInquiryDataResponse?.data?.derogatory['bankName'];
    }
    else if (userInquiryDataResponse?.data?.type === "public") {
      disputeType = "Public";
      disputeItem = userInquiryDataResponse?.data?.public?.bankName
    }
    // let disputeType = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? userInquiryDataResponse?.data?.inquiry['Creditor Name'] : userInquiryDataResponse?.data?.derogatory['bankName'];
    let letterType = "Custom";
    try {
      const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { userInquiryDataResponse, responseText: isLetterData.letter_discription }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.newgenerateResponse) {
        await addToAddressData(response?.data?.newgenerateResponse);
      }
      setModalOpen(false);
      setToAddressDetails({
        to_address: "",
        to_city: "",
        to_state: "",
        to_zip: "",
        to_phone: "",
        to_country: "US",
      });
      getDisputeData();
      if (response?.data?.message) {
        userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
      }
    } catch (error) {
      toast.error(error.response || "Something went Wrong");
      setModalOpen(false);
    }
  };
  const updateAiGenrateResponse1 = async () => {
    let disputeType = "";
    let disputeItem = "";

    if (userInquiryDataResponse?.data?.type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = userInquiryDataResponse?.data?.inquiry['Creditor Name']
    }
    else if (userInquiryDataResponse?.data?.type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = userInquiryDataResponse?.data?.derogatory['bankName'];
    }
    else if (userInquiryDataResponse?.data?.type === "public") {
      disputeType = "Public";
      disputeItem = userInquiryDataResponse?.data?.public?.bankName
    }
    // let disputeType = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? userInquiryDataResponse?.data?.inquiry['Creditor Name'] : userInquiryDataResponse?.data?.derogatory['bankName'];
    let letterType = "Custom";
    try {
      if (responseTextBank) {
        const responseResponse = "responseBank"
        const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { userInquiryDataResponse, responseText: responseTextBank, responseResponse }, { headers: { "Authorization": "Bearer " + token } });
        if (response?.data?.newgenerateResponse) {
          await addToAddressData1(response?.data?.newgenerateResponse, toAddressDetailsBank);
          setToAddressDetailsBank({
            to_address: "",
            to_city: "",
            to_state: "",
            to_zip: "",
            to_phone: "",
            to_country: "US",
          });
        }
        if (response?.data?.message) {
          userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
        } else {
          userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
        }
      }
      if (responseTextAgency) {
        const responseResponse = "responseAgency"
        const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { userInquiryDataResponse, responseText: responseTextAgency, responseResponse }, { headers: { "Authorization": "Bearer " + token } });
        if (response?.data?.newgenerateResponse) {
          await addToAddressData1(response?.data?.newgenerateResponse, toAddressDetailsAgency);
          setToAddressDetailsAgency({
            to_address: "",
            to_city: "",
            to_state: "",
            to_zip: "",
            to_phone: "",
            to_country: "US",
          });
        }
        if (response?.data?.message) {
          userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
        } else {
          userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
        }
      }

      setModalOpen(false);
      getDisputeData();
    } catch (error) {
      toast.error(error.response || "Something went Wrong");
      setModalOpen(false);
    }
  };

  const updateUser = async () => {
    const userDetailsWithID = {
      ...userdetails,
      user_id: id || user?._id
    };
    await axios
      .post(UPDATE_USER_DETAILS, userDetailsWithID,
        {
          headers: { "Authorization": "Bearer " + token }
        })
      .then((res) => {
        if (res) {
          return ({ success: true });
        }
      })
      .catch((error) => {
        // toast.error(error);
        toast.error(error.response.data);
      });
  };

  const updateProfileAndDispute = async () => {
    if (updateButton === "print_letter") {
      updateReponse('print_letter')
      toast.success("Details Updated Successfully");
    } else if (updateButton === "update_button") {
      updateUser();
      // updateToAddressData();
      updateReponse('update_letter')
      toast.success("Details Updated Successfully");
    } else {
      if (disputeCustomValue?.type === "derogatory") {
        updateUser();
        addMultipleLetter();
      }
      if (disputeCustomValue?.type === "inquiry") {
        updateUser();
        // updateAiGenrateResponse();
        updateAiGenrateResponse1()
      }
      if (disputeCustomValue?.type === "public") {
        updateUser();
        updateAiGenrateResponse();
      }
      toast.success("Details Updated Successfully");
    }
  };

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(id || user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserdetails({
        name: response.data.UserDetails.name,
        email: response.data.UserDetails.email,
        address: response.data.UserDetails.address,
        city: response.data.UserDetails.city,
        state: response.data.UserDetails.state,
        zip: response.data.UserDetails.zip,
        phone: response.data.UserDetails.phone,
      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={idd}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto  rounded-lg max-w-5xl w-full max-h-full rounded-xl no-scrollbar shadow-lg"
        >
          <div className="px-5 py-3 border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-slate-800 dark:text-slate-100"></div>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400" onClick={closeModal} >
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </button>
            </div>
          </div>
          <div className=" mb-5">
            {isShowLetter ?
              <>
                {disputeCustomValue?.type === "derogatory"
                  ?
                  <>
                    <div className=" mb-5">
                      <div>
                        <ul className="flex flex-wrap m-5">
                          {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion &&
                            <>
                              <li className="m-1">
                                <button onClick={() => { setTabTransUnion(true); setTabExperian(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabTransUnion && "tm-background text-white"}`}>TransUnion</button>
                              </li>
                            </>
                          }
                          {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian &&
                            <>
                              <li className="m-1">
                                <button onClick={() => { setTabExperian(true); setTabTransUnion(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabExperian && "tm-background text-white"}`}>Experian</button>
                              </li>
                            </>
                          }
                          {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax &&
                            <>
                              <li className="m-1">
                                <button onClick={() => { setTabEquifax(true); setTabTransUnion(false); setTabExperian(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabEquifax && "tm-background text-white"}`}>Equifax</button>
                              </li>
                            </>
                          }
                        </ul>
                      </div>
                      <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">Dispute letter</h1>
                      {tabTransUnion &&
                        <>
                          < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                            {/* <textarea
                              rows="15"
                              cols="100"
                              value={responseTextTransUnion}
                              onChange={handleTextChangeTransUnion}
                              style={{ whiteSpace: 'pre-wrap' }}
                            /> */}
                            <CKEditor
                              className="rounded-2xl"
                              rows={14}
                              editor={ClassicEditor}
                              data={responseTextTransUnion}
                              config={{
                                ckfinder: {
                                  uploadUrl: "" //Enter your upload url
                                }
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data) {
                                  handleTextChangeTransUnion(data);
                                }
                              }}
                            />
                          </div>
                        </>
                      }
                      {tabExperian &&
                        <>
                          < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                            {/* <textarea
                              rows="15"
                              cols="100"
                              value={responseTextExperian}
                              onChange={handleTextChangeExperian}
                              style={{ whiteSpace: 'pre-wrap' }}
                            /> */}
                            <CKEditor
                              className="rounded-2xl"
                              rows={14}
                              editor={ClassicEditor}
                              data={responseTextExperian}
                              config={{
                                ckfinder: {
                                  uploadUrl: "" //Enter your upload url
                                }
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data) {
                                  handleTextChangeExperian(data);
                                }
                              }}
                            />
                          </div>
                        </>
                      }
                      {tabEquifax &&
                        <>
                          < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                            {/* <textarea
                              rows="15"
                              cols="100"
                              value={responseTextEquifax}
                              onChange={handleTextChangeEquifax}
                              style={{ whiteSpace: 'pre-wrap' }}
                            /> */}
                            <CKEditor
                              className="rounded-2xl"
                              rows={14}
                              editor={ClassicEditor}
                              data={responseTextEquifax}
                              config={{
                                ckfinder: {
                                  uploadUrl: "" //Enter your upload url
                                }
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data) {
                                  handleTextChangeEquifax(data);
                                }
                              }}
                            />
                          </div>
                        </>
                      }
                      <>
                        <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">letter Address</h1>
                        <div className='p-5'>
                          {userInquiryDataResponse &&
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4 mb-5">
                              <div>
                                <section className='hidden'>
                                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                    <div className="sm:w-1/3">
                                      <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                                      <input
                                        id="name" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                        name="name"
                                        value={userdetails.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                      />
                                    </div>
                                    <div className="sm:w-1/3">
                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Email</label>
                                      <input
                                        id="email"
                                        name="email"
                                        value={userdetails.email}
                                        onChange={handleChange}
                                        type="email"
                                        autoComplete="email"
                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" />
                                    </div>
                                  </div>
                                </section>
                                <section>
                                  <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send From Address:</h2>
                                  <div className="mt-5">
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                        <input
                                          id="address"
                                          name="address"
                                          value={userdetails.address}
                                          onChange={handleChange}
                                          autoComplete="address"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                        <input
                                          name="city"
                                          id="city"

                                          value={userdetails.city}
                                          onChange={handleChange}
                                          autoComplete="city"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                        <select
                                          name="state"
                                          value={userdetails.state}
                                          onChange={handleChange}
                                          autoComplete="state"
                                          className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                        >
                                          <option value="">Select a state</option>
                                          {/* Map through states to generate options */}
                                          {states.map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                        <input
                                          name="zip"
                                          value={userdetails.zip}
                                          onChange={handleChange}
                                          autoComplete="zip"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                          maxLength={5}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                        <input name="phone"
                                          value={userdetails.phone}
                                          onChange={handleChange}
                                          autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                    </div>
                                    <div className='mt-5 text-center'>
                                      {/* <button onClick={updateUser} className="btn tm-background text-white">Update From Address</button> */}
                                    </div>
                                  </div>
                                </section>
                              </div>
                              {tabTransUnion &&
                                <>
                                  <div>
                                    <section>
                                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                      <div className="mt-5">
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">Address<span className='text-red-500'>*</span></label>
                                            <input
                                              id="to_address"
                                              name="to_address"
                                              value={toAddressDetailsTransUnion.to_address || ""}
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="address"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                              type="text"
                                            />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">City<span className='text-red-500'>*</span></label>
                                            <input
                                              name="to_city"
                                              id="to_city"

                                              value={toAddressDetailsTransUnion.to_city}
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="city"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">State<span className='text-red-500'>*</span></label>
                                            <select
                                              name="to_state"
                                              value={toAddressDetailsTransUnion.to_state}
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="state"
                                              className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                            >
                                              <option value="">Select a state</option>
                                              {states.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip<span className='text-red-500'>*</span></label>
                                            <input
                                              name="to_zip"
                                              value={toAddressDetailsTransUnion.to_zip}
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="zip"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              maxLength={5}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                            <input name="to_phone"
                                              value={toAddressDetailsTransUnion.to_phone}
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                            <input name="to_country"
                                              value="US"
                                              onChange={handleToAddressChangeTransUnion}
                                              autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className='mt-5 text-center'>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                </>
                              }
                              {tabExperian &&
                                <>
                                  <div>
                                    <section>
                                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                      <div className="mt-5">
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                            <input
                                              id="to_address"
                                              name="to_address"
                                              value={toAddressDetailsExperian.to_address || ""}
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="address"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                              type="text"
                                            />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                            <input
                                              name="to_city"
                                              id="to_city"

                                              value={toAddressDetailsExperian.to_city}
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="city"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                            <select
                                              name="to_state"
                                              value={toAddressDetailsExperian.to_state}
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="state"
                                              className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                            >
                                              <option value="">Select a state</option>
                                              {states.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                            <input
                                              name="to_zip"
                                              value={toAddressDetailsExperian.to_zip}
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="zip"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              maxLength={5}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                            <input name="to_phone"
                                              value={toAddressDetailsExperian.to_phone}
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                            <input name="to_country"
                                              value="US"
                                              onChange={handleToAddressChangeExperian}
                                              autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className='mt-5 text-center'>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                </>
                              }
                              {tabEquifax &&
                                <>
                                  <div>
                                    <section>
                                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                      <div className="mt-5">
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                            <input
                                              id="to_address"
                                              name="to_address"
                                              value={toAddressDetailsEquifax.to_address || ""}
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="address"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                              type="text"
                                            />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                            <input
                                              name="to_city"
                                              id="to_city"

                                              value={toAddressDetailsEquifax.to_city}
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="city"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                            <select
                                              name="to_state"
                                              value={toAddressDetailsEquifax.to_state}
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="state"
                                              className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                            >
                                              <option value="">Select a state</option>
                                              {states.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                            <input
                                              name="to_zip"
                                              value={toAddressDetailsEquifax.to_zip}
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="zip"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              maxLength={5}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                            <input name="to_phone"
                                              value={toAddressDetailsEquifax.to_phone}
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                            <input name="to_country"
                                              value="US"
                                              onChange={handleToAddressChangeEquifax}
                                              autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className='mt-5 text-center'>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                </>
                              }


                            </div>
                          }
                        </div>

                        <hr></hr>
                        <div className='text-center mt-5'>
                          <button onClick={updateProfileAndDispute} className="btn tm-background text-white  me-2">Update And Dispute</button>
                          <button onClick={closeModal} className="btn tm-background text-white me-2">Close</button>
                        </div>
                      </>
                    </div>
                  </>
                  :
                  <>{disputeCustomValue?.type === "inquiry" ?
                    <>
                      <div className='mb-5'>
                        <div className='flex justify-between m-5'>
                          <ul className="flex flex-wrap ">
                            {responseTextBank &&
                              <>
                                <li className="m-1">
                                  <button onClick={() => { setTabBank(true), setTabAgency(false) }}
                                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabBank && "tm-background text-white"}`}
                                  >Bank</button>
                                </li>
                              </>
                            }
                            {responseTextAgency &&
                              <>
                                <li className="m-1">
                                  <button onClick={() => { setTabBank(false), setTabAgency(true) }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabAgency && "tm-background text-white"}`}
                                  >Agency</button>
                                </li>
                              </>
                            }
                          </ul>
                          {/* <button onClick={backStep} className={`inline-flex text-white items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out tm-background`}
                          >Back</button> */}
                        </div>

                        <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">Dispute letter</h1>
                        {tabBank &&
                          <div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                            <CKEditor
                              className="rounded-2xl"
                              rows={14}
                              editor={ClassicEditor}
                              data={responseTextBank}
                              config={{
                                ckfinder: {
                                  uploadUrl: "" //Enter your upload url
                                }
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data) {
                                  handleResponseBankTextChange(data);
                                }
                              }}
                            />
                          </div>
                        }
                        {tabAgency &&
                          <div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                            <CKEditor
                              className="rounded-2xl"
                              rows={14}
                              editor={ClassicEditor}
                              data={responseTextAgency}
                              config={{
                                ckfinder: {
                                  uploadUrl: "" //Enter your upload url
                                }
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data) {
                                  handleResponseAgencyTextChange(data);
                                }
                              }}
                            />
                          </div>
                        }
                        <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">letter Address</h1>
                        <div className='p-5'>

                          {userInquiryDataResponse &&
                            <>
                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4 mb-5">
                                <div>
                                  <section className='hidden'>
                                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                      <div className="sm:w-1/3">
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                                        <input
                                          id="name" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                          name="name"
                                          value={userdetails.name}
                                          onChange={handleChange}
                                          autoComplete="name"
                                        />
                                      </div>
                                      <div className="sm:w-1/3">
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Email</label>
                                        <input
                                          id="email"
                                          name="email"
                                          value={userdetails.email}
                                          onChange={handleChange}
                                          type="email"
                                          autoComplete="email"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" />
                                      </div>
                                    </div>
                                  </section>
                                  <section>
                                    <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send From Address:</h2>
                                    <div className="mt-5">
                                      <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                        <div >
                                          <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                          <input
                                            id="address"
                                            name="address"
                                            value={userdetails.address}
                                            onChange={handleChange}
                                            autoComplete="address"
                                            className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                        </div>
                                        <div >
                                          <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                          <input
                                            name="city"
                                            id="city"

                                            value={userdetails.city}
                                            onChange={handleChange}
                                            autoComplete="city"
                                            className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                        </div>
                                      </div>
                                      <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                        <div >
                                          <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                          <select
                                            name="state"
                                            value={userdetails.state}
                                            onChange={handleChange}
                                            autoComplete="state"
                                            className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                          >
                                            <option value="">Select a state</option>
                                            {/* Map through states to generate options */}
                                            {states.map((state, index) => (
                                              <option key={index} value={state}>{state}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div >
                                          <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                          <input
                                            name="zip"
                                            value={userdetails.zip}
                                            onChange={handleChange}
                                            autoComplete="zip"
                                            className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                            maxLength={5}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                        <div >
                                          <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                          <input name="phone"
                                            value={userdetails.phone}
                                            onChange={handleChange}
                                            autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                        </div>
                                      </div>
                                      <div className='mt-5 text-center'>
                                      </div>
                                    </div>
                                  </section>
                                </div>
                                {tabBank &&
                                  <div>
                                    <section>
                                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                      <div className="mt-5">
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                            <input
                                              id="to_address"
                                              name="to_address"
                                              value={toAddressDetailsBank.to_address || ""}
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="address"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                              type="text"
                                            />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                            <input
                                              name="to_city"
                                              id="to_city"

                                              value={toAddressDetailsBank.to_city}
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="city"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                            <select
                                              name="to_state"
                                              value={toAddressDetailsBank.to_state}
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="state"
                                              className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                            >
                                              <option value="">Select a state</option>
                                              {states.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                            <input
                                              name="to_zip"
                                              value={toAddressDetailsBank.to_zip}
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="zip"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              maxLength={5}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                            <input name="to_phone"
                                              value={toAddressDetailsBank.to_phone}
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                            <input name="to_country"
                                              value="US"
                                              onChange={handleToAddressChangeBank}
                                              autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className='mt-5 text-center'>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                }
                                {tabAgency &&
                                  <div>
                                    <section>
                                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                      <div className="mt-5">
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                            <input
                                              id="to_address"
                                              name="to_address"
                                              value={toAddressDetailsAgency.to_address || ""}
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="address"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                              type="text"
                                            />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                            <input
                                              name="to_city"
                                              id="to_city"

                                              value={toAddressDetailsAgency.to_city}
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="city"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                            <select
                                              name="to_state"
                                              value={toAddressDetailsAgency.to_state}
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="state"
                                              className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                            >
                                              <option value="">Select a state</option>
                                              {states.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                            <input
                                              name="to_zip"
                                              value={toAddressDetailsAgency.to_zip}
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="zip"
                                              className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              maxLength={5}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                            <input name="to_phone"
                                              value={toAddressDetailsAgency.to_phone}
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                          </div>
                                          <div >
                                            <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                            <input name="to_country"
                                              value="US"
                                              onChange={handleToAddressChangeAgency}
                                              autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div className='mt-5 text-center'>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                }
                              </div>
                              <hr></hr>
                              <div className='text-center mt-5'>
                                {isShowLetter &&
                                  <button onClick={backStep} className="btn tm-background text-white me-2">Back</button>
                                }

                                {updateButton === "print_letter" &&

                                  <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>

                                }
                                {updateButton != "print_letter" && updateButton != "update_letter" &&
                                  <>
                                    {tabBank &&
                                      <button onClick={() => generatePDF1(responseTextBank)} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                    }
                                    {tabAgency &&
                                      <button onClick={() => generatePDF1(responseTextAgency)} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                    }
                                  </>
                                }
                                <button onClick={updateProfileAndDispute} className="btn tm-background text-white  me-2">Update And Dispute</button>
                                <button onClick={closeModal} className="btn tm-background text-white me-2">Close</button>
                              </div>
                            </>
                          }

                        </div>
                      </div>
                    </>
                    :
                    <>
                      <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">Dispute letter</h1>
                      <div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
                        {/* <textarea
                          rows="14"
                          cols="100"
                          value={replaceFun(isLetterData.letter_discription)}
                          onChange={(e) => handleTextChange(e)}
                          style={{ whiteSpace: 'pre-wrap' }}
                          name='letter_discription'
                        /> */}
                        <CKEditor
                          className="rounded-2xl"
                          rows={14}
                          editor={ClassicEditor}
                          data={replaceFun(isLetterData.letter_discription)}
                          config={{
                            ckfinder: {
                              uploadUrl: "" //Enter your upload url
                            }
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            if (data) {
                              handleTextChange(data);
                            }
                          }}
                        />
                      </div>
                      <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold uppercase text-center">letter Address</h1>

                      <div className='p-5'>

                        {userInquiryDataResponse &&
                          <>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4 mb-5">
                              <div>
                                <section className='hidden'>
                                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                    <div className="sm:w-1/3">
                                      <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                                      <input
                                        id="name" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                        name="name"
                                        value={userdetails.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                      />
                                    </div>
                                    <div className="sm:w-1/3">
                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Email</label>
                                      <input
                                        id="email"
                                        name="email"
                                        value={userdetails.email}
                                        onChange={handleChange}
                                        type="email"
                                        autoComplete="email"
                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" />
                                    </div>
                                  </div>
                                </section>
                                <section>
                                  <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send From Address:867675</h2>
                                  <div className="mt-5">
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                        <input
                                          id="address"
                                          name="address"
                                          value={userdetails.address}
                                          onChange={handleChange}
                                          autoComplete="address"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                        <input
                                          name="city"
                                          id="city"

                                          value={userdetails.city}
                                          onChange={handleChange}
                                          autoComplete="city"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                        <select
                                          name="state"
                                          value={userdetails.state}
                                          onChange={handleChange}
                                          autoComplete="state"
                                          className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                        >
                                          <option value="">Select a state</option>
                                          {/* Map through states to generate options */}
                                          {states.map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                        <input
                                          name="zip"
                                          value={userdetails.zip}
                                          onChange={handleChange}
                                          autoComplete="zip"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                          maxLength={5}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                        <input name="phone"
                                          value={userdetails.phone}
                                          onChange={handleChange}
                                          autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                    </div>
                                    <div className='mt-5 text-center'>
                                    </div>
                                  </div>
                                </section>
                              </div>
                              <div>
                                <section>
                                  <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                  <div className="mt-5">
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                        <input
                                          id="to_address"
                                          name="to_address"
                                          value={toAddressDetails.to_address || ""}
                                          onChange={handleToAddressChange}
                                          autoComplete="address"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                        <input
                                          name="to_city"
                                          id="to_city"

                                          value={toAddressDetails.to_city}
                                          onChange={handleToAddressChange}
                                          autoComplete="city"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                        <select
                                          name="to_state"
                                          value={toAddressDetails.to_state}
                                          onChange={handleToAddressChange}
                                          autoComplete="state"
                                          className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                        >
                                          <option value="">Select a state</option>
                                          {states.map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                        <input
                                          name="to_zip"
                                          value={toAddressDetails.to_zip}
                                          onChange={handleToAddressChange}
                                          autoComplete="zip"
                                          className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                          maxLength={5}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                        <input name="to_phone"
                                          value={toAddressDetails.to_phone}
                                          onChange={handleToAddressChange}
                                          autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                      </div>
                                      <div >
                                        <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                        <input name="to_country"
                                          value="US"
                                          onChange={handleToAddressChange}
                                          autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                          disabled
                                        />
                                      </div>
                                    </div>
                                    <div className='mt-5 text-center'>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                            <hr></hr>
                            <div className='text-center mt-5'>
                              {isShowLetter &&
                                <button onClick={backStep} className="btn tm-background text-white me-2">Back</button>
                              }

                              {updateButton === "print_letter" &&

                                <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>

                              }
                              {updateButton != "print_letter" && updateButton != "update_letter" &&
                                <>
                                  <button onClick={generatePDF} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                </>
                              }
                              <button onClick={updateProfileAndDispute} className="btn tm-background text-white  me-2">Update And Dispute</button>
                              <button onClick={closeModal} className="btn tm-background text-white me-2">Close</button>
                            </div>
                          </>
                        }

                      </div>
                    </>
                  }
                  </>
                }

              </>
              :
              <div className="overflow-x-auto mt-3 px-2">
                <header className="flex justify-between	 px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                  <h2 className="font-semibold text-slate-100 dark:text-slate-100">Custom Letters</h2>
                  <input
                    className=' bg-gray-100 border-none text-gray-900 text-sm rounded-full block ps-3 p-1.5  dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                  />
                </header>
                <table className="table-auto w-full dark:text-slate-300">
                  <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Letter Title</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Category</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Status</div>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}

                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {isLetterGenerator.map((data, index) => {
                      return (
                        <tr key={index}>
                          {data.is_deleted != 1 && data?.status === "active" &&
                            <>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize cursor-pointer" onClick={() => showLetter(data?._id)}>
                                {data?.letter_title}
                              </td>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                {data?.category ? data?.category : "-"}
                              </td>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                {data?.status ? data?.status : "-"}
                              </td>
                            </>
                          }
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className='text-center mt-5 '>
                  <button onClick={closeModal} className='tm-background text-white text-center rounded-3xl py-2 px-5'>Close</button>
                </div>
              </div>
            }
          </div>
        </div>
      </Transition >
    </>
  );
}

export default ModalCustomLetterReport;
