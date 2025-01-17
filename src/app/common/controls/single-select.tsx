'use client';
import React, { useEffect, useState } from 'react';
import { Radio, RadioGroup } from '@nextui-org/react';
import { OptionsList, QuestionTypes } from '@/app/shared/dataPass';
interface GlobalSingleSelectProps {
  optionList: QuestionTypes;
  initialData?: QuestionTypes[];
  singleClick: (option: QuestionTypes | null) => void;
  selectedAnswerOptions: (selected: { questionId: number; question_option_id: string[] }) => void;
  checkValidation:(validate:boolean) => void;
}

const SingleSelect: React.FC<GlobalSingleSelectProps> = ({
  optionList,
  initialData,
  singleClick,
  selectedAnswerOptions,
  checkValidation
}) => {
  const [selected, setSelected] = useState(optionList?.Answers?.question_option_id[0]);

  useEffect(() => {
    if (optionList.Options) {
      const data = optionList.Options.find((e) => e.id === parseInt(selected));
      const details = initialData && initialData.find((e) => e.id === data?.SubQuestionId);
        
      if (details) {
        singleClick(details);
      } else {
        singleClick(null);
      }
    }
  }, [selected, initialData, singleClick]);

  useEffect(() => {
    // Trigger validation initially
    
    if (selected == undefined && optionList.IsRequired) {
      checkValidation(true);
    }else{
      checkValidation(false);
    }
    
  }, [selected]);

  const handleSingleClick = (val: string, opt: OptionsList) => {
    const details = initialData && initialData.find((e) => e.id === opt.SubQuestionId);
    if (details) {
      singleClick(details);
    } else {
      singleClick(null);
    }

    const obj = {
      questionId: opt.QuestionId,
      question_option_id: [val]
    };

    setSelected(val);
    selectedAnswerOptions(obj);
  };

  return (
    <div className="mt-3 md:mt-4">
      <RadioGroup className="option-wrapper" value={selected}>
        <div className="option-list inline-flex flex-wrap gap-3 mt-4">
          {optionList.Options?.map((opt) => (
            <Radio
              key={opt.id}
              className="p-3 m-0 option-checkbox"
              value={String(opt.id)}
              onChange={(e) => handleSingleClick(e.target.value, opt)}
            >
              {opt.Name}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default SingleSelect;
