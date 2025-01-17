import {  apiGet, apiPost, apiPostFormData } from "./commonApiService";
import APIRoutes from "../constants/API-Routes";
import { AnswerType, BusinessDataType, DisconnectSocial, LinkSocialResponseType, NotificationListType, NotificationPost, OrganizationResponse, PostOrganizationObject, QuestionnaireListType, QuestionnaireTypes, UserDataType } from "../shared/dataPass";
import { ApiResponse } from "../shared/response/apiResponse";

export const getUserDetails = async (userId: string) : Promise<ApiResponse<UserDataType>>=> {
  return apiGet<UserDataType>(APIRoutes.getUserData , userId);
};

export const getUserBusinessDetails = async (userId: string) : Promise<ApiResponse<BusinessDataType>>=> {
  return apiGet<BusinessDataType>(APIRoutes.getBusinessPreference , userId);
};

export const getUserBusinessOnBoradQuestionList = async (userId: string,type:number): Promise<ApiResponse<QuestionnaireTypes>> => {
    return apiGet<QuestionnaireTypes>(APIRoutes.getBusinessOnBoradQuestionList , `${type}/${userId}`);
};

export const submitUserDetails = async (formData : FormData, id :string) : Promise<ApiResponse<UserDataType>> => {
    return apiPostFormData<UserDataType>(APIRoutes.updateUserDetails,  formData ,id);
};

export const getUserSocialLinks = async (userId: string) : Promise<ApiResponse<LinkSocialResponseType>> => {
  return apiGet<LinkSocialResponseType>(APIRoutes.getUserSocialLink , userId);
};


export const submitBusinessDetails = async (formData : FormData) : Promise<ApiResponse<BusinessDataType>> => {
  return apiPostFormData<BusinessDataType>(APIRoutes.submitBusinessPreference,  formData);
};


export const submitOnBoarding = async (data : AnswerType[],userId:string , type:string) : Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.submitOnBoard, data  ,`${type}/${userId}`);
};

export const getQuestionnaireList = async (userId: string) : Promise<ApiResponse<QuestionnaireListType>> => {
  return apiGet<QuestionnaireListType>(APIRoutes.getQuestionnairList , userId);
};


export const getOrganizationList = async (userId: string,platform:number) : Promise<ApiResponse<OrganizationResponse[]>> => {
  return apiGet<OrganizationResponse[]>(APIRoutes.organizationList , `${userId}/${platform}`);
};

export const selectPage = async (data: PostOrganizationObject) : Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.postOrganization , data);
};

export const disconnectSocial = async (data: DisconnectSocial) : Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.disconnectSocial , data);
};


export const getInteractions = async (userId: number,isRead:boolean) : Promise<ApiResponse<NotificationListType>> => {
  return apiGet<NotificationListType>(APIRoutes.getIneractions , `${userId}/${isRead}`);
};

export const readInteractions = async (notificationId :string, object :NotificationPost) : Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.readInteractions + `?notificationId=${notificationId}`, object);
};

export const trialSubscription = async (userId: number) : Promise<ApiResponse<[]>> => {
  return apiGet<[]>(APIRoutes.trialSubscritption, `${userId}`);
};





