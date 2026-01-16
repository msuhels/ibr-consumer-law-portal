import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastProvider } from "./ToastContext"; // Import the ToastProvider
import "./css/style.css";
import "./css/custom.css";
import "./charts/ChartjsConfig";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import pages
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/Verify-email";
import Analytics from "./pages/Analytics";
import Fintech from "./pages/Fintech";
import Customers from "./pages/ecommerce/Customers";
import Orders from "./pages/ecommerce/Orders";
import Invoices from "./pages/ecommerce/Invoices";
import Shop from "./pages/ecommerce/Shop";
import Shop2 from "./pages/ecommerce/Shop2";
import Product from "./pages/ecommerce/Product";
import Cart from "./pages/ecommerce/Cart";
import Cart2 from "./pages/ecommerce/Cart2";
import Cart3 from "./pages/ecommerce/Cart3";
import Pay from "./pages/ecommerce/Pay";
import RenewalPay from "./pages/ecommerce/RenewalPay";
import UpdateCardDetails from "./pages/ecommerce/UpdateCardDetails";
import Campaigns from "./pages/Campaigns";
import UsersTabs from "./pages/community/UsersTabs";
import UsersTiles from "./pages/community/UsersTiles";
import Profile from "./pages/community/Profile";
import Feed from "./pages/community/Feed";
import Forum from "./pages/community/Forum";
import ForumPost from "./pages/community/ForumPost";
import Meetups from "./pages/community/Meetups";
import MeetupsPost from "./pages/community/MeetupsPost";
import CreditCards from "./pages/finance/CreditCards";
import Transactions from "./pages/finance/Transactions";
import TransactionDetails from "./pages/finance/TransactionDetails";
import JobListing from "./pages/job/JobListing";
import JobPost from "./pages/job/JobPost";
import CompanyProfile from "./pages/job/CompanyProfile";
import Messages from "./pages/Messages";
import TasksKanban from "./pages/tasks/TasksKanban";
import TasksList from "./pages/tasks/TasksList";
import Inbox from "./pages/Inbox";
import Calendar from "./pages/Calendar";
import Account from "./pages/settings/Account";
import Subscription from "./pages/settings/Subscription";
import EmailService from "./pages/settings/EmailService";
import RequestDeleteUserAccount from "./pages/settings/RequestDeleteUserAccount";
import ProcressPdf from "./components/ProcressDataResponsePdf";
import Notifications from "./pages/settings/Notifications";
import Apps from "./pages/settings/Apps";
import Plans from "./pages/settings/Plans";
import Billing from "./pages/settings/Billing";
import Feedback from "./pages/settings/Feedback";
import Changelog from "./pages/utility/Changelog";
import Roadmap from "./pages/utility/Roadmap";
import Faqs from "./pages/utility/Faqs";
import EmptyState from "./pages/utility/EmptyState";
import PageNotFound from "./pages/utility/PageNotFound";
import KnowledgeBase from "./pages/utility/KnowledgeBase";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import CreditReport from "./pages/Credit-report";
import CreditReportList from "./pages/credit-report/list";
import ForgotPassword from "./pages/ForgotPassword";
import ReadData from "./pages/DisplayData";
import ResetPassword from "./pages/ResetPassword";
import Onboarding01 from "./pages/Onboarding01";
import Onboarding02 from "./pages/Onboarding02";
import Onboarding03 from "./pages/Onboarding03";
import Onboarding04 from "./pages/Onboarding04";
import ButtonPage from "./pages/component/ButtonPage";
import FormPage from "./pages/component/FormPage";
import DropdownPage from "./pages/component/DropdownPage";
import AlertPage from "./pages/component/AlertPage";
import ModalPage from "./pages/component/ModalPage";
import PaginationPage from "./pages/component/PaginationPage";
import TabsPage from "./pages/component/TabsPage";
import BreadcrumbPage from "./pages/component/BreadcrumbPage";
import BadgePage from "./pages/component/BadgePage";
import AvatarPage from "./pages/component/AvatarPage";
import TooltipPage from "./pages/component/TooltipPage";
import AccordionPage from "./pages/component/AccordionPage";
import IconsPage from "./pages/component/IconsPage";
import AuthWrapper from "./AuthWrapper";
import PaymentChecker from "./PaymentChecker";
import Inquiry from "./pages/credit-report/Inquiry";
import Dispute from "./pages/Dispute";
import AiReportPage from "./pages/AiReportPage";
import OpenAiChatBox from "./pages/OpenAiChatBox";
import CreditorsFurnishers from "./pages/CreditorsFurnishers";
import LetterGenerator from "./pages/LetterGenerator";
import ClientsPage from "./pages/ClientsPage";
import ClientAgreementContent from "./pages/ClientAgreementContent";
import LeadsPage from "./pages/leads";
import ClientLogsPage from "./pages/ClientLogListPage";
import AffiliateUsers from "./pages/AffiliateUser";
import AdminAddedVideosLinks from "./pages/AdminAddedVideosLinks";
import SendLetter from "./pages/SendLetter";
import TrackLetter from "./pages/TrackLetter";
import LetterStatus from "./pages/LetterStatus";
import AgentsPage from "./pages/AgentsPage";
import TodoTaskListPage from "./pages/TodoTaskListPage";
import SettingBranding from "./pages/settings/SettingBranding";
import AgencyDashboard from "./pages/AgencyDashboard";
import Home from "./pages/Home";
import ClientNewPage from "./pages/ClientNewPage";
import ChatsPage from "./pages/Chats-page";
import { BackendUrl, FrontendUrl, Stripe_Publishable_key } from "./Config";
import AffiliateSignup from "./pages/AffiliateSignup";
import NotificationPage from "./pages/component/NotificationPage";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPasswordByOtp from "./pages/ResetPasswordByOtp";
import AdminMessages from "./pages/AdminMessages";
import Demochat from "./pages/Demochat";
import CheckSubscription from "./pages/settings/CheckSubscription";
import ClientAgreement from "./pages/settings/ClientAgreement";

const stripePromise = loadStripe(Stripe_Publishable_key);
function App() {
  const location = useLocation();

  const [userToken, setuserToken] = useState(null);
  const [userPaymentStatus, setUserPaymentStatus] = useState();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    const userDataJSON = Cookies.get("user_token");
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      setuserToken(userData.token);
      setUserPaymentStatus(userData.token);
    }
  }, []); // triggered on route change

  return (
    <>
      <Elements stripe={stripePromise}>
        <ToastProvider>
          <Routes>
            <Route
              path="/:agencyId?/:role?/signin/:id?/:subId?"
              element={
                <Signin BackendUrl={BackendUrl} FrontendUrl={FrontendUrl} />
              }
            />
            <Route
              path="/signup/:id?"
              element={
                <Signup BackendUrl={BackendUrl} FrontendUrl={FrontendUrl} />
              }
            />
            <Route
              path="/forgot-password/:id?/:subId?"
              element={
                <ForgotPassword
                  BackendUrl={BackendUrl}
                  FrontendUrl={FrontendUrl}
                />
              }
            />
            <Route
              path="/reset-password"
              element={<ResetPassword BackendUrl={BackendUrl} />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmail BackendUrl={BackendUrl} />}
            />
            <Route
              path="/affiliate-signup/:id"
              element={
                <AffiliateSignup
                  BackendUrl={BackendUrl}
                  FrontendUrl={FrontendUrl}
                />
              }
            />
            <Route
              path="/verify-code/:id?/:subId?"
              element={<VerifyOtp BackendUrl={BackendUrl} />}
            />
            <Route
              path="/reset-user-password/:id?/:subId?"
              element={<ResetPasswordByOtp BackendUrl={BackendUrl} />}
            />
            <Route
              path="/chat"
              element={<Demochat BackendUrl={BackendUrl} />}
            />
            {/* <Route path="*" element={<PageNotFound />} /> */}
          </Routes>
          <>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <Dashboard />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/credit-report/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <CreditReport />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/credit-report-list/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <CreditReportList />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/dashboard/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <Dashboard />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/agency-dashboard/"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <AgencyDashboard />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/home"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <Home />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/read-data"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      <ReadData />
                    </PaymentChecker>
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/inquiry/:id/:disputeid"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Inquiry />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/dispute/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Dispute />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/genrate-report/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <AiReportPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/send-letter/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <SendLetter />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/track-letter/:id"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <TrackLetter />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/letter-status"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <LetterStatus />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/profile/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Account />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/subscription/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Subscription />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/email-services/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <EmailService />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/request-delete-account/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <RequestDeleteUserAccount />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/consumer-ai-box/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <OpenAiChatBox />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/creditors-furnishers/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <CreditorsFurnishers />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/letter-generator/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <LetterGenerator />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/clients"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <ClientsPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/agreement-content"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <ClientAgreementContent />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/agents"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <AgentsPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/todo-list"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <TodoTaskListPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/affiliate/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <AffiliateUsers />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/learning-hub"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <AdminAddedVideosLinks />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/setting"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <SettingBranding />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/check-subscription"
                element={
                  <AuthWrapper>
                    {" "}
                    <CheckSubscription></CheckSubscription>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/consumer-ai/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Profile />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                path="/plans/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <Plans BackendUrl={BackendUrl} />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                path="/pay/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <Pay BackendUrl={BackendUrl} />{" "}
                  </AuthWrapper>
                }
              />
              <Route
                path="/renewal-pay/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <RenewalPay BackendUrl={BackendUrl} />{" "}
                  </AuthWrapper>
                }
              />
              <Route exact path="/response-pdf/:id" element={<ProcressPdf />} />
              <Route
                path="/chat-messages"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <ChatsPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route path="/client-page" element={<ClientNewPage />} />
              <Route
                path="/leads"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <LeadsPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                path="/client-logs"
                element={
                  <AuthWrapper>
                    {" "}
                    <PaymentChecker>
                      {" "}
                      <ClientLogsPage />{" "}
                    </PaymentChecker>{" "}
                  </AuthWrapper>
                }
              />
              <Route
                exact
                path="/client-agreement/:id?"
                element={
                  <AuthWrapper>
                    {" "}
                    <ClientAgreement />{" "}
                  </AuthWrapper>
                }
              />

              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/fintech" element={<Fintech />} />
              <Route path="/ecommerce/customers" element={<Customers />} />
              <Route path="/ecommerce/orders" element={<Orders />} />
              <Route path="/ecommerce/invoices" element={<Invoices />} />
              <Route path="/ecommerce/shop" element={<Shop />} />
              <Route path="/ecommerce/shop-2" element={<Shop2 />} />
              <Route path="/ecommerce/product" element={<Product />} />
              <Route path="/ecommerce/cart" element={<Cart />} />
              <Route path="/ecommerce/cart-2" element={<Cart2 />} />
              <Route path="/ecommerce/cart-3" element={<Cart3 />} />
              <Route
                path="/updated-card-details"
                element={<UpdateCardDetails BackendUrl={BackendUrl} />}
              />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/community/users-tabs" element={<UsersTabs />} />
              <Route path="/community/users-tiles" element={<UsersTiles />} />
              <Route path="/community/feed" element={<Feed />} />
              <Route path="/community/forum" element={<Forum />} />
              <Route path="/community/forum-post" element={<ForumPost />} />
              <Route path="/community/meetups" element={<Meetups />} />
              <Route path="/community/meetups-post" element={<MeetupsPost />} />
              <Route path="/finance/cards" element={<CreditCards />} />
              <Route path="/finance/transactions" element={<Transactions />} />
              <Route
                path="/finance/transaction-details"
                element={<TransactionDetails />}
              />
              <Route path="/job/job-listing" element={<JobListing />} />
              <Route path="/job/job-post" element={<JobPost />} />
              <Route path="/job/company-profile" element={<CompanyProfile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/tasks/kanban" element={<TasksKanban />} />
              <Route path="/tasks/list" element={<TasksList />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route
                path="/settings/notifications"
                element={<Notifications />}
              />
              <Route path="/settings/apps" element={<Apps />} />
              <Route path="/settings/billing" element={<Billing />} />
              <Route path="/settings/feedback" element={<Feedback />} />
              <Route path="/utility/changelog" element={<Changelog />} />
              <Route path="/utility/roadmap" element={<Roadmap />} />
              <Route path="/utility/faqs" element={<Faqs />} />
              <Route path="/utility/empty-state" element={<EmptyState />} />
              <Route path="/utility/404" element={<PageNotFound />} />
              <Route
                path="/utility/knowledge-base"
                element={<KnowledgeBase />}
              />
              <Route path="/onboarding-01" element={<Onboarding01 />} />
              <Route path="/onboarding-02" element={<Onboarding02 />} />
              <Route path="/onboarding-03" element={<Onboarding03 />} />
              <Route path="/onboarding-04" element={<Onboarding04 />} />
              <Route path="/component/button" element={<ButtonPage />} />
              <Route path="/component/form" element={<FormPage />} />
              <Route path="/component/dropdown" element={<DropdownPage />} />
              <Route path="/component/alert" element={<AlertPage />} />
              <Route path="/component/modal" element={<ModalPage />} />
              <Route
                path="/component/pagination"
                element={<PaginationPage />}
              />
              <Route path="/component/tabs" element={<TabsPage />} />
              <Route
                path="/component/breadcrumb"
                element={<BreadcrumbPage />}
              />
              <Route path="/component/badge" element={<BadgePage />} />
              <Route path="/component/avatar" element={<AvatarPage />} />
              <Route path="/component/tooltip" element={<TooltipPage />} />
              <Route path="/component/accordion" element={<AccordionPage />} />
              <Route path="/component/icons" element={<IconsPage />} />
              <Route path="/notification" element={<NotificationPage />} />
              {/* <Route path="/chat-messages" element={<AdminMessages />} /> */}
            </Routes>
          </>
        </ToastProvider>
      </Elements>
    </>
  );
}

export default App;
