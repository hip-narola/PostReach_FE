"use client";
import React, { memo, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ApproveRejectType, DeletePostType, PostListType } from "@/app/shared/dataPass";
import moment from "moment";
import { CommonWords, LengthConstant, PageConstant, SocialMedia, Titles } from "@/app/constants/pages";
import RejectReasonPopup from "./reject-reason-popup";
interface ApprovalProps {
    showModal: boolean;
    title: string;
    onSendData: (data: ApproveRejectType | null,type:string) => void; // Prop to handle close action
    type:string;
    popupData:PostListType
    rejectPopup:(data: ApproveRejectType) => void;
    DeletePopup:(data: DeletePostType) => void;
  }
const  ApprovalPopup : React.FC<ApprovalProps> = ({ showModal, title, onSendData ,type,popupData ,rejectPopup,DeletePopup}) => {
    const [isOpen, setOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const closeModal = () => {
        onSendData(null,'false');
    };

    const handleStatusClick = (type:string) =>{
        if(type == PageConstant.APPROVE){
            const ids = popupData.map(item => item.id);
            const obj = {
                id: ids,
                isApproved: true,
                rejectreasonId: '',
                rejectReason:''
            }
            onSendData(obj,type)
        }else{
            if(type ==CommonWords.DELETE){
                const ids = popupData.map(item => item.postId);
                const obj = {
                    postIds: ids
                }
                DeletePopup(obj)
            }else{
                setOpen(true);
            }
            closeModal(); 
        }
       
    }

    const handleDataFromChild = (data: ApproveRejectType | null,type:string) => {
        console.log('type =>',type);
        
        setOpen(false);
       
        if(data){
            rejectPopup(data)
        }
    };

    const handleReject = (obj:ApproveRejectType,type:string) =>{
        setOpen(false);
        if(type ===  CommonWords.YES){
            rejectPopup(obj)
        }
    }

    const truncateContent = (content: string, wordLimit: number) => {
        if(content){
            const words = content.split(" ");
            return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ")
            : content;
        }else{
            return content;
        }
    };
    
      
        const handleToggle = (index: number) => {
            setExpandedItems((prev: number[]) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // Remove index to collapse
                : [...prev, index] // Add index to expand
            );
        };

  return (
    <div>
        {showModal && 
            <>
            <Modal isOpen={showModal} scrollBehavior={"inside"}  onClose={closeModal} >
            <ModalHeader className="flex flex-col px-6">
                  {title}
            </ModalHeader>
            <ModalContent className="max-w-[565px] post-preview-modal self-center py-2">
            { (
                <>
                <ModalHeader className="flex flex-col md:px-20 px-8">
                     <div className="md:px-6 px-0  text-xl leading-8 font-medium capitalize md:text-left text-center">
                        {title}
                     </div>
                </ModalHeader>
                    <ModalBody className="md:px-6 px-0">
                    <Carousel
                        additionalTransfrom={0}
                        arrows={popupData.length > 1} // Only show arrows if more than 1 item
                        autoPlaySpeed={3000}
                        infinite={false} 
                        centerMode={false}
                        className="post-preview-slider"
                        containerClass="container"
                        draggable
                        focusOnSelect={false}
                        itemClass=""
                        keyBoardControl
                        minimumTouchDrag={80}
                        pauseOnHover
                        responsive={{
                          desktop: {
                            breakpoint: { max: 3000, min: 1024 },
                            items: 1,
                          },
                          mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                          },
                          tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 1,
                          },
                        }}
                        rewind={false}
                        rewindWithAnimation={false}
                        rtl={false}
                        shouldResetAutoplay
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                      
                        >
                        {/* start slide-item */}
                        {popupData && popupData.map((item,index) => (
                            <div className="md:px-20 px-2 overflow-y-auto max-h-[500px]" key={index}> 
                            {item.channel ==  SocialMedia.FACEBOOK && 
                                <div className="p-3 mx-2 md:mx-0 border border-[#E4E7EC] bg-white rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full  relative">
                                            {item.profileImage ?
                                                <img src={item.profileImage} className="h-full w-full object-cover rounded-full "/>
                                                :
                                                <img src="/assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" alt="Default User"/>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-black font-normal">{item.user && item.user}</h4>
                                            <p className="text-xs text-[#5D5D5D] font-normal">
                                                {moment(item.scheduled_at).format('dddd')} at {moment(item.scheduled_at).format('HH:mm A')}
                                                </p>
                                        </div>
                                    </div>
                                    <div>
                                    <a>
                                        <img src="../assets/icons/post-slider/dots-horizontal-more.svg" alt="more"/>
                                    </a>    
                                    </div>
                                </div>
                                <div className="my-3"> 
                                    <p className="text-sm md:text-base">
                                        {expandedItems && expandedItems.includes(index)
                                            ?  <pre className="whitespace-break-spaces font-Roboto">{item.content}</pre>
                                            :  <pre className="whitespace-break-spaces font-Roboto">{truncateContent(item.content, LengthConstant.WordLimit)}</pre> 
                                          }
                                             {item.content && item.content.split(" ").length > LengthConstant.WordLimit && (
                                        <span className="text-sm font-medium cursor-pointer text-[#65676B] hover:text-themeblue"
                                            onClick={() => handleToggle(index)}
                                        >
                                            {expandedItems.includes(index) ? "...Read Less" : "... Read More"}
                                        </span>
                                        )}
                                        </p>
                                       
                                </div>
                                {item.image && 
                                    <div className="my-3 h-64 -mx-3">
                                            <img src={item.image}style={{ display: 'block',height: '100%',margin: 'auto',width: '100%',}}
                                                alt='User Image'/>
                                    </div>
                                }
                                <ul className="px-2 pt-3 border-t border-[#f43f3f3] flex justify-between items-center gap-4 md:gap-6">
                                    <li>
                                        <a  className="flex flex-1 items-center gap-2 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/facebook/Fb-like.svg" alt="like"/>
                                            <span>like </span>
                                        </a>   
                                    </li>
                                    <li>
                                        <a   className="flex flex-1 items-center gap-2 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/facebook/Fb-comment.svg" alt="comment"/>
                                            <span>Comment</span>
                                        </a>  
                                    </li>
                                    <li>
                                        <a   className="flex flex-1 items-center gap-2 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/facebook/Fb-share.svg" alt="share"/>
                                            <span>Share</span>
                                        </a>  
                                    </li>
                                </ul>
                               
                                </div>
                            }  

                            {item.channel == SocialMedia.INSTAGRAM && 
                                <div className="p-3 mx-2 md:mx-0 border border-[#E4E7EC] bg-white rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full  relative">
                                        {item.profileImage ?
                                                <img src={item.profileImage} className="h-full w-full object-cover rounded-full "/>
                                                :
                                                <img src="/assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" alt="Default User"/>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-black font-normal">{item.user && item.user}</h4>
                                            <p className="text-xs text-[#5D5D5D] font-normal">
                                                {moment(item.scheduled_at).format('dddd')} at {moment(item.scheduled_at).format('HH:mm A')}
                                                </p>
                                        </div>
                                    </div>
                                    <div>
                                    <a>
                                        <img src="../assets/icons/post-slider/dots-horizontal-more.svg" alt="more"/>
                                    </a>    
                                    </div>
                                </div>
                              
                                {item.image && 
                                    <div className="mt-3 h-64 -mx-3">
                                            <img src={item.image}style={{ display: 'block',height: '100%',margin: 'auto',width: '100%',}}
                                                alt='User Image'/>
                                    </div>
                                }
                                <ul className="px-0 py-3 flex items-center gap-4 md:gap-5">
                                    <li>
                                        <a  className="flex items-center gap-2 text-sm font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/instagram/Instagram-like.svg" alt="like"/>
                                        </a>   
                                    </li>
                                    <li>
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/instagram/Instagram-comment.svg" alt="comment"/>
                                            
                                        </a>  
                                    </li>
                                    <li>
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/instagram/Instagram-share.svg" alt="share"/>
                                            
                                        </a>  
                                    </li>
                                    <li className="ml-auto">
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/instagram/Instagram-bookmark.svg" alt="share"/>
                                            
                                        </a>  
                                    </li>
                                </ul>
                                <div>
                                    <p className="text-sm md:text-base">
                                        {expandedItems && expandedItems.includes(index)
                                             ?  <pre className="whitespace-break-spaces">{item.content}</pre>
                                             :  <pre className="whitespace-break-spaces">{truncateContent(item.content, LengthConstant.WordLimit)}</pre> }
                                             {item.content && item.content.split(" ").length > LengthConstant.WordLimit && (
                                        <span
                                            onClick={() => handleToggle(index)}
                                           className="text-sm font-medium cursor-pointer text-[#65676B] hover:text-themeblue"
                                        >
                                            {expandedItems.includes(index) ? "Read Less" : "... Read More"}
                                        </span>
                                        )}
                                        </p>
                                       
                                </div>
                                </div>
                            }  

                            {item.channel == SocialMedia.LINKEDIN && 
                                <div className="p-3 mx-2 md:mx-0 border border-[#E4E7EC] bg-white rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full  relative">
                                        {item.profileImage ?
                                                <img src={item.profileImage} className="h-full w-full object-cover rounded-full "/>
                                                :
                                                <img src="/assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" alt="Default User"/>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-black font-normal">{item.user && item.user }</h4>
                                            <p className="text-xs text-[#5D5D5D] font-normal">
                                                {moment(item.scheduled_at).format('dddd')} at {moment(item.scheduled_at).format('HH:mm A')}
                                                </p>
                                        </div>
                                    </div>
                                    <div>
                                    <a>
                                        <img src="../assets/icons/post-slider/dots-horizontal-more.svg" alt="more"/>
                                    </a>    
                                    </div>
                                </div>
                                <div className="my-3"> 
                                <p className="text-sm md:text-base">
                                   
                                        {expandedItems && expandedItems.includes(index)
                                            ?  <pre className="whitespace-break-spaces">{item.content}</pre>
                                            :  <pre className="whitespace-break-spaces">{truncateContent(item.content, LengthConstant.WordLimit)}</pre> }
                                             {item.content && item.content.split(" ").length > LengthConstant.WordLimit && (
                                        <span className="text-sm font-medium cursor-pointer text-[#65676B] hover:text-themeblue"
                                       
                                            onClick={() => handleToggle(index)}
                                           
                                        >
                                            {expandedItems.includes(index) ? "Read Less" : "... Read More"}
                                        </span>
                                        )}
                                        </p>
                                       
                                       
                                </div>
                                {item.image && 
                                    <div className="my-3 h-64 -mx-3">
                                            <img src={item.image}style={{ display: 'block',height: '100%',margin: 'auto',width: '100%',}}
                                                alt='User Image'/>
                                    </div>
                                }
                                <ul className="px-0 pt-3 border-t border-[#f43f3f3] flex justify-between items-center gap-3 md:gap-4">
                                    <li>
                                        <a  className="flex flex-1 items-center gap-1 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/linkedin/LinkedIn-Like.svg" alt="like"/>
                                            <span>like </span>
                                        </a>   
                                    </li>
                                    <li>
                                        <a  className="flex flex-1 items-center gap-1 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/linkedin/LinkedIn-Comment.svg" alt="Comment"/>
                                            <span>Comment </span>
                                        </a>   
                                    </li>
                                    <li>
                                        <a  className="flex flex-1 items-center gap-1 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/linkedin/LinkedIn-Repost.svg" alt="Repost"/>
                                            <span>Repost </span>
                                        </a>   
                                    </li>
                                    <li>
                                        <a  className="flex flex-1 items-center gap-1 text-sm leading-normal font-normal text-[#65676B]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/linkedin/LinkedIn-Share.svg" alt="Send"/>
                                            <span>Send </span>
                                        </a>   
                                    </li>
                                </ul>
                              
                                </div>
                            }  

                            {item.channel == SocialMedia.TWITTER && 
                                <div className="p-3 mx-2 md:mx-0 border border-[#E4E7EC] bg-white rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full  relative">
                                        {item.profileImage ?
                                                <img src={item.profileImage} className="h-full w-full object-cover rounded-full "/>
                                                :
                                                <img src="/assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" alt="Default User"/>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-black font-normal">{item.user && item.user }</h4>
                                            <p className="text-xs text-[#5D5D5D] font-normal">
                                                {moment(item.scheduled_at).format('dddd')} at {moment(item.scheduled_at).format('HH:mm A')}
                                                </p>
                                        </div>
                                    </div>
                                    <div>
                                    <a>
                                        <img src="../assets/icons/post-slider/dots-horizontal-more.svg" alt="more"/>
                                    </a>    
                                    </div>
                                </div>
                                <div className="my-3 pl-10"> 
                                    <p className="text-sm md:text-base">
                                        {expandedItems && expandedItems.includes(index)
                                            ?  <pre className="whitespace-break-spaces">{item.content}</pre>
                                            :  <pre className="whitespace-break-spaces">{truncateContent(item.content, LengthConstant.WordLimit)}</pre> }
                                        </p>
                                        {item.content && item.content.split(" ").length > LengthConstant.WordLimit && (
                                        <span className="text-sm font-medium cursor-pointer text-[#65676B] hover:text-themeblue"
                                            onClick={() => handleToggle(index)}
                                            style={{
                                            color: "blue",
                                            cursor: "pointer",
                                            marginLeft: "8px",
                                            }}
                                        >
                                            {expandedItems.includes(index) ? "Read Less" : "... Read More"}
                                        </span>
                                        )}
                                </div>

                                {item.image &&
                                    <div className="my-3 h-64 pl-10">
                                            <img src={item.image}style={{ display: 'block',height: '100%',margin: 'auto',width: '100%',}}
                                                alt='User Image'/>
                                        
                                    </div>
                                }
                                <ul className="px-0 pt-3 ml-10 border-t border-[#f43f3f3] flex items-center justify-between gap-4 md:gap-7">
                                    <li>
                                        <a  className="flex items-center gap-2 text-sm font-normal text-[#888888]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/twitter/Tw-comment.svg" alt="comment"/>
                                        </a>   
                                    </li>
                                    <li>
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#888888]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/twitter/Tw-repost.svg" alt="repost"/>
                                        </a>  
                                    </li>
                                    <li>
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#888888]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/twitter/Filled-like.svg" alt="like"/>
                                        </a>  
                                    </li>
                                    <li>
                                        <a   className="flex items-center gap-2 text-sm font-normal text-[#888888]">
                                            <img className="max-w-5" src="../assets/icons/post-slider/twitter/Tw-share.svg" alt="share"/>
                                        </a>  
                                    </li>
                                </ul>
                               
                                </div>
                            }  
                            </div>
                        ))}
                        {/* end slide-item */}
                        
                       
                        
                    </Carousel>
                    </ModalBody>
                    {type == PageConstant.APPROVE && 
                        <ModalFooter>
                            <div className="flex items-center justify-between w-full md:gap-3 gap-2 md:px-20 px-4">
                                {/* <a onClick={() => handleStatusClick('reject')} className="icon-btn reject-btn flex-1 max-w-full min-w-fit">
                                    <img src="../assets/icons/reject-icon.svg" alt="Reject" />REJECT
                                </a> */}
                                <button type="button" onClick={() =>handleStatusClick(PageConstant.APPROVE)} className="icon-btn approve-btn  flex-1 max-w-full  min-w-fit">
                                    <img src="../assets/icons/approve-icon.svg" alt="Approve" />APPROVE
                                </button>
                            </div>
                        </ModalFooter>
                    } 

                    {type == CommonWords.PREVIEW && 
                        <ModalFooter className="max-[575px]:px-0">
                            <div className="flex items-center justify-between w-full md:gap-3 gap-2 md:px-20 px-4">
                                <button type="button" onClick={() => handleStatusClick(PageConstant.REJECT)} className="icon-btn reject-btn flex-1 max-w-full min-w-fit">
                                    <img src="../assets/icons/reject-icon.svg" alt="Reject" />REJECT
                                </button>
                                <button type="button" onClick={() =>handleStatusClick(PageConstant.APPROVE)} className="icon-btn approve-btn  flex-1 max-w-full  min-w-fit">
                                    <img src="../assets/icons/approve-icon.svg" alt="Approve" />APPROVE
                                </button>
                            </div>
                        </ModalFooter>
                    } 

                    {type == PageConstant.HISTORY && 
                        <ModalFooter>
                            <div className="flex items-center justify-between w-full md:gap-3 gap-2 md:px-20 px-4">
                                {/* <a onClick={() => handleStatusClick('reject')} className="icon-btn reject-btn flex-1 max-w-full min-w-fit">
                                    <img src="../assets/icons/reject-icon.svg" alt="Reject" />REJECT
                                </a> */}
                                <button  type="button" onClick={() =>handleStatusClick(CommonWords.DELETE)} className="icon-btn reject-btn flex-1 max-w-full  min-w-fit">
                                    <img src="../assets/icons/delete.svg" alt="Delete" />DELETE
                                </button>
                            </div>
                        </ModalFooter>
                    } 
                </>
            )}
            </ModalContent>
            </Modal>
        </>
        }

            {/* model    */}
                <RejectReasonPopup
                    showModal={isOpen} title={Titles.REJECT_QUEUE_TITLE} 
                    onCloseModel={handleDataFromChild}  onSendData={handleReject} popupData={popupData}>
                </RejectReasonPopup>
            {/* model    */}

            {/* model    */}
            {/* <ConfirmationPopup
                   showModal={isConfirmOpen} 
                    type={PageConstant.REJECT_REASON} onSendData={handleDelete} onCloseModel={handleClose}>
                </ConfirmationPopup> */}
            {/* model    */}
    </div>
   
   
  );
}

export default memo(ApprovalPopup);



