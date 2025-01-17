import { QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import React, { useEffect, useState } from 'react';

interface GlobalTextBoxProps {
  optionList: QuestionTypes;
  selectedAnswerOptions: (selected: SelectedAnswersType) => void;
  checkValidation:(validate:boolean) => void;
}

const TextBox: React.FC<GlobalTextBoxProps> = ({ optionList, selectedAnswerOptions ,checkValidation}) => {
  const [value, setValue] = useState(String(optionList?.Answers?.answer_text || ''));
  const [textboxTouched, setTextboxTouched] = useState(false);
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    setValue(String(optionList.Answers?.answer_text || ''));
    setTextboxTouched(false);
  }, [optionList.Answers?.answer_text]);

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

  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target.value);
    setTextboxTouched(true)
    const obj = {
      questionId: optionList.id,
      answer_text: e?.target.value,
    };
    selectedAnswerOptions(obj);
  };

  return (
    <div className="mt-3 md:mt-4">
      <div className="flex flex-col w-full relative mt-2">
        <label className="text-black/60 px-1 bg-white font-normal text-xs absolute -top-2 left-3">
          {optionList.ControlLabel}
        </label>
        <div>
          <input
            id={optionList.ControlLabel}
            name={optionList.ControlLabel}
            value={value}
            type="text"
            placeholder={optionList.ControlPlaceholder}
            autoComplete={optionList.ControlLabel}
            className="form-custom-input"
            onChange={handleSelection}
            onBlur={() => setTextboxTouched(true)}
          />
        </div>
           {textboxTouched && error && (
              <span className="text-red-500 text-medium">{error}</span>
          )}
      </div>
    </div>
  );
};

export default TextBox;
