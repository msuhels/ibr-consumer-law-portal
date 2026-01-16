import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GET_USER_DETAILS, GET_USER_CLIENT_AGREEMENT_DATA, UPDATE_USER_SUBSCRIPTION, SUBMIT_CLIENT_AGREEMENT, UPLOAD_Signature_ON_AWS, UPLOAD_IMAGES_ON_AWS } from "../../API/api";
import ModalBlank from "../../components/ModalBlank";
import { BackendUrl } from "../../Config";
import Header from '../../partials/Header';
import SignatureCanvas from 'react-signature-canvas'
import PayBg from "../../images/plann.png";
import parse from 'html-react-parser';

function ClientAgreement() {
  const signatureRef = useRef({});
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const userToken = Cookies.get("user_token");
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');
  const [penColor, setPenColor] = useState('black')
  const [loaderSignin, setloaderSignin] = useState(false);
  const [UserData, setUserData] = useState("");
  const [getplan, setGetPlan] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [upgradeNewPlan, setupgradeNewPlan] = useState(false);
  const [basicLoader, setPasicLoader] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [primiumLoader, setPrimiumLoaderr] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);
  const [openModal, setOpenModal] = useState(false)
  const [isAdditionalDays, setIsAdditionalDays] = useState("");
  const fileInputRef = useRef(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const colors = ['black', 'green', 'red'];
  const [setLoader, setsetLoader] = useState(false);

  const [clientAgreementData, setClientAgreementData] = useState('');

  const [newPlanDetails, setNewPlanDetails] = useState([
    {
      plan_name: "",
      time: "",
      amount: "",
    },
  ]);

  const clearSignature = () => {
    signatureRef.current.clear();
  };
  const [isTrialStatus, setIsTrialStatus] = useState("");

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };

  const getPricingplan = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/user/get-pricing-plan`);
      setGetPlan(response?.data?.Plan);
    } catch (error) {
      toast.error(
        error.response.data.message ||
        "Sign in failed. Please check your credentials."
      );
    }
  };

  const CreateSubscription = async (Price_id, plan) => {
    if (plan === "basic_plan") {
      setPasicLoader(true);
    } else {
      setPrimiumLoaderr(true);
    }
    try {
      const response = await axios.post(`${BackendUrl}user/buy-subsciption`, {
        priceID: Price_id,
        userData: userToken,
      });
      let clientSecret = response.data.clientSecret;
      if (plan === "basic_plan") {
        setPasicLoader(false);
      } else {
        setPrimiumLoaderr(false);
      }
      if (response?.data?.clientSecret) {
        navigate("/pay", {
          state: { clientSecret },
        });
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
        "Sign in failed. Please check your credentials."
      );
      if (plan === "basic_plan") {
        setPasicLoader(false);
      } else {
        setPrimiumLoaderr(false);
      }
    }
  };

  useEffect(() => {
    getPricingplan();
    getUserData();
  }, []);


  const formatContent = (htmlContent) => {
    return htmlContent
      .replace(/<br\s*\/?>/gi, "\n")         // Convert <br> tags to newlines
      .replace(/<\/?p>/gi, "\n")             // Add newlines around <p> tags
      .replace(/<\/?[^>]+(>|$)/g, "");       // Remove other HTML tags
  };

  const getUserClientAgreementContent = async (idd) => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_USER_CLIENT_AGREEMENT_DATA, { user_id: idd }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.clientAgreement) {
        setClientAgreementData(response?.data?.clientAgreement);
      }
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      console.log("Something went Wrong");
    }
  };


  function getRemainingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceMs = end - start;

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }


  const handleFileChange = async (event, type) => {
    // console.log(event.target.files[0]);
    // console.log(type);
    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (!event.target.files[0]) {
        toast.error("Please select a Document");
        return;
      }

      if (!allowedTypes.includes(event.target.files[0].type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, JPG)");
        return;
      }

      if (event.target.files[0].size > maxSize) {
        toast.error("Image size exceeds 5MB limit");
        return;
      }
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      formData.append('documentType', type);
      formData.append('user_id', id);
      // formData.append('letter_id', selectedItems[0]._id);
      await axios.post(UPLOAD_IMAGES_ON_AWS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + token
        }
      });
      getUserData();
      // setSelectedDocumentType('');
      // setSelectedFile(null);


      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // if (documentTypeInputRef.current) {
      //   documentTypeInputRef.current.selectedIndex = 0; 
      // }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }

    // setSelectedFile(event.target.files[0]);
  };

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
      getUserData();
      setSelectedDocumentType('');
      setSelectedFile(null);


      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // if (documentTypeInputRef.current) {
      //   documentTypeInputRef.current.selectedIndex = 0; 
      // }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.response.data || "Error uploading image!");
      console.error(error);
    }
  };

  const saveSignature = async () => {
    const canvasData = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    try {
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

  const upgradePlan = async (plan_name, time, amount) => {
    setNewPlanDetails([
      {
        plan_name: plan_name,
        time: time,
        amount: amount,
      },
    ]);
    const today = new Date();
    if (
      UserData?.plan_name === plan_name &&
      UserData?.interval_length === "12"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      (UserData?.plan_name === "6" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      (UserData?.plan_name === "2" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    if (
      UserData?.plan_name === "3" ||
      (UserData?.plan_name === "7" && plan_name === "1") ||
      plan_name === "5"
    ) {
      return setInfoModalOpen(true);
    }
    // const startDate = UserData?.start_date ? new Date(UserData.start_date) : null;
    if (UserData?.is_trial === "true") {
      setIsTrialStatus("incomplete");
      setupgradeNewPlan(true);
    } else {
      setIsTrialStatus("complete");
      const remainingDays = getRemainingDays(
        UserData?.start_date,
        UserData?.end_date
      );
      var planInDays = "";
      var planAmountPerDay = "";
      var remainingAmount = "";
      var newPlanInDays = "";
      var newPlanAmountPerDay = "";

      if (time === "MONTHLY") {
        newPlanInDays = 31;
      } else {
        newPlanInDays = 365;
      }

      if (UserData?.interval_length === "1") {
        planInDays = 31;
        planAmountPerDay = UserData?.plan_amount / planInDays;
        remainingAmount = planAmountPerDay * remainingDays;
        newPlanAmountPerDay = amount / newPlanInDays;
      } else {
        planInDays = 365;
        planAmountPerDay = UserData?.plan_amount / planInDays;
        remainingAmount = planAmountPerDay * remainingDays;
        newPlanAmountPerDay = amount / newPlanInDays;
      }
      setIsAdditionalDays(Math.floor(remainingAmount / newPlanAmountPerDay));
      setupgradeNewPlan(true);
    }
  };

  const buyUpgradedPlan = async () => {
    setloaderSignin(true);
    try {
      const response = await axios.post(
        UPDATE_USER_SUBSCRIPTION,
        {
          plan_name: newPlanDetails[0].plan_name,
          plan_time: newPlanDetails[0].time,
          plan_amount: newPlanDetails[0].amount,
          isAdditionalDays: isAdditionalDays,
          trialStatus: isTrialStatus,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.data) {
        getPricingplan();
        getUserData();
        setupgradeNewPlan(false);
        toast.success(response.data.msg);
        setloaderSignin(false);
      }
    } catch (error) {
      setloaderSignin(false);
      toast.error("Something went Wrong");
    }
  };

  const SubmitAgreement = async () => {
    try {
      const response = await axios.post(
        SUBMIT_CLIENT_AGREEMENT,
        {
          user_id: id
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      toast.success(response?.data?.message || "Agreement accepted and sumit successfully");
      navigate(`/dashboard/${id}`);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(id);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserData(response?.data?.UserDetails);
      if (response?.data?.UserDetails?.agent_id) {
        getUserClientAgreementContent(id);
      }
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const setDatasets = async (test) => {
    console.log(test, "test");
  };



  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <div className="flex h-[100vh] overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header></Header>
          <main className="grow">
            <div className="relative pt-10 pb-10">
              <div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div>
                  <div className="plan-loadera2 mt-3" style={{ padding: "0px!important" }}>
                    <div className="sm:p-5 p-3">
                      <div>
                        <div className="mb-2">
                          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Agreement for Client -
                          </div>
                        </div>
                        <div className="h-[70vh] overflow-y-scroll p-4 border rounded-md bg-white dark:bg-slate-800 dark:text-slate-100">
                          <div>
                            {clientAgreementData ?
                              parse(clientAgreementData)
                              :
                              <>
                                <div>
                                  <br></br>
                                  <p>
                                    I, Client, hereby enter into the following agreement with.
                                  </p>
                                  <br></br>
                                  <p>
                                    hereby agrees to perform the following:
                                  </p>
                                  <br></br>
                                  <p>
                                    To evaluate Customer's current credit reports as listed with applicable consumer reporting agencies and to identify inaccurate, erroneous, false, or obsolete information. To advise Customer as to the necessary steps to be taken on the part of Customer in conjunction with Our Company, to dispute any inaccurate, erroneous, false, or obsolete information contained in the Customer's credit reports.
                                  </p>
                                  <br></br>
                                  <p>
                                    To prepare all necessary correspondence in dispute of inaccurate, erroneous, false, or obsolete information in customer's credit reports.
                                  </p>
                                  <br></br>
                                  <p>
                                    To review credit profile status from consumer reporting such as Experian, Equifax, and Transunion.  Consulting, coaching, and monitoring services are conducted by personal meetings, webinars, video conferencing, telephone, email, or by any other form of communication during normal business hours.
                                  </p>
                                  <br></br>
                                  <p>
                                    In exchange, I, the Client, agree to pay the following fees as outlined in the following fee schedule:
                                  </p>
                                  <br></br>
                                  <p>
                                    (As discussed)
                                  </p>
                                  <br></br>
                                  <p>
                                    Authorization for Credit Repair Action
                                  </p>
                                  <br></br>
                                  <br></br>
                                  <p>
                                    1.  I,  Client, to make, receive, sign, endorse, execute, acknowledge, deliver, and possess such applications, correspondence, contracts, or agreements, as necessary to improve my credit. Such instruments in writing of whatever nature shall only be effective for any or all of the three consumer reporting agencies which are TransUnion, Experian, Equifax, and any other reporting agencies or creditors listed, as may be necessary or proper in the exercise of the rights and powers herein granted.
                                  </p>
                                  <br></br>
                                  <p>
                                    2. This authorization may be revoked by the undersigned at any time by giving written notice to the party authorized herein. Any activity made before revocation in reliance upon this authorization shall not constitute a breach of rights of the client. If not earlier revoked, this authorization will automatically expire twelve months from the date of signature.
                                  </p>
                                  <br></br>
                                  <p>
                                    3. The party named above to receive the information is not authorized to make any further release or disclosure of the information received. This authorization does not authorize the release or disclosure of any information except as provided herein.
                                  </p>
                                  <br></br>
                                  <p>
                                    4. I grant you authority to do, take, and perform, all acts and things whatsoever requisite, proper, or necessary to be done, in the exercise of repairing my credit with the three consumer reporting agencies, which are TransUnion, Experian, Equifax, and any other reporting agencies or creditor’s listed, as fully for all intents and purposes as I might or could do if personally present.
                                  </p>
                                  <br></br>
                                  <p>
                                    5. I hereby release, you from all and all matters of actions, causes of action, suits, proceedings, debts, dues, contracts, judgments, damages, claims, and demands whatsoever in law or equity, for or because of any matter, cause, or thing whatsoever as based on the circumstances of this contract.
                                  </p>
                                  <br></br>
                                  <p>
                                    Consumer Credit File Rights Under State and Federal Law
                                  </p>
                                  <br></br>
                                  <p>
                                    You have a right to dispute inaccurate information in your consumer report by contacting the consumer reporting agencies directly. However, neither you nor a credit repair company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported up to 10 years.
                                  </p>
                                  <br></br>
                                  <p>
                                    You have a right to obtain a copy of your credit report from a consumer reporting agency. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your consumer reporting agencies within the preceding 60 days. The consumer reporting agency must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your consumer reporting agency if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your consumer reporting agency due to fraud.
                                  </p>
                                  <br></br>
                                  <p>
                                    You have a right to sue a credit repair organization that violated the Credit Repair Organization Act. This law prohibits deceptive practices by credit repair organizations.
                                  </p>
                                  <br></br>
                                  <p>
                                    You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.
                                  </p>
                                  <br></br>
                                  <p>
                                    consumer reporting agency are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.
                                  </p>
                                  <br></br>
                                  <p>
                                    You may on your own, notify a consumer reporting agency in writing that you dispute the accuracy of information in your credit file. The consumer reporting agency must then reinvestigate and modify or remove inaccurate or incomplete information. The consumer reporting agency may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the consumer reporting agency.                          </p>
                                  <br></br>
                                  <p>
                                    If the consumer reporting agencies reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the consumer reporting agencies to be kept in your file, explaining why you think the record is inaccurate. The consumer reporting agencies must include a summary of your statement about disputed information with any report it issues about you.
                                  </p>
                                  <br></br>
                                  <p>
                                    The Federal Trade Commission regulates credit bureaus and consumer reporting agencies organizations. For more information contact: The Public Reference Branch Federal Trade Commission Washington, D.C. 20580.
                                  </p>
                                  <br></br>
                                  <p>
                                    Notice of Right to Cancel
                                  </p>
                                  <br></br>
                                  <p>
                                    ''You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.
                                    <br></br>
                                    <br></br>
                                    ''To cancel this contract, contact the consumer reporting  agency, before midnight on the 3rd day which begins after the date you have signed this contract stating ''I hereby cancel this transaction, (date) (purchaser’s signature).’’
                                    <br></br>
                                    <br></br>
                                    Please acknowledge your receipt of this notice by electronically signing the form indicated below.
                                    <br></br>
                                    <br></br>
                                    Acknowledgment of Receipt of Notice
                                    <br></br>
                                    <br></br>
                                    I, the Client,  hereby acknowledge with my digital signature, receipt of the Notice of Right to Cancel. I confirm the fact that I agree and understand what I am signing, and acknowledge that I have received a copy of my Consumer Credit File Rights.
                                    <br></br>
                                    <br></br>
                                    *Digital Signatures: In 2000, the U.S. Electronic Signatures in Global and National Commerce (ESIGN) Act established electronic records and signatures as legally binding, having the same legal effects as traditional paper documents and handwritten signatures. Read more at the FTC website: http://www.ftc.gov/os/2001/06/esign7.html
                                  </p>
                                  <br></br>
                                  <br></br>
                                </div>
                              </>
                            }


                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="text-sm mb-6 sm:mb-8 sm:flex sm:justify-between sm:p-5 p-3">
                      <div className="space-y-2">
                        <div className='flex justify-center'>
                          <div>
                            <div className='flex justify-start py-3' >
                              <p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Any files added here will be attached to this letter and also saved to this client’s dashboard, under “Document Storage."
                                  JPEG , JPG and PNG Maximum file size: <strong className="font-medium text-gray-800 dark:text-white">5MB</strong>.
                                </p>
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="link-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor="link-checkbox" className="ms-2 text-xl text-bold font-medium text-gray-900 dark:text-gray-300">
                                I agree with the terms and conditions.
                              </label>
                            </div>

                            <div className='flex flex-col md:flex-row justify-between px-2 py-3 rounded-lg items-center md:items-end' >
                              {UserData?.photo_id ?
                                <div>
                                  <img src={UserData?.photo_id} alt='signature' className='signature' />
                                  <input style={{ maxWidth: "203px" }} type="file" onChange={(e) => handleFileChange(e, 'photo_id')} ref={fileInputRef}
                                    className="mt-2 block w-22 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                  {/* <button className='py-2 px-5 rounded-3xl tm-background text-white mt-4' onClick={() => handleUpload('photo_id')}>
                                    Re-Upload
                                  </button> */}
                                </div>
                                :
                                <div>
                                  <label className="cursor-pointer ml-2">Upload photo id</label>
                                  <input style={{ maxWidth: "203px" }} type="file" onChange={(e) => handleFileChange(e, 'photo_id')} ref={fileInputRef}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                  <div className='mt-5 '>
                                    {/* <button className='py-2 px-5 rounded-3xl tm-background text-white'
                                      onClick={() => handleUpload('photo_id')}
                                    >Upload</button> */}
                                  </div>
                                </div>
                              }

                              {UserData?.proof_of_address ?
                                <div>
                                  <img src={UserData?.proof_of_address} alt='signature' className='signature' />
                                  <input style={{ maxWidth: "203px" }} type="file" onChange={(e) => handleFileChange(e, 'proof_of_address')} ref={fileInputRef}
                                    className="mt-2 block w-22 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                  {/* <button className='py-2 px-5 rounded-3xl tm-background text-white mt-4' onClick={() => handleUpload('proof_of_address')}>
                                    Re-Upload
                                  </button> */}
                                </div> :
                                <div>
                                  <label className="cursor-pointer m-3">Upload proof of address</label>
                                  <input style={{ maxWidth: "203px" }} type="file" onChange={(e) => handleFileChange(e, 'proof_of_address')} ref={fileInputRef}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2" />
                                  <div className='mt-5 '>
                                    {/* <button className='py-2 px-5 rounded-3xl tm-background text-white'
                                      onClick={() => handleUpload('proof_of_address')}
                                    >Upload</button> */}
                                  </div>
                                </div>
                              }

                              {
                                UserData?.signature ?
                                  <>
                                    <div>
                                      <img src={UserData?.signature} alt='signature' className='signature' />
                                      <div className='app flex justify-center'>
                                        <button className='py-2 px-5 rounded-3xl tm-background text-white' onClick={() => setOpenModal(true)}>
                                          Change Signature
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                  :
                                  <div className='app flex'>
                                    <button className='py-2 px-5 rounded-3xl tm-background text-white' onClick={() => setOpenModal(true)}>
                                      Create Signature
                                    </button>
                                    <br />
                                  </div>
                              }

                              <div>
                                {isChecked && UserData?.signature && UserData?.proof_of_address && UserData?.agreement_sign != 1 ?
                                  <button className='py-2 px-5 rounded-3xl tm-background text-white mt-3' onClick={SubmitAgreement}>
                                    Submit Agreement
                                  </button>
                                  :
                                  <button className='py-2 px-5 rounded-3xl bg-gray-300 text-white mt-3' >
                                    Submit Agreement
                                  </button>
                                }

                              </div>
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
                                      <button className='py-2 px-5 rounded-3xl tm-background text-white' onClick={saveSignature}>
                                        Upload Signature
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}



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
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

    </>
  );
}

export default ClientAgreement;
