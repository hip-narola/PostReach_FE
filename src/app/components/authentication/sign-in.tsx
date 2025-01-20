"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login ,logout, userStatus } from "../../services/auth-service";
import 'react-toastify/dist/ReactToastify.css';
import StaticImage from "../../../../authImage";
import { ApiResponse, loginResponseData, SocialMediaType, UserProfileData } from "@/app/shared/response/apiResponse";
import navigations from "@/app/constants/navigations";
import { useLoading } from '../../context/LoadingContext';
import { UserDataType } from "@/app/shared/dataPass";
import { ErrorCode, LocalStorageType, PageConstant } from "@/app/constants/pages";
import APIRoutes from "@/app/constants/API-Routes";
import { getUserDetails } from "@/app/services/user-service";
import { DataContext } from "@/app/context/shareData";
import { toast } from 'react-toastify';

const Login: React.FC = () => {

  const context = useContext(DataContext);

  if (!context) {
      throw new Error('DataContext must be used within a DataProvider');
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const { setIsLoading } = useLoading();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasFetched = useRef(false);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateInputs = () => {
    let isValid = true;

    if (isEmailTouched) {
      if (email === "") {
        setEmailError("Email is required.");
        isValid = false;
      } else if (!validateEmail(email)) {
        setEmailError("Please enter a valid email.");
        isValid = false;
      } else {
        setEmailError(""); // Clear the error if email is valid
      }
    }

    if (isPasswordTouched) {
      if (password === "") {
        setPasswordError("Password is required.");
        isValid = false;
      } else if (!validatePassword(password)) {
        setPasswordError("Password must be at least 8 characters.");
        isValid = false;
      } else {
        setPasswordError(""); // Clear the error if password is valid
      }
    }

    // Enable/disable the login button
    setIsButtonDisabled(!(isValid && email && password));
  };

  useEffect(() => {
    validateInputs();
  }, [email, password, isEmailTouched, isPasswordTouched]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailTouched(true); // Mark email as touched immediately when typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordTouched(true); // Mark password as touched immediately when typing
  };

  const handleRememberMeChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    validateInputs();
  
    if (emailError || passwordError) return;
  
    const response: ApiResponse<loginResponseData> = await login(
      email,
      password,
      rememberMe
    );
  
    if (response.IsSuccess && response.Data) {
      setIsLoading(false);
      // toast.success(response.Message, { position: "top-right" });
  
      const userId = response.Data.userId;
      localStorage.setItem(LocalStorageType.ACCESS_TOKEN,response.Data.accessToken)
      localStorage.setItem(LocalStorageType.USER_ID,response.Data.userId)
      const userDetails = await getUserData(userId);
      
      localStorage.setItem(LocalStorageType.USER_DETAILS,JSON.stringify(userDetails));
      UserStatusCheck(userId,false);
    } else {
      setIsLoading(false);
      setEmail("");
      setPassword("");
      toast.error(response.Message, { position: "top-right" });
    }
  };

  const UserStatusCheck = async(id:string,callback?:boolean) => {
    setIsLoading(true);
    const response: ApiResponse<UserProfileData<SocialMediaType>>  = await userStatus(id);
    
    if(response?.IsSuccess){
      setIsLoading(false);
      if(callback){
        if(response?.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length > 0){
          localStorage.setItem('ActiveSidebar', JSON.stringify(0));
          router.push(navigations.dashboard);
        }else if(response.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length == 0 ){
          context.setSidebarAccess(false);
          localStorage.setItem('LowerActiveSidebar', JSON.stringify(1));
          localStorage.setItem(LocalStorageType.SIDEBAR_ACCESS,JSON.stringify(false))
          router.push(navigations.socialLinks);
        }
      }else{
        if(response?.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length > 0){
        localStorage.setItem('ActiveSidebar', JSON.stringify(0));
        router.push(navigations.dashboard);
      }else if(response.Data.userProfileStatus.onboardingCompleted && response?.Data.userProfileStatus.socialMediaAccounts.length == 0 ){
        context.setSidebarAccess(false);
        localStorage.setItem('LowerActiveSidebar', JSON.stringify(1));
        localStorage.setItem(LocalStorageType.SIDEBAR_ACCESS,JSON.stringify(false))
        router.push(navigations.socialLinks);
      }else if(!response.Data.userProfileStatus.onboardingCompleted ){
        router.push(navigations.onboarding);
        localStorage.setItem(LocalStorageType.COMPLETE_STEP,JSON.stringify(response?.Data.userProfileStatus.maxStep))
      }
    }
      router.refresh();
    }else{
      setIsLoading(false);
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
    }
  }

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
      UserStatusCheck(userId,true);
    }
  }


  const callGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.googleSignIn}`;
  };
  const callFacebook = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.facebookSignIn}`;
   
  };

  const handleClick = (type? :string) => {
    if(type == PageConstant.FORGOT_PASSWORD){
      router.push(navigations.forgotPassword)
    }else{
      router.push(navigations.registration)
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
    localStorage.clear();
    router.push(navigations.login)
    await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '')
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
          <form onSubmit={handleLogin} action="">
            <div>
              <h2 className="form-title my-1 md:my-8 py-4">
                Welcome Back to PostReach
              </h2>

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
                    placeholder="Enter your email"
                    autoComplete="username"
                    className="form-custom-input"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setIsEmailTouched(true)}
                  />
                </div>
                {isEmailTouched && emailError && (
                  <span className="text-red-500 text-xs">{emailError}</span>
                )}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-custom-input"
                    autoComplete="current-password"
                    onBlur={() => setIsPasswordTouched(true)}
                  />
                  <div className="absolute right-3 top-3 cursor-pointer z-0"
                    onClick={() => setShowPassword(!showPassword)}>

                    {!showPassword && <img src="../assets/icons/view-password-eye.svg" alt="password" />} 
                    {showPassword && <img src="../assets/icons/eye-off.svg" alt="password" />} 
                    
                     
                  </div>
                </div>
                {isPasswordTouched && passwordError && (
                  <span className="text-red-500 text-xs">{passwordError}</span>
                )}
              </div>

              <div className="flex justify-between w-full relative">
                <div className="flex h-6 items-center gap-3">
                  <input
                    id="Rememberme"
                    name="Rememberme"
                    type="checkbox"
                    onChange={handleRememberMeChange}
                    value={JSON.stringify(rememberMe)}
                    className="h-4 w-4 rounded border-gray-300 text-themeblue focus:ring-themeblue"
                  />
                  <label
                    htmlFor="Rememberme"
                    className="font-normal text-gray-900  text-sm md:text-base"
                  >
                    Remember me
                  </label>
                </div>

                <a onClick={() => handleClick(PageConstant.FORGOT_PASSWORD)}
                  className="text-themeblue font-normal text-sm md:text-base leading-6 cursor-pointer">
                  Forgot Password
                </a>
              </div>

              <div className="flex justify-between w-full relative">
                <button
                  className={`theme-primary-btn ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isButtonDisabled}
                >
                  Log in
                </button>
              </div>
              <p className="text-center text-textdark  font-semibold text-sm md:text-base leading-6">
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
                Don’t have an Account?
                  <a className="text-themeblue ml-2 cursor-pointer" onClick={() => handleClick(PageConstant.REGISTER)}>
                    Sign up
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

export default Login;