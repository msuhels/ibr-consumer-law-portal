import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { DISPUTE_TO_INQUIRY, UPDATE_AI_REPORT_STATUS, GET_USER_DETAILS, UPDATE_USER_DETAILS, ADD_MULTIPLE_LETTER, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import LetterAddressData from './LetterAddessData';
import { data } from 'jquery';
import { useParams } from "react-router-dom";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

function DerogatoryModalOpenAiReport({
  BankDataEquifax,
  BankDataTransUnion,
  BankDataExperian,
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
  setopenAiResponseExperian,
  setopenAiResponseEquifax,
  setopenAiResponseTransUnion
}) {
  const modalContent = useRef(null);
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [responseText, setResponseText] = useState();
  const [letterType, setLetterType] = useState("derogatory");
  const [tabExperian, setTabExperian] = useState(false);
  const [tabTransUnion, setTabTransUnion] = useState(false);
  const [tabEquifax, setTabEquifax] = useState(false);
  const [responseTextOpenAiResponseTransUnion, setResponseTextOpenAiResponseTransUnion] = useState(openAiResponseTransUnion);
  const [responseTextOpenAiResponseExperian, setResponseTextOpenAiResponseExperian] = useState(openAiResponseExperian);
  const [responseTextOpenAiResponseEquifax, setResponseTextOpenAiResponseEquifax] = useState(openAiResponseEquifax);

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

    if (openAiResponseTransUnion && !tabExperian && !tabEquifax) {
      setTabTransUnion(true);
      setTabExperian(false);
      setTabEquifax(false);
    } else if (openAiResponseExperian && !tabTransUnion && !tabEquifax) {
      setTabTransUnion(false);
      setTabExperian(true);
      setTabEquifax(false);
    } else if (openAiResponseEquifax && !tabTransUnion && !tabExperian) {
      setTabTransUnion(false);
      setTabExperian(false);
      setTabEquifax(true);
    }
  }, [openAiResponseTransUnion, openAiResponseExperian, openAiResponseEquifax, tabTransUnion, tabExperian, tabEquifax]);



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

  const [userdetails, setUserdetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
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

  const handleToAddressChangeEquifax = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsEquifax((prevState) => ({
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
    setModalOpen(false);
    setTabExperian(false);
    setTabTransUnion(false);
    setTabEquifax(false);
    setopenAiResponseExperian("")
    setopenAiResponseEquifax("")
    setopenAiResponseTransUnion("")
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
      const response = await axios.post(ADD_MULTIPLE_LETTER, { toAddressDetailsEquifax: toAddressDetailsEquifax, responseTextOpenAiResponseEquifax: responseTextOpenAiResponseEquifax, toAddressDetailsExperian: toAddressDetailsExperian, responseTextOpenAiResponseExperian: responseTextOpenAiResponseExperian, toAddressDetailsTransUnion: toAddressDetailsTransUnion, responseTextOpenAiResponseTransUnion: responseTextOpenAiResponseTransUnion, userInquiryDataResponse: userInquiryDataResponse }, { headers: { "Authorization": "Bearer " + token } });
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

    updateUser();
    addMultipleLetter();
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
          className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto max-w-5xl w-full max-h-full rounded-xl no-scrollbar shadow-lg"
        >
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
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
            <div>
              <ul className="flex flex-wrap m-5">
                {openAiResponseTransUnion &&
                  <>
                    <li className="m-1">
                      <button onClick={() => { setTabTransUnion(true); setTabExperian(false); setTabEquifax(false); }}
                        className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabTransUnion && "tm-background text-white"}`}
                      >TransUnion</button>
                    </li>
                  </>
                }
                {openAiResponseExperian &&
                  <>
                    <li className="m-1">
                      <button onClick={() => { setTabExperian(true); setTabTransUnion(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabExperian && "tm-background text-white"}`}
                      >Experian</button>
                    </li>
                  </>
                }
                {openAiResponseEquifax &&
                  <>
                    <li className="m-1">
                      <button onClick={() => { setTabEquifax(true); setTabTransUnion(false); setTabExperian(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabEquifax && "tm-background text-white"}`}
                      >
                        Equifax</button>
                    </li>
                  </>
                }
              </ul>
            </div>
            <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold  uppercase text-center">Dispute letter</h1>
            {tabTransUnion &&
              <>
                < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
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
                < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
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
                < div className="mt-5 mb-4  text-sm text-center mx-5 sm:mx-20 ckeditorcss">
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
            <>
              <h1 className="pt-5 pb-4 mx-2 rounded-xl bg-gray-200 text-black font-semibold  uppercase text-center" >letter Address</h1>
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
                                  <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
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
                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
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
                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
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
                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
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
        </div>
      </Transition >
    </>
  );
}

export default DerogatoryModalOpenAiReport;
