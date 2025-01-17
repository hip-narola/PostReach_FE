"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, logout } from "../../services/auth-service";
import { useContext } from 'react';
import { DataContext } from '../../context/shareData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StaticImage from "../../../../authImage";
import { ApiResponse, ConfirmdCodeData } from "@/app/shared/response/apiResponse";
import navigations from "@/app/constants/navigations";
import { ErrorType } from "@/app/shared/dataPass";
import { ErrorCode, PageConstant, Titles } from "@/app/constants/pages";
const ForgotPassword: React.FC = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('DataContext must be used within a DataProvider');
  }


  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorType>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [touched, setTouched] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Please enter a valid email.";
    }
    return "";
  };

  useEffect(() => {
    if (touched) {
      const error = validateEmail(email);
      setErrors({ email: error });
      setIsButtonDisabled(!email || !!error);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, touched]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errors.email && email) {
      const response :ApiResponse<ConfirmdCodeData> = await forgotPassword(email);
      if (response?.IsSuccess) {
        context.setSharedData({email : email, type : PageConstant.FORGOT_PASSWORD})
        toast.success(response?.Message, {position: "top-right"});
        router.push(navigations.confirmCode);
      } else {
        if(response.StatusCode == ErrorCode.UNAUTHORISED){
          logout(router);
        }
        toast.error(response?.Message, {position: "top-right"});
      }
    }
  };

  const handleClick = () => {
    router.push(navigations.login)
 }

  return (
    <div className="mx-auto max-w-[1440px] py-6 px-6 xl:px-[100px] min-h-screen flex items-start md:items-center">
    <div className="grid  grid-cols-1 w-full items-center  gap-6 xl:gap-x-16 md:grid-cols-2 grid-rows-1 xl:grid-cols-[666px,1fr]">
      <div className="flex  flex-col order-last md:flex">
          <div className="mx-auto">
            <img  src="../assets/images/logo.png" alt="logo" />
          </div>
          <div className="flex md:hidden mt-4 mx-auto max-w-[290px]">
          <img src="../assets/images/sign-up-img.png" alt="sign-up-img-mobile" />
          </div>
          <form onSubmit={handleForgotPassword} action="">
            <div>
            <h2 className="form-title my-1 md:my-8 py-4">
              {Titles.FORGET_PASSWORD_TITLE}
              </h2>
              <div className="flex flex-col w-full relative">
                <label
                  htmlFor="email"
                  className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3"
                >
                  Email
                </label>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="form-custom-input"
                  />
                  {touched && errors.email && (
                    <span className="text-red-500 text-xs">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between w-full relative">
                <button
                  className={`theme-primary-btn ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isButtonDisabled}
                >
                 Send Code
                </button>
              </div>

              <p className="text-textdark-900 font-normal text-sm md:text-base leading-6 text-center">
                {" "}
                Back to 
                <a  onClick={handleClick} className="text-themeblue ml-2 cursor-pointer">
                  Sign in
                </a>{" "}
              </p>
            </div>
          </form>
        </div>
        <StaticImage />
      </div>
    </div>
  );
};

export default ForgotPassword;
