"use client";
import React, { useState, useEffect, useContext } from "react";
import { submitUserDetails } from "../../services/user-service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiResponse } from "@/app/shared/response/apiResponse";
import { UserData, UserDataType} from '../../shared/dataPass'
import { DataContext } from "@/app/context/shareData";
import { useLoading } from "@/app/context/LoadingContext";
import { useRouter } from "next/navigation";
import { ErrorCode, LocalStorageType, PageConstant, Titles } from "@/app/constants/pages";
import { logout, resetPassword } from "@/app/services/auth-service";
import ResetPasswordPopup from "./reset-password-popup";
import navigations from "@/app/constants/navigations";
const AccountManagement: React.FC = () => {

    const context = useContext(DataContext);

    if (!context) {
        throw new Error('DataContext must be used within a DataProvider');
    }
    const router = useRouter();    
    const [userData , setUserData] = useState<UserData>();
    const [name , setName] = useState('');
    const [fName , setFName] = useState('');
    const [srName , setSrName] = useState('');
    const [email , setEmail] = useState('');
    const [profileImage , setProfileImage] = useState<Blob | undefined>();
    const [phoneNumber , setPhoneNumber] = useState('');
    const [isActive , setIsActive] = useState(true);
    const [displayImage , setDisplayImage] = useState('');
    const [ isOpens,setOpen] = useState<boolean>(false);
    const [phoneError, setPhoneError] = useState("");
    const [isPhoneTouch, setPhoneTouch] = useState(false);
    const [buttonDisabled, setIsButtonDisabled] = useState(false);
    const { setIsLoading } = useLoading();
   

    const getUserData = async() =>{
        const response = localStorage.getItem(LocalStorageType.USER_DETAILS) && JSON.parse(localStorage.getItem(LocalStorageType.USER_DETAILS) || '');
        
        if(response){
            setUserData(response);
            setData(response)
        }
    }

    const setData = async (userData :  UserData) => {
        
        setEmail(userData.email)
        if(userData.name && userData.name.includes(' ')){
            const newName = userData.name.split(' ');
            setFName(newName[0])
            setSrName(newName[1])
        }else{
            setFName(userData.name)
        }
        setName(userData.name)
        // setProfileImage(userData.profilePicture)
        setDisplayImage(userData.profilePicture);
        setPhoneNumber(userData.phone)
        setIsActive(userData.isActive)
    }
   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone',phoneNumber);
        formData.append('isActive', String(isActive));
        if (profileImage) {
            formData.append('profilePicture', profileImage);
        }else{
            formData.append('profilePicture', displayImage);
        }
       
        const response : ApiResponse<UserDataType> = await submitUserDetails(formData, localStorage.getItem(LocalStorageType.USER_ID) || '');
       
        if (response?.IsSuccess && response?.Data) {
            localStorage.setItem(LocalStorageType.USER_DETAILS,JSON.stringify(response?.Data))
            context.setSharedData({data : response?.Data,type : PageConstant.USER_PROFILE})
            setIsLoading(false);
            toast.success(response?.Message, {position: "top-right"});
          } else {
             if(response.StatusCode == ErrorCode.UNAUTHORISED){
                logoutFn();
             }
            setIsLoading(false);
            toast.error(response?.Message, {position: "top-right"});
          }
    }

    const setUserName =  async () => {
        if(fName && srName){
            setName(fName + ' ' + srName)
        }else  if(fName){
            setName(fName)
        }
    }

    // Event handler for file input change
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        // Create a URL for the selected file and update the state
        setProfileImage(file)
        setDisplayImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
       getUserData();
    },[]);

    const handleDataFromChild = (data: string) => {
        console.log('data =>',data);
        setOpen(false)
    };

    const handleReset = async(email:string,password:string,code:string) => {
        setIsLoading(true);
        const response :ApiResponse<[]> = await resetPassword(email,password,code);
    
        if (response?.IsSuccess) {
          // Navigate to the login
          toast.success(response?.Message, {position: "top-right"});
          router.push(navigations.login);
          setIsLoading(false);
          router.refresh();
          localStorage.clear();
        } else {
          setIsLoading(false);
          toast.error(response?.Message, {position: "top-right"});
            if(response.StatusCode == ErrorCode.UNAUTHORISED){
                logoutFn();
             }
        }
    }

    const validateMobile = (number: string) => {
        const numberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        return numberRegex.test(number);
    };

    const validateForm = () => {
        if (phoneNumber && !validateMobile(phoneNumber)) {
            setPhoneError("Please enter a valid mobile number.");
            setIsButtonDisabled(true);
          } else {
            setPhoneError("");
            setIsButtonDisabled(false);
          }
    };

    useEffect(() => {
        validateForm();
    }, [phoneNumber]);


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
    <div>
        <div className="m-0 md:my-10 p-4 md:px-6">
            <form action="" onSubmit={handleSubmit}>
                <div className="border-0 md:border border-[#E4E7EC] rounded-lg p-0 md:p-6">
                    <div className="sm:col-span-2">
                            <div className="flex flex-wrap w-full relative max-[767px]:justify-center">
                                <h4 className="mb-5 text-[#323232] text-lg font-medium">User Profile</h4>
                            </div>
                    </div>
                    <div className="border border-[#E4E7EC] rounded-lg py-6 px-3 md:p-6">
                        <div className="grid grid-cols-1 gpa-0 sm:gap-4 md:gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <div className="flex flex-col w-full relative mb-5">
                                            <label htmlFor="file-upload"
                                            className="relative cursor-pointer w-max mx-auto">
                                            <div className="w-[100px] h-[100px] rounded-full  relative">
                                                {!displayImage && <img src="../../assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" />}
                                                {displayImage && (
                                                    <img src={displayImage} alt="User Image"  className="h-full w-full object-cover rounded-full" />
                                                )}
                                                <div className="absolute bottom-0 right-0">
                                                    <img src="../../assets/icons/edit-profile-icon.svg" alt="edit profile" />
                                                </div>
                                            </div>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange}/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <div className="flex flex-col w-full relative mb-5">
                                            <label htmlFor="name" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Name</label>
                                            <div>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={fName}
                                                onChange={(e) => setFName(e.target.value)}
                                                onBlur={setUserName}
                                                placeholder="First Name"
                                                autoComplete="name"
                                                className="form-custom-input"
                                            />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <div className="flex flex-col w-full relative mb-5">
                                            <label htmlFor="srname" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Sr Name</label>
                                            <div>
                                            <input
                                                id="srname"
                                                name="srname"
                                                type="text"
                                                value={srName}
                                                onChange={(e) => setSrName(e.target.value)}
                                                onBlur={setUserName}
                                                placeholder="Last Name"
                                                autoComplete="srname"
                                                className="form-custom-input"
                                            />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <div className="flex flex-col w-full relative mb-5">
                                            <label htmlFor="email" className="z-10 text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Email</label>
                                            <div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                disabled
                                                placeholder="Email"
                                                autoComplete="email"
                                                className="form-custom-input opacity-65 bg-[#8686861a] cursor-no-drop"
                                            />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <div className="flex flex-col w-full relative mb-5">
                                            <label htmlFor="phone" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Phone</label>
                                            <div>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="text"
                                                    value={phoneNumber}
                                                    onChange={(e) => 
                                                       { setPhoneTouch(true);
                                                        setPhoneNumber(e.target.value)}}
                                                    placeholder="Mobile Number"
                                                    autoComplete="phone"
                                                    className="form-custom-input"
                                                    onBlur={() => setPhoneTouch(true)}
                                                />
                                                {isPhoneTouch && phoneError && (
                                                    <span className="text-red-500 text-xs">
                                                        {phoneError}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="flex flex-col w-full relative">
                                            <label htmlFor="password" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">password</label>
                                            <div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={123456748}
                                                className="form-custom-input"/>
                                            <a  onClick={() =>setOpen(true)} className="text-themeblue font-normal  text-xs leading-5 block mt-2 text-end cursor-pointer">
                                                Change Password
                                            </a>
                                            </div>
                                        </div>
                                    </div>
                                  
                                       {/* model    */}
                                           {isOpens && 
                                           <ResetPasswordPopup
                                                onSendData={handleDataFromChild}
                                                showModal={isOpens}
                                                title={Titles.RESET_PASSWORD_TITLE}
                                                data ={userData as UserData}
                                                onSubmit={handleReset}>
                                            </ResetPasswordPopup> } 
                                        {/* model    */}

                        </div>
                        
                    </div>
                    <div className="flex flex-row flex-wrap justify-end items-center gap-4 w-full relative  mt-6 md:mt-10">
                        <button className="theme-primary-outline-btn btn-sm w-auto px-5 my-0 capitalize font-medium">Manage Subscription</button>
                        <button className="theme-primary-btn btn-sm w-auto px-5 my-0 capitalize font-medium" disabled={buttonDisabled}>Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AccountManagement;