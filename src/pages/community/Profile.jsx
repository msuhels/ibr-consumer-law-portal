import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ProfileSidebar from '../../partials/community/ProfileSidebar';
import ProfileBody from '../../partials/community/ProfileBody';
import SubNavbar from '../../components/SubNavbar'
import Cookies from "js-cookie";

function Profile() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));

  return (
    <div className="flex  overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* Content area */} 
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-900">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {(user?.role === "agent" || user?.role === "agency_agent")  ?
        <SubNavbar />
        :
        ""
      }
        <main className="grow">
          <div className="relative flex">
            <ProfileBody profileSidebarOpen={profileSidebarOpen} setProfileSidebarOpen={setProfileSidebarOpen} />
          </div>
        </main>

      </div>
      
    </div>
  );
}

export default Profile;