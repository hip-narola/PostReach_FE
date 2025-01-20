'use client'
import {Select, SelectItem} from "@nextui-org/react";
import React, {useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useLoading } from "../context/LoadingContext";
import { ApiResponse, SocialInsightsData } from "../shared/response/apiResponse";
import { getDashbord } from "../services/dashboard-service";
import { ErrorCode, LocalStorageType } from "../constants/pages";
import { logout } from "../services/auth-service";
import { useRouter } from "next/navigation";
import { days, platformList } from "../constants/DahsboardData";
import navigations from "../constants/navigations";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [selectedPlatform, setSelectedPlatform] = useState<number>();
  const [insightsData, setInsightsData] = useState<SocialInsightsData>();
  const { setIsLoading } = useLoading();

  const getDashboardDetail = async () => {
    setIsLoading(true);
    const obj ={
      days: selectedDays,
      userId: parseInt(localStorage.getItem(LocalStorageType.USER_ID) || ''),
      platform: selectedPlatform
    }
    const response : ApiResponse<SocialInsightsData> = await getDashbord(obj);
    if (response?.IsSuccess && response?.Data) {
      setInsightsData(response.Data);
    }  else if(response.StatusCode == ErrorCode.UNAUTHORISED){
      logoutFn();
    }
    setIsLoading(false);
  };

  useEffect(() => {
      getDashboardDetail();
  }, [selectedDays, selectedPlatform]);

    // Function to round percentages to 2 decimal places
    const roundToTwoDecimalPlaces = (value: number) => {
      return value.toFixed(2);
    };

    const logoutFn = async() => {
      localStorage.clear();
      router.push(navigations.login)
      await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '')
    }


  return (

    <div>
      <div className="page-content">
        <div className="mb-4 md:mb-6">
           <h2 className="page-title text-center md:text-left">Analytics </h2>
        </div>
        <div className="flex items-center justify-start md:justify-between w-full mb-4 gap-3">
        <Select
            label=""
             placeholder="Select days"
            className="analytics-select max-w-fit"
            defaultSelectedKeys={JSON.stringify(selectedDays)}
            onChange={(e) => setSelectedDays(parseInt(e.target.value))}
          >
            {days.map((day) => (
              <SelectItem className="select-list-item" key={day.key}>
                {day.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label=""
            placeholder="Choose Platform"
            className="analytics-select max-w-fit"
            onChange={(e) => setSelectedPlatform(parseInt(e.target.value))}
          >
            {platformList.map((social) => (
              <SelectItem className="select-list-item" key={social.key}>
                {social.label}
              </SelectItem>
            ))}
          </Select>
         
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3  m-auto  md:gap-4 lg:gap-6">
           <div className="sm:col-span-1">
             <div className="flex flex-col gap-2 py-5 px-6 border border-[#f3f3f3] rounded-lg h-full md:p-4">
               <img src="../assets/icons/total-post-icon.svg" height={42} width={42} alt="total post" />
               <h4 className="text-base font-normal text-[#32475C99] mt-3">Total Posts</h4>
               <p  className="text-2xl font-semibold text-[#32475CDE]">{insightsData?.Posts.TotalPost}</p>
              </div>
            </div>
            <div className="sm:col-span-1">
            <div className="flex flex-col gap-2 py-5 px-6 border border-[#f3f3f3] rounded-lg h-full md:p-4">
            <img src="../assets/icons/approved-post-icon.svg" height={42} width={42} alt="approved post" />
              <h4 className="text-base font-normal text-[#32475C99] mt-3">Approved Posts</h4>
              <p  className="text-2xl font-semibold text-[#32475CDE]">{insightsData?.Posts.ApprovedPost}</p>
              </div>
            </div>
            <div className="sm:col-span-1">
            <div className="flex flex-col gap-2 py-5 px-6 border border-[#f3f3f3] rounded-lg h-full md:p-4">
            <img src="../assets/icons/rejected-post-icon.svg" height={42} width={42} alt="rejected post" />
              <h4 className="text-base font-normal text-[#32475C99] mt-3">Rejected Posts</h4>
              <p  className="text-2xl font-semibold text-[#32475CDE]">{insightsData?.Posts.RejectedPost}</p>
              </div>
            </div>  

        </div>

        <div className="grid grid-cols-1 gap-3  lg:grid-cols-3  m-auto mt-6  md:gap-4 lg:gap-6">
           <div className="md:col-span-1">
             <div className="flex flex-col gap-2 p-5 border border-[#f3f3f3] rounded-lg h-full md:p-4">
               <h4 className="text-lg font-normal text-[#323232]">Impressions</h4>
               <div className="flex items-center gap-2 mb-5">
               <p className="text-base font-normal text-[#132E52]">{insightsData?.Impression.Count}</p>
                <div className={`flex items-center py-1 px-2 gap-1 bg-[#2E7D320A] text-sm rounded 
                  ${insightsData?.Impression && insightsData?.Impression?.Percentage < 0 ? 'text-[#D32F2F]' : 'text-[#4CAF50]'}`}>
                  { insightsData?.Impression && insightsData?.Impression?.Percentage < 0 ? 
                    <img src="../assets/icons/down-arrow (1).svg" height={20} width={20} alt="down" /> 
                    :
                    <img src="../assets/icons/up-arrow.svg" height={20} width={20} alt="up" />
                  }
                  {roundToTwoDecimalPlaces(insightsData?.Impression.Percentage || 0)}%
                </div>
               </div>
               <div>
                <LineChart  className="max-w-full" width={450} height={230} data={insightsData?.Impression.Chart}>
                  <Line type="monotone" dataKey="value" stroke="#004BDE" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                </LineChart>
                </div>
               
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="flex flex-col gap-2 p-5  border border-[#f3f3f3] rounded-lg h-full md:p-4">
               <h4 className="text-lg font-normal text-[#323232]">New Followers</h4>
               <div className="flex items-center gap-2 mb-5">
                <p className="text-base font-normal text-[#132E52]">{insightsData?.Followers.Count}</p>
                <div className={`flex items-center py-1 px-2 gap-1 bg-[#2E7D320A] text-sm rounded 
                  ${insightsData?.Followers && insightsData?.Followers?.Percentage < 0 ? 'text-[#D32F2F]' : 'text-[#4CAF50]'}`}>
                  {insightsData?.Followers && insightsData?.Followers?.Percentage < 0 ? 
                    <img src="../assets/icons/down-arrow (1).svg" height={20} width={20} alt="down" /> 
                    :
                    <img src="../assets/icons/up-arrow.svg" height={20} width={20} alt="up" />
                  }
                  {roundToTwoDecimalPlaces(insightsData?.Followers.Percentage || 0)}%
                </div>
              
               </div>
               <div>
                <LineChart  className="max-w-full" width={450} height={230} data={insightsData?.Followers.Chart}>
                  <Line type="monotone" dataKey="value" stroke="#004BDE" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                </LineChart>
                </div>
               
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="flex flex-col gap-2 p-5 border border-[#f3f3f3] rounded-lg h-full md:p-4">
               <h4 className="text-lg font-normal text-[#323232]">Engagements</h4>
               <div className="flex items-center gap-2 mb-5">
               <p className="text-base font-normal text-[#132E52]">{insightsData?.Engagements.Count}</p>
               <div className={`flex items-center py-1 px-2 gap-1 bg-[#2E7D320A] text-sm rounded 
                  ${insightsData?.Engagements && insightsData?.Engagements?.Percentage < 0 ? 'text-[#D32F2F]' : 'text-[#4CAF50]'}`}>
                  
                  { insightsData?.Engagements && insightsData?.Engagements?.Percentage < 0 ? 
                    <img src="../assets/icons/down-arrow (1).svg" height={20} width={20} alt="down" /> 
                    :
                    <img src="../assets/icons/up-arrow.svg" height={20} width={20} alt="up" />
                  }
                  {roundToTwoDecimalPlaces(insightsData?.Engagements.Percentage || 0)}%
                </div>
                
               </div>
               <div>
                <LineChart className="max-w-full" width={450} height={230} data={insightsData?.Engagements.Chart}>
                  <Line type="monotone" dataKey="value" stroke="#004BDE" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                </LineChart>
                </div>
              </div>
            </div>  

        </div>
      </div>
      {/* <div className="fixed right-6 bottom-24">
      <a href="#" className="bg-themeblue text-white px-4 py-1 gap-2 rounded-full inline-flex items-center"> 
        <img src="../assets/icons/ask-ai.svg" alt="ASK Ai" />Ask AI
      </a>
      </div> */}
    </div>
  );
};

export default Dashboard;
