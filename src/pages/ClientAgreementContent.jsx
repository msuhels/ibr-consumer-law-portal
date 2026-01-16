import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ADD_CLIENT_AGREEMENT_CONTENT, GET_USER_CLIENT_AGREEMENT_DATA } from "../API/api"
import Header from '../partials/Header';
import DashboardSidebar from '../partials/DashboardSidebar';
import SubNavbar from '../components/SubNavbar'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

function ClientAgreementContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [setLoader, setsetLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [defaultContent, setDefaultContent] = useState(`
  <div>
  
    I, Client, hereby enter into the following agreement with.
  </p>
  
    hereby agrees to perform the following:
  </p>
  
  
    To evaluate Customer's current credit reports as listed with applicable consumer reporting agencies and to identify inaccurate, erroneous, false, or obsolete information. To advise Customer as to the necessary steps to be taken on the part of Customer in conjunction with Our Company, to dispute any inaccurate, erroneous, false, or obsolete information contained in the Customer's credit reports.
  </p>
  
  
    To prepare all necessary correspondence in dispute of inaccurate, erroneous, false, or obsolete information in customer's credit reports.
  </p>
  
  
    To review credit profile status from consumer reporting such as Experian, Equifax, and Transunion.  Consulting, coaching, and monitoring services are conducted by personal meetings, webinars, video conferencing, telephone, email, or by any other form of communication during normal business hours.
  </p>
  
  
    In exchange, I, the Client, agree to pay the following fees as outlined in the following fee schedule:
  </p>
  
  
    (As discussed)
  </p>
  
  
    Authorization for Credit Repair Action
  </p>
  
  
  
    1.  I,  Client, to make, receive, sign, endorse, execute, acknowledge, deliver, and possess such applications, correspondence, contracts, or agreements, as necessary to improve my credit. Such instruments in writing of whatever nature shall only be effective for any or all of the three consumer reporting agencies which are TransUnion, Experian, Equifax, and any other reporting agencies or creditors listed, as may be necessary or proper in the exercise of the rights and powers herein granted.
  </p>
  
  
    2. This authorization may be revoked by the undersigned at any time by giving written notice to the party authorized herein. Any activity made before revocation in reliance upon this authorization shall not constitute a breach of rights of the client. If not earlier revoked, this authorization will automatically expire twelve months from the date of signature.
  </p>
  
  
    3. The party named above to receive the information is not authorized to make any further release or disclosure of the information received. This authorization does not authorize the release or disclosure of any information except as provided herein.
  </p>
  
  
    4. I grant you authority to do, take, and perform, all acts and things whatsoever requisite, proper, or necessary to be done, in the exercise of repairing my credit with the three consumer reporting agencies, which are TransUnion, Experian, Equifax, and any other reporting agencies or creditor’s listed, as fully for all intents and purposes as I might or could do if personally present.
  </p>
  
  
    5. I hereby release, you from all and all matters of actions, causes of action, suits, proceedings, debts, dues, contracts, judgments, damages, claims, and demands whatsoever in law or equity, for or because of any matter, cause, or thing whatsoever as based on the circumstances of this contract.
  </p>
  
  
    Consumer Credit File Rights Under State and Federal Law
  </p>
  
  
    You have a right to dispute inaccurate information in your consumer report by contacting the consumer reporting agencies directly. However, neither you nor a credit repair company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported up to 10 years.
  </p>
  
  
    You have a right to obtain a copy of your credit report from a consumer reporting agency. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your consumer reporting agencies within the preceding 60 days. The consumer reporting agency must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your consumer reporting agency if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your consumer reporting agency due to fraud.
  </p>
  
  
    You have a right to sue a credit repair organization that violated the Credit Repair Organization Act. This law prohibits deceptive practices by credit repair organizations.
  </p>
  
  
    You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.
  </p>
  
  
    consumer reporting agency are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.
  </p>
  
  
    You may on your own, notify a consumer reporting agency in writing that you dispute the accuracy of information in your credit file. The consumer reporting agency must then reinvestigate and modify or remove inaccurate or incomplete information. The consumer reporting agency may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the consumer reporting agency.                          </p>
  
  
    If the consumer reporting agencies reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the consumer reporting agencies to be kept in your file, explaining why you think the record is inaccurate. The consumer reporting agencies must include a summary of your statement about disputed information with any report it issues about you.
  </p>
  
  
    The Federal Trade Commission regulates credit bureaus and consumer reporting agencies organizations. For more information contact: The Public Reference Branch Federal Trade Commission Washington, D.C. 20580.
  </p>
  
  
    Notice of Right to Cancel
  </p>
  
  
    ''You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.
    
    
    ''To cancel this contract, contact the consumer reporting  agency, before midnight on the 3rd day which begins after the date you have signed this contract stating ''I hereby cancel this transaction, (date) (purchaser’s signature).’’
    
    
    Please acknowledge your receipt of this notice by electronically signing the form indicated below.
    
    
    Acknowledgment of Receipt of Notice
    
    
    I, the Client,  hereby acknowledge with my digital signature, receipt of the Notice of Right to Cancel. I confirm the fact that I agree and understand what I am signing, and acknowledge that I have received a copy of my Consumer Credit File Rights.
    
    
    *Digital Signatures: In 2000, the U.S. Electronic Signatures in Global and National Commerce (ESIGN) Act established electronic records and signatures as legally binding, having the same legal effects as traditional paper documents and handwritten signatures. Read more at the FTC website: http://www.ftc.gov/os/2001/06/esign7.html
  </p>
  
  
</div>
  `);
  const [clientAgreementData, setClientAgreementData] = useState('');






  const addClientAgreementContent = async () => {
    try {
      setSubmitLoader(true);
      const response = await axios.post(ADD_CLIENT_AGREEMENT_CONTENT,
        { userId: user?._id, responseText: clientAgreementData },
        { headers: { "Authorization": "Bearer " + token } });
      getUserClientAgreementContent();
      toast.success(response.data.message);
      setSubmitLoader(false);
    } catch (error) {
      toast.error(error.response.data.message || "Something went Wrong");
      setSubmitLoader(false);
    }
  };

  const getUserClientAgreementContent = async () => {
    setsetLoader(true);
    try {
      const response = await axios.post(GET_USER_CLIENT_AGREEMENT_DATA, { user_id: user?._id }, { headers: { "Authorization": "Bearer " + token } });
      if (response?.data?.content) {
        setClientAgreementData(response?.data?.content);
      } else {
        setClientAgreementData(defaultContent);
      }
      setsetLoader(false);
    } catch (error) {
      setsetLoader(false);
      console.log("Something went Wrong");
    }
  };

  useEffect(() => {
    getUserClientAgreementContent();
  }, []);


  return (
    <>
      {setLoader &&
        <div className="loader-container" style={{ zIndex: "9999" }}>
          <div className="loader"></div>
        </div>
      }
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {user?.role === "agent" || user?.role === "agency_agent" ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex  overflow-hidden px-3 bg-white">
        {!(user?.role === "agent") && !(user?.role === "agency_agent") &&
          <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        }

        <main className="grow p-5">
          <div className="pl-2 py-2 w-full">
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              <div className="mb-3  sm:mb-0 flex items-center" >
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Agreement Content</h1>
              </div>
            </div>
            < div className="mt-5 mb-4  text-sm text-center mx-5  ckeditorcss">
              <CKEditor
                className="rounded-2xl"
                rows={15}
                editor={ClassicEditor}
                data={clientAgreementData}
                config={{
                  ckfinder: {
                    uploadUrl: "" //Enter your upload url
                  }
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  if (data) {
                    setClientAgreementData(data);
                  }
                }}
              />
            </div>
            <div className='text-center me-5'>
              {submitLoader ?
                <button className="ms-3 btn-sm tm-background text-white rounded-full" disabled>
                  <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                    <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                  </svg>
                  <span className="ml-2">Update Agreement</span>
                </button>
                :
                <button
                  onClick={(e) => { addClientAgreementContent() }}
                  className="ms-3 btn-sm tm-background text-white rounded-full">
                  Update Agreement
                </button>
              }

            </div>
          </div>
        </main>
      </div>
    </>

  );
}

export default ClientAgreementContent;
