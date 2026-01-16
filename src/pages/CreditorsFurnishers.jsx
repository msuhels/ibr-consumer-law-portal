import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_CREDITORS_FURNISHERS_DATA, DELETE_CREDITORS_FURNISHERS, ADD_CREDITORS_FURNISHERS_DATA, EDIT_CREDITORS_FURNISHERS_DATA, UPDATE_CREDITORS_FURNISHERS_DATA } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic-sm';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import DashboardSidebar from '../partials/DashboardSidebar';
import DropdownEditMenu from '../components/DropdownEditMenu';
import SubNavbar from '../components/SubNavbar'

function CreditorsFurnishers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isCreditorsFurnishers, setCreditorsFurnishers] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [setLoader, setsetLoader] = useState(false);


  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    account_type: '',
    notes: '',
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    company_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    account_type: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ADD_CREDITORS_FURNISHERS_DATA, { formData },
        { headers: { "Authorization": "Bearer " + token } });
      setFeedbackModalOpen(false);
      toast.success(response.data.message || "Creditors/Furnishers added successfully");
      getCreditorsFurnishersData();
      setFormData({
        company_name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        account_type: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  useEffect(() => {
    getCreditorsFurnishersData();
  }, []);

  const getCreditorsFurnishersData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_CREDITORS_FURNISHERS_DATA, {
        userid: user._id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      setsetLoader(false);
      setCreditorsFurnishers(response.data)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      setsetLoader(false);
    }
  };

  const deleteCreditorsFurnishers = async (id) => {
    try {
      const response = await axios.post(DELETE_CREDITORS_FURNISHERS, {
        creditorId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Creditors/Furnishers deleted successfully");
      getCreditorsFurnishersData()
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const editCreditorsFurnishers = async (id) => {
    try {
      const response = await axios.post(EDIT_CREDITORS_FURNISHERS_DATA, {
        creditorId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data) {
        setEditFormData({
          id: response.data.creditorData._id,
          company_name: response.data.creditorData.company_name,
          address: response.data.creditorData.address,
          city: response.data.creditorData.city,
          state: response.data.creditorData.state,
          zip_code: response.data.creditorData.zip_code,
          phone: response.data.creditorData.phone,
          account_type: response.data.creditorData.account_type,
          notes: response.data.creditorData.notes,
        });
        setEditInfoModalOpen(true);
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const viewCreditorsFurnishers = async (id) => {
    try {
      const response = await axios.post(EDIT_CREDITORS_FURNISHERS_DATA, {
        creditorId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data) {
        setEditFormData({
          id: response.data.creditorData._id,
          company_name: response.data.creditorData.company_name,
          address: response.data.creditorData.address,
          city: response.data.creditorData.city,
          state: response.data.creditorData.state,
          zip_code: response.data.creditorData.zip_code,
          phone: response.data.creditorData.phone,
          account_type: response.data.creditorData.account_type,
          notes: response.data.creditorData.notes,
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
      const response = await axios.post(UPDATE_CREDITORS_FURNISHERS_DATA, { editFormData },
        { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Creditors/Furnishers updated successfully");
      getCreditorsFurnishersData();
      setEditFormData({
        company_name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        account_type: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
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

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow bg-white dark:bg-[#FFFFFF]">
            <div className="py-8 mx-4 sm:mx-8">
              <div className="sm:flex sm:justify-between sm:items-center border-b pb-2 mb-4">
                <div className="mb-4 sm:mb-0 flex" >
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Creditors/Furnishers</h1>
                  {/* <img width={35} h src={head_logo}></img> */}
                </div>
                <div className="flex flex-row flex-wrap ">
                  <div className='w-1/2 sm:w-auto p-1'>
                    <div className=''>
                      <button className="btn-sm tm-background text-white rounded-full py-2" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>
                        <svg className="w-4 h-4 fill-current opacity-80 shrink-0" viewBox="0 0 16 16">
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="ml-2">Create new creditors</span>
                      </button>
                      {/* <button className="btn tm-background text-white" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>Add Creditors/Furnishers </button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='shownav'>
                <div className="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 relative rounded-tr-2xl rounded-tl-2xl">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div className="grow px-5">
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isCreditorsFurnishers ? isCreditorsFurnishers?.length : 0}</span> </p>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-sm text-slate-400 dark:text-slate-500 bg-gray-100 ">
                          <tr>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-tl-lg rounded-bl-lg">
                              <div className="font-semibold text-left text-black">Company</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Address</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Phone</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Account Type</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Notes</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-1 py-3 whitespace-nowrap rounded-tr-lg rounded-br-lg">
                              <div className="font-semibold text-left text-black">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                          {isCreditorsFurnishers.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 text-black whitespace-nowrap">
                                  {data?.company_name}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                  {data?.address ? data?.address : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                  {data?.phone ? data?.phone : "-"}
                                </td>
                                <td className='px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ' >
                                  {data?.account_type ? data?.account_type : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                  {data?.notes ? data?.notes : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-1 py-3 whitespace-nowrap ">
                                  <DropdownEditMenu className="relative inline-flex bg-gray-100 rounded-full">
                                    <li>
                                      <a className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer" onClick={(e) => { viewCreditorsFurnishers(data?._id) }}>View</a>
                                    </li>
                                    <li>
                                      <a className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer" onClick={(e) => { editCreditorsFurnishers(data?._id) }}>Edit</a>
                                    </li>
                                    <li>
                                      <a className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3 cursor-pointer" onClick={() => deleteCreditorsFurnishers(data?._id)}>Delete</a>
                                    </li>
                                  </DropdownEditMenu>
                                  {/* <button
                                    onClick={(e) => { viewCreditorsFurnishers(data?._id) }}
                                    className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                    <span className="sr-only">Edit</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                  </button>
                                  <button
                                    onClick={(e) => { editCreditorsFurnishers(data?._id) }}
                                    className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                    <span className="sr-only">Edit</span>
                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                      <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                    </svg>
                                  </button>
                                  <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteCreditorsFurnishers(data?._id)}>
                                    <span className="sr-only">Delete</span>
                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                      <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                      <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                    </svg>
                                  </button> */}
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

              <div className='hidenav'>
                <div className="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 relative rounded-tr-2xl rounded-tl-2xl">
                  {/* <header className="px-5 py-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST<span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2>
                  </header> */}
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div className="px-5 overflow-x-auto">
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isCreditorsFurnishers ? isCreditorsFurnishers?.length : 0}</span> </p>
                    <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {isCreditorsFurnishers.map((data, index) => {
                          return (
                            <>
                              <div key={index} style={{ paddingBottom: "20px", marginTop: "20px" }}>
                                <table className="table-auto w-full dark:text-slate-300">
                                  <tbody className="">
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Company</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.company_name}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Address</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.address ? data?.address : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Phone</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.phone ? data?.phone : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Account Type</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.account_type ? data?.account_type : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Notes</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.notes ? data?.notes : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Actions</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <button
                                          onClick={(e) => { viewCreditorsFurnishers(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                        </button>
                                        <button
                                          onClick={(e) => { editCreditorsFurnishers(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                          </svg>
                                        </button>
                                        <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteCreditorsFurnishers(data?._id)}>
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
        <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Furnishers">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-2">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Company Name <span className='text-red-500'>*</span>
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='company_name'
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder='Enter Company name here'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                      Phone Number
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='Enter phone number here'
                      />
                    </div>
                  </div>
                </div>

                <div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5">
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                        Address <span className='text-red-500'>*</span>
                      </label>
                    </div>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" required name='address'
                        value={formData.address}
                        onChange={handleChange}
                        placeholder='Enter address here'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      State
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select
                        name="state"
                        autoComplete="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-select w-full rounded-[20px] py-3 px-4 bg-gray-100 text-gray-800 placeholder-gray-800 border-none"
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
                <div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                      City
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='city'
                        value={formData.city}
                        onChange={handleChange}
                        placeholder='Enter city'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                        Zip Code
                      </label>
                    </div>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='zip_code' maxLength={5}
                        value={formData.zip_code}
                        onChange={handleChange}
                        placeholder='Enter code'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Account Type
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                        name='account_type'
                        value={formData.account_type}
                        placeholder='Enter account type'
                        onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-1  ps-5 pe-5 mb-12">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Notes
                    </label>
                    <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <textarea id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                        name='notes'
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder='Enter Fax here'
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-start space-x-2">
                  <input className=" tm-background py-2 cursor-pointer w-1/3 px-8 rounded-full text-white " type="submit" value='Save' />
                  {/* <button className="btn tm-background rounded-full text-white">Save</button> */}
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>
        <ModalBasic id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Furnishers">
          <form onSubmit={handleEditSubmit}>

            <div>
              <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-2">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Company Name <span className='text-red-500'>*</span>
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='company_name'
                        value={editFormData.company_name}
                        onChange={handleEditChange}
                        placeholder='Enter company name here'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                      Phone Number
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='phone'
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        placeholder='Enter phone number here'
                      />
                    </div>
                  </div>
                </div>
                <div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5">
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                        Address <span className='text-red-500'>*</span>
                      </label>
                    </div>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" required name='address'
                        value={editFormData.address}
                        onChange={handleEditChange}
                        placeholder='Enter address here'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      State
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select
                        name="state"
                        autoComplete="state"
                        value={editFormData.state}
                        onChange={handleEditChange}
                        className="form-select w-full rounded-[20px] py-3 px-4 bg-gray-100 text-gray-800 placeholder-gray-800 border-none"
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
                <div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                      City
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='city'
                        value={editFormData.city}
                        onChange={handleEditChange}
                        placeholder='Enter city'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                        Zip Code
                      </label>
                    </div>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='zip_code' maxLength={5}
                        value={editFormData.zip_code}
                        onChange={handleEditChange}
                        placeholder='Enter code'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Account Type
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                        name='account_type'
                        value={editFormData.account_type}
                        placeholder='Enter account type'
                        onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-1  ps-5 pe-5 mb-12">
                <div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Notes
                    </label>
                    <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <textarea id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                        name='notes'
                        value={editFormData.notes}
                        onChange={handleEditChange}
                        rows={5}
                        placeholder='Enter Fax here'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-start space-x-2">
                  <input className=" tm-background py-2 cursor-pointer w-1/3 px-8 rounded-full text-white " type="submit" value='Update' />
                  {/* <button className="btn tm-background rounded-full text-white">Save</button> */}
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>
        <ModalBasic id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Furnishers">
          <div>
            <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-2">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Company Name <span className='text-red-500'>*</span>
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='company_name'
                      value={editFormData.company_name}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    Phone Number
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='phone'
                      value={editFormData.phone}
                    />
                  </div>
                </div>
              </div>

              <div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5">
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Address <span className='text-red-500'>*</span>
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" required name='address'
                      value={editFormData.address}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="default">
                    State
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='state' maxLength={5}
                      value={editFormData.state}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    City
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="mandatory" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='city'
                      value={editFormData.city}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Zip Code
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text" name='zip_code' maxLength={5}
                      value={formData.zip_code} placeholder='Zip Code'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2  ps-5 pe-5 mb-5">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Account Type
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                      name='account_type'
                      value={editFormData.account_type}
                      disabled placeholder='Account type' />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-1  ps-5 pe-5 mb-12">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Notes
                  </label>
                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <textarea id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" type="text"
                      name='notes'
                      value={editFormData.notes}
                      disabled
                      rows={5}
                    />
                  </div>
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

export default CreditorsFurnishers;
