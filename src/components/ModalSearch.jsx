import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../utils/Transition";
import LineChart from "../charts/LineChart04";
import { tailwindConfig, hexToRGB } from "../utils/Utils";
import { CircularProgressbar } from "react-circular-progressbar";
// import siteLogo from "../images/consumer_logo.png"
import siteLogo from "../images/logo-dark-mode.png";

import "react-circular-progressbar/dist/styles.css";
function ModalSearch({
  id,
  searchId,
  modalOpen,
  setModalOpen,
  processDataResponse,
}) {
  const equifaxValue =
    parseInt(processDataResponse?.summaryInfo?.["Delinquent"][0].Equifax) || 0;
  const transUnionValue =
    parseInt(processDataResponse?.summaryInfo?.["Delinquent"][0].TransUnion) ||
    0;
  const experianValue =
    parseInt(processDataResponse?.summaryInfo?.["Delinquent"][0].Experian) || 0;
  const totalDelinquentValue = equifaxValue + transUnionValue + experianValue;

  const equifaxPublicValue =
    parseInt(processDataResponse?.summaryInfo?.["Public Records"][0].Equifax) ||
    0;
  const transUnionPublicValue =
    parseInt(
      processDataResponse?.summaryInfo?.["Public Records"][0].TransUnion
    ) || 0;
  const experianPublicValue =
    parseInt(
      processDataResponse?.summaryInfo?.["Public Records"][0].Experian
    ) || 0;
  const totalPublicRecordValue =
    equifaxPublicValue + transUnionPublicValue + experianPublicValue;

  const modalContent = useRef(null);
  const searchInput = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // useEffect(() => {
  //   modalOpen && searchInput.current.focus();
  // }, [modalOpen]);

  const chartData = {
    labels: [
      "12-01-2020",
      "01-01-2021",
      "02-01-2021",
      "03-01-2021",
      "04-01-2021",
      "05-01-2021",
      "06-01-2021",
      "07-01-2021",
      "08-01-2021",
      "09-01-2021",
      "10-01-2021",
      "11-01-2021",
      "12-01-2021",
      "01-01-2022",
      "02-01-2022",
      "03-01-2022",
      "04-01-2022",
      "05-01-2022",
      "06-01-2022",
      "07-01-2022",
      "08-01-2022",
      "09-01-2022",
      "10-01-2022",
      "11-01-2022",
      "12-01-2022",
      "01-01-2023",
    ],
    datasets: [
      {
        data: [
          732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532,
        ],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(
          tailwindConfig().theme.colors.blue[500]
        )}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };
  const percentage = 580;

  return (
    <>
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 overflow-auto max-w-5xl w-full max-h-full rounded shadow-lg"
        >
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-3 flex justify-between items-center">
            <div className="font-semibold text-slate-800 dark:text-slate-100"></div>
            <div className="text-center">
              <Link href="/" className="report-logo-align">
                <img src={siteLogo} width={250} alt="logo" />
              </Link>
            </div>
            <button
              className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
            >
              <div className="sr-only">Close</div>
              <svg className="w-4 h-4 fill-current">
                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
              </svg>
            </button>
          </div>
          <div className="mt-5 mb-5">
            <h1
              className="pt-5 pb-4 font-semibold text-white uppercase text-center"
              style={{ background: "#cb1717" }}
            >
              Your Credit Scores and Summary
            </h1>
            <p className="mt-5 mb-4 text-center text-sm	">
              We have analyzed your credit reports from the three major bureaus.
              Here are our findings:
            </p>
            <div className="grid grid-cols-12 gap-6 p-2">
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
                    EQUIFAX
                  </h2>
                </header>
                <div className="flex flex-col h-full">
                  <div className="px-5 py-3">
                    <div className="flex items-center">
                      <div
                        className="relative flex items-center justify-center w-3 h-3 mr-3"
                        aria-hidden="true"
                      >
                        {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                        {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                      </div>
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div>
                            {processDataResponse?.creditInfo &&
                            processDataResponse.creditInfo["FICO® Score 8"]?.[0]
                              .Equifax ? (
                              <CircularProgressbar
                                value={Number(
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].Equifax.slice(0, 2) || 0
                                )}
                                text={
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].Equifax
                                    ? processDataResponse.creditInfo[
                                        "FICO® Score 8"
                                      ][0].Equifax
                                    : "0"
                                }
                              />
                            ) : (
                              <>
                                {processDataResponse?.creditInfo && (
                                  <>
                                    {processDataResponse.creditInfo[
                                      "Credit Score"
                                    ]?.[0].Equifax ? (
                                      <CircularProgressbar
                                        value={Number(
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].Equifax.slice(0, 2) || 0
                                        )}
                                        text={
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].Equifax
                                            ? processDataResponse.creditInfo[
                                                "Credit Score"
                                              ][0].Equifax
                                            : "0"
                                        }
                                      />
                                    ) : (
                                      <CircularProgressbar
                                        value={"0"}
                                        text={"-"}
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <span className="text-center font-bold">
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
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Inquiries</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Public Records</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Collections</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-2">
                              <div className="text-left text-green-500">
                                Positive
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-green-500 ">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].Equifax &&
                                processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].Equifax -
                                    processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">
                              <div className="text-left text-red-500">
                                Negative
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-red-500">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Equifax
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/*  */}

              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
                    TransUnion
                  </h2>
                </header>
                <div className="flex flex-col h-full">
                  <div className="px-5 py-3">
                    <div className="flex items-center">
                      <div
                        className="relative flex items-center justify-center w-3 h-3 mr-3"
                        aria-hidden="true"
                      >
                        {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                        {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                      </div>
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div>
                            {processDataResponse?.creditInfo &&
                            processDataResponse.creditInfo["FICO® Score 8"]?.[0]
                              .TransUnion ? (
                              <CircularProgressbar
                                value={Number(
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].TransUnion.slice(0, 2) || 0
                                )}
                                text={
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].TransUnion
                                    ? processDataResponse.creditInfo[
                                        "FICO® Score 8"
                                      ][0].TransUnion
                                    : "0"
                                }
                              />
                            ) : (
                              <>
                                {processDataResponse?.creditInfo && (
                                  <>
                                    {processDataResponse.creditInfo[
                                      "Credit Score"
                                    ]?.[0].TransUnion ? (
                                      <CircularProgressbar
                                        value={Number(
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].TransUnion.slice(0, 2) || 0
                                        )}
                                        text={
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].TransUnion
                                            ? processDataResponse.creditInfo[
                                                "Credit Score"
                                              ][0].TransUnion
                                            : "0"
                                        }
                                      />
                                    ) : (
                                      <CircularProgressbar
                                        value={"0"}
                                        text={"-"}
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <span className="text-center font-bold">
                    {processDataResponse?.creditInfo &&
                    processDataResponse.creditInfo["Lender Rank"]?.[0]
                      .TransUnion
                      ? processDataResponse.creditInfo["Lender Rank"][0]
                          .TransUnion
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
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Inquiries</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Public Records</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Collections</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr className="text-success">
                            <td className="py-2">
                              <div className="text-left text-green-500">
                                Positive
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-green-500 ">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].TransUnion &&
                                processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].TransUnion -
                                    processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">
                              <div className="text-left text-red-500">
                                Negative
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-red-500">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].TransUnion
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
                    EXPERIAN
                  </h2>
                </header>
                <div className="flex flex-col h-full">
                  <div className="px-5 py-3">
                    <div className="flex items-center">
                      <div
                        className="relative flex items-center justify-center w-3 h-3 mr-3"
                        aria-hidden="true"
                      >
                        {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50"></div> */}
                        {/* <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-rose-500"></div> */}
                      </div>
                      <div className="px-5 py-3">
                        <div className="flex items-center">
                          <div>
                            {processDataResponse?.creditInfo &&
                            processDataResponse.creditInfo["FICO® Score 8"]?.[0]
                              .Experian ? (
                              <CircularProgressbar
                                value={Number(
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].Experian.slice(0, 2) || 0
                                )}
                                text={
                                  processDataResponse.creditInfo[
                                    "FICO® Score 8"
                                  ][0].Experian
                                    ? processDataResponse.creditInfo[
                                        "FICO® Score 8"
                                      ][0].Experian
                                    : "0"
                                }
                              />
                            ) : (
                              <>
                                {processDataResponse?.creditInfo && (
                                  <>
                                    {processDataResponse.creditInfo[
                                      "Credit Score"
                                    ]?.[0].Experian ? (
                                      <CircularProgressbar
                                        value={Number(
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].Experian.slice(0, 2) || 0
                                        )}
                                        text={
                                          processDataResponse.creditInfo[
                                            "Credit Score"
                                          ][0].Experian
                                            ? processDataResponse.creditInfo[
                                                "Credit Score"
                                              ][0].Experian
                                            : "0"
                                        }
                                      />
                                    ) : (
                                      <CircularProgressbar
                                        value={"0"}
                                        text={"-"}
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="h-px mt-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <span className="text-center font-bold">
                    {processDataResponse?.creditInfo &&
                    processDataResponse.creditInfo["Lender Rank"]?.[0].Experian
                      ? processDataResponse.creditInfo["Lender Rank"][0]
                          .Experian
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
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Inquiries</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Public Records</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Collections</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr className="text-success">
                            <td className="py-2">
                              <div className="text-left text-green-500">
                                Positive
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-green-500 ">
                                {processDataResponse?.summaryInfo?.[
                                  "Total Accounts"
                                ][0].Experian &&
                                processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Total Accounts"
                                    ][0].Experian -
                                    processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">
                              <div className="text-left text-red-500">
                                Negative
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-right  text-red-500">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Experian
                                  : "0"}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-5 mb-4 text-center text-sm	">
              Maxing out your credit cards will lower your score. If you pay
              balances down to below 30% of your available credit limit of each
              card, that will increase your score.
            </p>
          </div>
          {/*  */}
          <div className="mt-5 mb-5">
            <h1
              className="pt-5 pb-4 font-semibold text-white uppercase text-center"
              style={{ background: "#cb1717" }}
            >
              Derogatory Summary
            </h1>
            <p className="mt-5 mb-4 text-center text-sm	">
              We analyzed all the items on your reports to determine which
              accounts are negatively impacting your score. Here are our
              findings:
            </p>
            <div className="grid grid-cols p-4">
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
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
                              <div className="font-semibold text-left">
                                EQUIFAX
                              </div>
                            </th>
                            <th className="py-2">
                              <div className="font-semibold text-left">
                                TransUnion
                              </div>
                            </th>
                            <th className="py-2">
                              <div className="font-semibold text-left">
                                EXPERIAN
                              </div>
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
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Delinquent"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Delinquent"
                                    ][0].Equifax
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Delinquent"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Delinquent"
                                    ][0].TransUnion
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Delinquent"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Delinquent"
                                    ][0].Experian
                                  : "-"}
                              </div>
                            </td>
                          </tr>
                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Derogatory</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Equifax
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].TransUnion
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Derogatory"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Derogatory"
                                    ][0].Experian
                                  : "-"}
                              </div>
                            </td>
                          </tr>

                          {/* Row */}
                          <tr>
                            <td className="py-2">
                              <div className="text-left">Collections</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].Equifax
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].TransUnion
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Collection"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Collection"
                                    ][0].Experian
                                  : "-"}
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-2">
                              <div className="text-left">Public Records</div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].Equifax
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].TransUnion
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Public Records"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Public Records"
                                    ][0].Experian
                                  : "-"}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">
                              <div className="text-left">
                                Inquiries (2 years)
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].Equifax
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].Equifax
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].TransUnion
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].TransUnion
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="font-medium text-left text-slate-800">
                                {processDataResponse?.summaryInfo?.[
                                  "Inquiries(2 years)"
                                ][0].Experian
                                  ? processDataResponse?.summaryInfo?.[
                                      "Inquiries(2 years)"
                                    ][0].Experian
                                  : "-"}
                              </div>
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
          <div className="mt-5 mb-5">
            <h1
              className="pt-5 pb-4 font-semibold text-white uppercase text-center"
              style={{ background: "#cb1717" }}
            >
              Derogatory Items
            </h1>
            <div className="grid grid-cols p-4">
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
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
                              <h1 className=" text-5xl text-red-600">
                                {totalDelinquentValue}
                              </h1>
                              <div className="font-semibold text-black-500">
                                Delinquent or derogatory items
                              </div>
                            </th>
                            <th className="py-2">
                              <div className="text-slate-400 dark:text-slate-500">
                                Recent late payments, collections, and other
                                derogatory items within the last 6 months will
                                hurt your credit score more than older inactive
                                accounts. Accounts within the last 24 months
                                carry the second most weight. It is crucial to
                                pay all bills on time and never miss payments.
                              </div>
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
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <div className="flex flex-col h-full">
                  <div className="grow px-5 pt-3 pb-1">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        {/* Table header */}
                        <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                          <tr>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                Account Name
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                EQUIFAX
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                TransUnion
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                EXPERIAN
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                Issue
                              </div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                          {processDataResponse?.bankInfo?.results.map(
                            (val, i) => {
                              return (
                                <tr key={i}>
                                  {val.latePaymentSummary !== "" ? (
                                    <>
                                      <td className="py-5 px-5">
                                        <div className="text-left">
                                          {val?.bankName}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.latePaymentCounts?.Equifax && (
                                            <>
                                              {Object.keys(
                                                val?.latePaymentCounts?.Equifax
                                              )?.length > 0 ? (
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
                                            </>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.latePaymentCounts
                                            ?.TransUnion && (
                                            <>
                                              {Object.keys(
                                                val?.latePaymentCounts
                                                  ?.TransUnion
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
                                            </>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.latePaymentCounts?.Experian && (
                                            <>
                                              {Object.keys(
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
                                            </>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="">
                                          {val?.latePaymentSummary}
                                        </div>
                                      </td>
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
          {/*  */}
          <div className="mt-5 mb-5">
            <h1
              className="pt-5 pb-4 font-semibold text-white uppercase text-center"
              style={{ background: "#cb1717" }}
            >
              Public Records
            </h1>
            <div className="grid grid-cols p-4">
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
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
                              <h1 className=" text-5xl text-red-600">
                                {totalPublicRecordValue}
                              </h1>
                              <div className="font-semibold text-black-500">
                                Public Records
                              </div>
                            </th>
                            <th className="py-2">
                              <div className="text-slate-400 dark:text-slate-500">
                                Public records include details of court records,
                                bankruptcy filings, tax liens and monetary
                                judgments. These generally remain on your Credit
                                Report for 7 to 10 years.
                              </div>
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
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <div className="flex flex-col h-full">
                  <div className="grow px-5 pt-3 pb-1">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        {/* Table header */}
                        <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                          <tr>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                Account Name
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                EQUIFAX
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                TransUnion
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                EXPERIAN
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-left">
                                Issue
                              </div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        {processDataResponse?.publicRecordInfo?.map(
                          (val, i) => {
                            return (
                              <tr key={i}>
                                <>
                                  <td className="py-5 px-5">
                                    <div className="text-left">
                                      {val?.bankName}
                                    </div>
                                  </td>
                                  <td className="py-5 px-5">
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
                                  <td className="py-5 px-5">
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
                                  <td className="py-5 px-5">
                                    <div className="text-center">
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
                                  <td className="py-5 px-5">
                                    <div className="">
                                      {/* {Object.keys(val?.TableData?.Type[0]?.TransUnion).length > 0 &&
                                      <>
                                        <div className='text-xs	'>{val?.TableData?.Type[0]?.TransUnion}</div>
                                      </>
                                    } */}
                                      Public Information
                                    </div>
                                    {/* <div className="">
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
                                  </div> */}
                                  </td>
                                </>
                              </tr>
                            );
                          }
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mt-5 mb-5">
            <h1
              className="pt-5 pb-4 font-semibold text-white uppercase text-center"
              style={{ background: "#cb1717" }}
            >
              Inquiries
            </h1>
            <div className="grid grid-cols p-4">
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
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
                              <h1 className=" text-4xl text-red-600">
                                {processDataResponse?.inquiriesInfo?.tabledata
                                  ? Object.keys(
                                      processDataResponse?.inquiriesInfo
                                        ?.tabledata
                                    ).length
                                  : 0}
                              </h1>
                              <div className="font-semibold text-black-500">
                                Inquiry
                              </div>
                            </th>
                            <th className="py-2">
                              <div className="text-slate-400 dark:text-slate-500">
                                Each time you apply for credit it lowers your
                                score. For that reason we ask during credit
                                repair that you do not apply for anything.
                              </div>
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
              <div
                className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700"
                style={{ borderRadius: "20px" }}
              >
                <div className="flex flex-col h-full">
                  <div className="grow px-5 pt-3 pb-1">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        {/* Table header */}
                        <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                          <tr>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-center">
                                Account Name
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-center">
                                EQUIFAX
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-center">
                                TransUnion
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-center">
                                EXPERIAN
                              </div>
                            </th>
                            <th className="py-5 px-5">
                              <div className="font-semibold text-center">
                                Issue
                              </div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                          {processDataResponse?.inquiriesInfo?.tabledata.map(
                            (val, i) => {
                              return (
                                <tr key={i}>
                                  {val.latePaymentSummary !== "" ? (
                                    <>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.["Creditor Name"]}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
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
                                      <td className="py-5 px-5">
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
                                      <td className="py-5 px-5">
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
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          Inquiry
                                        </div>
                                      </td>
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
      </Transition>
    </>
  );
}

export default ModalSearch;
