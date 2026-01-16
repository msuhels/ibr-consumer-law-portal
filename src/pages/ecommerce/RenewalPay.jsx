import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PayBg from '../../images/credit-page.png';
import User from "../../images/user-64-13.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import react-toastify for showing notifications
import { GET_SUBSCRIPTION_DETAILS, CANCLE_USER_SUBSCRIPTION, GET_PLAN_DETAILS, CHECK_APPLIED_COUPON, UPDATE_COUPON_LIMIT, GET_USER_DETAILS, UPDATE_USER_SUBSCRIPTION } from "../../API/api"
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { ProductionType, CookiesUrl } from "../../Config";
import VisaImg from '../../images/pay-img.png';
import { useParams } from "react-router-dom";

function Pay({ BackendUrl }) {
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [subscription, setSubscription] = useState(null);
  const [state, setState] = useState(null);
  const [isPlanAmount, setIsPlanAmount] = useState(null);
  const [iscoupon, setIscoupon] = useState(false);
  const [isInputcouponCode, setIsInputcouponCode] = useState("");
  const [isCouponCodeValid, setIsCouponCodeValid] = useState(false);
  const navigate = useNavigate();
  const [card, setCard] = useState(true);

  useEffect(() => {
    getPlanData();
  }, []);
  const [form, setForm] = useState({
    card_no: "",
    expiration: "",
    cvc: "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    company: "",
  });
  const [loaderSignin, setloaderSignin] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  const handleCardNumberChange = (event) => {
    const { value } = event.target;

    const formattedValue = value.replace(/\D/g, '');

    const formattedCardNumber = formattedValue.replace(/(\d{4})/g, '$1 ').trim();

    setForm({
      card_no: formattedCardNumber
    });
  };

  const getPlanData = async () => {
    let URL = GET_PLAN_DETAILS(id);
    try {
      const response = await axios.get(URL);
      setState(response?.data?.planInfo);
      setIsPlanAmount(response?.data?.planInfo?.price)
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

  const handleCouponCode = (e) => {
    setIsInputcouponCode(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ProductionType === "LIVE") {
      if (form.card_no.trim() === '4242 4242 4242 4242') {
        toast.error('Credit Card Number is invalid.');
        return;
      }
    }
    if (
      !form.card_no || form.card_no.trim() === '' ||
      !form.expiration || form.expiration.trim() === '' ||
      !form.cvc || form.cvc.trim() === '' ||
      !form.address || form.address.trim() === '' ||
      !form.city || form.city.trim() === '' ||
      !form.state || form.state.trim() === '' ||
      !form.zip || form.zip.trim() === ''
    ) {
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
      const res = await axios.post(`${BackendUrl}/user/authorize-payment`,
        { form, email: user?.email, type: state.plan_type, amount: isPlanAmount, subscription_amount: state.subscription_amount, trial: state.istrial, planName: state.plan_id },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      if (res?.data) {
        if (isCouponCodeValid === true) {
          try {
            const response = await axios.post(UPDATE_COUPON_LIMIT,
              {
                couponCode: isInputcouponCode,
              },
              {
                headers: { "Authorization": "Bearer " + token }
              });
          } catch (error) {
            console.log(error?.response?.data?.message);
          }
        }

      }
      if (state.trial == 14) {
        toast.success('Congratulations, Your subscription has been created!');
      } else {
        toast.success(res.data.message || 'Payment Successful');
      }
      setloaderSignin(false);
      {
        state.plan_id === "1" || state.plan_id === "5" ?
          navigate(`/dashboard/${user?._id}`)
          :
          navigate(`/clients`)

      }

      const userDataJSON = Cookies.get("user_token");
      if (userDataJSON) {
        let userData = JSON.parse(userDataJSON);
        userData.user.plan_name = state.plan_id;
        Cookies.set("user_token", JSON.stringify(userData), {
          domain: CookiesUrl,
          path: "/",
          expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          secure: true,
        });
      }
    } catch (error) {
      setloaderSignin(false);
      toast.error(error?.response?.data);
    }
  };

  function formatExpiryDate(input) {
    // Add "/" after entering MM
    if (input.value.length === 2 && !input.value.includes("/")) {
      input.value += "/";
    }
  }

  const getDetails = async () => {
    let URL = GET_SUBSCRIPTION_DETAILS("9048983");
    try {
      const response = await axios.get(URL,
        {
          headers: { "Authorization": "Bearer " + token }
        });
      setSubscription(response.data);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await axios.post(CANCLE_USER_SUBSCRIPTION,
        {
          id: "9044527"
        },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      // setSubscription(response.data);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const upgradePlan = async () => {
    try {
      const response = await axios.post(UPDATE_USER_SUBSCRIPTION,
        {
          subID: "9062486"
        },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      // setSubscription(response.data);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };


  const checkAppliedCoupon = async () => {
    if (isInputcouponCode === '') {
      toast.error('Coupon Code Is Requried');
      return;
    }
    try {
      const response = await axios.post(CHECK_APPLIED_COUPON,
        {
          couponCode: isInputcouponCode,
          plan_id: state.plan_id,
          plan_amount: state.price,
        },
        {
          headers: { "Authorization": "Bearer " + token }
        });
      if (response?.data?.couponValid === true) {
        setIsCouponCodeValid(response?.data?.couponValid);
        setIscoupon(false)
        setIsPlanAmount(response?.data?.newPlanAmount)
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid Coupon Code");
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
                      <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">Pay With Card</h1>
                      <p
                        className="mt-3 mb-4"
                      >
                        {/* Upgrade your plan today to unlock more features to help you navigate your credit journey. Save 20% when you upgrade for a yearly plan. */}
                        You are few steps away from unlocking your access to the #1 Consumer Law & AI-powered Dispute Software!
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
                      className="form-input rounded-2xl w-full"
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
                        className="form-input rounded-2xl w-full"
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
                        className="form-input rounded-2xl w-full"
                        type="text"
                        placeholder="CVC"
                        required
                      />
                    </div>
                  </div>

                  <hr></hr>
                  <h2 className="font-bold">Billing Address</h2>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-address"
                      >
                        Address<span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="card-address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="form-input rounded-2xl w-full"
                        type="text"
                        placeholder="Address"
                        required="true"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-cvc"
                      >
                        City<span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="card-city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="form-input rounded-2xl w-full"
                        type="text"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-expiry"
                      >
                        State<span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        autoComplete="state"
                        className="form-select w-full"
                      >
                        <option value="">Select a state</option>
                        {/* Map through states to generate options */}
                        {states.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-cvc"
                      >
                        Zip<span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="card-zip"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        maxLength="5"
                        className="form-input rounded-2xl w-full"
                        type="text"
                        placeholder="Zip-Code"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-cvc"
                      >
                        Company (Optional)
                      </label>
                      <input
                        id="card-company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="form-input rounded-2xl w-full"
                        type="text"
                        placeholder="Company Name"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="card-cvc"
                      >
                        Country
                      </label>
                      <input
                        name="country"
                        className="form-input rounded-2xl w-full"
                        type="text"
                        value={form.country}
                        placeholder="Country"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {(state?.plan_name === "1" && state?.price === 1) || (state?.plan_name === "5" && state?.price === 1) ?
                  ""
                  :
                  <>
                    {isCouponCodeValid ? "" :
                      <div className="text-right mt-4">
                        {iscoupon ?
                          <span className="text-red-500 cursor-pointer" onClick={() => setIscoupon(false)}>
                            Cancel Coupon Code!
                          </span>
                          :
                          <span className="text-blue-500 cursor-pointer" onClick={() => setIscoupon(true)}>
                            Have Coupon Code?
                          </span>
                        }

                        {iscoupon &&
                          <div className="mt-3">
                            <input
                              className="form-input rounded-2xl w-full"
                              type="text"
                              placeholder="Enter your coupon code"
                              onChange={handleCouponCode}
                            />
                          </div>
                        }
                      </div>
                    }

                  </>
                }


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
                        {
                          iscoupon ?
                            <>
                              {isCouponCodeValid ? "" :

                                <button
                                  className="py-2 rounded-3xl w-full btnn-background text-white"
                                  onClick={() => checkAppliedCoupon()}
                                >
                                  Apply Coupon
                                </button>
                              }
                            </>
                            :
                            <button
                              className="py-2 rounded-3xl w-full btnn-background text-white"
                              onClick={(e) => handleSubmit(e)}
                            >
                              {isCouponCodeValid ?
                                <>
                                  Pay ${isPlanAmount}
                                </>
                                :
                                <>
                                  Pay ${isPlanAmount}
                                </>

                              }
                            </button>
                        }
                      </>

                    )}
                    {isCouponCodeValid &&
                      <div className="text-center mt-3">
                        <h2 className="font-bold text-green-700 text-xl	">Coupon Code Applied!</h2>
                      </div>
                    }

                  </div>
                </div>
                {(state?.plan_name === "1" && state?.price === 1) || (state?.plan_name === "5" && state?.price === 1) ?
                  <div className="space-x-4 text-center">
                    No charges will be applied today. Automatic renewal will occur in 14 days. You can cancel anytime.
                  </div>
                  :
                  <>
                    {isCouponCodeValid &&
                      <div className="space-x-4 text-center">
                        Note: Promotion is applicable on first payment only. From next cycle regular amount will be charged.
                      </div>
                    }
                  </>
                }
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

export default Pay;
