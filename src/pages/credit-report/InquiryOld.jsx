import React, { useState, useEffect } from 'react';

import Header from '../../partials/Header';
import { Link } from 'react-router-dom';
import Loder from '../../partials/Loder';
import { useParams } from "react-router-dom";
import { GET_AWS_DATA, DISPUTE_TO_INQUIRY, CREATE_USERS_ACTIVITY } from "../../API/api"
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ModalBlank from '../../components/ModalBlank';
import DashboardSidebar from '../../partials/DashboardSidebar';


function Invoices() {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id, disputeid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [awsData, setAwsData] = useState();
  const [isDisputeInquiry, setIsDisputeInquiry] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false)

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
s    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  }

  const selectRecord = (isChecked, data, i, type, valID) => {
    if (isChecked) {
      if (type === "inquiry") {
        let aws_data = awsData;
        let inq = aws_data?.process_data_object?.inquiriesInfo?.tabledata;
        inq[i].seleted = true;
        aws_data.process_data_object.inquiriesInfo.tabledata = inq;
        setAwsData(aws_data);
      }
      else if (type === "derogatory") {
        awsData?.process_data_object?.bankInfo?.results
        let aws_data = awsData;
        let inq = aws_data?.process_data_object?.bankInfo?.results;
        inq[i].seleted = true;
        aws_data.process_data_object.bankInfo.results = inq;
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
        prevSelected.filter(prevRecord => prevRecord.data !== data)
      );
    }
  }

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

  const equifaxValue = parseInt(awsData?.process_data_object?.summaryInfo?.['Delinquent'][0].Equifax) || 0;
  const transUnionValue = parseInt(awsData?.process_data_object?.summaryInfo?.['Delinquent'][0].TransUnion) || 0;
  const experianValue = parseInt(awsData?.process_data_object?.summaryInfo?.['Delinquent'][0].Experian) || 0;
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
          type: record.type
        }

        // console.log(requestData?.type, 'type');
        // return
        const response = await axios.post(DISPUTE_TO_INQUIRY, requestData, { headers: { "Authorization": "Bearer " + token } });
        getAwsData();
        setSuccessModalOpen(true);
        let disputeType = requestData?.type && requestData?.type === "inquiry" ? "Inquiry" : "Derogatory";
        let disputeItem = requestData?.type && requestData?.type === "inquiry" ? requestData?.data['Creditor Name'] : requestData?.data['bankName'];
        if (response.data.message) {
          userActivity("Dispute", "", "", "success", `Dispute ${disputeType}-${disputeItem}`);
        } else {
          userActivity("Dispute", "", "", "failed", `Dispute ${disputeType}-${disputeItem}, Failed!`);
        }
      } catch (error) {
        let requestData = {
          data: record.data,
          type: record.type
        }
        toast.error(error.response.data.message || "Something went Wrong");
        let disputeType = requestData?.type && requestData?.type === "inquiry" ? "Inquiry" : "Derogatory";
        let disputeItem = requestData?.type && requestData?.type === "inquiry" ? requestData?.data['Creditor Name'] : requestData?.data['bankName'];
        userActivity("Dispute", "", "", "failed", `Dispute ${disputeType}-${disputeItem}, Failed`);
      }
    }
    setSelectedRecords([]);
  }

  const processSingleRecord = async (data, i, type, valID) => {
    const dis = data;
    if (type === "inquiry") {
      let aws_data = awsData;
      let inq = aws_data?.process_data_object?.inquiriesInfo?.tabledata;
      inq[i].seleted = true;
      aws_data.process_data_object.inquiriesInfo.tabledata = inq;
      setAwsData(aws_data);
    }
    else if (type === "derogatory") {
      awsData?.process_data_object?.bankInfo?.results
      let aws_data = awsData;
      let inq = aws_data?.process_data_object?.bankInfo?.results;
      inq[i].seleted = true;
      aws_data.process_data_object.bankInfo.results = inq;
      setAwsData(aws_data);
    }
    let disputeType = type && type === "inquiry" ? "Inquiry" : "Derogatory";
    let disputeItem = type && type === "inquiry" ? data['Creditor Name'] : data['bankName'];
    try {
      let requestData = {
        user_id: id,
        aws_id: disputeid,
        data: dis,
        type: type
      }
      const response = await axios.post(DISPUTE_TO_INQUIRY, requestData, { headers: { "Authorization": "Bearer " + token } });
      getAwsData();
      setSuccessModalOpen(true);
      if (response.data.message) {
        userActivity("Dispute", "", "", "success", `Dispute ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Dispute", "", "", "failed", `Dispute ${disputeType}-${disputeItem}, Failed!`);
      }

    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      userActivity("Dispute", "", "", "failed", `Dispute ${disputeType}-${disputeItem}, Failed!`);
    }
    setSelectedRecords([]);
  }

  const getAwsData = async () => {
    try {
      let URL = GET_AWS_DATA(disputeid);
      const response = await axios.get(URL, { headers: { "Authorization": "Bearer " + token } });
      setAwsData(response.data);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getAwsData();
  }, []);

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex h-[100dvh] overflow-hidden">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden mb-14">
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Report  </h1>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className='mt-5 mb-10'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center mx-2" style={{ background: "#cb1717", borderRadius: "20px" }}>Inquiries</h1>
                <div className="grid grid-cols px-4 mt-2">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">
                      <div className="grow px-5 pt-3 pb-4">
                        <div className="">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs uppercase ">
                              <tr>
                                <th className="py-2 px-5">
                                  <h1 className=" text-4xl text-red-600">{awsData?.process_data_object?.inquiriesInfo?.tabledata ? Object.keys(awsData?.process_data_object?.inquiriesInfo?.tabledata).length : 0}
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
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col col-span-full px-4  mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                  <div className="flex flex-col h-full">
                    <div className="grow px-5 pt-3 pb-1">
                      <div className="overflow-x-auto">
                        <div className='...'>
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
                                <th className="py-5 px-5">
                                  {/* <div className="font-semibold text-center">Issue</div> */}
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {awsData?.process_data_object?.inquiriesInfo?.tabledata.map((val, i) => {
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
                                        {user.role != "client" &&
                                          <td className="py-5 px-5 text-center">
                                            {val?.status ?
                                              <p className='uppercase text-green-600'>{val?.status == 'disputed' ? 'In Dispute' : val?.status}</p>
                                              :
                                              <>
                                                {isDisputeInquiry == i ?
                                                  <button className='btn tm-background text-white'> <Loder /></button>
                                                  :
                                                  <>
                                                    {/* {val?.seleted ?
                                                    <button className='btn bg-green-800 text-white' disabled>Selected</button>
                                                    :
                                                    <button className='btn tm-background text-white' onClick={() => selectRecord(val, i, 'inquiry', val?.info_id)}>Select</button>
                                                  } */}
                                                    <input
                                                      type="checkbox"
                                                      className="form-checkbox mr-3"
                                                      onClick={(e) => selectRecord(e.target.checked, val, i, 'inquiry', val?.info_id)}
                                                    />
                                                    <button className='btn-sm tm-background text-white mt-4 text-center mb-3' onClick={() => processSingleRecord(val, i, 'inquiry', val?.info_id)}>DISPUTE</button>
                                                  </>
                                                }
                                              </>
                                            }
                                          </td>
                                        }
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
                {/* <div className="grid grid-cols px-4  mt-2">
              </div> */}
              </div>
              <div className='mt-5 mb-5'>
                <h1 className="pt-5 pb-4 font-semibold text-white uppercase text-center mx-2" style={{ background: "#cb1717", borderRadius: "20px" }}>Derogatory Items</h1>
                <div className="grid grid-cols  px-4  mt-2">
                  <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                    <div className="flex flex-col h-full">

                      <div className="grow px-5 pt-3 pb-4">
                        <div className="">
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs uppercase ">
                              <tr>

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
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col col-span-full mt-2 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                  <div className="flex flex-col h-full">
                    <div className="grow px-5 pt-3 pb-1">
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">
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
                              <th className="py-5 px-5">
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                            {awsData?.process_data_object?.bankInfo?.results.map((val, i) => {
                              return (
                                <tr key={i}>
                                  {val?.latePaymentSummary !== "" ?
                                    <>
                                      <td className="py-5 px-5">
                                        <div className="text-left">{val?.bankName}</div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.latePaymentCounts?.Equifax && Object.keys(val?.latePaymentCounts?.Equifax).length > 0 ?
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
                                          {val?.latePaymentCounts?.TransUnion && Object.keys(val?.latePaymentCounts?.TransUnion).length > 0 ?
                                            <>
                                              <div className='text-lg	font-extrabold text-red-700'>X</div>
                                              <div className='text-xs	'>Negative</div>
                                            </>
                                            : "-"}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5">
                                        <div className="text-center">
                                          {val?.latePaymentCounts?.Experian && Object.keys(val?.latePaymentCounts?.Experian).length > 0 ?
                                            <>
                                              <div className='text-lg	font-extrabold text-red-700'>X</div>
                                              <div className='text-xs	'>Negative</div>
                                            </>
                                            : "-"}
                                        </div>
                                      </td>
                                      <td className="py-5 px-5" style={{ width: "40%" }}>
                                        <div className="whitespace-nowrap sm:whitespace-normal">{val?.latePaymentSummary}</div>
                                      </td>
                                      {user.role != "client" &&
                                        <td className="py-5 px-5 text-center">
                                          {val?.status ?
                                            <p className='capitalize text-green-600'>{val?.status == 'disputed' ? 'In Dispute' : val?.status}</p>
                                            :
                                            <>
                                              {isDisputeInquiry == i ?
                                                <button className='btn tm-background text-white'> <Loder /></button>
                                                :
                                                <>
                                                  {/* {val?.seleted ?
                                                  <button className='btn bg-green-800 text-white' disabled>Selected</button>
                                                  :
                                                  <button className='btn tm-background text-white' onClick={() => selectRecord(val, i, 'inquiry', val?.info_id)}>Select</button>
                                                } */}
                                                  <input
                                                    type="checkbox"
                                                    className="form-checkbox mr-3"
                                                    onClick={(e) => selectRecord(e.target.checked, val, i, 'derogatory')}
                                                  />
                                                  <button className='btn-sm tm-background text-white mt-4 text-center mb-3' onClick={() => processSingleRecord(val, i, 'derogatory')}>DISPUTE</button>
                                                </>
                                              }
                                            </>
                                          }
                                        </td>
                                      }
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
                {/* <div className="grid grid-cols  px-4  mt-2">
              </div> */}


                {/* <div className="grid grid-cols px-4  mt-2">
                <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700" style={{ borderRadius: "20px" }}>
                  <div className="flex flex-col h-full">
                  <div className='text-center'>
                          <button className='btn tm-background text-white mt-4 text-center mb-3' onClick={processSelectedRecords}>Dispute All Seleted</button>
                        </div>
                  </div>
                  </div>
              </div> */}

              </div>

            </div>
            {user.role != "client" &&
          <div class="bottom-0 fixed w-full z-10">
            <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col h-full">
                <div className='text-center'>
                  <button className='btn tm-background text-white mt-4 text-center mb-3' onClick={processSelectedRecords}>DISPUTE ALL SELECTED</button>
                </div>
              </div>
            </div>
          </div>
        }
          </main>
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
            <div className="pt-5 mt-5 mb-5 pb-5 ps-2 pe-2 flex">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full">

              </div>
              {/* Content */}
              <div>
                {/* Modal header */}
                <div className="mb-2 text-center">
                  <div className='mb-4' style={{ textAlign: "-webkit-center" }}>
                    <svg className="w-15 h-12 shrink-0 fill-current text-emerald-500" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Item Selected for Dispute:</div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-10">
                  <div className="space-y-2">
                    <p>Start Your Dispute Process with ConsumerLawDispute.AI </p>
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-center space-x-2">
                  <Link
                    className="btn tm-background text-white"
                    to={`/dispute/${id}`}

                  >
                    Generate Letter
                  </Link>
                  <button className="btn tm-background text-white" onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(false); }}>Select More To Dispute</button>
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