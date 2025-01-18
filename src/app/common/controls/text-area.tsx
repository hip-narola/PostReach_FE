'use client';
import { DataContext } from '@/app/context/shareData';
import { QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import React, { useContext, useEffect, useState } from 'react';

interface GlobalTextAreaProps{
  optionList: QuestionTypes;
  selectedAnswerOptions: (selected: SelectedAnswersType) => void;
  checkValidation:(validate:boolean) => void;
}

const TextArea : React.FC<GlobalTextAreaProps> =  ({ optionList ,selectedAnswerOptions,checkValidation }) => {
  const context = useContext(DataContext);

  if (!context) {
      throw new Error('DataContext must be used within a DataProvider');
  }
  const [value, setValue] = useState(String(optionList?.Answers?.answer_text || ''));
  const [textboxTouched, setTextboxTouched] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setValue(String(optionList.Answers?.answer_text || ''));
    setTextboxTouched(false);
  }, [optionList.Answers?.answer_text]);

  useEffect(() => {
    // Trigger validation initially
    if (value && optionList.IsRequired  && !context.getPartner) {
      checkValidation(true);
    }else{
      checkValidation(false);
    };
  }, [value]);

  
  const handleSelection = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e?.target.value);
    setTextboxTouched(true)
    const obj = {
      questionId: optionList.id,
      answer_text: e?.target.value,
    };
    selectedAnswerOptions(obj);
  };

  useEffect(() => {
    validateInput();
  }, [value]);

  const validateInput = () => {
    const inputRegex = optionList.regex;
    const unescapedRegexString = inputRegex && inputRegex.replace(/\\\\/g, '\\'); // Replace double backslashes with single ones
    const regex = unescapedRegexString && new RegExp(unescapedRegexString);

    if(!value && optionList.IsRequired) {
      setError("This field is required");
      checkValidation(true);
    } else if (regex && !regex.test(value)) {
      setError("Please enter a valid value.");
      checkValidation(true);
      console.log(' error=>',error);
    } else {
      setError(""); 
      checkValidation(false);
    }
 }

  return (
    <div className="mt-3 md:mt-4">
            <div className="flex flex-col w-full relative mt-2">
                <p className="main-question">{optionList.Question}</p>
                    <label htmlFor="Description" className="text-black/60 px-1 bg-white font-normal  text-xs absolute -top-2 left-3">
                        {optionList.ControlLabel}
                    </label>
                <div>
                    <textarea
                      id={optionList.ControlLabel}
                      name={optionList.ControlLabel}
                      typeof="textarea"
                      placeholder={optionList.ControlPlaceholder}
                      autoComplete={optionList.ControlLabel}
                      className="form-custom-input"
                      value={value}
                      onChange={handleSelection}
                      onBlur={() => setTextboxTouched(true)}
                    ></textarea>
                </div>
                {textboxTouched && error && (
              <span className="text-red-500 text-medium">{error}</span>
          )}
            </div>
    </div>
   
  );
};

export default TextArea;