import { React, useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { GET_SINGLE_PROCESS_BY_ID, DOWNLOAD_REPORT_PDF, GET_PDF_FROM_AWS, GET_USER_NAME_BY_ID, GET_USER_DETAILS } from "../API/api"
// import siteLogo from "../images/consumer_logo.png"
import siteLogo from "../images/logo-dark-mode.png";

import { CircularProgressbar } from 'react-circular-progressbar';
import { useParams } from "react-router-dom";
import CompanyLogo from './CompanyLogo';


function ProcressDataResponsePdf() {
    const { state } = useLocation();
    const { id } = useParams();
    const currentUrl = window.location.href;
    // const token = new URLSearchParams(window.location.search).get('token');
    const dataID = new URLSearchParams(window.location.search).get('did');
    const [Derogatorycount, setCount] = useState(0);
    const [processData, setProcessData] = useState("");
    const [setLoader, setsetLoader] = useState(false);
    const [positiveAndNagativeCount, setpositiveAndNagativeCount] = useState("");
    const [processDataResponse, setprocessDataResponse] = useState('');
    const [isPdfButton, setisPdfButton] = useState("");
    const [userName, setUserName] = useState("");
    const equifaxValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Equifax) || 0;
    const transUnionValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].TransUnion) || 0;
    const experianValue = parseInt(processDataResponse?.summaryInfo?.['Delinquent'][0].Experian) || 0;
    const totalDelinquentValue = equifaxValue + transUnionValue + experianValue;
    console.log(equifaxValue, transUnionValue, experianValue, "totalDelinquentValuetotalDelinquentValue")

    const equifaxPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Equifax) || 0;
    const transUnionPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].TransUnion) || 0;
    const experianPublicValue = parseInt(processDataResponse?.summaryInfo?.['Public Records'][0].Experian) || 0;
    const totalPublicRecordValue = equifaxPublicValue + transUnionPublicValue + experianPublicValue;

    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [userData, setUserData] = useState("");
    const [bankInfoData, setBankInfoData] = useState([]);
    const [personalInfoData, setPersonalInfoData] = useState("");

    useEffect(() => {
        if (processDataResponse?.bankInfo?.results) {
            const results = processDataResponse.bankInfo.results;
            setBankInfoData(results);
            const count = results.filter(val => val.latePaymentSummary !== "").length;
            setCount(count);
        }
        if (processDataResponse?.personalInfo) {
            const persInfo = processDataResponse?.personalInfo;
            setPersonalInfoData(persInfo);
        }
    }, [processDataResponse]);

    const getUserName = async () => {
        try {
            let URL = GET_USER_NAME_BY_ID(id);
            const response = await axios.get(URL);
            setUserName(response.data.UserDetails);
        } catch (error) {
            console.log(error.response.data.message || "Something went Wrong");
        }
    };
    useEffect(() => {
        if (id) {
            // setsetLoader(true)
            getSingleProcessData();
            getUserName()
        }
    }, []);

    const getSingleProcessData = async () => {
        try {
            const response = await axios.post(GET_SINGLE_PROCESS_BY_ID,
                {
                    id: id,
                    dataID: dataID
                });
            setpositiveAndNagativeCount(response?.data?.derogatory[0]?.process_data_object?.summaryInfo);
            if (response?.data?.derogatory[0]) {
                setprocessDataResponse(response?.data?.derogatory[0]?.process_data_object);
                setisPdfButton(response?.data?.derogatory[0]?.pdf_key)
            }
            const arrageData = await getProcessDatas(response.data.derogatory)
            setProcessData(arrageData);
        } catch (error) {
            toast.error(error.response.data.message || "Something went Wrong");
        }
    };

    const getProcessDatas = async (data) => {
        const mergedValues = data?.map((entry) => {
            const id = entry?._id;
            const reportDate = entry?.process_data_object.ReportDateInfo;
            let ficoScores = ""
            if (entry?.process_data_object.creditInfo["Credit Score"]) {
                ficoScores = entry?.process_data_object.creditInfo["Credit Score"]
            } else {
                ficoScores = entry?.process_data_object.creditInfo['FICO® Score 8'];

            }
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

    const UploadPdf = async () => {
        setsetLoader(true)
        try {
            const response = await axios.post(DOWNLOAD_REPORT_PDF,
                {
                    id: id,
                    url: currentUrl,
                    awsId: dataID
                });
            if (response.data.Result.key) {
                downLoadDocument(response.data.Result.key, response.data.Result.Bucket)
            }
            setsetLoader(false)
        } catch (error) {
            setsetLoader(false)
            toast.error(error.response.data.message || "Something went Wrong");
        }
    };
    const downLoadDocument = async (isKeyId, isBucketName) => {
        try {
            const response = await axios.post(GET_PDF_FROM_AWS, {
                Key: isKeyId,
                Bucket: isBucketName,
            }, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', isKeyId);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error(error.response.data.message || "Something went Wrong");
        }
    };

    const getUserData = async () => {
        let URL = GET_USER_DETAILS(user._id);
        try {
            const response = await axios.get(URL,
                {
                    headers: { "Authorization": "Bearer " + token }
                });
            setUserData(response?.data);
        } catch (error) {
            toast.error("Something went Wrong");
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const capitalizeName = (name) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <>
            {setLoader &&
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            }
            <div className='flex overflow-hidden'>
                {/* Modal content */}
                <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                    <div className="md:px-20 px-10 grow bg-white dark:bg-[#FFFFFF]">
                        <div className="top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 md:px-5 xl:px-5 px-0 py-3 flex justify-between items-center">
                            <div className="font-semibold text-slate-800 dark:text-slate-100 moveto-left">
                                {/* hide-on-small */}
                                <a href={`/credit-report-list/${id}`} className='hide-on-small show-on-large'>Back</a>
                                {/* hide-on-large */}
                                <a href={`/credit-report-list/${id}`} className='hide-on-large show-on-small'>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.25 25L6.25 16L15.25 7M7.5 16H25.75"
                                            stroke="#080D18"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </a>
                            </div>
                            <div className='text-center md:ms-6 xl:ms-6 ms-0 md:pl-6 xl:pl-6 pl-0'>
                                <Link href="/" className="report-logo-align">
                                    {/* <img
                                        src={siteLogo}
                                        width={250}
                                        alt="logo"
                                    /> */}
                                    {(user?.role === "agent" || user?.role === "agency_agent" || user?.role === "client") && !(user?.plan_name === "1" || user?.plan_name === "5") ?
                                        <CompanyLogo user={user} userData={userData} />
                                        :
                                        <img src={siteLogo} width={250} alt="logo" />
                                    }
                                </Link>
                            </div>
                            {/* {isPdfButton ?
                        <button
                            className="btn tm-background text-white"
                            onClick={(e) => downLoadDocument(isPdfButton, 'consumer-daily-files')}
                        >
                           CLS-Audit
                        </button>

                        : */}
                            <button
                                className="btn tm-background text-white"
                                onClick={UploadPdf}
                            >
                                {userName ? capitalizeName(userName) : ""}{userName ? "-" : ""}
                                {/* CLS-Audit */}
                                Credit Report Audit
                            </button>
                            {/* } */}

                        </div>
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-2xl uppercase text-center" style={{ background: "#cb1717" }}>Your Credit Scores and Summary</h1>
                            <p className="mt-5 mb-4 text-center text-sm	">We have analyzed your credit reports from the three major bureaus. Here are our findings:</p>
                            <div className="grid grid-cols-12 gap-6 p-2">
                                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                                        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">EQUIFAX</h2>
                                    </header>
                                    <div className="flex flex-col h-full">
                                        <div className="px-5 py-3">
                                            <div className="">
                                                <div className="relative  justify-center w-3 h-3" aria-hidden="true">
                                                    {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                                                    {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                                                </div>
                                                <div className="px-5 py-3">
                                                    <div className="">
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
                                            <div className="">
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
                                            <div className="">
                                                <div className="relative  justify-center w-3 h-3 mr-3" aria-hidden="true">
                                                    {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                                                    {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                                                </div>
                                                <div className="px-5 py-3">
                                                    <div className="">
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
                                            <div className="">
                                                <div className="relative  justify-center w-3 h-3 mr-3" aria-hidden="true">
                                                    {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                                                    {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                                                </div>
                                                <div className="px-5 py-3">
                                                    <div className="">
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

                        {/* Personal Info table */}
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-2xl uppercase text-center" style={{ background: "#cb1717" }}>Personal Information</h1>
                            {/* <p className="mt-5 mb-4 text-center text-sm	">We analyzed all the items on your reports to determine which accounts are negatively impacting your score. Here are our
                                findings:</p> */}
                            <div className="p-4">
                                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <div className="flex flex-col h-full">
                                        <div className="grow px-5 pt-3 pb-1">
                                            <div className="overflow-x-auto">
                                                <table className="w-full lg:table-fixed table-auto dark:text-slate-300">
                                                    <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                                                        <tr>
                                                            <th className="py-2 px-2">
                                                            </th>
                                                            <th className="py-2 px-2">
                                                                <div className="font-semibold text-center">TransUnion</div>
                                                            </th>
                                                            <th className="py-2 px-2">
                                                                <div className="font-semibold text-center">EXPERIAN</div>
                                                            </th>
                                                            <th className="py-2 px-2">
                                                                <div className="font-semibold text-center">EQUIFAX</div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Credit Report Date:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Credit Report Date"]?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Credit Report Date"]?.[0]?.Experian}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Credit Report Date"]?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Name:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Name?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Name?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Name?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Also Known As:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Also Known As"]?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Also Known As"]?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Also Known As"]?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr className=''>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Former:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Former?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Former?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Former?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Date of Birth:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Date of Birth"]?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Date of Birth"]?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Date of Birth"]?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Current  Address(es):</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Current Address(es)"]?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Current Address(es)"]?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Current Address(es)"]?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Previous  Address(es):</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Previous Address(es)"]?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Previous Address(es)"]?.[0]?.Experian || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.["Previous Address(es)"]?.[0]?.Equifax || "-"}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 px-2">
                                                                <div className="text-center">Employers:</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Employers?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Employers?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                            <td className="py-2 px-2">
                                                                <div className="font-medium text-center text-slate-800">{personalInfoData?.Employers?.[0]?.TransUnion || "-"}</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account history */}
                     
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-2xl uppercase text-center" style={{ background: "#cb1717" }}>Derogatory Summary</h1>
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
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-2xl uppercase text-center" style={{ background: "#cb1717" }}>Derogatory Items</h1>
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
                                                                <h1 className=" text-5xl text-red-600">{Derogatorycount}</h1>
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
                            <div className='mb-10'>
                                <div className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <div className="flex flex-col h-full">
                                        <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                                            {/* <h2 className="font-semibold text-slate-100 dark:text-slate-100">Inquiry</h2> */}
                                            <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                                        </header>
                                        <div className="grow px-5">
                                            {/* <p className='my-3 text-xs text-[black]'>Number Of Records : {processDataResponse?.bankInfo?.results ? processDataResponse?.bankInfo?.results.length :0}</p> */}
                                            <div className="mt-3">
                                                <div className='overflow-x-auto'>
                                                    <table className="table-auto w-full dark:text-slate-300">
                                                        <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                                                            <tr className=''>
                                                                <th className="py-3 px-5 rounded-l-lg">
                                                                    <div className="font-semibold text-center text-black">Account Name</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EQUIFAX</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">TransUnion</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EXPERIAN</div>
                                                                </th>
                                                                <th className="py-3 px-5 ">
                                                                    <div className="font-semibold text-center text-black whitespace-nowrap">Issue</div>
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
                        </div>
                        {/*  */}
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-xl uppercase text-center" style={{ background: "#cb1717" }}>Public Records</h1>
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
                            <div className='mb-10'>
                                <div className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <div className="flex flex-col h-full">
                                        <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                                            {/* <h2 className="font-semibold text-slate-100 dark:text-slate-100">Inquiry</h2> */}
                                            <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                                        </header>
                                        <div className="grow px-5">
                                            {/* <p className='my-3 text-xs text-[black]'>Number Of Records : {processDataResponse?.bankInfo?.results ? processDataResponse?.bankInfo?.results.length :0}</p> */}
                                            <div className="mt-3">
                                                <div className='overflow-x-auto'>
                                                    <table className="table-auto w-full dark:text-slate-300">
                                                        <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                                                            <tr className=''>
                                                                <th className="py-3 px-5 rounded-l-lg">
                                                                    <div className="font-semibold text-center text-black">Account Name</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EQUIFAX</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">TransUnion</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EXPERIAN</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">Issue</div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {/* Table body */}
                                                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
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
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-xl uppercase text-center" style={{ background: "#cb1717" }}>Inquiries</h1>
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
                            <div className='mb-10'>
                                <div className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <div className="flex flex-col h-full">
                                        <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                                            {/* <h2 className="font-semibold text-slate-100 dark:text-slate-100">Inquiry</h2> */}
                                            <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                                        </header>
                                        <div className="grow px-5">
                                            {/* <p className='my-3 text-xs text-[black]'>Number Of Records : {processDataResponse?.bankInfo?.results ? processDataResponse?.bankInfo?.results.length :0}</p> */}
                                            <div className="mt-3">
                                                <div className='overflow-x-auto'>
                                                    <table className="table-auto w-full dark:text-slate-300">
                                                        <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                                                            <tr className=''>
                                                                <th className="py-3 px-5 rounded-l-lg">
                                                                    <div className="font-semibold text-center text-black">Account Name</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EQUIFAX</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">TransUnion</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">EXPERIAN</div>
                                                                </th>
                                                                <th className="py-3 px-5">
                                                                    <div className="font-semibold text-center text-black">Issue</div>
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

                        {/*  */}
                        <div className='mt-5 mb-5'>
                            <h1 className="pt-5 pb-4 font-semibold text-white rounded-2xl uppercase text-center" style={{ background: "#cb1717" }}>Account History</h1>
                            {/* <p className="mt-5 mb-4 text-center text-sm	">We analyzed all the items on your reports to determine which accounts are negatively impacting your score. Here are our
                                findings:</p> */}
                            <div className="p-4">
                                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                                    <div className="flex flex-col h-full">
                                        {/* <h1 className="pt-3 pb-3 ps-3 font-semibold text-white rounded-2xl uppercase " style={{ background: "#cb1717" }}>CAPITAL ONE</h1> */}
                                        <div className="grow px-5 pt-3 pb-1">
                                            <div className="overflow-x-auto">
                                                {bankInfoData?.map((bankData, index) => (
                                                    <table className="w-full lg:table-fixed table-auto dark:text-slate-300 m-5">
                                                        <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-gray-100 m-5">
                                                            <tr>
                                                                <th className="py-2 px-2" style={{ fontSize: '18px', color: "black" }}><b>{bankData?.bankName}</b>
                                                                </th>
                                                                <th className="py-2 px-2">
                                                                    <div className="font-semibold text-center">TransUnion</div>
                                                                </th>
                                                                <th className="py-2 px-2">
                                                                    <div className="font-semibold text-center">EXPERIAN</div>
                                                                </th>
                                                                <th className="py-2 px-2">
                                                                    <div className="font-semibold text-center">EQUIFAX</div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700 m-5">
                                                            <tr>
                                                                <td className="py-5 px-5">
                                                                    <div className="text-center">Account #:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountNumberData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountNumberData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountNumberData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Account Type:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Account Type - Detail:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeDetailData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeDetailData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTypeDetailData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr className=''>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Bureau Code:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.bureauCodeData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.bureauCodeData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.bureauCodeData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Account Status:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountStatusData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountStatusData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountStatusData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Monthly Payment:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.monthlyPaymentData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.monthlyPaymentData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.monthlyPaymentData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Date Opened:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.dateOpenedData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.dateOpenedData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.dateOpenedData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Balance:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountBalanceData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountBalanceData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountBalanceData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">No. of Months (terms):</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTermsData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTermsData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountTermsData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">High Credit:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.highCreditData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.highCreditData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.highCreditData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Credit Limit:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.creditLimitData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.creditLimitData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.creditLimitData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Past Due:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.pastDueData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.pastDueData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.pastDueData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Payment Status:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.paymentStatusData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.paymentStatusData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.paymentStatusData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Last Reported:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastReportedData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastReportedData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastReportedData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Comments:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountCommentsData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountCommentsData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.accountCommentsData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Date Last Active:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastActiveData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastActiveData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastActiveData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-center">Date of Last Payment:</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastPaymentData?.TransUnion || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastPaymentData?.Experian || "-"}</div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <div className="font-medium text-center text-slate-800">{bankData?.lastPaymentData?.Equifax || "-"}</div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProcressDataResponsePdf
