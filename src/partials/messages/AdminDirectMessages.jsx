import React, { useEffect, useState } from 'react';

import UserImage01 from '../../images/user-32-01.jpg';
import UserImage02 from '../../images/user-32-02.jpg';
import UserImage03 from '../../images/user-32-03.jpg';
import UserImage04 from '../../images/user-32-04.jpg';
import UserImage05 from '../../images/user-32-05.jpg';
import UserImage06 from '../../images/user-32-06.jpg';
import Cookies from "js-cookie";
import axios from 'axios';
import { START_CHATING, GET_CHAT_USERS } from "../../API/api"
import { toast } from 'react-toastify';
import groupIcon from '../../images/groupicon.png';
import { getRandomColor, createImageFromInitials, getRandomColorStaick } from '../../utils/Utils'

function AdminDirectMessages({
  setMsgSidebarOpen,
  setSearch,
  search,
  setChatID,
  chatID,
  setAllUsers,
  allUsers,
  socket
}) {

  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [currentPage, setCurrentPage] = useState(1);
  const starChating = async (chatID) => {
    await socket.emit("start_chat");
    setChatID(chatID);
    setMsgSidebarOpen(false)
  }

  return (
    <div className="mt-4 " style={{ maxHeight: allUsers?.length > 5 ? "auto" : "auto" }}>
      {/* <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-3">Direct messages</div> */}
      <ul className="mb-6">
        {allUsers?.map((val, i) => {
          let name;
          let secondname;
          if (val.type == "team member group" && user.role == 'agent') {
            name = val?.client[0]?.name;
            if( val?.agent[0]?._id != user._id){
              secondname = val?.agent[0]?.name;
            }
          }

          if (val.type == "team member group" && user.role == 'agency_agent') {
            name = val?.client[0]?.name;
            // secondname = val?.owner[0]?.name;
          }

          if (val.type == "team member group" && user.role == 'client') {
            name = val?.agent[0]?.name;
            // secondname = val?.owner[0]?.name;
          }

          if (val.type == "admin group" && user.role == 'agent') {
            name = "Admin";
          }

          let img = createImageFromInitials(500, name, getRandomColorStaick(i));
          return (
            <div key={i}>
              <li className="-mx-2">
                <button className={`flex items-center justify-between w-full p-2 rounded ${chatID == val._id ? 'bg-[#bd0808] text-white' : ""} `} onClick={() => { starChating(val?._id) }} >
                  <div className="flex items-center truncate">
                    <img className="w-8 h-8 rounded-full mr-2" src={img} width="32" height="32" alt="User 01" />
                    <div className='text-left'>
                      <p className='font-bold text-xs'>{name} {secondname ? `| ${secondname}` : ''}</p>
                    </div>
                  </div>
                  {val?.unreadChat?.length > 0 && chatID != val._id &&
                    <div className="flex items-center ml-2">
                      <div className="text-xs inline-flex font-medium bg-red-400 text-white rounded-full text-center leading-5 px-2">
                        {val?.unreadChat?.length} 
                      </div>
                    </div>
                  }
                </button>
              </li>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminDirectMessages;