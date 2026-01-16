import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GET_USER_DETAILS, UPDATE_USER_DETAILS, ADD_TO_ADDRESS_DATA, GET_TO_ADDRESS_DATA, UPDATE_AI_GENERATE_RESPONSE, UPDATE_TO_ADDRESS_DETAILS, CREATE_USERS_ACTIVITY } from "../API/api.js"
import { Link, useParams, useNavigate } from "react-router-dom";


import Cookies from "js-cookie";
function LetterAddressData({
  userInquiryDataResponse,
  modalOpen,
  closeModal,
  updateReponse,
  updateButton,
  isShowLetter,
  backStep,
  responseText,
  isLetterBankName,
  generatePDF,
  setModalOpen,
  getDisputeData,
  toAddressDetails,
  getToAddressData,
  handleToAddressChange,
  getLettersList,
  isShowStep,
  ChangeDisputeStep,
  setSelectedItems,
  selectedItems
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [sync, setSync] = useState(false);
  const [userData, setUserData] = useState(false);
  const [userdetails, setUserdetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });


  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
    cpassword: "",
  });

  const [selectedState, setSelectedState] = useState('');
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // const [toAddressDetails, setToAddressDetails] = useState({
  //   to_address: "",
  //   to_city: "",
  //   to_state: selectedState,
  //   to_zip: "",
  //   to_phone: "",
  //   to_country: "US",
  // });
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];

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
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  }

  const handleInputs = (e) => {
    let value;
    value = e.target.value;

    setUserPassword({ ...userPassword, [e.target.name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdetails({ ...userdetails, [name]: value });

  };

  // const handleToAddressChange = (e) => {
  //   const { name, value } = e.target;
  //   setToAddressDetails((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };
  const getUserData = async () => {
    let URL = GET_USER_DETAILS(id || user?._id);
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
      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  // const getToAddressData = async (generator_id) => {
  //   let URL = GET_TO_ADDRESS_DATA(generator_id);
  //   try {
  //     const response = await axios.get(URL,
  //       {
  //         headers: { "Authorization": "Bearer " + token }
  //       });
  //     setToAddressDetails({
  //       to_id: response.data.ToAddressData._id,
  //       to_letter_id: response.data.ToAddressData.generator_id,
  //       to_address: response.data.ToAddressData.address,
  //       to_city: response.data.ToAddressData.city,
  //       to_state: response.data.ToAddressData.state,
  //       to_zip: response.data.ToAddressData.zip,
  //       to_phone: response.data.ToAddressData.phone,
  //       to_country: response.data.ToAddressData.country,

  //     });
  //   } catch (error) {
  //     toast.error("Something went Wrong");
  //   }
  // };

  const addToAddressData = async (data) => {
    try {
      const response = await axios.post(ADD_TO_ADDRESS_DATA, { toAddressDetails, generateID: data?._id, letterID: data?.dispute_id, }, { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const updateAiGenrateResponse = async () => {
    let disputeType = "";
    let disputeItem = "";
    let responseResponse = ""

    if (userInquiryDataResponse?.data?.type === "inquiry") {
      disputeType = "Inquiry";
      disputeItem = userInquiryDataResponse?.data?.inquiry['Creditor Name']
    }
    else if (userInquiryDataResponse?.data?.type === "derogatory") {
      disputeType = "Derogatory";
      disputeItem = userInquiryDataResponse?.data?.derogatory['bankName'];
    }
    else if (userInquiryDataResponse?.data?.type === "public") {
      disputeType = "Public";
      disputeItem = userInquiryDataResponse?.data?.public?.bankName
      responseResponse = "publicResponseBank"
    }
    // let disputeType = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? userInquiryDataResponse?.data?.inquiry['Creditor Name'] : userInquiryDataResponse?.data?.derogatory['bankName'];
    let letterType = "AI";

    try {
      const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { responseResponse, isLetterBankName, userInquiryDataResponse, responseText }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.newgenerateResponse) {
        await addToAddressData(response?.data?.newgenerateResponse);
      }
      setModalOpen(false);
      getLettersList();
      userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
    } catch (error) {
      toast.error(error.response || "Something went Wrong");
      setModalOpen(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);


  useEffect(() => {
    if (updateButton === "update_button") {
      if (responseText._id) {
        getToAddressData(responseText._id)
      }
    }
  }, [responseText]);

  const updateUser = async () => {
    const userDetailsWithID = {
      ...userdetails,
      user_id: id || user?._id
    };
    await axios
      .post(UPDATE_USER_DETAILS, userDetailsWithID,
        {
          headers: { "Authorization": "Bearer " + token }
        })
      .then((res) => {
        if (res) {
          return ({ success: true });
        }
      })
      .catch((error) => {
        // toast.error(error);
        toast.error(error.response.data);
      });
  };

  const updateProfileAndDispute = async () => {
    if (updateButton === "print_letter") {
      updateReponse('print_letter')

    } else if (updateButton === "update_button") {
      updateAiGenrateResponse()
      updateUser();
      updateToAddressData();
      updateReponse('update_letter')

    } else {
      updateUser();
      // updateToAddressData();
      // generatePDF();
      updateAiGenrateResponse()
    }
    // navigate(`/send-letter/${id}`);
    toast.success("Details Updated Successfully");
  };



  const updateToAddressData = async () => {
    await axios
      .post(UPDATE_TO_ADDRESS_DETAILS, toAddressDetails,
        {
          headers: { "Authorization": "Bearer " + token }
        })
      .then((res) => {
        if (res) {
          console.log("Send To Address Updated Successfully!");
        }
      })
      .catch((error) => {
        // toast.error(error);
        toast.error(error.response.data);
      });
  };

  return (
    <>
      <div className="">

        <div className="grid w-full gap-6 md:grid-cols-2 mt-4 mb-5">
          <div>
            {/* <form
              className=""
              onSubmit={updateUser}
            > */}
            <section className='hidden'>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-1/3">
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                  <input
                    id="name" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                    name="name"
                    value={userdetails.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                <div className="sm:w-1/3">
                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={userdetails.email}
                    onChange={handleChange}
                    type="email"
                    autoComplete="email"
                    className="form-input rounded-2xl border-none bg-gray-200 w-full" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send From Address:</h2>
              <div className="mt-5">
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        id="address"
                        name="address"
                        value={userdetails.address}
                        onChange={handleChange}
                        autoComplete="address"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                    </div>
                  </div>
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        name="city"
                        id="city"

                        value={userdetails.city}
                        onChange={handleChange}
                        autoComplete="city"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select
                        name="state"
                        value={userdetails.state}
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
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        name="zip"
                        value={userdetails.zip}
                        onChange={handleChange}
                        autoComplete="zip"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input name="phone"
                        value={userdetails.phone}
                        onChange={handleChange}
                        autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                    </div>
                  </div>
                </div>
                <div className='mt-5 text-center'>
                  {/* <button onClick={updateUser} className="py-2 px-5 rounded-3xl tm-background text-white">Update From Address</button> */}
                </div>
              </div>
            </section>
            {/* </form> */}
          </div>
          <div>
            {/* <form
              className=""
              onSubmit={updateToAddressData}
            > */}
            <section>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
              <div className="mt-5">
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address<span className='text-red-500'>*</span></label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        id="to_address"
                        name="to_address"
                        value={toAddressDetails.to_address || ""}
                        onChange={handleToAddressChange}
                        autoComplete="address"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        type="text"
                      />
                    </div>
                  </div>
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City<span className='text-red-500'>*</span></label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        name="to_city"
                        id="to_city"

                        value={toAddressDetails.to_city}
                        onChange={handleToAddressChange}
                        autoComplete="city"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State<span className='text-red-500'>*</span></label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select
                        name="to_state"
                        value={toAddressDetails.to_state}
                        onChange={handleToAddressChange}
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
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip<span className='text-red-500'>*</span></label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input
                        name="to_zip"
                        value={toAddressDetails.to_zip}
                        onChange={handleToAddressChange}
                        autoComplete="zip"
                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input name="to_phone"
                        value={toAddressDetails.to_phone}
                        onChange={handleToAddressChange}
                        autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                    </div>
                  </div>
                  <div >
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Country</label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input name="to_country"
                        value="US"
                        onChange={handleToAddressChange}
                        autoComplete="country" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 text-center'>
                  {/* <button onClick={updateToAddressData} className="py-2 px-5 rounded-3xl tm-background text-white">Update To Address</button> */}
                </div>
              </div>
            </section>
            {/* </form> */}
          </div>
        </div>
        <hr></hr>
        <div className='text-end mt-5'>
          {isShowLetter &&
            <button onClick={backStep} className="py-2 px-5 rounded-3xl tm-background text-white me-2">Back</button>
          }

          {updateButton === "print_letter" &&

            <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>

          }
          {/* {updateButton != "print_letter" && updateButton != "update_letter" &&
          <>
            <button onClick={generatePDF} className="me-2 py-2 px-5 rounded-3xl tm-background text-white rounded">Download Dispute letter</button>
          </>
        } */}
          {modalOpen ?
            <button onClick={closeModal} className="py-2 px-5 rounded-3xl tm-background text-white me-2">Close</button>
            :
            <button onClick={() => ChangeDisputeStep(0)} className="py-2 px-5 rounded-3xl tm-background text-white me-2">BACK</button>

          }
          <button onClick={updateProfileAndDispute} className="py-2 px-5 rounded-3xl tm-background text-white  me-2">NEXT</button>

        </div>


      </div >
    </>
  );
}


export default LetterAddressData;
