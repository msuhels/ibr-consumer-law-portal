import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GET_LETTERS_GENERATOR_LIST, GET_SINGLE_DUMMY_CUSTOM_LETTER, DELETE_DUMMY_LETTERS_GENERATOR, GET_DUMMY_CUSTOM_LETTER, DELETE_LETTERS_GENERATOR, UPDATE_TRIAL_USED_STATUS, ADD_LETTER_GENERATOR, CHECK_TRIAL_USED_STATUS, UPDATE_LETTERS_GENERATOR, EDIT_LETTERS_GENERATOR, LETTERS_GENERATOR_DATA_BY_FILTER, RESET_LETTER_GENERATOR } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic-sm';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import Tooltip from '../components/Tooltip';
import LetterLibraryDropdown from '../components/LetterLibraryDropdown';
import DashboardSidebar from '../partials/DashboardSidebar';
import DropdownEditMenu from '../components/DropdownEditMenu';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
import SubNavbar from '../components/SubNavbar'
import mammoth from "mammoth";

function LetterGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allLtters, setAllLtters] = useState([]);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isLetterGenerator, setLetterGenerator] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [setLoader, setsetLoader] = useState(false);
  const [checkTrialStatus, setCheckTrialStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [ResetModalOpen, setResetModalOpen] = useState(false);
  const [showDocInputFiled, setshowDocInputFiled] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);


  useEffect(() => {
    getAllLetters();
    letterGeneratorDataByFilter();
    CheckButtonStatus();
  }, []);


  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        let ntext = result?.value;
        let string = ntext.replaceAll("\n", "<br />");
        setFormData({
          letter_discription: string,
        });
      } catch (error) {
        console.error("Error reading the DOC file:", error);
      }
    }
  };

  const CheckButtonStatus = async () => {
    try {
      const response = await axios.post(CHECK_TRIAL_USED_STATUS,
        {
          userid: user?._id,
          for_type: "edit-view",
        },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data?.message === "limit-expire") {
        setCheckTrialStatus(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }

  };

  const [formData, setFormData] = useState({
    letter_title: '',
    letter_discription: '',
    category: '',
    status: '',
    is_liked: '',
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    letter_title: '',
    letter_discription: '',
    category: '',
    status: '',
    is_liked: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value, });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ADD_LETTER_GENERATOR, { formData },
        { headers: { "Authorization": "Bearer " + token } });
      letterGeneratorDataByFilter();
      setFeedbackModalOpen(false);
      toast.success(response.data.message || "Letter added successfully");
      setFormData({
        letter_title: '',
        letter_discription: '',
        category: '',
        status: '',
        is_liked: '',
      });
      getAllLetters();
      getLetterGeneratorData();
      window.location.reload();

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const getAllLetters = async () => {
    try {
      const response = await axios.post(GET_DUMMY_CUSTOM_LETTER, {
        userid: user._id,
      },
        { headers: { "Authorization": "Bearer " + token } }
      );
      setAllLtters(response?.data);
    } catch (error) {
      toast.error("Something went Wrong");
    }
  }

  const getLetterGeneratorData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_LETTERS_GENERATOR_LIST, {
        userid: user._id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      setLetterGenerator(response.data)
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const letterGeneratorDataByFilter = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(
        LETTERS_GENERATOR_DATA_BY_FILTER,
        {
          userid: user._id,
        },
        {
          params: { search: search, exectMatch: selectedStatus },
          headers: { "Authorization": "Bearer " + token }
        }
      );
      setLetterGenerator(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    letterGeneratorDataByFilter(selectedStatus, search);
  }, [selectedStatus, search]);

  const handleStatusChange = (e) => {
    setselectedStatus(e.target.value);
  }
  const clearSearch = () => {
    setSearch("");
  }

  const deleteLetterGenerator = async (data) => {
    try {
      const response = await axios.post(DELETE_LETTERS_GENERATOR, {
        letterData: data,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Letter deleted successfully");
      getLetterGeneratorData()
      letterGeneratorDataByFilter();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const deleteLDummyetterGenerator = async (id) => {
    try {
      const response = await axios.post(DELETE_DUMMY_LETTERS_GENERATOR, {
        letterId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Letter deleted successfully");
      // getLetterGeneratorData()
      letterGeneratorDataByFilter();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };
  const [dayOffset, setDayOffset] = useState({});

  const handleCopy = (subHeading, subIndex) => {
    let modifiedText = subHeading;

    if (subHeading.includes("Today_+X_Days") || subHeading.includes("Today_-X_Days")) {
      const selectedDays = dayOffset[subIndex] || 0; // Default to 0 if not selected
      modifiedText = subHeading.replace("X", selectedDays);
    }

    copyToClipboard(modifiedText);
  }
  const editLetterGenerator = async (id) => {
    try {
      const response = await axios.post(EDIT_LETTERS_GENERATOR, {
        letterId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data) {
        let ntext = response.data.letterData.letter_discription;
        let string = ntext.replaceAll("\n", "<br />");
        setEditFormData({
          id: response.data.letterData._id,
          letter_title: response.data.letterData.letter_title,
          letter_discription: string,
          category: response.data.letterData.category,
          status: response.data.letterData.status,
          is_liked: response.data.letterData.is_liked,
        });
        setEditInfoModalOpen(true);
      }
      try {
        const response = await axios.post(UPDATE_TRIAL_USED_STATUS,
          {
            userid: user?._id,
            for_type: "edit-view",
          },
          { headers: { "Authorization": "Bearer " + token } });
        CheckButtonStatus();
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const viewLetterGenerator = async (id) => {
    try {
      const response = await axios.post(EDIT_LETTERS_GENERATOR, {
        letterId: id,
      },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data) {
        let ntext = response.data.letterData.letter_discription;
        let string = ntext.replaceAll("\n", "<br />");
        setEditFormData({
          id: response.data.letterData._id,
          letter_title: response.data.letterData.letter_title,
          letter_discription: string,
          category: response.data.letterData.category,
          status: response.data.letterData.status,
          is_liked: response.data.letterData.is_liked,
        });
        setViewInfoModalOpen(true);
      }
      try {
        const response = await axios.post(UPDATE_TRIAL_USED_STATUS,
          {
            userid: user?._id,
            for_type: "edit-view",
          },
          { headers: { "Authorization": "Bearer " + token } });
        CheckButtonStatus();
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }


    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_LETTERS_GENERATOR, { editFormData },
        { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Letter updated successfully");
      getLetterGeneratorData();
      letterGeneratorDataByFilter();
      setEditFormData({
        letter_title: '',
        letter_discription: '',
        category: '',
        status: '',
        is_liked: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const resetLetter = async () => {
    try {
      const response = await axios.post(RESET_LETTER_GENERATOR,
        { userid: user?._id },
        { headers: { "Authorization": "Bearer " + token } });
      setResetModalOpen(false);
      toast.success(response.data.message || "Letter updated successfully");
      letterGeneratorDataByFilter();
    } catch (error) {
      console.error('Error submitting data:', error);
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


  function uploadPlugin(editor) {
    // editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    //   return uploadAdapter(loader);
    // };
  }


  function showInputFiled() {
    setshowDocInputFiled(true);
  }

  // State to track which entry's sub-data is open
  const [openIndex, setOpenIndex] = useState(null);

  // Function to toggle sub-data visibility
  const toggleSubData = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Close if it's already open
  };

  // Hardcoded entries and their subheadings
  const entries = [
    {
      title: 'Client Info',
      subHeadings: ['client_first_name','client_middle_name','client_last_name', 'client_email', 'client_city', 'client_state', 'client_postal_code', 'client_address','client_previous_address','bdate','ss_number','client_sign','last4_ssn'],
    },
    {
      title: 'Bureau Info',
      subHeadings: ['bureau_name', 'bureau_address'],
    },
    {
      title: 'Creditor Info',
      subHeadings: ['creditor_name', 'creditor_address', 'creditor_phone', 'creditor_city', 'creditor_state', 'creditor_zip',],
    },
    {
      title: 'Date Info',
      subHeadings: ['current_date', 'pretty_curr_date', 'Today_+X_Days', 'Today_-X_Days'],
    },
    {
      title: 'Company Info',
      subHeadings: ['company_name', 'company_website','company_email', 'company_phone','company_second_phone','company_fax_number','company_address','company_city','company_state','company_postal_code'],
    },
    {
      title: 'Dispute Info',
      subHeadings: ['report_number', 'account_number','account_name', 'inquiries','inquiries_date'],
    },
    {
      title: 'Advance Dispute Info',
      subHeadings: ['account','account_name_number','personal_Information', 'public_records'],
    },
    {
      title: 'Dispute Extensions',
      subHeadings: ['high_balance', 'last_verified','date_of_last_activity','date_reported','date_opened','closed_date','dispute_status',
      'account_status','payment_amount','payment_status','creditor_remarks','last_payment','term_length','past_due_amount',
      'account_type','credit_limit','creditor','reference_number'],
    }, 
    {
      title: 'Dispute Payment History',
      subHeadings: ['payment_history'],
    }
  ];


  const insertVariableAtCursor = (variable) => {
    if (!editorInstance) {
      toast.error("Editor not initialized");
      return;
    }
  
    editorInstance.model.change((writer) => {
      const model = editorInstance.model;
      const doc = model.document;
      const root = doc.getRoot();
  
      // Ensure there's a paragraph
      let paragraph = root.getChild(0);
      if (!paragraph || !paragraph.is('element', 'paragraph')) {
        paragraph = writer.createElement('paragraph');
        writer.insert(paragraph, root, 0);
      }
  
      // Get the current selection position
      let position = doc.selection.getFirstPosition();
  
      // If the position is invalid or outside a valid element, place it at the end of the paragraph
      if (!position || position.parent === root) {
        position = writer.createPositionAt(paragraph, 'end');
        writer.setSelection(position);
      }
  
      // Insert the variable text
      const textNode = writer.createText(variable + ' ');
      writer.insert(textNode, position);
  
      // Set the cursor after inserted text by calculating the new position
      const offsetAfterInsert = position.offset + textNode.offsetSize;
      const newPosition = writer.createPositionAt(position.parent, offsetAfterInsert);
      writer.setSelection(newPosition);
    });
  };
  
  
  


  const copyToClipboard = (text) => {
    insertVariableAtCursor(text);
  };


  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }

      <div className="flex h-[100dvh] overflow-hidden bg-white">
        {(user?.plan_name === "1" || user?.plan_name === "5") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow bg-white dark:bg-[#FFFFFF]">
            <div className="py-8 mx-4 sm:mx-8">
              <div className="sm:flex sm:justify-between sm:items-center border-b pb-2 mb-4">
                <div className="mb-4 sm:mb-0 flex" >
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Letter Library</h1>
                  {/* <img width={35} h src={head_logo}></img> */}
                </div>
                <div className='sm:flex gap-2'>
                  <div className='flex items-center justify-around gap-2 btn-space'>
                    <LetterLibraryDropdown value={selectedStatus} onChange={handleStatusChange} clearSearch={clearSearch}></LetterLibraryDropdown>
                    {/* <input className="form-input w-50 mx-1" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by letter' /> */}
                    <form className="md:mr-2">
                      <label for="letter-search" className="sr-only">Search</label>
                      <div className="relative">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} id="letter-search"
                          className="form-input w-50 mx-1 w-full text-gray-900 text-sm rounded-full block py-2  dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white" placeholder="Search by letter" />
                        <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                          <svg className="w-4 h-4 me-2 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className='flex items-center justify-around gap-2 btn-space'>
                    <button className="btn-sm px-5 py-2  tm-background text-white rounded-full" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setResetModalOpen(true); }}>Refresh Library</button>
                    <button className="btn-sm flex items-center px-5 py-2  tm-background text-white rounded-full" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); setshowDocInputFiled(false); }}>
                      <svg className="w-4 h-4 fill-current opacity-80 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="ml-2">Add New Letter</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className='shownav'>
                <div className="bg-white dark:bg-slate-800  rounded-sm border border-slate-200 dark:border-slate-700 relative  rounded-tr-2xl rounded-tl-2xl">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST <span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2> */}
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div className='grow px-5'>
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isLetterGenerator ? isLetterGenerator.length : 0}</span> </p>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-sm text-slate-400 dark:text-slate-500 bg-gray-100 ">
                          <tr>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 rounded-tl-lg rounded-bl-lg">
                              <div className="font-semibold text-left text-black">Letter Title</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Category</div>
                            </th>
                            {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">LETTER DESCRIPTION</div>
                            </th> */}
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left text-black">Status</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-tr-lg rounded-br-lg">
                              <div className="font-semibold text-left text-black">Actions</div>
                            </th>
                            {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">	Favorite</div>
                          </th> */}
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                          {isLetterGenerator.map((val, index) => {
                            const words = val?.letter_discription?.split(' ');
                            const truncatedDescription = words?.slice(0, 3).join(' ');
                            return (
                              <>
                                {val.is_deleted != 1 &&
                                  <>
                                    <tr key={index}>
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <div className="font-medium text-black">{val.letter_title}</div>
                                        </div>
                                      </td>
                                      <td className="p-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="font-medium text-slate-800 dark:text-slate-100 capitalize">{val.category ? val.category : "-"}</div>
                                        </div>
                                      </td>
                                      {/* <td className="p-2 ">
                                        <div className="flex items-center capitalize">
                                          <div>{parse(truncatedDescription)}...</div>
                                        </div>
                                      </td> */}
                                      <td className="p-2 whitespace-nowrap">
                                        <div className="flex items-center capitalize">
                                          <div>{val.status ? val.status : "-"}</div>
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize w-20">
                                        {checkTrialStatus === true ?
                                          <>
                                            <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2' disabled >
                                              <span className='me-2'>View</span>
                                              <Tooltip size="lg" bg="light">
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                  You are under free trial plan, Please upgrade your plan.
                                                  <br></br>
                                                  Under free trial plan you can generate 9 letters per week.
                                                </div>
                                              </Tooltip>
                                            </button>
                                            <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2' disabled >
                                              <span className='me-2'>Edit</span>
                                              <Tooltip size="lg" bg="light">
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                  You are under free trial plan,
                                                  <br></br>Please upgrade your plan.
                                                  Under free trial plan you can
                                                  <br></br>generate 9 letters per week.
                                                </div>
                                              </Tooltip>
                                            </button>
                                            <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteLetterGenerator(val)}>
                                              <span className="sr-only">Delete</span>
                                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                              </svg>
                                            </button>
                                          </>
                                          :
                                          <>
                                            <DropdownEditMenu className="relative inline-flex bg-gray-100 rounded-full">
                                              <li>
                                                <a className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer" onClick={(e) => { viewLetterGenerator(val?._id) }}>View</a>
                                              </li>
                                              <li>
                                                <a className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3 cursor-pointer" onClick={(e) => { editLetterGenerator(val?._id) }}>Edit</a>
                                              </li>
                                              <li>
                                                <a className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3 cursor-pointer" onClick={() => deleteLetterGenerator(val)}>Delete</a>
                                              </li>
                                            </DropdownEditMenu>
                                          </>
                                        }
                                      </td>
                                    </tr>
                                  </>
                                }
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>


              <div className='hidenav'>
                <div className="bg-white dark:bg-slate-800  rounded-sm border border-slate-200 dark:border-slate-700 relative rounded-tr-2xl rounded-tl-2xl">
                  <header className="px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST<span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2> */}
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                  </header>
                  <div className="px-5 overflow-x-auto">
                    <p className='my-3 text-xs text-[black]'>Number Of Records :<span className='text-black font-semibold'> {isLetterGenerator ? isLetterGenerator.length : 0}</span> </p>
                    <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {isLetterGenerator.map((data, index) => {
                          return (
                            <>
                              <div key={index} style={{ paddingBottom: "20px", marginTop: "20px" }}>
                                <table className="table-auto w-full dark:text-slate-300">
                                  <tbody className="">
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Letter Title</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.letter_title}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Category</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.category ? data?.category : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Status</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.status ? data?.status : "-"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Actions</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {checkTrialStatus === true ?
                                          <>
                                            <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2' disabled >
                                              <span className='me-2'>View</span>
                                              <Tooltip size="lg" bg="light">
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                  You are under free trial plan, Please upgrade your plan.
                                                  <br></br>
                                                  Under free trial plan you can generate 3 letters per week.
                                                </div>
                                              </Tooltip>
                                            </button>
                                            <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-white-100 me-2' disabled >
                                              <span className='me-2'>Edit</span>
                                              <Tooltip size="lg" bg="light">
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                                                  You are under free trial plan,
                                                  <br></br>Please upgrade your plan.
                                                  Under free trial plan you can
                                                  <br></br>generate 3 letters per week.
                                                </div>
                                              </Tooltip>
                                            </button>
                                          </>
                                          :
                                          <>
                                            <button
                                              onClick={(e) => { viewLetterGenerator(data?._id) }}
                                              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                              <span className="sr-only">view</span>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                            </button>
                                            <button
                                              onClick={(e) => { editLetterGenerator(data?._id) }}
                                              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                              <span className="sr-only">Edit</span>
                                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                              </svg>
                                            </button>
                                          </>
                                        }
                                        <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteLetterGenerator(data)}>
                                          <span className="sr-only">Delete</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                            <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                          </svg>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>


      <div className="m-1.5">

        <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Letter">
          <div className='md:flex'>
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>

                <div className="grid gap-4 md:grid-cols-1 ps-5 pe-5 mt-2">
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                      Category<span className='text-red-500'>*</span>
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select id="category" name='category' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="Default">Default</option>
                        <option value="Sent to Creditors">Sent to Creditors</option>
                        <option value="Sent to CRAs">Sent to CRAs</option>
                        <option value="Misc. Letters">Misc. Letters</option>


                        <option value="Medical Collection Dletion Guide">Medical Collection Dletion Guide</option>
                        <option value="Late Payment Guide">Late Payment Guide</option>
                        <option value="Pre Demand Letters">Pre Demand Letters</option>


                        <option value="Charge Off Letter">Charge Off Letter</option>
                        <option value="No Parking Rule">No Parking Rule</option>
                        <option value="When A Negative Account Comes Back Verified">When A Negative Account Comes Back Verified</option>


                        <option value="Inquiry Deletion Letters">Inquiry Deletion Letters</option>
                        <option value="Utilization">Utilization</option>
                        <option value="TILA Request">TILA Request</option>



                        <option value="Requesting Truth in Lending">Requesting Truth in Lending</option>
                        <option value="Re-Investigation Letter">Re-Investigation Letter</option>
                        <option value="Personal Information">Personal Information</option>



                        <option value="Permissible Purpose">Permissible Purpose</option>
                        <option value="Debt Validation Letter">Debt Validation Letter</option>
                        <option value="Identity Theft Letter">Identity Theft Letter</option>



                        <option value="Negative Credit Card Deletion Letter">Negative Credit Card Deletion Letter</option>
                        <option value="Mortgage Deletions Letter">Mortgage Deletions Letter</option>
                        <option value="Late Payment">Late Payment</option>


                        <option value="Interest Rate Swindle Letter Usury Law">Interest Rate Swindle Letter Usury Law</option>
                        <option value="Inaccurate Information Furnished">Inaccurate Information Furnished</option>
                        <option value="Student Loans">Student Loans</option>

                        <option value="Medical Collection">Medical Collection</option>
                        <option value="Debt Collection Killer Pack">Debt Collection Killer Pack</option>
                        <option value="Child Support Removal">Child Support Removal</option>

                        <option value="Cease & Desist Volenti Non Fit Injuria">Cease & Desist Volenti Non Fit Injuria</option>
                        <option value="Cease & Desist Letter Collections">Cease & Desist Letter Collections</option>
                        <option value="Capital One Rebuttal for Default & Right to Cure">Capital One Rebuttal for Default & Right to Cure</option>

                        <option value="Auto Loan Dispute">Auto Loan Dispute</option>
                        <option value="Account Removal">Account Removal</option>

                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                      Letter title<span className='text-red-500'>*</span>
                    </label>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <input id="default" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='letter_title'
                        value={formData.letter_title}
                        onChange={handleChange}
                        placeholder='Enter letter title'
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                        Status
                      </label>
                    </div>
                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select id="status" name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        value={formData.status}
                        onChange={handleChange}>
                        <option value="" disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="ps-5 pe-5">
                  <div>
                    <div>
                      <div className="flex items-center justify-end mb-4 mt-5">
                        {showDocInputFiled ?
                          <input className=" tm-background py-2 btn-sm  px-8 rounded-full text-white " onClick={() => { setshowDocInputFiled(false) }} type="button" value='Hide letter by .docx document' />
                          :
                          <input className=" tm-background py-2 btn-sm  px-8 rounded-full text-white " onClick={() => { setshowDocInputFiled(true) }} type="button" value='Add letter by .docx document' />
                        }
                      </div>
                      {showDocInputFiled &&
                        <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                          <input type="file" accept=".docx" className='form-contorl form-input w-full px-3 py-2 rounded-[20px] text-gray-800 placeholder-gray-800 bg-gray-100 border-none' onChange={handleFileUpload} />
                        </div>
                      }

                      {/* <textarea id="letter_discription" className="form-input w-full py-3 px-4 rounded-xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" rows={10} type="text" name='letter_discription'
                      value={formData.letter_discription}
                      onChange={handleChange}
                      placeholder='Enter Fax here'
                    />
                  </div> */}

                      <div className='mt-5 mb-4  text-sm text-center ckeditorcss '>
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData?.letter_discription || ''}
                          config={{
                            allowedContent: true,
                            removePlugins: ['Autoformat'],
                          }}
                          onReady={(editor) => {
                            setEditorInstance(editor); // Save the instance for later use
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFormData({ ...formData, letter_discription: data });
                          }}
                        />


                      </div>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
                <div className="px-5 py-5  border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap justify-start space-x-2">
                    <input className=" tm-background py-2 cursor-pointer  px-8 rounded-full text-white " type="submit" value='Save' />
                    {/* <button className="btn tm-background rounded-full text-white">Save</button> */}
                  </div>
                </div>
              </form>
              <div className="hidenav overflow-y-auto p-5">
                <h1 className=' text-2xl md:text-2xl text-slate-900 dark:text-slate-100 font-bold mb-3'>Variable:</h1>
                {entries.map((entry, index) => (
                  <div key={index} className="mb-2 p-3 p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <div
                      onClick={() => toggleSubData(index)}
                      className="flex justify-between items-center cursor-pointer form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                      <span>{entry.title}</span>
                      <button
                        className="tm-color font-bold"
                      >
                        {openIndex === index ? '-' : '+'}
                      </button>
                    </div>

                    {openIndex === index && (
                    <div className="mx-2 mt-2">
                      {entry.subHeadings.map((subHeading, subIndex) => (
                        <div key={subIndex} className="mb-1 p-2 bg-gray-200 rounded cursor-pointer">
                          {subHeading.includes("Today_+X_Days") || subHeading.includes("Today_-X_Days") ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-1 py-1"
                                onClick={() => handleCopy(subHeading, subIndex)}
                              >
                                {subHeading}
                              </button>
                              <input
                                type="number"
                                min="0"
                                className="p-1 border-none w-12 bg-gray-100"
                                value={dayOffset[subIndex] || ""}
                                onChange={(e) =>
                                  setDayOffset((prev) => ({ ...prev, [subIndex]: e.target.value }))
                                }
                                placeholder="X"
                              />
                            </div>
                          ) : (
                            <div onClick={() => handleCopy(subHeading, subIndex)}>{subHeading}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 shownav h-96 overflow-y-auto p-5 border-l">
              <h1 className=' text-2xl md:text-2xl text-slate-900 dark:text-slate-100 font-bold mb-3'>Variable:</h1>
              {entries.map((entry, index) => (
                <div key={index} className="mb-2 p-3 p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                  <div
                    onClick={() => toggleSubData(index)}
                    className="flex justify-between items-center cursor-pointer form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                    <span>{entry.title}</span>
                    <button
                      className="tm-color font-bold"
                    >
                      {openIndex === index ? '-' : '+'}
                    </button>
                  </div>

                  {openIndex === index && (
                    <div className="mx-2 mt-2">
                      {entry.subHeadings.map((subHeading, subIndex) => (
                        <div key={subIndex} className="mb-1 p-2 bg-gray-200 rounded cursor-pointer">
                          {subHeading.includes("Today_+X_Days") || subHeading.includes("Today_-X_Days") ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-1 py-1"
                                onClick={() => handleCopy(subHeading, subIndex)}
                              >
                                {subHeading}
                              </button>
                              <input
                                type="number"
                                min="0"
                                className="p-1 border-none w-12 bg-gray-100"
                                value={dayOffset[subIndex] || ""}
                                onChange={(e) =>
                                  setDayOffset((prev) => ({ ...prev, [subIndex]: e.target.value }))
                                }
                                placeholder="X"
                              />
                            </div>
                          ) : (
                            <div onClick={() => handleCopy(subHeading, subIndex)}>{subHeading}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Letter">
          <div className='md:flex'>
            <div className="md:w-2/3">
              <form onSubmit={handleEditSubmit}>
                <div className="grid gap-4 md:grid-cols-1 ps-5 pe-5 mt-2">
                  <div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Category <span className='text-red-500'>*</span>
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <select id="category" name='category' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          value={editFormData.category}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Category</option>
                          <option value="Default">Default</option>
                          <option value="Sent to Creditors">Sent to Creditors</option>
                          <option value="Sent to CRAs">Sent to CRAs</option>
                          <option value="Misc. Letters">Misc. Letters</option>


                          <option value="Medical Collection Dletion Guide">Medical Collection Dletion Guide</option>
                          <option value="Late Payment Guide">Late Payment Guide</option>
                          <option value="Pre Demand Letters">Pre Demand Letters</option>


                          <option value="Charge Off Letter">Charge Off Letter</option>
                          <option value="No Parking Rule">No Parking Rule</option>
                          <option value="When A Negative Account Comes Back Verified">When A Negative Account Comes Back Verified</option>


                          <option value="Inquiry Deletion Letters">Inquiry Deletion Letters</option>
                          <option value="Utilization">Utilization</option>
                          <option value="TILA Request">TILA Request</option>



                          <option value="Requesting Truth in Lending">Requesting Truth in Lending</option>
                          <option value="Re-Investigation Letter">Re-Investigation Letter</option>
                          <option value="Personal Information">Personal Information</option>



                          <option value="Permissible Purpose">Permissible Purpose</option>
                          <option value="Debt Validation Letter">Debt Validation Letter</option>
                          <option value="Identity Theft Letter">Identity Theft Letter</option>



                          <option value="Negative Credit Card Deletion Letter">Negative Credit Card Deletion Letter</option>
                          <option value="Mortgage Deletions Letter">Mortgage Deletions Letter</option>
                          <option value="Late Payment">Late Payment</option>


                          <option value="Interest Rate Swindle Letter Usury Law">Interest Rate Swindle Letter Usury Law</option>
                          <option value="Inaccurate Information Furnished">Inaccurate Information Furnished</option>
                          <option value="Student Loans">Student Loans</option>

                          <option value="Medical Collection">Medical Collection</option>
                          <option value="Debt Collection Killer Pack">Debt Collection Killer Pack</option>
                          <option value="Child Support Removal">Child Support Removal</option>

                          <option value="Cease & Desist Volenti Non Fit Injuria">Cease & Desist Volenti Non Fit Injuria</option>
                          <option value="Cease & Desist Letter Collections">Cease & Desist Letter Collections</option>
                          <option value="Capital One Rebuttal for Default & Right to Cure">Capital One Rebuttal for Default & Right to Cure</option>

                          <option value="Auto Loan Dispute">Auto Loan Dispute</option>
                          <option value="Account Removal">Account Removal</option>

                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                          Letter Title<span className='text-red-500'>*</span>
                        </label>
                      </div>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                        <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" required name='letter_title'
                          value={editFormData.letter_title}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                        Status
                      </label>
                      <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                      <select id="status" name='status' className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                        value={editFormData.status}
                        onChange={handleEditChange}>
                        <option value="" disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ps-5 pe-5">
                  <div>
                    <div>
                      <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                        Letter                    </label>
                      {/* <textarea id="default" className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" rows={10} type="text"
                      name='letter_discription'
                      value={editFormData.letter_discription}
                      onChange={handleEditChange}
                    /> */}

                      {EditInfoModalOpen && <div className='mt-5 mb-4  text-sm text-center ckeditorcss '>
                        <CKEditor
                          editor={ClassicEditor}
                          data={editFormData?.letter_discription}
                          config={{
                            allowedContent: true,
                            removePlugins: ['Autoformat'],
                          }}
                          onReady={(editor) => {
                            setEditorInstance(editor); // Save the instance for later use
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            if (data) {
                              setEditFormData({ ...editFormData, letter_discription: data, });
                            }
                          }}
                        />
                      </div>}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-5 border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap justify-start space-x-2">
                    <input className=" tm-background py-2 cursor-pointer px-8 rounded-full text-white " type="submit" value='Update' />
                    {/* <button className="btn tm-background rounded-full text-white">Save</button> */}
                  </div>
                </div>
              </form>
              <div className="hidenav overflow-y-auto p-5">
                <h1 className=' text-2xl md:text-2xl text-slate-900 dark:text-slate-100 font-bold mb-3'>Variable:</h1>
                {entries.map((entry, index) => (
                  <div key={index} className="mb-2 p-3 p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                    <div
                      onClick={() => toggleSubData(index)}
                      className="flex justify-between items-center cursor-pointer form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                      <span>{entry.title}</span>
                      <button
                        className="tm-color font-bold"
                      >
                        {openIndex === index ? '-' : '+'}
                      </button>
                    </div>

                    {openIndex === index && (
                    <div className="mx-2 mt-2">
                      {entry.subHeadings.map((subHeading, subIndex) => (
                        <div key={subIndex} className="mb-1 p-2 bg-gray-200 rounded cursor-pointer">
                          {subHeading.includes("Today_+X_Days") || subHeading.includes("Today_-X_Days") ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-1 py-1"
                                onClick={() => handleCopy(subHeading, subIndex)}
                              >
                                {subHeading}
                              </button>
                              <input
                                type="number"
                                min="0"
                                className="p-1 border-none w-12 bg-gray-100"
                                value={dayOffset[subIndex] || ""}
                                onChange={(e) =>
                                  setDayOffset((prev) => ({ ...prev, [subIndex]: e.target.value }))
                                }
                                placeholder="X"
                              />
                            </div>
                          ) : (
                            <div onClick={() => handleCopy(subHeading, subIndex)}>{subHeading}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 shownav  h-96 overflow-y-auto p-5 border-l">
              <h1 className=' text-2xl md:text-2xl text-slate-900 dark:text-slate-100 font-bold mb-3'>Variable:</h1>
              {entries.map((entry, index) => (
                <div key={index} className="mb-2 p-3 p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100">
                  <div
                    onClick={() => toggleSubData(index)}
                    className="flex justify-between items-center cursor-pointer form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none">
                    <span>{entry.title}</span>
                    <button
                      className="tm-color font-bold"
                    >
                      {openIndex === index ? '-' : '+'}
                    </button>
                  </div>

                  {openIndex === index && (
                    <div className="mx-2 mt-2">
                      {entry.subHeadings.map((subHeading, subIndex) => (
                        <div key={subIndex} className="mb-1 p-2 bg-gray-200 rounded cursor-pointer">
                          {subHeading.includes("Today_+X_Days") || subHeading.includes("Today_-X_Days") ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-1 py-1"
                                onClick={() => handleCopy(subHeading, subIndex)}
                              >
                                {subHeading}
                              </button>
                              <input
                                type="number"
                                min="0"
                                className="p-1 border-none w-12 bg-gray-100"
                                value={dayOffset[subIndex] || ""}
                                onChange={(e) =>
                                  setDayOffset((prev) => ({ ...prev, [subIndex]: e.target.value }))
                                }
                                placeholder="X"
                              />
                            </div>
                          ) : (
                            <div onClick={() => handleCopy(subHeading, subIndex)}>{subHeading}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Letter">
          <div>
            <div className="grid gap-4 md:grid-cols-1 ps-5 pe-5 mt-2">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Category
                  </label>
                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" required name='letter_title'
                      value={editFormData.category}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="tooltip">
                      Letter Title
                    </label>
                  </div>
                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" required name='letter_title'
                      value={editFormData.letter_title}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="mandatory">
                    Status
                  </label>
                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <input id="tooltip" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled type="text" required name='letter_title'
                      value={editFormData.status}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-1 mt-5 ps-5 pe-5 mb-12">
              <div>
                <div>
                  <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="default">
                    Letter
                  </label>
                  {/* <textarea id="default" className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none" disabled rows={15} type="text"
                    name='letter_discription'
                    value={editFormData.letter_discription}
                  /> */}
                  <div className="p-[2px] rounded-[22px] hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                    <div className='w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none'>
                      {parse(editFormData.letter_discription)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBasic>

        <ModalBasic id="feedback-modal" modalOpen={ResetModalOpen} setModalOpen={setResetModalOpen} title="Reset Confirmation ">
          <div>
            <div className="my-5 text-center">
              <div className=''>
                <label className="block text-sm font-medium mb-1" htmlFor="default">
                  Do you want to reset all Letters, this will revert all your edited text and will import new letters as well ?
                </label>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap justify-end space-x-2">
                <button type="button" className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 px-5 mr-2" onClick={(e) => { e.stopPropagation(); setResetModalOpen(false); }}>No</button>
                <button
                  className="btn tm-background text-white"
                  onClick={() => resetLetter()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </ModalBasic>
      </div>
      {/* <Footer></Footer> */}
    </>

  );
}

export default LetterGenerator;
