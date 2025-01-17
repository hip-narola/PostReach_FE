"use client";
import React, { memo ,useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ApproveRejectType, PostListType } from "../../shared/dataPass";
import { useLoading } from "../../context/LoadingContext";
import { ApiResponse, ReasonListData } from "../../shared/response/apiResponse";
import { getRejectReason } from "../../services/post-service";
import {  ErrorCode, PageConstant } from "../../constants/pages";
import ConfirmationPopup from '../../common/custom-confirmation';
import { logout } from "../../services/auth-service";
import { useRouter } from "next/navigation";
interface RejectReasonProps {
    showModal: boolean;
    title: string;
    onSendData: (data: ApproveRejectType,type:string) => void; // Prop to handle close action
    onCloseModel: (data: ApproveRejectType | null, type: string) => void;
   
    popupData:PostListType
}


const RejectReasonPopup: React.FC<RejectReasonProps> = ({ showModal, title, onSendData,onCloseModel,popupData }) => {
    const router = useRouter();
    const [reason, setReason] = useState<number>();
    const [reasonType, setReasonList] = useState<ReasonListData[]>([]);
    const [expandReason, setExpandReason] = useState<string>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [isOpen, setOpen] = useState<boolean>(false);
    const { setIsLoading } = useLoading();
    const hasFetched = useRef(false);

    const closeModal = () => {
        onCloseModel(null,'false');
    };

    const handleReject = (type:string) => {
        console.log('type =>',type);
        setOpen(false);
        const ids = popupData.map(item => item.id);
        const obj: ApproveRejectType = {
            id: ids,
            isApproved: false,
            rejectreasonId: reason ? reason.toString() : "", // Convert to string or assign empty string
            rejectReason: expandReason ?? "" // Provide a fallback value
          };
        onSendData(obj,type)
    }

    const handleRejectClick = () => {
        setOpen(true);
        onCloseModel(null,'false');
    }

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            getRejectReasonList();
          }
    },[])

    const getRejectReasonList = async() =>{
        setIsLoading(true);
        const response : ApiResponse<ReasonListData[]> = await getRejectReason();
        if(response?.IsSuccess && response?.Data){
          setReasonList(response.Data);
        }else{
            if(response.StatusCode == ErrorCode.UNAUTHORISED){
                logout(router);
             }
        }
          setIsLoading(false);
    }

    const handleReasonSelect  = (reason:number) => {
        setReason(reason)
        setDisabled(false)
    }

    const handleClose  = () => {
        setOpen(false);
    }

    return (
        <div>
            {showModal &&
                <>
                    <Modal isOpen={showModal} onClose={closeModal}>
                            <div>
                                <ModalContent className="max-w-[576px] my-0 no-header-modal py-2">
                                    {(
                                        <>
                                           
                                            {title && <ModalHeader className="flex flex-col px-6">
                                                    {title}
                                            </ModalHeader>}

                                            <ModalBody className="px-6 pt-6">

                                                {/* image slider     */}
                                               <div className="multi-post-slider-wrapper px-7">
                                               <Carousel
                                                additionalTransfrom={0}
                                                arrows={popupData.length > 1} // Only show arrows if more than 1 item
                                                autoPlaySpeed={3000}
                                                infinite={false} 
                                                centerMode={false}
                                                className="post-preview-slider"
                                                containerClass="container-fluid"
                                                draggable
                                                focusOnSelect={false}
                                                itemClass=""
                                                keyBoardControl
                                                minimumTouchDrag={80}
                                                pauseOnHover
                                                responsive={{
                                                desktop: {
                                                    breakpoint: { max: 3000, min: 1024 },
                                                    items: 4,
                                                },
                                                mobile: {
                                                    breakpoint: { max: 525, min: 0 },
                                                    items: 2,
                                                },
                                                tablet: {
                                                    breakpoint: { max: 1024, min: 525 },
                                                    items: 4,
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
                                                    <div className="px-2" key={index}> 
                                                        <div className="p-2 border border-[#E4E7EC] bg-white rounded-lg">
                                                            <div className="h-20">
                                                            {item.image ? 
                                                                <img src={item.image} width={76} height={76} className={"w-full h-full rounded object-cover"}/>
                                                                :
                                                                <img src='../assets/images/Image_not_available.png' width={76} height={76} className={"w-full h-full rounded object-cover"}/>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* end slide-item */}
                        
                                                </Carousel>
                                               </div>
                                                {/* image slider     */}

                                                <h4 className="text-[#323232] text-lg font-medium mb-2"> Reason of Rejection</h4>
                                                <div className="flex flex-col w-full max-w-full relative mb-5">
                                                    <div>
                                                        <Select
                                                            isRequired
                                                            label="Reason"
                                                            className="max-w-full">
                                                            {reasonType.map((item) => (
                                                                <SelectItem key={item.id} onClick={() =>handleReasonSelect(item.id)}>
                                                                    {item.reason}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>

                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-full relative mb-5">
                                                    <label htmlFor="username"
                                                        className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">
                                                        Expand Reason
                                                    </label>
                                                    <div>
                                                        <textarea
                                                            id="ExpandReason"
                                                            name="ExpandReason"
                                                            rows={3}
                                                            onChange={(event) => setExpandReason(event?.target.value)}
                                                            className="form-custom-input"
                                                        />
                                                    </div>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter className="px-6 pb-6">
                                                <div className="flex flex-row flex-wrap justify-center  items-center gap-4 w-full relative">
                                                    {/* <a className="text-themeblue font-medium text-base leading-6 whitespace-nowrap uppercase">SKIP</a> */}

                                                    <Button type="button" onClick={closeModal} className="border-themeblue border bg-white text-themeblue rounded-full text-base leading-[22px] h-auto outline-0 modal-btn">
                                                        Cancel
                                                    </Button>
                                                    <Button type="button" onClick={handleRejectClick} className="ml-auto bg-themeblue border-themeblue border text-white rounded-full text-base leading-[22px] font-medium h-auto outline-0 modal-btn"
                                                    disabled={disabled}>
                                                        Reject
                                                    </Button>
                                                </div>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </div>
                    </Modal>
                </>
            }

            {/* model    */}
                <ConfirmationPopup
                   showModal={isOpen} 
                    type={PageConstant.REJECT_REASON} onSendData={handleReject} onCloseModel={handleClose}>
                </ConfirmationPopup>
            {/* model    */}
        </div>


    );
}

export default memo(RejectReasonPopup);



