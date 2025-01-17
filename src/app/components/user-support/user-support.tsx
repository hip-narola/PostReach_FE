"use client";

import React from "react";
import {Accordion, AccordionItem} from "@nextui-org/react";
import {AccCloseIcon} from './AccCloseIcon';
import {AccOpenIcon} from './AccOpenIcon';

const UserSupport: React.FC = () => {

  const itemClasses = {
    base: "accordion",
   
    trigger: "p-0",
    indicator: "text-medium",
    content: "pb-0 text-base text-[#525252] font-normal text-left",
  };


  return (  
    <div className="content px-6 py-6 lg:py-10">
        <div className="max-w-[940px] mx-auto text-center">
        <div className="">
          <h2 className="text-2xl lg:text-[32px] lg:leading-[52px] text-[#323232] font-semibold mb-4">Your Feedback is Important to Us.</h2>
          <p className="text-base text-[#888888] font-normal">If you need assistance, please submit a support request ticket, and our team will respond within 24 hours. Alternatively, if you have suggestions for improving our product or new features, we welcome your input and review all suggestions. </p>
          <p className="text-base text-[#888888] font-normal">Thank you!</p>
          <div className="flex max-[430px]:flex-col   flex-wrap gap-4 sm:gap-6   justify-center m-auto  md:gap-10 my-6 md:my-10 lg:my-14">
            <div className="sm:col-span-1 flex-1 shadow-[0px_2px_7px_0px_#98989840] rounded-lg p-3 gap-3 md:gap-5 max-w-full md:max-w-60">
            <div className="text-center">
                <a href="https://postreach.atlassian.net/servicedesk/customer/portal/1" target="_blank">
                  <img className="mx-auto" src="../assets/images/SUPPORT REQUEST.png" alt="SUPPORT REQUEST" />
                </a>
              </div>
               <h4 className="text-lg text-[#323232] font-medium my-5">SUPPORT REQUEST</h4>
            </div>
            <div className="sm:col-span-1 flex-1 shadow-[0px_2px_7px_0px_#98989840] rounded-lg p-3 gap-3 md:gap-5 max-w-full md:max-w-60">
              <div className="text-center">
                <a href="https://postreach.atlassian.net/servicedesk/customer/portal/1" target="_blank">
                  <img className="mx-auto" src="../assets/images/SUGGESTION BOX.png" alt="SUGGESTION BOX" />
                </a>
               </div>
               <h4 className="text-lg text-[#323232] font-medium my-5">SUGGESTION BOX</h4>
            </div>
          </div>
        </div>

        {/* faq */}
        <div>
          <div className="border border-[#F3F3F3] p-2 rounded-lg m-auto mb-2 flex items-center justify-center max-w-fit gap-1 text-themeblue text-base font-semibold">
          <img className="" src="../assets/icons/help-circle.svg" alt="help-circle" /> FAQS
          </div>
          <h2 className="text-2xl lg:text-[32px] lg:leading-[52px] text-[#262626] font-semibold mb-4">Frequently Asked Questions</h2>
          <p className="text-base text-[#262626] font-normal">If you have any questions that aren&apos;t listed below, feel free to Schedule a demo to speak with someone from our team.</p>

          <div className="pt-10 lg:pt-16">
       
              <Accordion   showDivider={false}
               disableIndicatorAnimation={true}
                itemClasses={itemClasses}>
                <AccordionItem className=" bg-[#F6F6F64D]"  key="1" aria-label="Accordion 1" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}   title="How much does it cost?">
                <p className="">We manage Instagram, LinkedIn, Facebook, Google, X, and more. If you&apos;re on it, we can manage it.</p>
                </AccordionItem>
                <AccordionItem className="accordion bg-[#F6F6F64D]"  key="2" aria-label="Accordion 2" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}   title="How much does it cost?">
                <p>We manage Instagram, LinkedIn, Facebook, Google, X, and more. If you&apos;re on it, we can manage it.</p>
                </AccordionItem>
                <AccordionItem className="accordion bg-[#F6F6F64D]"  key="3" aria-label="Accordion 3" indicator={({ isOpen }) => (isOpen ? <AccOpenIcon /> : <AccCloseIcon />)}   title="How much does it cost?">
                <p>We manage Instagram, LinkedIn, Facebook, Google, X, and more. If you&apos;re on it, we can manage it.</p>
                </AccordionItem>
              </Accordion>

          </div>

        </div>
        </div>
    </div>
  );
};

export default UserSupport;