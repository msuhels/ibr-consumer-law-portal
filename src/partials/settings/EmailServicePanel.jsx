import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  GET_USER_SMTP_DETAILS,
  ADD_SMTP_DETAILS,
  EDIT_SMTP_DETAILS,
} from "../../API/api.js";
import Cookies from "js-cookie";
import moment from "moment";

import Image from "../../images/user-avatar-80.png";

function EmailServicePanel(userData) {
  let { user, token } = JSON.parse(Cookies.get("user_token"));

  const [loaderSignin, setloaderSignin] = useState(false);
  const [smtpDetails, setSmtpDetails] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    service: "",
  });

  const [editSmtpDetails, setEditSmtpDetails] = useState({
    id: "",
    host: "",
    port: "",
    username: "",
    password: "",
    service: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSmtpDetails({ ...smtpDetails, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSmtpDetails({ ...editSmtpDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloaderSignin(true);
    try {
      const response = await axios.post(
        ADD_SMTP_DETAILS,
        { smtpDetails, userId: user?._id },
        { headers: { Authorization: "Bearer " + token } }
      );
      setloaderSignin(false);
      toast.success(response.data.message || "SMTP details added successfully");
      getSmtpDetails();
    } catch (error) {
      setloaderSignin(false);
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Failed to update SMTP details"
      );
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setloaderSignin(true);
    try {
      const response = await axios.post(
        EDIT_SMTP_DETAILS,
        { smtpDetails: editSmtpDetails, userId: user?._id },
        { headers: { Authorization: "Bearer " + token } }
      );
      setloaderSignin(false);
      toast.success(
        response.data.message || "SMTP details updated successfully"
      );
      getSmtpDetails();
    } catch (error) {
      setloaderSignin(false);
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Failed to update SMTP details"
      );
    }
  };

  const getSmtpDetails = async () => {
    try {
      const response = await axios.post(
        GET_USER_SMTP_DETAILS,
        { userId: user?._id },
        { headers: { Authorization: "Bearer " + token } }
      );
      setEditSmtpDetails({
        id: response.data.userSmtp._id,
        host: response.data.userSmtp.host,
        port: response.data.userSmtp.port,
        username: response.data.userSmtp.username,
        password: response.data.userSmtp.password,
        service: response.data.userSmtp.service,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.role === "agent") {
      getSmtpDetails();
    }
  }, []);

  return (
    <>
      <div className="grow">
        {editSmtpDetails?.host && editSmtpDetails?.port ? (
          <>
            <form
              className="space-y-8 px-5 divide-gray-200 rounded-xl bg-white"
              onSubmit={handleEditSubmit}
            >
              <div className="p-6 space-y-6">
                <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
                  SMTP Details
                </h2>
                <section>
                  <div className="mt-5">
                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          HOST
                        </label>
                        <input
                          id="host"
                          name="host"
                          value={editSmtpDetails.host}
                          onChange={handleEditChange}
                          autoComplete="host"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          PORT
                        </label>
                        <input
                          name="port"
                          id="port"
                          value={editSmtpDetails.port}
                          onChange={handleEditChange}
                          autoComplete="port"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          Services
                        </label>
                        <input
                          name="service"
                          id="service"
                          value={editSmtpDetails.service}
                          onChange={handleEditChange}
                          autoComplete="service"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          USERNAME
                        </label>
                        <input
                          id="username"
                          name="username"
                          value={editSmtpDetails.username}
                          onChange={handleEditChange}
                          autoComplete="username"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          PASSWORD
                        </label>
                        <input
                          name="password"
                          id="password"
                          value={editSmtpDetails.password}
                          onChange={handleEditChange}
                          autoComplete="password"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              {/* Panel footer */}
              <footer>
                <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex self-end">
                    <>
                      {loaderSignin ? (
                        <button
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                          disabled
                        >
                          <svg
                            className="animate-spin w-4 h-4 fill-current shrink-0"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                          <span className="ml-2">Update SMTP Details</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn tm-background text-white ml-3"
                        >
                          Update SMTP Details
                        </button>
                      )}
                    </>
                    {/* <Link to="/updated-card-details" className="btn tm-background text-white ml-3">Update Card Details</Link> */}
                  </div>
                </div>
              </footer>
            </form>
          </>
        ) : (
          <>
            <form
              className="space-y-8 px-5 divide-gray-200 rounded-xl bg-white"
              onSubmit={handleSubmit}
            >
              <div className="p-6 space-y-6">
                <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">
                  SMTP Details
                </h2>
                <section>
                  <div className="mt-5">
                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          HOST
                        </label>
                        <input
                          id="host"
                          name="host"
                          value={smtpDetails.host}
                          onChange={handleChange}
                          autoComplete="host"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          PORT
                        </label>
                        <input
                          name="port"
                          id="port"
                          value={smtpDetails.port}
                          onChange={handleChange}
                          autoComplete="port"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          Services
                        </label>
                        <input
                          name="service"
                          id="service"
                          value={smtpDetails.service}
                          onChange={handleChange}
                          autoComplete="service"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="name"
                        >
                          USERNAME
                        </label>
                        <input
                          id="username"
                          name="username"
                          value={smtpDetails.username}
                          onChange={handleChange}
                          autoComplete="username"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="text"
                        />
                      </div>
                      <div className="sm:w-1/2">
                        <label
                          className="block text-md font-semibold mb-2"
                          style={{ color: "#080D18" }}
                          htmlFor="business-id"
                        >
                          PASSWORD
                        </label>
                        <input
                          name="password"
                          id="password"
                          value={smtpDetails.password}
                          onChange={handleChange}
                          autoComplete="password"
                          required
                          className="form-input w-full py-3 px-4 rounded-2xl text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              {/* Panel footer */}
              <footer>
                <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex self-end">
                    <>
                      {loaderSignin ? (
                        <button
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                          disabled
                        >
                          <svg
                            className="animate-spin w-4 h-4 fill-current shrink-0"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                          </svg>
                          <span className="ml-2">Add SMTP Details</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn tm-background text-white ml-3"
                        >
                          Add SMTP Details
                        </button>
                      )}
                    </>
                    {/* <Link to="/updated-card-details" className="btn tm-background text-white ml-3">Update Card Details</Link> */}
                  </div>
                </div>
              </footer>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default EmailServicePanel;
