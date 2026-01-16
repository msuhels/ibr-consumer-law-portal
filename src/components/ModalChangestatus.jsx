import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import jsPDF from 'jspdf';
import axios from 'axios';
import { UPDATE_STATUS_OF_DIPUTE } from "../API/api"
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { Select, Option, select } from "@material-tailwind/react";

function ModalChangestatus({ modalOpen, setModalOpen, idd, disputeval, getDisputeData, setDisputeval }) {
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    let statusObject = {
        equifax: {
            isActive: true,
            status: ''
        },
        experian: {
            isActive: true,
            status: ''
        },
        transunion: {
            isActive: true,
            status: ''
        }
    }
    const [status, setStatus] = useState(statusObject);

    const handalCheckbox = (type, e) => {
        let val = { ...status };

        if (type == 'Equifax') {

            if (e.target.checked) {
                val.equifax.isActive = true;
            } else {
                val.equifax.isActive = false;
                val.equifax.status = '';
            }
        }
        if (type == 'Experian') {
            if (e.target.checked) {
                val.experian.isActive = true;
            } else {
                val.experian.isActive = false;
                val.experian.status = '';
            }
        }
        if (type == 'TransUnion') {
            if (e.target.checked) {
                val.transunion.isActive = true;
            } else {
                val.transunion.isActive = false;
                val.transunion.status = '';
            }
        }
        setStatus(val);
    }

    const handalStatus = (type, v) => {
        let val = { ...status };

        if (type == 'Equifax') {
            val.equifax.status = v;
        }
        if (type == 'Experian') {
            val.experian.status = v;
        }
        if (type == 'TransUnion') {
            val.transunion.status = v;
        }
        setStatus(val);
    }

    const editsrecords = async () => {
        try {
            const response = await axios.post(UPDATE_STATUS_OF_DIPUTE, {
                status: status,
                id: disputeval._id
            }, { headers: { "Authorization": "Bearer " + token } });
            toast.success("Successfully updated!");
            getDisputeData();
            setModalOpen(false);
            setDisputeval("")
        } catch (error) {
            toast.error("Something went Wrong123");
        }
    }

    useEffect(() => {
        if (disputeval?.itemStatus) {
            setStatus(disputeval?.itemStatus);
        }
    }, [disputeval])

    return (
        <>
            <Transition className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity" show={modalOpen} enter="transition ease-out duration-200" enterStart="opacity-0" enterEnd="opacity-100" leave="transition ease-out duration-100" leaveStart="opacity-100" leaveEnd="opacity-0" aria-hidden="true" />
            <Transition id={idd} className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6" role="dialog" aria-modal="true" show={modalOpen} enter="transition ease-in-out duration-200" enterStart="opacity-0 translate-y-4" enterEnd="opacity-100 translate-y-0" leave="transition ease-in-out duration-200" leaveStart="opacity-100 translate-y-0" leaveEnd="opacity-0 translate-y-4" >
                <div className="bg-white dark-bg-slate-800 border border-transparent dark-border-slate-700 overflow-auto max-w-5xl w-full max-h-full rounded-xl no-scrollbar shadow-lg" >
                    <div className="mb-5">
                        <h1 className="pt-5 pb-4 m-2 rounded-xl bg-gray-200 text-black font-semibold  uppercase text-center">Edit Dispute Item</h1>
                    </div>
                    <div className=''>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">

                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center mb-4">
                                                <input onClick={(e) => handalCheckbox('Equifax', e)} checked={status.equifax.isActive} id="default-checkbox1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-checkbox1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Equifax</label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center mb-4">
                                                <input onClick={(e) => handalCheckbox('Experian', e)} checked={status.experian.isActive} id="default-checkbox2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-checkbox2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Experian</label>
                                            </div>

                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <div className="flex items-center mb-4">
                                                <input onClick={(e) => handalCheckbox('TransUnion', e)} checked={status.transunion.isActive} id="default-checkbox3" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-checkbox3" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">TransUnion</label>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            Status
                                        </th>
                                        <td className="px-6 py-4">
                                            {status.equifax.isActive &&
                                                <>
                                                    <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                        <select className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" onChange={(e) => handalStatus('Equifax', e.target.value)}>
                                                            <option value=''>Status</option>
                                                            <option value='resolved_deleted' selected={disputeval?.itemStatus?.equifax?.status === 'resolved_deleted' ? "selected" : ''}>
                                                                Resolved/Deleted
                                                            </option>
                                                            <option value='dispute' selected={disputeval?.itemStatus?.equifax?.status === 'dispute' ? "selected" : ''}>
                                                                Dispute
                                                            </option>
                                                            <option value='indispute' selected={disputeval?.itemStatus?.equifax?.status === 'indispute' ? "selected" : ''}>
                                                                In Dispute
                                                            </option>
                                                            {/* <option value='verify'>Verify</option> */}
                                                        </select>
                                                    </div>
                                                </>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {status.experian.isActive &&
                                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                    <select className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" onChange={(e) => handalStatus('Experian', e.target.value)}>
                                                        <option value=''>Status</option>
                                                        <option value='resolved_deleted' selected={disputeval?.itemStatus?.experian?.status === 'resolved_deleted' ? "selected" : ''}>
                                                            Resolved/Deleted
                                                        </option>
                                                        <option value='dispute' selected={disputeval?.itemStatus?.experian?.status === 'dispute' ? "selected" : ''}>
                                                            Dispute
                                                        </option>
                                                        <option value='indispute' selected={disputeval?.itemStatus?.experian?.status === 'indispute' ? "selected" : ''}>
                                                            In Dispute
                                                        </option>
                                                        {/* <option value='verify'>Verify</option> */}
                                                    </select>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {status.transunion.isActive &&
                                                <div className="p-[2px] rounded-[22px] max-w-sm hover:bg-gradient-to-r hover:from-red-600 hover:via-red-300 hover:to-red-100" >
                                                    <select className="form-select w-full py-3 px-4 rounded-[20px] text-gray-800 placeholder-gray-500 bg-gray-100 border-none" onChange={(e) => handalStatus('TransUnion', e.target.value)}>
                                                        <option value=''>Status</option>
                                                        <option value='resolved_deleted' selected={disputeval?.itemStatus?.transunion?.status === 'resolved_deleted' ? "selected" : ''}>
                                                            Resolved/Deleted
                                                        </option>
                                                        <option value='dispute' selected={disputeval?.itemStatus?.transunion?.status === 'dispute' ? "selected" : ''}>
                                                            Dispute
                                                        </option>
                                                        <option value='indispute' selected={disputeval?.itemStatus?.transunion?.status === 'indispute' ? "selected" : ''}>
                                                            In Dispute
                                                        </option>
                                                        {/* <option value='verify'>Verify</option> */}
                                                    </select>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="my-4 text-center">
                            <button onClick={() => { setModalOpen(false), setDisputeval("") }} className="btn text-white tm-background py-2 px-4 ">Close</button>
                            <button onClick={editsrecords} className="btn text-white py-2 px-4 tm-background ml-3">Edit</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
}

export default ModalChangestatus;
