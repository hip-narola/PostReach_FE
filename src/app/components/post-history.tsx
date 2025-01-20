'use client';
import React, { useEffect, useRef, useState } from "react";
import ApprovalPopup  from './post-approval/approval-popup'
import InfiniteScroll from "@/app/common/custom-infinite-table";
import { useLoading } from "@/app/context/LoadingContext";
import { ApiResponse, PostData } from "@/app/shared/response/apiResponse";
import {  deletePost, getPostHistory } from "@/app/services/post-service";
import { ApproveRejectType, DeletePostType, InfiniteScrollType, Post, PostListType } from "@/app/shared/dataPass";
import { CommonWords, ErrorCode, LocalStorageType, PageConstant, Titles } from "../constants/pages";
import { logout } from "../services/auth-service";
import { useRouter } from "next/navigation";
import ConfirmationPopup from '../common/custom-confirmation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import navigations from "../constants/navigations";

const PostHisotry: React.FC = () => {
  const router = useRouter();
const [isOpens,setOpen] = useState<boolean>(false);
const [isConfirmOpen, setConfirmOpen] = useState(false);
const [selectedData, setSelectedData] = useState<PostListType>([]);
const [disabled, setDisabled] = useState<boolean>(true);
const [historyData, setHistoryData] = useState<PostListType>([]);
const [deleteData, setDeleteData] = useState<DeletePostType>();
const [isDataLoad, setDataLoad] = useState<boolean>(false);
const { setIsLoading } = useLoading();
const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getPostHistoryData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }
  },[])

  const getPostHistoryData = async (obj: InfiniteScrollType) => {
    setIsLoading(true);
    const response : ApiResponse<PostData<PostListType>> = await getPostHistory(obj);
    if (response?.IsSuccess && response?.Data.details.length) {
      setIsLoading(false);
      setHistoryData((prevData) => [...(prevData || []), ...(response.Data.details as PostListType)]);
      setDataLoad(true);
    }else{
      setIsLoading(false);
      setDataLoad(true);
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
    }
  }

  const handleScroll = (obj: InfiniteScrollType) => {
    getPostHistoryData(obj)
  }

  const handleRecordClick = (data:PostListType) => {
    setOpen(true) 
    setSelectedData(data);
  }

  const handleDeleteClick = () =>{
    setOpen(true) 
  }

  const handleSelectedData  = (selectedData:Post[]) => {
    if(selectedData.length > 0){
      setSelectedData(selectedData);
      setDisabled(false);
    }
  }

  const handleDataFromChild = (data: ApproveRejectType | null,type:string) => {
    console.log('data,type =>',data,type);
    
    setOpen(false);
    if(type != 'false'){
      setConfirmOpen(true);
    }
  };

  const handleReject = (type:string) =>{
    setConfirmOpen(false);
    if(type ===  CommonWords.YES){
       console.log('confirm delete =>');
       if (deleteData) {
        postDelete(deleteData);
      } else {
        console.error("deleteData is undefined!");
      }
    }else{
      console.log('decline delete =>');
    }
  }

  const postDelete = async(IDs:DeletePostType) => {
    console.log('obj =>',IDs);
    
    setIsLoading(true);
    const response : ApiResponse<[]> = await deletePost(IDs);
    if(response?.IsSuccess){
      setIsLoading(false);
      toast.success(response?.Message, {position: "top-right"});
      setHistoryData([]);
      getPostHistoryData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
      toast.error(response?.Message, {position: "top-right"});
    }
  }

  const handleRejectfromApproval = (data:ApproveRejectType) => {
    console.log('data =>',data);
    
  }

  const handleDelete = (data:DeletePostType) => {
    console.log('data =>',data);
    setDeleteData(data)
    setConfirmOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setConfirmOpen(false);
  }

  const logoutFn = async() => {
    localStorage.clear();
    router.push(navigations.login)
    await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '')
  }



  return ( 
    <div>
      <div className="page-content">
            <div className="page-body">
              <div className="table-head gap-3 justify-end">
                      <button onClick={handleDeleteClick} className="icon-btn reject-btn" disabled={disabled}>
                        <img src="../assets/icons/delete.svg" alt="Delete" />
                          DELETE
                      </button>
              </div>
              <div className="table-responsive">
                {isDataLoad &&
                  <InfiniteScroll 
                  tableData={historyData || []} 
                  onScrollData={handleScroll} 
                  type={PageConstant.HISTORY}
                  selectedData={handleSelectedData} 
                  openPopup={handleRecordClick}
                  ></InfiniteScroll>}
              </div>
            </div>
      </div>

      {/* model  */}
        <ApprovalPopup
          showModal={isOpens}
          title={Titles.DELETE_POST} 
          onSendData={handleDataFromChild} type={PageConstant.HISTORY} 
          popupData={selectedData} rejectPopup={handleRejectfromApproval} DeletePopup={handleDelete}>
        </ApprovalPopup> 
      {/* model  */}

      {/* model    */}
        <ConfirmationPopup
                   showModal={isConfirmOpen} 
                    type={CommonWords.DELETE} onSendData={handleReject} onCloseModel={handleClose}>
        </ConfirmationPopup>
      {/* model    */}
    </div>
 );
};

export default PostHisotry;