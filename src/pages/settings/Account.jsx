import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import AccountPanel from '../../partials/settings/AccountPanel';
import head_logo from "../../ConsumerlawLogo.png"
import Footer from '../../partials/Footer';
import SubNavbar from '../../components/SubNavbar'
import Cookies from "js-cookie";
function Account() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));

  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }
        <main className="grow bg-white dark:bg-[#FFFFFF]">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="mb-8">
              <div className="mb-4 sm:mb-0 flex" >
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Profile Settings</h1>
                {/* <img width={35} h src={head_logo}></img> */}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg border rounded-xl mb-8">
              <div className="">
                <AccountPanel />
              </div>
            </div>

          </div>
        </main>
        {/* <Footer></Footer> */}
      </div>

    </div>
  );
}

export default Account;