import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";
import jsPDF from "jspdf";
import axios from "axios";
import {
  DISPUTE_TO_INQUIRY,
  UPDATE_AI_REPORT_STATUS,
  UPDATE_AI_GENERATE_RESPONSE,
  GET_USER_DETAILS,
  UPDATE_AI_RESPONSE,
  CREATE_USERS_ACTIVITY,
} from "../API/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import LetterAddressData from "../components/LetterAddessData";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import parse from "html-react-parser";

function PublicAiReportPage({
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
  isShowStep,
  ChangeDisputeStep,
}) {
  const modalContent = useRef(null);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [responseText, setResponseText] = useState();
  const [showPublicAddressTab, setshowPublicAddressTab] = useState(0);
  const [isLetterBankName, setIsLetterBankName] = useState(
    ` ${
      userInquiryDataResponse?.data?.public?.bankName
        ? `Public record letter sent to ${userInquiryDataResponse?.data?.public?.bankName}`
        : " "
    }`
  );

  useEffect(() => {
    setResponseText(openAiDataResponse);
  }, [openAiDataResponse]);

  const handleTextChange = (event) => {
    // setResponseText(event.target.value);
    setResponseText(event);
  };

  const closeModal = () => {
    setModalOpen(false);
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
        doc.save("report.pdf");
        setModalOpen(false);
        handleTabClick("contacts");
      },
    });

    // pdf.save('report.pdf');
    //
  };

  const updateAiGenrateResponse = async () => {
    try {
      const response = await axios.post(
        UPDATE_AI_GENERATE_RESPONSE,
        { userInquiryDataResponse, responseText },
        { headers: { Authorization: "Bearer " + token } }
      );
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
            doc.save("report.pdf");
            setModalOpen(false);
            handleTabClick("contacts");
          },
        });

        try {
          const response = await axios.post(
            UPDATE_AI_REPORT_STATUS,
            { id: val._id, responseText: val.ai_Response, type },
            { headers: { Authorization: "Bearer " + token } }
          );
          return response.data.message;
        } catch (error) {
          throw error.response.data.message || "Something went wrong";
        }
      });

      try {
        const results = await Promise.all(promises);
        toast.success("All processes completed successfully.");
        setModalOpen(false);
        setModalCompleted(true);
        handleTabClick("contacts");
        for (const record of responseText) {
          let requestData = {
            data: record.data,
            type: record.type,
            inquiry: record.inquiry,
            derogatory: record.derogatory,
          };

          let disputeType = "";
          let disputeItem = "";
          if (requestData?.type && requestData?.type === "inquiry") {
            disputeType = "Inquiry";
            disputeItem = requestData?.inquiry["Creditor Name"];
          } else if (requestData?.type && requestData?.type === "derogatory") {
            disputeType = "Derogatory";
            disputeItem = requestData?.derogatory["bankName"];
          } else if (requestData?.type && requestData?.type === "public") {
            disputeType = "Public";
            disputeItem = requestData?.public?.bankName;
          }

          userActivity(
            "Download And Print Letter",
            "",
            "",
            "success",
            `${disputeType}-${disputeItem}`
          );
        }
      } catch (error) {
        toast.error(error);
        setModalOpen(false);
      }
    } else {
      try {
        const response = await axios.post(
          UPDATE_AI_REPORT_STATUS,
          { id: userInquiryDataResponse, responseText: responseText, type },
          { headers: { Authorization: "Bearer " + token } }
        );
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
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  const uploadImage = async (body) => {
    return await axios.post(`${CK_EDITOR_UPLOAD}`, body);
  };
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file
            .then((file) => {
              body.append("uploadImg", file);
              body.append("userId", user._id);
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
  };

  useEffect(() => {
    replaceFun(responseText);
  }, [responseText]);

  const handleToLetterBankNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterBankName(value);
  };

  return (
    <>
      <div className="ms-5 ">
        <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
          Dispute letter
        </h1>
      </div>
      <hr></hr>
      <div className="">
        <div className="mb-5">
          <section>
            <div className="mt-2">
              <div className="grid w-full gap-6 md:grid-cols-2 ">
                <div>
                  <label
                    className="block text-sm font-medium mb-1 ms-1"
                    htmlFor="name"
                  >
                    Letter Title:
                  </label>
                  <input
                    name="isLetterBankName"
                    value={isLetterBankName}
                    onChange={handleToLetterBankNameChange}
                    autoComplete="address"
                    className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* {showPublicAddressTab === 0 && */}

          <div className="mt-5 mb-4  text-sm ">
            {updateButton === "print_letter" ? (
              <>
                {Array.isArray(responseText) &&
                  responseText.length >= 1 &&
                  responseText.map((val, i) => {
                    let promp = val.ai_Response;
                    console.log(promp.toString());
                    return (
                      <div key={i}>
                        <p className="text-center">Letter Number: {i + 1}</p>
                        <p className="mx-10 md:mx-40 border p-5 rounded-2xl">
                          {parse(promp.toString())}
                        </p>
                      </div>
                    );
                  })}
              </>
            ) : (
              <>
                {updateButton === "update_button" ? (
                  <>
                    {responseText && (
                      <div className=" ckeditorcss">
                        <CKEditor
                          className="rounded-2xl"
                          rows={15}
                          editor={ClassicEditor}
                          data={responseText?.ai_Response || responseText}
                          config={{
                            ckfinder: {
                              uploadUrl: "", //Enter your upload url
                            },
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            if (data) {
                              handleTextChange(data);
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* <textarea
                      rows="15"
                      cols="100"
                      value={responseText?.ai_Response}
                      onChange={handleTextChange}
                      style={{ whiteSpace: 'pre-wrap' }}
                    /> */}
                  </>
                ) : (
                  <>
                    {responseText && (
                      <div className=" ckeditorcss">
                        <CKEditor
                          className="rounded-2xl"
                          rows={15}
                          editor={ClassicEditor}
                          data={responseText.toString()}
                          config={{
                            ckfinder: {
                              uploadUrl: "", //Enter your upload url
                            },
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            if (data) {
                              handleTextChange(data);
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* <textarea
                        rows="15"
                        cols="100"
                        value={responseText}
                        onChange={handleTextChange}
                        style={{ whiteSpace: 'pre-wrap' }}
                      /> */}
                  </>
                )}
              </>
            )}
            {/* <div className='text-end mt-5 me-5'>
                <button onClick={() => ChangeDisputeStep(0)} className="btn tm-background text-white me-2">BACK</button>
                <button onClick={() => setshowPublicAddressTab(1)} className="btn tm-background text-white rounded">NEXT</button>
              </div> */}
          </div>

          {/* } */}

          {/* {showPublicAddressTab === 1 && */}
          <>
            {updateButton != "print_letter" && (
              <>
                <div className="p-5">
                  {userInquiryDataResponse && (
                    <LetterAddressData
                      isLetterBankName={isLetterBankName}
                      isShowStep={isShowStep}
                      ChangeDisputeStep={ChangeDisputeStep}
                      getLettersList={getLettersList}
                      toAddressDetails={toAddressDetails}
                      getToAddressData={getToAddressData}
                      handleToAddressChange={handleToAddressChange}
                      generatePDF={generatePDF}
                      setModalOpen={setModalOpen}
                      responseText={responseText}
                      updateButton={updateButton}
                      updateReponse={updateReponse}
                      updateAiGenrateResponse={updateAiGenrateResponse}
                      closeModal={closeModal}
                      userInquiryDataResponse={userInquiryDataResponse}
                    ></LetterAddressData>
                  )}
                </div>
              </>
            )}
          </>
          {/* } */}
        </div>
      </div>
    </>
  );
}

export default PublicAiReportPage;
