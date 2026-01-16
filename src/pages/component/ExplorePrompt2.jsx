import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import copied_img from "../../images/copied-icon.png";

function ExplorePrompt2({ setShowExplorePrompt2, inputMessage, setInputMessage, showExplorePrompt2, showChatBox }) {
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
                <div className="border pb-4 rounded-xl shadow-md ">
                    <div className={`flex justify-between rounded-xl ${showChatBox && showExplorePrompt2 ? "text-blk" : "text-white prompt-bg"}`}>
                        <h1 className={`px-4 py-6 ${showChatBox && showExplorePrompt2 ? "text-[#080D18] font-bold " : "font-bold text-white"}`}>Explore FDCPA prompts</h1>

                        <button className="px-3 py-2" onClick={() => setShowExplorePrompt2(false)}>
                            <svg className="w-4 h-4 fill-current">
                                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.412 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.412 1.412L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.412L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                            </svg>
                        </button>
                    </div>
                    <div className={`relative overflow-x-auto overflow-y-auto rounded-xl px-4 custom-scrollbar ${showChatBox && showExplorePrompt2 ? "h-[calc(100dvh-45dvh)]" : "h-80"}`}>
                        <table className="w-full text-sm text-left rtl:text-right text-[#080D18]">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                            </thead>
                            <tbody>
                                <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                    <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                    </th>
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage} >
                                        <div>
                                            Abusive Practices in Debt Collection: Discuss the negative impacts of abusive, deceptive, and unfair debt collection practices on personal bankruptcies, marital stability, employment, and individual privacy.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Inadequacy of Existing Laws: Explain why current laws and procedures are insufficient in protecting consumers from abusive debt collection practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Non-Abusive Collection Methods: Explore alternative, ethical methods for effective debt collection that avoid misrepresentation or abusive practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Interstate Commerce and Debt Collection: Analyze the impact of abusive debt collection practices in interstate commerce and their effect on both interstate and intrastate activities.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Objectives of FDCPA: Discuss the primary goals of the FDCPA in eliminating abusive debt collection practices and ensuring fair competition among collectors.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Definitions in FDCPA: Clarify the definitions of key terms in the FDCPA, such as 'Bureau,' 'communication,' 'consumer,' 'creditor,' 'debt,' and 'debt collector.'
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Acquisition of Location Information: Explain the rules governing how debt collectors may acquire location information about consumers.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Communication Restrictions in Debt Collection: Discuss the limitations and requirements for debt collectors when communicating with consumers, including time, place, and manner restrictions.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Harassment or Abuse in Debt Collection: Explore the prohibitions on harassment, abuse, and misleading tactics in debt collection, including the use of violence, obscene language, and false representations.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            False or Misleading Representations: Discuss various false or misleading representations that are prohibited in the context of debt collection.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Unfair Practices in Debt Collection: Explain the restrictions on unfair practices by debt collectors, such as collecting unauthorized amounts and misusing postdated checks.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Validation of Debts: Discuss the requirements for debt collectors to validate debts and the consumer's rights in disputing debt validity.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Multiple Debts Management: Explain the rules for applying payments when a consumer owes multiple debts, focusing on consumer directives and disputed debts.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Legal Actions by Debt Collectors: Discuss the venue requirements and restrictions for legal actions taken by debt collectors.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Furnishing Deceptive Forms: Explain the prohibition on creating and using deceptive forms in debt collection practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Civil Liability under FDCPA: Discuss the civil liabilities faced by debt collectors for non-compliance with the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Administrative Enforcement of FDCPA: Explain the role of various federal agencies, including the FTC, in enforcing the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Reports to Congress by the Bureau: Discuss the requirements and contents of the Bureau's reports to Congress regarding the administration of FDCPA functions.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Relation to State Laws: Explain how the FDCPA interacts with and relates to state laws governing debt collection practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Exemptions for State Regulation: Describe the conditions under which the Bureau may exempt certain debt collection practices from the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Exceptions for Bad Check Enforcement Programs: Discuss the specific conditions under which certain bad check enforcement programs operated by private entities are exempt from the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Writing a Letter for Harassing Calls: I've been receiving multiple harassing calls from a debt collector. How do I draft a letter to stop these calls under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Disputing a Debt Collection Letter: I received a debt collection letter for a debt I don't recognize. How do I write a dispute letter in accordance with the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Calling to Report Inadequate Laws Protection: The current laws seem insufficient to protect me from a debt collector's abuses. How should I approach a consumer protection agency to discuss this issue?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Filing a Complaint for Interstate Commerce Abuse: A debt collector from another state is using abusive practices. How do I file a complaint citing the FDCPA's interstate commerce rules?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Using FDCPA Objectives to Challenge Unfair Practices: I've been subjected to unfair debt collection practices. How do I use the objectives of the FDCPA to challenge these practices effectively?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Understanding Key Terms to Protect My Rights: I'm confused about the terms 'creditor' and 'debt collector.' How can I clarify these to better understand my rights under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Disputing Improper Location Information Acquisition: A debt collector acquired my location information without my consent. How do I dispute this action under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Challenging a Debt Collector's Inconvenient Communication: A debt collector contacted me at an inconvenient time. How do I assert my rights under the FDCPA in this situation?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Addressing Harassment Through Legal Action: I'm facing harassment from a debt collector. How do I take legal action under the FDCPA's harassment provisions?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Disputing False Representations About My Debt: I found false representations about my debt in a collection notice. How do I dispute these claims under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Challenging Unfair Extra Fees: A debt collector is trying to charge me extra fees. How do I challenge these fees using the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Requesting Debt Validation: I doubt the validity of a debt I'm being charged for. How do I formally request debt validation under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Directing Payment Allocation for Multiple Debts: I have multiple debts and want to direct how my payment is applied. How do I communicate this in line with the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Addressing Improper Legal Action Venue: A debt collector filed a lawsuit in an inappropriate venue. How do I address this issue under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Challenging the Use of Deceptive Forms: I received a deceptive form from a debt collector. How do I challenge this practice under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Filing a Civil Lawsuit for FDCPA Violation: I believe a debt collector violated the FDCPA. How do I file a civil lawsuit in this situation?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Reporting to an Agency for FDCPA Enforcement: I want to report a debt collector's abusive practices. Which agency should I contact for FDCPA enforcement?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Utilizing Bureau's Congressional Reports for Advocacy: How can I use the Bureau's reports to Congress to advocate for stronger consumer protections under the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Leveraging State Laws for Greater Protection: I live in a state with stronger consumer protection laws than the FDCPA. How do I leverage these laws in my situation?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Understanding Exemptions for State-Regulated Practices: My state has specific debt collection practices. How do I understand if they are exempt from the FDCPA?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Addressing Bad Check Enforcement Program Issues: I'm dealing with a private entity under a bad check enforcement program. How do I determine if they are exempt from the FDCPA and what are my rights?
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Abusive Practices Impact Case: A consumer facing repeated harassing calls from a debt collector files a complaint. Discuss the potential FDCPA violations and the impact on the consumer's life, citing specific abusive practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Inadequacy of Laws Example: Describe a scenario where a consumer's rights are violated due to insufficient legal protections against debt collection abuses. Explain how the FDCPA could be strengthened to better protect consumers.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Ethical Debt Collection Scenario: Illustrate a case where a debt collector successfully recovers debt using ethical practices compliant with the FDCPA, highlighting effective but non-abusive collection methods.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Interstate Commerce Impact Case: Explain a situation where a debt collector's abusive practices across state lines affected both the consumer and the flow of interstate commerce, discussing the relevance of the FDCPA in such cases.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Objectives of FDCPA in Practice: Present a case where a consumer is educated about their rights under the FDCPA and uses this knowledge to challenge unfair debt collection practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Key Terms in Action: Provide examples of situations where understanding the definitions of terms like 'consumer' and 'debt collector' are crucial in applying the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Acquiring Location Information Scenario: Illustrate a case where a debt collector improperly acquires a consumer's location information, violating FDCPA rules.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Communication Restrictions Scenario: Describe a situation where a debt collector contacts a consumer at an inconvenient time, and the consumer invokes their rights under the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Dealing with Harassment Case: Provide an example where a consumer faces harassment from a debt collector and takes legal action under the FDCPA's harassment and abuse provisions.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            False Representations Case Study: Discuss a real or hypothetical case where a debt collector makes false representations about a debt and how the consumer uses the FDCPA to challenge these claims.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Unfair Practices Example: Illustrate a scenario where a debt collector charges extra fees not authorized in the original credit agreement, and how the consumer addresses this under the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Validation of Debt Request: Present a case where a consumer requests validation of a debt as per FDCPA guidelines and how this affects the collection process.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Multiple Debts Allocation Case: Discuss how a consumer directs the allocation of their payment in a situation with multiple debts, in line with FDCPA rules.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Legal Action Venue Scenario: Describe a case where a debt collector sues a consumer and how the venue requirements of the FDCPA are relevant.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Using Deceptive Forms Case: Provide an example of a debt collector using deceptive forms and how a consumer might use the FDCPA to challenge this practice.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Civil Liability for Violations: Discuss a scenario where a consumer sues a debt collector for FDCPA violations, focusing on the potential civil liabilities.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Administrative Enforcement Example: Illustrate how a federal agency enforces the FDCPA in a case of reported debt collection abuse.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Bureau's Congressional Report Use Case: Describe how the Bureau's report to Congress on FDCPA enforcement might impact future consumer protection policies.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            State Law and FDCPA Interaction: Provide a scenario where a state law offers greater consumer protection than the FDCPA and how consumers might benefit from this.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Exemption for State Regulation Case: Discuss a situation where state-regulated debt collection practices are exempt from FDCPA requirements.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Bad Check Enforcement Program Exception: Illustrate a case where a private entity operating a bad check enforcement program is exempt from being classified as a debt collector under the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Writing a Cease and Desist Letter: "I've been receiving harassing calls from a debt collector. How do I write a cease and desist letter under the FDCPA to stop these calls?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Crafting a Debt Dispute Letter: "I received a debt collection notice for a debt I don't recognize. What should I include in my dispute letter to ensure it's compliant with the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Contacting a Consumer Protection Agency: "I feel the current laws aren't protecting me enough from debt collector abuses. How do I effectively communicate my concerns to a consumer protection agency?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Filing an Interstate Commerce Abuse Complaint: "A debt collector from another state is using abusive practices against me. What's the process for filing a complaint that leverages the FDCPA’s interstate commerce rules?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Challenging Unfair Collection Practices: "I believe I’m being subjected to unfair debt collection practices. How can I use the FDCPA’s objectives to challenge and report these practices?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Understanding FDCPA Terms for Personal Protection: "I'm confused about the terms 'creditor' and 'debt collector' in the FDCPA. How can I get a clear understanding to protect my rights?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Disputing Unauthorized Acquisition of Location Information: "A debt collector acquired my location information without my permission. How do I file a dispute under the FDCPA for this violation?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Responding to Inconvenient Debt Collector Communication: "A debt collector contacted me at a time I consider inconvenient. How do I use the FDCPA to address and prevent this?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Taking Legal Action Against Harassment: "I’m facing harassment from a debt collector. How do I take legal action according to the harassment provisions in the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Disputing False Representations on Debt: "A collection notice has false information about my debt. How do I dispute this under the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Challenging Unauthorized Fees by a Debt Collector: "I'm being charged unauthorized fees by a debt collector. What steps should I take under the FDCPA to challenge these fees?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Requesting Validation of a Disputed Debt: "I doubt the legitimacy of a debt I'm being charged. How do I formally request its validation under the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Directing Allocation of Payments on Multiple Debts: "I want to direct how my payment is allocated among my multiple debts. What's the FDCPA-compliant way to communicate this?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Addressing a Wrong Venue for Legal Action: "A debt collector has filed a lawsuit against me in an inappropriate venue. How do I use the FDCPA to address this?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Dealing with Deceptive Forms from Debt Collectors: "I received a form from a debt collector that seems deceptive. How do I challenge this under the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Initiating a Civil Lawsuit for FDCPA Violations: "I believe a debt collector has violated the FDCPA. What are the steps to initiate a civil lawsuit?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Reporting FDCPA Violations to Agencies: "I need to report a debt collector’s abusive practices. Which agency should I contact for enforcing the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Using Bureau’s Reports for Advocacy: "How can I use the Bureau’s reports to Congress on the FDCPA for advocating stronger consumer protection laws?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Leveraging State Laws Alongside the FDCPA: "My state has stronger consumer protection laws than the FDCPA. How do I use these laws to my advantage?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Understanding State Exemptions from the FDCPA: "My state has specific debt collection practices. How do I find out if they are exempt from the FDCPA?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Navigating Bad Check Enforcement Program Exemptions: "I’m dealing with a private entity under a bad check enforcement program. How do I determine if they are exempt from the FDCPA, and what are my rights?"
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Draft a letter citing § 1692e to dispute a debt collection notice based on false or misleading representations by the collector.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a letter challenging a debt collection notice where the collector exaggerated the debt amount, referencing the prohibition of false or misleading representations under § 1692e."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a request for validation of a debt under § 1692g after receiving a collection notice.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Draft a request to a debt collector for full debt validation, including the debt amount and creditor details, under § 1692g, following a collection notice that lacks clear debt information."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Create a letter to a debt collector invoking § 1692c to stop contact at inconvenient times.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Develop a letter instructing a debt collector to cease communication during certain hours, as allowed under Â§ 1692c, due to the calls being a disturbance at your workplace."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Develop a response to a debt collector who violated Â§ 1692d by engaging in harassment or abusive practices.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Formulate a response to a debt collector who used threatening language, citing the prohibition of harassment or abuse under Â§ 1692d."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a complaint to a regulatory body about a debt collector's use of deceptive forms as per Â§ 1692j.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a complaint to the Consumer Financial Protection Bureau about a debt collector using misleading forms in violation of Â§ 1692j."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Draft a letter to a debt collector addressing the issue of multiple debts under Â§ 1692h.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Create a letter to a debt collector specifying the allocation of your payments to the intended debt, as per the provisions of Â§ 1692h, when dealing with multiple debts."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Compose a dispute letter for a lawsuit filed in an inconvenient venue as per Â§ 1692i.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Write a dispute letter regarding a debt collectorâ€™s lawsuit filed in a non-local court, contrary to the requirements of Â§ 1692i."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Develop a letter citing Â§ 1692k to seek civil liability for a violation of the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Craft a letter to a debt collector outlining your intention to seek civil liability under Â§ 1692k for their violations of the FDCPA, including specific instances of misconduct."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a letter to invoke Â§ 1692n in a state with stronger debt collection laws.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Draft a letter to a debt collector highlighting stronger state-specific debt collection laws and your rights under Â§ 1692n."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Compose a letter challenging a debt collector's action exempted by a state under Â§ 1692o.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Create a letter disputing a debt collector's practices that are supposedly exempt under state regulation as per Â§ 1692o, arguing the exemption's inapplicability to your case."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a letter using Â§ 1692e to challenge a debt listed on your report that is not yours.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Draft a letter to dispute a debt on your consumer report that you do not recognize, citing violations of Â§ 1692e regarding false or misleading representations by the debt collector."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Create a letter citing Â§ 1692g for a request to validate an old debt that reappeared on your report.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a validation request for an old debt that has unexpectedly reappeared on your credit report, referring to your rights under Â§ 1692g."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Draft a letter under Â§ 1692d to report a debt collector's abusive language during phone calls.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Prepare a letter to report a debt collector who used abusive and threatening language over phone calls, in violation of Â§ 1692d."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a complaint regarding a debt collector's misleading statements under Â§ 1692e related to the legal status of a debt.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a complaint against a debt collector who falsely claimed that a debt is subject to legal action, violating Â§ 1692e's prohibition on misleading statements."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Develop a letter to address the splitting of a single debt into multiple accounts by a collector, contrary to Â§ 1692f.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Draft a letter challenging a debt collector's action of splitting a single debt into multiple accounts, which may be deemed an unfair practice under Â§ 1692f."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Create a letter to a debt collector demanding the cessation of communication at your workplace as per Â§ 1692c.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Write a letter to a debt collector demanding they stop contacting you at your workplace, invoking your right to privacy under Â§ 1692c."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a letter disputing a debt based on insufficient information provided as required under Â§ 1692g.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a dispute letter for a debt listed on your report, citing insufficient information provided about the debt as required by Â§ 1692g."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Draft a letter to challenge a credit report entry based on harassment by a debt collector, referring to Â§ 1692d.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Prepare a letter challenging an entry on your credit report, detailing the harassment you faced from a debt collector, which is prohibited under Â§ 1692d."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Develop a letter to address a violation of your rights in a legal action by a debt collector as specified in Â§ 1692i.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Write a letter addressing a debt collector's violation of your legal rights in a court proceeding, as outlined in Â§ 1692i."
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Prompt: Write a letter invoking Â§ 1692k to seek damages for a violation of the FDCPA.
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
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            Example: "Compose a letter seeking damages from a debt collector for specific violations of the FDCPA under Â§ 1692k."
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
export default ExplorePrompt2;