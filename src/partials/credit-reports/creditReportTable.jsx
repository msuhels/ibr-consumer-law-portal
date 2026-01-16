import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import { GET_DOC_LIST_FROM_AWS, GET_DOC_FROM_AWS, READ_HTML_RESPONSE, CHECK_HTML_RESPONSE, CREATE_USERS_ACTIVITY, DELETE_DOC_FROM_AWS } from "../../API/api"
import moment from 'moment'
import ModalSearch from '../../components/ModalSearch';
import dispute_img from "../../images/dispute.png"
import aduit_img from "../../images/audit.png"
// import { Configuration, OpenAIApi } from "openai";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import ModalBasic from '../../components/ModalBasic';
import { OpenAIKey } from '../../Config';

function CreditTable() {
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [userID, setuserID] = useState(null);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loaderDownload, setLoaderDownload] = useState(false);
  const itemsPerPage = 10; // Number of items per page
  const [loadingStates, setLoadingStates] = useState({});
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [processDataResponse, setprocessDataResponse] = useState('');
  const [isLoader, setisLoader] = useState(false);
  const [isLoaderSuccess, setisLoaderSuccess] = useState(false);
  const [setLoader, setsetLoader] = useState(false);
  const [deleteReportModalOpen, setDeleteReportModalOpen] = useState(false);
  const [reportID, setReportID] = useState({ awsID: "", userID: "" });


  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
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

  useEffect(() => {
    getAwsData();
  }, [processDataResponse]);

  const getAwsData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_DOC_LIST_FROM_AWS, {
        userid: id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.aws_list) {
        setList(response.data.aws_list)
      }
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const toggleLoadingState = (index, isLoading) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [index]: isLoading,
    }));
  };
  const downLoadDocument = async (isKeyId, isBucketName, index) => {
    toggleLoadingState(index, true);
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
      toggleLoadingState(index, false);
    } catch (error) {
      toggleLoadingState(index, false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };
  const readHtmlFile = async (isKeyId, isBucketName, DataId) => {
    setisLoader(true)
    try {
      const response = await axios.post(READ_HTML_RESPONSE, {
        Key: isKeyId,
        Bucket: isBucketName,
      },
        { headers: { "Authorization": "Bearer " + token } });
      checkdata(response.data, isKeyId, isBucketName, DataId)
      userActivity("Generate Audit", "", "", "success", "Generate Audit");
    } catch (error) {
      setisLoader(false)
      toast.error(error.response.data.message || "Something went Wrong");
      userActivity("Generate Audit, Failed!", "", "", "failed", "Generate Audit");
    }
  };

  const checkdata = async (jsonDataResponse, isKeyId, isBucketName, DataId) => {
    // console.log(jsonDataResponse,"jsonDataResponsejsonDataResponsejsonDataResponse")
    try {
      const response = await axios.post(CHECK_HTML_RESPONSE, {
        data: jsonDataResponse,
        key: isKeyId,
        bucket: isBucketName,
        DataId: DataId
      },
        { headers: { "Authorization": "Bearer " + token } });
      setprocessDataResponse(response.data);
      setisLoader(false)
      if (response.data) {
        console.log(response.data, "response.dataresponse.dataresponse.data")
        //   setSearchModalOpen(true)
        setisLoaderSuccess(true)
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(list.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post(
  //       'https://api.openai.com/v1/engines/text-davinci-003/completions',
  //       {
  //         prompt: input,
  //         max_tokens: 50, // You can adjust the response length
  //         model: "ft:gpt-3.5-turbo-0613:consumer-law-secrets-11c:cl-expert:835hpGLj",
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     setOutput(response.data.choices[0].text);
  //   } catch (error) {
  //     console.error(error);
  //     // Handle error as needed
  //   }
  // };



  // const openai = new OpenAIApi(configuration);
  // const [prompt, setPrompt] = useState("");
  // const [apiResponse, setApiResponse] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const result = await openai.createCompletion({
  //       model: "ft:gpt-3.5-turbo-0613:consumer-law-secrets-11c:cl-expert:835hpGLj",
  //       prompt: prompt,
  //       temperature: 0.5,
  //       max_tokens: 4000,
  //     });
  //     //console.log("response", result.data.choices[0].text);
  //     setApiResponse(result.data.choices[0].text);
  //   } catch (e) {
  //     //console.log(e);
  //     setApiResponse("Something is going wrong, Please try again.");
  //   }
  //   setLoading(false);
  // };

  const [messages, setMessages] = useState([
    {
      message: "Hello Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo-0613",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OpenAIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  const deleteCreditReport = async (id, userID) => {
    try {
      const response = await axios.post(DELETE_DOC_FROM_AWS, {
        awsID: id,
        user_id: userID
      },
        { headers: { "Authorization": "Bearer " + token } });
      setDeleteReportModalOpen(false);
      toast.success(response.data.message || "Credit Report deleted successfully");
      getAwsData();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  }

  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <div className="bg-white  dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 relative rounded-2xl">
        <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
          <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
        </header>
        <div>
          {/* 
          <div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter a prompt"
            />
            <button onClick={handleSubmit}>Generate Response</button>
            <div>
              <p>Output:</p>
              <p>{output}</p>
            </div>
          </div> */}
          {/* <div className="App">
            <div style={{ position: "relative", height: "800px", width: "700px" }}>
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                  >
                    {messages.map((message, i) => {
                      console.log(message)
                      return <Message key={i} model={message} />
                    })}
                  </MessageList>
                  <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />
                </ChatContainer>
              </MainContainer>
            </div>
          </div> */}

          {/* Table */}
          <div className="overflow-x-auto p-4">

            <div className='shownav'>
              <table className="table-auto w-full dark:text-slate-300 ">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-slate-500 bg-gray-100 dark:text-slate-400 dark:bg-slate-900/20  dark:border-slate-700">
                  <tr className=''>
                    {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">S.no</div>
                    </th> */}
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                      <div className="font-semibold text-left">Uploaded Date And Time </div>
                    </th>
                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-left">Action</div>
                    </th>
                    <th className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${user.role == "client" ? 'rounded-r-lg' : ''}`}>
                      <div className="font-semibold text-left"></div>
                    </th>
                    {user.role != "client" &&
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                        <div className="font-semibold text-left">Delete</div>
                      </th>
                    }
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                  {currentItems.map((data, index) => {
                    return (
                      <tr key={index}>
                        {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div>{index + 1 + (currentPage - 1) * itemsPerPage}</div>
                        </td> */}
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>{moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                          <div className="space-x-1">
                            {loadingStates[index]
                              ?
                              <button className="ms-2 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full" disabled>
                                <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                  <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                </svg>
                              </button>
                              :
                              <>
                                {data.process_data_object ?
                                  <>
                                    <Link
                                      to={`/response-pdf/${data.user_id}?did=${data._id}`}
                                      className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                                      onClick={() => userActivity("View", "", "", "", "View Report")}
                                    >
                                      {/* <span className="sr-only">Download</span>
                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                <path d="M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z" />
                              </svg> */}
                                      View Report
                                    </Link>
                                  </> :
                                  "-"
                                }
                              </>
                            }

                            {/* <Link to="/read-data"></Link> */}
                          </div>
                        </td>
                        {user.role != "client" &&
                          <>
                            {index === 0 ?
                              <>
                                <td className='flex px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ' >
                                  {data?.process_data_object ? "" :
                                    <>
                                      {/* <img src={aduit_img} width={30}></img> */}
                                      <button
                                        onClick={() => readHtmlFile(data.Key, data.Bucket, data._id)}
                                        className="btn-sm  inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full  tm-background text-white shadow-sm me-3"
                                      >
                                        Generate Audit
                                      </button>
                                    </>
                                  }

                                  {data.process_data_object ?
                                    <>
                                      {/* <img src={dispute_img} width={20}></img> */}
                                      <Link
                                        to={`/inquiry/${id}/${data._id}`}
                                        className="btn-sm  inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full  tm-background text-white shadow-sm me-3"
                                      >
                                        Start Dispute
                                      </Link>
                                    </>
                                    :
                                    ""
                                  }
                                </td>
                              </>
                              :
                              <td className='flex px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ' >

                              </td>
                            }
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <button className="text-rose-500 hover:text-rose-600 rounded-full"
                                  onClick={(e) => { e.stopPropagation(); setDeleteReportModalOpen(true); setReportID({ awsID: data?._id, userID: data?.user_id }) }}
                                >
                                  <span className="sr-only">Delete</span>
                                  <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                    <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                    <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </>

                        }
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ModalBasic id="feedback-modal" modalOpen={deleteReportModalOpen} setModalOpen={setDeleteReportModalOpen} title="Delete Credit Report">
              <div>
                <div className="my-5 text-center">
                  <div className=''>
                    <label className="block text-sm font-medium mb-1" htmlFor="default">
                      Are you sure you want to delete credit report
                    </label>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap justify-end space-x-2">
                    <button type="button" className="btn-sm rounded-full border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 px-5 mr-2" onClick={(e) => { e.stopPropagation(); setDeleteReportModalOpen(false); }}>No</button>
                    <button
                      className="btn tm-background text-white"
                      onClick={() => deleteCreditReport(reportID?.awsID, reportID?.userID)}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </ModalBasic>

            <div className='hidenav'>
              <table className="table-auto w-full dark:text-slate-300">
                <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                  {currentItems.map((data, index) => {
                    return (
                      <div key={index}>
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Uploaded Date And Time </div>
                          </th>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>{moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Action</div>
                          </th>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                            <div className="space-x-1">
                              {loadingStates[index]
                                ?
                                <button className="ms-2 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full" disabled>
                                  <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                  </svg>
                                </button>
                                :
                                <>
                                  {data.process_data_object ?
                                    <>
                                      <Link
                                        to={`/response-pdf/${data.user_id}?did=${data._id}`}
                                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                                        onClick={() => userActivity("View", "", "", "", "View Report")}
                                      >
                                        {/* <span className="sr-only">Download</span>
                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                <path d="M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z" />
                              </svg> */}
                                        View Report
                                      </Link>
                                    </> :
                                    "-"
                                  }
                                </>
                              }

                              {/* <Link to="/read-data"></Link> */}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left"></div>
                          </th>
                          {index === 0 ?
                            <td className='flex px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ' >
                              {data?.process_data_object ? "" :
                                <>
                                  <button
                                    onClick={() => readHtmlFile(data.Key, data.Bucket, data._id)}
                                    className="btn-sm  inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full  tm-background text-white shadow-sm me-3"
                                  >
                                    Generate Audit
                                  </button>
                                </>
                              }
                              {data.process_data_object ?
                                <>
                                  <Link
                                    to={`/inquiry/${id}/${data._id}`}
                                    className="btn-sm  inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full  tm-background text-white shadow-sm me-3"
                                  >
                                    Start Dispute
                                  </Link>
                                </>
                                :
                                ""
                              }
                            </td>
                            :
                            <td className='flex px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ' >

                            </td>
                          }
                        </tr>
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Delete </div>
                          </th>
                          <td className="px-2 first:pl-5 last:pr-5 py-3  whitespace-nowrap">
                            {/* <div>{index + 1 + (currentPage - 1) * itemsPerPage}</div> */}
                            <div className="flex items-center">
                              <button className="text-rose-500 hover:text-rose-600 rounded-full"
                                onClick={(e) => { e.stopPropagation(); setDeleteReportModalOpen(true); setReportID({ awsID: data?._id, userID: data?.user_id }) }}
                              >
                                <span className="sr-only">Delete</span>
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                  <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                  <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </div>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Showing <span className="font-medium text-slate-600 dark:text-slate-300">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium text-slate-600 dark:text-slate-300">{Math.min(indexOfLastItem, list.length)}</span> of{' '}
            <span className="font-medium text-slate-600 dark:text-slate-300">{list.length}</span> results
          </div>
          <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
            <ul className="flex justify-center">
              <li className="ml-3 first:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 ${currentPage === 1 ? 'pointer-events-none' : 'tm-color'
                    }`}
                >
                  &lt;- Previous Page
                </button>
              </li>
              <li className="ml-3 first:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 ${currentPage === Math.ceil(list.length / itemsPerPage) ? 'pointer-events-none ' : 'tm-color'
                    }`}
                >
                  Next Page -&gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="m-1.5">
        {/* Start */}
        {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="quick-find-modal" onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}>Quick Find</button> */}
        <ModalSearch id="quick-find-modal" searchId="quick-find" processDataResponse={processDataResponse} modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
        {/* End */}
      </div>
      {isLoader &&
        <div className="progress-loader-container ">
          <div className="progress-loadera mt-3">
            <h1 className='font-extrabold	 text-2xl	'>
              Generating Audit Report
            </h1>
            <div className="progress-loader mt-3">
            </div>
          </div>
        </div>
      }

      {isLoaderSuccess &&
        <div className="progress-loader-container ">
          <div className="progress-loadera mt-3">
            <h1 className='font-extrabold	 text-2xl'>
              Audit Report Generated Successfully
            </h1>
            <div className="progress-loader-success  mt-3">
            </div>
            <div className='text-center'>
              <button className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                onClick={(e) => { e.stopPropagation(); setisLoaderSuccess(false); }}
              >
                Close
              </button>

              <Link
                to={`/inquiry/${id}/${processDataResponse?.DataId}`}
                className="py-2 px-5 rounded-3xl tm-background text-white me-3"
              >
                Next
              </Link>
            </div>

          </div>
        </div>
      }
    </>

  );
}

export default CreditTable;