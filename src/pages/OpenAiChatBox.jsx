import React, { useState, useEffect, useRef } from 'react';
import Header from '../partials/Header';
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import PayBg from '../images/credit-page.png';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import InboxBody from '../partials/inbox/InboxBody';
import Footer from '../partials/Footer';
function OpenAiChatBox() {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inboxSidebarOpen, setInboxSidebarOpen] = useState(false);
 


  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          {/* <div className="relative pt-10	pb-10	">
            <div className="absolute inset-0 bg-slate-800 overflow-hidden" aria-hidden="true">
              <img className="object-cover h-full w-full filter " src={PayBg} width="460" height="80" alt="Pay background" />
            </div>
            <div className="relative px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
              <div className="about- pt-5 pb-5 text-center">
                <div className="container-fluid col-6">
                  <div className="row align-items-center">
                    <div className="col-lg-12">
                      <div className="">
                        <h1 className="text-5xl leading-snug text-slate-800 dark:text-slate-100 font-semibold mb-2 pt-4">ConsumerLaw.ai</h1>
                        <p
                          className="mt-3 mb-4"
                        >
                          Start  the conversation with our custom, trained AI Model that will help you through out your credit repair journey. Feel free to use the sample prompts listed below.                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <main className="grow">
            <div className="relative flex h-full bg-white">
              <InboxBody inboxSidebarOpen={inboxSidebarOpen} setInboxSidebarOpen={setInboxSidebarOpen} />
            </div>
          </main>
        </main>
        {/* <Footer></Footer> */}
      </div>

    </div>
  );
}

export default OpenAiChatBox;