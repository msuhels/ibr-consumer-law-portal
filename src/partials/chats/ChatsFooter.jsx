import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import Header from "../../partials/Header";
import { useParams } from "react-router-dom";
import {
  SEND_MESSAGE,
  UPLOAD_IMAGES_ON_AWS,
  DELETE_IMAGE_DOC_OF_CHAT,
  UPLOAD_DOC_ON_AWS,
} from "../../API/api";
import axios from "axios";
import Loder from "../../partials/Loder";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import moment from "moment";
import ModalOpenAiReport from "../../components/ModalOpenAiReport";
import { useNavigate } from "react-router-dom";
import SendLetterEmailPayment from "../../components/SendLetterEmailPayment";
import head_logo from "../../ConsumerlawLogo.png";
import Footer from "../../partials/Footer";
import ModalBasic from "../../components/ModalBasic";

function ChatsFooter({
  setsetLoader,
  chatID,
  socket,
  setMessageList,
  currentChatUser,
}) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [curMessage, setcurMessage] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [loaderUpload, setloaderUpload] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [setAwsResponse, setsetAwsResponse] = useState("");

  const [docAwsResponse, setDocAwsResponse] = useState("");
  const [videoAwsResponse, setVideoAwsResponse] = useState("");

  const send = async (e) => {
    if (curMessage || setAwsResponse || docAwsResponse || videoAwsResponse) {
      sendMessage();
    }
  };
  const sendMessage = async () => {
    stopListening();
    setIsSend(true);
    let data = {};
    if (curMessage || setAwsResponse || docAwsResponse || videoAwsResponse) {
      data = {
        chat_id: chatID,
        message: curMessage,
        img: setAwsResponse,
        document: docAwsResponse,
        video: videoAwsResponse,
      };
    }
    // if (!chatID && !curMessage) {
    //   return true;
    // }
    try {
      const response = await axios.post(SEND_MESSAGE, data, {
        headers: { Authorization: "Bearer " + token },
      });
      setsetAwsResponse("");
      setDocAwsResponse("");
      setVideoAwsResponse("");
      let msgEmit = await socket.emit("send_message", response?.data?.messages);
      //  let msg= JSON.stringify(response.data.messages);
      // socket.send(msg);
      setcurMessage("");
      // setMessageList((list) => [...list, response.data.messages]);
      setIsSend(false);
      toast.success("Message sent");
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    if (socket) {
      //   socket.onmessage = function (e) {
      //     console.log('Received: ' + e.data);
      //     setMessageList((list) => [...list, e.data]);
      // };
      socket.on("recieve_message", (messageData) => {
        console.log(messageData, "================>>>");
        if (messageData) {
          setMessageList((list) => [...list, messageData]);
        }
      });
    }
  }, [socket]);

  //   socket.onmessage = function (e) {
  //     console.log('Received: ' + e.data);
  //     setMessageList((list) => [...list, e.data]);
  // };

  const startListening = () => {
    if (recognition && !listening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
    }
  };

  useEffect(() => {
    // alert("hey")
    // Check if the SpeechRecognition API is available in the browser
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const newRecognition = new SpeechRecognition();

      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      newRecognition.onstart = () => {
        setListening(true);
      };

      newRecognition.onresult = (event) => {
        let newTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          newTranscript += event.results[i][0].transcript;
        }
        setTranscript(newTranscript);
        setcurMessage(newTranscript);
      };

      newRecognition.onend = () => {
        setListening(false);
      };

      setRecognition(newRecognition);
    } else {
      // SpeechRecognition API not available, provide a fallback input field
      console.warn("SpeechRecognition API is not available in this browser.");
    }
  }, []);

  const handleDocChange = async (event) => {
    setsetLoader(true);
    try {
      const selectedFile = event.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      ];
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

      if (!selectedFile) {
        toast.error("Please select a document file");
        setsetLoader(false);
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid document file (PDF, DOC, DOCX)");
        setsetLoader(false);
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("File size exceeds 10MB limit");
        setsetLoader(false);
        return;
      }

      const formData = new FormData();
      formData.append("document", selectedFile);
      const response = await axios.post(UPLOAD_DOC_ON_AWS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      console.log(response?.data);
      setDocAwsResponse(response?.data);
      setsetLoader(false);
      // toast.success("Document uploaded successfully!");
    } catch (error) {
      setsetLoader(false);
      setDocAwsResponse("");
      toast.error(error.response?.data || "Error uploading document!");
      console.error(error);
    }
  };

  const handleFileChange = async (event) => {
    setsetLoader(true);
    try {
      const selectedFile = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const type = "chatImg";
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (!selectedFile) {
        toast.error("Please select a Document");
        setsetLoader(false);
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, JPG)");
        setsetLoader(false);
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("Image size exceeds 5MB limit");
        setsetLoader(false);
        return;
      }
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("documentType", type);
      formData.append("user_id", currentChatUser[0]?.owner_id);
      // formData.append('letter_id', selectedItems[0]._id);
      const response = await axios.post(UPLOAD_IMAGES_ON_AWS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      setsetAwsResponse(response?.data);
      setsetLoader(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }
  };

  const removeImage = async () => {
    setsetLoader(true);
    if (
      setAwsResponse?.newAwsData?._id &&
      setAwsResponse?.newAwsData?.user_id
    ) {
      let awsId = setAwsResponse?.newAwsData?._id;
      let userId = setAwsResponse?.newAwsData?.user_id;
      try {
        const response = await axios.post(
          DELETE_IMAGE_DOC_OF_CHAT,
          { userId, awsId },
          { headers: { Authorization: "Bearer " + token } }
        );
        if (response) {
          setsetAwsResponse("");
        }
        setsetLoader(false);
      } catch (error) {
        setsetLoader(false);
        toast.error("Something went wrong");
      }
    }
  };

  const handleVideoChange = async (event) => {
    setsetLoader(true);
    try {
      const selectedFile = event.target.files[0];
      const allowedTypes = ["video/mp4", "video/mov", "video/avi"];
      const maxSize = 50 * 1024 * 1024;

      if (!selectedFile) {
        toast.error("Please select a video file");
        setsetLoader(false);
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error(
          "Invalid file type. Please upload an MP4, MOV, or AVI video."
        );
        setsetLoader(false);
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("Video size exceeds 50MB limit");
        setsetLoader(false);
        return;
      }

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await axios.post(UPLOAD_DOC_ON_AWS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      setVideoAwsResponse(response?.data);
      setsetLoader(false);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response?.data || "Error uploading video!");
      console.error(error);
    }
  };

  const removeDocFromAws = async () => {
    setsetLoader(true);
    if (
      docAwsResponse?.newAwsData?._id &&
      docAwsResponse?.newAwsData?.user_id
    ) {
      let awsId = docAwsResponse?.newAwsData?._id;
      let userId = docAwsResponse?.newAwsData?.user_id;
      try {
        const response = await axios.post(
          DELETE_IMAGE_DOC_OF_CHAT,
          { userId, awsId },
          { headers: { Authorization: "Bearer " + token } }
        );
        if (response) {
          setDocAwsResponse("");
        }
        setsetLoader(false);
      } catch (error) {
        setsetLoader(false);
        toast.error("Something went wrong");
      }
    }
  };

  const removeVideoFromAws = async () => {
    setsetLoader(true);
    if (
      videoAwsResponse?.newAwsData?._id &&
      videoAwsResponse?.newAwsData?.user_id
    ) {
      let awsId = videoAwsResponse?.newAwsData?._id;
      let userId = videoAwsResponse?.newAwsData?.user_id;
      try {
        const response = await axios.post(
          DELETE_IMAGE_DOC_OF_CHAT,
          { userId, awsId },
          { headers: { Authorization: "Bearer " + token } }
        );
        if (response) {
          setVideoAwsResponse("");
        }
        setsetLoader(false);
      } catch (error) {
        setsetLoader(false);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      {/* <div className="sticky bottom-0 bg-white">
        {chatID && <div className="flex items-center justify-between  dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
            <button className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 mr-3">
            <span className="sr-only">Add</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z" />
            </svg>
            </button>
            <form className="grow flex" onSubmit={send}>
            <div className="grow mr-3">
                <label htmlFor="message-input" className="sr-only">Type a message</label>
                <input id="message-input" value={curMessage} onChange={(e) => setcurMessage(e.target.value)} className="form-input w-full bg-white dark:bg-slate-800 dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500 border border-gray-200" type="text" placeholder="Aa" />
            </div>
            <button type="submit" className="py-2 px-5 rounded-2xl bg-[#bd0808] hover:bg-red-600 text-white whitespace-nowrap">Send</button>
            </form>
        </div>}
        </div> */}
      <div className="sticky bottom-0  md:mx-16 lg:mx-16 px-4">
        {chatID && (
          <div className=" items-center justify-between  bg-[#FBFCFC] border-2 border-[EEEFF1] rounded-[30px] w-full">
            {videoAwsResponse?.data?.Location && (
              <div className="relative inline-block w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 shadow-md m-5">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x-bind:width="size"
                    x-bind:height="size"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    x-bind:stroke-width="stroke"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="100"
                    height="100"
                    stroke-width="2"
                  >
                    <path d="M17.011 9.385v5.128l3.989 3.487v-12z"></path>
                    <path d="M3.887 6h10.08c1.468 0 3.033 1.203 3.033 2.803v8.196a.991 .991 0 0 1 -.975 1h-10.373c-1.667 0 -2.652 -1.5 -2.652 -3l.01 -8a.882 .882 0 0 1 .208 -.71a.841 .841 0 0 1 .67 -.287z"></path>
                  </svg>
                  <span className="text-center text-sm font-semibold">
                    {(() => {
                      const fileUrl = videoAwsResponse?.data?.Location || "";
                      const fileExtension = fileUrl
                        .split(".")
                        .pop()
                        ?.toLowerCase();

                      switch (fileExtension) {
                        case "mp4":
                          return "MP4 Video";
                        case "mov":
                          return "MOV Video";
                        case "avi":
                          return "AVI Video";
                        case "doc":
                          return "DOC";
                        case "docx":
                          return "DOCX";
                        default:
                          return "FILE";
                      }
                    })()}
                  </span>
                </div>
                {/* Remove Button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                  className="absolute top-2 right-2 cursor-pointer bg-gray-400 rounded-full p-1"
                  onClick={() => removeVideoFromAws()}
                >
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                  <path d="M10 10l4 4m0 -4l-4 4"></path>
                </svg>
              </div>
            )}

            {docAwsResponse?.data?.Location && (
              <div className="relative inline-block w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 shadow-md m-5">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="100"
                    height="100"
                    className="mb-2 text-gray-500"
                  >
                    <path d="M12 10l-6 10l-3 -5l6 -10z"></path>
                    <path d="M9 15h12l-3 5h-12"></path>
                    <path d="M15 15l-6 -10h6l6 10z"></path>
                  </svg>
                  <span className="text-center text-sm font-semibold">
                    {(() => {
                      const fileUrl = docAwsResponse?.data?.Location || "";
                      const fileExtension = fileUrl
                        .split(".")
                        .pop()
                        ?.toLowerCase();
                      switch (fileExtension) {
                        case "pdf":
                          return "PDF";
                        case "doc":
                          return "DOC";
                        case "docx":
                          return "DOCX";
                        default:
                          return "FILE";
                      }
                    })()}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                  className="absolute top-2 right-2 cursor-pointer bg-gray-400 rounded-full p-1"
                  onClick={() => removeDocFromAws()}
                >
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                  <path d="M10 10l4 4m0 -4l-4 4"></path>
                </svg>
              </div>
            )}

            {setAwsResponse?.data?.Location && (
              <>
                <div className="relative inline-block w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 shadow-md m-5">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                    <img
                      src={setAwsResponse?.data?.Location}
                      width={100}
                      alt="signature"
                      className="m-5"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      className="absolute top-2 right-2 cursor-pointer bg-gray-400 rounded-full p-1"
                      onClick={() => removeImage()}
                    >
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                      <path d="M10 10l4 4m0 -4l-4 4"></path>
                    </svg>
                  </div>
                </div>
                <hr></hr>
              </>
            )}
            <div className="flex items-center py-4 px-3 bg-[#FBFCFC] rounded-[30px] ">
              <textarea
                value={curMessage}
                rows={1}
                onChange={(e) => setcurMessage(e.target.value)}
                // onKeyDown={handleKeyDown}
                // style={{ resize: 'none' }}
                id="chat"
                className=" block  mx-4 p-2.5  w-full focus:ring-[#FBFCFC] border-none bg-[#FBFCFC]"
                placeholder="Type your message here..."
              ></textarea>

              {loaderUpload ? (
                <button
                  className="hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                  disabled
                >
                  <svg
                    className="animate-spin w-6 h-6 fill-current shrink-0"
                    stroke="black"
                    fill="black"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    send();
                  }}
                  className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600 me-2"
                >
                  <svg
                    className="w-6 h-6 rotate-90"
                    stroke="black"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              )}

              <div className="flex items-center justify-center">
                <input
                  type="file"
                  id="videoInput"
                  style={{ display: "none" }}
                  accept="video/mp4, video/mov, video/avi"
                  onChange={(event) => handleVideoChange(event)}
                />

                <svg
                  className=" cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  x-bind:width="size"
                  onClick={() => document.getElementById("videoInput").click()}
                  x-bind:height="size"
                  viewBox="0 0 24 24"
                  fill="none"
                     stroke="black"
                  x-bind:stroke-width="stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="24"
                  height="24"
                  stroke-width="2"
                >
                  <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
                  <path d="M10 9l5 3l-5 3z"></path>
                </svg>
              </div>

              <div className="flex p-2 items-center justify-center">
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  accept=".jpg, .jpeg, .png"
                  onChange={(event) => handleFileChange(event)}
                />
                <svg
                  // stroke="black" fill="black"
                  className=" cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                     stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="24"
                  height="24"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <path d="M15 8h.01"></path>
                  <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path>
                  <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4"></path>
                  <path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559"></path>
                  <path d="M19 16v6"></path>
                  <path d="M22 19l-3 3l-3 -3"></path>
                </svg>
              </div>

              <div className="flex items-center justify-center ">
                <input
                  type="file"
                  id="docInput"
                  style={{ display: "none" }}
                  accept=".pdf, .doc, .docx"
                  onChange={(event) => handleDocChange(event)}
                />
                <svg
                  className="cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  x-bind:width="size"
                  onClick={() => document.getElementById("docInput").click()}
                  x-bind:height="size"
                  viewBox="0 0 24 24"
                  fill="none"
                   stroke="black"
                  x-bind:stroke-width="stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="24"
                  height="24"
                  stroke-width="2"
                >
                  <path d="M12 10l-6 10l-3 -5l6 -10z"></path>
                  <path d="M9 15h12l-3 5h-12"></path>
                  <path d="M15 15l-6 -10h6l6 10z"></path>
                </svg>
              </div>

              {listening ? (
                <button onClick={() => stopListening()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-player-stop-filled"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="black"
                    fill="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z"
                      stroke-width="0"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => startListening()}
                  type="button"
                  className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 28H20M24 13V15C24 19.4 20.4 23 16 23M16 23C11.6 23 8 19.4 8 15V13M16 23V28"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 20C15.3401 19.9985 14.6871 19.8644 14.08 19.6056C13.4728 19.3469 12.9239 18.9688 12.4657 18.4938C11.5276 17.5478 11.0009 16.2698 11 14.9375V8.00004C10.9975 7.34271 11.1251 6.69138 11.3754 6.08359C11.6258 5.47581 11.994 4.9236 12.4588 4.45879C12.9236 3.99399 13.4758 3.62579 14.0836 3.37542C14.6914 3.12506 15.3427 2.99748 16 3.00004C18.8038 3.00004 21 5.19629 21 8.00004V14.9375C21 17.7288 18.7569 20 16 20Z"
                      fill="black"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChatsFooter;
