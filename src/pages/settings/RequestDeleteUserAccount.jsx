import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import { REQUEST_DELETE_DATA } from "../../API/api.js"
import SubscriptionPanel from '../../partials/settings/SubscriptionPanel';
import head_logo from "../../ConsumerlawLogo.png"
import Footer from '../../partials/Footer';
import SubNavbar from '../../components/SubNavbar'
import Cookies from "js-cookie";
import axios from 'axios';
import { toast } from 'react-toastify';


function RequestDeleteUserAccount() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [loaderSignin, setloaderSignin] = useState(false);
  const [isRequestDeleteData, setRequestDeleteData] = useState({
    name: user?.name,
    email: user?.email,
    request_type: "",
    specific_data: "",
    reason: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSpecificData, setIsSpecificData] = useState(false);

  const handleCheckboxChange = () => {
    setIsConfirmed(!isConfirmed);
  };

  const handleRadioboxChange = (val) => {
    if (val === "1") {
      setRequestDeleteData((prevState) => ({
        ...prevState,
        name: user?.name,
        email: user?.email,
        request_type: "Delete my account and all associated data",
        specific_data: "",
      }));
      setIsSpecificData(false);
    } else {
      setRequestDeleteData((prevState) => ({
        ...prevState,
        name: user?.name,
        email: user?.email,
        request_type: "Delete specific data (with a field to specify which data).",
      }));
      setIsSpecificData(true);
    }
  };

  const handleDelete = () => {
    if (isConfirmed) {
      alert('Entry deleted successfully');
      // Place your delete logic here
    } else {
      alert('Please confirm deletion');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestDeleteData({ ...isRequestDeleteData, [name]: value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloaderSignin(true);
    try {
      const response = await axios.post(REQUEST_DELETE_DATA, { isRequestDeleteData, userId: user?._id },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Request Sent Successfully");
      setRequestDeleteData({
        name: user?.name,
        email: user?.email,
        request_type: "",
        specific_data: "",
        reason: "",
      });
      handleCheckboxChange(false);
      setIsSpecificData(false);
      setloaderSignin(false);
    } catch (error) {
      setloaderSignin(false);
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {(user?.role === "agent" || user?.role === "agency_agent") ?
          <SubNavbar />
          :
          ""
        }

        <main className="grow bg-white dark:bg-[#FFFFFF]">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-2xl mx-auto">
            <div className="mb-8">
            </div>
            <div className="bg-white dark:bg-[#EEEFF1] border shadow-lg rounded-xl mb-8">
              <div className="grow">
                <form
                  className="space-y-8 px-4 divide-gray-200 rounded-xl bg-white"
                  onSubmit={handleSubmit}
                >
                  <div className="px-6 pt-6 space-y-6">
                    <h2 className="text-2xl text-center text-slate-800 dark:text-slate-100 font-bold mb-5 ">Request to Delete Personal Data</h2>
                    <hr></hr>
                    <section>
                      <div className="mt-5">
                        <div className="">
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Full Name:</label>
                          <input
                            id="name"
                            name="name"
                            value={isRequestDeleteData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                            disabled
                            className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                        </div>
                        <div className="mt-4">
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Email Address:</label>
                          <input
                            name="email"
                            id="email"
                            value={isRequestDeleteData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            disabled
                            className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                        </div>

                        <div className="mt-4">
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="radio1">Request Type:</label>
                          <input
                            required
                            className="tm-color"
                            type="radio"
                            onClick={() => handleRadioboxChange("1")}
                            name="request_type"
                            id="radio1"
                          /> <span className='ms-2 pt-2'>Delete my account and all associated data.</span>
                        </div>
                        <div className="mt-1">
                          <input
                            required
                            className="tm-color"
                            type="radio"
                            name="request_type"
                            onClick={(e) => handleRadioboxChange("2")}
                            id="radio2"
                          /> <span className='ms-2 pt-2'>Delete specific data (with a field to specify which data).</span>
                          {isSpecificData &&
                            <input
                              name="specific_data"
                              id="specific_data"
                              value={isRequestDeleteData.specific_data}
                              onChange={handleChange}
                              autoComplete="specific_data"
                              required
                              className="mt-4 form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                          }

                        </div>

                        <div className="mt-4">
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Reason for Deletion Request (optional)</label>
                          <textarea
                            name="reason"
                            onChange={handleChange}
                            value={isRequestDeleteData.reason}
                            autoComplete="reason"
                            className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                        </div>


                        <div className="mt-6">
                          <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }}>
                            <input
                              type="checkbox"
                              className="mr-2 tm-color"
                              checked={isConfirmed}
                              onChange={handleCheckboxChange}
                            />
                            I understand that by requesting the deletion of my data, I will no longer have access to the service, and this action cannot be undone.
                          </label>
                        </div>

                      </div>
                    </section>
                  </div>
                  {/* Panel footer */}
                  <footer>
                    <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex self-end">
                        {loaderSignin
                          ?
                          <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none" disabled>
                            <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                              <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                            </svg>
                            <span className="ml-2">Request Delete</span>
                          </button>
                          :
                          <button
                            type='submit'
                            className={`btn  text-white ml-3 ${isConfirmed ? 'tm-background' : 'bg-gray-400 cursor-not-allowed'
                              }`}
                            disabled={!isConfirmed}
                          >
                            Request Delete
                          </button>
                        }

                        {/* <Link to="/updated-card-details" className="btn tm-background text-white ml-3">Update Card Details</Link> */}
                      </div>
                    </div>
                  </footer>
                </form>
              </div>
            </div>

          </div>
        </main>
        {/* <Footer></Footer> */}
      </div>

    </div>
  );
}

export default RequestDeleteUserAccount;