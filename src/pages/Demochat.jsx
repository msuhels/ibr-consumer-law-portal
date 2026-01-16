import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import Moment from 'moment';
import { io } from 'socket.io-client';

// let socket = io.connect("http://localhost:3004");
function Demochat() {
  const [messageList, setMessageList] = useState(['hello']);
  const [curMessage, setcurMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const send = async(e) => {
    e.preventDefault();
    await socket.emit("send_message", curMessage);
    setcurMessage([]);
  }

  useEffect(() => {
    if (socket == null) {
        let soketConnection =  io.connect("https://socket-io-chat-cunsumerlaw-f034d17f4f3b.herokuapp.com");
        setSocket(soketConnection);
    }
    if (socket) {
        socket.on('disconnect', (reason, details) => {
            console.log('Disconnected from server');
            console.log(reason);
            console.log(details.message);
            console.log(details.description);
            console.log(details.context);
        });

        socket.on("recieve_message", (messageData) => {
          console.log(messageData,"================>>>");
          if(messageData){
            setMessageList((list) => [...list, messageData]);
          }
        });
    }

    
}, [socket]);


  return (
    <>
      <div className="grow px-4 sm:px-6 md:px-5 py-6">
        <>
          {messageList && messageList.map((messageContent, i) => {
            return (
              <div key={i}>
                <div className={`flex items-start mb-4 last:mb-0`} >
                  <div>
                    <div className="text-[8px] mt-2 ml-1">
                      <span>

                      </span>
                    </div>
                    <div className={`  bg-indigo-500  bg-white text-slate-800 text-sm  dark:bg-slate-800  dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1`}>
                      {messageContent}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
          }
          <div className="flex items-start mb-4 last:mb-0" style={{ display: "none" }}>
            <div>
              <div className="text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1">
                <svg className="fill-current text-slate-400 dark:text-slate-500" viewBox="0 0 15 3" width="15" height="3">
                  <circle cx="1.5" cy="1.5" r="1.5">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
                  </circle>
                  <circle cx="7.5" cy="1.5" r="1.5">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                  </circle>
                  <circle cx="13.5" cy="1.5" r="1.5">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>
        </>
      </div>
      <div className="sticky bottom-0">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
          <form className="grow flex" onSubmit={send}>
            <div className="grow mr-3">
              <label htmlFor="message-input" className="sr-only">Type a message</label>
              <input id="message-input" value={curMessage} onChange={(e) => setcurMessage(e.target.value)} className="form-input w-full bg-slate-100 dark:bg-slate-800 border-transparent dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500" type="text" placeholder="Aa" />
            </div>
            <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Demochat;