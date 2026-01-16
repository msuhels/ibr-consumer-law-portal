import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PayBg from '../../images/credit-page.png';
import User from "../../images/user-64-13.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import react-toastify for showing notifications
import { GET_SUBSCRIPTION_DETAILS, CANCLE_USER_SUBSCRIPTION, UPDATE_CREDIT_CARD_DETAILS, GET_USER_DETAILS, UPDATE_USER_SUBSCRIPTION } from "../../API/api"
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { ProductionType } from "../../Config";
import VisaImg from '../../images/pay-img.png';

function UpdateCardDetails({ BackendUrl }) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const [card, setCard] = useState(true);
  const { state } = useLocation();
  const [form, setForm] = useState({
    card_no: "",
    expiration: "",
    cvc: "",
  });
  const [loaderSignin, setloaderSignin] = useState(false);
  // if (!state || !state.price || !state.type) {
  //   // Handle the case where state or price is not available
  //   return <div>Loading...</div>;
  // }

  const [cardNumber, setCardNumber] = useState('');

  const handleCardNumberChange = (event) => {
    const { value } = event.target;

    const formattedValue = value.replace(/\D/g, '');

    const formattedCardNumber = formattedValue.replace(/(\d{4})/g, '$1 ').trim();

    setForm({
      card_no: formattedCardNumber
    });
  };

  useEffect(() => {
    getUserData();
  }, []);


  const getUserData = async () => {
    let URL = GET_USER_DETAILS(user?._id);
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went Wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevdata) => {
      return {
        ...prevdata,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ProductionType === "LIVE") {
      if (form.card_no.trim() === '4242 4242 4242 4242') {
        toast.error('Credit Card Number is invalid.');
        return;
      }
    }

    if (form.card_no.trim() === '' || form.expiration.trim() === '' || form.cvc.trim() === '') {
      toast.error('All fields are required.');
      return;
    }


    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(form.expiration)) {
      toast.error('Please Provide A Valid Expiration date (MM/YY)');
      return; // Prevent submission if expiration date format is incorrect
    }


    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear() % 100;

    // Extract month and year from the expiration date
    const [expMonth, expYear] = form.expiration.split('/').map(Number);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      toast.error('Please provide a valid expiration date.');
      return;
    }
    setloaderSignin(true);
    try {
      const res = await axios.post(UPDATE_CREDIT_CARD_DETAILS,
        { form, authorizeNet_customerPaymentProfileId: userData?.authorizeNet_customerPaymentProfileId, authorizeNet_customerProfileId: userData?.authorizeNet_customerProfileId  ,userId:user?._id},
        {
          headers: { "Authorization": "Bearer " + token }
        });
      toast.success(res.data.message || 'Payment Successful');
      setloaderSignin(false);
      setForm({
        card_no: "",
        expiration: "",
        cvc: "",
      });
    } catch (error) {
      setloaderSignin(false);
      toast.error(error?.response?.data?.message);
    }
  };

  function formatExpiryDate(input) {
    // Add "/" after entering MM
    if (input.value.length === 2 && !input.value.includes("/")) {
      input.value += "/";
    }
  }

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];


  return (
    <>
      <Header></Header>
      <main className="grow bg-white">
        <div className="relative pt-10	pb-10	">
          <div className="absolute inset-0 bg-slate-800 overflow-hidden bg-white" aria-hidden="true">
            {/* <img className="object-cover h-full w-full filter " src={PayBg} width="460" height="80" alt="Pay background" /> */}
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
            <div className="about- pt-5 pb-5 text-center">
              <div className="container-fluid col-6">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="">
                      <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Update Card Details</h1>
                      <p
                        className="mt-3 mb-4"
                      >
                        {/* Upgrade your plan today to unlock more features to help you navigate your credit journey. Save 20% when you upgrade for a yearly plan. */}
                        During the process of updating card details, a nominal fee of $1 will be deducted for the purpose of verifying the credit card information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-16 pb-16 max-w-lg mx-auto ">
          <div className="bg-white dark:bg-slate-800 px-8 pb-6 pt-6 rounded-3xl shadow-lg border ">
            {card && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="card-nr"
                    >
                      Card Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="card-nr"
                      value={form.card_no}
                      name="card_no"
                      onChange={handleCardNumberChange}
                      className="form-input w-full rounded-xl"
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      minLength="19" // Adjusted for the extra spaces
                      maxLength="19" // Adjusted for the extra spaces
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-expiry"
                      >
                        Expiry Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="card-expiry"
                        name="expiration"
                        value={form.expiration}
                        onChange={handleChange}
                        className="form-input w-full rounded-xl"
                        type="text"
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                        maxLength="5"
                        onInput={(e) => formatExpiryDate(e.target)}
                        placeholder="MM/YY"
                        required="true"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-cvc"
                      >
                        CVC <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="card-cvc"
                        name="cvc"
                        value={form.cvc}
                        onChange={handleChange}
                        maxLength="3"
                        className="form-input w-full rounded-xl"
                        type="text"
                        placeholder="CVC"
                        required
                      />
                    </div>
                  </div>

                  <hr></hr>

                </div>
                <div className="mt-6">
                  <div className="mb-4">
                    {loaderSignin ? (
                      <button
                        className="py-2 rounded-3xl w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                        disabled
                      >
                        <svg
                          className="animate-spin w-4 h-4 fill-current shrink-0"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                        <span className="ml-2 text-center">
                          Processing Payment
                        </span>
                      </button>
                    ) : (
                      <>
                        {userData?.authorizeNet_customerPaymentProfileId && userData?.authorizeNet_customerProfileId &&
                          <button
                            className="py-2 rounded-3xl w-full btnn-background text-white"
                            onClick={(e) => handleSubmit(e)}
                          >
                            Update Card Details
                          </button>
                        }
                      </>
                    )}
                  </div>
                </div>
                <div className="items-center">
                  <div>
                    <p className="text-green-500 text-center">During card update, a $1 fee will be deducted for verification.</p>
                  </div>
                </div>
                <div className="flex justify-center items-center py-4">
                  <div>
                    <a className="text-blue-500" href="consumerlawdispute.ai/disclaimer">Disclaimer</a>
                  </div>
                  <div className="slash-div">
                    <p className="px-1">|</p>
                  </div>
                  <div>
                    <a className="text-blue-500" href="https://www.consumerlawdispute.ai/terms-conditions/">Terms and condition</a>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4">
                  <div className="col-4">
                    <img src={VisaImg} width={"220"} alt="visa-img" />
                  </div>
                  <div className="col-4 px-2">
                    <a href="">|</a>
                  </div>
                  <div className="col-4">
                    <p >We do not accept Amex and Discover.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      {/* <Footer></Footer> */}
    </>
  );
}

export default UpdateCardDetails;
