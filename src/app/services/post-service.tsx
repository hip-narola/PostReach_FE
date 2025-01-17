import {  apiGet, apiPost } from "./commonApiService";
import APIRoutes from "../constants/API-Routes";
import { ApproveRejectType, CalendarListType, DeletePostType, InfiniteScrollType, Post, PostListType } from "../shared/dataPass";
import { ApiResponse, PostData, ReasonListData } from "../shared/response/apiResponse";

export const getPostList = async (obj:InfiniteScrollType)  : Promise<ApiResponse<PostData<PostListType>>> => {
  return apiPost<PostData<PostListType>>(APIRoutes.getPostList , obj );
};

export const getApproveOrRejectPost = async (obj:ApproveRejectType): Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.approveRejectPost , obj );
};

export const getCalendarList = async (obj:CalendarListType): Promise<ApiResponse<Post[]>> => {
  return apiPost<Post[]>(APIRoutes.getCalendarList , obj );
};

export const getPostHistory = async (obj:InfiniteScrollType): Promise<ApiResponse<PostData<PostListType>>> => {
  return apiPost<PostData<PostListType>>(APIRoutes.getPostHistory , obj );
};

export const getRejectReason = async (): Promise<ApiResponse<ReasonListData[]>> => {
  return apiGet<ReasonListData[]>(APIRoutes.getRejectReason);
};

export const deletePost = async (obj:DeletePostType): Promise<ApiResponse<[]>> => {
  return apiPost<[]>(APIRoutes.deletePost , obj );
};






