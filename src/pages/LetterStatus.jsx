import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_DOC_LIST_FROM_AWS, GET_DOC_FROM_AWS, READ_HTML_RESPONSE, CHECK_HTML_RESPONSE, GET_DATA_OF_USER_CLIENT } from "../API/api"
import moment from 'moment'
import { useNavigate, useParams } from "react-router-dom";
import ModalSearch from '../components/ModalSearch';
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
import Header from '../partials/Header';
import { OpenAIKey } from '../Config';

function CreditTable() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const userToken = Cookies.get("user_token");
    if (userToken) {
      const userData = JSON.parse(userToken);
      if (userData.user._id) {
        setuserID(userData.user._id);
        getAwsData(userData.user._id);
      }
    }
  }, [processDataResponse]);
  
  const getAwsData = async (Id) => {
    try {
      const response = await axios.post(GET_DOC_LIST_FROM_AWS, {
        userid: Id
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.aws_list) {
        setList(response.data.aws_list)
      }
    } catch (error) {
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
  const readHtmlFile = async (isKeyId, isBucketName) => {
    setisLoader(true)
    try {
      const response = await axios.post(READ_HTML_RESPONSE, {
        Key: isKeyId,
        Bucket: isBucketName,
      },
        { headers: { "Authorization": "Bearer " + token } });
      checkdata(response.data, isKeyId, isBucketName)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const checkdata = async (jsonDataResponse, isKeyId, isBucketName) => {
    try {
      const response = await axios.post(CHECK_HTML_RESPONSE, {
        data: jsonDataResponse,
        key: isKeyId,
        bucket: isBucketName
      },
        { headers: { "Authorization": "Bearer " + token } });
      setprocessDataResponse(response.data);
      setisLoader(false)
      if (response.data) {
        setSearchModalOpen(true)
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
  //     const apiKey = ''; // Replace with your OpenAI API key
  //     const response = await axios.post(
  //       'https://api.openai.com/v1/engines/text-davinci-003/completions',
  //       {
  //         prompt: input,
  //         max_tokens: 50, // You can adjust the response length
  //         model: "ft:gpt-3.5-turbo-0613:consumer-law-secrets-11c:cl-expert:835hpGLj",
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${apiKey}`,
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

  // const configuration = new Configuration({
  //   apiKey: "sk-",
  // });

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

  return (
    <>

      <div className="flex h-[100dvh] overflow-hidden">

        {/* Sidebar */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-5">

                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Credit Report List </h1>
                </div>

                {/* Right: Actions */}
                {/* Search form */}
                {/* Create invoice button */}
                {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="hidden xs:block ml-2">Create Invoice</span>
          </button>
        </div> */}

              </div>

              {/* More actions */}
              {/* <div className="sm:flex sm:justify-between sm:items-center mb-5"> */}

              {/* Left side */}
              {/* <div className="mb-4 sm:mb-0">
          <ul className="flex flex-wrap -m-1">
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out">All <span className="ml-1 text-indigo-200">67</span></button>
            </li>
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Paid <span className="ml-1 text-slate-400 dark:text-slate-500">14</span></button>
            </li>
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Due <span className="ml-1 text-slate-400 dark:text-slate-500">34</span></button>
            </li>
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Overdue <span className="ml-1 text-slate-400 dark:text-slate-500">19</span></button>
            </li>
          </ul>
        </div> */}

              {/* Right side */}
              {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"> */}
              {/* Delete button */}
              {/* <DeleteButton selectedItems={selectedItems} /> */}
              {/* Dropdown */}
              {/* <DateSelect /> */}
              {/* Filter button */}
              {/* <FilterButton align="right" />
        </div> */}

              {/* </div>   */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-4">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST <span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2>
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
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full dark:text-slate-300">
                      {/* Table header */}
                      <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">S.no</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Uploaded Date And Time </div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Action</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left"></div>
                          </th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {currentItems.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div>{index + 1 + (currentPage - 1) * itemsPerPage}</div>
                              </td>
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
                                    <button
                                      onClick={() => downLoadDocument(data.Key, data.Bucket, index)}
                                      className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                                    >
                                      <span className="sr-only">Download</span>
                                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                        <path d="M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z" />
                                      </svg>
                                    </button>
                                  }



                                  {/* <Link to="/read-data"></Link> */}
                                </div>
                              </td>
                              <td>
                                <button
                                  onClick={() => readHtmlFile(data.Key, data.Bucket)}
                                  className="m text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                                >
                                  Generate audit
                                </button>
                                {data.process_data_object &&
                                  <Link
                                    to={`/inquiry/${data._id}`}
                                    className="ms-4 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
                                  >
                                    Tag Report
                                  </Link>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                          &lt;- Previous
                        </button>
                      </li>
                      <li className="ml-3 first:ml-0">
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={`btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 ${currentPage === Math.ceil(list.length / itemsPerPage) ? 'pointer-events-none ' : 'tm-color'
                            }`}
                        >
                          Next -&gt;
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
                    <h1 className='font-extrabold	 text-2xl	' style={{ paddingBottom: "50px" }}>
                      Generating Audit Report
                    </h1>
                    <div className="progress-loader mt-3">
                    </div>
                  </div>
                </div>

              }
            </div>
          </main>

        </div>

      </div>

    </>

  );
}

export default CreditTable;
