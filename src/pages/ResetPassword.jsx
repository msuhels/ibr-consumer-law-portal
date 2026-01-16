import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making API requests
import { toast } from 'react-toastify';
// import AuthImage from '../images/auth-image.jpg';
import AuthImage from '../images/humanLogin1.webp';
import AuthDecoration from '../images/auth-decoration.png';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import logo from '../images/consumer_logo.png';

function ResetPassword({ BackendUrl }) {
  const navigate = useNavigate();

  const location = useLocation();
  const [token, setToken] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    setToken(id);
  }, [location.search]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchPasswordError, setMatchPasswordError] = useState('');

  const validateForm = () => {
    setPasswordError('');
    setMatchPasswordError('');
    if (!password) {
      setPasswordError('Please enter a password.');
      return false;
    }
    if (password !== confirmPassword) {
      setMatchPasswordError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const reset_password = async (e) => {
    e.preventDefault();
    try {
      if (password === "") {
        toast.error("Password field Requried");
        return;
      }
      if (confirmPassword === "") {
        toast.error("Confirm Password field Requried");
        return;
      }
      if (confirmPassword !== password) {
        toast.error("Confirm Password Not Match");
        return;
      }
      const response = await axios.post(`${BackendUrl}/user/reset-password/${token}`, { password });
      toast.success(response.data.message);
      navigate('/signin');
    } catch (error) {
      toast.error(error.response.data.message || 'Sign in failed. Please check again.');
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative md:flex">
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <a className="block" href="javascript:void(0)">
                  <img
                    src={logo}
                    width={200}
                    alt="logo"
                  />
                </a>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Reset your Password </h1>
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password<span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="password"
                      className={`form-input w-full ${passwordError ? 'border-rose-500' : ''}`}
                      type="password"
                      value={password}
                      required={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="text-rose-500 mt-2">{passwordError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                      Confirm Password<span className="text-rose-500">*</span>
                    </label>
                    <input
                      required={true}
                      id="confirmPassword"
                      className={`form-input w-full ${matchPasswordError ? 'border-rose-500' : ''}`}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {matchPasswordError && (
                      <p className="text-rose-500 mt-2">{matchPasswordError}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="btn tm-background text-white" onClick={reset_password}>
                    Change Password
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
          {/* <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={AuthDecoration} width="218" height="224" alt="Authentication decoration" /> */}
        </div>

      </div>
    </main>
  );
}

export default ResetPassword;