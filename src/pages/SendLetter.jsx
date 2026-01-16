import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'
import Header from '../partials/Header';
import { useParams } from "react-router-dom";
import { UPLOAD_IMAGES_ON_AWS, GET_TO_ADDRESS_DATA, GET_ALL_LeTTER_DETAILS, UPLOAD_Signature_ON_AWS, DELETE_LETTER, UPDATE_TRIAL_USED_STATUS, DELETE_LETTER_DOCUMENTS, CHECK_TRIAL_USED_STATUS, GET_DATA_OF_USER_CLIENT, GET_LETTERS_LIST, GET_AWS_DOCUMENT_DATA, UPDATE_LETTER_PAYMENT, SHOW_IMAGES_FROM_AWS, GET_USER_DETAILS, CREATE_USERS_ACTIVITY } from "../API/api"
import axios from 'axios';
import Loder from '../partials/Loder';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import moment from 'moment'
import ModalOpenAiReport from '../components/ModalOpenAiReport';
import { useNavigate } from "react-router-dom";
import SendLetterEmailPayment from '../components/SendLetterEmailPayment';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import ModalBasic from '../components/ModalBasic';
import DashboardSidebar from '../partials/DashboardSidebar';
import DropdownEditMenu from '../components/DropdownEditMenu';
import SubNavbar from '../components/SubNavbar'
import { Link } from 'react-router-dom';
import StickyAIHead from "../pages/component/StickyAIHead";


function SendLetter() {
  const signatureRef = useRef({});
  const headerRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [letterData, setletterData] = useState();
  const [ModalCompleted, setModalCompleted] = useState(false);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');
  const [openAiDataResponse, setopenAiDataResponse] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [updateButton, setUpdateButton] = useState("");
  const [userInquiryDataResponse, setUserInquiryDataResponse] = useState('');
  const [awsDocuments, setAwsDocuments] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const fileInputRef = useRef(null);
  const documentTypeInputRef = useRef(null);
  const [setLoader, setsetLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const sigCanvas = useRef()
  const [penColor, setPenColor] = useState('black')
  const [imageURLL, setImageURLL] = useState(null)
  const [checkTrialStatus, setCheckTrialStatus] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [letters, setLetters] = useState([]);
  const [letterLoader, setletterLoader] = useState(false);
  const [isButtonLoader, setIsButtonLoader] = useState(false);


  // updateButton={"update_button"} 
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

  const getUserData = async () => {
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
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };


  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    getLettersList()
    if (tabId === "dashboard") {
      try {
        const response = await axios.post(UPDATE_TRIAL_USED_STATUS,
          {
            userid: id,
            for_type: "send_letter",
          },
          { headers: { "Authorization": "Bearer " + token } });
        // Scroll to the header
        if (headerRef.current) {
          headerRef.current.scrollIntoView({ behavior: "smooth" });
        }
        CheckButtonStatus();
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    }
  };

  const getDataOfUserClient = async () => {
    try {
      const response = await axios.post(GET_DATA_OF_USER_CLIENT,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.status === "false") {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getDataOfUserClient();
    getLettersList();
    getUserData()
  }, []);

  const getLettersList = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_LETTERS_LIST,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      setletterData(response.data)
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const editLettersResponse = async (value) => {
    setSearchModalOpen(true);
    setUpdateButton("update_button")
    setopenAiDataResponse(value)
    setUserInquiryDataResponse(value)
  };

  const deleteLetter = async (value) => {

    let disputeType = ""
    let disputeItem = "";
    if (value?.type && value?.type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = value?.inquiry['Creditor Name']
    }
    else if (value?.type && value?.type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = value?.derogatory['bankName'];
    }
    else if (value?.type && value?.type === "public") {
      disputeType = "Public";
      disputeItem = value?.public?.bankName
    }

    let letterType = "AI";
    try {
      const response = await axios.post(DELETE_LETTER,
        {
          letter_response: value
        },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response?.data?.message || "Letter deleted Successfully!");
      if (response?.data?.message) {
        userActivity("Delete", "", "", "success", `Letter deleted - ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Delete", "", "", "failed", `Letter delete - ${disputeType}-${disputeItem}, Failed!`);
      }
      getLettersList();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const sendLettersResponse = async (value) => {
    setSearchModalOpen(true);
    setUpdateButton("print_letter")
    setopenAiDataResponse(value)
    setUserInquiryDataResponse(value)
    // navigate("/dashboard");

  };

  // const handleCheckboxChange = (item) => {
  //   if (selectedItems.includes(item)) {
  //     setSelectedItems(selectedItems.filter((i) => i !== item));
  //   } else {
  //     setAwsDocuments(null);
  //     // setSelectedItems([item]);
  //     setSelectedItems([...selectedItems, item]);
  //   }
  // };


  const handleCheckboxChange = (item) => {
    if (selectedItems.some(selectedItem => selectedItem._id === item._id)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };


  // const handleUpload = async () => {
  //   try {
  //     const formData = new FormData();
  //     selectedImages.forEach((image, index) => {
  //       formData.append(`image${index + 1}`, image);
  //     });

  //     // Make a POST request to your backend for image upload
  //     const response = await axios.post(UPLOAD_IMAGES_ON_AWS, formData, { headers: { "Authorization": "Bearer " + token } });

  //     // Handle the response from the backend as needed
  //     console.log('Images uploaded successfully:', response.data);

  //     // Clear selected images and previews after upload
  //     setSelectedImages([]);
  //     setSelectedImagePreviews([]);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //   }
  // };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);

  };
  const handleDocumentTypeChange = (event) => {
    setSelectedDocumentType(event.target.value);
  };



  const colors = ['black', 'green', 'red']

  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
    setImageURLL(URL)
    setOpenModal(false)
  }

  const download = () => {
    const dlink = document.createElement("a")
    dlink.setAttribute("href", imageURLL)
    dlink.setAttribute("download", "signature.png")
    dlink.click()
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
      formData.append('user_id', id);
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

      if (documentTypeInputRef.current) {
        documentTypeInputRef.current.selectedIndex = 0;
      }
      getAwsDocumnets();
      getUserData();
      setIsButtonLoader("");
      toast.success("Image uploaded successfully!");
    } catch (error) {
      setIsButtonLoader("");
      toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }
  };
  const getAwsDocumnets = async () => {
    try {
      const response = await axios.post(GET_AWS_DOCUMENT_DATA, { user_id: id }, { headers: { "Authorization": "Bearer " + token } });
      setAwsDocuments(response.data)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getAwsDocumnets();
  }, [selectedItems]);


  useEffect(() => {
    CheckButtonStatus();
  }, []);

  const CheckButtonStatus = async () => {
    try {
      const response = await axios.post(CHECK_TRIAL_USED_STATUS,
        {
          userid: id,
          for_type: "send_letter",
        },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data?.message === "limit-expire") {
        setCheckTrialStatus(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }

  };

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const createSignature = () => {
    const canvasData = signatureRef.current.toDataURL('image/png');
    setImageURLL(canvasData);
    setOpenModal(false);
  };

  const saveSignature = async (type) => {
    setIsButtonLoader(type);
    const canvasData = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');

    try {
      // Send the signature to the backend
      const response = await axios.post(UPLOAD_Signature_ON_AWS, { user_id: id, signature: canvasData }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      getUserData();
      setOpenModal(false);
      setIsButtonLoader("");
      toast.success("Signature uploaded successfully!");
    } catch (error) {
      setIsButtonLoader("");
      toast.error(error || 'Error uploading signature');
    }
  };

  const deleteletterDocuments = async (value) => {
    try {
      const response = await axios.post(DELETE_LETTER_DOCUMENTS,
        {
          user_id: id,
          value: value
        },
        { headers: { "Authorization": "Bearer " + token } });
      getAwsDocumnets();
      getUserData();
      toast.success("Document deleted successfully!");
    } catch (error) {
      toast.error(error || "Something went Wrong");
    }
  };

  const [checkedValues, setCheckedValues] = useState({});
  // Function to handle checkbox change
  const handleDocCheckboxChange = (e, val) => {
    const { name, checked } = e.target;
    setCheckedValues(prevValues => ({
      ...prevValues,
      [name]: checked
    }));
  };

  const clearSeletedResponse = (val) => {
    setSelectedItems([]);
    handleTabClick(val);
  };

  const get_all_letters = async (letter_id) => {
    setletterLoader(true);
    try {
      const response = await axios.post(GET_ALL_LeTTER_DETAILS, { letter_id: letter_id });
      setLetters(response?.data?.letters)
      setletterLoader(false);
      // console.log(response?.data?.letters, "ddkdkd")
    } catch (error) {
      setLetters([]);
      setletterLoader(false);
      toast.error(error || "Something went Wrong");
    }
  };

  function formatThumbnails(rendered_thumbnails) {
    // Split the string by underscore and map over each word
    return rendered_thumbnails.split('_')
      .map(word => {
        // Capitalize the first letter of each word
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        return capitalizedWord;
      })
      .join(' '); // Join the words with a space
  }


  const [selectedState, setSelectedState] = useState('');

  const [toAddressDetails, setToAddressDetails] = useState({
    to_address: "",
    to_city: "",
    to_state: selectedState,
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const getToAddressData = async () => {
    let URL = GET_TO_ADDRESS_DATA(openAiDataResponse?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setToAddressDetails({
        to_id: response.data.ToAddressData._id,
        to_letter_id: response.data.ToAddressData.openAiDataResponse?._id,
        to_address: response.data.ToAddressData.address,
        to_city: response.data.ToAddressData.city,
        to_state: response.data.ToAddressData.state,
        to_zip: response.data.ToAddressData.zip,
        to_phone: response.data.ToAddressData.phone,
        to_country: response.data.ToAddressData.country,

      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };


  const handleToAddressChange = (e) => {
    const { name, value } = e.target;
    setToAddressDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex h-[100dvh] overflow-hidden px-8 bg-white">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow" ref={headerRef}>
            <div className="pl-2 py-2 w-full">
              <div className=" sm:mb-0" >
                <div className='flex justify-between items-center'>
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Consumer Law Mail</h1>
                  <Link to={`/track-letter/${id}`} className='btn tm-background text-white'>Letter history</Link>
                </div>
                {/* <img width={35} h src={head_logo}></img> */}
              </div>
            </div>
            <div className='pl-2 py-2 w-full'>
              <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                <h2 className="font-semibold text-slate-100 dark:text-slate-100">Send Letters</h2>
              </header>
              {/* <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center mx-2" style={{ background: "#cb1717", borderRadius: "20px" }}>Send Letters</h1> */}
              <div className="">
                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-b-2xl border border-slate-200 dark:border-slate-700" >
                  <div className="flex flex-col h-full">
                    <div className="grow pt-3 pb-1 p-1 md:p-5">
                      <div className="">
                        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                          <ul className="flex flex-col md:flex-row -mb-px text-sm font-medium text-center justify-evenly" id="default-tab" role="tablist">
                            <li className="me-2" role="presentation">
                              <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'profile' ? 'border-black' : ''}`}
                                id="profile-tab"
                                onClick={() => handleTabClick('profile')}
                                role="tab"
                                aria-controls="profile"
                                aria-selected={activeTab === 'profile'}
                              >
                                Select Letters
                              </button>
                            </li>
                            <li className="me-2" role="presentation">
                              {selectedItems.length === 0 ?
                                <span >
                                  <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                    <div className='flex flex-col'>
                                      <div className="relative group">
                                        <button style={{ width: "100%" }}
                                          className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'settings' ? 'border-black' : ''}`}
                                          id="settings-tab"
                                          // onClick={() => handleTabClick('settings')}
                                          role="tab"
                                          aria-controls="settings"
                                          aria-selected={activeTab === 'settings'}
                                        >
                                          {/* <img className='mr-2 h-6 w-5' src={disputeIcon} /> */}
                                          {sidebarExpanded ? '' : <span className="ml- text-sm ">Attach Documents</span>}
                                        </button>
                                        <div className="absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                          Please select the letters and press the next button to advance to this stage.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </span>
                                :
                                <button
                                  className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'dashboard' ? 'border-black' : ''}`}
                                  id="dashboard-tab"
                                  onClick={() => handleTabClick('dashboard')}
                                  role="tab"
                                  aria-controls="dashboard"
                                  aria-selected={activeTab === 'dashboard'}
                                >
                                  Attach Documents
                                </button>
                              }
                            </li>
                            <li className="me-2" role="presentation">
                              {selectedItems.length === 0 ?
                                <span >
                                  <div className="sm:w-auto md:w-auto lg:w-auto xl:w-auto ">
                                    <div className='flex flex-col'>
                                      <div className="relative group">
                                        <button style={{ width: "100%" }}
                                          className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'settings' ? 'border-black' : ''}`}
                                          id="settings-tab"
                                          // onClick={() => handleTabClick('settings')}
                                          role="tab"
                                          aria-controls="settings"
                                          aria-selected={activeTab === 'settings'}
                                        >
                                          {/* <img className='mr-2 h-6 w-5' src={disputeIcon} /> */}
                                          {sidebarExpanded ? '' : <span className="ml- text-sm ">  Select Print & Mail Methods</span>}
                                        </button>
                                        <div className="absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                          Please select the letters and press the next button to advance to this stage.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </span>
                                :
                                <button
                                  className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'settings' ? 'border-black' : ''}`}
                                  id="settings-tab"
                                  onClick={() => handleTabClick('settings')}
                                  role="tab"
                                  aria-controls="settings"
                                  aria-selected={activeTab === 'settings'}
                                >
                                  Select Print & Mail Methods
                                </button>
                              }
                            </li>
                          </ul>

                          <div id="default-tab-content">
                            <div className={`rounded-lg ${activeTab === 'profile' ? 'dark:bg-gray-800' : 'hidden'}`} role="tabpanel" aria-labelledby="profile-tab">
                              <div className="overflow-x-auto">
                                <div className='shownav'>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                                      <tr>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                                          <div className="font-semibold text-left">
                                          </div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter To</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Created</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Print Status</div>
                                        </th>
                                        {user.role != "client" &&
                                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                            <div className="font-semibold text-left">Actions</div>
                                          </th>
                                        }
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                                          <div className="font-semibold text-left"></div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                      {letterData?.letterList.map((val, i) => {
                                     
                                        return (
                                          <tr key={i}>
                                            <>
                                              {user.role !== "client" && (
                                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                  {val.is_payment_done === "1" ? (
                                                    ""
                                                  ) : (
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedItems.some(selectedItem => selectedItem._id === val._id)}
                                                      onChange={() => handleCheckboxChange(val)}
                                                    />
                                                  )}
                                                </td>
                                              )}
                                            </>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div>
                                                {
                                                  val?.letterName ? val?.letterName :
                                                    <>
                                                      {
                                                        val?.receiver_name ? val?.receiver_name :
                                                          <>
                                                            {val?.derogatory && val?.derogatory.bankName}
                                                            {val?.inquiry && val?.inquiry["Creditor Name"]}
                                                            {val?.public && val?.public.bankName}
                                                          </>
                                                      }
                                                    </>
                                                }
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div>{moment(val.updatedAt).fromNow()}</div>
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                              <div className="flex items-center">
                                                <div>
                                                  {val?.printing_status === 1 ? "Printed/Locally" : val?.printing_status === 2 ? "Printed/Sent" : val?.printing_status === 3 ? "Canceled" : "Pending Print"}
                                                </div>
                                              </div>
                                            </td>
                                            {user.role != "client" &&
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-[200px]">
                                                <div className='flex justify-center items-center '>
                                                  {val.is_payment_done === "1" ? "-" :
                                                    <DropdownEditMenu className="relative inline-flex bg-gray-100 rounded-full">
                                                      {val.is_payment_done === "1" ? "" :
                                                        <>
                                                          <li>
                                                            <button
                                                              onClick={() => editLettersResponse(val)}
                                                              className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer"
                                                            >
                                                              Edit
                                                            </button>
                                                          </li>
                                                          <li>
                                                            <button
                                                              onClick={() => deleteLetter(val)}
                                                              className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer"
                                                            >
                                                              Delete
                                                            </button>
                                                          </li>
                                                        </>
                                                      }

                                                    </DropdownEditMenu>
                                                  }
                                                </div>
                                              </td>
                                            }

                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                <div className='hidenav'>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                      {letterData?.letterList.map((val, i) => {
                                        return (
                                          <div key={i} className='py-5'>
                                            <tr>
                                              <>
                                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                  <div className="font-semibold text-left">Select</div>
                                                </th>
                                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                  {val.is_payment_done === "1" ? "" :
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedItems.includes(val)}
                                                      onChange={() => handleCheckboxChange(val)}
                                                    />
                                                  }
                                                </td>
                                              </>
                                            </tr>
                                            <tr>
                                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Letterss To</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 break-words">
                                                <div>
                                                  {
                                                    val?.letterName ? val?.letterName :
                                                      <>
                                                        {
                                                          val?.receiver_name ? val?.receiver_name :
                                                            <>
                                                              {val?.derogatory && val?.derogatory.bankName}
                                                              {val?.inquiry && val?.inquiry["Creditor Name"]}
                                                              {val?.public && val?.public.bankName}
                                                            </>
                                                        }
                                                      </>
                                                  }
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Created</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 break-words">
                                                <div className="flex items-center">
                                                  <div>{moment(val.updatedAt).fromNow()}</div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Print Status</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 break-words">
                                                <div className="flex items-center">
                                                  <div>
                                                    {val?.printing_status === 1 ? "Printed/Locally" : val?.printing_status === 2 ? "Printed/Sent" : val?.printing_status === 3 ? "Canceled" : "Pending Print"}
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Actions</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 break-words">
                                                <div className="flex items-center">
                                                  <div>
                                                    {val.is_payment_done === "1" ? "" :
                                                      <>
                                                        <button onClick={() => editLettersResponse(val)} className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                                          <span className="sr-only">Edit</span>
                                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                                          </svg>
                                                        </button>
                                                      </>
                                                    }
                                                    <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteLetter(val)}>
                                                      <span className="sr-only">Delete</span>
                                                      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                                        <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                                        <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                                      </svg>
                                                    </button>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </div>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>


                              </div>
                              {user.role != "client" &&
                                <div className=' m-4'>

                                </div>
                              }
                              <div className="bottom-0 sticky w-full  font-bold rounded-full  centered-button z-10">
                                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700">
                                  <div className="flex flex-col h-full">
                                    <div className="text-center pb-5">
                                      {selectedItems.length === 0 ?
                                        <button disabled className='py-2 px-5 rounded-3xl  mt-4 mb-5 hover:text-gray-600 bg-gray-300 dark:hover:text-gray-300'
                                        >Next</button>
                                        :
                                        <button className='py-2 px-5 rounded-3xl  mt-4 mb-5 tm-background text-white'
                                          id="dashboard-tab"
                                          onClick={() => handleTabClick('dashboard')}
                                          role="tab"
                                          aria-controls="dashboard"
                                          aria-selected={activeTab === 'dashboard'}
                                        >Next</button>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={`mb-10 pb-10 p-4 rounded-lg ${activeTab === 'dashboard' ? ' dark:bg-gray-800' : 'hidden'}`} role="tabpanel" aria-labelledby="dashboard-tab">
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
                                  <div className='flex flex-col md:flex-row justify-between  px-2 py-3 rounded-lg' >
                                    {
                                      userdetails?.signature ?
                                        <>
                                          <div>
                                            <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                              Signature
                                            </label>
                                            <div className='flex justify-center'>
                                              <img src={userdetails?.signature} alt='signature' width={200} className='signature  mb-3' />
                                            </div>
                                            <button className=' w-full  py-2 px-5 rounded-3xl tm-background text-white ' onClick={() => setOpenModal(true)}>
                                              Change Signature
                                            </button>
                                          </div>
                                        </>
                                        :
                                        <div className='app'>
                                          <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                            Signature
                                          </label>
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
                                          <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                            Photo Id
                                          </label>
                                          {userdetails?.photo_id &&
                                            <div className='flex items-center	 justify-center'>
                                              <input
                                                type="checkbox"
                                                className='me-2'
                                                name={"photo_id"} // Unique name for each checkbox
                                                checked={checkedValues["photo_id"]} // Set checked value from state
                                                onChange={(e) => handleDocCheckboxChange(e, userdetails)}
                                              />
                                              <img src={userdetails?.photo_id} alt='signature' className='signature mb-3' />
                                            </div>
                                          }
                                          <div className='flex justify-center'>
                                            <input type="file" onChange={handleFileChange} ref={fileInputRef}
                                              style={{ maxWidth: "230px" }}
                                              className="mb-3 block  text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                          </div>
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
                                          <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                            Proof Of Address
                                          </label>
                                          {userdetails?.proof_of_address &&
                                            <div className='flex items-center justify-center	'>
                                              <input
                                                type="checkbox"
                                                className='me-2'
                                                name={"proof_of_address"} // Unique name for each checkbox
                                                checked={checkedValues["proof_of_address"]} // Set checked value from state
                                                onChange={(e) => handleDocCheckboxChange(e, userdetails)}
                                              />
                                              <img src={userdetails?.proof_of_address} alt='signature' className='signature mb-3' />
                                            </div>
                                          }
                                          <div className='flex items-center justify-center	'>
                                            <input type="file" onChange={handleFileChange} ref={fileInputRef}
                                              style={{ maxWidth: "230px" }}
                                              className="mb-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />

                                          </div>
                                        </div>
                                        <div className=''>
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

                              <div className="bottom-0 sticky w-full  font-bold rounded-full  centered-button z-10">
                                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700">
                                  <div className="flex flex-col h-full">
                                    <div className="text-center pb-5">
                                      <div className=' m-4'>
                                        {selectedItems.length != 0 &&
                                          <button className='py-2 px-5 rounded-3xl tm-background text-white me-3'
                                            id="profile-tab"
                                            onClick={() => clearSeletedResponse('profile')}
                                            role="tab"
                                            aria-controls="profile"
                                            aria-selected={activeTab === 'profile'}

                                          >Back</button>
                                        }
                                        {/* {selectedItems.length > 0 && awsDocuments?.length > 0 ? */}
                                        <button className='py-2 px-5 rounded-3xl tm-background text-white'
                                          id="settings-tab"
                                          onClick={() => handleTabClick('settings')}
                                          role="tab"
                                          aria-controls="settings"
                                          aria-selected={activeTab === 'settings'}
                                        >Next</button>
                                        {/* :
                                <button disabled className='btn  rounded-t-lg hover:text-gray-600 bg-gray-300 dark:hover:text-gray-300'
                                >Next</button> */}
                                        {/* } */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className={`mb-10 pb-10 p-4 rounded-lg ${activeTab === 'settings' ? ' dark:bg-gray-800' : 'hidden'}`} role="tabpanel" aria-labelledby="settings-tab">

                              <SendLetterEmailPayment userID={id} checkedValues={checkedValues} userdetails={userdetails} editLettersResponse={editLettersResponse} getAwsDocumnets={getAwsDocumnets} setSelectedItems={setSelectedItems} selectedItems={selectedItems} activeTab={activeTab} handleTabClick={handleTabClick} sendLettersResponse={sendLettersResponse} responseData={selectedItems} ></SendLetterEmailPayment>
                            </div>
                            <div className={`p-0 md:p-4 rounded-lg ${activeTab === 'contacts' ? ' dark:bg-gray-800' : 'hidden'}`} role="tabpanel" aria-labelledby="contacts-tab">
                              <div className="overflow-x-auto">
                                <div className='shownav'>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                                      <tr>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-xl">
                                          <div className="font-semibold text-left">
                                            {/* <input
                                          type="checkbox"
                                          checked={selectAll}
                                          onChange={handleSelectAllChange}
                                        /> */}
                                          </div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Name</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Created</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Mail Class</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Expected Delivery Date</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Tracking Number</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Latest Status</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Tracking</div>
                                        </th>
                                        {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                      <div className="font-semibold text-left">Pages</div>
                                    </th> */}
                                        {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                      <div className="font-semibold text-left">Letter Details</div>
                                    </th> */}
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-xl">
                                          <div className="font-semibold text-left"></div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                      {letterData?.letterList.map((val, i) => {
                                        return (
                                          <tr key={i}>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div>
                                                {
                                                  val?.letterName ? val?.letterName :
                                                    <>
                                                      {
                                                        val?.receiver_name ? val?.receiver_name :
                                                          <>
                                                            {val?.derogatory && val?.derogatory.bankName}
                                                            {val?.inquiry && val?.inquiry["Creditor Name"]}
                                                            {val?.public && val?.public.bankName}
                                                          </>
                                                      }
                                                    </>
                                                }
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div>{moment(val.updatedAt).fromNow()}</div>
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div>{val.lob_mail_type ? val.lob_mail_type === "usps_first_class" ? "USPS FIRST CLASS" : "Certified Mail" : "N/A"}</div>
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                              <div className="flex items-center">
                                                <div>{val?.lob_expected_delivery_date ? moment(val?.lob_expected_delivery_date).format("YYYY-MM-DD") : "-"}</div>{ }
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                              <div className="flex items-center">
                                                <div>{val?.trackingId ? val?.trackingId : "-"} </div>
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                              <div className="flex items-center">
                                                <div>{val?.tracker_status ? val?.tracker_status : "-"} </div>
                                              </div>
                                            </td>
                                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                              <button className='py-2 px-5 rounded-3xl tm-background text-white p-3' onClick={(e) => { e.stopPropagation(); setOpenModel(true); get_all_letters(val?.lob_reponse?.id) }}>Track</button>
                                            </td>
                                            {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div>Uploaded Date and Time 1</div>
                                          </div>
                                        </td> */}
                                            {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div>
                                              <button onClick={() => editLettersResponse(val)} className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                                <span className="sr-only">Edit</span>
                                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                                  <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                                </svg>
                                              </button>
                                            </div>
                                          </div>
                                        </td> */}
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                <div className='hidenav' style={{ width: "200px" }}>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    {/* <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                                      <tr>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">
                                          </div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Name</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Created</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Mail Class</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Expected Delivery Date</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Latest Status</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Tracking</div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left"></div>
                                        </th>
                                      </tr>
                                    </thead> */}
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                      {letterData?.letterList.map((val, i) => {
                                        return (
                                          <div key={i}>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">
                                                </div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Letter Name</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div>
                                                  {
                                                    val?.letterName ? val?.letterName :
                                                      <>
                                                        {
                                                          val?.receiver_name ? val?.receiver_name :
                                                            <>
                                                              {val?.derogatory && val?.derogatory.bankName}
                                                              {val?.inquiry && val?.inquiry["Creditor Name"]}
                                                              {val?.public && val?.public.bankName}
                                                            </>
                                                        }
                                                      </>
                                                  }
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Letter Created</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                  <div>{moment(val.updatedAt).fromNow()}</div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Mail Class</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                  <div>{val.lob_mail_type ? val.lob_mail_type === "usps_first_class" ? "USPS FIRST CLASS" : "Certified Mail" : "N/A"}</div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Expected Delivery Date</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                                <div className="flex items-center">
                                                  <div>{val?.lob_expected_delivery_date ? moment(val?.lob_expected_delivery_date).format("YYYY-MM-DD") : "-"}</div>{ }
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Tracking Id</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                                <div className="flex items-center">
                                                  <div>{val?.trackingId ? val?.trackingId : "-"} </div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Latest Status</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                                <div className="flex items-center">
                                                  <div>{val?.tracker_status ? val?.tracker_status : "-"} </div>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-0 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                                <div className="font-semibold text-left">Letter Tracking</div>
                                              </th>
                                              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                                                <button className='py-2 px-5 rounded-3xl tm-background text-white p-3' onClick={(e) => { e.stopPropagation(); setOpenModel(true); get_all_letters(val?.lob_reponse?.id) }}>Track</button>
                                              </td>
                                            </tr>
                                          </div>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className=' m-4'>
                                <button className='py-2 px-5 rounded-3xl tm-background text-white me-3'
                                  id="settings-tab"
                                  onClick={() => handleTabClick('settings')}
                                  role="tab"
                                  aria-controls="settings"
                                  aria-selected={activeTab === 'settings'}
                                >Back</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
          <ModalBasic id="feedback-modal" modalOpen={openModel} setModalOpen={setOpenModel} title="Letter Tracking ">
            {letterLoader ?
              <div className='flex justify-center items-center m-5'>
                <div role="status">
                  <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#bd0808" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#bd0808" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>

              </div>
              :
              <>
                {letters?.length == 0 ?
                  <p className='m-5 text-center'>No tracking records found</p>
                  :
                  <div className='flex'>
                    <div className='tracker-child'></div>
                    <div className="my-5 flex flex-col items-start justify-center" style={{ width: "50%" }}>
                      {letters.map((ele, i) => {
                        console.log(ele)
                        return (
                          <div key={i}>
                            {i !== 0 &&
                              <>
                                <div className='flex items-end'>
                                  <div className='flex flex-col items-center justify-center'>
                                    <div style={{ height: "50px", width: "2px", backgroundColor: "rgb(203, 23, 23)" }}></div>
                                    <div className='tracker-bordere'>
                                      <span className='tracker-point'></span>
                                    </div>
                                  </div>
                                  <div className='ms-2' style={{ marginBottom: "-6px" }}>
                                    <p style={{ fontSize: "12px", fontWeight: "500" }}>{formatThumbnails(ele?.web_hook_data?.event_type?.id?.split('.')?.pop())}</p>
                                    <p style={{ fontSize: "10px" }}>{moment(ele?.web_hook_data?.date_created).format("YYYY-MM-DD")}</p>
                                  </div>
                                </div>
                              </>
                            }
                            {i == 0 && <div>START</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                }
              </>

            }

          </ModalBasic>

          <ModalOpenAiReport id="quick-find-modal"  checkedValues={checkedValues} userdetails={userdetails} selectedItems={selectedItems} setSelectedItems={setSelectedItems} getLettersList={getLettersList} toAddressDetails={toAddressDetails} getToAddressData={getToAddressData} handleToAddressChange={handleToAddressChange} ModalCompleted={ModalCompleted} setModalCompleted={setModalCompleted} openAiDataResponse={openAiDataResponse} updateButton={updateButton} userInquiryDataResponse={userInquiryDataResponse} searchId="quick-find" handleTabClick={handleTabClick} modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
        </div>
      </div>
      {/* <Footer></Footer> */}
      <StickyAIHead />

    </>
  );
}

export default SendLetter;