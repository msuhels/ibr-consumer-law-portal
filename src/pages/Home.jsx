import React, { useState, useEffect } from 'react'
import AgencyHeader from '../partials/AgencyHeader'
import SubNavbar from '../components/SubNavbar'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner'
import Footer from '../partials/Footer'
import Header from '../partials/Header';
import { ADD_CLIENT_DATA, GET_AGENTS_AND_AGENCY_AGENT, ADD_USER_TODO_TASK, GET_TODO_TASK_LIST_OF_USER, UPDATE_TASK_STATUS, GET_CLIENT_ACTIVITY } from "../API/api"
import ModalBasic from '../components/ModalBasic';
import { WithContext as ReactTags } from 'react-tag-input';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import moment from 'moment'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const Home = () => {
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [showTodoInput, setshowTodoInput] = useState(false);
    const [todoText, setTodoText] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [agentData, setAgentData] = useState(null);
    const [todoTaskList, setTodoTaskList] = useState([]);
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [clientActivitylogs, setClientActivitylogs] = useState([]);
    const [isAgreementStep, setIsAgreementStep] = useState(false);
    const [setLoader, setsetLoader] = useState(false);
    const [isAffiliateData, setIsAffiliateData] = useState([]);
    const [isSubmitLoader, setIsSubmitLoader] = useState(false);


    const [defaultContent, setDefaultContent] = useState(`
    <div>
    
      I, Client, hereby enter into the following agreement with.
    </p>
    
      hereby agrees to perform the following:
    </p>
    
    
      To evaluate Customer's current credit reports as listed with applicable consumer reporting agencies and to identify inaccurate, erroneous, false, or obsolete information. To advise Customer as to the necessary steps to be taken on the part of Customer in conjunction with Our Company, to dispute any inaccurate, erroneous, false, or obsolete information contained in the Customer's credit reports.
    </p>
    
    
      To prepare all necessary correspondence in dispute of inaccurate, erroneous, false, or obsolete information in customer's credit reports.
    </p>
    
    
      To review credit profile status from consumer reporting such as Experian, Equifax, and Transunion.  Consulting, coaching, and monitoring services are conducted by personal meetings, webinars, video conferencing, telephone, email, or by any other form of communication during normal business hours.
    </p>
    
    
      In exchange, I, the Client, agree to pay the following fees as outlined in the following fee schedule:
    </p>
    
    
      (As discussed)
    </p>
    
    
      Authorization for Credit Repair Action
    </p>
    
    
    
      1.  I,  Client, to make, receive, sign, endorse, execute, acknowledge, deliver, and possess such applications, correspondence, contracts, or agreements, as necessary to improve my credit. Such instruments in writing of whatever nature shall only be effective for any or all of the three consumer reporting agencies which are TransUnion, Experian, Equifax, and any other reporting agencies or creditors listed, as may be necessary or proper in the exercise of the rights and powers herein granted.
    </p>
    
    
      2. This authorization may be revoked by the undersigned at any time by giving written notice to the party authorized herein. Any activity made before revocation in reliance upon this authorization shall not constitute a breach of rights of the client. If not earlier revoked, this authorization will automatically expire twelve months from the date of signature.
    </p>
    
    
      3. The party named above to receive the information is not authorized to make any further release or disclosure of the information received. This authorization does not authorize the release or disclosure of any information except as provided herein.
    </p>
    
    
      4. I grant you authority to do, take, and perform, all acts and things whatsoever requisite, proper, or necessary to be done, in the exercise of repairing my credit with the three consumer reporting agencies, which are TransUnion, Experian, Equifax, and any other reporting agencies or creditor’s listed, as fully for all intents and purposes as I might or could do if personally present.
    </p>
    
    
      5. I hereby release, you from all and all matters of actions, causes of action, suits, proceedings, debts, dues, contracts, judgments, damages, claims, and demands whatsoever in law or equity, for or because of any matter, cause, or thing whatsoever as based on the circumstances of this contract.
    </p>
    
    
      Consumer Credit File Rights Under State and Federal Law
    </p>
    
    
      You have a right to dispute inaccurate information in your consumer report by contacting the consumer reporting agencies directly. However, neither you nor a credit repair company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported up to 10 years.
    </p>
    
    
      You have a right to obtain a copy of your credit report from a consumer reporting agency. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your consumer reporting agencies within the preceding 60 days. The consumer reporting agency must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your consumer reporting agency if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your consumer reporting agency due to fraud.
    </p>
    
    
      You have a right to sue a credit repair organization that violated the Credit Repair Organization Act. This law prohibits deceptive practices by credit repair organizations.
    </p>
    
    
      You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.
    </p>
    
    
      consumer reporting agency are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.
    </p>
    
    
      You may on your own, notify a consumer reporting agency in writing that you dispute the accuracy of information in your credit file. The consumer reporting agency must then reinvestigate and modify or remove inaccurate or incomplete information. The consumer reporting agency may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the consumer reporting agency.                          </p>
    
    
      If the consumer reporting agencies reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the consumer reporting agencies to be kept in your file, explaining why you think the record is inaccurate. The consumer reporting agencies must include a summary of your statement about disputed information with any report it issues about you.
    </p>
    
    
      The Federal Trade Commission regulates credit bureaus and consumer reporting agencies organizations. For more information contact: The Public Reference Branch Federal Trade Commission Washington, D.C. 20580.
    </p>
    
    
      Notice of Right to Cancel
    </p>
    
    
      ''You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.
      
      
      ''To cancel this contract, contact the consumer reporting  agency, before midnight on the 3rd day which begins after the date you have signed this contract stating ''I hereby cancel this transaction, (date) (purchaser’s signature).’’
      
      
      Please acknowledge your receipt of this notice by electronically signing the form indicated below.
      
      
      Acknowledgment of Receipt of Notice
      
      
      I, the Client,  hereby acknowledge with my digital signature, receipt of the Notice of Right to Cancel. I confirm the fact that I agree and understand what I am signing, and acknowledge that I have received a copy of my Consumer Credit File Rights.
      
      
      *Digital Signatures: In 2000, the U.S. Electronic Signatures in Global and National Commerce (ESIGN) Act established electronic records and signatures as legally binding, having the same legal effects as traditional paper documents and handwritten signatures. Read more at the FTC website: http://www.ftc.gov/os/2001/06/esign7.html
    </p>
    
    
  </div>
    `);


    const handleAgreementTab = (e) => {
        if (e === true) {
          // Validate if all required fields are filled
          const requiredFields = {
            name: 'Name',
            email: 'Email',
            dob: 'Date of Birth',
            address: 'Address',
            SSN: 'SSN',
            city: 'City',
            state: 'State',
            zip: 'ZIP Code',
            phone: 'Phone',
            status: 'Status',
            start_date: 'Start Date',
          };
    
          for (const [key, label] of Object.entries(requiredFields)) {
            if (!formData[key] || formData[key].trim() === '') {
              toast.error(`${label} is required`);
              return;
            }
          }
    
          setIsAgreementStep(e);
        } else {
          setIsAgreementStep(e);
        }
      };


    const handleCheckboxChangee = async (index, isChecked, id) => {
        console.log(isChecked, id);
        const updatedTasks = todoTaskList.map((task, i) =>
            i === index ? { ...task, status: isChecked ? "1" : "0" } : task
        );
        setTodoTaskList(updatedTasks);
        try {
            let statusval = "";
            if (isChecked === true) {
                statusval = "1"
            } else {
                statusval = "0"
            }
            const response = await axios.post(UPDATE_TASK_STATUS, { statusval, id }, { headers: { "Authorization": "Bearer " + token } });
            toast.success(response.data.message || "Task status updated successfully");
            getTodoTaskList();

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went Wrong");
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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        address: '',
        SSN: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
        phone: '',
        status: '',
        previous_mailing_address: '',
        previous_city: '',
        previous_state: '',
        previous_zip_code: '',
        previous_country: 'US',
        start_date: '',
        assigned_to: [],
        referred_by: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

      
    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
    };

    const handleTodoText = (e) => {
        setTodoText(e.target.value);
    };

    const handleTodoSubmit = async (e) => {
        e.preventDefault();
        if (!todoText || todoText === "") {
            return toast.error("Please enter task");
        }
        try {
            const response = await axios.post(ADD_USER_TODO_TASK, { user_id: user?._id, todoText: todoText }, { headers: { "Authorization": "Bearer " + token } });
            toast.success(response.data.message || "Task added successfully");
            getTodoTaskList();
            setTodoText("");
        } catch (error) {
            setTodoText("");
            toast.success(response.data.error || "Something went wrong while adding the task");
        }
    };

    const getTodoTaskList = async () => {
        try {
            const response = await axios.post(GET_TODO_TASK_LIST_OF_USER, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
            setTodoTaskList(response.data);
        } catch (error) {
            console.log("Something went Wrong");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(ADD_CLIENT_DATA, { formData },
                { headers: { "Authorization": "Bearer " + token } });
            setFeedbackModalOpen(false);
            toast.success(response.data.message || "Client added successfully");
            setFormData({
                name: '',
                email: '',
                dob: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                country: 'US',
                phone: '',
                SSN: '',
                status: '',
                previous_mailing_address: '',
                previous_city: '',
                previous_state: '',
                previous_zip_code: '',
                previous_country: 'US',
                start_date: '',
                assigned_to: [],
                referred_by: '',
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went Wrong");
        }
    };

    useEffect(() => {
        getTodoTaskList();
        getAgentsData();
        getClientActivities();
    }, []);

    const getAgentsData = async () => {
        try {
            const response = await axios.post(GET_AGENTS_AND_AGENCY_AGENT, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
            setAgentData(response.data);
            let sug = [];
            response?.data?.agency_agent?.map((val) => {
                sug.push({ id: val._id, text: val.name });
            })
            setSuggestions(sug);
        } catch (error) {
            console.log("Something went Wrong");
        }
    };

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
    };

    const getClientActivities = async () => {
        setsetLoader(true);
        try {
            const response = await axios.post(GET_CLIENT_ACTIVITY, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
            setClientActivitylogs(response.data)
            setsetLoader(false);
        } catch (error) {
            console.log("Something went Wrong");
            setsetLoader(false);
        }
    };

    return (
        <>
            {setLoader &&
                <div className="loader-container" style={{ zIndex: "9999" }}>
                    <div className="loader"></div>
                </div>
            }
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* <AgencyHeader/> */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow mb-16 text-[#080D18] pt-1">
                    <SubNavbar />
                    <div className='py-8 mx-4 sm:mx-8 border-b border-[#DDE0E3]'>
                        <div className='text-3xl'><span className='font-bold'>Hello,{" "}</span>Welcome Back!</div>
                        <div className='py-4'>
                            <WelcomeBanner />
                        </div>
                    </div>
                    <div className='mx-4 sm:mx-8 border-b border-[#DDE0E3] py-6 text-[#080D18]'>
                        <div className='text-[28px] font-semibold'>Quick Start</div>
                        <div className='pt-8 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <div className='flex p-1 bg-[#F8F9F9] rounded cursor-pointer' onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>
                                <div className='m-5 px-7 py-3 custom-bg flex items-center'>1</div>
                                <div className='sm:my-5'>
                                    <h3 className='text-[24px] font-bold'>Add new client</h3>
                                    <p className='text-md'>Sign up a new client and add to database</p>
                                </div>
                            </div>
                            <Link to={`/clients/`}>
                                <div className='flex p-1 bg-[#F8F9F9] rounded'>
                                    <div className='m-5 px-6 py-3 custom-bg flex items-center'>2</div>
                                    <div className='sm:my-5'>
                                        <h3 className='text-[24px] font-bold'>Select an existing client</h3>
                                        <p className='text-md'>Work with an existing client</p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>

                    <div className='pb-8 mx-4 sm:mx-8 border-b border-[#DDE0E3] sm:flex gap-8'>
                        <div className='border-3 border-[#F8F9F9] px-4 lg:px-8 md:px-8 sm:px-4 py-8 mt-8 sm:flex gap-8 '>
                            {/* first Box */}
                            <div>
                                <Link to={`/profile/`}>
                                    <div className='flex items-center pb-4'>
                                        <div className='pr-4'>
                                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black" />
                                                <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black" />
                                            </  svg>
                                        </div>
                                        <div className=''>
                                            <h3 className='text-[24px] font-bold'>My Company</h3>
                                            {/* <p className='text-xl'>Configure users, permissions and billings</p> */}
                                        </div>
                                    </div>
                                </Link>
                                <a href='https://youtu.be/bMfSF9Xubnw' target="_blank"
                                >
                                    <div className='flex items-center py-4'>
                                        <div className='pr-4'>
                                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M27.7615 4.756L24.2615 2.9185C21.1885 1.30675 19.652 0.5 18 0.5C16.348 0.5 14.8115 1.305 11.7385 2.9185L11.1768 3.21425L26.792 12.1375L33.82 8.62C32.6895 7.339 30.866 6.38175 27.7615 4.7525M35.059 10.937L28.0625 14.437V19.75C28.0625 20.0981 27.9242 20.4319 27.6781 20.6781C27.4319 20.9242 27.0981 21.0625 26.75 21.0625C26.4019 21.0625 26.0681 20.9242 25.8219 20.6781C25.5758 20.4319 25.4375 20.0981 25.4375 19.75V15.7495L19.3125 18.812V35.332C20.569 35.0188 21.9988 34.2698 24.2615 33.0815L27.7615 31.244C31.5257 29.2683 33.4087 28.2813 34.4552 26.505C35.5 24.7305 35.5 22.5203 35.5 18.105V17.9003C35.5 14.5875 35.5 12.5155 35.059 10.937ZM16.6875 35.332V18.812L0.941 10.937C0.5 12.5155 0.5 14.5875 0.5 17.8968V18.1015C0.5 22.5203 0.5 24.7305 1.54475 26.505C2.59125 28.2813 4.47425 29.27 8.2385 31.2458L11.7385 33.0815C14.0013 34.2698 15.431 35.0188 16.6875 35.332ZM2.18 8.62175L18 16.5318L23.9692 13.548L8.41875 4.6615L8.2385 4.756C5.13575 6.3835 3.3105 7.34075 2.18 8.6235" fill="black" />
                                            </svg>
                                        </div>
                                        <div className=''>
                                            <h3 className='text-[24px] font-bold'>Join Our Credit Repair Made Easy
                                                <br className="hidden md:block" />
                                                Academy & Community
                                            </h3>
                                            {/* <p className='text-xl'>Configure users, permissions and billings</p> */}
                                        </div>
                                    </div>
                                </a>
                                <Link to={`/learning-hub`}>
                                    <div className='flex items-center py-4'>
                                        <div className='pr-4'>
                                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black" />
                                                <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black" />
                                            </  svg>
                                        </div>
                                        <div className=''>
                                            <h3 className='text-[24px] font-bold'>Free Live Software Classes</h3>
                                            {/* <p className='text-xl'>Configure users, permissions and billings</p> */}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* second box */}
                            <div>
                                <a href='https://www.consumerlawsecretsuniversity.com/welcome' target="_blank"
                                >
                                    <div className='flex items-center py-4 lg:py-0 md:py-0 sm:py-4 pb-4 lg:pb-4 md:pb-4 sm:pb-0'>
                                        <div className='pr-4'>
                                            <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M39.6875 8.50002V9.81252C39.6875 9.98657 39.6184 10.1535 39.4953 10.2766C39.3722 10.3996 39.2053 10.4688 39.0312 10.4688H37.0625V11.4531C37.0625 11.9968 36.6217 12.4375 36.0781 12.4375H3.92188C3.37825 12.4375 2.9375 11.9968 2.9375 11.4531V10.4688H0.96875C0.794702 10.4688 0.627782 10.3996 0.504711 10.2766C0.38164 10.1535 0.3125 9.98657 0.3125 9.81252V8.50002C0.312501 8.37019 0.351012 8.24328 0.42316 8.13534C0.495309 8.0274 0.597852 7.94329 0.717816 7.89365L19.7491 0.674897C19.9097 0.608368 20.0903 0.608368 20.2509 0.674897L39.2822 7.89365C39.4021 7.94329 39.5047 8.0274 39.5768 8.13534C39.649 8.24328 39.6875 8.37019 39.6875 8.50002ZM37.7188 33.4375H2.28125C1.19393 33.4375 0.3125 34.3189 0.3125 35.4063V36.7188C0.3125 36.8928 0.38164 37.0597 0.504711 37.1828C0.627782 37.3059 0.794702 37.375 0.96875 37.375H39.0312C39.2053 37.375 39.3722 37.3059 39.4953 37.1828C39.6184 37.0597 39.6875 36.8928 39.6875 36.7188V35.4063C39.6875 34.3189 38.8061 33.4375 37.7188 33.4375ZM6.875 13.75V29.5H3.92188C3.37825 29.5 2.9375 29.9408 2.9375 30.4844V32.125H37.0625V30.4844C37.0625 29.9408 36.6217 29.5 36.0781 29.5H33.125V13.75H27.875V29.5H22.625V13.75H17.375V29.5H12.125V13.75H6.875Z" fill="black" />
                                            </svg>
                                        </div>
                                        <div className=''>
                                            <h3 className='text-[24px] font-bold'>Enroll In Consumer Law Secrets <br className="hidden md:block" />University</h3>
                                            {/* <p className='text-xl'>Accept credit card payments from clients</p> */}
                                        </div>
                                    </div>
                                </a>

                                <Link to={`/chat-messages/`}>
                                    <div className='flex items-center py-4'>
                                        <div className='pr-4'>
                                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_1780_2264)">
                                                    <path d="M28 12.25C28 14.5706 27.0781 16.7962 25.4372 18.4372C23.7962 20.0781 21.5706 21 19.25 21C16.9294 21 14.7038 20.0781 13.0628 18.4372C11.4219 16.7962 10.5 14.5706 10.5 12.25C10.5 9.92936 11.4219 7.70376 13.0628 6.06282C14.7038 4.42187 16.9294 3.5 19.25 3.5C21.5706 3.5 23.7962 4.42187 25.4372 6.06282C27.0781 7.70376 28 9.92936 28 12.25ZM19.25 22.75C23.443 22.75 27.2562 23.9645 30.0615 25.676C31.4615 26.53 32.6585 27.538 33.523 28.6335C34.3735 29.7097 35 30.9977 35 32.375C35 33.8538 34.2808 35.0193 33.2447 35.8505C32.2647 36.638 30.9715 37.1595 29.5977 37.5235C26.8363 38.2533 23.1507 38.5 19.25 38.5C15.3492 38.5 11.6637 38.255 8.90225 37.5235C7.5285 37.1595 6.23525 36.638 5.25525 35.8505C4.2175 35.0175 3.5 33.8538 3.5 32.375C3.5 30.9977 4.1265 29.7097 4.977 28.6318C5.8415 27.538 7.03675 26.5317 8.4385 25.6742C11.2438 23.9662 15.0588 22.75 19.25 22.75ZM36.75 22.75C37.196 22.7505 37.6251 22.9213 37.9494 23.2275C38.2737 23.5337 38.4689 23.9522 38.495 24.3974C38.5212 24.8427 38.3763 25.2812 38.09 25.6232C37.8038 25.9653 37.3977 26.1851 36.9548 26.2378L36.75 26.25H35C34.554 26.2495 34.1249 26.0787 33.8006 25.7725C33.4763 25.4663 33.2811 25.0478 33.2549 24.6026C33.2288 24.1573 33.3737 23.7188 33.66 23.3768C33.9462 23.0347 34.3523 22.8149 34.7952 22.7622L35 22.75H36.75ZM31.5 19.25C31.5 18.7859 31.6844 18.3408 32.0126 18.0126C32.3407 17.6844 32.7859 17.5 33.25 17.5H36.75C37.2141 17.5 37.6592 17.6844 37.9874 18.0126C38.3156 18.3408 38.5 18.7859 38.5 19.25C38.5 19.7141 38.3156 20.1592 37.9874 20.4874C37.6592 20.8156 37.2141 21 36.75 21H33.25C32.7859 21 32.3407 20.8156 32.0126 20.4874C31.6844 20.1592 31.5 19.7141 31.5 19.25ZM31.5 12.25C31.0359 12.25 30.5907 12.4344 30.2626 12.7626C29.9344 13.0908 29.75 13.5359 29.75 14C29.75 14.4641 29.9344 14.9092 30.2626 15.2374C30.5907 15.5656 31.0359 15.75 31.5 15.75H36.75C37.2141 15.75 37.6592 15.5656 37.9874 15.2374C38.3156 14.9092 38.5 14.4641 38.5 14C38.5 13.5359 38.3156 13.0908 37.9874 12.7626C37.6592 12.4344 37.2141 12.25 36.75 12.25H31.5Z" fill="black" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1780_2264">
                                                        <rect width="42" height="42" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className=''>
                                            <h3 className='text-[24px] font-bold'>Contacts</h3>
                                            {/* <p className='text-xl'>Configure users, permissions and billings</p> */}
                                        </div>
                                    </div>
                                </Link>
                                <div className='flex items-center pt-4'>
                                    <div className='pr-4'>
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 14H3.5V35C3.5 35.9283 3.86875 36.8185 4.52513 37.4749C5.1815 38.1313 6.07174 38.5 7 38.5H28V35H7V14Z" fill="black" />
                                            <path d="M35 3.5H14C13.0717 3.5 12.1815 3.86875 11.5251 4.52513C10.8687 5.1815 10.5 6.07174 10.5 7V28C10.5 28.9283 10.8687 29.8185 11.5251 30.4749C12.1815 31.1313 13.0717 31.5 14 31.5H35C35.9283 31.5 36.8185 31.1313 37.4749 30.4749C38.1313 29.8185 38.5 28.9283 38.5 28V7C38.5 6.07174 38.1313 5.1815 37.4749 4.52513C36.8185 3.86875 35.9283 3.5 35 3.5ZM19.25 24.5V10.5L31.5 17.5L19.25 24.5Z" fill="black" />
                                        </svg>
                                    </div>
                                    <a href='https://www.youtube.com/@DaraineDelevante?sub_confirmation=1' target="_blank"
                                    > <div className=''>
                                            <h3 className='text-[24px] font-bold'>Free Videos And Resoucres</h3>
                                            {/* <p className='text-xl'>Configure users, permissions and billings</p> */}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='grow border-3 border-[#F8F9F9] px-8 mt-8 py-8 bg-[#f8f6f4]'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-bold text-xl'>Personal Tasks</h3>
                                {showTodoInput ?
                                    <button onClick={(e) => { handleTodoSubmit(e) }} className="flex items-center px-5 py-2  tm-background text-white rounded-full" aria-controls="feedback-modal" >
                                        <svg className="w-4 h-4 fill-current opacity-80 shrink-0" viewBox="0 0 16 16">
                                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                        </svg>
                                        <span className="ml-2">Add

                                        </span>
                                    </button>
                                    :
                                    <button onClick={(e) => { e.stopPropagation(); setshowTodoInput(true); }} className="flex items-center px-5 py-2  tm-background text-white rounded-full" aria-controls="feedback-modal" >
                                        <svg className="w-4 h-4 fill-current opacity-80 shrink-0" viewBox="0 0 16 16">
                                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                        </svg>
                                        <span className="ml-2">New

                                        </span>
                                    </button>
                                }


                            </div>
                            {showTodoInput &&
                                <div>
                                    <input
                                        id="default"
                                        className="form-input w-full mt-3"
                                        type="text"
                                        required
                                        name='todoText'
                                        value={todoText}
                                        onChange={handleTodoText}
                                    />
                                </div>
                            }

                            <div className='flex flex-col gap-3 my-4'>
                                {todoTaskList.slice(0, 5).map((task, index) => {
                                    const truncatedTask = task.todo.length > 40 ? task.todo.slice(0, 40) + '...' : task.todo;
                                    return (
                                        <div key={index} className='text-xl'>
                                            <input
                                                type='checkbox'
                                                checked={task.status === "1"}
                                                onChange={(e) => handleCheckboxChangee(index, e.target.checked, task._id)}
                                            />
                                            <span className={`ml-3 ${task?.status === "0" ? "" : "line-through"}`} >{truncatedTask}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {todoTaskList.length === 0 &&
                                <div className='pt-4 text-center '>No Data Found</div>
                            }
                            {todoTaskList.length !== 0 &&
                                <div className='pt-4 '><Link to='/todo-list' className='font-semibold text-xl text-[#F41F1C] underline underline-offset-4'>View more tasks</Link></div>
                            }
                        </div>
                    </div>
                    {/* table content */}
                    <div className='py-8 mx-4 sm:mx-8 '>
                        <h3 className='text-3xl font-semibold mb-4'>Today’s Schedule</h3>
                        <p className='text-lg'>If you notice any unusual activity you do not recognize, <a href='#' className='text-[#F41F1C] underline underline-offset-4'>change your password</a> to protect your account or contact customer care for additional help. For security of your account and clients data, IDs and password cannot be shared and cannot be logged in from 2 locations or devices simultaneously </p>
                    </div>
                    <div className='py-8 mx-4 sm:mx-8 bg-[#FBFCFC] overflow-auto'>
                        <table className='table-auto w-full '>
                            <thead className='border-b-4 border-[#F41F1C] text-xl'>
                                <tr className='px-4'>
                                    <th className='pb-4 pl-8 font-bold text-left whitespace-nowrap'>User</th>
                                    <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>IP Address</th>
                                    {/* <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Access Type</th> */}
                                    <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Login/Logout</th>
                                    <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Location</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm divide-y divide-slate-200 dark:divide-slate-700'>
                                {clientActivitylogs.slice(0, 5).map((logs, index) => {
                                    return (
                                        <tr>
                                            <td className='pt-8 pb-4 pl-8 text-sm font-medium text-black'>{logs?.email}</td>
                                            <td className='pt-8 pb-4 px-2 font-medium text-black'>{logs?.ipAddress}</td>
                                            {/* <td className='pt-8 pb-4 px-2 font-medium text-black'>Browser</td> */}
                                            <td className='pt-8 pb-4 px-2 font-medium text-black'>
                                                {logs?.timestamp ? moment(logs?.timestamp).format('MM/DD/YYYY hh:mm:ss A') : "-"}
                                                <span className={`${logs?.activity === "Logout" ? "text-red-500" : "text-green-500"}`}> ({logs?.activity})</span>
                                            </td>
                                            <td className='pt-8 pb-4 px-2 font-medium text-black'>{logs?.location}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                        {clientActivitylogs.length === 0 &&
                            <div className='pt-4 text-center '>No Data Found</div>
                        }
                        {clientActivitylogs.length !== 0 &&
                            <div className='pt-4 '><Link to='/client-logs' className='me-3 text-end font-semibold text-xl text-[#F41F1C] underline underline-offset-4'>View more</Link></div>
                        }
                    </div>
                </main>


                <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Client">
                    <form onSubmit={handleSubmit}>
                        <div>
                            {!isAgreementStep ?
                                <>

                                    <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Full Name<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='name'
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder='Enter fullname here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Email<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="email" required name='email'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder='Enter email here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Date of Birth<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="date" name='dob'
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    placeholder='Enter DOB here'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                                                Address<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="text" name='address'
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder='Enter address here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                                                City<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" required type="text" name='city'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder='Enter city here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                State<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <select
                                                    required
                                                    name="state"
                                                    value={formData.state}
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
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                                                    Zip<span className='text-red-500'>*</span>
                                                </label>
                                            </div>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" required className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='zip'
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                    placeholder='Enter zip here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Country<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='country'
                                                    value="United States"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Phone (M)<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input id="default" required className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='phone'
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder='Enter phone number here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                                                    Status<span className='text-red-500'>*</span>
                                                </label>
                                            </div>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <select id="status" required name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                                    value={formData.status}
                                                    onChange={handleChange}>
                                                    <option value="" disabled>Select Status</option>
                                                    <option value="client">Client</option>
                                                    <option value="lead">Lead</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                SSN (Last 4 digit) <span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input
                                                    id="SSN"
                                                    maxLength={4}
                                                    required
                                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                                    type="text"
                                                    name="SSN"
                                                    value={formData.SSN}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d{0,4}$/.test(value)) {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                    placeholder='Enter ssn here'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="lock text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Assigned To
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                                                <div className='bg-slate-100 pt-0 pb-1 px-2 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none'>
                                                    <ReactTags
                                                        tags={tags}
                                                        suggestions={suggestions}
                                                        handleDelete={handleDelete}
                                                        handleAddition={handleAddition}
                                                        inputFieldPosition="inline"
                                                        delimiters={[]}
                                                        minQueryLength={0}
                                                        placeholder={""}
                                                        classNames={{
                                                            tags: 'tagsClass',
                                                            tagInput: 'tagInputClass',
                                                            tagInputField: 'tagInputFieldClass',
                                                            selected: 'selectedClass',
                                                            tag: 'tagClass',
                                                            remove: 'removeClass',
                                                            suggestions: 'suggestionsClass',
                                                            activeSuggestion: 'activeSuggestionClass',
                                                            editTagInput: 'editTagInputClass',
                                                            editTagInputField: 'editTagInputField',
                                                            clearAll: 'clearAllClass',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-1 ps-5 pe-5 mt-5 mb-5">
                                        <div className='flex'>
                                            <input
                                                className='mt-1'
                                                type="checkbox"
                                                id="myCheckbox"
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="block text-sm font-medium mb-1 ms-2" htmlFor="default">
                                                <span className='tm-color'>Previous address</span> (If at current address less than 2 years)
                                            </label>
                                        </div>
                                    </div>

                                    <hr></hr>

                                    {isChecked &&
                                        <>
                                            <div className="grid gap-5 md:grid-cols-3 ps-5 pe-5 mt-5 mb-5">
                                                <div>
                                                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                        Previous mailing address
                                                    </label>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_mailing_address'
                                                            value={formData.previous_mailing_address}
                                                            onChange={handleChange}
                                                            placeholder='Previous mailing address'
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                                                        Previous city
                                                    </label>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_city'
                                                            value={formData.previous_city}
                                                            onChange={handleChange}
                                                            placeholder='Previous city'
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                        Previous state
                                                    </label>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" name='previous_state'
                                                            value={formData.previous_state}
                                                            onChange={handleChange}
                                                            placeholder='Previous state'
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                                                            Previous zip code
                                                        </label>
                                                    </div>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} name='previous_zip_code'
                                                            value={formData.previous_zip_code}
                                                            onChange={handleChange}
                                                            placeholder='Previous zip code'
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                        Previous country
                                                    </label>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" disabled name='previous_country'
                                                            value="United State"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <hr></hr>
                                        </>
                                    }
                                    <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
                                        <div>
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                                                Start date<span className='text-red-500'>*</span>
                                            </label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input required id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="date" name='start_date'
                                                    value={formData.start_date}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                                                    Referred By
                                                </label>
                                            </div>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <select name="referred_by" value={formData.referred_by} onChange={handleChange} autoComplete="referred_by" className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                                                    <option value="">Select a referred by</option>
                                                    {/* {agentData?.agent?.map((agent, index) => (
                          <option key={index} value={agent?._id}>{agent?.user[0]?.name}</option>
                        ))} */}
                                                    {isAffiliateData?.map((user, index) => (
                                                        <option key={index} value={user?._id}>{user?.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </>
                                :
                                <>
                                    <div className="pl-2 py-2 w-full">
                                        < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium mb-1" htmlFor="tooltip">
                                                    Client Agreement<span className='text-red-500'>*</span>
                                                </label>
                                            </div>
                                            <CKEditor
                                                className="rounded-2xl"
                                                rows={15}
                                                editor={ClassicEditor}
                                                data={formData?.clientAgreement ? formData?.clientAgreement : defaultContent}
                                                config={{
                                                    ckfinder: {
                                                        uploadUrl: ""
                                                    }
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    if (data) {
                                                        setFormData({ ...formData, clientAgreement: data })
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className='text-center me-5'>
                                            {/* {submitLoader ?
                        <button className="ms-3 btn-sm tm-background text-white rounded-full" disabled>
                          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                          <span className="ml-2">Update Agreement</span>
                        </button>
                        :
                        <button
                          onClick={(e) => { addClientAgreementContent() }}
                          className="ms-3 btn-sm tm-background text-white rounded-full">
                          Update Agreement
                        </button>
                      } */}

                                        </div>
                                    </div>
                                </>
                            }


                            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex flex-wrap justify-end space-x-2">
                                    {isAgreementStep ?
                                        <>
                                            {isSubmitLoader ?
                                                <span disabled className='items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white'><Loder /> <span className='ms-1'>Add Client</span></span>
                                                :
                                                <>
                                                    <p onClick={(e) => { e.stopPropagation(); handleAgreementTab(false); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Back</p>
                                                    <button className=" items-center btn-sm py-2 px-5 rounded-3xl tm-background text-white">Add Client</button>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <span onClick={(e) => { e.stopPropagation(); handleAgreementTab(true); }} className="cursor-pointer items-center -sm py-2 px-5 rounded-3xl tm-background text-white">Next</span>
                                        </>
                                    }


                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBasic>



                {/* <Footer /> */}
            </div>
        </>
    )
}

export default Home