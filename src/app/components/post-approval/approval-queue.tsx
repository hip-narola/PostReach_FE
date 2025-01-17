'use client';
import React, { useEffect, useRef, useState } from "react";
import ApprovalPopup  from './approval-popup'
import InfiniteScroll from "@/app/common/custom-infinite-table";
import { useLoading } from "@/app/context/LoadingContext";
import { ApiResponse, PostData } from "@/app/shared/response/apiResponse";
import { getApproveOrRejectPost, getPostList } from "@/app/services/post-service";
import { ApproveRejectType, InfiniteScrollType, Post, PostListType } from "@/app/shared/dataPass";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CommonWords, ErrorCode, LocalStorageType, PageConstant, Titles } from "@/app/constants/pages";
import { logout } from "@/app/services/auth-service";
import { useRouter } from "next/navigation";
import RejectReasonPopup from "./reject-reason-popup";

const ApprovalQueue: React.FC = () => {
const router = useRouter();
const [ isOpens,setOpen] = useState<boolean>(false);
const [ isRejectOpens,setRejectOpen] = useState<boolean>(false);
const [approvalData, setApprovalData] = useState<PostListType>();
const [selectedData, setSelectedData] = useState<PostListType>([]);
const [disabled, setDisabled] = useState<boolean>(true);
const [isDataLoad, setDataLoad] = useState<boolean>(false);
const [type, setType] = useState<string>();
const { setIsLoading } = useLoading();
const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getPostListData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }
  },[])

  const getPostListData = async (obj: InfiniteScrollType) => {
    setIsLoading(true);
    const response: ApiResponse<PostData<PostListType>> = await getPostList(obj);
    if (response?.IsSuccess && response?.Data.details.length) {
      setIsLoading(false);
      setApprovalData((prevData) => [...(prevData || []), ...(response.Data.details as PostListType)]);
      setDataLoad(true);
    } else {
      if (response.StatusCode === ErrorCode.UNAUTHORISED) {
        logout(router);
      }
      setIsLoading(false);
      setDataLoad(true);
    }
  }

  const handleScroll = (obj: InfiniteScrollType) => {
    getPostListData(obj)
  }

  const handlePopup = async() => {
    setType(PageConstant.APPROVE)
    setOpen(true) 
  }
  
  const handleDataFromChild = (data: ApproveRejectType | null,type:string) => {
    console.log('type =>',type);
    setRejectOpen(false)
    setOpen(false);
    if(data){
      approveReject(data)
    }
    if(type != 'false'){
      getPostListData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }
  };

  const handleRejectClick = () =>{
    setRejectOpen(true)
  }
  const handleSelectedData  = (selectedData:Post[]) => {
    setSelectedData([])
    if(selectedData.length > 0){
      setSelectedData(selectedData);
      setDisabled(false);
    }
  }

  const handleRejectfromApproval = (obj:ApproveRejectType) => {
    setDataLoad(false);
    setApprovalData([]);
    approveReject(obj);
  }

  const handleReject = (obj:ApproveRejectType,type:string) =>{
    setRejectOpen(false);
    if(type ===  CommonWords.YES){
      approveReject(obj)
    }
  }

  const approveReject = async(obj:ApproveRejectType) => {
    setIsLoading(true);
    const response : ApiResponse<[]> = await getApproveOrRejectPost(obj);
    if(response?.IsSuccess){
      setIsLoading(false);
      toast.success(response?.Message, {position: "top-right"});
      setApprovalData([]);
      getPostListData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logout(router);
      }
      setApprovalData([]);
      getPostListData({limit: 10,pageNumber:1,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
      setIsLoading(false);
      toast.error(response?.Message, {position: "top-right"});
    }
  }

  const handleRecordClick = (data:PostListType,type:string) => {
    setOpen(true) 
    setType(type)
    setSelectedData([])
    setSelectedData(data);
  }
  const handleDelete = () => {}

  return ( 
    <div>
      <div className="page-content">
            <div className="page-body">
              <div className="table-head gap-3 justify-end">
                      <button onClick={handleRejectClick} className="icon-btn reject-btn" disabled={disabled}>
                        <img src="../assets/icons/reject-icon.svg" alt="Reject" />
                        REJECT
                      </button>
                      <button onClick={handlePopup} className="icon-btn approve-btn" disabled={disabled}>
                        <img src="../assets/icons/approve-icon.svg" alt="Approve" />
                        APPROVE
                      </button>
              </div>
              <div className="table-responsive">
                {isDataLoad &&
                  <InfiniteScroll 
                    selectedData={handleSelectedData} 
                    tableData={approvalData || []} 
                    onScrollData={handleScroll} 
                    type={PageConstant.APPROVE} openPopup={handleRecordClick}>
                  </InfiniteScroll> }
              </div>
            </div>
      </div>

                {/* model  */}
                    <ApprovalPopup
                      showModal={isOpens}
                      title={Titles.APPROVAL_QUEUE_TITLE} 
                      onSendData={handleDataFromChild} 
                      type={type  || ''} 
                      popupData={selectedData} 
                      rejectPopup={handleRejectfromApproval}
                      DeletePopup={handleDelete}>
                    </ApprovalPopup> 
                {/* model  */}

                {/* model    */}
                  <RejectReasonPopup
                    showModal={isRejectOpens} title={Titles.REJECT_QUEUE_TITLE} 
                    onCloseModel={handleDataFromChild}  onSendData={handleReject} popupData={selectedData}>
                </RejectReasonPopup>
                {/* model    */}
    </div>
 );
};

export default ApprovalQueue;