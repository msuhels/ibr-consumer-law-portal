import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { LETTERS_GENERATOR_DATA_BY_FILTER, GET_BANK_ADDRESS, GET_ACTIVE_LETTERS_GENERATOR_LIST, UPDATE_USER_DETAILS, ADD_MULTIPLE_LETTER, GET_USER_DETAILS, EDIT_LETTERS_GENERATOR, ADD_TO_ADDRESS_DATA, UPDATE_AI_GENERATE_RESPONSE, UPDATE_AI_REPORT_STATUS, CREATE_USERS_ACTIVITY } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import LetterAddressData from '../components/LetterAddessData';
import parse from 'html-react-parser';
import { Link, useParams, useNavigate } from "react-router-dom";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { event } from 'jquery';
import Loder from '../partials/Loder';
import moment from "moment";

function AiCustomReportPage({
  idd,
  modalOpen,
  setModalOpen,
  updateButton,
  userPlanDetail,
  disputeCustomValue,
  setDisputeCustomValue,
  getDisputeData,
  userInquiryDataResponse,
  isShowStep,
  ChangeDisputeStep
}) {
  const navigate = useNavigate();
  const modalContent = useRef(null);
  const { id } = useParams();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isLetterGenerator, setLetterGenerator] = useState([]);
  const [isShowLetter, setShowLetter] = useState(false);
  const [isLetterData, setLetterData] = useState("");
  const [tabExperian, setTabExperian] = useState(false);
  const [tabTransUnion, setTabTransUnion] = useState(false);
  const [tabEquifax, setTabEquifax] = useState(false);
  const [responseTextTransUnion, setResponseTextTransUnion] = useState("");
  const [responseTextExperian, setResponseTextExperian] = useState("");
  const [responseTextEquifax, setResponseTextEquifax] = useState("");
  const [showInquireAddressTab, setshowInquireAddressTab] = useState(0);
  const [showPublicAddressTab, setshowPublicAddressTab] = useState(0);
  const [setLoader, setPageLoader] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [responseTextBank, setResponseTextBank] = useState("")
  const [responseTextAgency, setResponseTextAgency] = useState("")
  const [tabBank, setTabBank] = useState(false);
  const [tabAgency, setTabAgency] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");

  const [isLetterBankName, setIsLetterBankName] = useState(() => {
    const inquiryData = userInquiryDataResponse?.data?.inquiry;
    return inquiryData && inquiryData['Creditor Name']
      ? `Inquiry record letter sent to ${inquiryData['Creditor Name']}`
      : " ";
  });

  const [isLetterAgencyName, setIsLetterAgencyName] = useState(() => {
    const inquiryData = userInquiryDataResponse?.data?.inquiry;
    return inquiryData && inquiryData['Credit Bureau']
      ? `Inquiry record letter sent to ${inquiryData['Credit Bureau']}`
      : " ";
  });

  const [isLetterBankNamePublic, setIsLetterBankNamePublic] = useState(() => {
    const publicData = userInquiryDataResponse?.data?.public;
    return publicData && publicData?.bankName
      ? `Public record letter sent to ${publicData?.bankName}`
      : " ";
  });

  const [isLetterDerogratryBankName, setIsLetterDerogratryBankName] = useState(`${userInquiryDataResponse?.data?.derogatory?.bankName ? `Derogatory record letter sent to ${userInquiryDataResponse?.data?.derogatory?.bankName}` : ""}`);
  const [isLetterAgencyNameEquifax, setIsLetterAgencyNameEquifax] = useState(`Derogatory record letter sent to Equifax`);
  const [isLetterAgencyNameExperian, setIsLetterAgencyNameExperian] = useState(`Derogatory record letter sent to Experian`);
  const [isLetterAgencyNameTransUnion, setIsLetterAgencyNameTransUnion] = useState(`Derogatory record letter sent to TransUnion`);


  const [toAddressDetailsTransUnion, setToAddressDetailsTransUnion] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });


  const [toAddressDetailsExperian, setToAddressDetailsExperian] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [toAddressDetailsEquifax, setToAddressDetailsEquifax] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [userdetails, setUserdetails] = useState({
    user_id: id,
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    dob: "",
    signature:"",
    ss_number:"",
    previous_mailing_address:""
  });
  
  const [toAddressDetailsBank, setToAddressDetailsBank] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const [toAddressDetailsAgency, setToAddressDetailsAgency] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });
  const [toAddressDetails, setToAddressDetails] = useState({
    to_address: "",
    to_city: "",
    to_state: "",
    to_zip: "",
    to_phone: "",
    to_country: "US",
  });

  const handleToAddressChangeTransUnion = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsTransUnion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToAddressChangeExperian = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsExperian((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getActiveLetterGeneratorData();
  }, [search, selectedStatus]); // Fetch data when search term or selected status changes


  const handleToAddressChangeEquifax = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsEquifax((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToAddressChangeBank = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsBank((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleToAddressChangeAgency = (e) => {
    const { name, value } = e.target;
    setToAddressDetailsAgency((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const replaceFun = (text, agency_Name) => {
    if (Array.isArray(text) && text.length >= 1) {
      return null;
    }
    const isAgency = (agency_Name === 'TransUnion' || agency_Name === 'Experian' || agency_Name === 'Equifax');
    if (text) {
      if (text) {
        let res = text;
        const sources = ['TransUnion', 'Experian', 'Equifax'];

        res = res.replaceAll("\n", "<br >");
        const today = new Date();
        const formattedDate = today.toLocaleDateString(); 
        const prettyformattedDate = moment().format("dddd, MMMM Do YYYY");

        // Replace Today_+X_Days and Today_-X_Days with actual dates
        res = res.replace(/Today_([+-]\d+)_Days/g, (match, daysOffset) => {
          const newDate = new Date();
          newDate.setDate(today.getDate() + parseInt(daysOffset, 10));
          return newDate.toLocaleDateString();
        });
        res = formattedDate ? res.replaceAll(/current_date/g, formattedDate) : res;
        res = prettyformattedDate ? res.replaceAll(/pretty_curr_date/g, prettyformattedDate) : res;
        // res = userdetails?.name ? res.replaceAll(/client_full_name/g, userdetails?.name) : res;
        if (userdetails?.name) {
          const nameParts = userdetails.name.trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
          const middleName =
            nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
          res = res.replaceAll(/client_first_name/g, firstName);
          res = res.replaceAll(/client_middle_name/g, middleName);
          res = res.replaceAll(/client_last_name/g, lastName);
        }

        res = userdetails?.email ? res.replaceAll(/client_email/g, userdetails?.email) : res;
        res = userdetails?.ss_number ? res.replaceAll(/ss_number/g, userdetails?.ss_number) : res;
        res = userdetails?.ss_number ? res.replaceAll(/last4_ssn/g, userdetails.ss_number.slice(-4)) : res;
        res = userdetails?.city ? res.replaceAll(/client_city/g, userdetails?.city) : res;
        res = userdetails?.state ? res.replaceAll(/client_state/g, userdetails?.state) : res;
        res = userdetails?.zip ? res.replaceAll(/client_postal_code/g, userdetails?.zip) : res;
        res = userdetails?.address ? res.replaceAll(/client_address/g, userdetails?.address) : res;
        res = userdetails?.previous_mailing_address ? res.replaceAll(/client_previous_address/g, userdetails?.previous_mailing_address) : res;
        res = userdetails?.dob ? res.replaceAll(/bdate/g, userdetails?.dob) : res;
        if (userdetails?.signature) {
          res = res.replaceAll(
            /client_sign/g,
            `<img src="${userdetails?.signature}" alt="Signature" style="width: 78px; height:64px;" />`
          );
        }
        res = toAddressDetailsBank?.dob ? res.replaceAll(/creditor_name/g, toAddressDetailsBank?.dob) : res;
        res = toAddressDetailsBank?.to_address ? res.replaceAll(/creditor_address/g, toAddressDetailsBank?.to_address) : res;
        res = toAddressDetailsBank?.to_phone ? res.replaceAll(/creditor_phone/g, toAddressDetailsBank?.to_phone) : res;
        res = toAddressDetailsBank?.to_city ? res.replaceAll(/creditor_city/g, toAddressDetailsBank?.to_city) : res;
        res = toAddressDetailsBank?.to_state ? res.replaceAll(/creditor_state/g, toAddressDetailsBank?.to_state) : res;
        res = toAddressDetailsBank?.to_zip ? res.replaceAll(/creditor_zip/g, toAddressDetailsBank?.to_zip) : res;
        //company infor 
        if(userPlanDetail && userPlanDetail?.role === 'agent'){

          res = userPlanDetail?.name ? res.replaceAll(/company_name/g, userPlanDetail?.name) : res;
          res = userPlanDetail?.email ? res.replaceAll(/company_email/g, userPlanDetail?.email) : res;
          res = userPlanDetail?.phone ? res.replaceAll(/company_phone/g, userPlanDetail?.phone) : res;
          res = userPlanDetail?.address ? res.replaceAll(/company_address/g, userPlanDetail?.address) : res;
          res = userPlanDetail?.city ? res.replaceAll(/company_city/g, userPlanDetail?.city) : res;
          res = userPlanDetail?.state ? res.replaceAll(/company_state/g, userPlanDetail?.state) : res;
          res = userPlanDetail?.zip ? res.replaceAll(/company_postal_code/g, userPlanDetail?.zip) : res;
          res = userPlanDetail?.company_website ? res.replaceAll(/company_website/g, userPlanDetail?.company_website) : res;
          res = userPlanDetail?.fax_number ? res.replaceAll(/company_fax_number/g, userPlanDetail?.fax_number) : res;
          res = userPlanDetail?.second_phone ? res.replaceAll(/company_second_phone/g, userPlanDetail?.second_phone) : res;
        }

        res = agency_Name ? res.replaceAll(/bureau_name/g, agency_Name) : res;
        // TransUnion Experian Equifax
        if (agency_Name === "TransUnion") {
          res = agency_Name ? res.replaceAll(/bureau_address/g, `P.O.Box 2000 , Chester <br>
          Pennsyl vania 19016 <br> (800) 916 - 8800 <br> US`) : res;
        } else if (agency_Name === "Experian") {
          res = agency_Name ? res.replaceAll(/bureau_address/g, `P.O.Box 4500 , Allen <br>
          Texas 75013 <br> (888) 397-3742 <br> US`) : res;
        }
        else if (agency_Name === "Equifax") {
          res = agency_Name ? res.replaceAll(/bureau_address/g, `P.O.Box 740256 , Atlanta <br>
          Georgia 30374 <br> (866) 349-5191 <br> US`) : res;
        }
        //derogatory info

        const derogatoryData = disputeCustomValue?.data?.derogatory || {};
        const bankName = derogatoryData?.bankName || '';
        const accountNumbers = derogatoryData?.accountNumberData || {};
        const accountNumber = accountNumbers?.[agency_Name] || '';
      
        if (isAgency) {
          if (bankName && accountNumber) {
            res = res.replaceAll(/account_name_number/g, `${bankName} ${accountNumber}`);
          }
          if (accountNumber) {
            res = res.replaceAll(/account_number/g, accountNumber);
          }
        }
        if (bankName) {
          res = res.replaceAll(/account_name/g, bankName);
          res = res.replaceAll(/\baccount\b/g, bankName);
        }
        //other variavles 
        // console.log("disputeCustomValue?.data",derogatoryData);
        let [high_balance,last_verified, last_date_activity,
           date_reported,date_opened,closed_date,dispute_status ,account_status
           ,payment_status,payment_amount,account_type,credit_limit,past_due_amount,creditor_remarks,last_payment,term_length ] = ['', '', '', '','','','','','','','','','','','','','',''];
        // Build datefiled by concatenating available values

        if(agency_Name === 'TransUnion'){
           high_balance = derogatoryData['highCreditData']?.TransUnion
            last_date_activity = derogatoryData['lastActiveData']?.TransUnion
           date_opened = derogatoryData['dateOpenedData']?.TransUnion
           date_reported = derogatoryData['lastReportedData']?.TransUnion
           account_status = derogatoryData['accountStatusData']?.TransUnion
           account_type = derogatoryData['accountTypeData']?.TransUnion
           payment_status = derogatoryData['paymentStatusData']?.TransUnion
           payment_amount = derogatoryData['accountBalanceData']?.TransUnion
           credit_limit = derogatoryData['creditLimitData']?.TransUnion
           past_due_amount = derogatoryData['pastDueData']?.TransUnion
           creditor_remarks = derogatoryData['accountCommentsData']?.TransUnion
           last_payment = derogatoryData['lastPaymentData']?.TransUnion
           term_length = derogatoryData['accountTermsData']?.TransUnion

        } else if(agency_Name === 'Experian'){
          high_balance = derogatoryData['highCreditData']?.Experian
          last_date_activity = derogatoryData['lastActiveData']?.Experian
          date_opened = derogatoryData['dateOpenedData']?.Experian
          date_reported = derogatoryData['lastReportedData']?.Experian
          account_status = derogatoryData['accountStatusData']?.Experian
          account_type = derogatoryData['accountTypeData']?.Experian
          payment_status = derogatoryData['paymentStatusData']?.Experian
          payment_amount = derogatoryData['accountBalanceData']?.Experian
          credit_limit = derogatoryData['creditLimitData']?.Experian
          past_due_amount = derogatoryData['pastDueData']?.Experian
          creditor_remarks = derogatoryData['accountCommentsData']?.Experian
          last_payment = derogatoryData['lastPaymentData']?.Experian
          term_length = derogatoryData['accountTermsData']?.Experian

        } else if(agency_Name === 'Equifax'){
          high_balance = derogatoryData['highCreditData']?.Equifax
          last_date_activity = derogatoryData['lastActiveData']?.Equifax
          date_opened = derogatoryData['dateOpenedData']?.Equifax
          date_reported = derogatoryData['lastReportedData']?.Equifax
          account_status = derogatoryData['accountStatusData']?.Equifax
          account_type = derogatoryData['accountTypeData']?.Equifax
          payment_status = derogatoryData['paymentStatusData']?.Equifax
          payment_amount = derogatoryData['accountBalanceData']?.Equifax
          credit_limit = derogatoryData['creditLimitData']?.Equifax
          past_due_amount = derogatoryData['pastDueData']?.Equifax
          creditor_remarks = derogatoryData['accountCommentsData']?.Equifax
          last_payment = derogatoryData['lastPaymentData']?.Equifax
          term_length = derogatoryData['accountTermsData']?.Equifax

        }
        if (last_date_activity) {
          res = res.replaceAll(/date_of_last_activity/g, `${last_date_activity}`);
        }
        if (date_opened) {
          res = res.replaceAll(/date_opened/g, `${date_opened}`);
        }
        if (high_balance) {
          res = res.replaceAll(/high_balance/g, `${high_balance}`);
        }
        if (date_reported) {
          res = res.replaceAll(/date_reported/g, `${date_reported}`);
        }
        if (account_status) {
          res = res.replaceAll(/account_status/g, `${account_status}`);
        }
        if (payment_status) {
          res = res.replaceAll(/payment_status/g, `${payment_status}`);
        }
        if (payment_amount) {
          res = res.replaceAll(/payment_amount/g, `${payment_amount}`);
        }
        if (account_type) {
          res = res.replaceAll(/account_type/g, `${account_type}`);
        }
        if (credit_limit) {
          res = res.replaceAll(/credit_limit/g, `${credit_limit}`);
        }
        if (past_due_amount) {
          res = res.replaceAll(/past_due_amount/g, `${past_due_amount}`);
        }
        if (creditor_remarks) {
          res = res.replaceAll(/creditor_remarks/g, `${creditor_remarks}`);
        }
        if (last_payment) {
          res = res.replaceAll(/last_payment/g, `${last_payment}`);
        }
        if (term_length) {
          res = res.replaceAll(/term_length/g, `${term_length}`);
        }

        // payment history
        let payment_history = derogatoryData?.latePaymentSummary;

        if(payment_history){
          res = res.replaceAll(/payment_history/g, `${payment_history}`);
        }
      
        //personal data
        const personal_data = disputeCustomValue?.data.aws_id?.process_data_object?.personalInfo || {};
        let name = '';
        let address = '';
        let credit_report_date = '';

        if (personal_data && agency_Name && isAgency) {
          const nameData = personal_data['Name']?.[0]?.[agency_Name] || '';
          const addressData = personal_data['Current Address(es)']?.[0]?.[agency_Name] || '';
          const creditDateData = personal_data['Credit Report Date']?.[0]?.[agency_Name] || '';

          name = nameData;
          address = addressData;
          credit_report_date = creditDateData;

          res = res.replaceAll(/personal_Information/g, `${name} - ${credit_report_date} - ${address}`);
        }
        // report number or reference number 
        const reference_number = disputeCustomValue?.data.aws_id?.process_data_object?.referenceNumberInfo;
        if(reference_number){
          res = res.replaceAll(/\breference_number\b/g, reference_number);
          res = res.replaceAll(/\breport_number\b/g, reference_number);
        }

        // inquiry inquiry
        if (disputeCustomValue?.data?.inquiry) {
          if (disputeCustomValue.data.inquiry['Date of inquiry']) {
            res = res.replaceAll(/inquiries_date/g, disputeCustomValue.data.inquiry['Date of inquiry']);
          }
          if (disputeCustomValue.data.inquiry['Creditor Name']) {
            res = res.replaceAll(/inquiries/g, disputeCustomValue.data.inquiry['Creditor Name']);
          }
        }
        // public record 
        const public_record_data = disputeCustomValue?.data?.public;
        const publicbankName = public_record_data?.bankName || '';
        let publicReference = '';
        let datefiled = '';


        // Safe access to TableData
        const tableData = public_record_data?.TableData || {};
        const referenceData = tableData['Reference#']?.[0] || {};
        const dateFiledData = tableData['Date Filed/Reported']?.[0] || {};

        // Build publicReference by concatenating available values
        sources.forEach(source => {
          const value = referenceData[source];
          if (value) {
            publicReference += (publicReference ? ' | ' : '') + value;
          }
        });

        // Build datefiled by concatenating available values
        sources.forEach(source => {
          const value = dateFiledData[source];
          if (value) {
            datefiled += (datefiled ? ' | ' : '') + value;
          }
        });

        // Only replace if public_record_data exists
        if (public_record_data) {
          res = res.replaceAll(/public_records/g, `${publicbankName}-${publicReference}-${datefiled}`);
        }


        if (disputeCustomValue?.data?.derogatory?.bankName) {
          res = disputeCustomValue?.data?.derogatory?.bankName ? res.replaceAll(/creditor_name/g, disputeCustomValue?.data?.derogatory?.bankName) : res;
          res = disputeCustomValue?.data?.derogatory?.bankName ? res.replaceAll(/\bcreditor\b/g, disputeCustomValue?.data?.derogatory?.bankName) : res;
          disputeCustomValue?.data?.derogatory?.bankName
        }

        if (disputeCustomValue?.data?.inquiry?.['Creditor Name']) {
          res = disputeCustomValue?.data?.inquiry['Creditor Name'] ? res.replaceAll(/creditor_name/g, disputeCustomValue?.data?.inquiry['Creditor Name']) : res;
          res = disputeCustomValue?.data?.inquiry['Creditor Name'] ? res.replaceAll(/\bcreditor\b/g, disputeCustomValue?.data?.inquiry['Creditor Name']) : res;
          disputeCustomValue?.data?.inquiry['Creditor Name']
        }

        text = res.toString();
        // setResponseText(text)
        return text;
      } else {
        let string = text.replaceAll("\n", "<br >");
        // setResponseText(string.toString())
        return string.toString();
      }
    }
  }

  useEffect(() => {
    const fetchData = async (bank) => {
      if (disputeCustomValue?.type === 'derogatory') {
        let BankData = {};
        try {
          const response = await axios.post(
            GET_BANK_ADDRESS,
            {
              userid: user?._id,
              bank_name: bank,
            },
            { headers: { Authorization: 'Bearer ' + token } }
          );
          BankData = response.data.creditorData;
        } catch (error) {
          console.log(error.response.data);
        }

        setToAddressDetailsBank({
          to_address: BankData?.address,
          to_city: BankData?.city,
          to_state: BankData?.state,
          to_zip: BankData?.zip_code,
          to_phone: BankData?.phone,
          to_country: 'US',
        });

        setToAddressDetailsTransUnion({
          to_address: "P.O.Box 2000",
          to_city: "Chester",
          to_state: "Pennsyl vania",
          to_zip: "19016",
          to_phone: "(800) 916-8800",
          to_country: "US",
        });

        setToAddressDetailsExperian({
          to_address: "P.O.Box 4500",
          to_city: "Allen",
          to_state: "Texas",
          to_zip: "75013",
          to_phone: "(888) 397-3742",
          to_country: "US",
        });

        setToAddressDetailsEquifax({
          to_address: "P.O. Box 740256",
          to_city: "Atlanta",
          to_state: "Georgia",
          to_zip: "30374",
          to_phone: "(866) 349-5191",
          to_country: "US",
        });
      } else if (disputeCustomValue?.type === 'inquiry') {
        let BankData = {};
        try {
          const response = await axios.post(
            GET_BANK_ADDRESS,
            {
              userid: user?._id,
              bank_name: bank,
            },
            { headers: { Authorization: 'Bearer ' + token } }
          );
          BankData = response.data.creditorData;
          if (BankData) {
            setToAddressDetailsBank({
              to_address: response.data.creditorData?.address,
              to_city: BankData?.city,
              to_state: BankData?.state,
              to_zip: BankData?.zip_code,
              to_phone: BankData?.phone,
              to_country: 'US',
            });
          }
        } catch (error) {
          console.log(error.response.data);
        }
      }
    };


    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion) {
      setTabTransUnion(true);
      setTabExperian(false);
      setTabEquifax(false);
      setTabBank(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    } else if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian) {
      setTabExperian(true);
      setTabEquifax(false);
      setTabTransUnion(false);
      setTabBank(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    } else if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax) {
      setTabEquifax(true);
      setTabExperian(false);
      setTabTransUnion(false);
      setTabBank(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    } else if (disputeCustomValue?.data?.derogatory?.bankName) {
      setTabBank(true);
      setTabTransUnion(false);
      setTabExperian(false);
      setTabTransUnion(false);
      fetchData(disputeCustomValue?.data?.derogatory?.bankName)
    }

    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion) {
      const TransUnion = replaceFun(isLetterData.letter_discription, "TransUnion");
      setResponseTextTransUnion(TransUnion);
    }
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian) {
      const Experian = replaceFun(isLetterData.letter_discription, "Experian");
      setResponseTextExperian(Experian);
    }
    if (disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax) {
      const Equifax = replaceFun(isLetterData.letter_discription, "Equifax");

      setResponseTextEquifax(Equifax);
    }
    if (disputeCustomValue?.data?.derogatory?.bankName) {
      const Bankdata = replaceFun(isLetterData.letter_discription,);
      setResponseTextBank(Bankdata);
    }

    if (disputeCustomValue?.type === "inquiry") {
      fetchData(disputeCustomValue?.data?.inquiry['Creditor Name']);
      if (isLetterData.letter_discription && !tabAgency) {
        if (disputeCustomValue?.data?.inquiry) {
          if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "Experian") {
            setToAddressDetailsAgency({
              to_address: "P.O.Box 4500",
              to_city: "Allen",
              to_state: "Texas",
              to_zip: "75013",
              to_phone: "(888) 397-3742",
              to_country: "US",
            });
          } else if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "TransUnion") {
            setToAddressDetailsAgency({
              to_address: "P.O.Box 2000",
              to_city: "Chester",
              to_state: "Pennsyl vania",
              to_zip: "19016",
              to_phone: "(800) 916-8800",
              to_country: "US",
            });
          }
          else if (disputeCustomValue?.data?.inquiry['Credit Bureau'] === "Equifax") {
            setToAddressDetailsAgency({
              to_address: "P.O. Box 740256",
              to_city: "Atlanta",
              to_state: "Georgia",
              to_zip: "30374",
              to_phone: "(866) 349-5191",
              to_country: "US",
            });
          }
        }
        setTabBank(true);
        setTabAgency(false);
      } else if (isLetterData.letter_discription && !tabBank) {
        setTabAgency(true);
        setTabBank(false);
      }
      const letterData = replaceFun(isLetterData.letter_discription, disputeCustomValue?.data?.inquiry['Credit Bureau']);
      setResponseTextBank(letterData);
      setResponseTextAgency(letterData);
    }
  }, [isLetterData]);

  const addMultipleLetter = async () => {
    let disputeType = "";
    let disputeItem = "";

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
    }
    let letterType = "Custom";
    try {

      const response = await axios.post(ADD_MULTIPLE_LETTER, {
        isLetterBankName: isLetterDerogratryBankName,
        isLetterAgencyNameEquifax, isLetterAgencyNameExperian, isLetterAgencyNameTransUnion,
        toAddressDetailsBank: toAddressDetailsBank,
        responseTextOpenAiResponseBank: responseTextBank,
        toAddressDetailsEquifax: toAddressDetailsEquifax,
        responseTextOpenAiResponseEquifax: responseTextEquifax,
        toAddressDetailsExperian: toAddressDetailsExperian,
        responseTextOpenAiResponseExperian: responseTextExperian,
        toAddressDetailsTransUnion: toAddressDetailsTransUnion,
        responseTextOpenAiResponseTransUnion: responseTextTransUnion,
        userInquiryDataResponse: userInquiryDataResponse
      },
        { headers: { "Authorization": "Bearer " + token } });
      // closeModal()
      // toast.success(response.data.message);
      // setModalOpen(false);
      // setModalCompleted(true);
      // getDisputeData();
      // setIsDisputeInquiry(null);
      if (response.data.message) {
        userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const handleTextChangeTransUnion = (event) => {
    setResponseTextTransUnion(event);
  };

  const handleTextChangeEquifax = (event) => {
    setResponseTextEquifax(event);
  };


  const handleTextChangeBank = (event) => {
    setResponseTextBank(event);
  };


  const handleTextChangeExperian = (event) => {
    setResponseTextExperian(event);
  };

  const handleResponseBankTextChange = (event) => {
    setResponseTextBank(event);
  }

  const handleResponseAgencyTextChange = (event) => {
    setResponseTextAgency(event);
  }

  const handleTextChange = (data) => {
    // const { name, value } = e.target;
    setLetterData({
      ...isLetterData,
      letter_discription: data,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdetails({ ...userdetails, [name]: value });
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

  const generatePDF = async () => {
    const pdf = new jsPDF();
    let fontSize = 10; // Reduced font size
    const textWidth = 190; // Adjust the text width as needed
    pdf.setFontSize(fontSize);
    // Split the text into lines that fit within the text width
    const lines = pdf.splitTextToSize(parse(isLetterData.letter_discription), textWidth);
    // Calculate the page height
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = 20;
    lines.forEach((line, index) => {
      if (currentY + fontSize > pageHeight - 1) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(15, currentY, line);
      currentY += fontSize; // Reduced line height
    });

    pdf.save('report.pdf');
    setModalOpen(false);
    // handleTabClick('contacts')
  };
  const generatePDF1 = async (isLetterData) => {
    const pdf = new jsPDF();
    let fontSize = 10; // Reduced font size
    const textWidth = 190; // Adjust the text width as needed
    pdf.setFontSize(fontSize);
    // Split the text into lines that fit within the text width
    const lines = pdf.splitTextToSize(parse(isLetterData), textWidth);
    // Calculate the page height
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = 20;
    lines.forEach((line, index) => {
      if (currentY + fontSize > pageHeight - 1) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(15, currentY, line);
      currentY += fontSize; // Reduced line height
    });

    pdf.save('report.pdf');
    setModalOpen(false);
    // handleTabClick('contacts')
  };

  const getActiveLetterGeneratorData = async () => {
    setPageLoader(true);
    try {
      const response = await axios.post(
        LETTERS_GENERATOR_DATA_BY_FILTER,
        {
          userid: user._id,
        },
        {
          params: { search: search, exectMatch: selectedStatus },
          headers: { "Authorization": "Bearer " + token }
        });
      setPageLoader(false);
      setLetterGenerator(response.data)
    } catch (error) {
      setPageLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const closeModal = () => {
    setShowLetter(false)
    setModalOpen(false);
    getDisputeData();
    setSearch("");
  };


  const showLetter = async (id) => {
    try {
      const response = await axios.post(EDIT_LETTERS_GENERATOR, {
        letterId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.letterData) {
        setLetterData(response?.data?.letterData);
        setShowLetter(true);
      }

    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const backStep = () => {
    setShowLetter(false)
  };

  const disputeLetter = async () => {
    try {
      const response = await axios.post(UPDATE_AI_REPORT_STATUS, { id: disputeCustomValue?.data?._id, responseText: isLetterData.letter_discription }, { headers: { "Authorization": "Bearer " + token } });
      setModalOpen(false);
      getDisputeData();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      // setIsDisputeInquiry(null);
      setModalOpen(false);
    }
  };

  const handleToAddressChange = (e) => {
    const { name, value } = e.target;
    setToAddressDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addToAddressData = async (data) => {
    try {
      const response = await axios.post(ADD_TO_ADDRESS_DATA, { toAddressDetails, generateID: data?._id, letterID: data?.dispute_id, }, { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  const addToAddressData1 = async (data, toAddressDetails) => {
    try {
      const response = await axios.post(ADD_TO_ADDRESS_DATA, { toAddressDetails, generateID: data?._id, letterID: data?.dispute_id, }, { headers: { "Authorization": "Bearer " + token } });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  const updateAiGenrateResponse = async () => {
    let disputeType = "";
    let disputeItem = "";

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
    }
    // let disputeType = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? userInquiryDataResponse?.data?.inquiry['Creditor Name'] : userInquiryDataResponse?.data?.derogatory['bankName'];
    let letterType = "Custom";
    const responseResponse = "publicResponseBankCustom"

    try {
      const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { responseResponse, isLetterBankNamePublic, userInquiryDataResponse, responseText: isLetterData.letter_discription }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.newgenerateResponse) {
        await addToAddressData(response?.data?.newgenerateResponse);
      }
      setModalOpen(false);
      setToAddressDetails({
        to_address: "",
        to_city: "",
        to_state: "",
        to_zip: "",
        to_phone: "",
        to_country: "US",
      });
      getDisputeData();
      if (response?.data?.message) {
        userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
      } else {
        userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
      }
    } catch (error) {
      toast.error(error.response || "Something went Wrong");
      setModalOpen(false);
    }
  };

  const updateAiGenrateResponse1 = async () => {
    let disputeType = "";
    let disputeItem = "";

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
    }
    // let disputeType = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? "Inquiry" : "Derogatory";
    // let disputeItem = userInquiryDataResponse?.data?.type && userInquiryDataResponse?.data?.type === "inquiry" ? userInquiryDataResponse?.data?.inquiry['Creditor Name'] : userInquiryDataResponse?.data?.derogatory['bankName'];
    let letterType = "Custom";
    try {
      if (responseTextBank) {

        const responseResponse = "responseBank"
        const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { isLetterBankName, userInquiryDataResponse, responseText: responseTextBank, responseResponse }, { headers: { "Authorization": "Bearer " + token } });
        if (response?.data?.newgenerateResponse) {
          await addToAddressData1(response?.data?.newgenerateResponse, toAddressDetailsBank);
          setToAddressDetailsBank({
            to_address: "",
            to_city: "",
            to_state: "",
            to_zip: "",
            to_phone: "",
            to_country: "US",
          });
        }
        if (response?.data?.message) {
          userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
        } else {
          userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
        }
      }
      if (responseTextAgency) {
        const responseResponse = "responseAgency"
        const response = await axios.post(UPDATE_AI_GENERATE_RESPONSE, { isLetterAgencyName, userInquiryDataResponse, responseText: responseTextAgency, responseResponse }, { headers: { "Authorization": "Bearer " + token } });
        if (response?.data?.newgenerateResponse) {
          await addToAddressData1(response?.data?.newgenerateResponse, toAddressDetailsAgency);
          setToAddressDetailsAgency({
            to_address: "",
            to_city: "",
            to_state: "",
            to_zip: "",
            to_phone: "",
            to_country: "US",
          });
        }
        if (response?.data?.message) {
          userActivity("Generate Letter", "", "", "success", `${letterType} Letter Generate - ${disputeType}-${disputeItem}`);
        } else {
          userActivity("Generate Letter", "", "", "failed", `${letterType} Letter Generate - ${disputeType}-${disputeItem}, Failed!`);
        }
      }

      setModalOpen(false);
      getDisputeData();
    } catch (error) {
      toast.error(error.response || "Something went Wrong");
      setModalOpen(false);
    }
  };

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
    setShowLoader(true);
    if (updateButton === "print_letter") {
      updateReponse('print_letter')
      toast.success("Details Updated Successfully");
    } else if (updateButton === "update_button") {
      updateUser();
      // updateToAddressData();
      updateReponse('update_letter')
      toast.success("Details Updated Successfully");
    } else {
      if (disputeCustomValue?.type === "derogatory") {
        updateUser();
        addMultipleLetter();
      }
      if (disputeCustomValue?.type === "inquiry") {
        updateUser();
        // updateAiGenrateResponse();
        updateAiGenrateResponse1()
      }
      if (disputeCustomValue?.type === "public") {
        updateUser();
        updateAiGenrateResponse();
      }

      const timer = setTimeout(() => {
        navigate(`/send-letter/${id}`);
        toast.success("Details Updated Successfully");
        setShowLoader(false);
      }, 3000);

    }
  };

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
        dob: response.data.ClientData.dob,
        signature: response.data.UserDetails.signature,
        ss_number:response.data.ClientData.SSN,
        previous_mailing_address : response.data.ClientData.previous_mailing_address
      });
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);



  const handleToLetterBankNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterBankName(value);
  };

  const handleToLetterBankNameChangePublic = (e) => {
    const { name, value } = e.target;
    setIsLetterBankNamePublic(value);
  };

  const handleToLetterAgencyNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterAgencyName(value);
  };

  const handleToLetterDerogartryBankNameChange = (e) => {
    const { name, value } = e.target;
    setIsLetterDerogratryBankName(value);
  };

  const handleToLetterAgencyNameChangeTransUnion = (e) => {
    const { name, value } = e.target;
    setIsLetterAgencyNameTransUnion(value);
  };

  const handleToLetterAgencyNameChangeExperian = (e) => {
    const { name, value } = e.target;
    setIsLetterAgencyNameExperian(value);
  };

  const handleToLetterAgencyNameChangeEquifax = (e) => {
    const { name, value } = e.target;
    setIsLetterAgencyNameEquifax(value);
  };

  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <main className="grow">
        <div className="relative">
          <div className="">
            <div className="about-  pb-5 ">
              <div className="container-fluid col-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">
                    Dispute letter
                  </h1>
                  <div>
                    <button onClick={() => ChangeDisputeStep(0)} className="btn-sm tm-background text-white me-2 rounded-full">BACK</button>
                  </div>

                </div>

                <hr></hr>
                <div
                >
                  <div className=" mb-5">
                    {isShowLetter ?
                      <>
                        {disputeCustomValue?.type === "derogatory"
                          ?
                          <>
                            <div className=" mb-5">
                              <div>
                                <ul className="flex flex-wrap m-5">
                                  {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.TransUnion &&
                                    <>
                                      <li className="m-1">
                                        <button onClick={() => { setTabBank(false); setTabTransUnion(true); setTabExperian(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabTransUnion && "tm-background text-white"}`}>TransUnion</button>
                                      </li>
                                    </>
                                  }
                                  {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Experian &&
                                    <>
                                      <li className="m-1">
                                        <button onClick={() => { setTabBank(false); setTabExperian(true); setTabTransUnion(false); setTabEquifax(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabExperian && "tm-background text-white"}`}>Experian</button>
                                      </li>
                                    </>
                                  }
                                  {disputeCustomValue?.data?.derogatory?.lateIndivisualSummary?.Equifax &&
                                    <>
                                      <li className="m-1">
                                        <button onClick={() => { setTabBank(false); setTabEquifax(true); setTabTransUnion(false); setTabExperian(false); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabEquifax && "tm-background text-white"}`}>Equifax</button>
                                      </li>
                                    </>
                                  }

                                  {disputeCustomValue?.data?.derogatory?.bankName &&
                                    <>
                                      <li className="m-1">
                                        <button onClick={() => { setTabEquifax(false); setTabTransUnion(false); setTabExperian(false); setTabBank(true); }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabBank && "tm-background text-white"}`}
                                        >
                                          Bank</button>
                                      </li>
                                    </>
                                  }
                                </ul>
                              </div>
                              <section>
                                <div className="mt-2 mx-5 ">
                                  <div className="grid w-full gap-6 md:grid-cols-2 ">
                                    <div >
                                      <label className="block text-sm font-medium mb-1 ms-1" htmlFor="name">Letter Title:</label>
                                      {tabTransUnion &&
                                        <input
                                          name="isLetterAgencyNameTransUnion"
                                          value={isLetterAgencyNameTransUnion}
                                          onChange={handleToLetterAgencyNameChangeTransUnion}
                                          autoComplete="address"
                                          className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      }

                                      {tabExperian &&
                                        <input
                                          name="isLetterAgencyNameExperian"
                                          value={isLetterAgencyNameExperian}
                                          onChange={handleToLetterAgencyNameChangeExperian}
                                          autoComplete="address"
                                          className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      }

                                      {tabEquifax &&
                                        <input
                                          name="isLetterAgencyNameEquifax"
                                          value={isLetterAgencyNameEquifax}
                                          onChange={handleToLetterAgencyNameChangeEquifax}
                                          autoComplete="address"
                                          className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      }

                                      {tabBank &&
                                        <input
                                          name="isLetterDerogratryBankName"
                                          value={isLetterDerogratryBankName}
                                          onChange={handleToLetterDerogartryBankNameChange}
                                          autoComplete="address"
                                          className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      }
                                    </div>
                                  </div>
                                </div>
                              </section>
                              {showInquireAddressTab === 0 &&
                                <>
                                  {tabTransUnion &&
                                    <>
                                      < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                        <CKEditor
                                          className="rounded-2xl"
                                          rows={14}
                                          editor={ClassicEditor}
                                          data={responseTextTransUnion}
                                          config={{
                                            ckfinder: {
                                              uploadUrl: "" //Enter your upload url
                                            }
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            if (data) {
                                              handleTextChangeTransUnion(data);
                                            }
                                          }}
                                        />
                                      </div>
                                    </>
                                  }
                                  {tabExperian &&
                                    <>
                                      < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                        <CKEditor
                                          className="rounded-2xl"
                                          rows={14}
                                          editor={ClassicEditor}
                                          data={responseTextExperian}
                                          config={{
                                            ckfinder: {
                                              uploadUrl: "" //Enter your upload url
                                            }
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            if (data) {
                                              handleTextChangeExperian(data);
                                            }
                                          }}
                                        />
                                      </div>
                                    </>
                                  }
                                  {tabEquifax &&
                                    <>
                                      < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                        <CKEditor
                                          className="rounded-2xl"
                                          rows={14}
                                          editor={ClassicEditor}
                                          data={responseTextEquifax}
                                          config={{
                                            ckfinder: {
                                              uploadUrl: "" //Enter your upload url
                                            }
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            if (data) {
                                              handleTextChangeEquifax(data);
                                            }
                                          }}
                                        />
                                      </div>
                                    </>
                                  }

                                  {tabBank &&
                                    <>
                                      < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                        <CKEditor
                                          className="rounded-2xl"
                                          rows={14}
                                          editor={ClassicEditor}
                                          data={responseTextBank}
                                          config={{
                                            ckfinder: {
                                              uploadUrl: "" //Enter your upload url
                                            }
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            if (data) {
                                              handleTextChangeBank(data);
                                            }
                                          }}
                                        />
                                      </div>
                                    </>
                                  }
                                </>
                              }


                              {/* {showInquireAddressTab === 1 && */}
                              <>
                                <div className='p-5'>
                                  <hr className='mb-10'></hr>
                                  {userInquiryDataResponse &&
                                    <div className="grid w-full gap-6 md:grid-cols-2  mb-5 mt-5">
                                      <div>
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
                                                <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                <input
                                                  id="address"
                                                  name="address"
                                                  value={userdetails.address}
                                                  onChange={handleChange}
                                                  autoComplete="address"
                                                  className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                              </div>
                                              <div >
                                                <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                <input
                                                  name="city"
                                                  id="city"

                                                  value={userdetails.city}
                                                  onChange={handleChange}
                                                  autoComplete="city"
                                                  className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                              </div>
                                            </div>
                                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                              <div >
                                                <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                <select
                                                  name="state"
                                                  value={userdetails.state}
                                                  onChange={handleChange}
                                                  autoComplete="state"
                                                  className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                >
                                                  <option value="">Select a state</option>
                                                  {/* Map through states to generate options */}
                                                  {states.map((state, index) => (
                                                    <option key={index} value={state}>{state}</option>
                                                  ))}
                                                </select>
                                              </div>
                                              <div >
                                                <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                <input
                                                  name="zip"
                                                  value={userdetails.zip}
                                                  onChange={handleChange}
                                                  autoComplete="zip"
                                                  className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                  maxLength={5}
                                                />
                                              </div>
                                            </div>
                                            <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                              <div >
                                                <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                <input name="phone"
                                                  value={userdetails.phone}
                                                  onChange={handleChange}
                                                  autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                              </div>
                                            </div>
                                            <div className='mt-5 text-center'>
                                              {/* <button onClick={updateUser} className="btn tm-background text-white">Update From Address</button> */}
                                            </div>
                                          </div>
                                        </section>
                                      </div>
                                      {tabTransUnion &&
                                        <>
                                          <div>
                                            <section>
                                              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                              <div className="mt-5">
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Address<span className='text-red-500'>*</span></label>
                                                    <input
                                                      id="to_address"
                                                      name="to_address"
                                                      value={toAddressDetailsTransUnion.to_address || ""}
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="address"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">City<span className='text-red-500'>*</span></label>
                                                    <input
                                                      name="to_city"
                                                      id="to_city"

                                                      value={toAddressDetailsTransUnion.to_city}
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="city"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">State<span className='text-red-500'>*</span></label>
                                                    <select
                                                      name="to_state"
                                                      value={toAddressDetailsTransUnion.to_state}
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="state"
                                                      className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                    >
                                                      <option value="">Select a state</option>
                                                      {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip<span className='text-red-500'>*</span></label>
                                                    <input
                                                      name="to_zip"
                                                      value={toAddressDetailsTransUnion.to_zip}
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="zip"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      maxLength={5}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                    <input name="to_phone"
                                                      value={toAddressDetailsTransUnion.to_phone}
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                    <input name="to_country"
                                                      value="US"
                                                      onChange={handleToAddressChangeTransUnion}
                                                      autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      disabled
                                                    />
                                                  </div>
                                                </div>
                                                <div className='mt-5 text-center'>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </>
                                      }
                                      {tabExperian &&
                                        <>
                                          <div>
                                            <section>
                                              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                              <div className="mt-5">
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                    <input
                                                      id="to_address"
                                                      name="to_address"
                                                      value={toAddressDetailsExperian.to_address || ""}
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="address"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                    <input
                                                      name="to_city"
                                                      id="to_city"

                                                      value={toAddressDetailsExperian.to_city}
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="city"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                    <select
                                                      name="to_state"
                                                      value={toAddressDetailsExperian.to_state}
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="state"
                                                      className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                    >
                                                      <option value="">Select a state</option>
                                                      {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                    <input
                                                      name="to_zip"
                                                      value={toAddressDetailsExperian.to_zip}
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="zip"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      maxLength={5}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                    <input name="to_phone"
                                                      value={toAddressDetailsExperian.to_phone}
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                    <input name="to_country"
                                                      value="US"
                                                      onChange={handleToAddressChangeExperian}
                                                      autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      disabled
                                                    />
                                                  </div>
                                                </div>
                                                <div className='mt-5 text-center'>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </>
                                      }
                                      {tabEquifax &&
                                        <>
                                          <div>
                                            <section>
                                              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                              <div className="mt-5">
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                    <input
                                                      id="to_address"
                                                      name="to_address"
                                                      value={toAddressDetailsEquifax.to_address || ""}
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="address"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                    <input
                                                      name="to_city"
                                                      id="to_city"

                                                      value={toAddressDetailsEquifax.to_city}
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="city"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                    <select
                                                      name="to_state"
                                                      value={toAddressDetailsEquifax.to_state}
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="state"
                                                      className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                    >
                                                      <option value="">Select a state</option>
                                                      {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                    <input
                                                      name="to_zip"
                                                      value={toAddressDetailsEquifax.to_zip}
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="zip"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      maxLength={5}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                    <input name="to_phone"
                                                      value={toAddressDetailsEquifax.to_phone}
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                    <input name="to_country"
                                                      value="US"
                                                      onChange={handleToAddressChangeEquifax}
                                                      autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      disabled
                                                    />
                                                  </div>
                                                </div>
                                                <div className='mt-5 text-center'>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </>
                                      }
                                      {tabBank &&
                                        <>
                                          <div>
                                            <section>
                                              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                              <div className="mt-5">
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                    <input
                                                      id="to_address"
                                                      name="to_address"
                                                      value={toAddressDetailsBank.to_address || ""}
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="address"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                    <input
                                                      name="to_city"
                                                      id="to_city"

                                                      value={toAddressDetailsBank.to_city}
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="city"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                    <select
                                                      name="to_state"
                                                      value={toAddressDetailsBank.to_state}
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="state"
                                                      className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                    >
                                                      <option value="">Select a state</option>
                                                      {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                    <input
                                                      name="to_zip"
                                                      value={toAddressDetailsBank.to_zip}
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="zip"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      maxLength={5}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                    <input name="to_phone"
                                                      value={toAddressDetailsBank.to_phone}
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                    <input name="to_country"
                                                      value="US"
                                                      onChange={handleToAddressChangeBank}
                                                      autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      disabled
                                                    />
                                                  </div>
                                                </div>
                                                <div className='mt-5 text-center'>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </>
                                      }
                                    </div>
                                  }
                                </div>
                                <hr></hr>
                                <div className='text-end mt-5 me-5'>
                                  <button onClick={() => ChangeDisputeStep(0)} className="py-2 px-5 rounded-3xl tm-background text-white me-2">BACK</button>
                                  {showLoader ?
                                    <button className='inline-flex items-center justify-center py-2 px-5 rounded-3xl tm-background text-white  me-2'><Loder /> <span className='ms-1'>NEXT</span></button>
                                    :
                                    <button onClick={updateProfileAndDispute} className="py-2 px-5 rounded-3xl tm-background text-white  me-2">NEXT</button>
                                  }
                                </div>
                              </>
                              {/* } */}
                            </div>
                          </>
                          :
                          <>{disputeCustomValue?.type === "inquiry" ?
                            <>
                              <div className='mb-5'>
                                <div className='flex justify-between m-5'>
                                  <ul className="flex flex-wrap ">
                                    {responseTextBank &&
                                      <>
                                        <li className="m-1">
                                          <button onClick={() => { setTabBank(true), setTabAgency(false) }}
                                            className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabBank && "tm-background text-white"}`}
                                          >Bank</button>
                                        </li>
                                      </>
                                    }
                                    {responseTextAgency &&
                                      <>
                                        <li className="m-1">
                                          <button onClick={() => { setTabBank(false), setTabAgency(true) }} className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm duration-150 ease-in-out ${tabAgency && "tm-background text-white"}`}
                                          >Agency</button>
                                        </li>
                                      </>
                                    }
                                  </ul>
                                </div>
                                <section>
                                  <div className="mt-2 mx-5 ">
                                    <div className="grid w-full gap-6 md:grid-cols-2 ">
                                      <div >
                                        <label className="block text-sm font-medium mb-1 ms-1" htmlFor="name">Letter Title:</label>
                                        {tabBank &&
                                          <input
                                            name="isLetterBankName"
                                            value={isLetterBankName}
                                            onChange={handleToLetterBankNameChange}
                                            autoComplete="address"
                                            className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                            type="text"
                                          />
                                        }
                                        {tabAgency &&
                                          <input
                                            name="isLetterAgencyName"
                                            value={isLetterAgencyName}
                                            onChange={handleToLetterAgencyNameChange}
                                            autoComplete="address"
                                            className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                            type="text"
                                          />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </section>
                                {/* {showInquireAddressTab === 0 && */}
                                <>
                                  {tabBank &&
                                    <div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                      <CKEditor
                                        className="rounded-2xl"
                                        rows={14}
                                        editor={ClassicEditor}
                                        data={responseTextBank}
                                        config={{
                                          ckfinder: {
                                            uploadUrl: "" //Enter your upload url
                                          }
                                        }}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          if (data) {
                                            handleResponseBankTextChange(data);
                                          }
                                        }}
                                      />
                                    </div>
                                  }
                                  {tabAgency &&
                                    <div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                      <CKEditor
                                        className="rounded-2xl"
                                        rows={14}
                                        editor={ClassicEditor}
                                        data={responseTextAgency}
                                        config={{
                                          ckfinder: {
                                            uploadUrl: "" //Enter your upload url
                                          }
                                        }}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          if (data) {
                                            handleResponseAgencyTextChange(data);
                                          }
                                        }}
                                      />
                                    </div>
                                  }
                                  <hr className=' mt-10'></hr>
                                </>
                                {/* } */}

                                <div className='p-5'>
                                  {/* {showInquireAddressTab === 1 && */}
                                  <>
                                    {userInquiryDataResponse &&
                                      <>
                                        <div className="grid w-full gap-6 md:grid-cols-2 mt-4 mb-5">
                                          <div>
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
                                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                    <input
                                                      id="address"
                                                      name="address"
                                                      value={userdetails.address}
                                                      onChange={handleChange}
                                                      autoComplete="address"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                    <input
                                                      name="city"
                                                      id="city"

                                                      value={userdetails.city}
                                                      onChange={handleChange}
                                                      autoComplete="city"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                    <select
                                                      name="state"
                                                      value={userdetails.state}
                                                      onChange={handleChange}
                                                      autoComplete="state"
                                                      className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                    >
                                                      <option value="">Select a state</option>
                                                      {/* Map through states to generate options */}
                                                      {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                      ))}
                                                    </select>
                                                  </div>
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                    <input
                                                      name="zip"
                                                      value={userdetails.zip}
                                                      onChange={handleChange}
                                                      autoComplete="zip"
                                                      className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                      maxLength={5}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                  <div >
                                                    <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                    <input name="phone"
                                                      value={userdetails.phone}
                                                      onChange={handleChange}
                                                      autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                  </div>
                                                </div>
                                                <div className='mt-5 text-center'>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                          {tabBank &&
                                            <div>
                                              <section>
                                                <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                                <div className="mt-5">
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                      <input
                                                        id="to_address"
                                                        name="to_address"
                                                        value={toAddressDetailsBank.to_address || ""}
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="address"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                        type="text"
                                                      />
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                      <input
                                                        name="to_city"
                                                        id="to_city"

                                                        value={toAddressDetailsBank.to_city}
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="city"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                    </div>
                                                  </div>
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                      <select
                                                        name="to_state"
                                                        value={toAddressDetailsBank.to_state}
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="state"
                                                        className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                      >
                                                        <option value="">Select a state</option>
                                                        {states.map((state, index) => (
                                                          <option key={index} value={state}>{state}</option>
                                                        ))}
                                                      </select>
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                      <input
                                                        name="to_zip"
                                                        value={toAddressDetailsBank.to_zip}
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="zip"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                        maxLength={5}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                      <input name="to_phone"
                                                        value={toAddressDetailsBank.to_phone}
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                      <input name="to_country"
                                                        value="US"
                                                        onChange={handleToAddressChangeBank}
                                                        autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                        disabled
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className='mt-5 text-center'>
                                                  </div>
                                                </div>
                                              </section>
                                            </div>
                                          }
                                          {tabAgency &&
                                            <div>
                                              <section>
                                                <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                                <div className="mt-5">
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                      <input
                                                        id="to_address"
                                                        name="to_address"
                                                        value={toAddressDetailsAgency.to_address || ""}
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="address"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                        type="text"
                                                      />
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                      <input
                                                        name="to_city"
                                                        id="to_city"

                                                        value={toAddressDetailsAgency.to_city}
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="city"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                    </div>
                                                  </div>
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                      <select
                                                        name="to_state"
                                                        value={toAddressDetailsAgency.to_state}
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="state"
                                                        className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                      >
                                                        <option value="">Select a state</option>
                                                        {states.map((state, index) => (
                                                          <option key={index} value={state}>{state}</option>
                                                        ))}
                                                      </select>
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                      <input
                                                        name="to_zip"
                                                        value={toAddressDetailsAgency.to_zip}
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="zip"
                                                        className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                        maxLength={5}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                      <input name="to_phone"
                                                        value={toAddressDetailsAgency.to_phone}
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                    </div>
                                                    <div >
                                                      <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                      <input name="to_country"
                                                        value="US"
                                                        onChange={handleToAddressChangeAgency}
                                                        autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                        disabled
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className='mt-5 text-center'>
                                                  </div>
                                                </div>
                                              </section>
                                            </div>
                                          }
                                        </div>
                                        <hr></hr>
                                        <div className='text-end mt-5'>
                                          {isShowLetter &&
                                            <button onClick={backStep} className="py-2 px-5 rounded-3xl tm-background text-white me-2">BACK</button>
                                          }

                                          {updateButton === "print_letter" &&

                                            <button onClick={() => updateReponse('print_letter')} className="ms-2 bg-green-500 text-white py-2 px-4 rounded">Print Letter</button>

                                          }
                                          {/* {updateButton != "print_letter" && updateButton != "update_letter" &&
                                              <>
                                                {tabBank &&
                                                  <button onClick={() => generatePDF1(responseTextBank)} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                                }
                                                {tabAgency &&
                                                  <button onClick={() => generatePDF1(responseTextAgency)} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                                }
                                              </>
                                            } */}{showLoader ?
                                            <button className='inline-flex items-center justify-center py-2 px-5 rounded-3xl tm-background text-white  me-2'><Loder /> <span className='ms-1'>NEXT</span></button>
                                            :
                                            <button onClick={updateProfileAndDispute} className="py-2 px-5 rounded-3xl tm-background text-white  me-2">NEXT</button>
                                          }
                                        </div>
                                      </>
                                    }
                                  </>
                                  {/* } */}
                                </div>

                              </div>
                            </>
                            :
                            <>
                              {/* {showPublicAddressTab === 0 && */}
                              <>
                                <section>
                                  <div className="mt-2 mx-5 ">
                                    <div className="grid w-full gap-6 md:grid-cols-2 ">
                                      <div >
                                        <label className="block text-sm font-medium mb-1 ms-1" htmlFor="name">Letter Title:</label>
                                        <input
                                          name="isLetterBankNamePublic"
                                          value={isLetterBankNamePublic}
                                          onChange={handleToLetterBankNameChangePublic}
                                          autoComplete="address"
                                          className="normal-case form-input rounded-2xl border-none bg-gray-200 w-full"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                                <div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                  <CKEditor
                                    className="rounded-2xl"
                                    rows={14}
                                    editor={ClassicEditor}
                                    data={replaceFun(isLetterData.letter_discription)}
                                    config={{
                                      ckfinder: {
                                        uploadUrl: "" //Enter your upload url
                                      }
                                    }}
                                    onChange={(event, editor) => {
                                      const data = editor.getData();
                                      if (data) {
                                        handleTextChange(data);
                                      }
                                    }}
                                  />
                                </div>
                                {/* <div className='text-end pe-5'>
                                    <button onClick={backStep} className="py-2 px-5 rounded-3xl tm-background text-white me-2">BACK</button>
                                    <button onClick={() => setshowPublicAddressTab(1)} className="btn tm-background text-white rounded">NEXT</button>
                                  </div> */}
                              </>
                              {/* } */}
                              {/* {showPublicAddressTab === 1 && */}
                              <>
                                <div className='p-5'>
                                  <hr className=''></hr>

                                  {userInquiryDataResponse &&
                                    <>
                                      <div className="grid w-full gap-6 md:grid-cols-2 mt-5 mb-5">
                                        <div>
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
                                                  <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                  <input
                                                    id="address"
                                                    name="address"
                                                    value={userdetails.address}
                                                    onChange={handleChange}
                                                    autoComplete="address"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                </div>
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                  <input
                                                    name="city"
                                                    id="city"

                                                    value={userdetails.city}
                                                    onChange={handleChange}
                                                    autoComplete="city"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                </div>
                                              </div>
                                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                  <select
                                                    name="state"
                                                    value={userdetails.state}
                                                    onChange={handleChange}
                                                    autoComplete="state"
                                                    className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                  >
                                                    <option value="">Select a state</option>
                                                    {/* Map through states to generate options */}
                                                    {states.map((state, index) => (
                                                      <option key={index} value={state}>{state}</option>
                                                    ))}
                                                  </select>
                                                </div>
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                  <input
                                                    name="zip"
                                                    value={userdetails.zip}
                                                    onChange={handleChange}
                                                    autoComplete="zip"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                    maxLength={5}
                                                  />
                                                </div>
                                              </div>
                                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                  <input name="phone"
                                                    value={userdetails.phone}
                                                    onChange={handleChange}
                                                    autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                </div>
                                              </div>
                                              <div className='mt-5 text-center'>
                                              </div>
                                            </div>
                                          </section>
                                        </div>
                                        <div>
                                          <section>
                                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Send To Address:</h2>
                                            <div className="mt-5">
                                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="name">Address</label>
                                                  <input
                                                    id="to_address"
                                                    name="to_address"
                                                    value={toAddressDetails.to_address || ""}
                                                    onChange={handleToAddressChange}
                                                    autoComplete="address"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full"
                                                    type="text"
                                                  />
                                                </div>
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">City</label>
                                                  <input
                                                    name="to_city"
                                                    id="to_city"

                                                    value={toAddressDetails.to_city}
                                                    onChange={handleToAddressChange}
                                                    autoComplete="city"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                </div>
                                              </div>
                                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">State</label>
                                                  <select
                                                    name="to_state"
                                                    value={toAddressDetails.to_state}
                                                    onChange={handleToAddressChange}
                                                    autoComplete="state"
                                                    className="form-select rounded-2xl border-none bg-gray-200 w-full"
                                                  >
                                                    <option value="">Select a state</option>
                                                    {states.map((state, index) => (
                                                      <option key={index} value={state}>{state}</option>
                                                    ))}
                                                  </select>
                                                </div>
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Zip</label>
                                                  <input
                                                    name="to_zip"
                                                    value={toAddressDetails.to_zip}
                                                    onChange={handleToAddressChange}
                                                    autoComplete="zip"
                                                    className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                    maxLength={5}
                                                  />
                                                </div>
                                              </div>
                                              <div className="grid w-full gap-6 md:grid-cols-2 mt-4">
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Phone</label>
                                                  <input name="to_phone"
                                                    value={toAddressDetails.to_phone}
                                                    onChange={handleToAddressChange}
                                                    autoComplete="phone" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text" />
                                                </div>
                                                <div >
                                                  <label className="block text-sm font-medium mb-1" htmlFor="business-id">Country</label>
                                                  <input name="to_country"
                                                    value="US"
                                                    onChange={handleToAddressChange}
                                                    autoComplete="country" className="form-input rounded-2xl border-none bg-gray-200 w-full" type="text"
                                                    disabled
                                                  />
                                                </div>
                                              </div>
                                              <div className='mt-5 text-center'>
                                              </div>
                                            </div>
                                          </section>
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
                                              <button onClick={generatePDF} className="me-2 btn tm-background text-white rounded">Download Dispute letter</button>
                                            </>
                                          } */}
                                        {showLoader ?
                                          <button className='inline-flex items-center justify-center py-2 px-5 rounded-3xl tm-background text-white  me-2'><Loder /> <span className='ms-1'>NEXT</span></button>
                                          :
                                          <button onClick={updateProfileAndDispute} className="py-2 px-5 rounded-3xl tm-background text-white  me-2">NEXT</button>
                                        }
                                      </div>
                                    </>
                                  }

                                </div>
                              </>
                              {/* } */}
                            </>
                          }
                          </>
                        }

                      </>
                      :
                      <>
                        <div className=" shownav overflow-x-auto mt-3 px-2">
                          <header className="flex justify-between	 px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                            <h2 className="font-semibold text-slate-100 dark:text-slate-100">Custom Letters</h2>
                            <input
                              className=' bg-gray-100 border-none text-gray-900 text-sm rounded-full block ps-3 p-1.5  dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                              type="text"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search..."
                            />
                          </header>
                          <table className="table-auto w-full dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20 dark:border-slate-700">
                              <tr>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-left">Letter Title</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-left">Category</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-left">Status</div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}

                            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                              {isLetterGenerator.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    {data.is_deleted != 1 && data?.status === "active" &&
                                      <>
                                        <td className="text-green-600	 px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize cursor-pointer" onClick={() => showLetter(data?._id)}>
                                          {data?.letter_title}
                                        </td>
                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                          {data?.category ? data?.category : "-"}
                                        </td>
                                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                          {data?.status ? data?.status : "-"}
                                        </td>
                                      </>
                                    }
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className='hidenav'>
                          <table className="table-auto w-full dark:text-slate-300">
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                              {isLetterGenerator?.map((val, i) => (
                                <React.Fragment key={i}>
                                  {val.is_deleted != 1 && val?.status === "active" &&
                                    <>
                                      <tr>
                                        <th className="py-3 px-5 w-1/3">
                                          <div className="font-semibold text-left">Letter Title</div>
                                        </th>
                                        <td className="py-3 px-5 w-2/3 break-words">
                                          <div className="text-left text-green-500" onClick={() => showLetter(val?._id)} >{val?.letter_title}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5 w-1/3">
                                          <div className="font-semibold text-left">Category</div>
                                        </th>
                                        <td className="py-3 px-5 w-2/3 break-words">
                                          <div className="text-left">{val?.category ? val?.category : "-"}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="py-3 px-5 w-1/3">
                                          <div className="font-semibold text-left">Status</div>
                                        </th>
                                        <td className="py-3 px-5 w-2/3 break-words">
                                          <div className="text-left"> {val?.status ? val?.status : "-"}</div>
                                        </td>
                                      </tr>
                                    </>
                                  }
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>

                        </div>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
    </>
  );
}

export default AiCustomReportPage;
