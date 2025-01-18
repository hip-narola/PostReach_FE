import React, { useContext, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import { DataContext } from '@/app/context/shareData';

interface GlobalMultiSelectProps {
  optionList: QuestionTypes;
  selectedAnswerOptions: (selected: SelectedAnswersType) => void;
  checkValidation:(validate:boolean) => void;
}

const MultiSelect: React.FC<GlobalMultiSelectProps> = ({ optionList, selectedAnswerOptions ,checkValidation}) => {
  const context = useContext(DataContext);

    if (!context) {
        throw new Error('DataContext must be used within a DataProvider');
    }
  const [selected, setSelected] = useState(optionList?.Answers?.question_option_id.length ? (optionList.Answers?.question_option_id.length > 1 ? optionList.Answers?.question_option_id : optionList.Answers?.question_option_id[0].split(', ')) : []);

  useEffect(() => {
    if (selected.length == 0 && optionList.IsRequired && !context.getPartner) {
      checkValidation(true);
    }else{
      checkValidation(false);
    }
  }, [selected]);

  const handleSelection = (val: string[]) => {
    setSelected(val);
    const answerObj : SelectedAnswersType = {
      questionId: optionList.id,
      question_option_id: val,
    };
    selectedAnswerOptions(answerObj); 
  };

  return (
    <div>
      <CheckboxGroup
        className="option-wrapper"
        value={selected}
        onValueChange={handleSelection}
      >
        <div className="option-list inline-flex flex-wrap gap-3 mt-3 md:mt-4">
          {optionList.Options?.map((opt) => (
            <Checkbox key={opt.id} className="p-3 m-0 option-checkbox" value={String(opt.id)}>
              {opt.Name}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>
    </div>
  );
};

export default MultiSelect;
