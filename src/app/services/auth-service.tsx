import { apiPost, apiGet } from "./commonApiService";
import APIRoutes from "../constants/API-Routes"
import {  OnboardQuestionType, UserDataType } from "../shared/dataPass";
import { ApiResponse, ConfirmdCodeData, loginResponseData, SignupResponseData, SocialMediaType, UserProfileData } from "@/app/shared/response/apiResponse";
import { LocalStorageType } from "../constants/pages";

export const login = async (email: string,password: string,rememberMe: boolean): Promise<ApiResponse<loginResponseData>> => {
  return await apiPost<loginResponseData>(APIRoutes.login, { email,password,rememberMe});
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<ApiResponse<SignupResponseData>> => {
  return apiPost<SignupResponseData>(APIRoutes.registration, { username, email, password });
};

export const forgotPassword = async (email: string): Promise<ApiResponse<ConfirmdCodeData>> => {
  return apiPost<ConfirmdCodeData>(APIRoutes.forgotPassword, { email });
};

export const resendSignupCode = async (email: string) : Promise<ApiResponse<ConfirmdCodeData>>=> {
  return apiPost<ConfirmdCodeData>(APIRoutes.resendSignupCode, { email });
};

export const resetPassword = async (email: string,password:string,code:string)  : Promise<ApiResponse<[]>>=> {
  return apiPost<[]>(APIRoutes.resetPassword, { email,password,code });
};

export const userStatus = async (userId : string) : Promise<ApiResponse<UserProfileData<SocialMediaType>>> => {
  return apiGet<UserProfileData<SocialMediaType>>(APIRoutes.userStatus,userId);
};

export const confirmEmail = async (email: string,code: string,password:string) : Promise<ApiResponse<loginResponseData>> => {
  return apiPost<loginResponseData>(APIRoutes.confirmSignup, { email , code,password});
};


export const setDetailstoLocal = async (details:loginResponseData,userDetails : UserDataType) => {
  localStorage.setItem(LocalStorageType.ACCESS_TOKEN,details.accessToken)
  // localStorage.setItem(LocalStorageType.REFRESH_TOKEN,details.refreshToken)
  // localStorage.setItem(LocalStorageType.ID_TOKEN,details.idToken)
  localStorage.setItem(LocalStorageType.USER_ID,details.userId)
  localStorage.setItem(LocalStorageType.USER_DETAILS,JSON.stringify(userDetails));
};

export const getQuestionList = async (type:string,userId:string) : Promise<ApiResponse<OnboardQuestionType>> => {
  return apiGet<OnboardQuestionType>(APIRoutes.onboardUser , `${type}/${userId}`);
};

// export const logout = async(router: ReturnType<typeof useRouter>) => {
 
//   return apiPost<loginResponseData>(APIRoutes.logout, {accessToken});
// };

export const logout = async(accessToken: string)  : Promise<ApiResponse<[]>> => {
  console.log('accessToken =>',accessToken);
  
  return apiPost<[]>(APIRoutes.logout, {accessToken});
};


