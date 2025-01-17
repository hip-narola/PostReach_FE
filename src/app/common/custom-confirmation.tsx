"use client";
import React, { memo} from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { CommonWords, PageConstant } from "../constants/pages";

interface CustomConfirmProps {
    showModal: boolean;
    onSendData: (type:string) => void; // Prop to handle close action
    type: string;
    onCloseModel: () => void;
}


const ConfirmationPopup: React.FC<CustomConfirmProps> = ({ showModal, onSendData, type ,onCloseModel}) => {

    const closeModal = () => {
        onCloseModel();
    };

    const onClose = (type:string) => {
        onSendData(type)
    }

    
  

    return (
        <div>
            {showModal &&
                <>
                    <Modal isOpen={showModal} onClose={closeModal}>
                        <div>
                                <ModalContent className="max-w-[330px] my-0 no-header-modal py-2">
                                    {(
                                        <>
                                            {/* <ModalHeader className="flex flex-col md:px-20 px-11">
                                                {title && <ModalHeader className="flex flex-col px-6">
                                                    {title}
                                                </ModalHeader>}

                                            </ModalHeader> */}
                                            <ModalBody className="px-6 pt-6">
                                                <img src="../assets/icons/delete-modal-alert.svg" className="w-8 h-8 m-auto" alt="logo" />
                                               
                                               {type == PageConstant.REJECT_REASON &&
                                                    <p className="text-[#323232] text-sm text-center font-normal mt-1">
                                                        Are you sure you want to reject the post(s)?
                                                    </p>
                                                }
                                                {type == CommonWords.DELETE &&
                                                <p className="text-[#323232] text-sm text-center font-normal mt-1">
                                                    Are you sure about to delete the post(s)?
                                                </p>
                                                } 
                                                 {type == PageConstant.LINK_SOCIAL &&
                                                <p className="text-[#323232] text-sm text-center font-normal mt-1">
                                                    Are you sure about to disconnect the profile?
                                                </p>
                                                } 
                                            </ModalBody>
                                            <ModalFooter className="px-6 pb-6">
                                                <div className="mt-2 flex flex-row flex-wrap justify-center gap-3 items-center gap-4 w-full relative">
                                                    <Button onPress={() => onClose(CommonWords.NO)} className="border-themeblue border bg-white text-themeblue rounded-full text-base leading-[22px] h-auto outline-0 modal-btn">
                                                        Cancel
                                                    </Button>
                                                    <Button onPress={() => onClose(CommonWords.YES)} className="bg-themeblue border-themeblue border text-white rounded-full text-base leading-[22px] font-medium h-auto outline-0 modal-btn">
                                                        Yes
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
        </div>


    );
}

export default memo(ConfirmationPopup);



