"use client";
import React, { memo, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ModalProps} from "@nextui-org/react";
import { AnswerType, QuestionnaireTypes, QuestionTypes, SelectedAnswersType } from "../shared/dataPass";
import { ControlType, QuestionnaireType } from "../constants/pages";

import MultiSelect from "./controls/multi-select";
import SingleSelect from "./controls/single-select";
import TextBox from "./controls/text-box";
import TextArea from "./controls/text-area";
import CheckBox from "./controls/checkbox";
import RadioGroupControl from "./controls/radio-button";
import DropdownControl from "./controls/dropdown";
import AutoComplete from "./controls/searchable-dropdown";interface GlobalPopupProps {
    showModal: boolean;
    title: string;
    data : QuestionnaireTypes;
    onSendData: (data: string) => void; 
    onSubmit: (data: AnswerType[],questionType:string) => void; 
  }

const GlobalPopup: React.FC<GlobalPopupProps> = ({ showModal, title, data, onSendData  , onSubmit}) => {
 console.log('data =>',data);
 
    const [answer, setAnswer] =  useState<AnswerType[]>([]);
    const [subData, setSubData] =  useState<QuestionTypes | null>(null);
    const [subStep, setSubStep] = useState(false);
  
  

    const closeModal = () => {
        onSendData('false');
    };

    const selectedAnswerOptions = (val: SelectedAnswersType) => {
     
      const updatedAnswer = [...answer];
      const existingIndex = updatedAnswer.findIndex((ans) => ans.questionId === val.questionId);
      if (existingIndex > -1) {
        updatedAnswer[existingIndex] = val;
      } else {
        updatedAnswer.push(val);
      }
      setAnswer(updatedAnswer);
    };

    const handleSingleClick = (ans: QuestionTypes | null) => {
      if (ans) {
        // If ans can be transformed to QuestionTypes, apply the transformation here.
        const questionData = ans as unknown as QuestionTypes;
        setSubData(questionData);
        setSubStep(true)
    } else {
        // Handle the null case if necessary
        setSubData(null);
    }
}

    const submitBusinessOnBoarding = async () => {
      onSubmit(answer, QuestionnaireType.ONBOARDING)
      setAnswer([]);
    };

    const handleValidation = () => {}
  
    const [scrollBehavior] = React.useState<ModalProps["scrollBehavior"]>("inside");

  

  return (
    <div>
          <div>
            <Modal isOpen={showModal}  placement={"center"}  scrollBehavior={scrollBehavior}  onClose={closeModal}>
              <ModalContent className="max-w-[767px] reset-password-modal py-2">
                  <ModalHeader className="flex flex-col px-4 md:px-6 text-2xl">
                        {title}
                  </ModalHeader>
                  <ModalBody className="px-4 md:px-6">
                    {data.map((val:QuestionTypes,index:number) => (
                        <div className="w-full mb-2" key={index} >

                         
                          {( val.QuestionOrder == 1 || val.ReferenceId != null) &&
                            <div>
                               {val.Question && <p className="text-lg md:text-xl font-medium text-[#323232] py-2 text-left">{val.Question}</p>}
                                {val.QuestionDescription &&
                                  <p className="text-sm font-normal text-[#323232] py-2 text-left">{val.QuestionDescription}</p>   
                                }

                                 
                               {/* multi-select */}   
                             {val.QuestionType === ControlType.MULTIPLE && 
                               <MultiSelect 
                                 optionList={val} 
                                 selectedAnswerOptions={selectedAnswerOptions}
                                 checkValidation={handleValidation}/>
                             }
                             {/* multi-select */}
   
                              {/* single-select */}
                              { val.QuestionType === ControlType.SINGLE && 
                                   <SingleSelect  
                                     optionList={val} 
                                     initialData={data} 
                                     checkValidation={handleValidation}
                                     singleClick={handleSingleClick}
                                     selectedAnswerOptions={selectedAnswerOptions} />
                                   }
                                   {/* single-select */}
                   
                                   {/* text-box */}
                                   { val.QuestionType === ControlType.TEXTBOX && 
                                     <TextBox  
                                       optionList={val} 
                                       selectedAnswerOptions={selectedAnswerOptions}
                                       checkValidation={handleValidation} />
                                   }
                                   {/* text-box */}
                   
                                   {/* text-area */}
                                   { val.QuestionType === ControlType.TEXTAREA && 
                                     <TextArea  
                                       optionList={val}
                                       selectedAnswerOptions={selectedAnswerOptions}
                                       checkValidation={handleValidation}
                                     />
                                   }     
                                   {/* text-area */}
                   
                                   {/* check-box */}
                                   { val.QuestionType === ControlType.CHECKBOX && 
                                     <CheckBox 
                                       optionList={val}  
                                       selectedAnswerOptions={selectedAnswerOptions}
                                       checkValidation={handleValidation}  />
                                   } 
                                   {/* check-box */}
   
                                   {/* radio-button */}
                                   { val.QuestionType === ControlType.RADIO && 
                                       <RadioGroupControl 
                                         optionList={val}
                                         selectedAnswerOptions={selectedAnswerOptions}
                                         checkValidation={handleValidation}/>
                                   } 
                                   {/* radio-button */}
   
                                   {/* dropdown */}
                                   { val.QuestionType === ControlType.DROPDOWN &&  
                                     <DropdownControl 
                                       optionList={val}
                                       selectedAnswerOptions={selectedAnswerOptions}
                                       checkValidation={handleValidation}
                                     />
                                   } 
                                   {/* dropdown */}
   
                                   {/* searchable */}
                                   { val.QuestionType === ControlType.AUTOCOMPLETE &&
                                     <AutoComplete optionList={val}/>
                                   } 
                                   {/* searchable */}
                            </div>
                          }
                        

                                {/* sub-question */}
                                  {subStep && subData && val.QuestionOrder != 1 && 
                                    <div className="w-full mt-3">
                                            <p className="text-xl font-medium text-[#323232] py-3 text-left">{subData.Question}</p>
                                            {/* multi-select */}
                                              { subData.QuestionType === ControlType.MULTIPLE && 
                                                <MultiSelect 
                                                optionList={subData} 
                                                selectedAnswerOptions={selectedAnswerOptions}
                                                checkValidation={handleValidation}/>
                                              }
                                            {/* multi-select */}

                                            {/* single-select */}
                                            { subData.QuestionType === ControlType.SINGLE && 
                                              <SingleSelect  
                                                optionList={subData} 
                                                initialData={data} 
                                                singleClick={handleSingleClick}
                                                selectedAnswerOptions={selectedAnswerOptions}
                                                checkValidation={handleValidation} />
                                            }
                                            {/* single-select */}

                                            {/* text-box */}
                                            { subData.QuestionType === ControlType.TEXTBOX && 
                                                <TextBox  optionList={subData}
                                              selectedAnswerOptions={selectedAnswerOptions} 
                                              checkValidation={handleValidation}/>
                                              }
                                            {/* text-box */}

                                            {/* text-area */}
                                            { subData.QuestionType === ControlType.TEXTAREA && 
                                              <TextArea  
                                              optionList={subData}
                                              selectedAnswerOptions={selectedAnswerOptions}
                                              checkValidation={handleValidation}
                                              />
                                            }     
                                            {/* text-area */}

                                            {/* check-box */}
                                            { subData.QuestionType === ControlType.CHECKBOX && 
                                                <CheckBox optionList={subData} 
                                                selectedAnswerOptions={selectedAnswerOptions}
                                                checkValidation={handleValidation}  />
                                              
                                            } 
                                            {/* check-box */}
                                    </div>
                                }   
                     </div>
                   ))}
                    {/* sub-question */}
                  </ModalBody>
                  <ModalFooter>
               
                <Button color="primary" onClick={submitBusinessOnBoarding} className="theme-primary-btn btn-sm  rounded-[40px] min-w-28 w-auto px-5 my-0 capitalize font-medium">
                 Save
                </Button>
              </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
    </div>
   
   
  );
}

export default memo(GlobalPopup);



