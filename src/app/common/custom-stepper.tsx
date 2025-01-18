import React, {  useContext, useEffect, useState } from 'react';
import {  OnboardQuestionType, QuestionTypes, UserDataType, AnswerType, SelectedAnswersType } from '../shared/dataPass';
import { useRouter } from "next/navigation";
import { ControlType, LocalStorageType, QuestionnaireType } from '../constants/pages';
import navigations from '../constants/navigations';

import MultiSelect from './controls/multi-select';
import SingleSelect from './controls/single-select';
import TextBox from './controls/text-box';
import TextArea from './controls/text-area';
import CheckBox from './controls/checkbox';
import RadioGroupControl from './controls/radio-button';
import DropdownControl from './controls/dropdown';
import { ApiResponse } from '../shared/response/apiResponse';
import { getUserDetails, submitOnBoarding } from '../services/user-service';
import AutoComplete from './controls/searchable-dropdown';
import { DataContext } from '../context/shareData';
interface CustomStepperWithLineProps {
  data:  OnboardQuestionType[]; // array for each step's content
}

const CustomStepperWithLine: React.FC<CustomStepperWithLineProps> = ({  data }) => {
  const context = useContext(DataContext);

    if (!context) {
        throw new Error('DataContext must be used within a DataProvider');
    }

  const [steps, setSteps] = useState<string[]>([]); 
  const [currentStep, setCurrentStep] = useState(localStorage.getItem(LocalStorageType.COMPLETE_STEP) ? (parseInt(localStorage.getItem(LocalStorageType.COMPLETE_STEP) || '') > 0 ? parseInt(localStorage.getItem(LocalStorageType.COMPLETE_STEP) || '') : 0) : 0);
  const [subStep, setSubStep] = useState(false);
  const [currentData, setCurrentData] =  useState<QuestionTypes[] | null>(null);
  const [subData, setSubData] =  useState<QuestionTypes | null>(null);
  const [answer, setAnswer] =  useState<AnswerType[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPrevious, setPrevious] = useState(false);
  const router = useRouter();
   
  useEffect(() => {
    filterData();
  }, [data]); // Only run when `data` changes
  
  useEffect(() => {
    setStepData();
  }, [currentStep, data]); // Only run when `currentStep` or `data` changes

    const goToNextStep = async () => {
      context.setPartner(false);
      submitStep(); // Store current step data
      setPrevious(false);
      setSubStep(false)
      if (currentStep < steps.length - 1) {
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        // Submit the onboarding flow if on the last step
        const userId = localStorage.getItem(LocalStorageType.USER_ID) || '';
        const userDetails = await getUserData(userId);
        if (userDetails) {
          localStorage.setItem(LocalStorageType.USER_DETAILS, JSON.stringify(userDetails));
          router.push(navigations.socialLinks);
        }
      }
    };

  
    const submitStep = async () => {
      const userId = localStorage.getItem(LocalStorageType.USER_ID) || '';
      
      if(answer.length > 0 ){
         await submitOnBoarding(answer, userId, QuestionnaireType.ONBOARDING);
      }
      
      setAnswer([]);
    };

    const getUserData = async(id:string) =>{
      const response : ApiResponse<UserDataType> = await getUserDetails(id);
      if(response?.IsSuccess){
          return response?.Data as UserDataType
      }
    }
    
    const goToPreviousStep = () => {
      context.setPartner(false);
      setPrevious(true);
      if (currentStep > 0) {
          setCurrentStep((prevStep) => prevStep - 1); 
      }
  };

  const filterData = () => {
    const arr: string[] = [];
    data.forEach((element) => {
      arr.push(element.StepId);
    });
    setSteps(arr);
  };

  const setStepData = () => {
    const sanitizedData = data[currentStep]?.Questions.map((question, index) => {
      const details = data[currentStep]?.Questions.find((e) => e.QuestionOrder === index + 1);
      if(details){
        details.isPartner = false;
      }
      return details;
    }).filter((question) => question !== null);
    const referenceQuestion = sanitizedData.find((e) => e?.ReferenceId != null)
        if(referenceQuestion){
          sanitizedData.forEach((element) => {
            if (element) element.isPartner = true;
          })
        }
    setCurrentData(sanitizedData as QuestionTypes[]);
  };

    const handleSingleClick = (ans: QuestionTypes | null) => {
          if (ans) {
            const questionData = ans as unknown as QuestionTypes;
            setSubData(questionData);
            setSubStep(true)
        } else {
            setSubData(null);
        }
    }

    const selectedAnswerOptions = (val: SelectedAnswersType) => {
        const updatedAnswer = [...answer];
        const existingIndex = updatedAnswer.findIndex((ans) => ans.questionId === val.questionId);
      
        if (existingIndex > -1) {
          updatedAnswer[existingIndex] = val;
        } else {
          updatedAnswer.push(val);
        }
      
        setAnswer(updatedAnswer);
      
        updatedAnswer.forEach((element) => {
          
          const filterData = data[currentStep].Questions.find((e) => e.id === element.questionId);
      
          if (filterData && filterData.Answers) {
            if (element.question_option_id) {
              filterData.Answers.question_option_id = element.question_option_id;
            }
      
            if (element.answer_text) {
              filterData.Answers.answer_text = element.answer_text;
            }
          }
        });
    };



     const handleValidation = (validate:boolean) => {
      console.log('context.getPartner =>',context.getPartner);
      console.log('validate =>',validate);
    
      if(!isPrevious){
        setIsButtonDisabled(validate);
      }else{
        setIsButtonDisabled(false);
      }
     }
    
  
  return (

    <div className="stepper-container w-full">
      <div className="steps mb-10">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            <div className={`step  ${index <= currentStep ? 'active' : ''}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`line ${index < currentStep ? 'active-line' : ''}`} />
            )}
          </div>
        ))}
      </div>
       
        {/* main-question */}
        {currentData  &&
          <div className="flex flex-wrap w-full shadow-[0_0px_20px_0px_rgba(0,0,0,0.05)] border border-[#F3F3F3] bg-white rounded-xl p-6 mt-10;">
           {currentData.map((val,index) => (
                <div className="w-full" key={index} >
                
                {/* main question */}
                  {( val.QuestionOrder == 1 || val.ReferenceId != null) &&
                    <div>
                    {val.QuestionOrder == 1 &&  <p className="text-xl font-medium text-[#323232] py-3 text-left">{val.Question}</p>}
                    {val.QuestionDescription &&
                      <p className="text-sm font-normal text-[#323232] py-2 text-left">{val.QuestionDescription}</p>   
                      }
                    
                                {/* multi-select */}
                                  { val.QuestionType === ControlType.MULTIPLE && 
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
                                  initialData={currentData} 
                                  singleClick={handleSingleClick}
                                  selectedAnswerOptions={selectedAnswerOptions}
                                  checkValidation={handleValidation} />
                                }
                                {/* single-select */}
                
                                {/* text-box */}
                                { val.QuestionType === ControlType.TEXTBOX && 
                                  <TextBox  
                                    optionList={val} 
                                    selectedAnswerOptions={selectedAnswerOptions}
                                    checkValidation={handleValidation}
                                    />
                                }
                                {/* text-box */}
                
                                {/* text-area */}
                                { val.QuestionType === ControlType.TEXTAREA && 
                                  <TextArea 
                                  optionList={val} 
                                  selectedAnswerOptions={selectedAnswerOptions}
                                  checkValidation={handleValidation}/>
                                }     
                                {/* text-area */}
                
                                {/* check-box */}
                                { val.QuestionType === ControlType.CHECKBOX && 
                                  <CheckBox optionList={val}  
                                  selectedAnswerOptions={selectedAnswerOptions}
                                  checkValidation={handleValidation}
                                  />
                                } 
                                {/* check-box */}

                                {/* radio-button */}
                                { val.QuestionType === ControlType.RADIO && 
                                    <RadioGroupControl 
                                    optionList={val}
                                    selectedAnswerOptions={selectedAnswerOptions}
                                    checkValidation={handleValidation}
                                    />
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
                {/* main question */}
                
              
                {/* sub-question */}
                  {subStep && subData && val.QuestionOrder != 1 && (currentStep == index) &&
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
                                initialData={currentData} 
                                singleClick={handleSingleClick}
                                selectedAnswerOptions={selectedAnswerOptions}
                                checkValidation={handleValidation} />
                            }
                            {/* single-select */}

                            {/* text-box */}
                            { subData.QuestionType === ControlType.TEXTBOX && 
                              <TextBox  optionList={subData}
                                selectedAnswerOptions={selectedAnswerOptions} 
                                checkValidation={handleValidation}
                              />
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
                                checkValidation={handleValidation}/>
                              
                            } 
                            {/* check-box */}
                    </div>
                  }   
                {/* sub-question */}
              </div>
            ))}
              <div className="controls flex justify-between items-center w-full mt-8">
                  <button className="theme-primary-outline-btn w-max btn-xs my-0 min-w-28" onClick={goToPreviousStep} 
                  style={{ display: currentStep === 0 ? 'none' : 'inline-block' }} >
                    Back
                  </button>
                  <button className="theme-primary-btn w-max btn-xs my-0 ms-auto min-w-28" onClick={goToNextStep}  
                  disabled={isButtonDisabled}
                  >
                   { currentStep != steps.length-1  ? 'Next' :  'Submit'}
                  </button>
                </div>
          </div>
          }  
        {/* main-question */}
    
    </div>
  );
};

export default CustomStepperWithLine;
