"use client";
import React, { memo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {Accordion, AccordionItem} from "@nextui-org/react";
import {AccCloseIcon} from '../Social-link/AccCloseIcon';
import {AccOpenIcon} from '../Social-link/AccOpenIcon';

// import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { OrganizationResponse} from "../../shared/dataPass";
import { SocialMedia } from "@/app/constants/pages";
import APIRoutes from "@/app/constants/API-Routes";

interface GlobalPopupProps {
    showModal: boolean;
    title: string;
    data : OrganizationResponse[];
    type:number
    onSendData: (data: string) => void; // Prop to handle close action
    onSubmit: (data: OrganizationResponse,questionType:number) => void; 
  }

const OrganizationPopup: React.FC<GlobalPopupProps> = ({ showModal, title, data, onSendData, onSubmit,type}) => {

    const itemClasses = {
        base: "accordion",
        trigger: "p-0",
        indicator: "text-medium",
        content: "pb-0 text-base text-[#525252] font-normal text-left",
        title:"text-sm md:text-base lg:text-lg",
    };
 
    console.log('type =>',type);
    
      
    const closeModal = () => {
        onSendData('false');
    };

    const handleCardClick = (item:OrganizationResponse) => {
      onSubmit(item,type)
    }

    const handleReauth = (type :number) => {
        if(type == SocialMedia.FACEBOOK){
            window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.facebookPageSignIn}`;
        }

        if(type == SocialMedia.INSTAGRAM){
            window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${APIRoutes.instagramSignIn}`;
        }
    }

  return (
    <div>
        <>
            <Modal isOpen={showModal} scrollBehavior={"inside"}   onClose={closeModal}>
            <ModalHeader className="flex flex-col px-6">
                  {title}
            </ModalHeader>
            <ModalContent className="max-w-[565px] reset-password-modal py-1">
            {(
                <>
                    
                        <ModalHeader className="flex flex-col px-3 md:px-6">
                            <div className="text-lg md:text-xl leading-8 font-medium  md:text-left text-left">
                                {title}
                            </div>
                        </ModalHeader>
                        <ModalBody className="md:px-6 px-3">
                            <div>
                                {type == SocialMedia.INSTAGRAM &&
                                    <p>Here&apos;s a list of the Instagram profiles you have access to,<b> select one to connect it to this social set</b>.</p>
                                }

                                {type == SocialMedia.FACEBOOK &&
                                    <p>Here&apos;s a list of the Facebook Pages you have access to, <b>select one to connect it to this social set</b>.</p>
                                }

                                {type == SocialMedia.LINKEDIN &&
                                    <p>Here&apos;s a list of the LinkedIn profiles you have access to, <b>select one to connect it to this social set</b>.</p>
                                }
                            </div>
                            {(type == SocialMedia.INSTAGRAM || type == SocialMedia.FACEBOOK) &&  
                                <div className="flex flex-col items-start flex-wrap">
                                    {type == SocialMedia.INSTAGRAM &&<p className="font-semibold mb-2">Instgram Business or Creator profiles :</p>}
                                    {type == SocialMedia.FACEBOOK &&<p className="font-semibold mb-2">Facebook Pages :</p>}
                                    {data.map((item : OrganizationResponse, index:number) => (
                                        <Card key={index} shadow="sm" className="flex flex-row items-center gap-2 w-full p-2 my-2 rounded-lg">
                                            <CardBody className="overflow-visible p-0 flex gap-2 items-center flex-row text-sm md:text-base">
                                                {item.logoUrl && <img src={item.logoUrl} height={34} width={34} alt="Logo"/>} 
                                                @{item.pageName}
                                            </CardBody>
                                            <CardFooter className="text-small max-w-max justify-between p-0">
                                                <button className="connect-btn max-w-max px-3 md:px-4" onClick={() => handleCardClick(item)}>Connect</button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            }

                            {type == SocialMedia.LINKEDIN &&  
                                <div>
                                    <div className="flex flex-col items-start flex-wrap">
                                        <p className="font-semibold mb-2">LinkedIn Personal profile :</p>
                                            {data
                                             .filter((item: OrganizationResponse) => !item.isPage) // Filter pages
                                            .map((item : OrganizationResponse, index:number) => (
                                                <Card key={index}  shadow="sm" className="flex flex-row items-center gap-2 w-full p-2 my-2 rounded-lg">
                                                    <CardBody className="overflow-visible p-0 flex gap-2 items-center flex-row text-sm md:text-base">
                                                       {item.logoUrl && <img src={item.logoUrl} height={34} width={34} alt="Logo"/>} 
                                                       @{item.pageName}
                                                    </CardBody>
                                                    <CardFooter className="text-small max-w-max justify-between p-0">
                                                        <button className="connect-btn max-w-max px-3 md:px-4" onClick={() => handleCardClick(item)}>Connect</button>
                                                    </CardFooter>
                                                
                                                </Card>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-start flex-wrap">
                                    <p className="font-semibold mb-2">LinkedIn Pages :</p>
                                    {data
                                     .filter((item: OrganizationResponse) => item.isPage) // Filter pages
                                    .map((item : OrganizationResponse, index:number) => (
                                        <Card key={index}  shadow="sm" className="flex flex-row items-center gap-2 w-full p-2 my-2 rounded-lg">
                                            <CardBody className="overflow-visible p-0 flex gap-2 items-center flex-row text-sm md:text-base">
                                                {item.logoUrl && <img src={item.logoUrl} height={34} width={34} alt="Logo"/>} 
                                                @{item.pageName}
                                            </CardBody>
                                            <CardFooter className="text-small max-w-max justify-between p-0">
                                                <button className="connect-btn max-w-max px-3 md:px-4" onClick={() => handleCardClick(item)}>Connect</button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                    </div>
                                </div>
                            }

                            <div>
                                {type == SocialMedia.INSTAGRAM && 
                                    <Accordion showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                <AccordionItem className="-mx-2 bg-[#FAFBFF] px-2 md:px-3"  key="1" aria-label="Accordion 1"  indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}  
                                                    title="Can't find a Instagram profile?" >
                                                    <div>
                                                        <p className="text-sm mb-2">Check the Instagram requirements and troubleshooting steps below then reauthorize your Facebook connection to try again.</p>
                                                        <button className="connect-btn max-w-max px-3 md:px-4" onClick={() => handleReauth(SocialMedia.INSTAGRAM)}>Reauthorize Facebook connection</button>
                                                        {/* child accordian */}
                                                        <div className="mt-3">
                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Requirememts : </p>
                                                            <Accordion showDivider={false}  disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3" key="1" aria-label="Accordion 1"   indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Must be a Business or Creator profile">
                                                                    <div>
                                                                        <p className="text-sm">PostReach only supports adding Instagram Business or Creator profiles. Personal profiles are not
                                                                                supported. Switching to a Business or Creator profile is easy and only takes a few minutes.
                                                                        </p>
                                                                        <a target="_blank" href="https://help.instagram.com/502981923235522" className="connect-btn max-w-max px-3 md:px-4 mt-3 flex items-center gap-1 md:gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to Setup a Business Account</a>
                                                                        <a target="_blank" href="https://help.instagram.com/2358103564437429" className="connect-btn max-w-max px-3 md:px-4 mt-3 flex items-center gap-1 md:gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to setup a creator account </a>
                                                                    </div>
                                                                </AccordionItem>
                                                                <AccordionItem className="accordion -mx-1 bg-white p-2 md:p-3"  key="2" aria-label="Accordion 2"   indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Must be connected to a Facbook Page">
                                                                    <div>
                                                                        <p className="text-sm">Make sure you have connected your profile to a Facebook Page, even if it&apos;s not in use.</p>
                                                                        <a target="_blank" href="https://help.instagram.com/570895513091465" className="connect-btn max-w-max px-3 md:px-4 mt-3 flex items-center gap-1 md:gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to connect Instagram to a Facebook Page</a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>

                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Troubleshooting : </p>
                                                            <Accordion   showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3"  key="1" aria-label="Accordion 1" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Review your Instgram connection">
                                                                    <div>
                                                                        <p className="text-sm">Log into Facebook and switch into the page connected to your Instagram. Next, navigate to your
                                                                            (1) Linked Accounts. If you see a blue &#39;Review Connection&#39; button, click it and complete the steps required
                                                                        </p>
                                                                        <a target="_blank" href="https://www.facebook.com/settings?tab=linked_instagram" className="connect-btn max-w-max px-4 mt-3 flex items-center gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            Linked Instagram Account (1)</a>
                                                                    </div>
                                                                </AccordionItem>
                                                                <AccordionItem className="accordion -mx-1 bg-white p-2 md:p-3"  key="2" aria-label="Accordion 2" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Check your business integration settings">
                                                                <div>
                                                                        <p className="text-sm">Log into Facebook and switch into your personal profile. Navigate to the (1) business integration
                                                                            settings page then click &#34;View and Edit&#34; next to PostReach and ensure they&apos;re all enabled.
                                                                        </p>
                                                                        <a target="_blank" href="https://www.facebook.com/settings?tab=business_tools&ref=settings" className="connect-btn max-w-max px-4 mt-3 flex items-center gap-2">
                                                                        <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            Business Integration settings (1)
                                                                        </a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </AccordionItem>
                                    </Accordion>
                                }

                                {type == SocialMedia.FACEBOOK && 
                                    <Accordion showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                        <AccordionItem className="-mx-2 bg-[#FAFBFF] px-2 md:px-3"  key="1" aria-label="Accordion 1"  indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}  
                                            title="Can't find a Facebook page?">
                                            <div>
                                                <p className="text-sm mb-2">Check the Facebook requirements and troubleshooting steps below then reauthorize your Facebook connection to try again.</p>
                                                <button className="connect-btn max-w-max px-3 md:px-4" onClick={() => handleReauth(SocialMedia.FACEBOOK)}>Reauthorize Facebook connection</button>
                                                        {/* child accordian */}
                                                        <div className="mt-3">
                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Requirememts : </p>
                                                            <Accordion showDivider={false}  disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3" key="1" aria-label="Accordion 1"   indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Must be a Page">
                                                                    <div>
                                                                        <p className="text-sm">PostReach only supports connecting Facebook Pages. Personal profiles and Groups are not supported.</p>
                                                                        <a target="_blank" href="https://facebook.com/help/104002523024878" className="connect-btn max-w-max px-3 md:px-4 mt-3 flex items-center gap-1 md:gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to create a Facebook page</a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>

                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Troubleshooting : </p>
                                                            <Accordion   showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3"  key="1" aria-label="Accordion 1" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Check your business integration settings">
                                                                    <div>
                                                                        <p className="text-sm">
                                                                            Log into Facebook and switch into your personal profile. Navigate to the (1) business integration
                                                                            settings page then click &rdquo;View and Edit&rdquo; next to PostReach and ensure they&apos;re all enabled.
                                                                        </p>
                                                                        <a  target="_blank" href="https://www.facebook.com/settings?tab=business_tools&ref=settings" className="connect-btn max-w-max px-4 mt-3 flex items-center gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            Business Integration Settings (1)</a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </div>       
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                }

                                {type == SocialMedia.LINKEDIN && 
                                    <Accordion showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                <AccordionItem className="-mx-2 bg-[#FAFBFF] px-2 md:px-3"  key="1" aria-label="Accordion 1"  indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}  
                                                    title="Can't find a LinkedIn page or profile?">
                                                    <div>
                                                        <p className="text-sm mb-2">Check the LinkedIn requirements and troubleshooting steps below then close this window and try again.</p>
                                                    
                                                        {/* child accordian */}
                                                        <div className="mt-3">
                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Requirememts : </p>
                                                            <Accordion showDivider={false}  disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3" key="1" aria-label="Accordion 1"   indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Must be a Page or Personal profile">
                                                                    <div>
                                                                        <p className="text-sm">PostReach only supports connecting LinkedIn Pages or Personal profiles. LinkedIn Groups are not supported.</p>
                                                                        <a target="_blank" href="https://www.linkedin.com/help/linkedin/answer/a543852" className="connect-btn max-w-max px-3 md:px-4 mt-3 flex items-center gap-1 md:gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to create a LinkedIn page</a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>

                                                            <p className="text-sm md:text-base font-semibold text-black mb-3">Troubleshooting : </p>
                                                            <Accordion   showDivider={false} disableIndicatorAnimation={true} itemClasses={itemClasses}>
                                                                <AccordionItem className="-mx-1 bg-white p-2 md:p-3"  key="1" aria-label="Accordion 1" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}
                                                                title="Check Page role">
                                                                    <div>
                                                                        <p className="text-sm">
                                                                         If you are trying to add a Page you don&apos;t own but it&apos;s not showing up, ensure you have beengiven a &rdquo;Super Admin&rdquo; page role.
                                                                        </p>
                                                                        <a  target="_blank" href="https://www.linkedin.com/help/linkedin/answer/a569144" className="connect-btn max-w-max px-4 mt-3 flex items-center gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            How to add super admins to a page
                                                                        </a>

                                                                        <a  target="_blank" href="https://www.linkedin.com/help/linkedin/answer/a541981" className="connect-btn max-w-max px-4 mt-3 flex items-center gap-2">
                                                                            <img src="../assets/icons/box-arrow-up-right.svg" height={17} width={17} className="-mt-1"/>
                                                                            LinkedIn Page Admin Roles
                                                                        </a>
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </AccordionItem>
                                    </Accordion>
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="text-sm md:text-base" onClick={closeModal}>Cancel</button>
                        </ModalFooter>
                </>
            )}
            </ModalContent>
            </Modal>
        </>
    </div>
   
   
  );
}

export default memo(OrganizationPopup);



