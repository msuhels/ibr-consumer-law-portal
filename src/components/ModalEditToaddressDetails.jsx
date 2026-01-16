import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { GET_USER_DETAILS, UPDATE_USER_DETAILS } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { Select, Option, select } from "@material-tailwind/react";
import { useParams } from "react-router-dom";


function ModalEditToaddressDetails({ modalOpen, setModalOpen, idd, disputeval, getDisputeData }) {
    const { id } = useParams();
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [userdetails, setUserdetails] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserdetails({ ...userdetails, [name]: value });

    };

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        let URL = GET_USER_DETAILS(id);
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

    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsyl vania',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
    ];


    const updateUser = async (e) => {
        e.preventDefault();
        const userDetailsWithID = {
            ...userdetails,
            user_id: id
        };
        await axios
            .post(UPDATE_USER_DETAILS, userDetailsWithID,
                {
                    headers: { "Authorization": "Bearer " + token }
                })
            .then((res) => {
                if (res) {
                    getUserData()
                    setModalOpen(false)
                    toast.success("User updated successfully!");
                    window.location.reload();
                }
            })
            .catch((error) => {
                // toast.error(error);
                toast.error(error.response.data);
            });
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    return (
        <>
            <Transition id={idd} className="fixed inset-0 z-50 top-50 overflow-hidden mt-5 pt-5 flex items-start top-20 mb-4 justify-center px-4 sm:px-6" role="dialog" aria-modal="true" show={modalOpen} enter="transition ease-in-out duration-200" enterStart="opacity-0 translate-y-4" enterEnd="opacity-100 translate-y-0" leave="transition ease-in-out duration-200" leaveStart="opacity-100 translate-y-0" leaveEnd="opacity-0 translate-y-4" >
                <div className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto max-w-5xl w-full max-h-full rounded-xl no-scrollbar shadow-lg" >
                    <div className="px-5 py-5  border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-2xl text-slate-800 dark:text-slate-100">Send from address missing! Please fill in the address to generate letters.</div>
                            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400" onClick={closeModal} >
                                <div className="sr-only">Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="grow  border-t border-slate-200">
                        <form
                            className="space-y-8 px-4 divide-gray-200 rounded-xl bg-white"
                            onSubmit={updateUser}
                        >
                            <div className="p-6 space-y-6">
                                <section>
                                </section>
                                <section>
                                    <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                        <div className="sm:w-1/3">
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="name">Address</label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input
                                                    id="address"
                                                    name="address"
                                                    value={userdetails.address}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="address"
                                                    placeholder="Address"
                                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:w-1/3">
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">City</label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <input
                                                    name="city"
                                                    id="city"
                                                    required
                                                    value={userdetails.city}
                                                    onChange={handleChange}
                                                    autoComplete="city"
                                                    placeholder="City"
                                                    className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                            </div>
                                        </div>
                                        <div className="sm:w-1/3">
                                            <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">State</label>
                                            <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                <select
                                                    required
                                                    name="state"
                                                    value={userdetails.state}
                                                    onChange={handleChange}
                                                    autoComplete="state"
                                                    className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none"
                                                >
                                                    <option value="">Select a state</option>
                                                    {states.map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className="mt-5">
                                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">

                                            <div className="sm:w-1/3">
                                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Zip</label>
                                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                    <input
                                                        required
                                                        name="zip"
                                                        value={userdetails.zip}
                                                        onChange={handleChange}
                                                        autoComplete="zip"
                                                        placeholder="Code"
                                                        className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" maxLength={5} />
                                                </div>
                                            </div>

                                            <div className="sm:w-1/3">
                                                <label className="block text-md font-semibold mb-2" style={{ color: '#080D18' }} htmlFor="business-id">Phone</label>
                                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                    <input name="phone"
                                                        required
                                                        value={userdetails.phone}
                                                        onChange={handleChange}
                                                        placeholder="Phone"
                                                        autoComplete="phone" className="form-input w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" type="text" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <footer>
                                <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex self-end">
                                        <button type="submit" className="btn tm-background text-white ml-3">Update Changes</button>
                                    </div>
                                </div>
                            </footer>
                        </form>
                    </div>
                </div>
            </Transition>
        </>
    );
}

export default ModalEditToaddressDetails;
