import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import copied_img from "../../images/copied-icon.png";

function ExplorePrompt3({ setShowExplorePrompt3, inputMessage, setInputMessage, showExplorePrompt3, showChatBox }) {

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
                    <div className={`flex justify-between rounded-xl ${showChatBox && showExplorePrompt3 ? "text-blk" : "text-white prompt-bg"}`}>
                        <h1 className={`px-4 py-6 ${showChatBox && showExplorePrompt3 ? "text-[#080D18] font-bold " : "font-bold text-white"}`}>Explore TILA prompts</h1>

                        <button className="px-3 py-2" onClick={() => setShowExplorePrompt3(false)}>
                            <svg className="w-4 h-4 fill-current">
                                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.412 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.412 1.412L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.412L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                            </svg>
                        </button>
                    </div>
                    <div className={`relative overflow-x-auto overflow-y-auto rounded-xl px-4 custom-scrollbar ${showChatBox && showExplorePrompt3 ? "h-[calc(100dvh-45dvh)]" : "h-80"}`}>
                        <table className="w-full text-sm text-left rtl:text-right text-[#080D18]">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                            </thead>
                            <tbody>
                                <tr class="border-b tm-prompt-color1 dark:bg-gray-800 rounded-l-xl">
                                    <th scope="row" class="px-1 py-4  font-medium  whitespace-nowrap dark:text-white rounded-l-xl ">
                                    </th>
                                    <td class="px-2 py-4 cursor-pointer	tm-prompt-color" onClick={handleSetInputMessage}>
                                        <div>
                                            "Define the term 'Bureau'."
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
                                            "What does the term 'Board' refer to?"
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
                                            "Define the term 'organization'."
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
                                            "What is the definition of 'person'?"
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
                                            "Explain the term 'credit'."
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
                                            "Who is considered a 'creditor'?"
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
                                            "What does the term 'credit sale' mean?"
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
                                            "How is the term 'consumer' used in relation to a credit transaction?"
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
                                            Define 'open end credit plan'.
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
                                            What is meant by 'adequate notice'?
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
                                            Explain the term 'credit card'.
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
                                            Which specific disclosures are required to be made despite State law?
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
                                            In what case may State-required disclosures not replace certain disclosures?
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
                                            How do the provisions of section 1639 interact with State laws?
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
                                            In what context is the disclosure of the annual percentage rate not to be used as evidence?
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
                                            How does this subchapter and its regulations affect contracts or obligations?
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
                                            Which sections supersede state law provisions related to credit and charge card disclosures?
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
                                            Can states create their own laws to enforce the requirements of section 1637?
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
                                            What are the potential consequences if a person gives false or inaccurate information?
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
                                            Under what circumstances is a person considered to have failed to comply with the provisions of this subchapter?
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
                                            What is the potential fine for failing to comply with the requirements of this subchapter?
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
                                            Under what circumstances might a person use an authorized chart or table inappropriately?
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
                                            What are the consultation requirements for credit instruments issued to participating creditors?
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
                                            Who is exempt from Federal civil or criminal penalties under this subchapter?
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
                                            Under what circumstances is a creditor participating in a credit program administered by the United States exempt from penalties?
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
                                            Are participating creditors liable for State penalties for technical or procedural failures?
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
                                            What is the annual reporting requirement for the Bureau?
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
                                            What assessment is included in the Bureau's annual report?
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
                                            What information is covered in the annual report to Congress?
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
                                            "What is the purpose of the Bureau's annual report?"
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
                                            "What is the requirement regarding the refund of unearned interest in consumer credit transactions?"
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
                                            "What is the exception to the refund requirement for unearned interest?"
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
                                            "To what types of transactions does the refund requirement for unearned interest apply?"
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
                                            "What is the purpose of prohibiting the use of the 'Rule of 78's'?"
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
                                            "What information must a creditor provide to a consumer regarding prepayment of a precomputed consumer credit account?"
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
                                            "Under what circumstances should the written statement be provided to the consumer?"
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
                                            "How often can a consumer obtain a statement of prepayment amount without charge?"
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
                                            "Can a creditor charge a fee for providing additional statements of prepayment amount?"
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
                                            "What are the definitions used in this section?"
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
                                            What is the timeframe for the required review by the Board?
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
                                            How does the Board gather input for the review?
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
                                            What is the purpose of the notice published by the Board following the review?
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
                                            Under what circumstances might the review period be revised?
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
                                            What reporting requirement does the Board have to Congress?
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
                                            What information must the Federal banking agencies and the Federal Trade Commission provide annually to the Board?
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
                                            What is the creditor or lessor's duty regarding disclosure in a consumer lease or consumer credit transaction?
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
                                            Under what circumstances is a creditor or lessor required to make disclosures?
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
                                            Can estimates be used to satisfy statutory requirements for disclosures?
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
                                            What authority does the Bureau have regarding tolerances for numerical disclosures?
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
                                            "How should the information required by this subchapter be disclosed?"
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
                                            "Can creditors or lessors provide additional information or explanations with required disclosures?"
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
                                            "What is the requirement for tabular format disclosures under section 1637(c)?"
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
                                            "What requirements are there for creditors to post credit card agreements?"
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
                                            "Under what circumstances can the Bureau exempt a class of credit transactions from the requirements of this part?"
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
                                            "Does the inaccuracy of disclosed information due to subsequent acts, occurrences, or agreements constitute a violation of this part?"
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
                                            "What is the right of rescission in a consumer credit transaction involving a security interest in the principal dwelling?"
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
                                            "What is the creditor's obligation when an obligor exercises the right to rescind?"
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
                                            "Under what circumstances is there a presumption of delivery of required disclosures?"
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
                                            "Can the Bureau modify or waive rights created under this section?"
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
                                            "Are there any transactions exempt from the right of rescission?"
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
                                            "What is the time limit for exercising the right of rescission?"
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
                                            "What additional relief may be awarded by a court for a violation of this section?"
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
                                            "Are there limitations to the obligor's rescission rights based on the form of notice used by the creditor?"
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
                                            "What are the conditions for an obligor to have rescission rights in foreclosure?"
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
                                            "Explain the key items that a creditor is required to disclose for each consumer credit transaction other than under an open end credit plan. Describe how the 'amount financed' is computed and the components that make up this amount. Discuss the purpose of providing a statement of the consumer's right to obtain a written itemization of the amount financed."
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
                                            "Discuss the disclosure requirements related to the 'finance charge' and its representation as an 'annual percentage rate.' Explain the circumstances under which these disclosures are mandatory and the exceptions that apply based on the loan amount. Analyze the implications of not providing the 'annual percentage rate' disclosure for specific loan scenarios."
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
                                            "Elaborate on the concept of the 'total of payments' in the context of required creditor disclosures for consumer credit transactions. Explain how this amount is calculated and its significance for consumers. Discuss the importance of transparency in disclosing the 'total of payments' to borrowers."
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
                                            "Describe the disclosures that creditors are obligated to provide regarding payment schedules, due dates, and the period of payments for repaying the 'total of payments.' Discuss the implications of failing to provide accurate and timely payment schedule information to borrowers. Highlight the borrower's right to obtain an itemization of the amount financed."
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
                                            "Explain the creditor's responsibility to provide descriptive explanations for terms such as 'amount financed,' 'finance charge,' 'annual percentage rate,' 'total of payments,' and 'total sale price.' Discuss the significance of ensuring borrowers' understanding of these terms. Analyze how these explanations contribute to consumer protection and informed decision-making."
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
export default ExplorePrompt3;