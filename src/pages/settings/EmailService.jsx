import React, { useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import SettingsSidebar from "../../partials/settings/SettingsSidebar";
import EmailServicePanel from "../../partials/settings/EmailServicePanel";
import head_logo from "../../ConsumerlawLogo.png";
import Footer from "../../partials/Footer";
import SubNavbar from "../../components/SubNavbar";
import Cookies from "js-cookie";
import ModalBasic from "../../components/ModalBasic";
import parse from "html-react-parser";

function EmailService() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [smtpTextContent, setSmtpTextContent] =
    useState(`What is SMTP and How to Set It Up?<br><br>

SMTP (Simple Mail Transfer Protocol) is a service that allows you to send emails from your email account through our platform. To configure SMTP, please fill in the following fields: <br><br>

- Host: Enter the SMTP server address of your email provider (e.g., smtp.gmail.com for Gmail).<br>
- Port: Specify the port number used for communication (e.g., 587 for TLS or 465 for SSL).<br>
- Services (Encryption): Choose the encryption type required by your email provider (SSL or TLS).<br>
- Username: Enter your email address.<br>
- Password: Provide your email account password or an app-specific password for added security.<br><br>

Common SMTP Settings<br><br>

1. Gmail:<br>
   - Host: smtp.gmail.com<br>
   - Port: 587 (TLS) or 465 (SSL)<br>
   - Services: TLS or SSL<br>
   - Username: Your Gmail address<br>
   - Password: Your Gmail or app-specific password<br><br>

Steps to Create an App Password:<br>
- Go to Google Cloud Console and create a new project.<br>
- Enable the "Gmail API."<br>
- Configure the OAuth consent screen and create app credentials.<br>
- In your Google account settings, go to Security > App Passwords to generate an app-specific password.<br><br>

2. Outlook:<br>
   - Host: smtp.office365.com<br>
   - Port: 587 (TLS)<br>
   - Services: TLS<br>
   - Username: Your Outlook email address<br>
   - Password: Your email or app-specific password<br><br>

Steps to Create an App Password:<br>
- Log in to your Microsoft account.<br>
- Navigate to Security > Advanced Security Options.<br>
- Generate an app password and use it instead of your primary password.<br><br>

3. Yahoo:<br>
   - Host: smtp.mail.yahoo.com<br>
   - Port: 465 (SSL) or 587 (TLS)<br>
   - Services: SSL or TLS<br>
   - Username: Your Yahoo email address<br>
   - Password: Your email or app-specific password<br><br>

Steps to Create an App Password:<br>
- Log in to your Yahoo account.<br>
- Go to Account Security and enable two-factor authentication.<br>
- Generate an app password for SMTP and use it for setup.<br><br>

4. Zoho Mail:<br>
   - Host: smtp.zoho.com<br>
   - Port: 587 (TLS) or 465 (SSL)<br>
   - Services: SSL or TLS<br>
   - Username: Your Zoho email address<br>
   - Password: Your Zoho email password<br><br>

Special Steps:<br>
- Log in to Zoho Mail and go to Security Settings.<br>
- Enable app-specific passwords if two-factor authentication is on.<br><br>

5. Custom Domains:<br>
   - Refer to your email provider's documentation for the correct Host, Port, Services, Username, and Password.<br>
`);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {user?.role === "agent" || user?.role === "agency_agent" ? (
          <SubNavbar />
        ) : (
          ""
        )}

        <main className="grow bg-white dark:bg-[#FFFFFF]">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <div className="mb-4 sm:mb-0 flex justify-between items-center ">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">
                  Email Services
                </h1>
                <h3
                 onClick={(e) => {
                  e.stopPropagation();
                  setFeedbackModalOpen(true);
                }}
                className=" cursor-pointer text-red-500 dark:text-red-100 font-bold me-3">
                  Need Help ?
                </h3>
                
              </div>
            </div>
            <div className="bg-white dark:bg-[#EEEFF1] border shadow-lg rounded-xl mb-8">
              <div className="">
                <EmailServicePanel />
              </div>
            </div>
          </div>
          <ModalBasic
            id="feedback-modal"
            modalOpen={feedbackModalOpen}
            setModalOpen={setFeedbackModalOpen}
            title=""
          >
            <div className="px-5 mt-5 mb-5">
              <p>{parse(smtpTextContent)}</p>
            </div>
          </ModalBasic>
        </main>
        {/* <Footer></Footer> */}
      </div>
    </div>
  );
}

export default EmailService;
