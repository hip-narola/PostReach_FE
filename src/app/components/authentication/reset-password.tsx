'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, resetPassword } from "../../services/auth-service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { DataContext } from '../../context/shareData';
import StaticImage from "../../../../authImage";
import { DataContextResponseType } from "@/app/shared/dataPass";
import { ApiResponse } from "@/app/shared/response/apiResponse";
import navigations from "@/app/constants/navigations";
import { ErrorCode, LocalStorageType, PageConstant, Titles } from "@/app/constants/pages";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isCPasswordTouched, setIsCPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError]= useState("");
  const router = useRouter();
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('DataContext must be used within a DataProvider');
  }

  const details:DataContextResponseType = context.sharedData;

 


  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const response : ApiResponse<[]> = await resetPassword(details.email || '', password ,details.code || '');

    if (response?.IsSuccess) {
      // Navigate to the dashboard
      toast.success(response?.Message, {position: "top-right"});
      router.push(navigations.login);
    } else {
      context.setSharedData({email : details.email, type : PageConstant.FORGOT_PASSWORD})
      router.push(navigations.confirmCode);
      toast.error(response?.Message, {position: "top-right"});
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
    }
  };

  const handlePasswordChange = (e: string) => {
    setPassword(e);
    setIsPasswordTouched(true);
    setIsButtonDisabled(false);
  };

  const handleConfirmPasswordChange = (e: string) => {
    setConfirmPassword(e);
    setIsCPasswordTouched(true);
    setIsButtonDisabled(false);
  };
  
  useEffect(() => {
    validateInputs();
  }, [ password, confirmPassword]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateInputs = () => {
    let isValid = true;

    if (password === "") {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword === "") {
      setCPasswordError("Confirm Password is required.");
      isValid = false;
    } else if (!validatePassword(password)) {
      setCPasswordError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      isValid = false;
    } else {
      setCPasswordError("");
    }

    setIsButtonDisabled(!isValid);
  };

  const checkPassword = () =>{
    if(!passwordError && !cPasswordError){
      if (password === confirmPassword) {
          setCPasswordError("");
          setIsButtonDisabled(false);
      } else {
          setCPasswordError("Password and Confirm Password should be same"); 
          setIsButtonDisabled(true);
      }
    }
  }

  const logoutFn = async() => {
    const response : ApiResponse<[]>  = await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '');
    
    if(response?.IsSuccess){
          localStorage.clear();
          router.push(navigations.login)
    }else{
          if(response.StatusCode == ErrorCode.UNAUTHORISED){
            logoutFn();
          }
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] py-6 px-6 xl:px-[100px] min-h-screen flex items-start md:items-center">
    <div className="grid  grid-cols-1 w-full items-center  gap-6 xl:gap-x-16 md:grid-cols-2 grid-rows-1 xl:grid-cols-[666px,1fr]">
      <div className="flex  flex-col order-last md:flex">
        <div className="mx-auto">
          <img src="../assets/images/logo.png" alt="logo" />
        </div>
        <div className="flex md:hidden mt-4 mx-auto max-w-[290px]">
        <img src="../assets/images/sign-up-img.png" alt="sign-up-img-mobile" />
        </div>
        <form action="" onSubmit={handleReset}>
          <div>
          <h2 className="form-title my-1 md:my-8 py-4">{Titles.SET_NEW_PASSWORD_TITLE}</h2>
          
            <div className="flex flex-col w-full relative mb-5">
                <label htmlFor="newpassword" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">New Password</label>
                <div>
                  <input
                    id="newpassword"
                    name="newpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    autoComplete="newpassword"
                    value={password}
                    onChange={(e) => {
                       const data =  e.target.value ? e.target.value  : '';
                       handlePasswordChange(data)}}
                    className="form-custom-input"
                    onBlur={() => setIsPasswordTouched(true)}
                  />
                  {isPasswordTouched && passwordError && (
                    <span className="text-red-500 text-xs">
                      {passwordError}
                    </span>
                  )}
                  <div className="absolute right-3 top-3 cursor-pointer z-0" onClick={() => setShowPassword(!showPassword)}>
                    {!showPassword && <img src="../assets/icons/view-password-eye.svg" alt="password" />} 
                    {showPassword && <img src="../assets/icons/eye-off.svg" alt="password" />} 
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full relative">
                <label htmlFor="cpassword" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Confirm Password</label>
                <div>
                  <input
                    id="cpassword"
                    name="cpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="cpassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      const data =  e.target.value ? e.target.value  : '';
                      handleConfirmPasswordChange(data)}}
                    className="form-custom-input"
                    onBlur={checkPassword}
                  />
                  {isCPasswordTouched && cPasswordError && (
                    <span className="text-red-500 text-xs">
                      {cPasswordError}
                    </span>
                  )}
                  <div className="absolute right-3 top-3 cursor-pointer z-0" onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
                    {!showConfirmPassword && <img src="../assets/icons/view-password-eye.svg" alt="password" />} 
                    {showConfirmPassword && <img src="../assets/icons/eye-off.svg" alt="password" />} 
                  </div>
                </div>
              </div>
            <div className="flex justify-between w-full relative">
              
              <button className={`theme-primary-btn ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isButtonDisabled}>Set New Password</button>

            </div>
          </div>
        </form>
      </div>
      <StaticImage />
    </div>
  </div>
  );
};

export default ResetPassword;
