// pages/index.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import CustomStepperWithLine from '../../common/custom-stepper';
import { getQuestionList } from '@/app/services/auth-service';
import { ApiResponse } from '@/app/shared/response/apiResponse';
import { OnboardQuestionType } from '@/app/shared/dataPass';
import { useLoading } from '@/app/context/LoadingContext';
import { LocalStorageType, QuestionnaireType } from '@/app/constants/pages';



const OnBoarding: React.FC = () => {
  const [questionData, setQuestionData] = useState<OnboardQuestionType[] | undefined>(undefined);
  const { setIsLoading } = useLoading();
  const hasFetched = useRef(false);
  
    const getQuestion = async() => {
      setIsLoading(true);
      const userId = localStorage.getItem(LocalStorageType.USER_ID) || '';
      const response : ApiResponse<OnboardQuestionType> = await getQuestionList(QuestionnaireType.ONBOARDING,userId);
      if(response?.IsSuccess){
        
        const data = response?.Data;
        if (Array.isArray(data)) {
          setQuestionData(data); // Ensure this matches the expected type
        } else {
          // Handle error if data is not an array of OnboardQuestionType
        }
        setIsLoading(false);
      }else{
        setIsLoading(false);
      }
    }
   

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getQuestion();
    }
  },[]);

  return (
    <div className="mx-auto max-w-[1440px]  flex items-center">
      <div className="flex w-full gap-8 p-[30px]  items-center min-h-screen">
        {/* <div className="flex-1 flex self-stretch  items-center justify-center rounded-[32px] bg-[#00C9FF08]">
          <img src="../assets/images/logo-lg.png" alt="logo" />
        </div> */}
        <div className="flex-1 flex flex-wrap p-16 max-w-[880px]  bg-[rgba(247,253,255,0.5)] mx-auto">
          <h2 className="text-2xl font-semibold text-themeblue text-center w-full">👋 Hi there! Welcome to PostReach!</h2>
          <p className="py-6 text-base font-normal text-[#5D5D5D] text-center">We’re excited to help you fully automate your social media posts. Please take a moment to answer the following questions so we can tailor your experience. The more you share with us, the better the content will be</p>
            
          {questionData && <CustomStepperWithLine  data={questionData}/>}
        </div>
      </div>

    </div>
    
  );
};


export default OnBoarding;