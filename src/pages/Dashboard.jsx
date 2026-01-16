import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import axios from 'axios';
import { GET_PROCESS_DATA, UPLOAD_Signature_ON_AWS, UPLOAD_IMAGES_ON_AWS, GET_DISPUTED_DATA_COUNT, GET_DATA_OF_USER_CLIENT, CREATE_USERS_ACTIVITY, GET_USER_DETAILS, GET_USER_PLAN_DETAILS, BUTTON_GROUPS_BASE_URL } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import ModalHeader from '../components/ModalHeader';
import { CircularProgressbar } from 'react-circular-progressbar';
import siteLogo from "../images/logo-dark-mode.png";
import { useNavigate } from "react-router-dom";
import ModalBasic from '../components/ModalBasic';
import checkmark from "../images/dashboard_img/checkmark.png";
import DashboardSidebar from '../partials/DashboardSidebar';
import ChartTable from '../components/ChartTable';
import SubNavbar from '../components/SubNavbar'
import Loder from '../partials/Loder';
import SignatureCanvas from 'react-signature-canvas'
import DynamicDashboardButtons from '../components/dashboard/DynamicDashboardButtons';
import LearningHub from '../components/dashboard/LearningHub';

function Dashboard() {
  const { id } = useParams();
  const signatureRef = useRef({});
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [EquifaxSum, setEquifaxSum] = useState("");
  const [ExperianSum, setExperianSum] = useState("");
  const [TransUnionSum, setTransUnionSum] = useState("");
  const [processData, setProcessData] = useState("");
  const [disputeData, setDisputeData] = useState("");
  const [positiveAndNagativeCount, setpositiveAndNagativeCount] = useState("");
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const navigate = useNavigate();
  const [processDataResponse, setprocessDataResponse] = useState('');
  const [userPlanDetail, setUserPlanDetail] = useState(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [setLoader, setsetLoader] = useState(false);
  const [clientUserTableId, setClientUserTableId] = useState('');
  const [buttonGroups, setButtonGroups] = useState([]);

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

  const colors = ['black', 'green', 'red']
  const [penColor, setPenColor] = useState('black');
  const [documentInfoModalOpen, setDocumentInfoModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isButtonLoader, setIsButtonLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');


  const equifaxValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Equifax) || 0;
  const transUnionValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].TransUnion) || 0;
  const experianValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Experian) || 0;
  const totalDelinquentValue = equifaxValue + transUnionValue + experianValue;
  const equifaxPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Equifax) || 0;
  const transUnionPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion) || 0;
  const experianPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Experian) || 0;
  const totalPublicRecordValue = equifaxPublicValue + transUnionPublicValue + experianPublicValue;


  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const getProcessData = async () => {
    try {
      const response = await axios.post(GET_PROCESS_DATA,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      setEquifaxSum(response?.data?.EquifaxSum);
      setExperianSum(response?.data?.ExperianSum);
      setTransUnionSum(response?.data?.TransUnionSum);
      setpositiveAndNagativeCount(response?.data?.derogatory?.process_data_object?.summaryInfo);
      if (response?.data?.derogatory) {
        setprocessDataResponse(response?.data?.derogatory?.process_data_object);
      }
      const arrageData = await getProcessDatas(response?.data?.derogatory)
      setProcessData(arrageData);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const saveSignature = async (type) => {
    setIsButtonLoader(type);
    const canvasData = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    try {
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

  const getUserDetails = async () => {
    try {
      let url = GET_USER_DETAILS(id || user?._id);
      const response = await axios.get(url, { headers: { "Authorization": "Bearer " + token } });
      setClientDetails(response?.data?.UserDetails);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getUserPlanDetail = async () => {
    try {
      const response = await axios.get(GET_USER_PLAN_DETAILS,
        { headers: { "Authorization": "Bearer " + token } });
      setUserPlanDetail(response?.data?.User);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  }

  const fetchButtons = async () => {
    try {
      const response = await axios.get(BUTTON_GROUPS_BASE_URL,
        { headers: { "Authorization": "Bearer " + token } }
      );
      setButtonGroups(response?.data || []);
    } catch (error) {
      console.error('Error fetching button groups:', error);
    }
  };

  useEffect(() => {
    getUserPlanDetail();
    getUserDetails();
    getDisputeDataCount();
    fetchButtons();
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    if (id) {
      getDataOfUserClient();
      getProcessData();
      getDisputeDataCount();
    } else {
      if (user?._id) {
        navigate(`/dashboard/${user?._id}`)
      }
    }
  }, []);


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

  const getProcessDatas = async (data) => {
    const id = data?._id;
    const reportDate = data?.process_data_object.ReportDateInfo;
    let ficoScores = "";

    if (data?.process_data_object.creditInfo["Credit Score"]) {
      ficoScores = data?.process_data_object.creditInfo["Credit Score"];
    } else {
      ficoScores = data?.process_data_object.creditInfo['FICO® Score 8'];
    }

    const firstNonEmptyFicoScore = ficoScores.find(score => Object.values(score).some(val => val !== ""));

    const mergedValues = { id, reportDate, ficoScores, ficoScore: firstNonEmptyFicoScore };
    return { mergedValues };
  };

  const getDisputeDataCount = async () => {
    try {
      const response = await axios.post(GET_DISPUTED_DATA_COUNT,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      setDisputeData(response.data)
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const userActivity = async (activityName, externalPage, pagetype, activityStatus, description) => {
    try {
      const response = await axios.post(CREATE_USERS_ACTIVITY,
        {
          user_id: user?._id,
          activity: activityName,
          externalPage: externalPage,
          pagetype: pagetype,
          description: description
        },
        { headers: { "Authorization": "Bearer " + token } }
      );
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  }

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

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex sm:h-[100dvh] px-2 overflow-hidden bg-white">
        {(user?.role != "client") ?
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          :
          ""
        }
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow">
            <div className=" py-3 pl-0 md:pl-4 w-full">
              <WelcomeBanner />
              <div className="sm:flex sm:items-center mt-6 mb-6 border-t pt-6">
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                </div>
                <div class="flex flex-row flex-wrap">
                  <DynamicDashboardButtons userActivity={userActivity} buttons={buttonGroups} />
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                      <button className="inline-flex items-center text-center justify-center text-xs md:text-[16px]  font-medium leading-5 rounded-[20px] px-3 py-3 border  bg-slate-200 text-black ms-2 "
                        onClick={(e) => { showClientDocuments(id ? id : user._id) }}
                      >View My Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='border-t pt-6'></div>
              {clientDetails && clientDetails?.role != "agency_agent" &&
                <>
                  {processData != '' && <ChartTable TransUnionSum={TransUnionSum} ExperianSum={ExperianSum} EquifaxSum={EquifaxSum} processData={processData} userId={id} />}
                  <div className="grid grid-cols-12 gap-6 border-t mt-6 pt-6">
                    <div className="mb-10 col-span-full xl:col-span-6 bg-white dark:bg-slate-800  rounded-2xl border border-slate-200 dark:border-slate-700">
                      <header className="px-5 py-4 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                        <h2 className="font-semibold text-3xl text-slate-100 dark:text-slate-100">Dispute Status</h2>
                      </header>
                      <div className="">
                        <div className="overflow-x-auto py-3 px-5">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-lg uppercase text-black bg-neutral-100	 rounded-tr-2xl rounded-tb-2xl">
                              <tr>
                                <th className="p-4 rounded-l-xl">
                                </th>
                                <th className="p-4">
                                  <div className="font-semibold text-center">EQUIFAX</div>
                                </th>
                                <th className="p-4">
                                  <div className="font-semibold text-center">EXPERIAN</div>
                                </th>
                                <th className="p-4 rounded-r-xl">
                                  <div className="font-semibold text-center">TRANSUNION</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                              <tr>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <div className="text-slate-900 dark:text-slate-100 font-semibold">Positive</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">
                                      {positiveAndNagativeCount?.Derogatory[0]?.Equifax && positiveAndNagativeCount?.["Total Accounts"][0]?.Equifax ? positiveAndNagativeCount?.["Total Accounts"][0]?.Equifax - positiveAndNagativeCount?.Derogatory[0]?.Equifax : "0"}
                                    </div>
                                  }
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">
                                      {positiveAndNagativeCount?.Derogatory[0]?.Experian && positiveAndNagativeCount?.["Total Accounts"][0]?.Experian ? positiveAndNagativeCount?.["Total Accounts"][0]?.Experian - positiveAndNagativeCount?.Derogatory[0]?.Experian : "0"}
                                    </div>
                                  }
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">
                                      {positiveAndNagativeCount?.Derogatory[0]?.TransUnion && positiveAndNagativeCount?.["Total Accounts"][0]?.TransUnion ? positiveAndNagativeCount?.["Total Accounts"][0]?.TransUnion - positiveAndNagativeCount?.Derogatory[0]?.TransUnion : "0"}
                                    </div>
                                  }
                                </td>
                              </tr>

                              <tr>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <div className="text-slate-900 dark:text-slate-100  font-semibold">Resolved</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center">{disputeData?.resolved_disputed_items?.Equifax ? disputeData?.resolved_disputed_items?.Equifax : 0}</div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center ">{disputeData?.resolved_disputed_items?.Experian ? disputeData?.resolved_disputed_items?.Experian : 0}</div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center">{disputeData?.resolved_disputed_items?.TransUnion ? disputeData?.resolved_disputed_items?.TransUnion : 0}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <div className="text-slate-900 dark:text-slate-100  font-semibold">In Dispute</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center">{disputeData?.resolved_disputed_items?.Equifax ? disputeData?.resolved_disputed_items?.Equifax : 0}</div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center ">{disputeData?.disputed_items?.Experian ? disputeData?.disputed_items?.Experian : 0}</div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center">{disputeData?.disputed_items?.TransUnion ? disputeData?.disputed_items?.TransUnion : 0}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <div className="text-slate-900 dark:text-slate-100  font-semibold">Negative</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">{positiveAndNagativeCount?.Derogatory[0]?.Equifax ? positiveAndNagativeCount?.Derogatory[0]?.Equifax : "0"} </div>
                                  }
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">{positiveAndNagativeCount?.Derogatory[0]?.Experian ? positiveAndNagativeCount?.Derogatory[0]?.Experian : "0"} </div>
                                  }
                                </td>
                                <td className="p-2">
                                  {positiveAndNagativeCount?.Derogatory &&
                                    <div className="text-center">{positiveAndNagativeCount?.Derogatory[0]?.TransUnion ? positiveAndNagativeCount?.Derogatory[0]?.TransUnion : "0"} </div>
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {clientDetails && clientDetails?.role != "client" &&
                            <div className=' mt-5 mb-4'>
                              <Link
                                to={`/dispute/${id}`}
                                className="btn rounded-full bg-[#DDE0E3] text-black">View dispute item
                              </Link>
                              <Link to={`/credit-report-list/${id}`} className=" btn rounded-full tm-background text-white ms-2">Credit report list
                              </Link>
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    <div className="mb-10 col-span-full xl:col-span-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <header className="px-5 py-4 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                        <h2 className="font-semibold text-3xl text-slate-100 dark:text-slate-100">My credit planning</h2>
                      </header>
                      <div className="">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            <>
                              <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                                <tr >
                                  <td className="p-2">
                                    <div className="flex items-center">
                                      <img src={checkmark} width={"20"} />
                                    </div>
                                  </td>
                                  <td className="p-5 flex text-black">
                                    Self's Credit Builder Account is a simple way to build.
                                  </td>
                                  <td className="px-5">
                                    <a target="_blank" href="https://learn.self.inc/lpg/partner/credit-building-education/"
                                      className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl"
                                      onClick={() => userActivity("Page visit", "https://learn.self.inc/lpg/partner/credit-building-education/", "external", "", "Self's Credit Builder Account is a simple way to build")}
                                    >
                                      Open
                                    </a>
                                  </td>
                                </tr>
                                <tr >
                                  <td className="p-2">
                                    <div className="flex items-center">
                                      <img src={checkmark} width={"20"} />
                                    </div>
                                  </td>
                                  <td className="p-5 flex text-black">
                                    Build Credit with rent or utility payments.
                                  </td>
                                  <td className="px-5">
                                    <a
                                      target="_blank"
                                      href="https://learn.self.inc/lpg/mpa/rent-bills-lp/"
                                      className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl"
                                      onClick={() => userActivity("Page visit", "https://learn.self.inc/lpg/mpa/rent-bills-lp/", "external", "", "Build Credit with rent or utility payments.")}
                                    >
                                      Open
                                    </a>
                                  </td>
                                </tr>

                                {userPlanDetail?.email_is_verified === "active" && userPlanDetail?.is_trial === "false" ?
                                  <>
                                    <tr>
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img src={checkmark} width={"20"} />
                                        </div>
                                      </td>
                                      <td className="p-5 flex text-black">
                                        24hrs Inquiry Deletion Script.
                                      </td>
                                      <td className="px-5">
                                        <a target="_blank"
                                          href="https://consumer-law-documents.s3.amazonaws.com/2jjf2ghhs2.pdf"
                                          className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl"
                                          onClick={() => userActivity("Page visit", "https://consumer-law-documents.s3.amazonaws.com/2jjf2ghhs2.pdf", "external", "", "24hrs Inquiry Deletion Script")}
                                        >
                                          Open
                                        </a>
                                      </td>
                                    </tr>

                                    <tr >
                                      <td className="p-2">
                                        <div className="flex items-center text-black">
                                          <img src={checkmark} width={"20"} />
                                        </div>
                                      </td>
                                      <td className="p-5 flex text-black">
                                        Late Payment Deletion Script.
                                      </td>
                                      <td className="px-5">
                                        <a
                                          target="_blank"
                                          href="https://consumer-law-documents.s3.amazonaws.com/Late%20Payment%20Deletion%20Script.docx"
                                          className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl"
                                          onClick={() => userActivity("Page visit", "https://consumer-law-documents.s3.amazonaws.com/Late%20Payment%20Deletion%20Script.docx", "external", "", "Late Payment Deletion Script")}
                                        >
                                          Open
                                        </a>
                                      </td>
                                    </tr>
                                  </>
                                  :
                                  ""
                                }

                                {userPlanDetail?.email_is_verified === "active" && userPlanDetail?.is_trial !== "false" ?
                                  <>
                                    <tr>
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img src={checkmark} width={"20"} />
                                        </div>
                                      </td>
                                      <td className="p-5 flex text-black">
                                        24hrs Inquiry Deletion Script.
                                      </td>
                                      <td className="px-5">
                                        <button className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSubscriptionModalOpen(true); }}>
                                          Open
                                        </button>
                                      </td>
                                    </tr>

                                    <tr >
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img src={checkmark} width={"20"} />
                                        </div>
                                      </td>
                                      <td className="p-5 flex text-black">
                                        Late Payment Deletion Script.
                                      </td>
                                      <td className="px-5">
                                        <button className=" bg-[#DDE0E3] px-3 text-xs py-2 text-black rounded-3xl" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSubscriptionModalOpen(true); }}>
                                          Open
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                  :
                                  ""
                                }
                              </tbody>
                            </>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
              <div className="">
                <ModalBasic id="feedback-modal" modalOpen={subscriptionModalOpen} setModalOpen={setSubscriptionModalOpen} title="Subscription ">
                  <div>
                    <div className="my-5 text-center">
                      <div className=''>
                        <label className="block text-sm font-medium mb-1" htmlFor="default">
                          You are on Trial. <a href="/plans" className="ml-1"><span style={{ color: "blue" }}>Click to Upgrade.</span> </a>
                        </label>
                      </div>
                    </div>
                  </div>
                </ModalBasic>
                <div className='border-t pt-6'></div>
                {user?.role != "client" &&
                 <LearningHub/>
                }
              </div>
            </div>
          </main>

          <ModalHeader id="basic-modal" modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title="">
            {/* Modal content */}
            <div className="">
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-3 flex justify-between items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-100"></div>
                <div className='text-center'>
                  <Link href="/" className="report-logo-align">
                    <img
                      src={siteLogo}
                      width={250}
                      alt="logo"
                    />
                  </Link>
                </div>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
                  onClick={(e) => { e.stopPropagation(); setBasicModalOpen(false); }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>Your Credit Scores and Summary</h1>
                <p className="mt-5 mb-4 text-center text-sm	">We have analyzed your credit reports from the three major bureaus. Here are our findings:</p>
                <div className="grid grid-cols-12 gap-6 p-2">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">EQUIFAX</h2>
                    </header>
                    <div className="flex flex-col h-full">
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div className="relative flex items-center justify-center w-3 h-3 mr-3" aria-hidden="true">
                            {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                            {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                          </div>
                          <div className="px-5 py-3">
                            <div className="flex items-center">
                              <div>
                                {processDataResponse?.creditInfo &&
                                  processDataResponse.creditInfo["FICO® Score 8"]?.[0].Equifax ?
                                  <CircularProgressbar
                                    value={Number(
                                      processDataResponse.creditInfo["FICO® Score 8"][0].Equifax.slice(0, 2) || 0
                                    )}
                                    text={
                                      processDataResponse.creditInfo["FICO® Score 8"][0].Equifax
                                        ? processDataResponse.creditInfo["FICO® Score 8"][0].Equifax
                                        : "0"
                                    }
                                  />
                                  :
                                  <>
                                    {processDataResponse?.creditInfo &&
                                      <>
                                        {
                                          processDataResponse.creditInfo["Credit Score"]?.[0].Equifax ?
                                            <CircularProgressbar
                                              value={Number(
                                                processDataResponse.creditInfo["Credit Score"][0].Equifax.slice(0, 2) || 0
                                              )}
                                              text={
                                                processDataResponse.creditInfo["Credit Score"][0].Equifax
                                                  ? processDataResponse.creditInfo["Credit Score"][0].Equifax
                                                  : "0"
                                              }
                                            />
                                            :
                                            <CircularProgressbar
                                              value={"0"}
                                              text={"-"}
                                            />

                                        }
                                      </>
                                    }
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      <span className='text-center font-bold'>
                        {processDataResponse?.creditInfo &&
                          processDataResponse.creditInfo["Lender Rank"]?.[0].Equifax
                          ? processDataResponse.creditInfo["Lender Rank"][0].Equifax
                          : "-"}
                      </span>
                      <hr className="h-px  mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              {/* <tr>
                          <th className="py-2">
                            <div className="font-semibold text-left">Top pages</div>
                          </th>
                          <th className="py-2">
                            <div className="font-semibold text-right">Active users</div>
                          </th>
                        </tr> */}
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Account</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Total Accounts'][0].Equifax ? processDataResponse?.summaryInfo?.['Total Accounts'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Inquiries</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Equifax ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>


                                <td className="py-2">
                                  <div className="text-left">Public Records</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].Equifax ? processDataResponse?.summaryInfo?.['Public Records'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Collections</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].Equifax ? processDataResponse?.summaryInfo?.['Collection'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                              <tr className=''>
                                <td className="py-2">
                                  <div className="text-left text-green-500">Positive</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-green-500 ">{processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax ? processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <div className="text-left text-red-500">Negative</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-red-500">{processDataResponse?.summaryInfo?.['Total Accounts'][0].Equifax && processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax ? processDataResponse?.summaryInfo?.['Total Accounts'][0].Equifax - processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax : "0"}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">TransUnion</h2>
                    </header>
                    <div className="flex flex-col h-full">
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div className="relative flex items-center justify-center w-3 h-3 mr-3" aria-hidden="true">
                            {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                            {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                          </div>
                          <div className="px-5 py-3">
                            <div className="flex items-center">
                              <div>
                                {processDataResponse?.creditInfo &&
                                  processDataResponse.creditInfo["FICO® Score 8"]?.[0].TransUnion ?
                                  <CircularProgressbar
                                    value={Number(
                                      processDataResponse.creditInfo["FICO® Score 8"][0].TransUnion.slice(0, 2) || 0
                                    )}
                                    text={
                                      processDataResponse.creditInfo["FICO® Score 8"][0].TransUnion
                                        ? processDataResponse.creditInfo["FICO® Score 8"][0].TransUnion
                                        : "0"
                                    }
                                  />
                                  :
                                  <>
                                    {processDataResponse?.creditInfo &&
                                      <>
                                        {
                                          processDataResponse.creditInfo["Credit Score"]?.[0].TransUnion ?
                                            <CircularProgressbar
                                              value={Number(
                                                processDataResponse.creditInfo["Credit Score"][0].TransUnion.slice(0, 2) || 0
                                              )}
                                              text={
                                                processDataResponse.creditInfo["Credit Score"][0].TransUnion
                                                  ? processDataResponse.creditInfo["Credit Score"][0].TransUnion
                                                  : "0"
                                              }
                                            />
                                            :
                                            <CircularProgressbar
                                              value={"0"}
                                              text={"-"}
                                            />

                                        }
                                      </>
                                    }
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      <span className='text-center font-bold'>
                        {processDataResponse?.creditInfo &&
                          processDataResponse.creditInfo["Lender Rank"]?.[0].TransUnion
                          ? processDataResponse.creditInfo["Lender Rank"][0].TransUnion
                          : "-"}
                      </span>
                      <hr className="h-px  mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              {/* <tr>
                          <th className="py-2">
                            <div className="font-semibold text-left">Top pages</div>
                          </th>
                          <th className="py-2">
                            <div className="font-semibold text-right">Active users</div>
                          </th>
                        </tr> */}
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Account</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Total Accounts'][0].TransUnion ? processDataResponse?.summaryInfo?.['Total Accounts'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Inquiries</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].TransUnion ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Public Records</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion ? processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Collections</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].TransUnion ? processDataResponse?.summaryInfo?.['Collection'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                              <tr className='text-success'>
                                <td className="py-2">
                                  <div className="text-left text-green-500">Positive</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-green-500 ">{processDataResponse?.summaryInfo?.['Total Accounts'][0].TransUnion && processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion ? processDataResponse?.summaryInfo?.['Total Accounts'][0].TransUnion - processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <div className="text-left text-red-500">Negative</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-red-500">{processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion ? processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion : "0"}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  */}


                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">EXPERIAN</h2>
                    </header>
                    <div className="flex flex-col h-full">
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div className="relative flex items-center justify-center w-3 h-3 mr-3" aria-hidden="true">
                            {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                            {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                          </div>
                          <div className="px-5 py-3">
                            <div className="flex items-center">
                              <div>
                                {processDataResponse?.creditInfo &&
                                  processDataResponse.creditInfo["FICO® Score 8"]?.[0].Experian ?
                                  <CircularProgressbar
                                    value={Number(
                                      processDataResponse.creditInfo["FICO® Score 8"][0].Experian.slice(0, 2) || 0
                                    )}
                                    text={
                                      processDataResponse.creditInfo["FICO® Score 8"][0].Experian
                                        ? processDataResponse.creditInfo["FICO® Score 8"][0].Experian
                                        : "0"
                                    }
                                  />
                                  :
                                  <>
                                    {processDataResponse?.creditInfo &&
                                      <>
                                        {
                                          processDataResponse.creditInfo["Credit Score"]?.[0].Experian ?
                                            <CircularProgressbar
                                              value={Number(
                                                processDataResponse.creditInfo["Credit Score"][0].Experian.slice(0, 2) || 0
                                              )}
                                              text={
                                                processDataResponse.creditInfo["Credit Score"][0].Experian
                                                  ? processDataResponse.creditInfo["Credit Score"][0].Experian
                                                  : "0"
                                              }
                                            />
                                            :
                                            <CircularProgressbar
                                              value={"0"}
                                              text={"-"}
                                            />

                                        }
                                      </>
                                    }
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      <span className='text-center font-bold'>
                        {processDataResponse?.creditInfo &&
                          processDataResponse.creditInfo["Lender Rank"]?.[0].Experian
                          ? processDataResponse.creditInfo["Lender Rank"][0].Experian
                          : "-"}
                      </span>
                      <hr className="h-px  mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              {/* <tr>
                          <th className="py-2">
                            <div className="font-semibold text-left">Top pages</div>
                          </th>
                          <th className="py-2">
                            <div className="font-semibold text-right">Active users</div>
                          </th>
                        </tr> */}
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Account</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Total Accounts'][0].Experian ? processDataResponse?.summaryInfo?.['Total Accounts'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Inquiries</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Experian ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Public Records</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].Experian ? processDataResponse?.summaryInfo?.['Public Records'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Collections</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].Experian ? processDataResponse?.summaryInfo?.['Collection'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                              <tr className='text-success'>
                                <td className="py-2">
                                  <div className="text-left text-green-500">Positive</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-green-500 ">{processDataResponse?.summaryInfo?.['Total Accounts'][0].Experian && processDataResponse?.summaryInfo?.['Derogatory'][0].Experian ? processDataResponse?.summaryInfo?.['Total Accounts'][0].Experian - processDataResponse?.summaryInfo?.['Derogatory'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <div className="text-left text-red-500">Negative</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-right  text-red-500">{processDataResponse?.summaryInfo?.['Derogatory'][0].Experian ? processDataResponse?.summaryInfo?.['Derogatory'][0].Experian : "0"}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                <p className="mt-5 mb-4 text-center text-sm	">Maxing out your credit cards will lower your score. If you pay balances down to below 30% of your available credit limit of each
                  card, that will increase your score.</p>

              </div>
              {/*  */}
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>Derogatory Summary</h1>
                <p className="mt-5 mb-4 text-center text-sm	">We analyzed all the items on your reports to determine which accounts are negatively impacting your score. Here are our
                  findings:</p>
                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">

                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              <tr>
                                <th className="py-2">
                                  {/* <div className="font-semibold text-left">Top pages</div> */}
                                </th>
                                <th className="py-2">
                                  <div className="font-semibold text-left">EQUIFAX</div>
                                </th>
                                <th className="py-2">
                                  <div className="font-semibold text-left">TransUnion</div>
                                </th>
                                <th className="py-2">
                                  <div className="font-semibold text-left">EXPERIAN</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Delinquent</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Delinquent'][0].Equifax ? processDataResponse?.summaryInfo?.['Delinquent'][0].Equifax : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Delinquent'][0].TransUnion ? processDataResponse?.summaryInfo?.['Delinquent'][0].TransUnion : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Delinquent'][0].Experian ? processDataResponse?.summaryInfo?.['Delinquent'][0].Experian : "-"}</div>
                                </td>
                              </tr>
                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Derogatory</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax ? processDataResponse?.summaryInfo?.['Derogatory'][0].Equifax : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion ? processDataResponse?.summaryInfo?.['Derogatory'][0].TransUnion : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Derogatory'][0].Experian ? processDataResponse?.summaryInfo?.['Derogatory'][0].Experian : "-"}</div>
                                </td>
                              </tr>

                              {/* Row */}
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Collections</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].Equifax ? processDataResponse?.summaryInfo?.['Collection'][0].Equifax : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].TransUnion ? processDataResponse?.summaryInfo?.['Collection'][0].TransUnion : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Collection'][0].Experian ? processDataResponse?.summaryInfo?.['Collection'][0].Experian : "-"}</div>
                                </td>
                              </tr>
                              <tr className=''>
                                <td className="py-2">
                                  <div className="text-left">Public Records</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].Equifax ? processDataResponse?.summaryInfo?.['Public Records'][0].Equifax : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion ? processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Public Records'][0].Experian ? processDataResponse?.summaryInfo?.['Public Records'][0].Experian : "-"}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <div className="text-left">Inquiries (2 years)</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Equifax ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Equifax : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].TransUnion ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].TransUnion : "-"}</div>
                                </td>
                                <td className="py-2">
                                  <div className="font-medium text-left text-slate-800">{processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Experian ? processDataResponse?.summaryInfo?.['Inquiries(2 years)'][0].Experian : "-"}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                </div>
              </div>
              {/*  */}
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>Derogatory Items</h1>
                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">

                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-4">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase ">
                              <tr>
                                <th className="py-2">
                                  {/* <div className="font-semibold text-left">Top pages</div> */}
                                </th>
                                <th className="py-2 px-5">
                                  <h1 className=" text-5xl text-red-600">{totalDelinquentValue}</h1>
                                  <div className="font-semibold text-black-500">
                                    Delinquent or derogatory
                                    items</div>
                                </th>
                                <th className="py-2">
                                  <div className="text-slate-400 dark:text-slate-500">Recent late payments, collections, and other derogatory items within
                                    the last 6 months will hurt your credit score more than older inactive
                                    accounts. Accounts within the last 24 months carry the second most
                                    weight. It is crucial to pay all bills on time and never miss payments.</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              <tr>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">Account Name</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">EQUIFAX</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">TransUnion</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">EXPERIAN</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">Issue</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {processDataResponse?.bankInfo?.results.map((val, i) => {
                                return (
                                  <tr key={i}>
                                    {val.latePaymentSummary !== "" ?
                                      <>
                                        <td className="py-5 px-5">
                                          <div className="text-left">{val?.bankName}</div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">
                                            {val?.latePaymentCounts?.Equifax && Object.keys(val.latePaymentCounts.Equifax).length > 0 ?
                                              <>
                                                <div className='text-lg font-extrabold text-red-700'>X</div>
                                                <div className='text-xs'>Negative</div>
                                              </>
                                              :
                                              "-"}
                                          </div>


                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">
                                            {val?.latePaymentCounts?.TransUnion && Object.keys(val.latePaymentCounts.TransUnion).length > 0 ?
                                              <>
                                                <div className='text-lg font-extrabold text-red-700'>X</div>
                                                <div className='text-xs'>Negative</div>
                                              </>
                                              :
                                              "-"}
                                          </div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">
                                            {val?.latePaymentCounts?.Experian && Object.keys(val.latePaymentCounts.Experian).length > 0 ?
                                              <>
                                                <div className='text-lg font-extrabold text-red-700'>X</div>
                                                <div className='text-xs'>Negative</div>
                                              </>
                                              :
                                              "-"}
                                          </div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="">{val?.latePaymentSummary}</div>
                                        </td>
                                      </>
                                      :
                                      ""
                                    }

                                  </tr>
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
              {/*  */}
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>Public Records</h1>
                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">
                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-4">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase ">
                              <tr>
                                <th className="py-2">
                                  {/* <div className="font-semibold text-left">Top pages</div> */}
                                </th>
                                <th className="py-2 px-5">
                                  <h1 className=" text-5xl text-red-600">{totalPublicRecordValue}</h1>
                                  <div className="font-semibold text-black-500">
                                    Public Records</div>
                                </th>
                                <th className="py-2">
                                  <div className="text-slate-400 dark:text-slate-500">Public records include details of court records, bankruptcy filings, tax
                                    liens and monetary judgments. These generally remain on your Credit
                                    Report for 7 to 10 years.</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              <tr>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">Account Name</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">EQUIFAX</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">TransUnion</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">EXPERIAN</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-left">Issue</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            {processDataResponse?.publicRecordInfo?.map((val, i) => {
                              return (
                                <tr key={i}>
                                  <>
                                    <td className="py-5 px-5">
                                      <div className="text-left">{val?.bankName}</div>
                                    </td>
                                    <td className="py-5 px-5">
                                      <div className="text-center">
                                        {Object.keys(val?.TableData?.["Date Filed/Reported"][0]?.Equifax).length > 0 ?
                                          <>
                                            <div className='text-lg	font-extrabold text-red-700'>X</div>
                                            <div className='text-xs	'>Negative</div>
                                          </>
                                          :
                                          "-"}
                                      </div>
                                    </td>
                                    <td className="py-5 px-5">
                                      <div className="text-center">
                                        {Object.keys(val?.TableData?.["Date Filed/Reported"][0]?.TransUnion).length > 0 ?
                                          <>
                                            <div className='text-lg	font-extrabold text-red-700'>X</div>
                                            <div className='text-xs	'>Negative</div>
                                          </>
                                          : "-"}
                                      </div>
                                    </td>
                                    <td className="py-5 px-5">
                                      <div className="text-center">
                                        {Object.keys(val?.TableData?.["Date Filed/Reported"][0]?.Experian).length > 0 ?
                                          <>
                                            <div className='text-lg	font-extrabold text-red-700'>X</div>
                                            <div className='text-xs	'>Negative</div>
                                          </>
                                          : "-"}
                                      </div>
                                    </td>
                                    <td className="py-5 px-5">
                                      <div className="">
                                        {Object.keys(val?.TableData?.Type[0]?.TransUnion).length > 0 &&
                                          <>
                                            <div className='text-xs	'>{val?.TableData?.Type[0]?.TransUnion}</div>
                                          </>
                                        }

                                      </div>
                                      <div className="">
                                        {Object.keys(val?.TableData?.Type[0]?.Equifax).length > 0 &&
                                          <>
                                            <div className='text-xs	'>{val?.TableData?.Type[0]?.Equifax}</div>
                                          </>
                                        }
                                      </div>
                                      <div className="">
                                        {Object.keys(val?.TableData?.Type[0]?.Experian).length > 0 &&
                                          <>
                                            <div className='text-xs	'>{val?.TableData?.Type[0]?.Experian}</div>
                                          </>
                                        }
                                      </div>
                                    </td>
                                  </>
                                </tr>
                              )
                            })}

                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center" style={{ background: "#cb1717" }}>Inquiries</h1>
                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">

                      {/* <div >
                  <LineChart data={chartData} width={389} height={70} />
                </div> */}

                      {/* Table */}
                      <div className="grow px-5 pt-3 pb-4">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase ">
                              <tr>
                                <th className="py-2">
                                  {/* <div className="font-semibold text-left">Top pages</div> */}
                                </th>
                                <th className="py-2 px-5">
                                  <h1 className=" text-4xl text-red-600">{processDataResponse?.inquiriesInfo?.tabledata ? Object.keys(processDataResponse?.inquiriesInfo?.tabledata).length : 0}
                                  </h1>
                                  <div className="font-semibold text-black-500">
                                    Inquiry</div>
                                </th>
                                <th className="py-2">
                                  <div className="text-slate-400 dark:text-slate-500">Each time you apply for credit it lowers your score. For that reason we
                                    ask during credit repair that you do not apply for anything.</div>
                                </th>

                              </tr>
                            </thead>
                            {/* Table body */}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols p-4">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">
                      <div className="grow px-5 pt-3 pb-1">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                              <tr>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-center">Account Name</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-center">EQUIFAX</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-center">TransUnion</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-center">EXPERIAN</div>
                                </th>
                                <th className="py-5 px-5">
                                  <div className="font-semibold text-center">Issue</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {processDataResponse?.inquiriesInfo?.tabledata.map((val, i) => {
                                return (
                                  <tr key={i}>
                                    {val.latePaymentSummary !== "" ?
                                      <>
                                        <td className="py-5 px-5">
                                          <div className="text-center">{val?.['Creditor Name']}</div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">{val?.['Credit Bureau'] === "Equifax" ?
                                            <>
                                              <div className='text-lg	font-extrabold text-red-700'>X</div>
                                              <div className='text-xs	'>{val?.['Date of inquiry']}</div>
                                            </>
                                            :
                                            "-"}
                                          </div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">{val?.['Credit Bureau'] === "TransUnion" ?
                                            <>
                                              <div className='text-lg	font-extrabold text-red-700'>X</div>
                                              <div className='text-xs	'>{val?.['Date of inquiry']}</div>
                                            </>

                                            : "-"}</div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">{val?.['Credit Bureau'] === "Experian" ?
                                            <>
                                              <div className='text-lg	font-extrabold text-red-700'>X</div>
                                              <div className='text-xs	'>{val?.['Date of inquiry']}</div>
                                            </>

                                            : "-"}</div>
                                        </td>
                                        <td className="py-5 px-5">
                                          <div className="text-center">Inquiry</div>
                                        </td>
                                      </>
                                      :
                                      ""
                                    }

                                  </tr>
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
          </ModalHeader>
        </div>
      </div>
      <ModalBasic id="feedback-modal" modalOpen={documentInfoModalOpen} setModalOpen={setDocumentInfoModalOpen} title="View Documents">
        <>
          <div className={`p-4 rounded-lg`}>
            <label htmlFor="fileInput" className="cursor-pointer">
            </label>
            <div className='flex justify-center mt-3'>
              <div>
                <div className='flex justify-start  py-3' >
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
                          <button className=' w-full  py-2 px-5 rounded-3xl tm-background text-white my-3' onClick={() => setOpenModal(true)}>
                            Change Signature
                          </button>
                        </div>
                      </>
                      :
                      <div className='app'>
                        <label className="text-center block font-bold mb-1" htmlFor="card-name">
                          Signature
                        </label>
                        <button className='w-full  py-2 px-5 rounded-3xl tm-background text-white my-3' onClick={() => setOpenModal(true)}>
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
                            <button className='items-center btn-sm py-3 px-5 rounded-3xl tm-background text-white '><Loder /> <span className='ms-1'>Uploading Signature</span></button>
                            :
                            <button className='py-3 px-5 rounded-3xl tm-background text-white' onClick={() => saveSignature("Signature")}>
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
                          <button className='w-full items-center btn-sm py-2 px-5 my-3 rounded-3xl tm-background text-white'
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
                          <button className='w-full items-center btn-sm py-2  my-3  px-5 rounded-3xl tm-background text-white'
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

export default Dashboard;