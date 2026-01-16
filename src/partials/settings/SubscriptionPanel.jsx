import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { GET_USER_DETAILS, GET_USER_BILLING_DETAILS, UPDATE_USER_DETAILS, ADD_BILLING_DETAILS, GET_ALL_TRANSACTIONS } from "../../API/api.js"
import Cookies from "js-cookie";
import moment from 'moment';

import Image from '../../images/user-avatar-80.png';

function AccountPanel(userData) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [loaderSignin, setloaderSignin] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    company_name: ""
  });

  const [allUsers, setAllUsers] = useState("");
  const [showloader, setShowloader] = useState(true)
  const [recordPerPage, setRecordPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriptionDetails({ ...subscriptionDetails, [name]: value });

  };
  const getUserBillingDetails = async () => {
    let URL = GET_USER_BILLING_DETAILS(user._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      if (response?.data?.UserBillingDetails != null) {
        setSubscriptionDetails({
          address: response.data.UserBillingDetails.address,
          city: response.data.UserBillingDetails.city,
          state: response.data.UserBillingDetails.state,
          zip: response.data.UserBillingDetails.zip,
          company_name: response.data.UserBillingDetails.company_name,

        });
      }
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserBillingDetails();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();
    const subscriptionDetailsWithID = {
      ...subscriptionDetails,
      user_id: user._id
    };
    await axios
      .post(UPDATE_USER_DETAILS, subscriptionDetailsWithID,
        {
          headers: { "Authorization": "Bearer " + token }
        })
      .then((res) => {
        if (res) {
          // getUserBillingDetails()
          window.location.reload();
          toast.success("User updated successfully!");
        }
      })
      .catch((error) => {
        // toast.error(error);
        toast.error(error.response.data);
      });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setloaderSignin(true);
    try {
      const response = await axios.post(ADD_BILLING_DETAILS, { subscriptionDetails, userId: user?._id },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Billing Details added successfully");
      setSubscriptionDetails({
        address: response?.data?.address,
        city: response?.data?.city,
        state: response?.data?.state,
        zip: response?.data?.zip,
        company_name: response?.data?.company_name,

      });
      getUserBillingDetails();
      setloaderSignin(false);
    } catch (error) {
      setloaderSignin(false);
      console.error('Error submitting data:', error);
    }
  };


  const getTransactions = async (pageno) => {

    if (pageno > totalPage || pageno < 1) {
      return
    }
    try {
      let payload = { user_id: user?._id, pageSize: recordPerPage, page: pageno }
      const response = await axios.post(GET_ALL_TRANSACTIONS, payload)
      setAllUsers(response.data.result);
      setCurrentPage(response.data.currentPage);
      setTotalPage(response.data.total_page);
      setShowloader(false);
    } catch (error) {
      setAllUsers([]);
      setCurrentPage(1);
      setTotalPage(1);
      setShowloader(false);
      if (error?.response?.data?.msg == "Page not found") {
        return
      }
      toast.error(
        error.response.data.msg || "Something went wrong, try again!", { position: "top-center", }
      );
    }
  }

  useEffect(() => {
    getTransactions(1)
  }, [])



  return (

    <>
      <div className="grow">
        {/* Panel body */}
        <form
          className="space-y-8 divide-gray-200 rounded-xl bg-white"
          onSubmit={handleSubmit}
        >
          <div className="px-0 lg:px-4 md:px-4 sm:px-0">
            <div className="p-6 space-y-6">
              <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">Billing Details</h2>
              {/* Picture */}

              <section>
                {/* <div className="flex items-center">
            <div className="mr-4">
              <img className="w-20 h-20 rounded-full" src={Image} width="80" height="80" alt="User upload" />
            </div>
            <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Change</button>
          </div> */}
              </section>
              {/* Business Profile */}
              <section>
                <div className="mt-5">
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-1/3">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          id="address"
                          name="address"
                          value={subscriptionDetails.address}
                          onChange={handleChange}
                          autoComplete="address"
                          required
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="city"
                          id="city"

                          value={subscriptionDetails.city}
                          onChange={handleChange}
                          autoComplete="city"
                          required
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select
                          name="state"
                          value={subscriptionDetails.state}
                          onChange={handleChange}
                          autoComplete="state"
                          required
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

                    <div className="sm:w-1/3">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="zip"
                          value={subscriptionDetails.zip}
                          onChange={handleChange}
                          autoComplete="zip"
                          required
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} />
                      </div>
                    </div>

                    <div className="sm:w-1/3">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Company Name (Optional)</label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input
                          name="company_name"
                          value={subscriptionDetails.company_name}
                          onChange={handleChange}
                          autoComplete="company_name"
                          className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            </div>
            {/* Panel footer */}
            <footer>
              <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                <div className="flex self-end">
                  {subscriptionDetails?.address || subscriptionDetails?.city ?
                    <>
                      {loaderSignin
                        ?
                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                          <span className="ml-2">Update Subscription Details</span>
                        </button>
                        :
                        <button type="submit" className="btn tm-background text-white ml-3">Update Billing Details</button>
                      }
                    </>
                    :
                    <button type="submit" className="btn tm-background text-white ml-3">Add Billing Details</button>
                  }
                  {/* <Link to="/updated-card-details" className="btn tm-background text-white ml-3">Update Card Details</Link> */}
                </div>
              </div>
            </footer>
          </div>
        </form>

        <div className='shownav'>

          <div className="px-10 py-5">
            <div className="bg-white dark:bg-slate-800  rounded-sm border border-slate-200 dark:border-slate-700 relative  rounded-tr-2xl rounded-tl-2xl">
              <header className="px-5 py-3 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl ">
                {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST <span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2> */}
                <h1 className="font-bold text-slate-100 text-xl dark:text-slate-100">Transaction History</h1>
              </header>
              <div className="mt-8 px-5 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden md:rounded-xl">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-sm text-slate-400 dark:text-slate-500 bg-gray-100 ">
                          <tr>
                            {/* <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        S.NO.
                                                    </th> */}
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 rounded-bl-xl">
                              Transaction ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Date
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Amount
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 rounded-br-xl">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {allUsers?.length > 0 && allUsers?.map((val, i) => {
                            return (
                              <tr key={i}>
                                {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{i + 1}</td> */}
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.transaction_id ? val.transaction_id : "-"}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.created_at ? moment(val.created_at).format('YYYY-MM-DD HH:mm:ss') : "-"}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.amount ? `$${val.amount}` : "-"}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.status ? val.status : "-"}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userData?.userData?.current_plan_sorting
                                  ? `Payment for ${userData?.userData?.current_plan_sorting}`
                                  : userData?.userData?.is_trial === "true"
                                    ? " "
                                    : ""}</td>
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

        <div className='hidenav'>
          <div className="px-4 py-5">
            <div className="bg-white dark:bg-slate-800  rounded-sm border border-slate-200 dark:border-slate-700 relative  rounded-tr-2xl rounded-tl-2xl">
              <header className="px-5 py-3 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl ">
                {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST <span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2> */}
                <h1 className="font-bold text-slate-100 text-xl dark:text-slate-100">List</h1>
              </header>
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {allUsers?.length > 0 && allUsers?.map((val, i) => {
                            return (
                              <div key={i}>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.transaction_id ? val.transaction_id : "-"}</td>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.created_at ? moment(val.created_at).format('YYYY-MM-DD HH:mm:ss') : "-"}</td>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.amount ? `$${val.amount}` : "-"}</td>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val.status ? val.status : "-"}</td>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userData?.current_plan_sorting
                                    ? userData.current_plan_sorting
                                    : userData?.is_trial === "true"
                                      ? "Free Trial"
                                      : ""}</td>
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

        {allUsers.length > 0 &&
          <div className='px-6 py-5'>
            {totalPage == 1 &&
              <div className='flex justify-end gap-3 mt-12'>
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage - 1)}>&laquo;</p>
                <p id={currentPage == 1 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(1)}>1</p>
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage + 1)}>&raquo;</p>
              </div>
            }


            {totalPage == 2 &&
              <div className='flex justify-end gap-3 mb-5'>
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage - 1)}>&laquo;</p>
                <p id={currentPage == 1 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(1)}>1</p>
                <p id={currentPage == 2 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(2)}>2</p>
                <p id='paginate_subs_id' onClick={() => getTransactions(currentPage + 1)} className="">&raquo;</p>
              </div>
            }


            {totalPage == 3 &&
              <div className='flex justify-end gap-3 mb-5'>
                <p id='paginate_subs_id' onClick={() => getTransactions(currentPage - 1)}>&laquo;</p>
                <p id={currentPage == 1 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(1)}>1</p>
                <p id={currentPage == 2 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(2)}>2</p>
                <p id={currentPage == 3 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(3)}>3</p>
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage + 1)}>&raquo;</p>
              </div>
            }


            {totalPage > 3 &&
              <div className='flex justify-end gap-3 mb-5'>
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage - 1)}>&laquo;</p>
                <p id={currentPage == 1 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(1)}>1</p>
                <p id={currentPage == 2 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(2)}>2</p>
                {currentPage == 3 &&
                  <p id={currentPage == 3 ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(3)}>3</p>
                }
                <p id='paginate_subs_id_notselected'>...</p>
                {currentPage > 3 &&
                  <p id={"paginate_subs_id"} className="" onClick={() => getTransactions(currentPage)}>{currentPage}</p>
                }
                {currentPage != totalPage &&
                  <p id={currentPage == totalPage ? "paginate_subs_id" : "paginate_subs_id_notselected"} className="" onClick={() => getTransactions(totalPage)}>{totalPage}</p>
                }
                <p id='paginate_subs_id' className="" onClick={() => getTransactions(currentPage + 1)}>&raquo;</p>
              </div>
            }
          </div>
        }
      </div>

    </>

  );
}

export default AccountPanel;