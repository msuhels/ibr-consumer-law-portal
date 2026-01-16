import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { DISPUTE_TO_INQUIRY, UPDATE_AI_REPORT_STATUS, UPDATE_AI_GENERATE_RESPONSE, GET_USER_DETAILS, UPDATE_AI_RESPONSE, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
// import LetterAddressData from './LetterAddessData';
import LetterAddressData1 from '../components/LetterAddessData1';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
import Header from '../partials/Header';
import SubNavbar from '../components/SubNavbar'
import DashboardSidebar from '../partials/DashboardSidebar';

function AiReportPage({
  idd,
  modalOpen,
  setModalOpen,
  openAiDataResponse,
  openAiDataResponseAgency,
  userInquiryDataResponse,
  ModalCompleted,
  updateButton,
  setModalCompleted,
  handleTabClick,
  getDisputeData,
  openAiResponseExperian,
  openAiResponseTransUnion,
  openAiResponseEquifax,
  toAddressDetails,
  toAddressDetails1,
  getToAddressData,
  getToAddressData1,
  getLettersList,
  handleToAddressChange,
  handleToAddressChange1,
  isShowStep,
  ChangeDisputeStep
}) {
  const modalContent = useRef(null);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [tabBank, setTabBank] = useState(false);
  const [tabAgency, setTabAgency] = useState(false);
  const [isLetterBankName, setIsLetterBankName] = useState(`${userInquiryDataResponse?.data?.inquiry['Creditor Name'] ? `Inquiry record letter sent to ${userInquiryDataResponse?.data?.inquiry['Creditor Name']}` : " "}`);
  const [isLetterAgencyName, setIsLetterAgencyName] = useState(`${userInquiryDataResponse?.data?.inquiry['Credit Bureau'] ? `Inquiry record letter sent to ${userInquiryDataResponse?.data?.inquiry['Credit Bureau']}` : " "}`);

  const [responseText, setResponseText] = useState(openAiDataResponse);
  const [responseTextAgency, setResponseTextAgency] = useState(openAiDataResponseAgency)

  // const ChangeDisputeStep = (val) => {
  //   setIsShowStep(val);
  // };

  useEffect(() => {
    if (openAiDataResponse && !tabAgency) {
      setTabBank(true);
      setTabAgency(false);
    } else if (openAiDataResponseAgency && !tabBank) {
      setTabAgency(true);
      setTabBank(false);
    }
  }, [openAiDataResponse, openAiDataResponseAgency, tabAgency, tabBank]);

  useEffect(() => {
    setResponseText(openAiDataResponse)
  }, [openAiDataResponse]);

  useEffect(() => {
    setResponseTextAgency(openAiDataResponseAgency)
  }, [openAiDataResponseAgency]);

  const handleTextChange = (event) => {
    // setResponseText(event.target.value);
    setResponseText(event);
  };
  const handleTextChange1 = (event) => {
    // setResponseText(event.target.value);
    setResponseTextAgency(event);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  const generatePDF = async (responseText) => {
    const pdf = new jsPDF();
    let new_responseText = responseText;
    if (responseText?.ai_Response) {
      new_responseText = responseText.ai_Response;
    }
    // let fontSize = 10; 
    // const textWidth = 190; 
    // pdf.setFontSize(fontSize);
    // const lines = pdf.splitTextToSize(new_responseText, textWidth);
    // const pageHeight = pdf.internal.pageSize.height;
    // let currentY = 20;
    // lines.forEach((line, index) => {
    //   if (currentY + fontSize > pageHeight - 1) {
    //     pdf.addPage();
    //     currentY = 20;
    //   }
    //   pdf.text(15, currentY, line);
    //   currentY += fontSize; 
    // });

    pdf.html(new_responseText, {
      x: 15,
      y: 15,
      width: 170, //target width in the PDF document
      windowWidth: 650, //window width in CSS pixels
      callback: function (doc) {
        doc.save('report.pdf');
        setModalOpen(false);
        handleTabClick('contacts')
      },

    });

    // pdf.save('report.pdf');
    // 
  };


  const updateAiGenrateResponse = async () => {
    try {
      const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { userInquiryDataResponse, responseText }, { headers: { "Authorization": "Bearer " + token } });
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
        // let fontSize = 10;
        // const textWidth = 190;
        // pdf.setFontSize(fontSize);

        // const lines = pdf.splitTextToSize(val.ai_Response, textWidth);
        // const pageHeight = pdf.internal.pageSize.height;
        // let currentY = 20;

        // lines.forEach((line, index) => {
        //   if (currentY + fontSize > pageHeight - 1) {
        //     pdf.addPage();
        //     currentY = 20;
        //   }
        //   pdf.text(15, currentY, line);
        //   currentY += fontSize;
        // });
        pdf.html(val.ai_Response, {
          x: 15,
          y: 15,
          width: 170, //target width in the PDF document
          windowWidth: 650, //window width in CSS pixels
          callback: function (doc) {
            doc.save('report.pdf');
            setModalOpen(false);
            handleTabClick('contacts')
          },
        });
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
        for (const record of responseText) {
          let requestData = {
            data: record.data,
            type: record.type,
            inquiry: record.inquiry,
            derogatory: record.derogatory,
          }

          let disputeType = ""
          let disputeItem = "";
          if (requestData?.type && requestData?.type === "inquiry") {
            disputeType = "Inquiry";
            disputeItem = requestData?.inquiry['Creditor Name']
          }
          else if (requestData?.type && requestData?.type === "derogatory") {
            disputeType = "Derogatory";
            disputeItem = requestData?.derogatory['bankName'];
          }
          else if (requestData?.type && requestData?.type === "public") {
            disputeType = "Public";
            disputeItem = requestData?.public?.bankName
          }

          userActivity("Download And Print Letter", "", "", "success", `${disputeType}-${disputeItem}`);
        }
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

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (keyCode === 27) {
        closeModal();
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  const uploadImage = async (body) => {
    return await axios.post(
      `${CK_EDITOR_UPLOAD}`,
      body
    )
  }
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file
            .then((file) => {
              body.append("uploadImg", file);
              body.append('userId', user._id)
              uploadImage(body)
                .then((res) => {
                  // console.log('response',res.data?.data)
                  const imageUrl = res.data?.data?.Location;
                  resolve({ default: imageUrl });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => reject(err));
        });
      },
    };
  }


  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const replaceFun = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return true;
    }
    if (text) {
      if (text?.ai_Response) {
        let ntext = text.ai_Response;
        let string = ntext.replaceAll("\n", "<br />");
        text.ai_Response = string.toString();
        setResponseText(text);
      } else {
        let string = text.replaceAll("\n", "<br />");
        setResponseText(string.toString());
      }
    }
  }
  const replaceFun1 = (text) => {
    if (Array.isArray(text) && text.length >= 1) {
      return true;
    }
    if (text) {
      if (text?.ai_Response) {
        let ntext = text.ai_Response;
        let string = ntext.replaceAll("\n", "<br />");
        text.ai_Response = string.toString();
        setResponseTextAgency(text);
      } else {
        let string = text.replaceAll("\n", "<br />");
        setResponseTextAgency(string.toString());
      }
    }
  }

  useEffect(() => {
    replaceFun(responseText);
  }, [responseText])

  useEffect(() => {
    replaceFun1(responseTextAgency);
  }, [responseTextAgency])


  const handleToLetterBankNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterBankName(value);
  };

  const handleToLetterAgencyNameChange = (e) => {
    console
    const { name, value } = e.target;
    setIsLetterAgencyName(value);
  };
  return (
    <>

      <>
        <div className="mx-5 ">
          {isShowStep === 1 &&
            <main className="grow">
              <div className="relative">
                <div className="">
                  <div className="about-  pb-5 ">
                    <div className="container-fluid col-6">
                      <div className="flex justify-between items-center">
                        <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
                          Dispute letter
                        </h1>
                      </div>
                      <hr></hr>
                      <div
                      >
                        <div className="mb-5">
                          <div>
                            <ul className="flex flex-wrap mt-4">
                              {responseText &&
                                <>
                                  <li className="">
                                    <button onClick={() => { setTabBank(true), setTabAgency(false) }}
                                      className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabBank && "tm-background text-white"}`}
                                    >Bank</button>
                                  </li>
                                </>
                              }
                              {responseTextAgency &&
                                <>
                                  <li className="ms-2">
                                    <button onClick={() => { setTabBank(false), setTabAgency(true) }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabAgency && "tm-background text-white"}`}
                                    >Agency</button>
                                  </li>
                                </>
                              }
                            </ul>
                            <section>
                              <div className="mt-2">
                                <div className="grid w-full gap-6 md:grid-cols-2 ">
                                  <div >
                                    <label className="block text-sm font-semibold mb-2" htmlFor="name">Letter Title:</label>
                                    {tabBank &&
                                    <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                      <input
                                        name="isLetterBankName"
                                        value={isLetterBankName}
                                        onChange={handleToLetterBankNameChange}
                                        autoComplete="address"
                                        className="normal-case form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                        type="text"
                                      />
                                      </div>
                                    }
                                    {tabAgency &&
                                    <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                      <input
                                        name="isLetterAgencyName"
                                        value={isLetterAgencyName}
                                        onChange={handleToLetterAgencyNameChange}
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
                          <div className="mt-5 mb-4  text-sm ">
                            {updateButton === "print_letter" ?
                              <>
                                {
                                  Array.isArray(responseText) && responseText.length >= 1 && (
                                    responseText.map((val, i) => {
                                      let promp = val.ai_Response;
                                      // console.log(promp.toString());
                                      return (
                                        <div key={i}>
                                          <p className='text-center'>Letter Number: {i + 1}</p>
                                          <p className='mx-10 md:mx-40 border p-5 rounded-2xl'>{parse(promp.toString())}</p>
                                        </div>
                                      )
                                    }
                                    )
                                  )
                                }

                              </>
                              :
                              <>
                                {tabBank &&
                                  <>
                                    {updateButton === "update_button"
                                      ?
                                      <>
                                        {responseText &&
                                          <div className=' sm:mx-20 '>
                                            <CKEditor
                                              className="rounded-2xl"
                                              rows={15}
                                              editor={ClassicEditor}
                                              data={responseText?.ai_Response || responseText}
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
                                        }
                                      </>
                                      :
                                      <>
                                        {responseText &&
                                          <div className=' ckeditorcss'>
                                            <CKEditor
                                              className="rounded-2xl"
                                              rows={15}
                                              editor={ClassicEditor}
                                              data={responseText.toString()}
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
                                        }
                                      </>
                                    }
                                  </>
                                }
                                {tabAgency &&
                                  <>
                                    {updateButton === "update_button"
                                      ?
                                      <>
                                        {responseTextAgency &&
                                          <div className='ckeditorcss'>
                                            <CKEditor
                                              className="rounded-2xl"
                                              rows={15}
                                              editor={ClassicEditor}
                                              data={responseTextAgency?.ai_Response || responseTextAgency}
                                              config={{
                                                ckfinder: {
                                                  uploadUrl: "" //Enter your upload url
                                                }
                                              }}
                                              onChange={(event, editor) => {
                                                const data = editor.getData();
                                                if (data) {
                                                  handleTextChange1(data);
                                                }
                                              }}
                                            />
                                          </div>
                                        }
                                      </>
                                      :
                                      <>
                                        {responseTextAgency &&
                                          <div className='ckeditorcss'>
                                            <CKEditor
                                              className="rounded-2xl"
                                              rows={15}
                                              editor={ClassicEditor}
                                              data={responseTextAgency.toString()}
                                              config={{
                                                ckfinder: {
                                                  uploadUrl: "" //Enter your upload url
                                                }
                                              }}
                                              onChange={(event, editor) => {
                                                const data = editor.getData();
                                                if (data) {
                                                  handleTextChange1(data);
                                                }
                                              }}
                                            />
                                          </div>
                                        }
                                      </>
                                    }
                                  </>
                                }

                              </>

                            }

                          </div>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className='text-end'>
                  <button onClick={() => ChangeDisputeStep(0)} className="btn tm-background text-white me-2">BACK</button>

                  <button onClick={() => ChangeDisputeStep(2)} className="btn tm-background text-white rounded">NEXT</button>
                </div> */}
            </main >
          }
          {/* {isShowStep === 2 && */}
          <>
            {updateButton != "print_letter" &&
              <>
                <main className="grow">
                  <div className="relative">
                    <div className="">
                      <div className="about-  pb-5 ">
                        <div className="container-fluid col-6">
                          <hr></hr>
                          <div
                            className='mt-5'
                          >
                            {userInquiryDataResponse &&
                              <LetterAddressData1
                                isLetterBankName={isLetterBankName}
                                isLetterAgencyName={isLetterAgencyName}
                                isShowStep={isShowStep} ChangeDisputeStep={ChangeDisputeStep} tabBank={tabBank} tabAgency={tabAgency} getLettersList={getLettersList} toAddressDetails={toAddressDetails} toAddressDetails1={toAddressDetails1} getToAddressData={getToAddressData} getToAddressData1={getToAddressData1} handleToAddressChange1={handleToAddressChange1} handleToAddressChange={handleToAddressChange} generatePDF={generatePDF} setModalOpen={setModalOpen} responseText={responseText} responseTextAgency={responseTextAgency} updateButton={updateButton} updateReponse={updateReponse} updateAiGenrateResponse={updateAiGenrateResponse} closeModal={closeModal} userInquiryDataResponse={userInquiryDataResponse}></LetterAddressData1>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main >
              </>
            }
          </>
          {/* } */}
        </div>
      </>
    </>
  );
}

export default AiReportPage;
