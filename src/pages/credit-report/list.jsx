import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import SearchForm from '../../partials/actions/SearchForm';
import DeleteButton from '../../partials/actions/DeleteButton';
import DateSelect from '../../components/DateSelect';
import FilterButton from '../../components/DropdownFilter';
import CreditTable from '../../partials/credit-reports/creditReportTable';
import PaginationClassic from '../../components/PaginationClassic';
import head_logo from "../../ConsumerlawLogo.png"
import { useNavigate, useParams } from "react-router-dom";
import { GET_DATA_OF_USER_CLIENT } from "../../API/api"
import Cookies from "js-cookie";
import axios from 'axios';
import DashboardSidebar from '../../partials/DashboardSidebar';
import SubNavbar from '../../components/SubNavbar'


function Invoices() {
  const { id } = useParams();
  const navigate = useNavigate();
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };


  const getDataOfUserClient = async () => {
    try {
      const response = await axios.post(GET_DATA_OF_USER_CLIENT,
        {
          id: id
        },
        { headers: { "Authorization": "Bearer " + token } });
      if (response.data.status === "false") {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getDataOfUserClient();
  }, []);
  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {(user?.role === "agent" || user?.role === "agency_agent") ?
        <SubNavbar />
        :
        ""
      }
      <div className="flex sm:h-[100dvh] overflow-hidden px-8 bg-white">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="grow">
            <div className="py-2 pl-2 w-full">
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                <div className="mb-4 sm:mb-0 flex" >
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Credit Report List </h1>
                  {/* <img width={35} src={head_logo}></img> */}
                </div>
              </div>
              <CreditTable />
            </div>
          </main>
        </div>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}

export default Invoices;