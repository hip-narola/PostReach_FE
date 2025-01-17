'use client';
import { OptionsList, QuestionTypes } from '@/app/shared/dataPass';
import { Radio, RadioGroup } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface GlobalRadioGroupProps{
  optionList: QuestionTypes;
  initialData?: QuestionTypes[];
  selectedAnswerOptions: (selected: { questionId: number; question_option_id: string[] }) => void;
  checkValidation:(validate:boolean) => void;
}

const RadioGroupControl : React.FC<GlobalRadioGroupProps> =  ({ optionList ,selectedAnswerOptions , checkValidation }) => {
  const [selected, setSelected] = useState(optionList?.Answers?.question_option_id);

  useEffect(() => {
    // Trigger validation initially
    if (selected == undefined && optionList.IsRequired) {
      checkValidation(true);
    }else{
      checkValidation(false);
    }
    
  }, [selected]);


  const handleSingleClick = (val: string, opt: OptionsList) => {
  
    const obj = {
      questionId: opt.QuestionId,
      question_option_id: [val]
    };

    setSelected([val]);
    selectedAnswerOptions(obj);
  };
  return (
    <div className="mt-3 md:mt-4">
           <RadioGroup>
            {optionList.Options?.map((ans) => (
                        <Radio key={ans.id} className="p-3 m-0" 
                        value={String(ans.id)}
                        onChange={(e) => handleSingleClick(e.target.value, ans)}
                        >{ans.Name}</Radio>
                ))}
            </RadioGroup>
    </div>
   
  );
};

export default RadioGroupControl;