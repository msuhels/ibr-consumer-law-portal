import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { DISPUTE_TO_INQUIRY, UPDATE_AI_REPORT_STATUS, GET_USER_DETAILS, UPDATE_USER_DETAILS, ADD_MULTIPLE_LETTER, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import LetterAddressData from '../components/LetterAddessData';
import { data } from 'jquery';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Link, useParams, useNavigate } from "react-router-dom";


function DerogatoryAiReportPage({
  BankDataEquifax,
  BankDataTransUnion,
  BankDataExperian,
  BankDataBank,
  idd,
  modalOpen,
  setModalOpen,
  openAiDataResponse,
  userInquiryDataResponse,
  ModalCompleted,
  updateButton,
  setModalCompleted,
  handleTabClick,
  getDisputeData,
  openAiResponseExperian,
  openAiResponseTransUnion,
  openAiResponseEquifax,
  openAiDerogatoryBankResponse,
  setopenAiResponseExperian,
  setopenAiResponseEquifax,
  setopenAiResponseTransUnion,
  setOpenAiDerogatoryBankResponse,
  isShowStep,
  ChangeDisputeStep
}) {

  const modalContent = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [responseText, setResponseText] = useState();
  const [letterType, setLetterType] = useState("derogatory");
  const [tabExperian, setTabExperian] = useState(false);
  const [tabTransUnion, setTabTransUnion] = useState(false);
  const [tabEquifax, setTabEquifax] = useState(false);
  const [tabBank, setTabBank] = useState(false);
  const [setLoader, setPageLoader] = useState(false);

  const [responseTextOpenAiResponseTransUnion, setResponseTextOpenAiResponseTransUnion] = useState(openAiResponseTransUnion);
  const [responseTextOpenAiResponseExperian, setResponseTextOpenAiResponseExperian] = useState(openAiResponseExperian);
  const [responseTextOpenAiResponseEquifax, setResponseTextOpenAiResponseEquifax] = useState(openAiResponseEquifax);
  const [responseTextOpenAiResponseBank, setResponseTextOpenAiResponseBank] = useState(openAiDerogatoryBankResponse);
  const [showDerogatoryAddressTab, setshowDerogatoryAddressTab] = useState(0);
  const [isLetterBankName, setIsLetterBankName] = useState(`${userInquiryDataResponse?.data?.derogatory?.bankName ? `Derogatory record letter sent to ${userInquiryDataResponse?.data?.derogatory?.bankName}` : ""}`);
  const [isLetterAgencyNameEquifax, setIsLetterAgencyNameEquifax] = useState(`Derogatory record letter sent to Equifax`);
  const [isLetterAgencyNameExperian, setIsLetterAgencyNameExperian] = useState(`Derogatory record letter sent to Experian`);
  const [isLetterAgencyNameTransUnion, setIsLetterAgencyNameTransUnion] = useState(`Derogatory record letter sent to TransUnion`);

  useEffect(() => {
    setToAddressDetailsTransUnion({
      to_address: BankDataTransUnion?.address,
      to_city: BankDataTransUnion?.city,
      to_state: BankDataTransUnion?.state,
      to_zip: BankDataTransUnion?.zip_code,
      to_phone: BankDataTransUnion?.phone,
      to_country: "US",
    });
    setToAddressDetailsExperian({
      to_address: BankDataExperian?.address,
      to_city: BankDataExperian?.city,
      to_state: BankDataExperian?.state,
      to_zip: BankDataExperian?.zip_code,
      to_phone: BankDataExperian?.phone,
      to_country: "US",
    });
    setToAddressDetailsEquifax({
      to_address: BankDataEquifax?.address,
      to_city: BankDataEquifax?.city,
      to_state: BankDataEquifax?.state,
      to_zip: BankDataEquifax?.zip_code,
      to_phone: BankDataEquifax?.phone,
      to_country: "US",
    });

    setToAddressDetailsBank({
      to_address: BankDataBank?.address,
      to_city: BankDataBank?.city,
      to_state: BankDataBank?.state,
      to_zip: BankDataBank?.zip_code,
      to_phone: BankDataBank?.phone,
      to_country: "US",
    });

    if (openAiResponseTransUnion && !tabExperian && !tabEquifax && !tabBank) {
      setTabTransUnion(true);
      setTabExperian(false);
      setTabEquifax(false);
      setTabBank(false);
    } else if (openAiResponseExperian && !tabTransUnion && !tabEquifax && !tabBank) {
      setTabTransUnion(false);
      setTabExperian(true);
      setTabEquifax(false);
      setTabBank(false);
    } else if (openAiResponseEquifax && !tabTransUnion && !tabExperian && !tabBank) {
      setTabTransUnion(false);
      setTabExperian(false);
      setTabEquifax(true);
      setTabBank(false);
    }
    else if (openAiDerogatoryBankResponse && !tabTransUnion && !tabExperian && !tabExperian) {
      setTabTransUnion(false);
      setTabExperian(false);
      setTabEquifax(false);
      setTabBank(true);
    }
  }, [openAiResponseTransUnion, openAiResponseExperian, openAiResponseEquifax, openAiDerogatoryBankResponse, tabTransUnion, tabExperian, tabEquifax, tabBank]);



  const [toAddressDetailsTransUnion, setToAddressDetailsTransUnion] = useState({
    to_address: BankDataTransUnion?.address,
    to_city: BankDataTransUnion?.city,
    to_state: BankDataTransUnion?.state,
    to_zip: BankDataTransUnion?.zip_code,
    to_phone: BankDataTransUnion?.phone,
    to_country: "US",
  });

  const [toAddressDetailsExperian, setToAddressDetailsExperian] = useState({
    to_address: BankDataExperian?.address,
    to_city: BankDataExperian?.city,
    to_state: BankDataExperian?.state,
    to_zip: BankDataExperian?.zip_code,
    to_phone: BankDataExperian?.phone,
    to_country: "US",
  });

  const [toAddressDetailsEquifax, setToAddressDetailsEquifax] = useState({
    to_address: BankDataEquifax?.address,
    to_city: BankDataEquifax?.city,
    to_state: BankDataEquifax?.state,
    to_zip: BankDataEquifax?.zip_code,
    to_phone: BankDataEquifax?.phone,
    to_country: "US",
  });

  const [toAddressDetailsBank, setToAddressDetailsBank] = useState({
    to_address: BankDataBank?.address,
    to_city: BankDataBank?.city,
    to_state: BankDataBank?.state,
    to_zip: BankDataBank?.zip_code,
    to_phone: BankDataBank?.phone,
    to_country: "US",
  });

  const [userdetails, setUserdetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });


  const handleToLetterBankNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterBankName(value);
  };

  const handleToLetterAgencyNameChangeTransUnion = (e) => {
    console
    const { name, value } = e.target;
    setIsLetterAgencyNameTransUnion(value);
  };

  const handleToLetterAgencyNameChangeExperian = (e) => {
    console
    const { name, value } = e.target;
    setIsLetterAgencyNameExperian(value);
  };

  const handleToLetterAgencyNameChangeEquifax = (e) => {
    console
    const { name, value } = e.target;
    setIsLetterAgencyNameEquifax(value);
  };



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


  const replaceFun = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        setResponseText(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        setResponseText(string.toString())
        return string.toString();
      }
    }
  }
  const replaceFun1 = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        setResponseTextOpenAiResponseExperian(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        setResponseTextOpenAiResponseExperian(string.toString())
        return string.toString();
      }
    }
  }
  const replaceFun2 = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        setResponseTextOpenAiResponseTransUnion(text)
      } else {
        let string = text.replaceAll("\n", "<br >");
        setResponseTextOpenAiResponseTransUnion(string.toString())
      }
    }
  }
  const replaceFun3 = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        setResponseTextOpenAiResponseEquifax(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        setResponseTextOpenAiResponseEquifax(string.toString())
        return string.toString();
      }
    }
  }

  const replaceFun4 = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return;
    }
    if (text) {
      if (text) {
        let ntext = text;
        let string = ntext.replaceAll("\n", "<br >");
        text = string.toString();
        setResponseTextOpenAiResponseBank(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        setResponseTextOpenAiResponseBank(string.toString())
        return string.toString();
      }
    }
  }

  useEffect(() => {
    setResponseTextOpenAiResponseExperian(openAiResponseExperian);
  }, [openAiResponseExperian]);

  useEffect(() => {
    replaceFun1(openAiResponseExperian)
  }, [responseTextOpenAiResponseExperian])

  useEffect(() => {
    setResponseTextOpenAiResponseTransUnion(openAiResponseTransUnion);
  }, [openAiResponseTransUnion]);

  useEffect(() => {
    replaceFun2(openAiResponseTransUnion)
  }, [responseTextOpenAiResponseTransUnion])

  useEffect(() => {
    setResponseTextOpenAiResponseEquifax(openAiResponseEquifax);
  }, [openAiResponseEquifax]);

  useEffect(() => {
    replaceFun3(openAiResponseEquifax)
  }, [responseTextOpenAiResponseEquifax])

  useEffect(() => {
    setResponseTextOpenAiResponseBank(openAiDerogatoryBankResponse);
  }, [openAiDerogatoryBankResponse]);


  useEffect(() => {
    replaceFun4(openAiDerogatoryBankResponse)
  }, [responseTextOpenAiResponseBank])

  const handleTextChangeTransUnion = (event) => {
    setopenAiResponseTransUnion(event)
    setResponseTextOpenAiResponseTransUnion(event);
  };

  const handleTextChangeEquifax = (event) => {
    setopenAiResponseEquifax(event)
    setResponseTextOpenAiResponseEquifax(event);
  };
  const handleTextChangeExperian = (event) => {
    setopenAiResponseExperian(event)
    setResponseTextOpenAiResponseExperian(event);
  };

  const handleTextChangeBank = (event) => {
    setOpenAiDerogatoryBankResponse(event)
    setResponseTextOpenAiResponseBank(event);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleTextChange = (event) => {
    setResponseText(event.target.value);
  };

  const closeModal = () => {
    setToAddressDetailsTransUnion({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });
    setToAddressDetailsExperian({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });

    setToAddressDetailsEquifax({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });

    setToAddressDetailsBank({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });

    setModalOpen(false);
    setTabExperian(false);
    setTabTransUnion(false);
    setTabEquifax(false);
    setTabBank(false);
    setopenAiResponseExperian("");
    setOpenAiDerogatoryBankResponse("");
    setopenAiResponseEquifax("");
    setopenAiResponseTransUnion("");
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
    let letterType = "AI";
    try {
      const response = await axios.post(ADD_MULTIPLE_LETTER, {
        isLetterBankName, isLetterAgencyNameEquifax, isLetterAgencyNameExperian, isLetterAgencyNameTransUnion,
        toAddressDetailsBank: toAddressDetailsBank, responseTextOpenAiResponseBank: responseTextOpenAiResponseBank, toAddressDetailsEquifax: toAddressDetailsEquifax, responseTextOpenAiResponseEquifax: responseTextOpenAiResponseEquifax, toAddressDetailsExperian: toAddressDetailsExperian, responseTextOpenAiResponseExperian: responseTextOpenAiResponseExperian, toAddressDetailsTransUnion: toAddressDetailsTransUnion, responseTextOpenAiResponseTransUnion: responseTextOpenAiResponseTransUnion, userInquiryDataResponse: userInquiryDataResponse
      }, { headers: { "Authorization": "Bearer " + token } });
      closeModal();
      // toast.success(response.data.message);
      // setModalOpen(false);
      // setModalCompleted(true);
      getDisputeData();
      // setIsDisputeInquiry(null);
      if (response?.data?.message) {
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

  const updateProfileAndDispute = async () => {
    setPageLoader(true);
    setToAddressDetailsTransUnion({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });
    setToAddressDetailsExperian({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });

    setToAddressDetailsEquifax({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });

    setToAddressDetailsBank({
      to_address: "",
      to_city: "",
      to_state: "",
      to_zip: "",
      to_phone: "",
      to_country: "US",
    });


    updateUser();
    addMultipleLetter();
    const timer = setTimeout(() => {
      navigate(`/send-letter/${id}`);
      toast.success("Details Updated Successfully");
      setPageLoader(false);
    }, 3000);
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    let fontSize = 10; // Reduced font size
    const textWidth = 190; // Adjust the text width as needed
    pdf.setFontSize(fontSize);
    // Split the text into lines that fit within the text width
    const lines = pdf.splitTextToSize(responseText, textWidth);
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
    handleTabClick('contacts')
  };


  const disputeLetter = async () => {
    try {
      const response = await axios.post(UPDATE_AI_REPORT_STATUS, { id: userInquiryDataResponse?.data?._id, responseText: responseText }, { headers: { "Authorization": "Bearer " + token } });
      // getAwsData();
      toast.success(response.data.message);
      setModalOpen(false);
      setModalCompleted(true);
      getDisputeData();
      // setIsDisputeInquiry(null);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const BackStep = async () => {
    // ChangeDisputeStep(5);
    ChangeDisputeStep(0);
    setshowDerogatoryAddressTab(0);
  };



  const updateReponse = async (type) => {
    if (type === "print_letter") {
      const promises = responseText?.map(async (val, i) => {
        const pdf = new jsPDF();
        let fontSize = 10;
        const textWidth = 190;
        pdf.setFontSize(fontSize);

        const lines = pdf.splitTextToSize(val.ai_Response, textWidth);
        const pageHeight = pdf.internal.pageSize.height;
        let currentY = 20;

        lines.forEach((line, index) => {
          if (currentY + fontSize > pageHeight - 1) {
            pdf.addPage();
            currentY = 20;
          }
          pdf.text(15, currentY, line);
          currentY += fontSize;
        });

        pdf.save('report.pdf');

        try {
          const response = await axios.post(
            UPDATE_AI_REPORT_STATUS,
            { id: val._id, responseText: val.ai_Response, type },
            { headers: { Authorization: 'Bearer ' + token } }
          );
          return response.data.message;
        } catch (error) {
          throw error.response.data.message || 'Something went wrong';
        }
      });

      try {
        const results = await Promise.all(promises);
        toast.success('All processes completed successfully.');
        setModalOpen(false);
        setModalCompleted(true);
        handleTabClick('contacts');
      } catch (error) {
        toast.error(error);
        setModalOpen(false);
      }


    } else {
      try {
        const response = await axios.post(UPDATE_AI_REPORT_STATUS, { id: userInquiryDataResponse, responseText: responseText, type }, { headers: { "Authorization": "Bearer " + token } });
        toast.success(response.data.message);
        setModalOpen(false);
        setModalCompleted(true);
      } catch (error) {
        toast.error(error.response.data.message || "Something went Wrong");
        setModalOpen(false);
      }
    }

  };



  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <div
        className='ms-2 p-5'
      >

        <div className="">
          <h1 className="ms-2 text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
            Dispute letter
          </h1>
        </div>
        <div className=" mb-5">
          <div>
            <ul className="flex flex-wrap m-4">
              {openAiResponseTransUnion &&
                <>
                  <li className="m-1">
                    <button onClick={() => { setTabBank(false); setTabTransUnion(true); setTabExperian(false); setTabEquifax(false); }}
                      className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabTransUnion && "tm-background text-white"}`}
                    >TransUnion</button>
                  </li>
                </>
              }
              {openAiResponseExperian &&
                <>
                  <li className="m-1">
                    <button onClick={() => { setTabBank(false); setTabExperian(true); setTabTransUnion(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabExperian && "tm-background text-white"}`}
                    >Experian</button>
                  </li>
                </>
              }
              {openAiResponseEquifax &&
                <>
                  <li className="m-1">
                    <button onClick={() => { setTabBank(false); setTabEquifax(true); setTabTransUnion(false); setTabExperian(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabEquifax && "tm-background text-white"}`}
                    >
                      Equifax</button>
                  </li>
                </>
              }
              {openAiDerogatoryBankResponse &&
                <>
                  <li className="m-1">
                    <button onClick={() => { setTabEquifax(false); setTabTransUnion(false); setTabExperian(false); setTabBank(true); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabBank && "tm-background text-white"}`}
                    >
                      Bank</button>
                  </li>
                </>
              }
            </ul>
            <section>
              <div className="mt-2">
                <div className="grid w-full gap-6 md:grid-cols-2 ">
                  <div >
                    <label className="block text-sm font-semibold mb-2" htmlFor="name">Letter Title:</label>
                    {tabTransUnion &&
                      <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="isLetterAgencyNameTransUnion"
                          value={isLetterAgencyNameTransUnion}
                          onChange={handleToLetterAgencyNameChangeTransUnion}
                          autoComplete="address"
                          className="normal-case form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    }

                    {tabExperian &&
                      <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="isLetterAgencyNameExperian"
                          value={isLetterAgencyNameExperian}
                          onChange={handleToLetterAgencyNameChangeExperian}
                          autoComplete="address"
                          className="normal-case form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    }

                    {tabEquifax &&
                      <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="isLetterAgencyNameEquifax"
                          value={isLetterAgencyNameEquifax}
                          onChange={handleToLetterAgencyNameChangeEquifax}
                          autoComplete="address"
                          className="normal-case form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    }

                    {tabBank &&
                      <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="isLetterAgencyName"
                          value={isLetterBankName}
                          onChange={handleToLetterBankNameChange}
                          autoComplete="address"
                          className="normal-case form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </section>
          </div>
          {showDerogatoryAddressTab === 0 &&
            <>
              {tabTransUnion &&
                <>
                  < div className="mt-5 mb-4  text-sm text-center   ckeditorcss">
                    {/* <textarea
                    rows="15"
                    cols="100"
                    value={responseTextOpenAiResponseTransUnion}
                    onChange={handleTextChangeTransUnion}
                    style={{ whiteSpace: 'pre-wrap' }}
                  /> */}
                    <CKEditor
                      className="rounded-2xl"
                      rows={15}
                      editor={ClassicEditor}
                      data={responseTextOpenAiResponseTransUnion?.ai_Response || responseTextOpenAiResponseTransUnion}
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
                  < div className="mt-5 mb-4  text-sm text-center  ckeditorcss">
                    {/* <textarea
                    rows="15"
                    cols="100"
                    value={responseTextOpenAiResponseExperian}
                    onChange={handleTextChangeExperian}
                    style={{ whiteSpace: 'pre-wrap' }}
                  /> */}
                    <CKEditor
                      className="rounded-2xl"
                      rows={15}
                      editor={ClassicEditor}
                      data={responseTextOpenAiResponseExperian?.ai_Response || responseTextOpenAiResponseExperian}
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
                  < div className="mt-5 mb-4  text-sm text-center  ckeditorcss">
                    {/* <textarea
                    rows="15"
                    cols="100"
                    value={responseTextOpenAiResponseEquifax}
                    onChange={handleTextChangeEquifax}
                    style={{ whiteSpace: 'pre-wrap' }}
                  /> */}
                    <CKEditor
                      className="rounded-2xl"
                      rows={15}
                      editor={ClassicEditor}
                      data={responseTextOpenAiResponseEquifax?.ai_Response || responseTextOpenAiResponseEquifax}
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

              {tabBank &&
                <>
                  < div className="mt-5 mb-4  text-sm text-center ckeditorcss">
                    {/* <textarea
                    rows="15"
                    cols="100"
                    value={responseTextOpenAiResponseEquifax}
                    onChange={handleTextChangeEquifax}
                    style={{ whiteSpace: 'pre-wrap' }}
                  /> */}
                    <CKEditor
                      className="rounded-2xl"
                      rows={15}
                      editor={ClassicEditor}
                      data={responseTextOpenAiResponseBank?.ai_Response || responseTextOpenAiResponseBank}
                      config={{
                        ckfinder: {
                          uploadUrl: "" //Enter your upload url
                        }
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        if (data) {
                          handleTextChangeBank(data);
                        }
                      }}
                    />
                  </div>
                </>
              }

            </>

          }

          {/* {showDerogatoryAddressTab === 1 && */}
          <>
            <div className='p-5'>
              <hr className='pb-3'></hr>

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
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                              <input
                                id="address"
                                name="address"
                                value={userdetails.address}
                                onChange={handleChange}
                                autoComplete="address"
                                className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                            </div>
                          </div>
                          <div >
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                              <input
                                name="city"
                                id="city"

                                value={userdetails.city}
                                onChange={handleChange}
                                autoComplete="city"
                                className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                            </div>
                          </div>
                        </div>
                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                          <div >
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
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
                                  <option key={index} value={state}>{state}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div >
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                              <input
                                name="zip"
                                value={userdetails.zip}
                                onChange={handleChange}
                                autoComplete="zip"
                                className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                maxLength={5}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                          <div >
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                              <input name="phone"
                                value={userdetails.phone}
                                onChange={handleChange}
                                autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                            </div>
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
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    id="to_address"
                                    name="to_address"
                                    value={toAddressDetailsTransUnion.to_address || ""}
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="address"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    type="text"
                                  />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_city"
                                    id="to_city"

                                    value={toAddressDetailsTransUnion.to_city}
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="city"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    name="to_state"
                                    value={toAddressDetailsTransUnion.to_state}
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="state"
                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Select a state</option>
                                    {states.map((state, index) => (
                                      <option key={index} value={state}>{state}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_zip"
                                    value={toAddressDetailsTransUnion.to_zip}
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="zip"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    maxLength={5}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_phone"
                                    value={toAddressDetailsTransUnion.to_phone}
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Country</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_country"
                                    value="US"
                                    onChange={handleToAddressChangeTransUnion}
                                    autoComplete="country" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    disabled
                                  />
                                </div>
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
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    id="to_address"
                                    name="to_address"
                                    value={toAddressDetailsExperian.to_address || ""}
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="address"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    type="text"
                                  />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_city"
                                    id="to_city"

                                    value={toAddressDetailsExperian.to_city}
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="city"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    name="to_state"
                                    value={toAddressDetailsExperian.to_state}
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="state"
                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Select a state</option>
                                    {states.map((state, index) => (
                                      <option key={index} value={state}>{state}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_zip"
                                    value={toAddressDetailsExperian.to_zip}
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="zip"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    maxLength={5}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_phone"
                                    value={toAddressDetailsExperian.to_phone}
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Country</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_country"
                                    value="US"
                                    onChange={handleToAddressChangeExperian}
                                    autoComplete="country" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    disabled
                                  />
                                </div>
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
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    id="to_address"
                                    name="to_address"
                                    value={toAddressDetailsEquifax.to_address || ""}
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="address"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    type="text"
                                  />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_city"
                                    id="to_city"

                                    value={toAddressDetailsEquifax.to_city}
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="city"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    name="to_state"
                                    value={toAddressDetailsEquifax.to_state}
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="state"
                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Select a state</option>
                                    {states.map((state, index) => (
                                      <option key={index} value={state}>{state}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_zip"
                                    value={toAddressDetailsEquifax.to_zip}
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="zip"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    maxLength={5}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_phone"
                                    value={toAddressDetailsEquifax.to_phone}
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Country</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_country"
                                    value="US"
                                    onChange={handleToAddressChangeEquifax}
                                    autoComplete="country" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='mt-5 text-center'>
                            </div>
                          </div>
                        </section>
                      </div>
                    </>
                  }

                  {tabBank &&
                    <>
                      <div>
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                          <div className="mt-5">
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    id="to_address"
                                    name="to_address"
                                    value={toAddressDetailsBank.to_address || ""}
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="address"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                    type="text"
                                  />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_city"
                                    id="to_city"

                                    value={toAddressDetailsBank.to_city}
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="city"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <select
                                    name="to_state"
                                    value={toAddressDetailsBank.to_state}
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="state"
                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                  >
                                    <option value="">Select a state</option>
                                    {states.map((state, index) => (
                                      <option key={index} value={state}>{state}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input
                                    name="to_zip"
                                    value={toAddressDetailsBank.to_zip}
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="zip"
                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    maxLength={5}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_phone"
                                    value={toAddressDetailsBank.to_phone}
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                </div>
                              </div>
                              <div >
                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Country</label>
                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                  <input name="to_country"
                                    value="US"
                                    onChange={handleToAddressChangeBank}
                                    autoComplete="country" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                    disabled
                                  />
                                </div>
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
            <div className='text-end mt-5 me-5 '>
              <button onClick={() => BackStep()} className="btn tm-background text-white rounded  me-2">BACK</button>
              <button onClick={updateProfileAndDispute} className="btn tm-background text-white">NEXT</button>
            </div>
          </>
          {/* } */}


        </div>
      </div>
    </>
  );
}

export default DerogatoryAiReportPage;
