"use client";
import React, {  useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logout, register, userStatus } from "../../services/auth-service";
import { useContext } from 'react';
import { DataContext } from '../../context/shareData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StaticImage from "../../../../authImage";
import { ApiResponse, SignupResponseData, SocialMediaType, UserProfileData } from "../../shared/response/apiResponse";
import navigations from "@/app/constants/navigations";
import { useLoading } from '../../context/LoadingContext';
import {Checkbox} from "@nextui-org/checkbox";
import { ErrorCode, LocalStorageType, PageConstant } from "@/app/constants/pages";
import APIRoutes from "@/app/constants/API-Routes";
import { getUserDetails } from "@/app/services/user-service";
import { UserDataType } from "@/app/shared/dataPass";

const Registration: React.FC = () => {

  const context = useContext(DataContext);

  if (!context) {
    throw new Error('DataContext must be used within a DataProvider');
  }


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [isUsernameTouched, setIsUsernameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const router = useRouter();
  const hasFetched = useRef(false);
  const { setIsLoading } = useLoading();
  const searchParams = useSearchParams();
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let isValid = true;

    if (username === "") {
      setUsernameError("First name is required.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (email === "") {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError("");
    }

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
    if(terms){
      if(username != '' && password != '' && email != ''){
        isValid = true;
      }else{
        isValid = false;
      }
    }else{
      isValid = false;
    }

    setIsButtonDisabled(!isValid);
  };

  useEffect(() => {
    validateForm();
  }, [username, email, password , terms]);

  const handleRegister = async  (e: React.FormEvent) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      setIsLoading(true);
      const response :ApiResponse<SignupResponseData> = await register(username, email, password);
      if (response?.IsSuccess && response?.Data) {
        setIsLoading(false);
        router.push(navigations.confirmCode);
        context.setSharedData({email : email, password : password,type : PageConstant.REGISTER})
        toast.success(response?.Message, {position: "top-right"});
      } else {
        setIsLoading(false);
        setEmail('')
        setPassword('')
        setUsername('')
        toast.error(response?.Message, {position: "top-right"});
      }
    }
  };

   const handleClick = () => {
      router.push(navigations.login)
   }

   const callGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.googleSignIn}`;
  
  };
  const callFacebook = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.facebookSignIn}`;
   
  };

    useEffect(() => {
      if (!hasFetched.current) {
          hasFetched.current = true;
          callBackcheck();
      }
    }, []);

      const callBackcheck = async() => {
        const accessToken = searchParams.get('access_token') || '';
        // const refresh_token = searchParams.get('refresh_token') || '';
        const userId = searchParams.get('userId') || '';
    
        if(accessToken && userId){
          localStorage.setItem(LocalStorageType.ACCESS_TOKEN,accessToken)
          localStorage.setItem(LocalStorageType.USER_ID,userId)
          const userDetails =  await getUserData(userId);
          localStorage.setItem(LocalStorageType.USER_DETAILS,JSON.stringify(userDetails));
          UserStatusCheck(userId);
        }
      }

      const UserStatusCheck = async(id:string) => {
        setIsLoading(true);
        const response: ApiResponse<UserProfileData<SocialMediaType>>  = await userStatus(id);
         
         if(response?.IsSuccess){
           setIsLoading(false);
          
             if(response?.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length > 0){
              context.setSidebarAccess(true);
              localStorage.setItem(LocalStorageType.SIDEBAR_ACCESS,JSON.stringify(true))
              localStorage.setItem('ActiveSidebar', JSON.stringify(0));
               router.push(navigations.dashboard);
             }else if(response.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length == 0 ){
               context.setSidebarAccess(false);
               localStorage.setItem('LowerActiveSidebar', JSON.stringify(1));
               localStorage.setItem(LocalStorageType.SIDEBAR_ACCESS,JSON.stringify(false))
               router.push(navigations.socialLinks);
               router.refresh();
             }
          
           router.refresh();
         }else{
           setIsLoading(false);
           if(response.StatusCode == ErrorCode.UNAUTHORISED){
            logoutFn();
           }
         }
       }
    
        const getUserData = async(id:string) =>{
           setIsLoading(true);
           const response  = await getUserDetails(id);
           if(response?.IsSuccess){
             setIsLoading(false);
               return response?.Data as UserDataType
           }else{
             setIsLoading(false);
             if(response.StatusCode == ErrorCode.UNAUTHORISED){
              logoutFn();
             }
           }
         }

         const logoutFn = async() => {
          const response : ApiResponse<[]>  = await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '');
          
          if(response?.IsSuccess){
                setIsLoading(false);
                localStorage.clear();
                router.push(navigations.login)
          }else{
                setIsLoading(false);
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
          <img src="../assets/images/sign-up-img.png" alt="about" />
          </div>
          <form onSubmit={handleRegister} action="">
            <div>
              <h2 className="form-title my-1 md:my-8 py-4">
                Create an Account
              </h2>
              <div className="flex flex-col w-full relative mb-5">
                <label
                  htmlFor="username"
                  className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3"
                >
                  First name
                </label>
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setIsUsernameTouched(true);
                    }}
                    onBlur={() => setIsUsernameTouched(true)}
                    placeholder="Enter First name"
                    autoComplete="username"
                    className="form-custom-input"
                  />
                  {isUsernameTouched && usernameError && (
                    <span className="text-red-500 text-xs">
                      {usernameError}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full relative mb-5">
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailTouched(true);
                    }}
                    onBlur={() => setIsEmailTouched(true)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="form-custom-input"
                  />
                  {isEmailTouched && emailError && (
                    <span className="text-red-500 text-xs">{emailError}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full relative mb-5">
                <label
                  htmlFor="username"
                  className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3"
                >
                  Password
                </label>
                <div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsPasswordTouched(true);
                    }}
                    onBlur={() => setIsPasswordTouched(true)}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="form-custom-input"
                  />
                  {isPasswordTouched && passwordError && (
                    <span className="text-red-500 text-xs">
                      {passwordError}
                    </span>
                  )}
                  <div
                    className="absolute right-3 top-3 cursor-pointer z-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                       {!showPassword && <img src="../assets/icons/view-password-eye.svg" alt="password" />} 
                       {showPassword && <img src="../assets/icons/eye-off.svg" alt="password" />} 
                  </div>
                </div>
              </div>

              <div className="flex justify-between w-full relative">
                <div className="flex h-6 items-center gap-3">
                  <Checkbox  onValueChange={e => setTerms(e)}> I accept the Terms and Conditions</Checkbox>
                 
                </div>
              </div>

              <div className="flex justify-between w-full relative">
                <button
                  className={`theme-primary-btn ${
                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isButtonDisabled}
                >
                  Sign up
                </button>
              </div>
              <p className="text-center text-textdark font-semibold text-sm md:text-base leading-6">
                OR
              </p>
              <ul className="inline-flex justify-center w-full gap-4 md:gap-5 p-0 my-3">
                <li>
                  <button onClick={callFacebook}>
                  <img src="../assets/icons/Social-fb.png" alt="facebook" className="rounded-full max-w-[54px] md:max-w-[64px]" />
                  </button>
                </li>
                <li>
                  <button onClick={callGoogle}>
                    <img src="../assets/icons/Social-google.png" alt="google" className="rounded-full max-w-[54px] md:max-w-[64px]" />
                  </button>
                </li>
              </ul>
              <p className="text-textdark-900 font-normal text-sm md:text-base leading-6 text-center">
                {" "}
                Already have an Account?
                
                <a  className="text-themeblue ml-2 cursor-pointer"  onClick={handleClick}>
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

export default Registration;
