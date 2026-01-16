import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ADD_USER_TODO_TASK, GET_TODO_TASK_LIST_OF_USER, EDIT_TASK_DETAILS, DELETE_TODO_TASK, UPDATE_TASK_DATA, UPDATE_TASK_STATUS } from "../API/api"
import moment from 'moment'
import Header from '../partials/Header';
import ModalBasic from '../components/ModalBasic';
import head_logo from "../ConsumerlawLogo.png"
import Footer from '../partials/Footer';
import ModalBlank from '../components/ModalBlank';
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'


function TodoTaskListPage() {
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [isAgentData, setIsAgentData] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [EditInfoModalOpen, setEditInfoModalOpen] = useState(false);
  const [viewInfoModalOpen, setViewInfoModalOpen] = useState(false)
  const [setLoader, setsetLoader] = useState(false);
  const [UserData, setUserData] = useState("");
  const [editFormData, setEditFormData] = useState({ id: '', task: '', status: '' });
  const [formData, setFormData] = useState();
  const [filter, setFilter] = useState('all');
  const [todoText, setTodoText] = useState("");
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [todoTaskList, setTodoTaskList] = useState([]);


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value, });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, });
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
      setFeedbackModalOpen(false)
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
      const response = await axios.post(ADD_AGENT_DATA, { formData }, { headers: { "Authorization": "Bearer " + token } });
      getAgentData();
      setFeedbackModalOpen(false);
      toast.success(response.data.message);
      setFormData(field);
      getAgentData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  const getAgentData = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_AGENT_DATA, {}, { headers: { "Authorization": "Bearer " + token } });
      setIsAgentData(response.data);
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };


  const deleteTask = async (id) => {
    try {
      const response = await axios.post(DELETE_TODO_TASK, { task_id: id, }, { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Task deleted successfully");
      getTodoTaskList();
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const editAgentDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_TASK_DETAILS, { user_id: user?._id, taskId: id }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.taskData) {
        setEditFormData({
          id: response?.data?.taskData._id,
          task: response?.data?.taskData.todo,
          status: response?.data?.taskData.status,
        });
        setEditInfoModalOpen(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  const viewTaskDetails = async (id) => {
    try {
      const response = await axios.post(EDIT_TASK_DETAILS, { user_id: user?._id, taskId: id }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.taskData) {
        setEditFormData({
          id: response?.data?.taskData._id,
          task: response?.data?.taskData.todo,
          status: response?.data?.taskData.status,
        });
        setViewInfoModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_TASK_DATA, { editFormData }, { headers: { "Authorization": "Bearer " + token } });
      setEditInfoModalOpen(false);
      toast.success(response.data.message || "Task updated successfully");
      getTodoTaskList();
      setEditFormData({ id: '', task: '', status: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };


  const handleStatusChange = async (e, id) => {
    e.preventDefault();
    try {
      const statusval = e.target.value;
      const response = await axios.post(UPDATE_TASK_STATUS, { statusval, id }, { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message || "Task status updated successfully");
      getTodoTaskList();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getTodoTaskList();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [filter, todoTaskList]);

  const filterTasks = () => {
    getTodoTaskList();
    switch (filter) {
      case 'complete':
        setFilteredTaskList(todoTaskList.filter(task => task.status === "1"));
        break;
      case 'incomplete':
        setFilteredTaskList(todoTaskList.filter(task => task.status === "0"));
        break;
      case 'all':
      default:
        setFilteredTaskList(todoTaskList);
    }
  };

  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex h-[100dvh] overflow-hidden px-8 bg-white">
        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }

        <div className="pt-5 relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="px-4 ">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <div className="mb-4 sm:mb-0 flex" >
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Todo List</h1>
                  {/* <img width={35} src={head_logo}></img> */}
                </div>
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* {UserData?.plan_updated_to_enterprise === "true" &&
                    <Link className="btn tm-background text-white" to={`/dashboard/${user._id}`}>
                      View My Report
                    </Link>
                  } */}
                  <button className="btn tm-background text-white" aria-controls="feedback-modal" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(true); }}>Add New Task </button>
                </div>
              </div>


              <div className='shownav'>
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                  <header className="flex justify-between px-5 py-2 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                    <h2 className="font-semibold text-slate-100 dark:text-slate-100">List</h2>
                    <div>
                      <select className='form-select' id="filter" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete">Incomplete</option>
                      </select>
                    </div>
                  </header>


                  <div>
                    <div className="overflow-x-auto p-4">
                      <table className="table-auto w-full dark:text-slate-300">
                        <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900/20  dark:border-slate-700">
                          <tr>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-l-lg">
                              <div className="font-semibold text-left">Task</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Status</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap rounded-r-lg">
                              <div className="font-semibold text-left">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                          {filteredTaskList.map((data, index) => {
                            const truncatedTask = data.todo.length > 40 ? data.todo.slice(0, 40) + '...' : data.todo;
                            return (
                              <tr key={index}>
                                <td className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize font-bold tm-color ${data?.status === "0" ? "" : "line-through"}`}>
                                  {truncatedTask ? truncatedTask : "-"}
                                </td>

                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  <select className="form-select " name='status' onChange={(e) => { handleStatusChange(e, data?._id) }}>
                                    <option disabled >Status</option>
                                    <option selected={data.status === '1' ? "selected" : ''} value='1'>
                                      Complete
                                    </option>
                                    <option selected={data.status === '0' ? "selected" : ''} value='0' >
                                      Incomplete
                                    </option>
                                  </select>
                                </td>
                                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap capitalize ">
                                  <button
                                    onClick={(e) => { viewTaskDetails(data?._id) }}
                                    className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                    <span className="sr-only">view</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                  </button>
                                  <button
                                    onClick={(e) => { editAgentDetails(data?._id) }}
                                    className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                    <span className="sr-only">Edit</span>
                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                      <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                    </svg>
                                  </button>
                                  <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteTask(data?._id)}>
                                    <span className="sr-only">Delete</span>
                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                      <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                                      <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>



              <div className='hidenav'>
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                  <header className="px-5 py-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">LIST<span className="text-slate-400 dark:text-slate-500 font-medium"></span></h2>
                  </header>
                  <div className="px-5 overflow-x-auto">
                    <table className="table table-centered align-middle table-nowrap mb-0 w-full">
                      <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                        {todoTaskList.map((data, index) => {
                          const truncatedTask = data.todo.length > 40 ? data.todo.slice(0, 40) + '...' : data.todo;
                          return (
                            <>
                              <div key={index} style={{ paddingBottom: "20px", marginTop: "20px" }}>
                                <table className="table-auto w-full dark:text-slate-300">
                                  <tbody className="">
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Task</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <Link to={`/dashboard/${data?.user_table_id}`}>
                                          {truncatedTask ? truncatedTask : "-"}
                                        </Link>
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Status</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        {data?.status === "0" ? "Incomplete" : "Complete"}
                                      </td>
                                    </tr>
                                    <tr style={{ borderBottomWidth: "0px" }}>
                                      <th className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <div className="font-semibold text-left">Actions</div>
                                      </th>
                                      <td className="py-3 px-2" scope="col" style={{ width: "50%" }}>
                                        <button
                                          onClick={(e) => { viewTaskDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">view</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" ><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" /></svg>
                                        </button>
                                        <button
                                          onClick={(e) => { editAgentDetails(data?._id) }}
                                          className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full">
                                          <span className="sr-only">Edit</span>
                                          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                            <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                                          </svg>
                                        </button>
                                        <button className="text-rose-500 hover:text-rose-600 rounded-full" onClick={() => deleteTask(data?._id)}>
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
        <ModalBlank id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add Task ">
          <form onSubmit={(e) => { handleTodoSubmit(e) }}>
            <div>
              <div className='flex items-center justify-between'>
                <span className="block pt-5 ps-5 pb-3" htmlFor="default">
                  <h1 className='text-bold  text-xl'>Add New Task</h1>
                </span>
                <span className="text-slate-700 dark:text-slate-700 hover:text-slate-900 dark:hover:text-slate-900 pt-1 me-5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(false); }}>
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </span>
              </div>
              <hr></hr>
              <div className="grid gap-5 md:grid-cols-1 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="default">
                    Task To-Do:
                  </label>
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
              </div>

              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn tm-background text-white">Save</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBlank>

        <ModalBlank id="feedback-modal" modalOpen={EditInfoModalOpen} setModalOpen={setEditInfoModalOpen} title="Edit Agent ">
          <form onSubmit={handleEditSubmit}>
            <div>
              <div className='flex items-center justify-between'>
                <span className="block pt-5 ps-5 pb-3" htmlFor="default">
                  <h1 className='text-bold  text-xl'>Edit Task</h1>
                </span>
                <span className="text-slate-700 dark:text-slate-700 hover:text-slate-900 dark:hover:text-slate-900 pt-1 me-5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditInfoModalOpen(false); }}>
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </span>
              </div>
              <hr></hr>
              <div className="grid gap-5 md:grid-cols-2 ps-5 pe-5 mt-5 mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="default">
                    Task Todo
                  </label>
                  <input id="default" className="form-input w-full" type="text" required name='task'
                    value={editFormData.task}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="default">
                    Status
                  </label>
                  <select className="form-select w-full" name='status' onChange={handleEditChange}>
                    <option disabled >Status</option>
                    <option selected={editFormData.status === '1' ? "selected" : ''} value='1'>
                      Complete
                    </option>
                    <option selected={editFormData.status === '0' ? "selected" : ''} value='0' >
                      Incomplete
                    </option>
                  </select>
                </div>
              </div>
              <hr></hr>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn tm-background text-white">update</button>
                </div>
              </div>
            </div>
          </form>
        </ModalBlank>

        <ModalBlank id="feedback-modal" modalOpen={viewInfoModalOpen} setModalOpen={setViewInfoModalOpen} title="View Task ">
          <div>
            <div className='flex items-center justify-between'>
              <span className="block pt-5 ps-5 pb-3" htmlFor="default">
                <h1 className='text-bold  text-xl'>View Task</h1>
              </span>
              <span className="text-slate-700 dark:text-slate-700 hover:text-slate-900 dark:hover:text-slate-900 pt-1 me-5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewInfoModalOpen(false); }}>
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </span>
            </div>
            <hr></hr>
            <div className="grid gap-5 md:grid-cols-1 ps-5 pe-5 mt-5 mb-5">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="default">
                  <span className='font-bold tm-color'> Task Todo : </span>
                  {editFormData.task}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="default">
                  <span className='font-bold tm-color'>  Status : </span> {editFormData.status === "0" ? "Incomplete" : "Complete"}
                </label>
              </div>
            </div>
            <hr></hr>
          </div>
        </ModalBlank>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}

export default TodoTaskListPage;
