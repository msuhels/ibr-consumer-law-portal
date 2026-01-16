import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_CLIENT_DATA, UPLOAD_Signature_ON_AWS, DEACTIVE_CLIENT, UPLOAD_IMAGES_ON_AWS, RESEND_LOGIN_DETAILS_TO_CLIENT_BY_MAIL, UPDATE_CLIENT_STAGES_OR_STATUS, GET_AGENTS_AND_AGENCY_AGENT, UPLOAD_CSV_FILE, DELETE_CLIENT, GET_DOC_FROM_AWS, GET_AFFILIATE_DATA, ADD_CLIENT_DATA, UPDATE_CLIENT_DATA, EDIT_CLIENT_DETAILS, GET_USER_DETAILS } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import ModalBlank from '../components/ModalBlank';
import { WithContext as ReactTags } from 'react-tag-input';
import video_icon from "../images/video-icon.png";
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'
import Loder from '../partials/Loder';
import SignatureCanvas from 'react-signature-canvas'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';

function ClientsPage() {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const signatureRef = useRef({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isClientData, setIsClientData] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [deactiveClientId, setDeactiveClientId] = useState("")
  const [isChecked, setIsChecked] = useState(false);
  const [setLoader, setsetLoader] = useState(false);
  const [UserData, setUserData] = useState("");
  const [isAffiliateData, setIsAffiliateData] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [agentData, setAgentData] = useState(null)
  const [leadsVideoModalOpen, setLeadsVideoModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [clientUserTableId, setClientUserTableId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const documentTypeInputRef = useRef(null);
  const colors = ['black', 'green', 'red']
  const [penColor, setPenColor] = useState('black');
  const [isButtonLoader, setIsButtonLoader] = useState(false);
  const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  const [isAgreementStep, setIsAgreementStep] = useState(false);
  const [isEditAgreementStep, setEditIsAgreementStep] = useState(false);

  const [clientAgreementData, setClientAgreementData] = useState('');

  const [defaultContent, setDefaultContent] = useState(`
  <div>
  
    I, Client, hereby enter into the following agreement with.
  </p>
  
    hereby agrees to perform the following:
  </p>
  
  
    To evaluate Customer's current credit reports as listed with applicable consumer reporting agencies and to identify inaccurate, erroneous, false, or obsolete information. To advise Customer as to the necessary steps to be taken on the part of Customer in conjunction with Our Company, to dispute any inaccurate, erroneous, false, or obsolete information contained in the Customer's credit reports.
  </p>
  
  
    To prepare all necessary correspondence in dispute of inaccurate, erroneous, false, or obsolete information in customer's credit reports.
  </p>
  
  
    To review credit profile status from consumer reporting such as Experian, Equifax, and Transunion.  Consulting, coaching, and monitoring services are conducted by personal meetings, webinars, video conferencing, telephone, email, or by any other form of communication during normal business hours.
  </p>
  
  
    In exchange, I, the Client, agree to pay the following fees as outlined in the following fee schedule:
  </p>
  
  
    (As discussed)
  </p>
  
  
    Authorization for Credit Repair Action
  </p>
  
  
  
    1.  I,  Client, to make, receive, sign, endorse, execute, acknowledge, deliver, and possess such applications, correspondence, contracts, or agreements, as necessary to improve my credit. Such instruments in writing of whatever nature shall only be effective for any or all of the three consumer reporting agencies which are TransUnion, Experian, Equifax, and any other reporting agencies or creditors listed, as may be necessary or proper in the exercise of the rights and powers herein granted.
  </p>
  
  
    2. This authorization may be revoked by the undersigned at any time by giving written notice to the party authorized herein. Any activity made before revocation in reliance upon this authorization shall not constitute a breach of rights of the client. If not earlier revoked, this authorization will automatically expire twelve months from the date of signature.
  </p>
  
  
    3. The party named above to receive the information is not authorized to make any further release or disclosure of the information received. This authorization does not authorize the release or disclosure of any information except as provided herein.
  </p>
  
  
    4. I grant you authority to do, take, and perform, all acts and things whatsoever requisite, proper, or necessary to be done, in the exercise of repairing my credit with the three consumer reporting agencies, which are TransUnion, Experian, Equifax, and any other reporting agencies or creditor’s listed, as fully for all intents and purposes as I might or could do if personally present.
  </p>
  
  
    5. I hereby release, you from all and all matters of actions, causes of action, suits, proceedings, debts, dues, contracts, judgments, damages, claims, and demands whatsoever in law or equity, for or because of any matter, cause, or thing whatsoever as based on the circumstances of this contract.
  </p>
  
  
    Consumer Credit File Rights Under State and Federal Law
  </p>
  
  
    You have a right to dispute inaccurate information in your consumer report by contacting the consumer reporting agencies directly. However, neither you nor a credit repair company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported up to 10 years.
  </p>
  
  
    You have a right to obtain a copy of your credit report from a consumer reporting agency. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your consumer reporting agencies within the preceding 60 days. The consumer reporting agency must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your consumer reporting agency if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your consumer reporting agency due to fraud.
  </p>
  
  
    You have a right to sue a credit repair organization that violated the Credit Repair Organization Act. This law prohibits deceptive practices by credit repair organizations.
  </p>
  
  
    You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.
  </p>
  
  
    consumer reporting agency are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.
  </p>
  
  
    You may on your own, notify a consumer reporting agency in writing that you dispute the accuracy of information in your credit file. The consumer reporting agency must then reinvestigate and modify or remove inaccurate or incomplete information. The consumer reporting agency may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the consumer reporting agency.                          </p>
  
  
    If the consumer reporting agencies reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the consumer reporting agencies to be kept in your file, explaining why you think the record is inaccurate. The consumer reporting agencies must include a summary of your statement about disputed information with any report it issues about you.
  </p>
  
  
    The Federal Trade Commission regulates credit bureaus and consumer reporting agencies organizations. For more information contact: The Public Reference Branch Federal Trade Commission Washington, D.C. 20580.
  </p>
  
  
    Notice of Right to Cancel
  </p>
  
  
    ''You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.
    
    
    ''To cancel this contract, contact the consumer reporting  agency, before midnight on the 3rd day which begins after the date you have signed this contract stating ''I hereby cancel this transaction, (date) (purchaser’s signature).’’
    
    
    Please acknowledge your receipt of this notice by electronically signing the form indicated below.
    
    
    Acknowledgment of Receipt of Notice
    
    
    I, the Client,  hereby acknowledge with my digital signature, receipt of the Notice of Right to Cancel. I confirm the fact that I agree and understand what I am signing, and acknowledge that I have received a copy of my Consumer Credit File Rights.
    
    
    *Digital Signatures: In 2000, the U.S. Electronic Signatures in Global and National Commerce (ESIGN) Act established electronic records and signatures as legally binding, having the same legal effects as traditional paper documents and handwritten signatures. Read more at the FTC website: http://www.ftc.gov/os/2001/06/esign7.html
  </p>
  
  
</div>
  `);



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
  const [documentInfoModalOpen, setDocumentInfoModalOpen] = useState(false);


  const [editFormData, setEditFormData] = useState({
    id: '',
    userTableId: '',
    name: '',
    email: '',
    dob: '',
    address: '',
    SSN: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    status: '',
    previous_mailing_address: '',
    previous_city: '',
    previous_state: '',
    previous_zip_code: '',
    previous_country: 'US',
    start_date: '',
    assigned_to: [],
    referred_by: '',
    referred_by_name: '',
    clientAgreement: '',
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
    dob: '',
    address: '',
    SSN: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    status: '',
    previous_mailing_address: '',
    previous_city: '',
    previous_state: '',
    previous_zip_code: '',
    previous_country: 'US',
    start_date: '',
    assigned_to: [],
    referred_by: '',
    clientAgreement: defaultContent,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoader(true);
    try {
      const response = await axios.post(ADD_CLIENT_DATA, { formData },
        { headers: { "Authorization": "Bearer " + token } });
      getClientData();
      setFeedbackModalOpen(false);
      toast.success(response.data.message || "Letter added successfully");

      setIsSubmitLoader(false);
      getClientData();
    } catch (error) {
      setIsSubmitLoader(false);
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const getClientData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_CLIENT_DATA, {},
        { headers: { "Authorization": "Bearer " + token } });
      setIsClientData(response.data);
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

  const deleteClientData = async () => {
    try {
      const response = await axios.post(DELETE_CLIENT, {
        clientId: deactiveClientId,
      },
        { headers: { "Authorization": "Bearer " + token } });
      setBasicModalOpen(false);
      toast.success(response.data.message || "Client deleted successfully");
      getClientData()
    } catch (error) {
      setBasicModalOpen(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
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

  const editClientDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_CLIENT_DETAILS, {
        client_id: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.clientData) {
        setEditFormData({
          id: response?.data?.clientData._id,
          userTableId: response?.data?.clientData.user_table_id,
          name: response?.data?.clientData.name,
          email: response?.data?.clientData.client_email,
          dob: response?.data?.clientData.dob,
          address: response?.data?.clientData.address,
          city: response?.data?.clientData.city,
          state: response?.data?.clientData.state,
          zip: response?.data?.clientData.zip,
          country: 'US',
          SSN: response?.data?.clientData.SSN,
          phone: response?.data?.clientData.phone,
          status: response?.data?.clientData.status,
          previous_mailing_address: response?.data?.clientData.previous_mailing_address,
          previous_city: response?.data?.clientData.previous_city,
          previous_state: response?.data?.clientData.previous_state,
          previous_zip_code: response?.data?.clientData.previous_zip_code,
          previous_country: 'US',
          start_date: response?.data?.clientData.start_date,
          assigned_to: response?.data?.clientData.assigned_to,
          referred_by: response?.data?.clientData.referred_by,
          clientAgreement: response?.data?.clientData.clientAgreement

        });
        if (response?.data?.clientData?.assigned_to?.length > 0) {
          setTagsEdit(response?.data?.clientData?.assigned_to)
        }

        setEditInfoModalOpen(true);
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const viewClientDetails = async (id) => {

    try {
      const response = await axios.post(EDIT_CLIENT_DETAILS, {
        client_id: id,
      },

        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.clientData) {
        setEditFormData({
          name: response?.data?.clientData.name,
          email: response?.data?.clientData.client_email,
          dob: response?.data?.clientData.dob,
          address: response?.data?.clientData.address,
          city: response?.data?.clientData.city,
          state: response?.data?.clientData.state,
          zip: response?.data?.clientData.zip,
          country: 'US',
          phone: response?.data?.clientData.phone,
          SSN: response?.data?.clientData.SSN,
          status: response?.data?.clientData.status,
          previous_mailing_address: response?.data?.clientData.previous_mailing_address,
          previous_city: response?.data?.clientData.previous_city,
          previous_state: response?.data?.clientData.previous_state,
          previous_zip_code: response?.data?.clientData.previous_zip_code,
          previous_country: 'US',
          start_date: response?.data?.clientData.start_date,
          assigned_to: response?.data?.clientData.assigned_to,
          referred_by: response?.data?.clientData.referred_by,
          referred_by_name: response?.data?.clientData.referred_by_name,
          clientAgreement: response?.data?.clientData.clientAgreement
        });
        setViewInfoModalOpen(true);
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

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

      if (documentTypeInputRef.current) {
        documentTypeInputRef.current.selectedIndex = 0;
      }
      showClientDocuments(clientUserTableId);
      setIsButtonLoader("");
      toast.success("Image uploaded successfully!");
    } catch (error) {
      setIsButtonLoader("");
      toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_CLIENT_DATA, { editFormData },
        { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Client updated successfully");
      getClientData();

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

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleUploadCsv = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(UPLOAD_CSV_FILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + token
        }
      });
      getClientData();
      toast.success(response.data.message || "Client Imported Successfully");
      setSuccessModalOpen(false);

      // Reset file input value after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input value to clear the selected file
        getClientData();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const downLoadDocument = async (isKeyId, isBucketName, index) => {
    try {
      const response = await axios.post(GET_DOC_FROM_AWS, {
        Key: "my_clients_12-20-2023.csv",
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

  const handleInputChange = (input) => {
    // Only show suggestions if input length > 0
    if (input.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
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
    getClientData();
    getUserData();
    getAffiliateData();
    getAgentsData();
  }, []);


  const handleClientStagesOrStatus = async (e, type, user_id) => {
    e.preventDefault()
    try {
      let value = e.target.value;
      const response = await axios.post(UPDATE_CLIENT_STAGES_OR_STATUS, { value, type, user_id },
        { headers: { "Authorization": "Bearer " + token } });
      getClientData();
      toast.success(response.data.message || "Client updated successfully");
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };



  const deactiveClient = async (type, clientIdactive) => {
    try {
      const response = await axios.post(DEACTIVE_CLIENT, { clientId: deactiveClientId, type, clientIdactive },
        { headers: { "Authorization": "Bearer " + token } });
      getClientData();
      toast.success(response.data.message || "Client Deactived Successfully");
      setBasicModalOpen(false);
      setDeactiveClientId('');
    } catch (error) {
      setDeactiveClientId('');
      setBasicModalOpen(false);
      toast.error("Something went wrong.");
      console.error('Error uploading file:', error);
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

  const ReSendLoginDetailsByMail = async (val) => {
    setsetLoader(true);
    try {
      const response = await axios.post(RESEND_LOGIN_DETAILS_TO_CLIENT_BY_MAIL, {
        UserId: val,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success("success");
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  }


  const handleAgreementTab = (e) => {
    if (e === true) {
      // Validate if all required fields are filled
      const requiredFields = {
        name: 'Name',
        email: 'Email',
        dob: 'Date of Birth',
        address: 'Address',
        SSN: 'SSN',
        city: 'City',
        state: 'State',
        zip: 'ZIP Code',
        phone: 'Phone',
        status: 'Status',
        start_date: 'Start Date',
      };

      for (const [key, label] of Object.entries(requiredFields)) {
        if (!formData[key] || formData[key].trim() === '') {
          toast.error(`${label} is required`);
          return;
        }
      }

      setIsAgreementStep(e);
    } else {
      setIsAgreementStep(e);
    }
  };

  const handleEditAgreementTab = (e) => {
    if (e === true) {
      //   // Validate if all required fields are filled
      //   const requiredFields = {
      //     name: 'Name',
      //     email: 'Email',
      //     dob: 'Date of Birth',
      //     address: 'Address',
      //     SSN: 'SSN',
      //     city: 'City',
      //     state: 'State',
      //     zip: 'ZIP Code',
      //     phone: 'Phone',
      //     status: 'Status',
      //     start_date: 'Start Date',
      //   };

      //   for (const [key, label] of Object.entries(requiredFields)) {
      //     if (!formData[key] || formData[key].trim() === '') {
      //       toast.error(`${label} is required`);
      //       return;
      //     }
      //   }

      setEditIsAgreementStep(e);
    } else {
      setEditIsAgreementStep(e);
    }
  };


  const handleOpenClientAddPopup = (e) => {
    setIsAgreementStep(false);
    setFormData({
      name: '',
      email: '',
      dob: '',
      address: '',
      SSN: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      phone: '',
      status: '',
      previous_mailing_address: '',
      previous_city: '',
      previous_state: '',
      previous_zip_code: '',
      previous_country: 'US',
      start_date: '',
      assigned_to: [],
      clientAgreement: defaultContent,
    })
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };


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
          <main className="grow">
            <div className="py-8 mx-4 sm:mx-8">
              <div className="sm:flex sm:justify-between sm:items-center border-b pb-2 mb-4">
                <div className="mb-4 sm:mb-0 flex items-center">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Clients</h1>
                  <button className="text-rose-500 hover:text-rose-600 rounded-full flex items-center"
                    // onClick={(e) => { e.stopPropagation(); setDeleteReportModalOpen(true); setReportID(data?._id) }}
                    onClick={(e) => { e.stopPropagation(); setLeadsVideoModalOpen(true); }}
                  >
                    <img width={30} style={{ height: "30px" }} src={video_icon}></img>
                    <span style={{ color: "blue" }}>Video Adding Clients and Leads</span>
                  </button>
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
                  {/* <div className='w-1/2 sm:w-auto p-1'>
                    <div className='flex flex-col'>
                      {!(UserData?.plan_name === 1 || UserData?.plan_name === 5) &&
                        <Link className="btn-sm tm-background text-white rounded-full px-3 py-2" to={`/dashboard/${user._id}`}>
                          View My Report
                        </Link>
                      }
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto p-1'>
                    <div className='flex flex-col'>
                      <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={downLoadDocument}>Download Sample CSV</button>
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto p-1'>
                    <div className='flex flex-col'>
                      <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}>Import CSV</button>
                    </div>
                  </div> */}

                  <div className='sm:w-auto p-1'>
                    <div className='flex'>
                      {/* {user?.role === "agent" &&
                        <Link
                          className="btn-sm tm-background text-white rounded-full px-3 py-2 me-2"
                          to="/agreement-content"
                        >
                          Client Agreement
                        </Link>
                      } */}
                      <button className="btn-sm tm-background text-white rounded-full px-3 py-2" aria-controls="feedback-modal" onClick={(e) => { handleOpenClientAddPopup(e) }}>
                        Add New Client
                      </button>
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
                      <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isClientData ? isClientData?.length : 0}</span> </p>
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
                          <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                            <tr>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                                <div className="font-semibold text-left">Name</div>
                              </th>
                              {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Assigned To</div>
                          </th> */}
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">	Agent Name</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Added</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Start Date</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Last Login</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Client Stages</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Client Status</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Actions</div>
                              </th>
                              <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                                <div className="font-semibold text-left"></div>
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                            {isClientData && isClientData?.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize font-bold tm-color">
                                    <Link to={`/dashboard/${data?.user_table_id}`}>
                                      {data?.name ? data?.name : "-"}
                                    </Link>
                                  </td>
                                  {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                {data?.assigned_to ? data?.assigned_to : "-"}
                              </td> */}
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize">
                                    {data?.assigned_to?.length > 0
                                      ? data.assigned_to.map((item, index) => (
                                        <span key={index}>
                                          {item.text}
                                          {index < data.assigned_to.length - 1 && ", "}
                                        </span>
                                      ))
                                      : "-"}
                                  </td>

                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    {data?.created_at ? moment(data?.created_at).format('MM/DD/YYYY') : "-"}
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    {data?.start_date ? moment(data?.start_date).format('MM/DD/YYYY') : "-"}
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    {data?.last_login ? moment(data?.last_login).format('MM/DD/YYYY hh:mm:ss A') : "-"}
                                  </td>
                                  <td>
                                    <select value={data?.client_stages} onChange={(e) => { handleClientStagesOrStatus(e, "client_stages", data?._id) }} className='btn justify-between bg-white dark:bg-slate-800 border-black  !hover:border-black text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200'>
                                      <option value="1">New Lead</option>
                                      <option value="2">Paid Client</option>
                                      <option value="3">Agreement Pending</option>
                                      <option value="4">Report Pending </option>
                                      <option value="5">Documents Pending </option>
                                      <option value="6">Round 1 Letters Sent</option>
                                      <option value="7">Round 2 Letters Sent</option>
                                      <option value="8">Round 3 Letters Sent</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select value={data?.client_Status} onChange={(e) => { handleClientStagesOrStatus(e, "client_status", data?._id) }} className='btn justify-between bg-white dark:bg-slate-800 border-black  !hover:border-black text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200'>
                                      <option value="1">Leads</option>
                                      <option value="2">Prospect</option>
                                      <option value="3">Active Client</option>
                                      <option value="4">Inactive Client</option>
                                      <option value="5">Suspended</option>
                                      <option value="6">Canceled</option>
                                    </select>
                                  </td>
                                  <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                    <div className='flex items-end	'>
                                      <button
                                        onClick={(e) => { viewClientDetails(data?._id) }}
                                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                        <span className="sr-only">view</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                      </button>
                                      <> <button
                                        onClick={(e) => { editClientDetails(data?._id) }}
                                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                        <span className="sr-only">Edit</span>
                                        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                          <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                        </svg>
                                      </button>
                                        {data?.account_status != "inactive" &&
                                          <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(true); setDeactiveClientId(data?._id) }}>
                                            <span className="sr-only">Delete</span>
                                            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                              <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                              <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                            </svg>
                                          </button>
                                        }
                                      </>
                                      <button className="ms-3 btn-sm tm-background text-white rounded-full " onClick={() => ReSendLoginDetailsByMail(data?._id)}>Resend credentials</button>
                                      <button
                                        onClick={(e) => { showClientDocuments(data?.user_table_id) }}
                                        className="ms-3 btn-sm tm-background text-white rounded-full">
                                        Show Documents
                                      </button>

                                    </div>
                                  </td>
                                  {data?.account_status === "inactive" &&
                                    <td>
                                      <button className=" px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize text-green-500 hover:text-green-600 rounded-full" onClick={(e) => { e.stopPropagation(); deactiveClient("active", data?._id) }}>
                                        activate client
                                      </button>
                                    </td>
                                  }
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
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isClientData ? isClientData?.length : 0}</span> </p>
                    <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {isClientData && isClientData?.map((data, index) => {
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
                                        <div className="font-semibold text-left">Agent Name</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.agent_data ? data?.agent_data[0]?.name : "-"}
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
                                        {data?.start_date ? moment(data?.start_date).format('MM/DD/YYYY') : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Last Login</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.last_login ? moment(data?.last_login).format('MM/DD/YYYY hh:mm:ss A') : "-"}
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
                                          onClick={(e) => { viewClientDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">view</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                        </button>
                                        <button
                                          onClick={(e) => { editClientDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                          </svg>
                                        </button>
                                        {data?.account_status != "inactive" &&
                                          <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(true); setDeactiveClientId(data?._id) }}>
                                            <span className="sr-only">Delete</span>
                                            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                              <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                              <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                            </svg>
                                          </button>
                                        }
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Resend credentials</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <button className="btn-sm tm-background text-white rounded-full " onClick={() => ReSendLoginDetailsByMail(data?._id)}>Resend credentials</button>
                                      </td>
                                    </tr>

                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Show Documents</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <button className="btn-sm tm-background text-white rounded-full " onClick={(e) => { showClientDocuments(data?.user_table_id) }}>Show Documents</button>
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

        <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Client">
          <form onSubmit={handleSubmit}>
            <div>
              {!isAgreementStep ?
                <>

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
                        Date of Birth<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="date" name='dob'
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
                        Address<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="text" name='address'
                          value={formData.address}
                          onChange={handleChange}
                          placeholder='Enter address here'
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                        City<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="text" name='city'
                          value={formData.city}
                          onChange={handleChange}
                          placeholder='Enter city here'
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        State<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select
                          required
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
                          Zip<span className='text-red-500'>*</span>
                        </label>
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" required className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='zip'
                          value={formData.zip}
                          onChange={handleChange}
                          placeholder='Enter zip here'
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Country<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='country'
                          value="United States"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Phone (M)<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" required className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='phone'
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder='Enter phone number here'
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                          Status<span className='text-red-500'>*</span>
                        </label>
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select id="status" required name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          value={formData.status}
                          onChange={handleChange}>
                          <option value="" disabled>Select Status</option>
                          <option value="client">Client</option>
                          <option value="lead">Lead</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        SSN (Last 4 digit) <span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          id="SSN"
                          maxLength={4}
                          required
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          name="SSN"
                          value={formData.SSN}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                          placeholder='Enter ssn here'
                        />
                      </div>
                    </div>
                    <div>
                      <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Assigned To
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <div className='bg-slate-100 pt-0 pb-1 px-2 rounded-[20px] text-gray-800 placeholder-gray-500  border-none'>
                          <ReactTags
                            tags={tags}
                            suggestions={suggestions}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            inputFieldPosition="inline"
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

                  <div className="grid gap-5 md:grid-cols-1 ps-5 pe-5 mt-5 mb-5">
                    <div className='flex'>
                      <input
                        className='mt-1'
                        type="checkbox"
                        id="myCheckbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <label className="block text-sm font-medium mb-1 ms-2" htmlFor="default">
                        <span className='tm-color'>Previous address</span> (If at current address less than 2 years)
                      </label>
                    </div>
                  </div>

                  <hr></hr>

                  {isChecked &&
                    <>
                      <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous mailing address
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_mailing_address'
                              value={formData.previous_mailing_address}
                              onChange={handleChange}
                              placeholder='Previous mailing address'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                            Previous city
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_city'
                              value={formData.previous_city}
                              onChange={handleChange}
                              placeholder='Previous city'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous state
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_state'
                              value={formData.previous_state}
                              onChange={handleChange}
                              placeholder='Previous state'
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                              Previous zip code
                            </label>
                          </div>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='previous_zip_code'
                              value={formData.previous_zip_code}
                              onChange={handleChange}
                              placeholder='Previous zip code'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous country
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='previous_country'
                              value="United State"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                    </>
                  }
                  <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Start date<span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input required id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="date" name='start_date'
                          value={formData.start_date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                          Referred By
                        </label>
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select name="referred_by" value={formData.referred_by} onChange={handleChange} autoComplete="referred_by" className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                          <option value="">Select a referred by</option>
                          {/* {agentData?.agent?.map((agent, index) => (
                          <option key={index} value={agent?._id}>{agent?.user[0]?.name}</option>
                        ))} */}
                          {isAffiliateData?.map((user, index) => (
                            <option key={index} value={user?._id}>{user?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                </>
                :
                <>
                  <div className="pl-2 py-2 w-full">
                    < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                          Client Agreement<span className='text-red-500'>*</span>
                        </label>
                      </div>
                      <CKEditor
                        className="rounded-2xl"
                        rows={15}
                        editor={ClassicEditor}
                        data={formData?.clientAgreement ? formData?.clientAgreement : defaultContent}
                        config={{
                          ckfinder: {
                            uploadUrl: ""
                          }
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          if (data) {
                            setFormData({ ...formData, clientAgreement: data })
                          }
                        }}
                      />
                    </div>
                    <div className='text-center me-5'>
                      {/* {submitLoader ?
                        <button className="ms-3 btn-sm tm-background text-white rounded-full" disabled>
                          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                          <span className="ml-2">Update Agreement</span>
                        </button>
                        :
                        <button
                          onClick={(e) => { addClientAgreementContent() }}
                          className="ms-3 btn-sm tm-background text-white rounded-full">
                          Update Agreement
                        </button>
                      } */}

                    </div>
                  </div>
                </>
              }


              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  {isAgreementStep ?
                    <>
                      {isSubmitLoader ?
                        <span disabled className='items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'>Add Client</span></span>
                        :
                        <>
                          <p onClick={(e) => { e.stopPropagation(); handleAgreementTab(false); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Back</p>
                          <button className=" items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white">Add Client</button>
                        </>
                      }
                    </>
                    :
                    <>
                      <span onClick={(e) => { e.stopPropagation(); handleAgreementTab(true); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Next</span>
                    </>
                  }


                </div>
              </div>
            </div>
          </form>
        </ModalBasic>


        <ModalBasic id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Client">
          <form onSubmit={handleEditSubmit}>
            <div>
              {!isEditAgreementStep ?
                <>
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
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        SSN
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          id="SSN"
                          maxLength={4}
                          required
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                          name="SSN"
                          value={editFormData.SSN}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                              handleEditChange(e);
                            }
                          }}
                        />
                      </div>

                    </div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Assigned To
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                        <div className='bg-slate-100 pt-0 pb-1 px-2 rounded-[20px] text-gray-800 placeholder-gray-500  border-none'>
                          <ReactTags
                            tags={tagsEdit}
                            suggestions={suggestions}
                            handleDelete={handleDeleteEdit}
                            handleAddition={handleAdditionEdit}
                            inputFieldPosition="inline"
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

                  <div className="grid gap-5 md:grid-cols-1 ps-5 pe-5 mt-5 mb-5">
                    <div className='flex'>
                      <input
                        className='mt-1'
                        type="checkbox"
                        id="myCheckbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <label className="block text-sm font-medium mb-1 ms-2" htmlFor="default">
                        <span className='tm-color'>Previous address</span> (If at current address less than 2 years)
                      </label>
                    </div>
                  </div>

                  <hr></hr>

                  {isChecked &&
                    <>
                      <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous mailing address
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_mailing_address'
                              value={editFormData.previous_mailing_address}
                              onChange={handleEditChange}
                              placeholder='Previous mailing address'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                            Previous city
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_city'
                              value={editFormData.previous_city}
                              onChange={handleEditChange}
                              placeholder='Previous city'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous state
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_state'
                              value={editFormData.previous_state}
                              onChange={handleEditChange}
                              placeholder='Previous state'
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                              Previous zip code
                            </label>
                          </div>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='previous_zip_code'
                              value={editFormData.previous_zip_code}
                              onChange={handleEditChange}
                              placeholder='Previous zip code'
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                            Previous country
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                            <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='previous_country'
                              value="United State"
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                    </>
                  }

                  <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Start date
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="date" name='start_date'
                          value={editFormData.start_date}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                          Referred By
                        </label>
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select id="referred_by" name='referred_by' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          value={editFormData.referred_by}
                          onChange={handleEditChange}>
                          <option value="">Select a referred by</option>
                          {/* {agentData?.agent?.map((agent, index) => (
                          <option key={index} value={agent?._id} checked={editFormData.referred_by == agent?._id}>{agent?.user[0]?.name}</option>
                        ))} */}
                          {isAffiliateData?.map((user, index) => (
                            <option key={index} value={user?._id} checked={editFormData.referred_by == user?._id}>{user?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>


                  </div>

                </>
                :

                <div className='ps-5 pe-5 mt-5 mb-5 '>
                  <CKEditor
                    className="rounded-2xl"
                    rows={15}
                    editor={ClassicEditor}
                    data={editFormData?.clientAgreement ? editFormData?.clientAgreement : defaultContent}
                    config={{
                      ckfinder: {
                        uploadUrl: ""
                      }
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      if (data) {
                        setEditFormData({ ...editFormData, clientAgreement: data })
                      }
                    }}
                  />
                </div>
              }


              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  {isEditAgreementStep ?
                    <>
                      {isSubmitLoader ?
                        <span disabled className='items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'>Add Client</span></span>
                        :
                        <>
                          <p onClick={(e) => { e.stopPropagation(); handleEditAgreementTab(false); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Back</p>
                          <button className="cursor-pointer items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white">Update</button>

                        </>
                      }
                    </>
                    :
                    <>
                      <span onClick={(e) => { e.stopPropagation(); handleEditAgreementTab(true); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Next</span>
                    </>
                  }
                </div>
              </div>
            </div>
          </form>
        </ModalBasic>


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

                  <div className='flex flex-col md:flex-row justify-evenly space-x-3 px-2 py-3 rounded-lg' >
                    {/* {userdetails?.photo_id ? "" : */}
                    <div>
                      <div className=''>
                        <div>
                          {userdetails?.photo_id &&
                            <>
                              <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                Photo Id
                              </label>
                              <div className='flex justify-center  items-center	'>
                                <a href={userdetails?.photo_id} target="_blank" rel="noopener noreferrer">
                                  <img src={userdetails?.photo_id} width={200} className='mb-3' />
                                </a>
                              </div>
                            </>
                          }
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                            <input type="file" onChange={handleFileChange} ref={fileInputRef}
                              className="form-contorl form-input w-full p-3 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" />
                          </div>
                        </div>
                        <div className='mb-5'>
                          {isButtonLoader === "photo_id" ?
                            <button className='w-full items-center btn-sm mt-3 py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'> {userdetails?.proof_of_address ? "Changing" : "Uploading"
                            }</span></button>
                            :
                            <button className='w-full items-center btn-sm mt-3 py-2 px-5 rounded-3xl tm-background text-white'
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
                            <>
                              <label className="text-center block font-bold mb-1" htmlFor="card-name">
                                Proof of address
                              </label>
                              <div className='flex justify-center items-center	'>
                                <img src={userdetails?.proof_of_address} width={200} className='mb-3' />
                              </div>
                            </>

                          }
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                            <input type="file" onChange={handleFileChange} ref={fileInputRef}
                              className="form-contorl form-input w-full p-3 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none" />
                          </div>
                        </div>
                        <div className='items-center'>
                          {isButtonLoader === "proof_of_address" ?
                            <button className='w-full items-center btn-sm mt-3 py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'> {userdetails?.proof_of_address ? "Changing" : "Uploading"
                            }</span></button>
                            :
                            <button className='w-full items-center btn-sm mt-3 py-2 px-5 rounded-3xl tm-background text-white'
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



        <ModalBasic id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Client ">
          <div>
            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
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
                  Date of Birth
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='dob'
                    value={editFormData.dob}
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
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  SSN
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" maxLength={4} className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="number" disabled name='SSN'
                    value={editFormData.SSN}
                  />
                </div>
              </div>
            </div>
            <hr></hr>
            <>
              <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                {editFormData.previous_mailing_address &&
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="default">
                      Previous mailing address
                    </label>
                    <input id="default" className="form-input w-full" type="text" name='previous_mailing_address'
                      value={editFormData.previous_mailing_address}
                    />
                  </div>
                }
                {editFormData.previous_city &&
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="mandatory">
                      Previous city
                    </label>
                    <input id="default" className="form-input w-full" type="text" name='previous_city'
                      value={editFormData.previous_city}
                    />
                  </div>
                }

                {editFormData.previous_state &&
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="default">
                      Previous state
                    </label>
                    <input id="default" className="form-input w-full" type="text" name='previous_state'
                      value={editFormData.previous_state}
                    />
                  </div>
                }

                {editFormData.previous_zip_code &&
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                        Previous zip code
                      </label>
                    </div>
                    <input id="default" className="form-input w-full" type="text" maxLength={5} name='previous_zip_code'
                      value={editFormData.previous_zip_code}
                    />
                  </div>
                }
                {editFormData.previous_zip_code && editFormData.previous_state && editFormData.previous_city &&
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="default">
                      Previous country
                    </label>
                    <input id="default" className="form-input w-full" type="text" disabled name='previous_country'
                      value="United State"
                    />
                  </div>
                }
              </div>
            </>
            {editFormData.previous_zip_code && editFormData.previous_state && editFormData.previous_city &&
              <hr></hr>
            }

            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Start date
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" name='start_date'
                    value={editFormData.start_date}
                  />
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                  Assigned To
                </label>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" name='assigned_to'
                    value={UserData?.name}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                    Referred By
                  </label>
                </div>
                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                  <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" name='referred_by'
                    value={editFormData.referred_by_name}
                  />
                </div>
              </div>


            </div>
            <div className='ps-5 pe-5 mb-5'>
              <div className="flex items-center justify-between ">
                <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                  Client Agreement
                </label>
              </div>
              <CKEditor
                className="rounded-2xl"
                editor={ClassicEditor}
                data={editFormData.clientAgreement ? editFormData.clientAgreement : defaultContent}
                config={{
                  ckfinder: {
                    uploadUrl: "",
                  },
                  readOnly: true,
                  toolbar: [],
                }}
                onReady={(editor) => {
                  editor.enableReadOnlyMode("read-only-mode");
                }}
                onChange={(event, editor) => {
                  if (!editor.isReadOnly) {
                    const data = editor.getData();
                    setFormData({ ...formData, clientAgreement: data });
                  }
                }}
              />

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
                  <p>Choose a CSV file to import your clients.</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-center space-x-2">
                <input
                  type="file"
                  className='form-contorl btn  mb-4'
                  style={{ border: "1px solid" }}
                  onChange={handleFileUpload}
                  ref={fileInputRef} // Assign the ref to the file input
                />
                {/* <input type="file" className='form-contorl btn  mb-4' style={{ border: "1px solid" }} onChange={handleFileUpload} /> */}
                <button className="btn-sm tm-background text-white" onClick={handleUploadCsv}>Upload CSV</button>
              </div>
            </div>
          </div>
        </ModalBlank>
        <ModalBasic id="basic-modal" modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title="Deactivate/Delete Client">
          {/* Modal content */}
          <div className="px-5 pt-4 pb-1">
            <div className="">
              <div className="font-2xl text-slate-800 dark:text-slate-100 mb-2">WARNING!</div>
              <div className="space-y-2">
                <p>Are you sure you want to delete this client?</p>
                <h1 className='font-2xl'>Deleting a Client will erase all their information, documents, notes and messages permanently.</h1>
                <p>Another option is to deactivate this client and keep the work history.</p>
              </div>
            </div>
          </div>
          {/* Modal footer */}
          <div className="px-5 py-4">
            <div className="flex flex-wrap justify-end space-x-2">
              <button className="btn-sm tm-background text-white rounded-full px-3 py-2" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(false); }}>Close</button>
              <button onClick={() => deleteClientData()} className="btn-sm tm-background text-white rounded-full px-3 py-2">Delete</button>
              <button onClick={(e) => { deactiveClient("deactive") }} className="btn-sm tm-background text-white rounded-full px-3 py-2">Deactive</button>
            </div>
          </div>
        </ModalBasic>
      </div>
      {/* <Footer></Footer> */}
    </>

  );
}

export default ClientsPage;
