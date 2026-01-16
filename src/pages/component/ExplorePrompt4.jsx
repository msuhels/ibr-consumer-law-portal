import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import copied_img from "../../images/copied-icon.png";

function ExplorePrompt4({ setShowExplorePrompt4, inputMessage, setInputMessage, showExplorePrompt4, showChatBox }) {

    function getText(e) {
        const textToCopy = e.currentTarget.parentElement.innerText.trim();
        navigator.clipboard.writeText(textToCopy);
        toast.success("Text Copied Successfully");
    }

    function handleSetInputMessage(e) {
        const textToCopy = e.currentTarget.parentElement.innerText.trim()
        if (inputMessage === textToCopy) {
            setInputMessage('');
        } else {
            setInputMessage(textToCopy);
        }
    }

    return (
        <>
            <div className="border pb-4 rounded-xl shadow-md">
                <div className={`flex justify-between rounded-xl ${showChatBox && showExplorePrompt4 ? "text-blk" : "text-white prompt-bg"}`}>
                    <h1 className={`px-4 py-6 ${showChatBox && showExplorePrompt4 ? "text-[#080D18] font-bold" : "font-bold text-white"}`}>Explore FCRA prompts</h1>
                    <button className="px-3 py-2" onClick={() => setShowExplorePrompt4(false)}>
                        <svg className="w-4 h-4 fill-current">
                            <path d="M7.95 6.536l4.242-4.243a1 1 0 111.412 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.412 1.412L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.412L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                        </svg>
                    </button>
                </div>
                <div className={`relative overflow-x-auto overflow-y-auto rounded-xl px-4 custom-scrollbar ${showChatBox && showExplorePrompt4 ? "h-[calc(100dvh-45dvh)]" : "h-80"}`}>
                    <table className="w-full text-sm text-left rtl:text-right text-[#080D18]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                        </thead>
                        <tbody>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute inaccuracies on your credit report under FCRA Section 1681i, providing documentation and evidence of the inaccuracies.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the removal of accounts or inquiries resulting from identity theft, referencing your rights under FCRA Section 1681c-2.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute the presence of outdated negative information on your credit report, citing the 7-year limit as per FCRA Section 1681c.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to address and request the correction of mixed or merged file errors, highlighting non-compliance with FCRA Section 1681e’s accuracy requirements.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to demand the removal of accounts opened fraudulently in your name, invoking your rights under FCRA Section 1681c-2 related to identity theft.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the deletion of unverified debt following a dispute, as per your rights under FCRA Section 1681i, if the credit bureau fails to verify the debt within the required timeframe.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to appeal for the correction and removal of inaccurately reported bankruptcy details, referencing the accuracy obligations under FCRA Section 1681e.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute incorrect delinquency dates on a credit account, citing FCRA Section 1681i for disputing and correcting inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the removal of duplicate debt entries, supported by the accuracy standards of FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to demand the removal of paid collections still reported on your credit report, citing the accuracy requirements under FCRA Section 1681a.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the update or removal of settled debts incorrectly listed as unpaid, invoking FCRA Section 1681i on the reinvestigation of disputed information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge the reinsertion of previously deleted items without proper notification, as outlined in FCRA Section 1681i(d).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to correct or remove inaccurately reported public record information, under the guidelines of FCRA Section 1681k for reporting public record information for employment purposes.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the removal of unauthorized hard inquiries, referencing the liability clauses in FCRA Section 1681n and 1681o.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to appeal for the correction of personal information errors (like address or name), citing your rights under FCRA Section 1681e for the accuracy and completeness of information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge the reporting of a debt as current when it should be marked as closed, based on the accuracy requirements in FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a charge-off reported on a paid account, citing FCRA Section 1681i(a), which mandates the investigation of disputed information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to demand the removal of a collection account wrongly associated with your report, referencing your rights under FCRA Section 1681e(b) for accurate information reporting.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the deletion of a foreclosure that exceeded the 7-year reporting limit, as outlined in FCRA Section 1681c.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a late payment that was reported while you were in deferment or forbearance, citing FCRA Section 1681i on the accuracy of reported information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge a student loan delinquency reported during a period of agreed suspension, under the accuracy and investigation requirements of FCRA Section 1681i.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute the reporting of a credit card account as “settled for less than full balance” if it was paid in full, invoking your rights under FCRA Section 1681i for the correction of inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the removal of an auto loan marked as defaulted despite timely payments, citing the accuracy standards mandated by FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a judgment that was vacated by the court but still appears on your credit report, referencing FCRA Section 1681i, which allows consumers to dispute and correct inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to contest the reporting of an old debt as new following its sale to a different creditor, based on the provisions of FCRA Section 1681c(a), which restricts the re-aging of old debts.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a credit card account reported as open and delinquent after it was closed and settled, invoking your dispute rights under FCRA Section 1681i.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to address a mortgage account inaccurately reported as in foreclosure, as per the requirements for accuracy and investigation stipulated in FCRA Section 1681i.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge the inclusion of unauthorized store credit accounts opened due to identity theft, referencing your rights under FCRA Section 1681c-2 regarding identity theft.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute the reporting of a co-signed loan as your personal debt, citing the accuracy provisions in FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the removal of a credit inquiry that you did not authorize, under the provisions of FCRA Section 1681n, which addresses civil liability for unauthorized disclosures.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute an incorrectly reported repossession, referencing your rights under FCRA Section 1681i for the correction of inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge a debt listed with an incorrect balance, citing FCRA Section 1681e(b) for the requirement of maximum possible accuracy of reported information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the deletion of a paid medical debt still appearing on your report, under the accuracy requirements of FCRA Section 1681i.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a bankruptcy notation that exceeds the 10-year reporting limitation, as outlined in FCRA Section 1681c.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge a duplicate debt listing from different creditors, citing the prohibition of misleading information under FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute the reporting of an old account as newly delinquent, invoking FCRA Section 1681c which restricts the re-aging of debts.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request correction of a credit limit underreporting, based on the FCRA Section 1681e(b) accuracy requirement.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a wrongful state tax lien listing, referring to FCRA Section 1681i for reinvestigation of disputed information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a utility account reported in error, citing your right to accurate reporting under FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge a personal loan account incorrectly marked as “charge-off”, referencing FCRA Section 1681i(a) for disputing inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a rental debt mistakenly attributed to you, invoking FCRA Section 1681e(b) for the accuracy of information reporting.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to address a credit card account showing incorrect late payments, under FCRA Section 1681i which mandates the accuracy and investigation of disputed information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a debt associated with a dissolved business entity, citing FCRA Section 1681i for disputing personal liability for business debts.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request removal of a debt resulting from identity theft, referencing FCRA Section 1681c-2 for blocking information resulting from identity theft.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge a reported debt that was included in a bankruptcy discharge, as per FCRA Section 1681i on the accuracy of reported information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute an auto loan incorrectly marked as delinquent, citing the FCRA Section 1681i’s provisions for disputing and correcting inaccurate information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to address an incorrect employment history on your credit report, under the accuracy standards mandated by FCRA Section 1681e(b).
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to dispute a hard credit inquiry made without your consent, invoking your rights under FCRA Section 1681n for civil liability for unauthorized disclosures.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge an erroneous eviction record on your credit report, citing your dispute rights under FCRA Section 1681i.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to request the correction of a mixed credit file with another consumer’s information, referencing FCRA Section 1681e(b) for the requirement of accurate data maintenance by credit bureaus.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681c-2: "Explain the process and requirements for a consumer reporting agency to block information resulting from identity theft."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681c-3: "Describe how a consumer reporting agency must handle adverse information related to trafficking."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681d: "Discuss the obligations of a person or entity when procuring or preparing an investigative consumer report."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681e: "Explain the compliance procedures that consumer reporting agencies must follow to ensure accuracy and proper use of consumer reports."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681f: "What are the conditions under which a consumer reporting agency may disclose identifying information to a governmental agency?"
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681g: "Describe the rights of consumers to access information in their consumer files and the responsibilities of consumer reporting agencies in this regard."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681h: "What are the conditions and forms of disclosure to consumers that a consumer reporting agency must adhere to?"
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681i: "Explain the procedure and consumer rights involved in disputing the accuracy of information in a consumer report."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681j: "Discuss the circumstances under which a consumer reporting agency can charge for certain disclosures."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681k: "What are the guidelines for consumer reporting agencies when furnishing consumer reports for employment purposes, especially regarding public record information?"
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681l: "Describe the restrictions placed on investigative consumer reports regarding the inclusion of adverse information."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681m: "Explain the requirements and responsibilities of users of consumer reports when taking adverse action based on the information in these reports."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681n: "Discuss the civil liability implications for willful noncompliance with the FCRA."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681o: "What are the consequences for negligent noncompliance under the FCRA?"
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681p: "Explain the jurisdictional aspects and limitations of actions under the FCRA."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681q: "Describe the penalties for obtaining consumer information under false pretenses."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681r: "What are the penalties for officers or employees of consumer reporting agencies who knowingly provide unauthorized information?"
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        1681s: "Discuss the administrative enforcement of the FCRA, including the roles of various government agencies."
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to a consumer reporting agency disputing the accuracy of child support arrears reported on your credit report, citing FCRA Section 1681i and providing documentation of payment or modification of the support order.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Draft a letter to request the removal of a child support entry from your credit report that is older than seven years, referencing the FCRA's guidelines on the reporting duration of debt, and presenting evidence of the date of the original delinquency.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Compose a letter to dispute child support information listed on your credit report as a result of identity theft or fraud, using FCRA Section 1681c-2 to support your request for immediate blockage of this information, and include a copy of the identity theft report or police report.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Prepare a letter to challenge the reinsertion of previously disputed child support information on your credit report, invoking your rights under FCRA Section 1681i(a)(5)(B), and provide evidence to support the continued dispute of this information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Create a letter to a consumer reporting agency to correct child support information that has been inaccurately reported due to administrative errors, citing FCRA Section 1681s-2(a), and include documents from the child support enforcement agency as proof.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter requesting an investigation into the reporting of child support debt that has been paid but still appears as outstanding on your credit report, referring to FCRA Section 1681i and including proof of payment.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Develop a letter to dispute the reporting of child support that is incorrectly labeled as 'in arrears' when it is actually in deferment or forbearance, supporting your claim with the appropriate documentation and citing relevant sections of the FCRA.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to challenge the inclusion of duplicated child support entries on your credit report, citing FCRA Section 1681e(b) for accuracy requirements, and attach supporting documents to demonstrate the duplication error.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Draft a letter to address the incorrect amount of child support debt reported on your credit report, referencing FCRA Section 1681s-2(a), and provide court documents or payment receipts to prove the accurate amount.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Compose a letter to a consumer reporting agency requesting a reinvestigation of child support payment history, invoking FCRA Section 1681i, and include a chronological payment record to support your claim of timely payments.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Prepare a letter disputing the reporting of child support as delinquent during a period of legally granted suspension or adjustment, using FCRA Section 1681i as a basis, and attach court order or agreement documents evidencing the suspension or adjustment period.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Create a letter to question the reporting agency's failure to update your credit report post-discharge of child support debt, citing FCRA Section 1681i for dispute resolution, and include a copy of the discharge or completion certificate from the child support agency.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Write a letter to address the absence of a notice of dispute on your credit report regarding contested child support entries, referring to FCRA Section 1681i(c), and reiterate your ongoing dispute and request its notation on your report.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Develop a letter to request a detailed explanation from the reporting agency regarding the methodology used to calculate the overdue child support reported, as per FCRA Section 1681g(a)(1), and ask for clarification to ensure the accuracy of the reported information.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                <th class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                </th>
                                <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                    <div>
                                        Compose a letter to a consumer reporting agency to challenge the reinsertion of a child support entry you had successfully disputed earlier, referencing FCRA Section 1681i(a)(5)(B), and include previous dispute records and current evidence to support your position.
                                    </div>
                                    <button className=" py-1 rounded-md" onClick={getText} >
                                        <img className="" src={copied_img} width="12" height="12" alt="User" />
                                        <span style={{ fontSize: "10px", color: "blue" }}>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default ExplorePrompt4;