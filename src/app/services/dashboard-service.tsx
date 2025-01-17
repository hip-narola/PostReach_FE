import {  apiPost, } from "./commonApiService";
import APIRoutes from "../constants/API-Routes";
import { ApiResponse, DashboardData, SocialInsightsData } from "../shared/response/apiResponse";

export const getDashbord = async (obj:DashboardData) : Promise<ApiResponse<SocialInsightsData>> => {
  return apiPost<SocialInsightsData>(APIRoutes.dashboardList , obj );
};






