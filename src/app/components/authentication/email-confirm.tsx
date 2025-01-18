"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmEmail , logout, setDetailstoLocal} from "../../services/auth-service";
import VerificationInput from "react-verification-input";
import { useContext } from 'react';
import { DataContext } from '../../context/shareData';
import { forgotPassword ,resendSignupCode} from "../../services/auth-service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StaticImage from "../../../../authImage";
import { ApiResponse, ConfirmdCodeData, loginResponseData } from "@/app/shared/response/apiResponse";
import { DataContextResponseType, ErrorType, UserDataType } from "@/app/shared/dataPass";
import navigations from "@/app/constants/navigations";
import { getUserDetails } from "@/app/services/user-service";
import Countdown from 'react-countdown';
import { ErrorCode, LocalStorageType, PageConstant, Titles } from "@/app/constants/pages";
import { useLoading } from "@/app/context/LoadingContext";

const EmailConfirm: React.FC = () => {

  const context = useContext(DataContext);
  if (!context) {
    throw new Error('DataContext must be used within a DataProvider');
  }

  
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<ErrorType>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [touched, setTouched] = useState(false);
  const [isExpired, setExpired] = useState(true);
  const [expirationTime, setExpirationTime] = useState<number>(Date.now() + 60000); // Store expiration time
const { setIsLoading } = useLoading();

  const router = useRouter();
  const details : DataContextResponseType = context.sharedData;
  useEffect(() => {
    if (touched) {
        const error ='';
      if(!code){
        setErrors({ code: error });
        setIsButtonDisabled(!code || !!error);
      }
    } else {
      setIsButtonDisabled(true);
    }
  }, [code, touched]);

  const handleCodeChange = (e:string) => {
    setCode(e);
    setIsButtonDisabled(false);
    if (!touched) setTouched(true);
  };

  const handleCode = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if(details.type == PageConstant.FORGOT_PASSWORD){
      context.setSharedData({email : details.email, code : code})
      router.push(navigations.resetPassword);
    }else{
      if (!errors.code && code) {
        setIsLoading(true);
        const response : ApiResponse<loginResponseData> = await confirmEmail(details.email || '',code,details.password || '');
        if (response?.IsSuccess && response.Data ) {
          const userDetails = await getUserData(localStorage.getItem(LocalStorageType.USER_ID) || '');
          setDetailstoLocal(response?.Data , userDetails  as UserDataType)
          toast.success(response?.Message, {position: "top-right"});
          setIsLoading(false);
          router.push(navigations.onboarding);
        } else {
          setIsLoading(false);
          if(response.StatusCode == ErrorCode.UNAUTHORISED){
            logout(router);
          }
          toast.error(response?.Message, {position: "top-right"});
        }
      }
    }
  };

  const getUserData = async(id:string) =>{
    const response : ApiResponse<UserDataType> = await getUserDetails(id);
    if(response?.IsSuccess){
        return response?.Data as UserDataType
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logout(router);
      }
    }
  }

  const handleForgotPassword = async () => {
    if (details.email) {
      const response :ApiResponse<ConfirmdCodeData> = await forgotPassword(details.email);
      if (response?.IsSuccess) {
        context.setSharedData({email : details.email, type : PageConstant.FORGOT_PASSWORD})
        toast.success(response?.Message, {position: "top-right"});
      } else {
        if(response.StatusCode == ErrorCode.UNAUTHORISED){
          logout(router);
        }
        toast.error(response?.Message, {position: "top-right"});
      }
    }
  };

  
  const handleSignupCode = async () => {
    if (details.email) {
      const response :ApiResponse<ConfirmdCodeData> = await resendSignupCode(details.email);
      if (response?.IsSuccess) {
        context.setSharedData({email : details.email, type : PageConstant.REGISTER})
        toast.success(response?.Message, {position: "top-right"});
      } else {
        if(response.StatusCode == ErrorCode.UNAUTHORISED){
          logout(router);
        }
        toast.error(response?.Message, {position: "top-right"});
      }
    }
  };

  const handleResend  = async () => {
    setExpired(true);
    setExpirationTime(Date.now() + 60000);
    if(details.type == PageConstant.FORGOT_PASSWORD){
      handleForgotPassword()
    }else if (details.type == PageConstant.REGISTER){
      handleSignupCode()
    }
  }

  const handleComplete = () => {
    setExpired(false);
  };

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
          <form onSubmit={handleCode} action="">
            <div>
              {details.type == PageConstant.FORGOT_PASSWORD &&
                <h2 className="form-title my-1 md:my-8 py-4">
                 {Titles.FORGET_PASSWORD_TITLE}
                </h2>
              }

              {details.type == PageConstant.REGISTER &&
                <h2 className="form-title my-1 md:my-8 py-4">
                 {Titles.VERIFY_CODE_TITLE}
                </h2>
              }
             
              <div className="flex flex-col w-full relative mb-6">
                <label
                  htmlFor="code"
                  className="text-black/85 text-base bg-white font-normal mb-3">
                  Enter Code
                </label>
                <VerificationInput classNames={{
                  container: "verify-input-container",
                  character: "verify-input",
                  characterInactive: "character--inactive",
                  characterSelected: "character--selected",
                  characterFilled: "character--filled",
                }} value={code} 
                onChange={(e) => {
                  const data =  e ? e  : '';
                  handleCodeChange(data)}}
                placeholder="" validChars="0-9" inputProps={{ inputMode: "numeric" }} length={6}/>
              </div>
              {isExpired && 
                 <div className="code-counter">
                  <Countdown
                    date={expirationTime} // 1 minutes from now
                    renderer={({ seconds }) => {
                        return (
                          <span>
                                <p>Your Code expires in:{seconds}</p>
                          </span>
                        );
                    }}
                    onComplete={handleComplete}
                  />
               </div>
              }  
             
              
              {!isExpired && 
                <div className="flex justify-between w-full relative" >
                  <div className="flex h-6 items-center gap-3">
                    <p className="text-textdark-900 font-normal text-sm md:text-base leading-6 text-center" >
                      Didn`t  receive the code?{" "}
                      <a onClick={handleResend} className="text-themeblue cursor-pointer">
                        Send Again
                      </a>{" "}
                    </p>
                  </div>
               </div>
              }  
              <div className="flex justify-between w-full relative">
                <button
                  className={`theme-primary-btn ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isButtonDisabled}
                >
                  Verify
                </button>
              </div>
            </div>
            
          </form>
        </div>
        <StaticImage />
      </div>
    </div>
  );
};

export default EmailConfirm;
