import React, { useState, useEffect } from "react";

import Header from "../../partials/Header";
import { Link } from "react-router-dom";
import Loder from "../../partials/Loder";
import { useParams } from "react-router-dom";
import {
  GET_AWS_DATA,
  DISPUTE_TO_INQUIRY,
  CREATE_USERS_ACTIVITY,
  DELETE_DDISPUTE_RECORD,
} from "../../API/api";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import ModalBlank from "../../components/ModalBlank";
import DashboardSidebar from "../../partials/DashboardSidebar";
import transIcon from "../../images/dashboard_img/trash-outline.png";
import SubNavbar from "../../components/SubNavbar";

function Invoices() {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id, disputeid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [awsData, setAwsData] = useState();
  const [Derogatorycount, setCount] = useState(0);
  const [isDisputeInquiry, setIsDisputeInquiry] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [isDelete, setIsDelete] = useState({ type: "", index: "" });
  const [isInfoModaldata, setIsInfoModaldata] = useState(null);
  const userActivity = async (
    activityName,
    externalPage,
    pagetype,
    activityStatus,
    description
  ) => {
    try {
      const response = await axios.post(
        CREATE_USERS_ACTIVITY,
        {
          user_id: user?._id,
          activity: activityName,
          externalPage: externalPage,
          pagetype: pagetype,
          activityStatus: activityStatus,
          description: description,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  const selectRecord = (isChecked, data, i, type, valID) => {
    if (isChecked) {
      if (type === "inquiry") {
        let aws_data = awsData;
        let inq = aws_data?.process_data_object?.inquiriesInfo?.tabledata;
        inq[i].seleted = true;
        aws_data.process_data_object.inquiriesInfo.tabledata = inq;
        setAwsData(aws_data);
      } else if (type === "derogatory") {
        awsData?.process_data_object?.bankInfo?.results;
        let aws_data = awsData;
        let inq = aws_data?.process_data_object?.bankInfo?.results;
        inq[i].seleted = true;
        aws_data.process_data_object.bankInfo.results = inq;
        setAwsData(aws_data);
      } else if (type === "public") {
        awsData?.process_data_object?.publicRecordInfo;
        let aws_data = awsData;
        let inq = aws_data?.process_data_object?.publicRecordInfo;
        inq[i].seleted = true;
        aws_data.process_data_object.publicRecordInfo = inq;
        setAwsData(aws_data);
      }
      const record = {
        aws_id: disputeid,
        data: data,
        type: type,
        val_id: valID,
      };
      setSelectedRecords((prevSelected) => [...prevSelected, record]);
    } else {
      setSelectedRecords((prevSelected) =>
        prevSelected.filter((prevRecord) => prevRecord.data !== data)
      );
    }
  };

  useEffect(() => {
    if (awsData?.process_data_object?.bankInfo?.results) {
      const results = awsData?.process_data_object?.bankInfo.results;
      const count = results.filter(
        (val) => val.latePaymentSummary !== ""
      ).length;
      setCount(count);
    }
  }, [awsData]);

  // const selectRecord = (data, i, type, valID) => {
  //   console.log(data, 'dattttta');
  //   setSelectStatus(true);
  //   if (type === "inquiry") {
  //     let aws_data = awsData;
  //     let inq = aws_data?.process_data_object?.inquiriesInfo?.tabledata;
  //     inq[i].seleted = true;
  //     aws_data.process_data_object.inquiriesInfo.tabledata = inq;
  //     setAwsData(aws_data);
  //   }
  //   else if (type === "derogatory") {
  //     awsData?.process_data_object?.bankInfo?.results
  //     let aws_data = awsData;
  //     let inq = aws_data?.process_data_object?.bankInfo?.results;
  //     inq[i].seleted = true;
  //     aws_data.process_data_object.bankInfo.results = inq;
  //     setAwsData(aws_data);
  //   }
  //   // awsData?.process_data_object?.bankInfo?.results
  //   const record = {
  //     aws_id: disputeid,
  //     data: data,
  //     type: type,
  //     val_id: valID,
  //   };
  //   setSelectedRecords((prevSelected) => [...prevSelected, record]);
  // }

  const equifaxValue =
    parseInt(
      awsData?.process_data_object?.summaryInfo?.["Delinquent"][0].Equifax
    ) || 0;
  const transUnionValue =
    parseInt(
      awsData?.process_data_object?.summaryInfo?.["Delinquent"][0].TransUnion
    ) || 0;
  const experianValue =
    parseInt(
      awsData?.process_data_object?.summaryInfo?.["Delinquent"][0].Experian
    ) || 0;
  const totalDelinquentValue = equifaxValue + transUnionValue + experianValue;

  const processSelectedRecords = async () => {
    if (selectedRecords.length <= 0) {
      toast.error("Please select items.");
    }
    for (const record of selectedRecords) {
      try {
        let requestData = {
          user_id: id,
          aws_id: record.aws_id,
          data: record.data,
          type: record.type,
        };

        // console.log(requestData?.type, 'type');
        // return
        const response = await axios.post(DISPUTE_TO_INQUIRY, requestData, {
          headers: { Authorization: "Bearer " + token },
        });
        getAwsData();
        setSuccessModalOpen(true);

        let disputeType = "";
        let disputeItem = "";
        if (requestData?.type && requestData?.type === "inquiry") {
          disputeType = "Inquiry";
          disputeItem = requestData?.data["Creditor Name"];
        } else if (requestData?.type && requestData?.type === "derogatory") {
          disputeType = "Derogatory";
          disputeItem = requestData?.data["bankName"];
        } else if (requestData?.type && requestData?.type === "public") {
          disputeType = "Public";
          disputeItem = requestData?.data?.bankName;
        }
        if (response.data.message) {
          userActivity(
            "Dispute",
            "",
            "",
            "success",
            `Dispute ${disputeType}-${disputeItem}`
          );
        } else {
          userActivity(
            "Dispute",
            "",
            "",
            "failed",
            `Dispute ${disputeType}-${disputeItem}, Failed!`
          );
        }
      } catch (error) {
        let requestData = {
          data: record.data,
          type: record.type,
        };
        toast.error(error.response.data.message || "Something went Wrong");
        let disputeType =
          requestData?.type && requestData?.type === "inquiry"
            ? "Inquiry"
            : "Derogatory";
        let disputeItem =
          requestData?.type && requestData?.type === "inquiry"
            ? requestData?.data["Creditor Name"]
            : requestData?.data["bankName"];
        userActivity(
          "Dispute",
          "",
          "",
          "failed",
          `Dispute ${disputeType}-${disputeItem}, Failed`
        );
      }
    }
    setSelectedRecords([]);
  };

  const processSingleRecord = async (data, i, type, valID) => {
    const dis = data;
    if (type === "inquiry") {
      let aws_data = awsData;
      let inq = aws_data?.process_data_object?.inquiriesInfo?.tabledata;
      inq[i].seleted = true;
      aws_data.process_data_object.inquiriesInfo.tabledata = inq;
      setAwsData(aws_data);
    } else if (type === "derogatory") {
      awsData?.process_data_object?.bankInfo?.results;
      let aws_data = awsData;
      let inq = aws_data?.process_data_object?.bankInfo?.results;
      inq[i].seleted = true;
      aws_data.process_data_object.bankInfo.results = inq;
      setAwsData(aws_data);
    } else if (type === "public") {
      awsData?.process_data_object?.publicRecordInfo;
      let aws_data = awsData;
      let inq = aws_data?.process_data_object?.publicRecordInfo;
      inq[i].seleted = true;
      aws_data.process_data_object.publicRecordInfo = inq;
      setAwsData(aws_data);
    }
    let disputeType = "";
    let disputeItem = "";

    if (type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = data["Creditor Name"];
    } else if (type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = data["bankName"];
    } else if (type === "public") {
      disputeType = "Public";
      disputeItem = data?.bankName;
    }

    // let disputeType = type && type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = type && type === "inquiry" ? data['Creditor Name'] : data['bankName'];
    try {
      let requestData = {
        user_id: id,
        aws_id: disputeid,
        data: dis,
        type: type,
      };
      const response = await axios.post(DISPUTE_TO_INQUIRY, requestData, {
        headers: { Authorization: "Bearer " + token },
      });
      getAwsData();
      setSuccessModalOpen(true);
      if (response.data.message) {
        userActivity(
          "Dispute",
          "",
          "",
          "success",
          `Dispute ${disputeType}-${disputeItem}`
        );
      } else {
        userActivity(
          "Dispute",
          "",
          "",
          "failed",
          `Dispute ${disputeType}-${disputeItem}, Failed!`
        );
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      userActivity(
        "Dispute",
        "",
        "",
        "failed",
        `Dispute ${disputeType}-${disputeItem}, Failed!`
      );
    }
    setSelectedRecords([]);
  };

  const getAwsData = async () => {
    try {
      let URL = GET_AWS_DATA(disputeid);
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      setAwsData(response.data);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const removeDesputeRecords = async (index, type) => {
    setIsDelete({ type: type, index: index });
    try {
      let URL = DELETE_DDISPUTE_RECORD;
      let reqData = {
        id: disputeid,
        index,
        type,
      };
      const response = await axios.post(URL, reqData, {
        headers: { Authorization: "Bearer " + token },
      });
      getAwsData();
      toast.success(response.data.message);
      setIsDelete({ type: "", index: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
      setIsDelete({ type: "", index: "" });
    }
  };

  useEffect(() => {
    getAwsData();
  }, []);

  const openAccountInformationModal = async (val) => {
    setIsInfoModaldata(val);
    setOpenInfoModal(true);
  };

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ? (
        <SubNavbar />
      ) : (
        ""
      )}
      <div className="flex sm:h-[100dvh] bg-white">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="relative p-5 flex flex-col flex-1 overflow-y-auto overflow-x-auto md:overflow-visible">
          <main className="grow">
            <div className="pl-2 py-2 w-full">
              <div className="sm:flex sm:justify-between sm:items-center">
                <div className="sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                    Report
                  </h1>
                </div>
              </div>
            </div>
            <div className="pl-2  w-full">
              <div className="mb-16">
                <div
                  className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="flex flex-col h-full">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Inquiry
                      </h2>
                    </header>
                    <div className="grow px-5">
                      <p className="my-3 text-xs text-[black]">
                        Number Of Inquiry :{" "}
                        {awsData?.process_data_object?.inquiriesInfo?.tabledata
                          ? Object.keys(
                              awsData?.process_data_object?.inquiriesInfo
                                ?.tabledata
                            ).length
                          : 0}
                      </p>
                      <div className="">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                              <tr className="">
                                <th className="py-3 px-5 rounded-l-lg">
                                  <div className="font-semibold text-center text-black">
                                    Account Name
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    EQUIFAX
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    TransUnion
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    EXPERIAN
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    Issue
                                  </div>
                                </th>
                                <th className="py-3 px-5 rounded-r-lg">
                                  <div className="font-semibold text-center text-black">
                                    Action
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {awsData?.process_data_object?.inquiriesInfo?.tabledata.map(
                                (val, i) => {
                                  return (
                                    <tr key={i}>
                                      {val.latePaymentSummary !== "" ? (
                                        <>
                                          <td className="py-1 px-5">
                                            <div className="text-center">
                                              {val?.["Creditor Name"]}
                                            </div>
                                          </td>
                                          <td className="py-1 px-5">
                                            <div className="text-center">
                                              {val?.["Credit Bureau"] ===
                                              "Equifax" ? (
                                                <>
                                                  <div className="text-lg	font-extrabold text-red-700">
                                                    X
                                                  </div>
                                                  <div className="text-xs	">
                                                    {val?.["Date of inquiry"]}
                                                  </div>
                                                </>
                                              ) : (
                                                "-"
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-1 px-5">
                                            <div className="text-center">
                                              {val?.["Credit Bureau"] ===
                                              "TransUnion" ? (
                                                <>
                                                  <div className="text-lg	font-extrabold text-red-700">
                                                    X
                                                  </div>
                                                  <div className="text-xs	">
                                                    {val?.["Date of inquiry"]}
                                                  </div>
                                                </>
                                              ) : (
                                                "-"
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-1 px-5">
                                            <div className="text-center">
                                              {val?.["Credit Bureau"] ===
                                              "Experian" ? (
                                                <>
                                                  <div className="text-lg	font-extrabold text-red-700">
                                                    X
                                                  </div>
                                                  <div className="text-xs	">
                                                    {val?.["Date of inquiry"]}
                                                  </div>
                                                </>
                                              ) : (
                                                "-"
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-1 px-5">
                                            <div className="text-center">
                                              Inquiry
                                            </div>
                                          </td>
                                          {user.role != "client" && (
                                            <td className="py-2 px-5 text-center">
                                              {val?.status ? (
                                                <p className="capitalize text-green-600">
                                                  {val?.status == "disputed"
                                                    ? "In Dispute"
                                                    : val?.status}
                                                </p>
                                              ) : (
                                                <>
                                                  {isDisputeInquiry == i ? (
                                                    <button className="py-2 px-5 rounded-3xl tm-background text-white">
                                                      {" "}
                                                      <Loder />
                                                    </button>
                                                  ) : (
                                                    <>
                                                      <input
                                                        type="checkbox"
                                                        className="form-checkbox mr-3"
                                                        onClick={(e) =>
                                                          selectRecord(
                                                            e.target.checked,
                                                            val,
                                                            i,
                                                            "inquiry",
                                                            val?.info_id
                                                          )
                                                        }
                                                      />
                                                      <button
                                                        className="py-2 px-5 rounded-3xl-sm text-black text-center rounded-full bg-[#DDE0E3]"
                                                        onClick={() =>
                                                          processSingleRecord(
                                                            val,
                                                            i,
                                                            "inquiry",
                                                            val?.info_id
                                                          )
                                                        }
                                                      >
                                                        Dispute
                                                      </button>
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </td>
                                          )}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 mb-5">
                <div
                  className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="flex flex-col h-full">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        Derogatory Items
                      </h2>
                    </header>
                    <div className="grow px-5 pt-3 pb-1">
                      <p className="my-3 text-xs text-[black]">
                        Derogatory Items : {Derogatorycount}
                      </p>
                      <div className="overflow-y-hidden overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
                          <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                            <tr>
                              <th className="py-3 px-5 rounded-l-lg">
                                <div className="font-semibold text-left text-black">
                                  Account Name
                                </div>
                              </th>
                              <th className="py-3 px-5 rounded-l-lg">
                                <div className="font-semibold text-left text-black">
                                  Account Details
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-left text-black">
                                  EQUIFAX
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-left text-black">
                                  TransUnion
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-left text-black">
                                  EXPERIAN
                                </div>
                              </th>
                              <th className="py-3 px-5">
                                <div className="font-semibold text-left text-black">
                                  Issue
                                </div>
                              </th>
                              <th className="py-3 px-5 rounded-r-lg">
                                <div className="font-semibold text-left text-black">
                                  Action
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                            {awsData?.process_data_object?.bankInfo?.results.map(
                              (val, i) => {
                                return (
                                  <tr key={i}>
                                    {val?.latePaymentSummary !== "" ? (
                                      <>
                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="text-left">
                                            {val?.bankName}
                                          </div>
                                        </td>

                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <button
                                            className="py-2 px-5 rounded-3xl-sm text-black text-center rounded-full bg-[#DDE0E3] mt-1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openAccountInformationModal(val);
                                            }}
                                          >
                                            View Details
                                          </button>
                                        </td>

                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="text-center">
                                            {val?.latePaymentCounts?.Equifax &&
                                            Object.keys(
                                              val?.latePaymentCounts?.Equifax
                                            ).length > 0 ? (
                                              <>
                                                <div className="text-lg	font-extrabold text-red-700">
                                                  X
                                                </div>
                                                <div className="text-xs	">
                                                  Negative
                                                </div>
                                              </>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </td>

                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="text-center">
                                            {val?.latePaymentCounts
                                              ?.TransUnion &&
                                            Object.keys(
                                              val?.latePaymentCounts?.TransUnion
                                            ).length > 0 ? (
                                              <>
                                                <div className="text-lg	font-extrabold text-red-700">
                                                  X
                                                </div>
                                                <div className="text-xs	">
                                                  Negative
                                                </div>
                                              </>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                          <div className="text-center">
                                            {val?.latePaymentCounts?.Experian &&
                                            Object.keys(
                                              val?.latePaymentCounts?.Experian
                                            ).length > 0 ? (
                                              <>
                                                <div className="text-lg	font-extrabold text-red-700">
                                                  X
                                                </div>
                                                <div className="text-xs	">
                                                  Negative
                                                </div>
                                              </>
                                            ) : (
                                              "-"
                                            )}
                                          </div>
                                        </td>
                                        <td
                                          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
                                          style={{ width: "40%" }}
                                        >
                                          <div className="whitespace-nowrap sm:whitespace-normal">
                                            {val?.latePaymentSummary}
                                          </div>
                                        </td>
                                        {user.role != "client" && (
                                          <td className="py-1 px-1 text-center">
                                            {val?.status ? (
                                              <p className="capitalize text-green-600">
                                                {val?.status == "disputed"
                                                  ? "In Dispute"
                                                  : val?.status}
                                              </p>
                                            ) : (
                                              <>
                                                {isDisputeInquiry == i ? (
                                                  <button className="py-2 px-5 rounded-3xl tm-background text-white">
                                                    {" "}
                                                    <Loder />
                                                  </button>
                                                ) : (
                                                  <>
                                                    <input
                                                      type="checkbox"
                                                      className="form-checkbox mr-3"
                                                      onClick={(e) =>
                                                        selectRecord(
                                                          e.target.checked,
                                                          val,
                                                          i,
                                                          "derogatory"
                                                        )
                                                      }
                                                    />
                                                    <button
                                                      className="py-2 px-5 rounded-3xl-sm text-black text-center rounded-full bg-[#DDE0E3] mt-1"
                                                      onClick={() =>
                                                        processSingleRecord(
                                                          val,
                                                          i,
                                                          "derogatory"
                                                        )
                                                      }
                                                    >
                                                      DISPUTE
                                                    </button>
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </td>
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-20">
                <div
                  className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="flex flex-col h-full">
                    <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                      <h2 className="font-semibold text-slate-100 dark:text-slate-100">
                        PUBLIC RECORDS
                      </h2>
                    </header>
                    <div className="grow px-5 mb-10">
                      <p className="my-3 text-xs text-[black]">
                        Number Of Public Record :{" "}
                        {awsData?.process_data_object?.publicRecordInfo
                          ? Object.keys(
                              awsData?.process_data_object?.publicRecordInfo
                            ).length
                          : 0}
                      </p>
                      <div className="">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs text-slate-400 dark:text-slate-500 bg-gray-100">
                              <tr className="">
                                <th className="py-3 px-5 rounded-l-lg">
                                  <div className="font-semibold text-center text-black">
                                    Account Name
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    EQUIFAX
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    TransUnion
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    EXPERIAN
                                  </div>
                                </th>
                                <th className="py-3 px-5">
                                  <div className="font-semibold text-center text-black">
                                    Issue
                                  </div>
                                </th>
                                <th className="py-3 px-5 rounded-r-lg">
                                  <div className="font-semibold text-center text-black">
                                    Action
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {awsData?.process_data_object?.publicRecordInfo &&
                                awsData?.process_data_object?.publicRecordInfo.map(
                                  (val, i) => {
                                    return (
                                      <tr key={i}>
                                        {val.latePaymentSummary !== "" ? (
                                          <>
                                            <td className="py-1 px-5">
                                              <div className="text-center">
                                                {val?.bankName}
                                              </div>
                                            </td>
                                            <td className="py-1 px-5">
                                              <div className="text-center">
                                                {Object.keys(
                                                  val?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0]?.Equifax
                                                ).length > 0 ? (
                                                  <>
                                                    <div className="text-lg	font-extrabold text-red-700">
                                                      X
                                                    </div>
                                                    <div className="text-xs	">
                                                      Negative
                                                    </div>
                                                  </>
                                                ) : (
                                                  "-"
                                                )}
                                              </div>
                                            </td>
                                            <td className="py-1 px-5">
                                              <div className="text-center">
                                                {Object.keys(
                                                  val?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0]?.TransUnion
                                                ).length > 0 ? (
                                                  <>
                                                    <div className="text-lg	font-extrabold text-red-700">
                                                      X
                                                    </div>
                                                    <div className="text-xs	">
                                                      Negative
                                                    </div>
                                                  </>
                                                ) : (
                                                  "-"
                                                )}
                                              </div>
                                            </td>
                                            <td className="py-1 px-5">
                                              <div className="text-center">
                                                {" "}
                                                {Object.keys(
                                                  val?.TableData?.[
                                                    "Date Filed/Reported"
                                                  ][0]?.Experian
                                                ).length > 0 ? (
                                                  <>
                                                    <div className="text-lg	font-extrabold text-red-700">
                                                      X
                                                    </div>
                                                    <div className="text-xs	">
                                                      Negative
                                                    </div>
                                                  </>
                                                ) : (
                                                  "-"
                                                )}
                                              </div>
                                            </td>
                                            <td className="py-1 px-5">
                                              <div className="text-center">
                                                <td className="py-5 px-5 text-center">
                                                  <div className="">
                                                    Public Information
                                                  </div>
                                                </td>
                                              </div>
                                            </td>
                                            {user.role != "client" && (
                                              <td className="py-2 px-5 text-center">
                                                {val?.status ? (
                                                  <p className="capitalize text-green-600">
                                                    {val?.status == "disputed"
                                                      ? "In Dispute"
                                                      : val?.status}
                                                  </p>
                                                ) : (
                                                  <>
                                                    {isDisputeInquiry == i ? (
                                                      <button className="py-2 px-5 rounded-3xl tm-background text-white">
                                                        {" "}
                                                        <Loder />
                                                      </button>
                                                    ) : (
                                                      <>
                                                        <input
                                                          type="checkbox"
                                                          className="form-checkbox mr-3"
                                                          onClick={(e) =>
                                                            selectRecord(
                                                              e.target.checked,
                                                              val,
                                                              i,
                                                              "public"
                                                            )
                                                          }
                                                        />
                                                        <button
                                                          className="py-2 px-5 rounded-3xl-sm text-black text-center rounded-full bg-[#DDE0E3] mt-1"
                                                          onClick={() =>
                                                            processSingleRecord(
                                                              val,
                                                              i,
                                                              "public"
                                                            )
                                                          }
                                                        >
                                                          DISPUTE
                                                        </button>
                                                      </>
                                                    )}
                                                  </>
                                                )}
                                              </td>
                                            )}
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {user.role != "client" && (
              <div className=" bottom-0 sticky w-full text-white font-bold rounded-full  centered-button z-10">
                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col h-full">
                    <div className="text-center">
                      <button
                        className="py-2 px-5 rounded-3xl tm-background text-white mt-4 text-center mb-5"
                        onClick={processSelectedRecords}
                      >
                        DISPUTE ALL SELECTED
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          <ModalBlank
            id="success-modal"
            modalOpen={openInfoModal}
            setModalOpen={setOpenInfoModal}
          >
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  {isInfoModaldata?.bankName ? isInfoModaldata?.bankName : "-"}
                </div>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenInfoModal(false);
                    setIsInfoModaldata(null);
                  }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className=" mt-5 mb-5 pb-5  ps-2 pe-2">
              <div className="px-4">
                <form>
                  <div className="space-y-2">
                    <label
                      className="font-semibold text-slate-800 dark:text-slate-100"
                      htmlFor="card-surname"
                    >
                      Equifax -
                    </label>
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-name"
                        >
                          Account #:
                        </label>
                        <input
                          disabled
                          id="card-name"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountNumberData?.Equifax
                              ? isInfoModaldata?.accountNumberData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                    </div>

                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-surname"
                        >
                          Account Type:
                        </label>
                        <input
                          disabled
                          id="card-surname"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeData?.Equifax
                              ? isInfoModaldata?.accountTypeData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-address"
                        >
                          Account Type - Detail:
                        </label>
                        <input
                          disabled
                          id="card-address"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeDetailData?.Equifax
                              ? isInfoModaldata?.accountTypeDetailData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 2nd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Payment Status:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.paymentStatusData?.Equifax
                              ? isInfoModaldata?.paymentStatusData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Bureau Code:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.bureauCodeData?.Equifax
                              ? isInfoModaldata?.bureauCodeData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 3rd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Account Status:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountStatusData?.Equifax
                              ? isInfoModaldata?.accountStatusData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Date Opened:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.dateOpenedData?.Equifax
                              ? isInfoModaldata?.dateOpenedData?.Equifax
                              : "-"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className=" mt-5 mb-5 pb-5  ps-2 pe-2">
              <div className="px-4">
                <form>
                  <div className="space-y-4">
                  <label
                      className="font-semibold text-slate-800 dark:text-slate-100"
                      htmlFor="card-surname"
                    >
                      Experian -
                    </label>
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-name"
                        >
                          Account #:
                        </label>
                        <input
                          disabled
                          id="card-name"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountNumberData?.Experian
                              ? isInfoModaldata?.accountNumberData?.Experian
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 1st row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-surname"
                        >
                          Account Type:
                        </label>
                        <input
                          disabled
                          id="card-surname"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeData?.Experian
                              ? isInfoModaldata?.accountTypeData?.Experian
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-address"
                        >
                          Account Type - Detail:
                        </label>
                        <input
                          disabled
                          id="card-address"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeDetailData?.Experian
                              ? isInfoModaldata?.accountTypeDetailData?.Experian
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 2nd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Payment Status:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.paymentStatusData?.Experian
                              ? isInfoModaldata?.paymentStatusData?.Experian
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Bureau Code:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.bureauCodeData?.Experian
                              ? isInfoModaldata?.bureauCodeData?.Experian
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 3rd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Account Status:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountStatusData?.Experian
                              ? isInfoModaldata?.accountStatusData?.Experian
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Date Opened:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.dateOpenedData?.Experian
                              ? isInfoModaldata?.dateOpenedData?.Experian
                              : "-"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className=" mt-5 mb-5 pb-5  ps-2 pe-2">
              <div className="px-4">
                <form>
                  <div className="space-y-4">
                  <label
                      className="font-semibold text-slate-800 dark:text-slate-100"
                      htmlFor="card-surname"
                    >
                      TransUnion -
                    </label>
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-name"
                        >
                          Account #:
                        </label>
                        <input
                          disabled
                          id="card-name"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountNumberData?.TransUnion
                              ? isInfoModaldata?.accountNumberData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 1st row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-surname"
                        >
                          Account Type:
                        </label>
                        <input
                          disabled
                          id="card-surname"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeData?.TransUnion
                              ? isInfoModaldata?.accountTypeData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-address"
                        >
                          Account Type - Detail:
                        </label>
                        <input
                          disabled
                          id="card-address"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountTypeDetailData?.TransUnion
                              ? isInfoModaldata?.accountTypeDetailData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 2nd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Payment Status:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.paymentStatusData?.TransUnion
                              ? isInfoModaldata?.paymentStatusData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-city"
                        >
                          Bureau Code:
                        </label>
                        <input
                          disabled
                          id="card-city"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.bureauCodeData?.TransUnion
                              ? isInfoModaldata?.bureauCodeData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                    </div>
                    {/* 3rd row */}
                    <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Account Status:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.accountStatusData?.TransUnion
                              ? isInfoModaldata?.accountStatusData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="card-state"
                        >
                          Date Opened:
                        </label>
                        <input
                          disabled
                          id="card-state"
                          className="form-input w-full"
                          type="text"
                          Value={
                            isInfoModaldata?.dateOpenedData?.TransUnion
                              ? isInfoModaldata?.dateOpenedData?.TransUnion
                              : "-"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalBlank>

          <ModalBlank
            id="success-modal"
            modalOpen={successModalOpen}
            setModalOpen={setSuccessModalOpen}
          >
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-100"></div>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuccessModalOpen(false);
                  }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="pt-2 mt-4 mb-4 pb-2 ps-2 pe-2">
              {/* Icon */}

              {/* Content */}
              <div className="text-center">
                {/* Modal header */}
                <div className="mb-2 text-center">
                  <div className="mb-4" style={{ textAlign: "-webkit-center" }}>
                    <svg
                      className="w-15 h-12 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Item Selected for Dispute:
                  </div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-5">
                  <div className="space-y-2">
                    <p>
                      Start Your Dispute Process with ConsumerLawDispute.AI{" "}
                    </p>
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex  justify-center space-x-2">
                  <button
                    className="tm-background text-white rounded-3xl px-5 py-2 mr-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSuccessModalOpen(false);
                    }}
                  >
                    Dispute More
                  </button>
                  <Link
                    className="tm-background text-white rounded-3xl px-5 py-2 ml-5"
                    to={`/dispute/${id}`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </ModalBlank>
        </div>
      </div>
    </>
  );
}

export default Invoices;
