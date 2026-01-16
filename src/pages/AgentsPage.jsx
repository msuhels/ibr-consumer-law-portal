import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_AGENT_DATA, UPLOAD_CSV_FILE, RESEND_LOGIN_DETAILS_TO_AGENT_BY_MAIL, DELETE_AGENT, GET_DOC_FROM_AWS, GET_AFFILIATE_DATA, ADD_AGENT_DATA, UPDATE_AGENT_DATA, EDIT_AGENT_DETAILS, GET_USER_DETAILS } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import ModalBlank from '../components/ModalBlank';
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'


function AgentsPage() {
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isAgentData, setIsAgentData] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [setLoader, setsetLoader] = useState(false);
  const [UserData, setUserData] = useState("");
  const [editFormData, setEditFormData] = useState({ id: '', userTableId: '', name: '', email: '', dob: '', address: '', city: '', state: '', zip: '', country: 'US', phone: '', });
  let field = { name: '', email: '', dob: '', address: '', city: '', state: '', zip: '', country: 'US', phone: '', };
  const [formData, setFormData] = useState(field);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value, });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ADD_AGENT_DATA, { formData }, { headers: { "Authorization": "Bearer " + token } });
      getAgentData();
      setFeedbackModalOpen(false);
      toast.success(response.data.message);
      setFormData(field);
      getAgentData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  const getAgentData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_AGENT_DATA, {}, { headers: { "Authorization": "Bearer " + token } });
      setIsAgentData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getUserData = async () => {
    try {
      let URL = GET_USER_DETAILS(user?._id);
      const response = await axios.get(URL, { headers: { "Authorization": "Bearer " + token } });
      setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const getAffiliateData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_AFFILIATE_DATA, {}, { headers: { "Authorization": "Bearer " + token } });
      setIsAffiliateData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const deleteAgentData = async (id) => {
    try {
      const response = await axios.post(DELETE_AGENT, { agentId: id, }, { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Agent deleted successfully");
      getAgentData()
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const editAgentDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_AGENT_DETAILS, { agent_id: id, }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.agentData) {
        setEditFormData({
          id: response?.data?.agentData._id,
          userTableId: response?.data?.agentData.user_table_id,
          name: response?.data?.agentData.name,
          email: response?.data?.agentData.email,
          dob: response?.data?.agentData.dob,
          address: response?.data?.agentData.address,
          city: response?.data?.agentData.city,
          state: response?.data?.agentData.state,
          zip: response?.data?.agentData.zip,
          country: 'US',
          phone: response?.data?.agentData.phone,
        });
        setEditInfoModalOpen(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  const viewAgentDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_AGENT_DETAILS, { agent_id: id }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.agentData) {
        setEditFormData({
          name: response?.data?.agentData.name,
          email: response?.data?.agentData.email,
          dob: response?.data?.agentData.dob,
          address: response?.data?.agentData.address,
          city: response?.data?.agentData.city,
          state: response?.data?.agentData.state,
          zip: response?.data?.agentData.zip,
          country: 'US',
          phone: response?.data?.agentData.phone,
        });
        setViewInfoModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_AGENT_DATA, { editFormData }, { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Agent updated successfully");
      getAgentData();
      setEditFormData(field);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };


  useEffect(() => {
    getAgentData();
    getUserData();
    getAffiliateData();
  }, []);

  const ReSendLoginDetailsByMail = async (val) => {
    try {
      const response = await axios.post(RESEND_LOGIN_DETAILS_TO_AGENT_BY_MAIL, {
        UserId: val,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success("success");

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
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex h-[100dvh] overflow-hidden bg-white">
        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="py-8 mx-4 sm:mx-8">
              <div className="sm:flex sm:justify-between sm:items-center border-b pb-2 mb-4">
                <div className="mb-4 sm:mb-0 flex">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Agents</h1>
                  {/* <img width={35} src={head_logo}></img> */}
                </div>
                <div className="flex flex-row flex-wrap ">
                  <div className='w-1/2 sm:w-auto p-1'>
                    <div className='flex flex-col'>
                      {/* {UserData?.plan_updated_to_enterprise === "true" &&
                    <Link className="btn tm-background text-white" to={`/dashboard/${user._id}`}>
                      View My Report
                    </Link>
                  } */}
                      <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>Add New Agent </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shownav'>
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div>
                    <div className="grow px-5">
                      <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isAgentData ? isAgentData?.length : 0}</span> </p>
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
                          <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                            <tr>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                                <div className="font-semibold text-left">Name</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Email</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Added</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                                <div className="font-semibold text-left">Actions</div>
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                            {isAgentData.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize font-bold tm-color">
                                    {/* <Link to={`/dashboard/${data?.user_table_id}`}> */}
                                    {data?.name ? data?.name : "-"}
                                    {/* </Link> */}
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    {data?.email ? data?.email : "-"}
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    {data?.created_at ? moment(data?.created_at).format('MM/DD/YYYY') : "-"}
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    <div className='flex items-end	'>
                                      <button
                                        onClick={(e) => { viewAgentDetails(data?._id) }}
                                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                        <span className="sr-only">view</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                      </button>
                                      <button
                                        onClick={(e) => { editAgentDetails(data?._id) }}
                                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                        <span className="sr-only">Edit</span>
                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                          <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                        </svg>
                                      </button>
                                      <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteAgentData(data?._id)}>
                                        <span className="sr-only">Delete</span>
                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                          <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                          <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                        </svg>
                                      </button>
                                      <button className="ms-3 btn-sm tm-background text-white rounded-full " onClick={() => ReSendLoginDetailsByMail(data?._id)}>Resend credentials</button>
                                    </div>

                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className='hidenav'>
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div className="px-5 overflow-x-auto">
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isAgentData ? isAgentData?.length : 0}</span> </p>
                    <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {isAgentData.map((data, index) => {
                          return (
                            <>
                              <div key={index} style={{ paddingBottom: "20px", marginTop: "20px" }}>
                                <table className="table-auto w-full dark:text-slate-300">
                                  <tbody className="">
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Name</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <Link to={`/dashboard/${data?.user_table_id}`}>
                                          {data?.name ? data?.name : "-"}
                                        </Link>
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Referred By</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.referred_by_name ? data?.referred_by_name : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Added</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.created_at ? moment(data?.created_at).format('MM/DD/YYYY') : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Start Date</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.start_date ? data?.start_date : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Status</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.status ? data?.status : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Actions</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <button
                                          onClick={(e) => { viewAgentDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">view</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                        </button>
                                        <button
                                          onClick={(e) => { editAgentDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                          </svg>
                                        </button>
                                        <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteAgentData(data?._id)}>
                                          <span className="sr-only">Delete</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                            <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                          </svg>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
      <div className="m-1.5">
        <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Agent ">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Full Name<span className='text-red-500'>*</span>
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='name'
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='Enter fullname here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Email<span className='text-red-500'>*</span>
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="email" required name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Enter email here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Date of Birth
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="date" name='dob'
                      value={formData.dob}
                      onChange={handleChange}
                      placeholder='Enter DOB here'
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    Address
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='address'
                      value={formData.address}
                      onChange={handleChange}
                      placeholder='Enter address here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    City
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='city'
                      value={formData.city}
                      onChange={handleChange}
                      placeholder='Enter city here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    State
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <select
                      name="state"
                      value={formData.state}
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
              </div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Zip
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='zip'
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder='Enter zip here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Country
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='country'
                      value="United States"
                      onChange={handleChange}
                      placeholder='Enter country here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Phone (M)
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='Enter phone number here'
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn tm-background text-white">Save</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Agent ">
          <form onSubmit={handleEditSubmit}>
            <div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Full Name<span className='text-red-500'>*</span>
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='name'
                      value={editFormData.name}
                      onChange={handleEditChange}
                      placeholder='Enter fullname here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Email<span className='text-red-500'>*</span>
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="email" required name='email'
                      value={editFormData.email}
                      onChange={handleEditChange}
                      placeholder='Enter email here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Date of Birth
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="date" name='dob'
                      value={editFormData.dob}
                      onChange={handleEditChange}
                      placeholder='Enter DOB here'
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    Address
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='address'
                      value={editFormData.address}
                      onChange={handleEditChange}
                      placeholder='Enter address here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    City
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='city'
                      value={editFormData.city}
                      onChange={handleEditChange}
                      placeholder='Enter city here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    State
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <select
                      name="state"
                      value={editFormData.state}
                      onChange={handleEditChange}
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
              </div>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Zip
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='zip'
                      value={editFormData.zip}
                      onChange={handleEditChange}
                      placeholder='Enter zip here'
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Country
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='country'
                      value="United States"
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Phone (M)
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='phone'
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      placeholder='Enter phone number here'
                    />
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn tm-background text-white">Save</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Agent ">
          <div>
            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Full Name<span className='text-red-500'>*</span>
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='name'
                    value={editFormData.name}
                    placeholder='Fullname'
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Email<span className='text-red-500'>*</span>
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="email" disabled name='email'
                    value={editFormData.email}
                    placeholder='Email'
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Date of Birth
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='dob'
                    value={editFormData.dob}
                    placeholder='DOB'
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                  Address
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='address'
                    value={editFormData.address}
                    placeholder='Address'
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                  City
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" name='city'
                    value={editFormData.city}
                    placeholder='City'
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  State
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" name='state'
                    value={editFormData.state}
                    placeholder='State'
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                    Zip
                  </label>
                </div>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='zip'
                    value={editFormData.zip}
                    placeholder='Zip'
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Country
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='country'
                    value="United States"
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Phone (M)
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='phone'
                    value={editFormData.phone}
                    placeholder='Phone'
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBasic>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}

export default AgentsPage;
