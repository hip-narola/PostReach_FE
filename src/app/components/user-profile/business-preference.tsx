"use client";
import React, { useState, useEffect, useRef } from "react";
import { getQuestionnaireList, getUserBusinessDetails, getUserBusinessOnBoradQuestionList, submitBusinessDetails, submitOnBoarding } from "../../services/user-service";
import { ApiResponse } from "@/app/shared/response/apiResponse";
import { AnswerType, BusinessDataType, QuestionnaireListType, QuestionnaireTypes } from "@/app/shared/dataPass";
import GlobalTable from "@/app/common/GlobalTable";
import GlobalPopup from "@/app/common/GlobalPopup";
import { useLoading } from "@/app/context/LoadingContext";
import { toast } from 'react-toastify';
import { ErrorCode, LocalStorageType, Titles } from "@/app/constants/pages";
import { logout } from "@/app/services/auth-service";
import { useRouter } from "next/navigation";
import navigations from "@/app/constants/navigations";

const BusinessPreference: React.FC = () => {
  const router = useRouter();
  const hasFetched = useRef(false);
  const [ isOpens,setOpen] = useState<boolean>(false);
  const [onBoardQuestionData , setOnBoardQuestionData] = useState<QuestionnaireTypes>();
  const { setIsLoading } = useLoading();
  const [displayImage , setDisplayImage] = useState('');
  const [brand , setBrand] = useState('');
  const [website , setWebsite] = useState('');
  const [location , setLocation] = useState('');
  const [use , setUse] = useState('');
  const [profileImage , setProfileImage] = useState<Blob | undefined>();
  const [overview , setOverview] = useState('');
  const [questionList , setQuestionList] = useState<QuestionnaireListType>();

  const getBusinessOnBoradQuestionList = async(questionType:number) =>{
    setIsLoading(true);
    const response : ApiResponse<QuestionnaireTypes> = await getUserBusinessOnBoradQuestionList(localStorage.getItem(LocalStorageType.USER_ID) || '',questionType);
    if(response?.IsSuccess){
      setIsLoading(false);
      setOnBoardQuestionData(response.Data as QuestionnaireTypes);
      setOpen(true);
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
    }
  }

  const getBusinessData = async() =>{
    setIsLoading(true);
    const response = await getUserBusinessDetails(localStorage.getItem(LocalStorageType.USER_ID) || '');
    if(response?.IsSuccess && response?.Data){
      setIsLoading(false);
      setData(response?.Data as BusinessDataType)
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
    }
  }

  const setData = async (userData :  BusinessDataType) => {
    setBrand(userData.brand_name)
    setWebsite(userData.website)
    setUse(userData.use)
    setDisplayImage(userData.image);
    setLocation(userData.location)
    setOverview(userData.overview)
}

  const handleView = (questionType:number) => {
    getBusinessOnBoradQuestionList(questionType);
  }

  const handleDataFromChild = (data: string) => {
    console.log('data =>',data);
    setOpen(false)
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('brand_name', brand);
    formData.append('location', location);
    formData.append('website',website);
    formData.append('overview', overview);
    formData.append('use', use);
    formData.append('user_id', localStorage.getItem(LocalStorageType.USER_ID) || '');
    if (profileImage) {
        formData.append('image', profileImage);
    }else{
        formData.append('image', displayImage);
    }
  
    const response : ApiResponse<BusinessDataType> = await submitBusinessDetails(formData);

    if (response?.IsSuccess) {
        setIsLoading(false);
        toast.success(response?.Message, {position: "top-right"});
      } else {
        setIsLoading(false);
        toast.error(response?.Message, {position: "top-right"});
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

  const handlePopupSubmit =async (answer:AnswerType[],questionType:string) => {
    const userId = localStorage.getItem(LocalStorageType.USER_ID) || '';
    setIsLoading(true);
    const response = await submitOnBoarding(answer, userId, questionType);
    if(response?.IsSuccess){
      setIsLoading(false);
      setOpen(false);
      getQuestionList();
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
    }
  }

  const getQuestionList = async() => {
    setIsLoading(true);
    const response : ApiResponse<QuestionnaireListType> = await getQuestionnaireList(localStorage.getItem(LocalStorageType.USER_ID) || '');
    if(response?.IsSuccess && response?.Data){
      setIsLoading(false);
      setQuestionList(response?.Data as QuestionnaireListType)
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getBusinessData();
      getQuestionList();
    }
  },[]);

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
    <div className="m-0 md:my-10 p-4 md:px-6">
          <div className="mb-4 md:mb-10">
              <h2 className="py-2 px-3 text-themeblue text-base leading-7 font-normal  border-0 border-b-2 border-b-themeblue w-max m-auto">Bussiness Info</h2>
          </div>
          <form action="" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full relative mb-5">

              <div className="sm:col-span-2">
                <div className="flex flex-col w-full relative mb-5">
                    <label htmlFor="file-upload" className="relative cursor-pointer w-max mx-auto">
                      <div className="w-[100px] h-[100px] rounded-full  relative">
                        {!displayImage && <img src="../../assets/images/bussiness-profile-icon.png" className="h-full w-full object-cover rounded-full" />}
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
            </div>
            <div className="border-0 md:border border-[#F3F3F3] rounded-lg p-0 md:p-3 lg:pt-6">
              <div className="grid grid-cols-1 gap-0 sm:gap-x-5 sm:gap-y-3 sm:grid-cols-2">

                  <div className="sm:col-span-1">
                    <div className="flex flex-col w-full relative mb-5">
                      <label htmlFor="Brand" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Brand</label>
                      <div>
                        <input
                          id="Brand"
                          name="Brand"
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Brand"
                          autoComplete="Brand"
                          className="form-custom-input"
                        />

                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <div className="flex flex-col w-full relative mb-5">
                      <label htmlFor="Website/URL" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Website/URL</label>
                      <div>
                        <input
                          id="Website/URL"
                          name="Website/URL"
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="Website / URL"
                          autoComplete="Website/URL"
                          className="form-custom-input"
                        />

                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                  
                    <div className="flex flex-col w-full relative mb-5">
                      <label htmlFor="Use" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Use</label>
                      <div>
                        <input
                          id="Use"
                          name="Use"
                          type="text"
                          value={use}
                          onChange={(e) => setUse(e.target.value)}
                          placeholder="Use"
                          autoComplete="Use"
                          className="form-custom-input"
                        />

                      </div>
                    </div>
                  </div>
                
                  <div className="sm:col-span-1">
                    
                    <div className="flex flex-col w-full relative mb-5">
                      <label htmlFor="Location" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Location</label>
                      <div>
                        <input
                          id="Location"
                          name="Location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Location"
                          autoComplete="Location"
                          className="form-custom-input"
                        />

                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                  <h3 className="text-xl leading-8 text-[#323232] font-semibold mb-3">Business Overview</h3>
                    <div className="flex flex-col w-full relative mb-5">
                      <label htmlFor="Overview" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">Overview</label>
                      <div>
                        <textarea
                          id="Overview"
                          name="Overview"
                          typeof="textarea"
                          value={overview}
                          onChange={(e) => setOverview(e.target.value)}
                          placeholder="Overview"
                          autoComplete="Overview"
                          className="form-custom-input"
                        ></textarea>

                      </div>
                    </div>
                  </div>

              </div>
              <div className="flex flex-row flex-wrap justify-end items-center gap-4 w-full relative mt-2 mb-6 md:mt-6 md:mb-8">
              <button className="theme-primary-btn btn-sm w-auto px-5 my-0 capitalize font-medium">Save Changes</button>
            </div>
            
            {questionList && <GlobalTable data={questionList} onSendData={handleView}/>}
            </div>
            
          </form>
            

            {/* model    */}
              {isOpens && 
              <GlobalPopup 
                onSendData={handleDataFromChild} 
                showModal={isOpens} 
                title={Titles.VIEW_EDIT_TITLE} 
                onSubmit={handlePopupSubmit}
                data = {onBoardQuestionData as QuestionnaireTypes} 
              />
                }
            {/* model    */}
    </div>
  );
};

export default BusinessPreference;