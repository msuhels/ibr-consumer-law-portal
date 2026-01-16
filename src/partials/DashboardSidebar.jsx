import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import SidebarLinkGroup from './SidebarLinkGroup';
import auditIcon from "../images/dashboard_img/audit.png";
import disputeIcon from "../images/dashboard_img/dispute.png";
import genrate_letterIcon from "../images/dashboard_img/genrate_letter.png";
import importIcon from "../images/dashboard_img/import.png";
import sendletterIcon from "../images/dashboard_img/sendletter.png";
import arrowImg from "../images/dashboard_img/arrow.png";
import AffiliateIcon from "../images/dashboard_img/Affiliate.png";
import creatoresfurnishedIcons from "../images/dashboard_img/creatoresfurnished.png";
import LetterLibraryIcons from "../images/dashboard_img/LetterLibrary.png";
import { GET_USER_DETAILS, GET_LATEST_ID_DOC_FROM_AWS, GET_USER_NAME_BY_ID, UPLOAD_IMAGES_ON_AWS, UPLOAD_Signature_ON_AWS } from "../API/api.js";
import Tooltip from '../components/Tooltip';
import axios from 'axios';
import ModalBasic from '../components/ModalBasic';
import { toast } from 'react-toastify';
import Loder from '../partials/Loder';
import SignatureCanvas from 'react-signature-canvas'


function DashboardSidebar({ sidebarOpen, setSidebarOpen }) {
    const fileInputRef = useRef(null); // Create a ref for the file input
    const signatureRef = useRef({});
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const location = useLocation();
    const { pathname } = location;
    const trigger = useRef(null);
    const sidebar = useRef(null);
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');
    const { id } = useParams();
    const [latestDocIdFromAws, setlatestDocIdFromAws] = useState("");
    const [userData, setUserData] = useState("");
    const navigate = useNavigate();
    const [setLoader, setsetLoader] = useState(false);
    const [userName, setUserName] = useState("");
    const firstName = userName.split(' ')[0];
    const [documentInfoModalOpen, setDocumentInfoModalOpen] = useState(false);
    const [clientUserTableId, setClientUserTableId] = useState('');
    const [isButtonLoader, setIsButtonLoader] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [openModal, setOpenModal] = useState(false)
    const colors = ['black', 'green', 'red']
    const [penColor, setPenColor] = useState('black');
    const [userdetails, setUserdetails] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        proof_of_address: "",
        photo_id: "",
        signature: "",
    });


    const clearSignature = () => {
        signatureRef.current.clear();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const showClientDocuments = async (id) => {
        setsetLoader(true);
        setClientUserTableId(id);
        let URL = GET_USER_DETAILS(id);
        try {
            const response = await axios.get(URL,
                {
                    headers: { "Authorization": "Bearer " + token }
                });
            setUserdetails({
                name: response.data.UserDetails.name,
                email: response.data.UserDetails.email,
                address: response.data.UserDetails.address,
                city: response.data.UserDetails.city,
                state: response.data.UserDetails.state,
                zip: response.data.UserDetails.zip,
                phone: response.data.UserDetails.phone,
                proof_of_address: response.data.UserDetails.proof_of_address,
                photo_id: response.data.UserDetails.photo_id,
                signature: response.data.UserDetails.signature,
            });

            setDocumentInfoModalOpen(true);
            setsetLoader(false);

        } catch (error) {
            setsetLoader(false);
            toast.error("Something went Wrong");
        }

    }

    const handleUpload = async (type) => {
        setIsButtonLoader(type);
        try {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
            if (!selectedFile) {
                toast.error("Please select a Document");
                setIsButtonLoader("");
                return;
            }

            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error("Please upload a valid image file (JPEG, PNG, JPG)");
                setIsButtonLoader("");
                return;
            }

            if (selectedFile.size > maxSize) {
                toast.error("Image size exceeds 5MB limit");
                setIsButtonLoader("");
                return;
            }
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('documentType', type);
            formData.append('user_id', clientUserTableId);
            // formData.append('letter_id', selectedItems[0]._id);
            await axios.post(UPLOAD_IMAGES_ON_AWS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + token
                }
            });
            setSelectedDocumentType('');
            setSelectedFile(null);
            // Resetting input fields
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            //   if (documentTypeInputRef.current) {
            //     documentTypeInputRef.current.selectedIndex = 0;
            //   }
            showClientDocuments(clientUserTableId);
            setIsButtonLoader("");
            toast.success("Image uploaded successfully!");
        } catch (error) {
            setIsButtonLoader("");
            toast.error(error.response.data || "Error uploading image!");
            console.error(error);
        }
    };


    const saveSignature = async (type) => {
        setIsButtonLoader(type);
        const canvasData = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
        try {
            // Send the signature to the backend
            const response = await axios.post(UPLOAD_Signature_ON_AWS, { user_id: clientUserTableId, signature: canvasData }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setOpenModal(false);
            showClientDocuments(clientUserTableId);
            setIsButtonLoader("");
            toast.success("Signature uploaded successfully!");
        } catch (error) {
            setIsButtonLoader("");
            toast.error(error || 'Error uploading signature');
        }
    };



    const truncateName = (name) => {
        if (name.length > 7) { // Example: truncate if name is longer than 50 characters
            return name.slice(0, 7) + '..'; // Return first 50 characters and add "..."
        }
        return name; // Return the full name if it's shorter than the limit
    };

    const isButtonActive = (url) => {
        return location.pathname === url ? 'btnn-background text-white' : 'inactive-button-class';
    };

    const getUserData = async () => {
        setsetLoader(true);
        let URL = GET_USER_DETAILS(user?._id);
        try {
            const response = await axios.get(URL, { headers: { "Authorization": "Bearer " + token } });
            setUserData(response?.data);
            setsetLoader(false);
        } catch (error) {
            setsetLoader(false);
            console.log("Something went Wrong");
        }
    };


    const getUserName = async () => {
        try {
            let URL = GET_USER_NAME_BY_ID(id || user?._id);
            const response = await axios.get(URL);
            setUserName(response.data.UserDetails);
        } catch (error) {
            console.log(error.response.data.message || "Something went Wrong");
        }
    };


    const getLatestIdOfAwsData = async () => {

        try {
            const response = await axios.post(GET_LATEST_ID_DOC_FROM_AWS, {
                userid: id
            },
                { headers: { "Authorization": "Bearer " + token } });
            if (response.data?.aws_list) {
                setlatestDocIdFromAws(response.data?.aws_list[0])
            }
        } catch (error) {
            console.log(error?.response?.data?.message || "Something went Wrong");
        }
    };

    const getLatestIdOfAwsDataAndNavigate = async () => {

        try {
            const response = await axios.post(GET_LATEST_ID_DOC_FROM_AWS, {
                userid: id ? id : user._id
            },
                { headers: { "Authorization": "Bearer " + token } });
            if (response.data?.aws_list) {
                setlatestDocIdFromAws(response.data?.aws_list[0])
                navigate(`/inquiry/${id ? id : user._id}/${response.data?.aws_list[0]._id}`)

            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went Wrong");
        }
    };

    useEffect(() => {
        getUserName();
        getUserData();
        getLatestIdOfAwsData()
    }, []);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded);
        if (sidebarExpanded) {
            document.querySelector('body').classList.add('sidebar-expanded');
        } else {
            document.querySelector('body').classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <>
            {setLoader &&
                <div className="loader-container" style={{ zIndex: "9999" }}>
                    <div className="loader"></div>
                </div>
            }
            <div className="min-w-fit hideForphone ">
                <div id="sidebar" ref={sidebar} className={`flex pr-3 flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-[white] dark:bg-slate-800  transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`} style={{ width: '100%' }} >
                    <div className="space-y-4 pb-16 border px-6 border-[#EEEFF1] rounded-xl bg-[#FBFCFC]">
                        <div className="px-3 flex justify-end mt-2">
                            <button onClick={() => { setSidebarExpanded(!sidebarExpanded); }} style={{ marginRight: "-50px" }}>
                                <img src={arrowImg} className={`w-8 ${!sidebarExpanded ? 'rotate-0' : 'rotate-180'}`} />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xs  text-slate-900 font-semibold text-center">
                                <span>  
                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                        <div className='flex flex-col'>
                                            <Link to={`/dashboard/${id ? id : user._id}`} className={`inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/dashboard/${id ? id : user._id}`)}`}>
                                                <svg className="shrink-0 h-6 w-5" viewBox="0 0 24 24">
                                                    <circle className={`fill-current  ? 'text-indigo-300' : 'text-slate-400'}`} cx="18.5" cy="5.5" r="4.5" />
                                                    <circle className={`fill-current  ? 'text-indigo-500' : 'text-slate-600'}`} cx="5.5" cy="5.5" r="4.5" />
                                                    <circle className={`fill-current  ? 'text-indigo-500' : 'text-slate-600'}`} cx="18.5" cy="18.5" r="4.5" />
                                                    <circle className={`fill-current  ? 'text-indigo-300' : 'text-slate-400'}`} cx="5.5" cy="18.5" r="4.5" />
                                                </svg>
                                                {sidebarExpanded ? '' : <span className="ml-2  capitalize text-sm font-semibold">{userName ? truncateName(firstName) : "Client"} Dashboard</span>}
                                            </Link>
                                        </div>
                                    </div>
                                </span>
                            </h3>
                        </div>


                        {!(user.role == "client") &&
                            <>
                                <div>
                                    <h3 className="text-xs  text-slate-900 font-semibold">
                                        <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 1</p>
                                        <span >
                                            <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                <div className='flex flex-col'>
                                                    <Link to={`/credit-report/${id ? id : user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/credit-report/${id ? id : user._id}`)}`}>
                                                        <img className='h-6 w-5' src={importIcon} />
                                                        {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Import Report</span>}
                                                    </Link>
                                                </div>
                                            </div>
                                        </span>
                                    </h3>
                                </div>
                                <div>
                                    <h3 className="text-xs  text-slate-900 font-semibold ">
                                        <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 2</p>
                                        <span>
                                            <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                <div className='flex flex-col'>
                                                    <Link to={`/credit-report-list/${id ? id : user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/credit-report-list/${id ? id : user._id}`)}`}>
                                                        <img className='h-6 w-5' src={auditIcon} />
                                                        {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold"> Audit Wizard</span>}
                                                    </Link>
                                                </div>
                                            </div>
                                        </span>
                                    </h3>
                                </div>

                                {latestDocIdFromAws && latestDocIdFromAws !== "undefined" ?
                                    <>
                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 3
                                                </p>
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <button onClick={() => getLatestIdOfAwsDataAndNavigate()} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/inquiry/${id ? id : user._id}/${latestDocIdFromAws?._id}`)}`}>
                                                                <img className='h-6 w-5' src={disputeIcon} />
                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold"> Dispute</span>}

                                                            </button>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 4</p>
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/dispute/${id ? id : user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/dispute/${id ? id : user._id}`)}`}>
                                                                <img className='h-6 w-5' src={genrate_letterIcon} />
                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold"> Generate Letters</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 5</p>
                                                <span>
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/send-letter/${id ? id : user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/send-letter/${id ? id : user._id}`)}`}>
                                                                <img className='h-6 w-5' src={sendletterIcon} />
                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Send Letter</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                    </>
                                    :
                                    <>

                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 3
                                                </p>
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <div className="relative group">
                                                                <button style={{ width: "100%" }} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5  rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm `}>
                                                                    <img className='mr-2 h-6 w-5' src={disputeIcon} />
                                                                    {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold"> Dispute</span>}
                                                                </button>
                                                                <div className="absolute hidden w-32 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                                    Please complete the previous steps
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 4</p>
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <div className="relative group">
                                                                <button style={{ width: "100%" }} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5  rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm `}>
                                                                    <img className='mr-2 h-6 w-5' src={genrate_letterIcon} />
                                                                    {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold"> Generate Letters</span>}
                                                                </button>
                                                                <div className="absolute hidden w-32 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                                    Please complete the previous steps
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-xs  text-slate-900 font-semibold ">
                                                <p className='text-[17px] text-[#939597] font-bold mb-2 mt-2'>Step 5</p>
                                                <span>
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <div className="relative group">
                                                                <button style={{ width: "100%" }} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5  rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm `}>
                                                                    <img className='mr-2 h-6 w-5' src={sendletterIcon} />
                                                                    {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold">Send Letter</span>}
                                                                </button>
                                                                <div className="absolute hidden w-32 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                                    Please complete the previous steps
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                    </>
                                }
                                <hr />
                            </>
                        }
                        <div>
                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                <span >
                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                        <div className='flex flex-col'>
                                            <Link to={`/letter-generator/${id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/letter-generator/${id}`)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M14 3v4a1 1 0 0 0 1 1h4" /> <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <path d="M9 9l1 0" /> <path d="M9 13l6 0" /> <path d="M9 17l6 0" /> </svg>
                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Letter Library</span>}
                                            </Link>
                                        </div>
                                    </div>
                                </span>
                            </h3>
                        </div>

                        {/* {!(userData?.UserDetails?.plan_name == "1" || userData?.UserDetails?.plan_name == "5") || userData?.UserDetails?.role === "agency_agent" ?
                            <>
                                {user.role !== "client" &&
                                    <div>
                                        <h3 className="text-xs  text-slate-900 font-semibold ">
                                            <span >
                                                <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                    <div className='flex flex-col'>
                                                        <Link to={`/clients`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/clients`)}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
                                                                <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
                                                                <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                                            </svg>
                                                            {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Clients</span>}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </span>
                                        </h3>
                                    </div>
                                }

                                {(userData?.UserDetails?.plan_name === "4" || userData?.UserDetails?.plan_name === "8" || userData?.UserDetails?.plan_name === "3" || userData?.UserDetails?.plan_name === "7") && user.role != 'agency_agent' &&
                                    <div>
                                        <h3 className="text-xs  text-slate-900 font-semibold ">
                                            <span>
                                                <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                    <div className='flex flex-col'>
                                                        <Link to={`/agents`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/agents`)}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                                                                <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                                                                <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                                                            </svg>

                                                            {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Agents</span>}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </span>
                                        </h3>
                                    </div>
                                }

                                {id !== undefined && id !== '' ?
                                    <>
                                        {!(user.role == "client" || user.role == 'agency_agent' || userData?.UserDetails?.plan_name == "1" ||
                                            userData?.UserDetails?.is_trial == 'true' || userData?.UserDetails?.plan_name == "5") &&
                                            <div>
                                                <h3 className="text-xs  text-slate-900 font-semibold ">
                                                    <span>
                                                        <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                            <div className='flex flex-col'>
                                                                <Link to={`/affiliate/${id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/${id}`)}`}>
                                                                    <svg className="shrink-0 h-6 w-5 me-1" viewBox="0 0 24 24">
                                                                        <path className={`fill-current  text-slate-600}`} d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z" />
                                                                        <path className={`fill-current  text-slate-400'}`} d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z" />
                                                                    </svg>
                                                                    {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Affiliate</span>}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </h3>
                                            </div>
                                        }
                                        <div>
                                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/letter-generator/${id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/letter-generator/${id}`)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M14 3v4a1 1 0 0 0 1 1h4" /> <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <path d="M9 9l1 0" /> <path d="M9 13l6 0" /> <path d="M9 17l6 0" /> </svg>

                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Letter Library</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/creditors-furnishers/${id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers/${id}`)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />  <path d="M3 21l18 0" />  <path d="M3 10l18 0" /> <path d="M5 6l7 -3l7 3" /> <path d="M4 10l0 11" /> <path d="M20 10l0 11" />
                                                                    <path d="M8 14l0 3" /> <path d="M12 14l0 3" /> <path d="M16 14l0 3" />
                                                                </svg>

                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Creditors / Furnishers</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {!(user.role == "client" || user.role == 'agency_agent' || userData?.UserDetails?.plan_name == "1" ||
                                            userData?.UserDetails?.is_trial == 'true' || userData?.UserDetails?.plan_name == "5") &&
                                            <div>
                                                <h3 className="text-sm  text-slate-900 font-semibold ">
                                                    <span >
                                                        <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                            <div className='flex flex-col'>
                                                                <Link to={`/affiliate/`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/`)}`}>
                                                                    <svg className="shrink-0 h-6 w-6 me-1" viewBox="0 0 24 24">
                                                                        <path className={`fill-current  text-slate-600}`} d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z" />
                                                                        <path className={`fill-current  text-slate-400'}`} d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z" />
                                                                    </svg>
                                                                    {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Affiliate</span>}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </h3>
                                            </div>
                                        }
                                        <div>
                                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/letter-generator`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5 py-2  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/letter-generator`)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M14 3v4a1 1 0 0 0 1 1h4" /> <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <path d="M9 9l1 0" /> <path d="M9 13l6 0" /> <path d="M9 17l6 0" /> </svg>
                                                                {sidebarExpanded ? '' : <span className="ml-2 text-xs font-semibold">Letter Library</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/creditors-furnishers`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers`)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />  <path d="M3 21l18 0" />  <path d="M3 10l18 0" /> <path d="M5 6l7 -3l7 3" /> <path d="M4 10l0 11" /> <path d="M20 10l0 11" />
                                                                    <path d="M8 14l0 3" /> <path d="M12 14l0 3" /> <path d="M16 14l0 3" />
                                                                </svg>

                                                                {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Creditors / Furnishers</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                    </>
                                }
                            </>
                            :
                            <>
                                {!(user.role == "client" || user.role == 'agency_agent' || userData?.UserDetails?.plan_name == "1" ||
                                    userData?.UserDetails?.is_trial == 'true' || userData?.UserDetails?.plan_name == "5") &&
                                    <div>
                                        <h3 className="text-sm  text-slate-900 font-semibold ">
                                            <span >
                                                <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                    <div className='flex flex-col'>
                                                        <Link to={`/affiliate/`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/affiliate/`)}`}>
                                                            <svg className="shrink-0 h-6 w-6 me-1" viewBox="0 0 24 24">
                                                                <path className={`fill-current  text-slate-600}`} d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z" />
                                                                <path className={`fill-current  text-slate-400'}`} d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z" />
                                                            </svg>

                                                            {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Affiliate</span>}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </span>
                                        </h3>
                                    </div>
                                }
                                <div>
                                    <h3 className="text-xs  text-slate-900 font-semibold ">
                                        <span >
                                            <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                <div className='flex flex-col'>
                                                    <Link to={`/letter-generator/${user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/letter-generator/${user._id}`)}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M14 3v4a1 1 0 0 0 1 1h4" /> <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <path d="M9 9l1 0" /> <path d="M9 13l6 0" /> <path d="M9 17l6 0" /> </svg>

                                                        {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Letter Library</span>}

                                                    </Link>
                                                </div>
                                            </div>
                                        </span>
                                    </h3>
                                </div>
                                <div>
                                    <h3 className="text-sm  text-slate-900 font-semibold ">
                                        <span >
                                            <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                <div className='flex flex-col'>
                                                    <Link to={`/creditors-furnishers/${user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/creditors-furnishers/${user._id}`)}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />  <path d="M3 21l18 0" />  <path d="M3 10l18 0" /> <path d="M5 6l7 -3l7 3" /> <path d="M4 10l0 11" /> <path d="M20 10l0 11" />
                                                            <path d="M8 14l0 3" /> <path d="M12 14l0 3" /> <path d="M16 14l0 3" />
                                                        </svg>
                                                        {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">Creditors / Furnishers</span>}
                                                    </Link>
                                                </div>
                                            </div>
                                        </span>
                                    </h3>
                                </div>
                            </>
                        } */}
                        {!(user.role == "client" || user.role == "agency_agent") && (user.plan_name == "1" || user.plan_name == "5") &&
                            <>
                                {userData?.UserDetails?.plan_name === "1" || userData?.UserDetails?.plan_name === "5" ?
                                    <div>
                                        <h3 className="text-sm  text-slate-900 font-semibold ">
                                            <span >
                                                <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                    <div className='flex flex-col'>
                                                        <Link to={`/plans/${user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/plans/${user._id}`)}`}>
                                                            <img className='mr-2 h-6 w-5' src={creatoresfurnishedIcons} />
                                                            {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold">Upgrade Plan</span>}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </span>
                                        </h3>
                                    </div>
                                    :
                                    <div className="m-1">
                                        <div>
                                            <h3 className="text-sm  text-slate-900 font-semibold ">
                                                <span >
                                                    <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                        <div className='flex flex-col'>
                                                            <Link to={`/plans`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/plans`)}`}>
                                                                <img className='mr-2 h-6 w-5' src={creatoresfurnishedIcons} />
                                                                {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold">Upgrade Plan</span>}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </span>
                                            </h3>
                                        </div>
                                    </div>
                                }
                            </>
                        }

                        {userData?.UserDetails?.is_trial != "true" &&
                            <>
                                {userData?.UserDetails?.plan_name === "2" || userData?.UserDetails?.plan_name === "6" ?
                                    <>
                                        {id && id != undefined ?
                                            <div>
                                                <h3 className="text-sm  text-slate-900 font-semibold ">
                                                    <span >
                                                        <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                            <div className='flex flex-col'>
                                                                <Link to={`/consumer-ai/${id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai/${id}`)}`}>
                                                                    <img className='mr-2 h-6 w-5' src={creatoresfurnishedIcons} />
                                                                    {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold">ConsumerLaw.ai</span>}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </h3>
                                            </div>
                                            :
                                            <div>
                                                <h3 className="text-sm  text-slate-900 font-semibold ">
                                                    <span >
                                                        <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                            <div className='flex flex-col'>
                                                                <Link to={`/consumer-ai`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai`)}`}>
                                                                    <img className='mr-2 h-6 w-5' src={creatoresfurnishedIcons} />
                                                                    {sidebarExpanded ? '' : <span className="ml- text-sm font-semibold">ConsumerLaw.ai</span>}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </h3>
                                            </div>
                                        }
                                    </>
                                    :
                                    <div>
                                        <h3 className="text-xs  text-slate-900 font-semibold ">
                                            <span >
                                                <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                    <div className='flex flex-col'>
                                                        <Link to={`/consumer-ai/${user._id}`} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5   hover:border-slate-300 dark:hover:border-slate-600 shadow-sm ${isButtonActive(`/consumer-ai/${user._id}`)}`}>
                                                            <img className='h-6 w-5' src={creatoresfurnishedIcons} />
                                                            {sidebarExpanded ? '' : <span className="ml-2 text-sm font-semibold">ConsumerLaw.ai</span>}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </span>
                                        </h3>
                                    </div>
                                }
                            </>
                        }

                        {/* {(user.role == "client") || (user.plan_name == "1" || user.plan_name == "5") &&
                            <>
                                <div>
                                    <h3 className="text-xs  text-slate-900 font-semibold text-center">
                                        <span>
                                            <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                                <div className='flex flex-col'>
                                                    <button onClick={(e) => { showClientDocuments(id ? id : user._id) }} className={`bg-[#F4F5F6] inline-flex items-center text-sm font-medium leading-5 ${sidebarExpanded ? 'justify-center' : ''} rounded-[20px] px-3 py-2.5  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M14 3v4a1 1 0 0 0 1 1h4" /> <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <path d="M9 9l1 0" /> <path d="M9 13l6 0" /> <path d="M9 17l6 0" /> </svg>
                                                        {sidebarExpanded ? '' : <span className="ml-2  capitalize text-sm font-semibold">View Documents</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </span>
                                    </h3>
                                </div>
                            </>
                        } */}

                    </div>
                </div>
            </div>
            <ModalBasic id="feedback-modal" modalOpen={documentInfoModalOpen} setModalOpen={setDocumentInfoModalOpen} title="View Documents">
                <>
                    <div className={`p-4 rounded-lg`}>
                        <label htmlFor="fileInput" className="cursor-pointer">
                        </label>
                        <div className='flex justify-center mt-3'>
                            <div>
                                <div className='flex justify-start mt-3 py-3' >
                                    <p><p className="text-sm text-gray-500 dark:text-gray-400">
                                        Any files added here will be attached to this letter and also saved to this client’s dashboard, under “Document Storage."
                                        JPEG and PNG Maximum file size: <strong className="font-medium text-gray-800 dark:text-white">5MB</strong>.
                                    </p></p>
                                </div>


                                <div className='flex flex-col md:flex-row justify-between px-2 py-3 rounded-lg' >
                                    {
                                        userdetails?.signature ?
                                            <>
                                                <div>
                                                    <img src={userdetails?.signature} alt='signature' className='signature  mb-3' />
                                                    <button className=' w-full  py-2 px-5 rounded-3xl tm-background text-white ' onClick={() => setOpenModal(true)}>
                                                        Change Signature
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <div className='app'>
                                                <button className='w-full  py-2 px-5 rounded-3xl tm-background text-white' onClick={() => setOpenModal(true)}>
                                                    Create Signature
                                                </button>
                                                <br />

                                            </div>
                                    }
                                    {openModal && (
                                        <div className='modalContainer'>
                                            <div className='modal'>
                                                <div className='sigPad__penColors'>
                                                    <p>Pen Color:</p>
                                                    {colors.map((color) => (
                                                        <span
                                                            key={color}
                                                            style={{
                                                                backgroundColor: color,
                                                                border: `${color === penColor ? `2px solid ${color}` : ''}`,
                                                            }}
                                                            onClick={() => setPenColor(color)}>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className='sigPadContainer'>
                                                    <SignatureCanvas
                                                        ref={signatureRef}
                                                        penColor={penColor}
                                                        canvasProps={{ className: 'sigCanvas' }}
                                                    />
                                                    <hr />
                                                    <button className='' onClick={clearSignature}>Clear</button>
                                                </div>

                                                <div className='modal__bottom'>
                                                    <button className='py-2 px-5 rounded-3xl tm-background text-white mr-3' onClick={() => setOpenModal(false)}>Cancel</button>
                                                    {isButtonLoader === "Signature" ?
                                                        <button className='items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'>Uploading Signature</span></button>
                                                        :
                                                        <button className='py-2 px-5 rounded-3xl tm-background text-white' onClick={() => saveSignature("Signature")}>
                                                            Upload Signature
                                                        </button>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* {userdetails?.photo_id ? "" : */}
                                    <div>
                                        <div className=''>
                                            <div>
                                                {userdetails?.photo_id &&
                                                    <div className='flex items-center	'>
                                                        <a href={userdetails?.photo_id} target="_blank" rel="noopener noreferrer">
                                                            <img src={userdetails?.photo_id} alt='signature' className='signature mb-3' />
                                                        </a>
                                                    </div>
                                                }
                                                <input type="file" onChange={handleFileChange} ref={fileInputRef}
                                                    style={{ maxWidth: "230px" }}
                                                    className="mb-3 block  text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                            </div>
                                            <div className=''>
                                                {isButtonLoader === "photo_id" ?
                                                    <button className='w-full items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'> {userdetails?.proof_of_address ? "Changing" : "Uploading"
                                                    }</span></button>
                                                    :
                                                    <button className='w-full items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'
                                                        onClick={() => handleUpload('photo_id')}
                                                    >
                                                        {userdetails?.photo_id ? "Change" : "Upload"}
                                                    </button>
                                                }

                                            </div>
                                        </div>


                                    </div>
                                    {/* } */}

                                    {/* {userdetails?.proof_of_address ? "" : */}
                                    <div>
                                        <div className=''>
                                            <div>
                                                {userdetails?.proof_of_address &&
                                                    <div className='flex items-center	'>
                                                        <img src={userdetails?.proof_of_address} alt='signature' className='signature mb-3' />
                                                    </div>
                                                }
                                                <input type="file" onChange={handleFileChange} ref={fileInputRef}
                                                    style={{ maxWidth: "230px" }}
                                                    className="mb-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                            </div>
                                            <div className='items-center	'>
                                                {isButtonLoader === "proof_of_address" ?
                                                    <button className='w-full items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'> {userdetails?.proof_of_address ? "Changing" : "Uploading"
                                                    }</span></button>
                                                    :
                                                    <button className='w-full items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'
                                                        onClick={() => handleUpload('proof_of_address')}
                                                    >
                                                        {userdetails?.proof_of_address ? "Change" : "Upload"
                                                        }
                                                    </button>
                                                }



                                            </div>
                                        </div>
                                    </div>
                                    {/* } */}
                                    {/* <div>
                                    <label className="cursor-pointer ">Document Type</label>
                                    <select id="documentType" onChange={handleDocumentTypeChange} ref={documentTypeInputRef} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-black ml-2">
                                      <option disabled selected value="">Select Type</option>
                                      <option value="photo_id">Photo ID</option>
                                      <option value="proof_of_address">Proof of Address</option>
                                    </select>
                                  </div> */}

                                </div>
                            </div>
                        </div>



                    </div>
                </>
            </ModalBasic>
        </>
    );
}

export default DashboardSidebar;