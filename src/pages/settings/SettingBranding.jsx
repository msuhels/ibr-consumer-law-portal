import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { GET_APP_BRANDING_DATA, UPDATE_APP_BRANDING } from "../../API/api.js"
import Cookies from "js-cookie";
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import Sidebar from '../../partials/Sidebar';
import head_logo from "../../ConsumerlawLogo.png"
import Image from '../../images/user-avatar-80.png';
import { useDispatch, useSelector } from "react-redux";
import { GET_APPDETAILS } from "../../store/setting/actions";

function SettingBranding() {
  const dispatch = useDispatch();
  const { appDetails } = useSelector(state => state.settings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [formObj, setFormObj] = useState({ logo: "" });

 

  function handleOnChange(e) {
    const target = e.target
    setFormObj({ ...formObj, ['logo']: target.files[0] });
  }

  const updateSetting = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append('logo', formObj.logo);
      const response = await axios.post(UPDATE_APP_BRANDING,formData, { headers: { "Authorization": "Bearer " + token } });
      toast.success(response.data.message);
      dispatch(GET_APPDETAILS);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    dispatch(GET_APPDETAILS);
  }, []);


  return (
    <>
      <div className="flex h-[100dvh] overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <div className="mb-4 sm:mb-0 flex" >
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold me-3">Settings</h1>
                  <img width={35} h src={head_logo}></img>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8 p-5">
                <div className="grow">
                  <form className="space-y-8 px-4 divide-gray-200 bg-white" onSubmit={updateSetting} >
                    <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 ">Logo</h2>
                    <section>
                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/3">
                          <label className="block text-sm font-medium mb-1" htmlFor="name">Upload logo</label>
                          <input className="form-input w-full" type="file" onChange={handleOnChange} />
                        </div>
                       {appDetails && <div className="sm:w-1/3">
                          <img className='h-16 ml-10' h src={appDetails.logo}></img>
                        </div>}
                      </div>
                    </section>
                    <section>
                      <button type="submit" className="btn tm-background text-white ml-3">Update Changes</button>
                    </section>
                  </form>
                </div>
              </div>
            </div>
          </main>
          {/* <Footer></Footer> */}
        </div>
      </div>
    </>
  );
}

export default SettingBranding;