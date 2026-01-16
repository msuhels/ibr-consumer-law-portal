import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'
import Header from '../../partials/Header';
import { useParams } from "react-router-dom";
import { SEND_MESSAGE } from "../../API/api"
import axios from 'axios';
import Loder from '../../partials/Loder';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import moment from 'moment'
import ModalOpenAiReport from '../../components/ModalOpenAiReport';
import { useNavigate } from "react-router-dom";
import SendLetterEmailPayment from '../../components/SendLetterEmailPayment';
import head_logo from "../../ConsumerlawLogo.png"
import Footer from '../../partials/Footer';
import ModalBasic from '../../components/ModalBasic';


function AdminMessagesFooter({ chatID, socket, setMessageList }) {
 
    let { user, token } = JSON.parse(Cookies.get("user_token"));
    const [curMessage, setcurMessage] = useState("");
    const [isSend, setIsSend] = useState(false);
    
    const send = async (e) => {
      e.preventDefault();
      if (curMessage) {
        sendMessage();
      }
    }
  
    const sendMessage = async () => {
      setIsSend(true);
      let data = {}
      if (curMessage != "") {
        data = {
          chat_id: chatID,
          message: curMessage,
        }
      }
      if (!chatID && !curMessage) {
        return true;
      }
  
      try {
        const response = await axios.post(SEND_MESSAGE, data,
          { headers: { "Authorization": "Bearer " + token } }
        );
        let msgEmit = await socket.emit("send_message", response?.data?.messages);
      //  let msg= JSON.stringify(response.data.messages);
        // socket.send(msg);
        setcurMessage('');
        // setMessageList((list) => [...list, response.data.messages]);
        setIsSend(false);
        toast.success("Message sent");
      } catch (error) {
        console.log(error);
        toast.error("Something went Wrong12122");
      }
    }
  
    useEffect(() => {
      if(socket){
      //   socket.onmessage = function (e) {
      //     console.log('Received: ' + e.data);
      //     setMessageList((list) => [...list, e.data]);
      // };
        socket.on("recieve_message", (messageData) => {
          if(messageData){
            setMessageList((list) => [...list, messageData]);
          }
        });
      }
    }, [socket]);

  //   socket.onmessage = function (e) {
  //     console.log('Received: ' + e.data);
  //     setMessageList((list) => [...list, e.data]);
  // };
  
    return (
      <div className="sticky bottom-0 bg-white">
        {chatID && <div className="flex items-center justify-between  dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
          {/* Plus button */}
          {/* <button className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 mr-3">
            <span className="sr-only">Add</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z" />
            </svg>
          </button> */}
          {/* Message input */}
          <form className="grow flex" onSubmit={send}>
            <div className="grow mr-3">
              <label htmlFor="message-input" className="sr-only">Type a message</label>
              <input id="message-input" value={curMessage} onChange={(e) => setcurMessage(e.target.value)} className="form-input w-full bg-white dark:bg-slate-800 dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500 border border-gray-200" type="text" placeholder="Aa" />
            </div>
            <button type="submit" className="py-2 px-5 rounded-2xl bg-[#bd0808] hover:bg-red-600 text-white whitespace-nowrap">Send</button>
          </form>
        </div>}
      </div>
    );
  }

export default AdminMessagesFooter;