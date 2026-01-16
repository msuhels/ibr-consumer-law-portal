import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import SubHeader from '../components/SubHeader';
import axios from 'axios';
import { GET_PROCESS_DATA, GET_DISPUTED_DATA_COUNT, GET_DATA_OF_USER_CLIENT, CREATE_USERS_ACTIVITY, GET_USER_DETAILS, GET_USER_PLAN_DETAILS } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import ModalHeader from '../components/ModalHeader';
import { CircularProgressbar } from 'react-circular-progressbar';
// import siteLogo from "../images/consumer_logo.png"
import siteLogo from "../images/logo-dark-mode.png";
import experian_logo from "../images/experian.png"
import equifax_logo from "../images/equifax.png"
import trans_union_logo from "../images/trans_union.png"
import Footer from '../partials/Footer';
import DashboardEditMenu from '../components/DashboardEditMenu';
import { useNavigate } from "react-router-dom";
import DashboardEditMenuTwo from '../components/DashboardEditMenuTwo';
import DashboardCaseLawMenu from '../components/DashboardCaseLawMenu';
import ModalBasic from '../components/ModalBasic';
import DashboardLegalLibrary from '../components/DashboardLegalLibrary';
import send_icon from "../images/send-icon.png";

function Dashboard() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [processData, setProcessData] = useState("");
  const [disputeData, setDisputeData] = useState("");
  const [positiveAndNagativeCount, setpositiveAndNagativeCount] = useState("");
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const navigate = useNavigate();
  const [processDataResponse, setprocessDataResponse] = useState('');
  const [userPlanDetail, setUserPlanDetail] = useState(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));

  const equifaxValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Equifax) || 0;
  const transUnionValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].TransUnion) || 0;
  const experianValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Experian) || 0;
  const totalDelinquentValue = equifaxValue + transUnionValue + experianValue;
  const equifaxPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Equifax) || 0;
  const transUnionPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion) || 0;
  const experianPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Experian) || 0;
  const totalPublicRecordValue = equifaxPublicValue + transUnionPublicValue + experianPublicValue;

  const getProcessData = async () => {
    try {
      const response = await axios.post(GET_PROCESS_DATA,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      setpositiveAndNagativeCount(response?.data?.derogatory[0]?.process_data_object?.summaryInfo);
      if (response?.data?.derogatory[0]) {
        setprocessDataResponse(response?.data?.derogatory[0]?.process_data_object);
      }
      const arrageData = await getProcessDatas(response.data.derogatory)
      setProcessData(arrageData);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const getUserDetails = async () => {
    try {
      let url = GET_USER_DETAILS(id);
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


  useEffect(() => {
    getUserPlanDetail();
    getUserDetails();
    getDisputeDataCount();
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    if (id) {
      getDataOfUserClient();
      getProcessData();
      getDisputeDataCount();
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
    const mergedValues = data?.map((entry) => {
      const id = entry?._id;
      const reportDate = entry?.process_data_object.ReportDateInfo;
      const ficoScores = entry?.process_data_object.creditInfo['FICO® Score 8'];

      let firstNonEmptyFicoScore = null;

      for (const score of ficoScores) {
        for (const key in score) {
          if (score[key] !== "") {
            firstNonEmptyFicoScore = score[key];
            break;
          }
        }
        if (firstNonEmptyFicoScore) {
          break;
        }
      }

      return { id, reportDate, ficoScores, ficoScore: firstNonEmptyFicoScore };
    });

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

  console.log(clientDetails);

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
              {/* Welcome banner */}
              <WelcomeBanner />
              {/* Dashboard actions */}
              {/* <div className="sm:flex sm:justify-between sm:items-center mb-8"> */}
              <div className="sm:flex sm:items-center mb-8">
                {/* <h1 className='text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1' >Sample Client</h1> */}
                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* {processDataResponse &&
                    <button
                      onClick={(e) => { e.stopPropagation(); setBasicModalOpen(true); }}
                      className="btn tm-background text-white"
                    >
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Run Dispute Wizard</span>
                    </button>
                  } */}




                </div>

                <div class="flex flex-row flex-wrap">
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                    <a href='https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9' target="_blank" className="inline-flex items-center text-center justify-center text-xs md:text-sm lg:text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2"
                      onClick={() => userActivity("Page visit", "https://www.myscoreiq.com/get-fico-max.aspx?offercode=432135S9", "external", "", "Sign up for MyScoreIQ")}
                    >Sign up for MyScoreIQ
                    </a>
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <DashboardEditMenuTwo className="relative inline-flex">
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://www.chexsystems.com/security-freeze/place-freeze"
                          onClick={() => userActivity("Page visit", "https://www.chexsystems.com/security-freeze/place-freeze", "external", "", "ChexSystem Credit Freeze")}
                        >ChexSystem Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://www.ars-consumeroffice.com/add"
                          onClick={() => userActivity("Page visit", "https://www.ars-consumeroffice.com/add", "external", "", "ARS Credit Freeze")}
                        >ARS Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.innovis.com/securityFreeze/index"
                          onClick={() => userActivity("Page visit", "https://www.innovis.com/securityFreeze/index", "external", "", "Innovis Credit Freeze")}
                        >Innovis Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://www.sagestreamllc.com/opt-out-opt-in/index.html"
                          onClick={() => userActivity("Page visit", "https://www.sagestreamllc.com/opt-out-opt-in/index.html", "external", "", "SageStream Credit Freeze")}
                        >SageStream Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://consumers.teletrack.com/freeze/"
                          onClick={() => userActivity("Page visit", "https://consumers.teletrack.com/freeze/", "external", "", "CoreLogic Teletrack")}
                        >CoreLogic Teletrack</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://consumer.risk.lexisnexis.com/freeze"
                          onClick={() => userActivity("Page visit", "https://consumer.risk.lexisnexis.com/freeze", "", "external", "", "LexisNexis Credit Freeze")}
                        >LexisNexis Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.uscfc.uscourts.gov/opt-out-electronic-case-notices"
                          onClick={() => userActivity("Page visit", "https://www.uscfc.uscourts.gov/opt-out-electronic-case-notices", "", "external", "PACER-Opt Out")}
                        >PACER-Opt Out</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://optout.lexisnexis.com"
                          onClick={() => userActivity("Page visit", "https://optout.lexisnexis.com", "", "external", "", "CLUE Opt out")}
                        >CLUE Opt out</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://oci.wi.gov/Documents/Consumers/PI-207.pdf"
                          onClick={() => userActivity("Page visit", "https://oci.wi.gov/Documents/Consumers/PI-207.pdf", "external", "", "More Information on CLUE")}
                        >More Information on CLUE</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.transunion.com/credit-freeze"
                          onClick={() => userActivity("Page visit", "https://www.transunion.com/credit-freeze", "external", "", "TransUnion Credit Freeze")}
                        >TransUnion Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.experian.com/freeze/center.html?pc=sem_exp_google&cc=sem_exp_google_ad_17178947696_131566788370_596505407217_kwd-2942615919_e__k_EAIaIQobChMIr_LEzKzJgwMVMGFHAR0QGQaXEAAYASAAEgKzx_D_BwE_k&ref=freeze&awsearchcpc=1&gad_source=1&gbraid=0AAAAAD4mgc9HP88gRapJA8gLdlbEJq0jP&gclid=EAIaIQobChMIr_LEzKzJgwMVMGFHAR0QGQaXEAAYASAAEgKzx_D_BwE"
                          onClick={() => userActivity("Page visit", "https://www.experian.com/freeze/center.html?pc=sem_exp_google&cc=sem_exp_google_ad_17178947696_131566788370_596505407217_kwd-2942615919_e__k_EAIaIQobChMIr_LEzKzJgwMVMGFHAR0QGQaXEAAYASAAEgKzx_D_BwE_k&ref=freeze&awsearchcpc=1&gad_source=1&gbraid=0AAAAAD4mgc9HP88gRapJA8gLdlbEJq0jP&gclid=EAIaIQobChMIr_LEzKzJgwMVMGFHAR0QGQaXEAAYASAAEgKzx_D_BwE", "external", "", "Experian Credit Freeze")}
                        >Experian Credit Freeze</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.equifax.com/personal/credit-report-services/credit-freeze/"
                          onClick={() => userActivity("Page visit", "https://www.equifax.com/personal/credit-report-services/credit-freeze/", "external", "", "Equifax Credit Freeze")}
                        >Equifax Credit Freeze:</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.consumerreports.org/cro/customerservice/privacy-policy/choice-opt-out/index.htm"
                          onClick={() => userActivity("Page visit", "https://www.consumerreports.org/cro/customerservice/privacy-policy/choice-opt-out/index.htm", "external", "", "Opt out of promotion mail")}
                        >Opt out of promotion mail</a>
                      </li>
                    </DashboardEditMenuTwo>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <DashboardEditMenu className="relative inline-flex">
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://www.consumerfinance.gov/complaint/"
                          onClick={() => userActivity("Page visit", "https://www.consumerfinance.gov/complaint/", "external", "", "File a CFPB Complaint")}
                        >File a CFPB Complaint</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" href="https://www.ftc.gov/media/71268"
                          onClick={() => userActivity("Page visit", "https://www.ftc.gov/media/71268", "external", "", "File a FTC Complaint")}
                        >File a FTC Complaint</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.bbb.org/file-a-complaint"
                          onClick={() => userActivity("Page visit", "https://www.bbb.org/file-a-complaint", "external", "", "File a BBB Complaint")}
                        >File a BBB Complaint</a>
                      </li>
                      <li>
                        <a target="_blank" className="font-medium text-sm text-slate-600 hover:text-rose-600 flex py-1 px-3" href="https://www.hhs.gov/hipaa/filing-a-complaint/index.html"
                          onClick={() => userActivity("Page visit", "https://www.hhs.gov/hipaa/filing-a-complaint/index.html", "external", "", "File a HIPAA Complaint")}
                        >File a HIPAA Complaint</a>
                      </li>
                    </DashboardEditMenu>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                    <a href='https://www.identitytheft.gov/#/' target="_blank" className="inline-flex items-center text-center justify-center text-xs md:text-sm lg:text-sm  font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2"
                      onClick={() => userActivity("Page visit", "https://www.identitytheft.gov/#/", "external", "", "Report Identity Theft")}
                    >Report Identity Theft
                    </a>
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                    <a href='https://www.irs.gov/pub/irs-pdf/f3949a.pdf' target="_blank" className="inline-flex text-center items-center justify-center text-xs md:text-sm  font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2"
                      onClick={() => userActivity("Page visit", "https://www.irs.gov/pub/irs-pdf/f3949a.pdf", "external", "", "Report Tax Fraud")}
                    >Report Tax Fraud
                    </a>
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                    <a href='https://files.consumerfinance.gov/f/documents/cfpb_consumer-reporting-companies-list_2023.pdf' target="_blank" className="inline-flex text-center items-center justify-center text-xs md:text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2"
                      onClick={() => userActivity("Page visit", "https://files.consumerfinance.gov/f/documents/cfpb_consumer-reporting-companies-list_2023.pdf", "external", "", "List of CRAs")}
                    >List of CRAs
                    </a>
                    </div>
                  </div>
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <DashboardCaseLawMenu className="relative inline-flex">
                      <li>
                        <a className="font-medium text-xs md:text-sm  text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" target="_blank" href="https://pacer.uscourts.gov/file-case/court-cmecf-lookup"
                          onClick={() => userActivity("Page visit", "https://pacer.uscourts.gov/file-case/court-cmecf-lookup", "external", "", "Pacer")}
                        >Pacer</a>
                      </li>
                      <li>
                        <a className="font-medium text-xs md:text-sm  text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" target="_blank" href="https://scholar.google.com/"
                          onClick={() => userActivity("Page visit", "https://scholar.google.com/", "external", "", "Google scholar")}
                        >Google scholar</a>
                      </li>
                    </DashboardCaseLawMenu>
                  </div>
                  {/* <a href='javascript:void(0)' className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2">Arbitration
                  </a> */}
                  {/* <a href='javascript:void(0)' className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2">Legal Letterhead
                  </a> */}
                  <div className='w-1/2 sm:w-auto  p-1'>
                    <div className='flex flex-col'>
                    <a target="_blank" href="https://consumerlaw.ai/online-notary" className="inline-flex items-center text-center justify-center text-xs md:text-sm  font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2 "
                      onClick={() => userActivity("Page visit", "https://consumerlaw.ai/online-notary", "external", "", "Online Notary")}
                    >Online Notary
                    </a>
                    </div>
                  </div>
                  {/* {processDataResponse &&
                    <button
                      onClick={(e) => { e.stopPropagation(); setBasicModalOpen(true); }}
                      className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white ms-2"
                    >Run Dispute Wizard
                    </button>
                  }
                  <Link to={`/credit-report/${id}`} className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border tm-background  text-white mt-4 ms-2">Import/Audit
                  </Link> */}
                  <div className='w-1/2 sm:w-auto md:w-auto lg:w-auto p-2'>

                    <DashboardLegalLibrary className="relative inline-flex ">
                      <li>
                        <a className="font-medium text-xs md:text-sm  text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" target="_blank" href="https://www.ftc.gov/legal-library/browse/cases-proceedings/banned-debt-collectors/list"
                          onClick={() => userActivity("Page visit", "https://www.ftc.gov/legal-library/browse/cases-proceedings/banned-debt-collectors/list", "external", "", "Banned Debt Collectors")}
                        >Banned Debt Collectors</a>
                      </li>
                      <li>
                        <a className="font-medium text-xs md:text-sm  text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" target="_blank" href="https://www.ftc.gov/legal-library/browse/cases-proceedings"
                          onClick={() => userActivity("Page visit", "https://www.ftc.gov/legal-library/browse/cases-proceedings", "external", "", "Cases & Proceedings")}
                        >Cases & Proceedings</a>
                      </li>
                      <li>

                        <a
                          target="_blank" href="https://drive.google.com/file/d/1lCglBWnuUwGL9JOFLPouEr_n4LCAmEmZ/view"
                          className="font-medium text-xs md:text-sm  text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
                          onClick={() => userActivity("Page visit", "https://drive.google.com/file/d/1lCglBWnuUwGL9JOFLPouEr_n4LCAmEmZ/view", "external", "", "Cases & Proceedings")}
                        >Arbitration</a>
                      </li>
                    </DashboardLegalLibrary>
                  </div>
                </div>
              </div>
              


              {clientDetails && clientDetails?.role != "agency_agent" &&


                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-5">Scores</h2>
                      {/* <DashboardCard04 processData={processData} /> */}
                    </header>

                    <div className="p-3">
                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
                          {/* Table header */}
                          <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                            <tr>
                              <th className="p-2">
                                {/* <div className="font-semibold text-left">Source</div> */}
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center"> <img
                                  src={equifax_logo}
                                  width={100}
                                  alt="logo"
                                /></div>
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center"> <img
                                  src={experian_logo}
                                  width={100}
                                  alt="logo"
                                /></div>
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center"> <img
                                  src={trans_union_logo}
                                  width={100}
                                  alt="logo"
                                /></div>
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          {processData?.mergedValues?.length > 0 &&
                            <>
                              <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                                {processData?.mergedValues?.map((val, i) => {
                                  return (
                                    <tr key={i}>
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <div className="text-slate-800 dark:text-slate-100">{val?.reportDate}</div>
                                        </div>
                                      </td>
                                      <td className="p-2">
                                        <div className="text-center">{val?.ficoScores[0]?.Equifax ? val?.ficoScores[0]?.Equifax : 0}</div>
                                      </td>
                                      <td className="p-2">
                                        <div className="text-center">{val?.ficoScores[0]?.Experian ? val?.ficoScores[0]?.Experian : 0}</div>
                                      </td>
                                      <td className="p-2">
                                        <div className="text-center">{val?.ficoScores[0]?.TransUnion ? val?.ficoScores[0]?.TransUnion : 0}</div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </>
                          }
                        </table>
                        {processData?.mergedValues?.length <= 0 &&
                          <div className='text-center mt-3'>
                            No Report imported yet!
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100">Dispute Status</h2>
                    </header>
                    <div className="p-3">
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
                          {/* Table header */}
                          <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                            <tr>
                              <th className="p-2">
                                {/* <div className="font-semibold text-left">Source</div> */}
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center">EQUIFAX</div>
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center">EXPERIAN</div>
                              </th>
                              <th className="p-2">
                                <div className="font-semibold text-center">TRANSUNION</div>
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                            {/* Row */}
                            <tr>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="text-green-800 text-green-500">Positive</div>
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

                            {/* Row */}
                            <tr>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="text-slate-800 dark:text-slate-100">Resolved</div>
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
                            {/* Row */}
                            <tr>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="text-slate-800 dark:text-slate-100">In Dispute</div>
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
                            {/* Row */}
                            <tr>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="text-red-800 text-red-500">Negative</div>
                                </div>
                              </td>
                              <td className="p-2">
                                {positiveAndNagativeCount?.Derogatory &&
                                  <div className="text-center">{positiveAndNagativeCount?.Derogatory[0]?.Equifax ? positiveAndNagativeCount?.Derogatory[0]?.Equifax : "0"} </div>
                                }
                              </td>
                              <td className="p-2">
                                {positiveAndNagativeCount?.Derogatory &&
                                  <div className="text-center ">{positiveAndNagativeCount?.Derogatory[0]?.Experian ? positiveAndNagativeCount?.Derogatory[0]?.Experian : "0"} </div>
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
                      </div>
                    </div>

                    {/* {user.role != "client" && */}
                    <div className='text-center mt-2 mb-4'>
                      <Link
                        to={`/dispute/${id}`}
                        className="btn tm-background text-white">View Dispute Items
                      </Link>
                      <Link to={`/credit-report-list/${id}`} className="btn tm-background text-white ms-2">Credit Report List
                      </Link>
                    </div>
                    {/* } */}
                  </div>
                </div>
              }
              <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                  <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-5">My Credit Building Plan</h2>
                    {/* <DashboardCard04 processData={processData} /> */}
                  </header>

                  <div className="">
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        <>
                          <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">

                            <tr >
                              <td className="p-2">
                                <div className="flex items-center">
                                </div>
                              </td>
                              <td className="p-5 flex">
                                <svg
                                  className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                </svg>
                                Self's Credit Builder Account is a simple way to build.
                              </td>
                              <td className="p-5">
                                <a
                                  target="_blank"
                                  href="https://learn.self.inc/lpg/partner/credit-building-education/"
                                  // className="btn tm-background text-white"
                                  className="text-white"
                                  onClick={() => userActivity("Page visit", "https://learn.self.inc/lpg/partner/credit-building-education/", "external", "", "Self's Credit Builder Account is a simple way to build")}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                    <path d="M6.5 12h14.5" />
                                  </svg>
                                </a>
                              </td>
                            </tr>
                            <tr >
                              <td className="p-2">
                                <div className="flex items-center">
                                </div>
                              </td>
                              <td className="p-5 flex">
                                <svg
                                  className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                </svg>
                                Build Credit with rent or utility payments.
                              </td>
                              <td className="p-5">
                                <a
                                  target="_blank"
                                  href="https://learn.self.inc/lpg/mpa/rent-bills-lp/"
                                  className="text-white"
                                  onClick={() => userActivity("Page visit", "https://learn.self.inc/lpg/mpa/rent-bills-lp/", "external", "", "Build Credit with rent or utility payments.")}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                    <path d="M6.5 12h14.5" />
                                  </svg>
                                </a>
                              </td>
                            </tr>

                            {userPlanDetail?.email_is_verified === "active" && userPlanDetail?.is_trial === "false" ?
                              <>
                                <tr style={{ borderTop: "1px solid black" }}>
                                  <td className="p-2">
                                    <div className="flex items-center">
                                    </div>
                                  </td>
                                  <td className="p-5 flex">
                                    <svg
                                      className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                      viewBox="0 0 12 12"
                                    >
                                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                    </svg>
                                    24hrs Inquiry Deletion Script:
                                  </td>
                                  <td className="p-5">
                                    <a
                                      target="_blank"
                                      href="https://drive.google.com/file/d/1U9tb2Nq5BKMxHUK9hTfzlf7asN-JQ2EF/view?usp=sharing/"
                                      className="text-white"
                                      onClick={() => userActivity("Page visit", "https://drive.google.com/file/d/1U9tb2Nq5BKMxHUK9hTfzlf7asN-JQ2EF/view?usp=sharing/", "external", "", "24hrs Inquiry Deletion Script")}
                                    >

                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                        <path d="M6.5 12h14.5" />
                                      </svg>
                                    </a>
                                  </td>
                                </tr>

                                <tr >
                                  <td className="p-2">
                                    <div className="flex items-center">
                                    </div>
                                  </td>
                                  <td className="p-5 flex">
                                    <svg
                                      className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                      viewBox="0 0 12 12"
                                    >
                                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                    </svg>
                                    Late Payment Deletion Script:
                                  </td>
                                  <td className="p-5">
                                    <a
                                      target="_blank"
                                      href="https://docs.google.com/document/d/176kjLqLSEbNMZGp4d8i3WZYCMl4FVsPY/edit?usp=sharing&ouid=100072861621621537500&rtpof=true&sd=true/"
                                      className=" text-white"
                                      onClick={() => userActivity("Page visit", "https://docs.google.com/document/d/176kjLqLSEbNMZGp4d8i3WZYCMl4FVsPY/edit?usp=sharing&ouid=100072861621621537500&rtpof=true&sd=true/", "external", "", "Late Payment Deletion Script")}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                        <path d="M6.5 12h14.5" />
                                      </svg>
                                    </a>
                                  </td>
                                </tr>
                              </>
                              :
                              ""
                            }

                            {userPlanDetail?.email_is_verified === "active" && userPlanDetail?.is_trial !== "false" ?
                              <>
                                <tr style={{ borderTop: "1px solid black" }}>
                                  <td className="p-2">
                                    <div className="flex items-center">
                                    </div>
                                  </td>
                                  <td className="p-5 flex">
                                    <svg
                                      className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                      viewBox="0 0 12 12"
                                    >
                                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                    </svg>
                                    24hrs Inquiry Deletion Script:
                                  </td>
                                  <td className="p-5">
                                    <button className="text-white" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSubscriptionModalOpen(true); }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                        <path d="M6.5 12h14.5" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>

                                <tr >
                                  <td className="p-2">
                                    <div className="flex items-center">
                                    </div>
                                  </td>
                                  <td className="p-5 flex">
                                    <svg
                                      className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                      viewBox="0 0 12 12"
                                    >
                                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                    </svg>
                                    Late Payment Deletion Script:
                                  </td>
                                  <td className="p-5">
                                    <button className=" text-white" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setSubscriptionModalOpen(true); }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bd0808" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                        <path d="M6.5 12h14.5" />
                                      </svg>
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
                <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                  <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">Learning Center</h2>
                  </header>
                  <div className="p-3">
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                          <tr >
                            <td className="p-2">
                              <div className="flex items-center">
                              </div>
                            </td>
                            <td className="p-5 flex">
                              <svg
                                className="w-5  shrink-0 fill-current text-emerald-500 mr-2"
                                viewBox="0 0 12 12"
                              >
                                <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                              </svg>
                              Welcome to
                              LEARNING CENTER
                            </td>
                            <td className="p-5">
                              <a
                                target="_blank"
                                href="http://www.consumerlawdispute.ai/learning-management/"
                                className="btn tm-background text-white"
                                onClick={() => userActivity("Page visit", "http://www.consumerlawdispute.ai/learning-management/", "external", "", "Welcome to LEARNING CENTER")}
                              >Open
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr className='mb-3'></hr>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div className="w-full">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              // src="https://www.youtube.com/embed/egJjwrvUSig"
                              src="https://www.youtube.com/embed/tQM9QTsFRkY"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              uk-responsive
                              uk-video="automute: true"
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              // src="https://www.youtube.com/embed/NFPpy2HOcdE"
                              src="https://www.youtube.com/embed/bMfSF9Xubnw"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              uk-responsive
                              uk-video="automute: true"
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              // src="https://www.youtube.com/embed/NFPpy2HOcdE"
                              src="https://www.youtube.com/embed/tnLYtRDJCwA"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              uk-responsive
                              uk-video="automute: true"
                            ></iframe>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src="https://www.youtube.com/embed/h3z_-xx4fa8"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              uk-responsive
                              uk-video="automute: true"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {/* <Footer></Footer> */}

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
                                  <CircularProgressbar
                                    value={"-"}
                                    text={"-"}
                                  />
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
                                  processDataResponse.creditInfo["FICO® Score 8"]?.[0].TransUnion && (
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
                                  )}
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
                                  processDataResponse.creditInfo["FICO® Score 8"]?.[0].Experian && (
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
                                  )}
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
    </>
  );
}

export default Dashboard;