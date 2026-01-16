import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'
import Header from '../partials/Header';
import { useParams } from "react-router-dom";
import { UPLOAD_IMAGES_ON_AWS, CANCLE_LOB_LETTER, GET_TO_ADDRESS_DATA, GET_ALL_LeTTER_DETAILS, UPLOAD_Signature_ON_AWS, DELETE_LETTER, UPDATE_TRIAL_USED_STATUS, DELETE_LETTER_DOCUMENTS, CHECK_TRIAL_USED_STATUS, GET_DATA_OF_USER_CLIENT, GET_LETTERS_LIST, GET_AWS_DOCUMENT_DATA, UPDATE_LETTER_PAYMENT, SHOW_IMAGES_FROM_AWS, GET_USER_DETAILS, CREATE_USERS_ACTIVITY } from "../API/api"
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

function TrackLetter() {
  const signatureRef = useRef({});
  const { id } = useParams();
  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [letterData, setletterData] = useState();
  const [ModalCompleted, setModalCompleted] = useState(false);
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
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [cancelModalValue, setCancelModalValue] = useState('');

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
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
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
    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (!selectedFile) {
        toast.error("Please select a Document");
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, JPG)");
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("Image size exceeds 5MB limit");
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
        fileInputRef.current.value = ''; // Reset file input
      }

      if (documentTypeInputRef.current) {
        documentTypeInputRef.current.selectedIndex = 0; // Reset select to its initial option
      }
      getAwsDocumnets();
      getUserData();
      toast.success("Image uploaded successfully!");
    } catch (error) {
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

  const saveSignature = async () => {
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
      toast.success("Signature uploaded successfully!");
    } catch (error) {
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



  const handleOpenConfirmationPopup = async (val) => {
    try {
      setBasicModalOpen(true);
      setCancelModalValue(val)
    } catch (error) {
      setBasicModalOpen(false);
    }
  };

  const handleLobLetterCancel = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(CANCLE_LOB_LETTER,
        {
          lobId: cancelModalValue?.lob_reponse?.id,
          letterId: cancelModalValue?._id
        },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response?.data?.msg || "Letter Canceled Successfully!");
      getLettersList();
      setsetLoader(false);
      setBasicModalOpen(false);
    } catch (error) {
      setsetLoader(false);
      setBasicModalOpen(false);
      toast.error(error.response.data.error || "Something went Wrong");
    }
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
      <div className="flex h-[100dvh] overflow-hidden px-3 bg-white">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow">
            <div className="pl-2 py-2 w-full">
              <div className=" sm:mb-0" >
                <div className='flex justify-between items-center'>
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Consumer Law Mail</h1>
                  {/* <Link to={`/track-letter/${id}`} className='btn tm-background text-white'>letter history</Link> */}
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
                          <div id="default-tab-content">
                            <div className={`rounded-lg ${activeTab === 'profile' ? 'dark:bg-gray-800' : 'hidden'}`} role="tabpanel" aria-labelledby="profile-tab">
                              <div className="overflow-x-auto">
                                <div className='shownav'>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                                      <tr>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-xl">
                                          <div className="font-semibold text-left">
                                          </div>
                                        </th>
                                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="font-semibold text-left">Letter Name</div>
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
                                        let lobDateCreated = "";
                                        let fourHoursAfter = "";
                                        let currentUtcTime = "";
                                        lobDateCreated = new Date(val?.lob_date_created);
                                        fourHoursAfter = new Date(lobDateCreated.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
                                        currentUtcTime = new Date();
                                        return (
                                          <>
                                            {val?.lob_date_created && val?.lob_date_created != "" &&
                                              <>
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
                                                  {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div>{moment(val.updatedAt).fromNow()}</div>
                                              </div>
                                            </td> */}
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
                                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize">
                                                    <div className="flex items-center">
                                                      <div>{val?.tracker_status ? val?.tracker_status : "-"} </div>
                                                    </div>
                                                  </td>
                                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">

                                                    <button className='ms-2 py-2 px-5 rounded-3xl tm-background text-white p-3' onClick={(e) => { e.stopPropagation(); setOpenModel(true); get_all_letters(val?.lob_reponse?.id) }}>Track</button>
                                                    <a className='ms-2 me-2 py-2 px-5 rounded-3xl tm-background text-white p-3' href={val?.lob_reponse?.url} target="_blank" rel="noopener noreferrer">
                                                      Download letter
                                                    </a>
                                                    {/* {currentUtcTime < fourHoursAfter ? (
                                                      <>
                                                        {val?.printing_status != 3 ?
                                                          <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenConfirmationPopup(val) }}
                                                            className='py-2 px-5 rounded-3xl tm-background text-white p-3'>Cancel Letters</button>
                                                          :
                                                          // 
                                                          <>
                                                            <span className="relative group">
                                                              <button disabled className='py-2 px-5 rounded-3xl btn-sm bg-[#7f8082] text-white p-3'>Letter cancelled</button>
                                                              <div className="absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                                Letter already cancelled
                                                              </div>
                                                            </span>
                                                          </>
                                                        }
                                                      </>
                                                    ) : (
                                                      <span className="relative group">
                                                        <button disabled className='py-2 px-5 rounded-3xl btn-sm bg-[#7f8082] text-white p-3'>Cancel Letters</button>
                                                        <div className=" absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                          Letter is no longer <br></br>  cancelable.
                                                        </div>
                                                      </span>
                                                    )} */}
                                                  </td>
                                                </tr>
                                              </>
                                            }
                                          </>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                <div className='hidenav'>
                                  <table className="table-auto w-full dark:text-slate-300 mt-3">
                                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                      {letterData?.letterList.map((val, i) => {
                                        let lobDateCreated = "";
                                        let fourHoursAfter = "";
                                        let currentUtcTime = "";
                                        lobDateCreated = new Date(val?.lob_date_created);
                                        fourHoursAfter = new Date(lobDateCreated.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
                                        currentUtcTime = new Date();
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
                                              <td className="px-2 first:pl-5 last:pr-5 py-3">
                                                <div className="flex flex-col sm:flex-row items-start sm:space-x-2 space-y-2 sm:space-y-0">
                                                  <button
                                                    className="btn-sm py-2 px-5 rounded-3xl tm-background text-white"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setOpenModel(true);
                                                      get_all_letters(val?.lob_reponse?.id);
                                                    }}
                                                  >
                                                    Track
                                                  </button>
                                                  <a
                                                    className="btn-sm py-2 px-5 rounded-3xl tm-background text-white"
                                                    href={val?.lob_reponse?.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    Download letter
                                                  </a>
                                                  {/* {currentUtcTime < fourHoursAfter ? (
                                                    <>
                                                      {val?.printing_status !== 3 ? (
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenConfirmationPopup(val);
                                                          }}
                                                          className="btn-sm py-2 px-5 rounded-3xl tm-background text-white"
                                                        >
                                                          Cancel Letters
                                                        </button>
                                                      ) : (
                                                        <span className="relative group">
                                                          <button
                                                            disabled
                                                            className="btn-sm py-2 px-5 rounded-3xl bg-[#7f8082] text-white"
                                                          >
                                                            Letter cancelled
                                                          </button>
                                                          <div className="absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                            Letter already cancelled
                                                          </div>
                                                        </span>
                                                      )}
                                                    </>
                                                  ) : (
                                                    <span className="relative group">
                                                      <button
                                                        disabled
                                                        className="btn-sm py-2 px-5 rounded-3xl bg-[#7f8082] text-white"
                                                      >
                                                        Cancel Letters
                                                      </button>
                                                      <div className="absolute hidden w-40 p-2 text-center text-white bg-black rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 group-hover:block">
                                                        Letter is no longer <br /> cancelable.
                                                      </div>
                                                    </span>
                                                  )} */}
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

          <ModalBasic id="basic-modal" modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title="Cancel Letter">
            <div className="px-5 pt-4 pb-1">
              <div className="">
                <div className="font-2xl text-slate-800 dark:text-slate-100 mb-2">Do you want to cancel the letter?</div>
                <div className="space-y-2">
                  <p>

                    Amount ${cancelModalValue?.transInfo?.planAmount} will be credited to the account  linked <br></br> to the card ending in {cancelModalValue?.transInfo?.info} within 3–4 working days.
                  </p>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="px-5 py-4">
              <div className="flex flex-wrap justify-end space-x-2">
                <button className="btn-sm tm-background text-white rounded-full px-3 py-2" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(false); }}>NO</button>
                <button onClick={() => handleLobLetterCancel()} className="btn-sm tm-background text-white rounded-full px-3 py-2">YES</button>
              </div>
            </div>
          </ModalBasic>

          <ModalOpenAiReport id="quick-find-modal" getLettersList={getLettersList} toAddressDetails={toAddressDetails} getToAddressData={getToAddressData} handleToAddressChange={handleToAddressChange} ModalCompleted={ModalCompleted} setModalCompleted={setModalCompleted} openAiDataResponse={openAiDataResponse} updateButton={updateButton} userInquiryDataResponse={userInquiryDataResponse} searchId="quick-find" handleTabClick={handleTabClick} modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />

        </div>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}

export default TrackLetter;