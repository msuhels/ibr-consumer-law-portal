import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  UPDATE_LETTER_PAYMENT,
  CHECK_EMPTY_ADDRESS,
  UPDATE_LETTER_RESPONSE,
  GET_USER_DETAILS,
  CREATE_USERS_ACTIVITY,
} from "../API/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LetterAddressData from "./LetterAddessData";
import { LobApiKey } from "../Config";
import ModalBasic from "../components/ModalBasic-sm";

function SendLetterEmailPayment({
  userID,
  activeTab,
  handleTabClick,
  responseData,
  sendLettersResponse,
  selectedItems,
  getAwsDocumnets,
  setSelectedItems,
  editLettersResponse,
  userdetails,
  checkedValues,
}) {

  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [dateRange, setDateRange] = useState("");
  const [printLocal, setPrintLocal] = useState(false);
  const [showCardFrom, setshowCardFrom] = useState(false);
  const [showCardInput, setshowCardInput] = useState(false);
  const [showButton, setshowButton] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isSendFromDetails, setSendFromDetails] = useState("");
  const [isSendToDetails, setSendToDetails] = useState([]);
  const [isCardPaymentAmount, setisCardPaymentAmount] = useState("");
  const [perPageAmount, setPerPageAmount] = useState("");
  const [totalExtraAmount, setTotalExtraAmount] = useState(0);
  const [payment_type, setPayment_type] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState({
    card_no: "",
    expiration: "",
    cvc: "",
    name: "",
    email: "",
  });
  const [loaderSignin, setloaderSignin] = useState(false);
  const [print_letter, set_print_letter] = useState(false);

  const handleCardNumberChange = (event) => {
    const { value } = event.target;

    const formattedValue = value.replace(/\D/g, "");

    const formattedCardNumber = formattedValue
      .replace(/(\d{4})/g, "$1 ")
      .trim();

    setForm({
      card_no: formattedCardNumber,
      cvc: form.cvc,
      expiration: form.expiration,
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

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

  const getUserData = async () => {
    let URL = GET_USER_DETAILS(userID);
    try {
      const response = await axios.get(URL, {
        headers: { Authorization: "Bearer " + token },
      });
      // console.log(response?.data?.UserDetails, "dsakhjhdgshk")
      // setUserData(response?.data?.UserDetails);
    } catch (error) {
      console.log("Something went wrong");
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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showButton === "usps_standard") {
        const { results, totalAmount } = countTotalLinesAndCalculatePrice(responseData, 50);
        setPerPageAmount(results)
        setTotalExtraAmount(totalAmount)
      } else {
        const { results, totalAmount } = countTotalLinesAndCalculatePrice(responseData, 60);
        setPerPageAmount(results)
        setTotalExtraAmount(totalAmount)
      }
      const response = await axios.post(
        CHECK_EMPTY_ADDRESS,
        {
          response_data: responseData,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.data.status === "invalid") {
        toast.error(response.data.message);
      } else {
        if (response.data.status === "valid") {
          setIsChecked(false);
          setFeedbackModalOpen(true);
          setSendFromDetails(response.data.userData);
          setSendToDetails(response.data.addressDetails);
        } else {
          toast.error("Something went Wrong");
        }
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Something went Wrong");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!form.card_no || !form.expiration || !form.cvc) {
      toast.error("Please fill in all required card details.");
      return;
    }
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(form.expiration)) {
      toast.error("Please Provide A Valid Expiration date (MM/YY)");
      return;
    }
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear() % 100;

    // Extract month and year from the expiration date
    const [expMonth, expYear] = form.expiration.split("/").map(Number);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      toast.error("Please Provide A Valid Expiration date.");
      return;
    }
    setloaderSignin(true);
    try {
      const response = await axios.post(
        UPDATE_LETTER_PAYMENT,
        {
          form,
          amount: isCardPaymentAmount,
          letterCount: responseData.length,
          selectedItems: selectedItems,
          payment_type: payment_type,
          extraPageAmount:totalExtraAmount
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response?.data?.message === "Successful.") {
        toast.success(response?.data?.message || "Payment Successful");
        for (const record of response?.data?.updatedLetters) {
          let requestData = {
            type: record.type,
            inquiry: record.inquiry,
            derogatory: record.derogatory,
            public: record.public,
          };
          let disputeType = "";
          let disputeItem = "";
          if (requestData?.type && requestData?.type === "inquiry") {
            disputeType = "Inquiry";
            disputeItem = requestData?.inquiry["Creditor Name"];
          } else if (requestData?.type && requestData?.type === "derogatory") {
            disputeType = "Derogatory";
            disputeItem = requestData?.derogatory["bankName"];
          } else if (requestData?.type && requestData?.type === "public") {
            disputeType = "Public";
            disputeItem = requestData?.public?.bankName;
          }
          userActivity(
            "Payment",
            "",
            "",
            "success",
            `Made payment for letter - ${disputeType}-${disputeItem} - LOB`
          );
        }
        handle_Letter_Print();
        setloaderSignin(false);
        set_print_letter(true);
        setTimeout(() => {
          getAwsDocumnets();
          return navigate(`/track-letter/${userID}`);
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response.data || "Something went wrong");
      setloaderSignin(false);
    }
  };

  function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) : str;
  }

  const handle_Letter_Print = async (req, res) => {
    try {
      for (const [index, selectedData] of selectedItems.entries()) {
        var company_name = "";
        if (selectedData?.derogatory) {
          company_name = selectedData?.derogatory?.bankName;
        } else if (selectedData?.inquiry) {
          company_name = selectedData?.inquiry?.["Creditor Name"];
        } else if (selectedData?.public) {
          company_name = selectedData?.public?.bankName;
        }
        var maxLength = 39;
        var truncatedCompanyName = truncateString(company_name, maxLength);
        var data = "";
        if (showButton === "usps_standard") {
          data = JSON.stringify({
            description: "Consumer Letter",
            to: {
              company: truncatedCompanyName,
              phone: isSendToDetails[index]?.phone,
              address_line1: isSendToDetails[index]?.address,
              address_city: isSendToDetails[index]?.city,
              address_state: isSendToDetails[index]?.state,
              address_zip: isSendToDetails[index]?.zip,
              address_country: isSendToDetails[index]?.country,
            },
            from: {
              name: isSendFromDetails?.name,
              address_line1: isSendFromDetails?.address,
              address_city: isSendFromDetails?.city,
              address_state: isSendFromDetails?.state,
              address_zip: isSendFromDetails?.zip,
            },
            file: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                  .body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    font-size: 12px; /* Adjust font size as needed */
                }
                .barcode {
                  text-align: left;
              }
          
                      .letter {
                          max-width: 100%;
                          margin: 0 auto;
                          border: 1px solid #ccc;
                          padding: 20px;
                      }
          
                      .header {
                          text-align: center;
                          margin-bottom: 20px;
                      }
          
                      .content {
                          margin-bottom: 20px;
                          word-wrap: break-word;
                      }
          
                      .signature {
                          text-align: right;
                          margin-top: 20px;
                      }
          
                      .Documents {
                          text-align: left;
                      }
          
                      .address {
                          text-align: right;
                          margin-bottom: 10px;
                      }
          
                      .top-buttom {
                          margin-bottom: 30px;
                      }
                  </style>
                  <title>Business Letter</title>
              </head>
              <body>
              <div class="barcode">
                  <div class="letter">
                      <div class="header">
                          <!-- Header Content Here -->
                      </div>
          
                      <div class="content">
                          {{content}}
                      </div>
          
                      <div class="signature">
                          ${userdetails?.signature
                ? `<img src=${userdetails.signature} width="100" height="40" alt="Your Signature">`
                : ""
              }
                      </div>
          
                      <div class="Documents">
                          ${checkedValues?.photo_id
                ? `${userdetails?.photo_id
                  ? `<img src=${userdetails.photo_id} width="100" height="100" alt="Photo ID">`
                  : ""
                }`
                : ""
              }
                      </div>
          
                      <div class="Documents">
                          ${checkedValues?.proof_of_address
                ? `${userdetails?.proof_of_address
                  ? `<img src=${userdetails.proof_of_address} width="100" height="100" alt="Proof of Address">`
                  : ""
                }`
                : ""
              }
                      </div>
                  </div>
          </div>
              </body>
              </html>`,
            color: true,
            double_sided: false,
            extra_service: "certified",
            mail_type: "usps_first_class",
            return_envelope: true,
            perforated_page: 1,
            merge_variables: {
              firstname: isSendFromDetails?.name,
              recepient: "",
              role: "",
              company: "Consumerlawdispute.AI",
              content: selectedData?.ai_Response,
            },
            metadata: {
              spiffy: "true",
            },
            use_type: "operational",
          });
        } else {
          var data = JSON.stringify({
            description: "Consumer Letter",
            to: {
              // description: "",
              // name: "Dispute Letter",
              company: truncatedCompanyName,
              // email: " ",
              phone: isSendToDetails[index]?.phone,
              address_line1: isSendToDetails[index]?.address,
              // address_line2: "",
              address_city: isSendToDetails[index]?.city,
              address_state: isSendToDetails[index]?.state,
              address_zip: isSendToDetails[index]?.zip,
              address_country: isSendToDetails[index]?.country,
            },
            from: {
              name: isSendFromDetails?.name,
              address_line1: isSendFromDetails?.address,
              // address_line2: "",
              address_city: isSendFromDetails?.city,
              address_state: isSendFromDetails?.state,
              address_zip: isSendFromDetails?.zip,
            },
            file: `<!DOCTYPE html>
                     <html lang="en">
                     <head>
                         <meta charset="UTF-8">
                         <meta http-equiv="X-UA-Compatible" content="IE=edge">
                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
                         <style>
                             body {
                                 font-family: Arial, sans-serif;
                                 line-height: 1.6;
                                 margin: 10px 30px 20px 30px;
                                 font-size: 10px;
                             }
                     
                             .letter {
                               max-width: 100%; /* Adjust percentage as needed */
                               margin: 0 auto;
                               border: 1px solid #ccc; /* Adding a border for visualization */
                               padding: 0px 30px 20px 30px;
                           }
                   
                           .letter {
                             max-width: 100%;
                             margin: 50px auto; /* Adjust the top and bottom margin as needed */
                             border: 1px solid #ccc;
                             padding: 0px 30px 20px 30px;
                           }
                     
                             .header {
                                 text-align: center;
                                 margin-bottom: 20px;
                             }
                     
                             .date {
                                 text-align: right;
                                 margin-bottom: 20px;
                             }
                     
                             .address {
                                 margin-bottom: 20px;
                             }
                     
                             .salutation {
                               margin-bottom: 30px;
                               margin-bottom: 20px;
                             }
                     
                             .content {
                               margin-top: 250px; 
                               margin-bottom: 20px;
                               word-wrap: break-word;
                           }
                     
                             .closing {
                                 margin-bottom: 20px;
                             }
                     
                             .signature {
                               margin-top: 20px;
                                 text-align: right;
                             } 
           
                             .Documents {
                               text-align: left;
                           }
                             .address {
                               text-align: right;
                               margin-bottom: 10px;
                           }
                           .top-buttom {
                             margin-bottom: 30px;
                         }
                         </style>
                         <title>Business Letter</title>
                     </head>
                     <body>
                     
                         <div class="letter">
                     
                             <div class="header">
                              
                             </div>
                     
                             <div class="date">
                             </div>
                            
                     
                             <div class="content">
                                 {{content}}
                             </div>
                     
                             <div class="signature">
                             ${userdetails?.signature
                ? `<img src=${userdetails.signature} width="30" height="40" alt="Your Documents">`
                : ""
              }
           
                         </div>
           
                             <div class="Documents">
                             ${checkedValues?.photo_id
                ? `${userdetails?.photo_id
                  ? `<img src=${userdetails.photo_id} width="100" height="100" alt="Your Documents">`
                  : ""
                }
                               `
                : ""
              }
                         </div>
           
                         <div class="Documents">
                         ${checkedValues?.proof_of_address
                ? `${userdetails?.proof_of_address
                  ? `<img src=${userdetails.proof_of_address} width="100" height="100" alt="Your Documents">`
                  : ""
                }
                         `
                : ""
              }
           
                     </div>
                         </div>
                     
                     </body>
                     </html>`,
            color: true,
            double_sided: false,
            mail_type: showButton,
            // extra_service:"certified"
            // mail_type: "usps_standard",
            return_envelope: true,
            perforated_page: 1,
            merge_variables: {
              firstname: isSendFromDetails?.name,
              recepient: "",
              role: "",
              company: "Consumerlawdispute.AI",
              content: selectedData?.ai_Response,
            },
            metadata: {
              spiffy: "true",
            },
            // custom_envelope: null,
            use_type: "operational",
          });
        }

        const config = {
          method: "post",
          url: "https://api.lob.com/v1/letters",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${LobApiKey}`,
          },
          data: data,
        };

        try {
          const response = await axios(config);
          if (response.data) {
            try {
              const res = await axios.post(
                UPDATE_LETTER_RESPONSE,
                {
                  letter_id: isSendToDetails[index]?._id,
                  letter_response: response.data,
                  userId: userID,
                },
                { headers: { Authorization: "Bearer " + token } }
              );
              getAwsDocumnets();
              handleTabClick("contacts");
            } catch (error) {
              toast.error("Something went wrong to save the letter reponse");
            }
            toast.success("Letter Send Successfully");
            for (const record of selectedItems) {
              let requestData = {
                type: record.type,
                inquiry: record.inquiry,
                derogatory: record.derogatory,
              };
              let disputeType = "";
              let disputeItem = "";
              if (requestData?.type && requestData?.type === "inquiry") {
                disputeType = "Inquiry";
                disputeItem = requestData?.inquiry["Creditor Name"];
              } else if (
                requestData?.type &&
                requestData?.type === "derogatory"
              ) {
                disputeType = "Derogatory";
                disputeItem = requestData?.derogatory["bankName"];
              } else if (requestData?.type && requestData?.type === "public") {
                disputeType = "Public";
                disputeItem = requestData?.public?.bankName;
              }
              userActivity(
                "Payment",
                "",
                "",
                "success",
                `Lob letter successfully send for letter - ${disputeType}-${disputeItem} - LOB`
              );
            }
          }
        } catch (error) {
          userActivity(
            "Letter Failed",
            "",
            "",
            "failed",
            `${error.response.data.error.message ? error.response.data.error.message : 'Facing issue while sending the letter to lob. - LOB'}`
          );
          console.log(error);
        }
      }
    } catch (err) {
      userActivity(
        "Letter Failed",
        "",
        "",
        "failed",
        `${err.response.data.error.message ? error.response.data.error.message : 'Facing issue while sending the letter to lob. - LOB'}`
      );
      console.log(err);
    }
  };

  function formatExpiryDate(input) {
    // Add "/" after entering MM
    if (input.value.length === 2 && !input.value.includes("/")) {
      input.value += "/";
    }
  }
  useEffect(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 4); // Adding 3 days
    const futureDateTwo = new Date(today);
    futureDateTwo.setDate(today.getDate() + 6); // Adding 3 days
    const formattedToday = formatDate(today);
    const formattedFutureDate = formatDate(futureDate);
    const formattedFutureDateTwo = formatDate(futureDateTwo);
    const dateRangeString = `${formattedFutureDate} - ${formattedFutureDateTwo}`;
    setDateRange(dateRangeString);
  }, []);

  const formatDate = (date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    return `${month}. ${day}`;
  };

  const handleOptionChange = (value) => {
    setshowButton(value);
  };
  const countTotalLinesAndCalculatePrice = (responses, limit) => {
    if (!Array.isArray(responses) || responses.length === 0) return { results: [], totalAmount: 0 };
    let totalAmount = 0;
    const results = responses.map((item, index) => {
      if (!item?.ai_Response) return { index, letterName: item?.letterName || "Unknown", totalLines: 0, price: 0 };

      // Replace <br /> and <p> tags with newline characters
      const formattedText = item.ai_Response
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<\/?p>/g, "\n");

      // Split by newline and count lines
      const totalLines = formattedText.split("\n").filter(line => line.trim() !== "").length;

      // Calculate price: First 50 lines are free, charge $0.25 per extra 50 lines
      const extraLines = totalLines > 50 ? totalLines - 50 : 0;
      const price = Math.ceil(extraLines / 50) * 0.25;

      // Add to total amount
      totalAmount += price;

      return { index, letterName: item?.letterName || "Unknown", totalLines, price };
    });

    return { results, totalAmount };
  };


  const procressOptionChange = () => {
    if (showButton === "usps_first_class") {
      setisCardPaymentAmount("2.49");
      setPayment_type("First class mail payment");
      setshowCardFrom(true);
    } else if (showButton === "usps_standard") {
      setisCardPaymentAmount("8.25");
      setPayment_type("Certified mail payment");
      setshowCardFrom(true);
    } else if (showButton === "print_local") {
      setshowCardFrom(false);
      sendLettersResponse(responseData);
    }
  };
  return (
    <>
      <>
        {showCardFrom ? (
          <>
            {showCardInput ? (
              <ul class="grid w-full gap-6 md:grid-cols-3 mt-4">
                <li></li>
                <li>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="card-nr"
                        >
                          Card Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                          <input
                            id="card-nr"
                            value={form.card_no}
                            name="card_no"
                            onChange={handleCardNumberChange}
                            className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                            type="text"
                            placeholder="1234 1234 1234 1234"
                            minLength="19" // Adjusted for the extra spaces
                            maxLength="19" // Adjusted for the extra spaces
                            required
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label
                            className="block text-md font-semibold mb-2"
                            style={{ color: "#080D18" }}
                            htmlFor="card-expiry"
                          >
                            Expiry Date <span className="text-rose-500">*</span>
                          </label>
                          <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                            <input
                              id="card-expiry"
                              name="expiration"
                              value={form.expiration}
                              onChange={handleChange}
                              className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                              type="text"
                              pattern="(0[1-9]|1[0-2])\/\d{2}"
                              maxLength="5"
                              onInput={(e) => formatExpiryDate(e.target)}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label
                            className="block text-md font-semibold mb-2"
                            style={{ color: "#080D18" }}
                            htmlFor="card-cvc"
                          >
                            CVC <span className="text-rose-500">*</span>
                          </label>
                          <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                            <input
                              id="card-cvc"
                              name="cvc"
                              value={form.cvc}
                              onChange={handleChange}
                              maxLength="3"
                              className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                              type="password"
                              placeholder="CVC"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li></li>
              </ul>
            ) : (
              <div className="overflow-x-auto mb-5">
                <table className="table-auto w-full dark:text-slate-300 mt-3">
                  <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </div>
                      </th> */}
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Letter To</div>
                      </th>
                      {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Created</div>
                      </th> */}
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          Print Status
                        </div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Amount</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Actions</div>
                      </th>
                      {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left"></div>
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {responseData.map((val, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div>
                              {val?.letterName ? (
                                val?.letterName
                              ) : (
                                <>
                                  {val?.receiver_name ? (
                                    val?.receiver_name
                                  ) : (
                                    <>
                                      {val?.derogatory &&
                                        val?.derogatory.bankName}
                                      {val?.inquiry &&
                                        val?.inquiry["Creditor Name"]}
                                      {val?.public && val?.public.bankName}
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
                            <div className="flex items-center">
                              <div>
                                {val?.printing_status === 1
                                  ? "Printed/Locally"
                                  : val?.printing_status === 2
                                    ? "Printed/Sent"
                                    : "Pending Print"}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div>${isCardPaymentAmount}</div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <button
                              onClick={() => editLettersResponse(val)}
                              className="text-black-200 hover:text-black-500 dark:text-black-500 dark:hover:text-black-200 rounded-full"
                            >
                              Edit Letter
                            </button>{" "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <ul class="grid w-full gap-6 md:grid-cols-3 mt-4">
            <li>
              <input
                type="radio"
                id="hosting-big-1"
                name="hosting"
                value="option1"
                className="hidden peer"
                onClick={() => handleOptionChange("usps_first_class")}
              />
              <label
                htmlFor="hosting-big-1"
                className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-3xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-white dark:text-gray-400 dark:bg-white dark:hover:bg-white"
              >
                <div>
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 "
                    aria-hidden="true"
                  ></div>
                  <div className="border-b border-slate-200 dark:border-slate-700">
                    <header className=" items-center mb-2 text-center">
                      <h1 className="text-xl  text-slate-800 dark:text-slate-100 font-semibold">
                        First Class Mail
                      </h1>
                    </header>
                    <p className="text-center text-slate-500 font-medium text-sm ">
                      Est. Delivery Date
                    </p>
                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 text-center mt-3">
                      <span className="text-2xl">{dateRange}</span>
                    </div>
                  </div>
                  <div className=" pt-4">
                    <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                      What's included
                    </div>
                    {/* List */}
                    <ul>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">
                          No visit to the post office
                        </div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">
                          Less than one week delivery
                        </div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 shrink-0 text-red-500 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <div className="text-sm">Tracking provided by USPS</div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 shrink-0 text-red-500 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>

                        <div className="text-sm">Proof of delivery </div>
                      </li>
                    </ul>
                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 text-center mt-3">
                      <span className="text-2xl">Starting at $2.49</span>
                      <p className="text-center text-slate-500 font-medium text-sm ">
                        + additional pages $0.25
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="hosting-big-2"
                name="hosting"
                value="option2"
                className="hidden peer"
                onClick={() => handleOptionChange("usps_standard")}
              />
              <label
                htmlFor="hosting-big-2"
                className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-3xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-white dark:text-gray-400 dark:bg-white dark:hover:bg-white"
              >
                <div>
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 "
                    aria-hidden="true"
                  ></div>
                  <div className="border-b border-slate-200 dark:border-slate-700">
                    <header className=" items-center mb-2 text-center">
                      <h1 className="text-xl  text-slate-800 dark:text-slate-100 font-semibold">
                        Certified Mail
                      </h1>
                    </header>
                    <p className="text-center text-slate-500 font-medium text-sm ">
                      Est. Delivery Date
                    </p>
                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 text-center mt-3">
                      <span className="text-2xl">{dateRange}</span>
                    </div>
                  </div>
                  <div className=" pt-4">
                    <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold uppercase mb-4">
                      What's included
                    </div>
                    {/* List */}
                    <ul>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">
                          No visit to the post office
                        </div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">
                          Less than one week delivery
                        </div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">Tracking provided by USPS</div>
                      </li>
                      <li className="flex items-center py-1">
                        <svg
                          className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                        </svg>
                        <div className="text-sm">Proof of delivery </div>
                      </li>
                    </ul>
                    <div className="text-slate-800 dark:text-slate-100 font-bold mb-4 text-center mt-3">
                      <span className="text-2xl">Starting at $8.25</span>
                      <p className="text-center text-slate-500 font-medium text-sm ">
                        + additional pages $0.25
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                id="hosting-big-3"
                name="hosting"
                value="option3"
                className="hidden peer"
                onClick={() => handleOptionChange("print_local")}
              />
              <label
                htmlFor="hosting-big-3"
                className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-3xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-white dark:text-gray-400 dark:bg-white dark:hover:bg-white"
              >
                <div>
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 "
                    aria-hidden="true"
                  ></div>
                  <div className="border-b border-slate-200 dark:border-slate-700">
                    <header className=" items-center mb-2 text-center">
                      <h1 className="text-xl  text-slate-800 dark:text-slate-100 font-semibold">
                        Download, Print And Mail Locally
                      </h1>
                    </header>
                  </div>
                  <div
                    className=" pt-5 pb-5 mt-5 mb-5"
                    style={{ height: "294px" }}
                  >
                    <h1 className="text-xl  text-center text-slate-800 dark:text-slate-100 font-semibold">
                      Download and print the letter from home or office and mail your letters from your
                      local USPS
                    </h1>
                  </div>
                </div>
              </label>
            </li>
          </ul>
        )}
      </>
      <div className="bottom-0 sticky w-full  font-bold rounded-full  centered-button z-10">
        <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col h-full">
            <div className="text-center pb-5">
              <div className=" m-4">
                {showCardFrom ? (
                  <button
                    className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                    onClick={() => {
                      setshowCardFrom(false);
                      setshowButton(false);
                      setshowCardInput(false);
                    }}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                    id="dashboard-tab"
                    onClick={() => handleTabClick("dashboard")}
                    role="tab"
                    aria-controls="dashboard"
                    aria-selected={activeTab === "dashboard"}
                  >
                    Back
                  </button>
                )}

                {showButton && (
                  <>
                    {showCardFrom ? (
                      <>
                        {loaderSignin ? (
                          <button
                            className="btn tm-background text-white"
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
                            {showCardInput ? (
                              <button
                                className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                                onClick={(e) => handlePaymentSubmit(e)}
                              >
                                Pay $
                                {totalExtraAmount ?
                                  <>
                                    {(totalExtraAmount + isCardPaymentAmount * responseData.length).toFixed(2)}
                                  </>
                                  :
                                  <>
                                    {(
                                      isCardPaymentAmount * responseData.length
                                    ).toFixed(2)}
                                  </>
                                }

                              </button>
                            ) : (
                              <>
                                <button
                                  className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                                  onClick={(e) => handleAddressSubmit(e)}
                                >
                                  Next
                                  {/* {(
                                    isCardPaymentAmount * responseData.length
                                  ).toFixed(2)} */}
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <button
                        className="py-2 px-5 rounded-3xl tm-background text-white me-3"
                        onClick={() => procressOptionChange()}
                      >
                        Next
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalBasic
        id="feedback-modal"
        modalOpen={feedbackModalOpen}
        setModalOpen={setFeedbackModalOpen}
        title={totalExtraAmount ? "Payment Breakdown" : ""}
      >
        {totalExtraAmount ?
          <>
            {perPageAmount && perPageAmount?.map((val, i) => {
              return (
                <>
                  {val?.totalLines > 50 ?
                    <>
                      <tr key={i}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div>
                            #.
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div>
                            {val?.letterName}
                          </div>
                        </td>
                        :
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div>
                            <span className="text-green-600">
                              ${val?.price}
                            </span> (extra page charges)
                          </div>
                        </td>
                      </tr>
                    </> :
                    ""}
                </>
              );
            })}
            <div className="px-5 py-5">
              <h1 className="font-bold"> Total amount paid with extra pages = <span className="text-green-700">
                {totalExtraAmount &&
                  <>
                    $ {(totalExtraAmount + isCardPaymentAmount * responseData.length).toFixed(2)}
                  </>
                }
              </span>
              </h1>
            </div>
            <hr className="mt-3"></hr>
          </>
          :
          ""
        }
        <div className="px-5 py-5  border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center ">
            <div className=" text-2xl md:text-3xl text-slate-900 dark:text-slate-100 font-bold " style={{ color: '#080D18' }}>Disclaimer<h1></h1></div>
          </div>
        </div>
        <div style={{ maxHeight: "calc(90vh - 160px)" }}>
          <p className="px-5 py-5">
            By accepting, I confirm that I have thoroughly reviewed the letters
            and verified that all the information is accurate. I understand that
            once payment is made, no refunds will be issued if any errors are
            later discovered in the letters.
          </p>


          <hr className=""></hr>
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accept-check"
                className="mr-2"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="accept-check" className="text-sm">
                I accept the terms and conditions
              </label>
            </div>
            <button
              onClick={(e) => {
                setshowCardInput(true);
                setFeedbackModalOpen(false);
              }}
              disabled={!isChecked}
              className={`mt-4 py-2 px-4 rounded ${isChecked
                ? "btn tm-background text-white"
                : "btn  text-white bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Proceed To Pay
            </button>
          </div>
        </div>
      </ModalBasic>
    </>
  );
}

export default SendLetterEmailPayment;
