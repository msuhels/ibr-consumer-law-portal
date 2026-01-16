import { React } from 'react';
import Cookies from "js-cookie";
import { GET_USER_NAME_BY_ID } from "../../API/api"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import dashboardBgImg from "../../images/dashboard_img/dashboardBgImg.png";

function WelcomeBanner() {
  const { id } = useParams();

  let { user, token } = JSON.parse(Cookies.get("user_token"));
  const [userName, setUserName] = useState("");
  const firstName = userName.split(' ')[0];

  const getUserName = async () => {
    try {
      let URL = GET_USER_NAME_BY_ID(id || user?._id);
      const response = await axios.get(URL);
      setUserName(response.data.UserDetails);
    } catch (error) {
      console.log(error.response.data.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden bgimg-css" >
      <div className="relative px-5 py-12">
        <h1 className="text-2xl md:text-3xl text-[white] dark:text-slate-100 font-bold mb-1 ">Welcome, {userName ? firstName : ""}</h1>
        <p className="text-[white] dark:text-indigo-200 ">You are one letter away from your credit transformation.. Let's get you started!</p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
