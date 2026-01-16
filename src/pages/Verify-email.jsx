import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making API requests
import { toast } from 'react-toastify'; // Import react-toastify for showing notifications
import AuthImage from '../images/auth-image.jpg';
import AuthDecoration from '../images/auth-decoration.png';
import Cookies from 'js-cookie';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function VerifyEmail({BackendUrl}) {
  const navigate = useNavigate();
  const { param } = useParams();
  const location = useLocation();


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    verify_email(id)
  }, [location.search]);

  const verify_email = async (token) => {
    try {
      const response = await axios.post(`${BackendUrl}/user/user-register/${token}`);
      toast.success(response.data.message);
      navigate('/signin');
    } catch (error) {
      toast.error(error.response.data.message || 'Sign in failed. Please check your credentials.');
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="max-w-sm mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">Verifying Email</h1>
        <h4 className="mb-6">Please wait</h4>
      </div>
    </main>
  );
}

export default VerifyEmail;