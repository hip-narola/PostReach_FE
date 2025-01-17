'use client';
import { QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import { Checkbox } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

interface GlobalCheckBoxProps {
    optionList: QuestionTypes;
    selectedAnswerOptions: (selected: SelectedAnswersType) => void;
    checkValidation:(validate:boolean) => void;
}

const CheckBox: React.FC<GlobalCheckBoxProps> = ({ optionList, selectedAnswerOptions,checkValidation  }) => {
    const [isSelected, setIsSelected] = useState(Boolean(optionList?.Answers?.answer_text) || false);

    useEffect(() => {
        setIsSelected(Boolean(optionList?.Answers?.answer_text) || false);
    }, [optionList.Answers?.answer_text]);

    useEffect(() => {
        // Trigger validation initially
        if (!isSelected && optionList.IsRequired) {
          checkValidation(true);
        }else{
          checkValidation(false);
        }
        
      }, [isSelected]);

    const handleSelection = (e: boolean) => {
        setIsSelected(e)
        // setIsSelected(e);
        const obj = {
            questionId: optionList.id,
            answer_text: e,
        };
        selectedAnswerOptions(obj);
    };

    return (
        <div className="">
            <div className="relative mt-2 md:mt-3">
                <div className="flex h-6 items-center gap-3">
                    <Checkbox onValueChange={(e: boolean) => handleSelection(e)} isSelected={isSelected}>
                        {optionList.ControlLabel}
                    </Checkbox>
                </div>
            </div>
        </div>
    );
};

export default CheckBox;
