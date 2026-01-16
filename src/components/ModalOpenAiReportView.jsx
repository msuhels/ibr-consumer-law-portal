import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { DISPUTE_TO_INQUIRY, UPDATE_AI_REPORT_STATUS, GET_USER_DETAILS } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

function ModalOpenAiReport({
  id,
  modalOpen,
  setModalOpen,
  openAiDataResponse,
  userInquiryDataResponse,
  ModalCompleted,
  updateButton,
  setModalCompleted,
  handleTabClick
}) {

  const modalContent = useRef(null);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [responseText, setResponseText] = useState(openAiDataResponse);


  useEffect(() => {
    setResponseText(openAiDataResponse);
  }, [openAiDataResponse]);

  const handleTextChange = (event) => {
    setResponseText(event.target.value);
  };

  const closeModal = () => {
    setModalOpen(false);
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
      // setIsDisputeInquiry(null);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const updateReponse = async (type) => {
    if (type === "print_letter") {

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

    }
    try {
      const response = await axios.post(UPDATE_AI_REPORT_STATUS, { id: userInquiryDataResponse, responseText: responseText, type }, { headers: { "Authorization": "Bearer " + token } });
      // getAwsData();
      toast.success(response.data.message);
      setModalOpen(false);
      setModalCompleted(true);
      // setIsDisputeInquiry(null);
      handleTabClick('contacts')
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
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
        id={id}
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
          className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto max-w-5xl w-full max-h-full rounded shadow-lg"
        >
          <div className="mt-5 mb-5">
            <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>View letter</h1>
            <div className="mt-5 mb-4 text-sm text-center">
              <textarea
                rows="15"
                cols="70"
                value={responseText}
                onChange={handleTextChange}
                style={{ whiteSpace: 'pre-wrap' }}
                disabled
                readOnly
              />
            </div>
            <div className="mt-4 text-center">
              <button onClick={closeModal} className="bg-red-500 text-white py-2 px-4 rounded">Close</button>
{/* 
              {updateButton === "print_letter" ?
                <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>
                :
                <>
                  {updateButton === "update_button" ?
                    <button onClick={() => updateReponse('update_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Update Response</button>
                    :
                    <>
                      <button onClick={generatePDF} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Download Dispute letter</button>
                      <button onClick={disputeLetter} className="ms-2 bg-green-500 text-white py-2 px-4 rounded"> Dispute letter</button>
                    </>
                  }
                </>
              } */}
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalOpenAiReport;
