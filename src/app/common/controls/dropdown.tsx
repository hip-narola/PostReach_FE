'use client';
import React, {useEffect, useState } from 'react';
import {Select, SelectItem} from "@nextui-org/select";
import {QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import { SharedSelection } from '@nextui-org/react';
interface GlobalDropdownControlProps{
  optionList:QuestionTypes;
  selectedAnswerOptions: (selected: SelectedAnswersType) => void;
  checkValidation:(validate:boolean) => void;
}

const DropdownControl : React.FC<GlobalDropdownControlProps> =  ({ optionList, selectedAnswerOptions ,checkValidation }) => {
  const [selected, setSelected] = useState(optionList?.Answers?.question_option_id.length ? (optionList.Answers?.question_option_id.length > 1 ? optionList.Answers?.question_option_id : optionList.Answers?.question_option_id[0].split(', ')) : []);

  useEffect(() => {
    // Trigger validation initially
    if (selected.length == 0 && optionList.IsRequired) {
      checkValidation(true);
    }else{
      checkValidation(false);
    }
    
  }, [selected]);

  const handleSelection = (keys: SharedSelection) => {
    // Convert Set<React.Key> to string[] by filtering only strings
    const selectedValues = Array.from(keys).filter((key): key is string => typeof key === "string");
  
    setSelected(selectedValues); // Set the filtered string array as selected
    // Update the local state
    const answerObj = {
      questionId: optionList.id,
      question_option_id: selectedValues,
    };
    selectedAnswerOptions(answerObj);
  };

  return (
    <div className="mt-3 md:mt-4 text-left">
            <Select
             onSelectionChange={handleSelection} 
             selectedKeys={new Set(selected)} 
              items={optionList.Options}
              label= {optionList.ControlLabel}
              placeholder= {optionList.ControlPlaceholder}
              className="max-w-xs bg-[#EEFDFD] border-[#EEFDFD]">
              {(val) => <SelectItem className="text-[#323232]" key={val.id}>{val.Name}</SelectItem>}
            </Select>
    </div>
   
  );
};

export default DropdownControl;