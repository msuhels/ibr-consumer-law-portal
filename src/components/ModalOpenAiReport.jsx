import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { DISPUTE_TO_INQUIRY, UPDATE_AI_REPORT_STATUS, UPDATE_AI_GENERATE_RESPONSE, GET_USER_DETAILS, UPDATE_AI_RESPONSE, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import LetterAddressData from './LetterAddessData';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';

function ModalOpenAiReport({
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
  toAddressDetails,
  getToAddressData,
  getLettersList,
  handleToAddressChange,
  setSelectedItems,
  selectedItems,
  userdetails,
  checkedValues
}) {
  const modalContent = useRef(null);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [responseText, setResponseText] = useState();

  useEffect(() => {
    setResponseText(openAiDataResponse)
  }, [openAiDataResponse]);

  const handleTextChange = (event) => {
    setResponseText(event);
    if (openAiDataResponse?._id) {
      setSelectedItems((selectedItems) =>
        selectedItems.map((item) =>
          item._id === openAiDataResponse?._id
            ? { ...item, ai_Response: event }
            : item
        )
      );
    }
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

  const generatePDF = async () => {
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
        try {
          const response = await axios.post(
            UPDATE_AI_REPORT_STATUS,
            { id: val._id, responseText: val.ai_Response, type, userdetails ,checkedValues },
            {
              headers: { Authorization: 'Bearer ' + token },
              responseType: 'blob' //Important for downloading PDFs
            }
          );

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Agreement.pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();

          return response.data.message;
        } catch (error) {
          console.error('Error downloading PDF:', error);
        }
      });

      try {
        await Promise.all(promises);
        toast.success('PDF Downloaded Successfully.');
        setModalOpen(false);
        setModalCompleted(true);
        handleTabClick('contacts');
      } catch (error) {
        toast.error(error);
        setModalOpen(false);
      }
    } else {
      try {
        const response = await axios.post(UPDATE_AI_REPORT_STATUS,
          { id: userInquiryDataResponse, responseText: responseText, type },
          { headers: { "Authorization": "Bearer " + token } });

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

  useEffect(() => {
    replaceFun(responseText);
  }, [responseText])

  // console.log(responseText);

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
          className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto max-w-5xl w-full max-h-full overflow-y-auto no-scrollbar rounded-xl shadow-lg"
        >
          <div className="mb-5 mt-3">
            <div className='text-center'>
              <h1 className="pt-5 pb-4 mx-2 rounded-xl font-semibold bg-gray-200 text-black uppercase flex items-center justify-center relative">
                <span className="text-center w-full">Dispute Letter</span>
                <button className="absolute right-4 text-black hover:text-gray-800" onClick={closeModal}>
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </h1>


              {updateButton === "print_letter" &&
                <>
                  <button onClick={() => updateReponse('print_letter')} className="btn-sm mt-4 tm-background text-white rounded">Print Letter</button>
                </>
              }
            </div>
            <div className="mt-5 mb-4  text-sm ">
              {updateButton === "print_letter" ?
                <>
                  {
                    Array.isArray(responseText) && responseText.length >= 1 && (
                      responseText.map((val, i) => {
                        let promp = val.ai_Response;
                        return (
                          <div key={i}>
                            <h1 className='pt-5 pb-4 mx-2 rounded-xl font-semibold text-black uppercase text-center'>Letter Number: {i + 1}</h1>
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
                  {updateButton === "update_button"
                    ?
                    <>
                      {responseText &&
                        <div className='mx-5 sm:mx-20 ckeditorcss'>
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

                      {/* <textarea
                      rows="15"
                      cols="100"
                      value={responseText?.ai_Response}
                      onChange={handleTextChange}
                      style={{ whiteSpace: 'pre-wrap' }}
                    /> */}
                    </>
                    :
                    <>
                      {responseText &&
                        <div className='mx-5 sm:mx-20 ckeditorcss'>
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

                      {/* <textarea
                        rows="15"
                        cols="100"
                        value={responseText}
                        onChange={handleTextChange}
                        style={{ whiteSpace: 'pre-wrap' }}
                      /> */}
                    </>
                  }

                </>

              }

            </div>

            <div className="mt-4 mb-4 text-center">

              {/* {updateButton === "print_letter" ?
                <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>
                :
                <>
                  {updateButton === "update_button" ?
                    <button onClick={() => updateReponse('update_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Update Response</button>
                    :
                    <>
                      <button onClick={generatePDF} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Download Dispute letter</button>
                      <button onClick={updateAiGenrateResponse} className="ms-2 bg-green-500 text-white py-2 px-4 rounded"> Dispute letter</button>
                    </>
                  }
                </>
              } */}

            </div>
            {updateButton != "print_letter" &&
              <>
                <h1 className="pt-5 pb-4 mx-2 rounded-xl font-semibold bg-gray-200 text-black uppercase text-center">letter Address</h1>
                <div className='p-5'>
                  {userInquiryDataResponse &&
                    <LetterAddressData modalOpen={modalOpen} selectedItems={selectedItems} setSelectedItems={setSelectedItems} getLettersList={getLettersList} toAddressDetails={toAddressDetails} getToAddressData={getToAddressData} handleToAddressChange={handleToAddressChange} generatePDF={generatePDF} setModalOpen={setModalOpen} responseText={responseText} updateButton={updateButton} updateReponse={updateReponse} updateAiGenrateResponse={updateAiGenrateResponse} closeModal={closeModal} userInquiryDataResponse={userInquiryDataResponse}></LetterAddressData>
                  }
                </div>
              </>

            }
          </div>
        </div>
      </Transition >
    </>
  );
}

export default ModalOpenAiReport;
