import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_ALL_LEAD_DATA, INVITE_CLIENT_BY_EMAIL, GET_AGENTS_AND_AGENCY_AGENT, UPLOAD_LEAD_CSV_FILE, DELETE_LEAD, GET_DOC_FROM_AWS, GET_AFFILIATE_DATA, ADD_LEAD_DATA, UPDATE_LEAD_DATA, EDIT_LEAD_DETAILS, GET_USER_DETAILS } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import ModalBlank from '../components/ModalBlank';
import { WithContext as ReactTags } from 'react-tag-input';
import video_icon from "../images/video-icon.png";
import DashboardSidebar from '../partials/DashboardSidebar';
import AgencyHeader from '../partials/AgencyHeader'
import SubNavbar from '../components/SubNavbar'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner'

function LeadsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isLeadData, setIsLeadData] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false);
  const [setLoader, setsetLoader] = useState(false);
  const [UserData, setUserData] = useState("");
  const [isAffiliateData, setIsAffiliateData] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [agentData, setAgentData] = useState(null)
  const [leadsVideoModalOpen, setLeadsVideoModalOpen] = useState(false);


  const [editFormData, setEditFormData] = useState({
    id: '',
    userTableId: '',
    name: '',
    email: '',
    phone: '',
    status: '',
    assigned_to: []
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    assigned_to: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ADD_LEAD_DATA, { formData },
        { headers: { "Authorization": "Bearer " + token } });
      setFeedbackModalOpen(false);
      toast.success(response.data.message || "Lead added successfully");
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: '',
        assigned_to: []

      });
      getLeadData();
    } catch (error) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: '',
        assigned_to: []

      });
      setFeedbackModalOpen(false);
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };


  const getLeadData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_ALL_LEAD_DATA, {},
        { headers: { "Authorization": "Bearer " + token } });
      setIsLeadData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const getAffiliateData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_AFFILIATE_DATA, {},
        { headers: { "Authorization": "Bearer " + token } });
      setIsAffiliateData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const deleteLeadData = async (id) => {
    try {
      const response = await axios.post(DELETE_LEAD, {
        leadId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "lead deleted successfully");
      getLeadData()
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const editLeadDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_LEAD_DETAILS, {
        leadId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.LeadData) {
        setEditFormData({
          id: response?.data?.LeadData._id,
          name: response?.data?.LeadData.name,
          email: response?.data?.LeadData.email,
          phone: response?.data?.LeadData.phone,
          status: response?.data?.LeadData.status,
        });
        if (response?.data?.LeadData?.assigned_to?.length > 0) {
          setTagsEdit(response?.data?.LeadData?.assigned_to)
        }

        setEditInfoModalOpen(true);
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const sendInvitationOnMail = async (id) => {
    try {
      const response = await axios.post(INVITE_CLIENT_BY_EMAIL, {
        invite_id: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      getLeadData();
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };


  const viewLeadDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_LEAD_DETAILS, {
        leadId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.LeadData) {
        setEditFormData({
          name: response?.data?.LeadData.name,
          email: response?.data?.LeadData.email,
          phone: response?.data?.LeadData.phone,
          status: response?.data?.LeadData.status,
        });
        if (response?.data?.LeadData?.assigned_to?.length > 0) {
          setTagsEdit(response?.data?.LeadData?.assigned_to)
        }

        setViewInfoModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_LEAD_DATA, { editFormData },
        { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Lead updated successfully");
      getLeadData();
      setEditFormData({
        name: '',
        email: '',
        phone: '',
        status: '',
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

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(UPLOAD_LEAD_CSV_FILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + token
        }
      });
      getLeadData();
      toast.success(response.data.message || "Leads Imported Successfully");
      setSuccessModalOpen(false);

      // Reset file input value after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input value to clear the selected file
        getLeadData();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const downLoadDocument = async (isKeyId, isBucketName, index) => {
    try {
      const response = await axios.post(GET_DOC_FROM_AWS, {
        Key: "lead_sample_report.csv",
        Bucket: "consumer-law-documents",
      }, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "Sample.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getAgentsData = async () => {
    try {
      const response = await axios.post(GET_AGENTS_AND_AGENCY_AGENT, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
      setAgentData(response.data);
      let sug = [];
      response?.data?.agency_agent?.map((val) => {
        sug.push({ id: val._id, text: val.name });
      })
      setSuggestions(sug);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };


  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [tagsEdit, setTagsEdit] = useState([]);
  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDeleteEdit = i => {
    setTagsEdit(tagsEdit.filter((tag, index) => index !== i));
  };

  const handleAdditionEdit = tag => {
    setTagsEdit([...tagsEdit, tag]);
  };

  useEffect(() => {
    if (tags.length > 0) {
      setFormData({ ...formData, ['assigned_to']: tags });
    }
  }, [tags]);

  useEffect(() => {
    if (tagsEdit.length > 0) {
      setEditFormData({ ...editFormData, ['assigned_to']: tagsEdit });
    }
  }, [tagsEdit]);

  useEffect(() => {
    getLeadData();
    getUserData();
    getAffiliateData();
    getAgentsData();
  }, []);

  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* <div className="flex h-[100dvh] overflow-hidden px-8 bg-white"> */}
      {/* <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* <AgencyHeader /> */}


        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }
        <main className="grow">
          {(user?.role === "agent" || user?.role === "agency_agent") && !(user?.plan_name === "1" || user?.plan_name === "5") ?
            <SubNavbar />
            :
            ""
          }

          {/* <div className='py-8 mx-4 sm:mx-8 border-b border-[#DDE0E3]'>
            <div className='text-3xl'><span className='font-bold'>Leads{" "}</span></div>
            <div className='py-4'>
              <WelcomeBanner />
            </div>
          </div> */}
          <div className="py-8 mx-4 sm:mx-8">
            <div className="sm:flex sm:justify-between sm:items-center border-b pb-2 mb-4">
              <div className="mb-4 sm:mb-0 flex" >
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Leads</h1>
                {/* <button className="text-rose-500 hover:text-rose-600 rounded-full flex items-center"
                  // onClick={(e) => { e.stopPropagation(); setDeleteReportModalOpen(true); setReportID(data?._id) }}
                  onClick={(e) => { e.stopPropagation(); setLeadsVideoModalOpen(true); }}
                >
                  <img width={30} style={{ height: "30px" }} src={video_icon}></img>
                  <span style={{ color: "blue" }}>Video Adding Clients and Leads</span>
                </button> */}
                {/* <img width={35} src={head_logo}></img> */}
              </div>
              <ModalBasic id="feedback-modal" modalOpen={leadsVideoModalOpen} setModalOpen={setLeadsVideoModalOpen} title="Adding Clients and Leads">
                <div style={{ height: "500px" }}>
                  <div className="my-5 text-center">
                    <iframe
                      src="https://www.youtube.com/embed/ulcOV4XnXX0"
                      className="w-full h-full"
                      style={{ height: "500px" }}
                      frameBorder="0"
                      allowFullScreen
                      uk-responsive
                      uk-video="automute: true"
                    ></iframe>
                  </div>
                </div>
              </ModalBasic>
              <div className="flex flex-row flex-wrap ">
                <div className='w-1/2 sm:w-auto p-1'>
                  <div className='flex flex-col'>
                    <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={downLoadDocument}>Download Sample CSV</button>
                  </div>
                </div>
                <div className='w-1/2 sm:w-auto p-1'>
                  <div className='flex flex-col'>
                    <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}>Import CSV</button>
                  </div>
                </div>
                <div className='w-1/2 sm:w-auto p-1'>
                  <div className='flex flex-col'>
                    <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>Add New Lead</button>
                  </div>
                </div>
              </div>

            </div>
            <div className='shownav'>
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                  <h2 className="font-semibold text-slate-100 dark:text-slate-100">Lead List</h2>
                </header>
                <div>
                  <div className="grow px-5">
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isLeadData ? isLeadData?.length : 0}</span> </p>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                          <tr>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                              <div className="font-semibold text-left">Name</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                              <div className="font-semibold text-left">Email</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Added</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Status</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                              <div className="font-semibold text-left">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                          {isLeadData && isLeadData?.map((data, index) => {
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
                                  {data?.status ? data?.status : "-"}
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize items-center	">
                                  <div className='flex items-end	'>
                                    <button
                                      onClick={(e) => { viewLeadDetails(data?._id) }}
                                      className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                      <span className="sr-only">view</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                    </button>
                                    <> <button
                                      onClick={(e) => { editLeadDetails(data?._id) }}
                                      className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                      <span className="sr-only">Edit</span>
                                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                        <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                      </svg>
                                    </button>
                                      <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteLeadData(data?._id)}>
                                        <span className="sr-only">Delete</span>
                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                          <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                          <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                        </svg>
                                      </button>
                                    </>
                                    {data?.is_invited === "1" ?
                                      <span className="ms-3 btn-sm bg-slate-300 text-drak rounded-full" >Invited</span>
                                      :
                                      <button className="ms-3 btn-sm tm-background text-white rounded-full " onClick={() => sendInvitationOnMail(data?._id)}>Send Invite</button>

                                    }
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
                  <h2 className="font-semibold text-slate-100 dark:text-slate-100">Lead List</h2>
                </header>
                <div className="px-5 overflow-x-auto">
                  <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isLeadData ? isLeadData?.length : 0}</span> </p>
                  <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                      {isLeadData && isLeadData?.map((data, index) => {
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
                                      <div className="flex items-end justify-start" >

                                        <button
                                          onClick={(e) => { viewLeadDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">view</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                        </button>
                                        <button
                                          onClick={(e) => { editLeadDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                          </svg>
                                        </button>
                                        <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteLeadData(data?._id)}>
                                          <span className="sr-only">Delete</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                            <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                          </svg>
                                        </button>

                                      </div>

                                      {data?.is_invited === "1" ?
                                        <span className="btn mt-3 bg-slate-300 text-drak rounded-full" >Invited</span>
                                        :
                                        <button className="btn mt-3 tm-background text-white rounded-full px-3 py-2" onClick={() => sendInvitationOnMail(data?._id)}>Send Invite</button>

                                      }
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
      {/* </div> */}
      <div className="m-1.5">
        <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Leads">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
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

                <div>
                  <div className="flex items-center justify-between">
                    <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Status
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <select id="status" name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                      value={formData.status}
                      onChange={handleChange}>
                      <option value="" disabled>Select Status</option>
                      <option value="contact">contact</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Assigned To
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <div className='bg-slate-100 pt-0 pb-1 px-2 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none'>
                      <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        inputFieldPosition="inline"
                        autocomplete
                        delimiters={[]}
                        minQueryLength={0}
                        placeholder={""}
                        required={true}
                        classNames={{
                          tags: 'tagsClass',
                          tagInput: 'tagInputClass',
                          tagInputField: 'tagInputFieldClass',
                          selected: 'selectedClass',
                          tag: 'tagClass',
                          remove: 'removeClass',
                          suggestions: 'suggestionsClass',
                          activeSuggestion: 'activeSuggestionClass',
                          editTagInput: 'editTagInputClass',
                          editTagInputField: 'editTagInputField',
                          clearAll: 'clearAllClass',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn-sm tm-background text-white rounded-full px-3 py-2">Add Lead</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Lead">
          <form onSubmit={handleEditSubmit}>
            <div>
              <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
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
                <div>
                  <div className="flex items-center justify-between">
                    <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Status
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <select id="status" name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                      value={editFormData.status}
                      onChange={handleEditChange}>
                      <option value="" disabled>Select Status</option>
                      <option value="client">Client</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Assigned To
                  </label>
                  <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <div className='bg-slate-100 pt-0 pb-1 px-2 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none'>
                      <ReactTags
                        tags={tagsEdit}
                        suggestions={suggestions}
                        handleDelete={handleDeleteEdit}
                        handleAddition={handleAdditionEdit}
                        inputFieldPosition="bottom"
                        autocomplete
                        delimiters={[]}
                        minQueryLength={0}
                        placeholder={""}
                        classNames={{
                          tags: 'tagsClass',
                          tagInput: 'tagInputClass',
                          tagInputField: 'tagInputFieldClass',
                          selected: 'selectedClass',
                          tag: 'tagClass',
                          remove: 'removeClass',
                          suggestions: 'suggestionsClass',
                          activeSuggestion: 'activeSuggestionClass',
                          editTagInput: 'editTagInputClass',
                          editTagInputField: 'editTagInputField',
                          clearAll: 'clearAllClass',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn-sm tm-background text-white rounded-full px-3 py-2">Update Lead</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Lead ">
          <div>
            <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Full Name
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='name'
                    value={editFormData.name}
                  />
                </div>
              </div>

              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Email
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="email" disabled name='email'
                    value={editFormData.email}
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
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                    Status
                  </label>
                </div>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='phone'
                    value={editFormData.status}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                    Assigned to
                  </label>
                </div>
                {tagsEdit && tagsEdit.map((data, index) => {
                  return (
                    <React.Fragment key={index}>
                      {data?.text}
                      {index < tagsEdit.length - 1 && " , "}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap justify-end space-x-2">
                {/* <button className="btn-sm tm-background text-white">Save</button> */}
              </div>
            </div>
          </div>
        </ModalBasic>

        <ModalBlank id="success-modal" modalOpen={successModalOpen} setModalOpen={setSuccessModalOpen}>
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-slate-800 dark:text-slate-100"></div>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(false); }}>
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="pt-2 mt-2 mb-5 pb-5 ps-2 pe-2 text-center">
            <div>
              <div className=" text-center">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Import Clients From CSV File</div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-4">
                <div className="space-y-2">
                  <p>Choose a CSV file to import your Leads.</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-center space-x-2">
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                  <input
                    type="file"
                    className='form-contorl form-input w-full p-3 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none'
                    onChange={handleFileUpload}
                    ref={fileInputRef} // Assign the ref to the file input
                  />
                </div>
                {/* <input type="file" className='form-contorl btn  mb-4' style={{ border: "1px solid" }} onChange={handleFileUpload} /> */}
                <button className="tm-background py-2 cursor-pointer mt-3 md:w-1/3 px-8 rounded-full text-white" onClick={handleUpload}>Upload CSV</button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
      {/* <Footer></Footer> */}
    </>

  );
}

export default LeadsPage;
