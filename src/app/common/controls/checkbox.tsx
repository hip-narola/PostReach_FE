'use client';
import { DataContext } from '@/app/context/shareData';
import { QuestionTypes, SelectedAnswersType } from '@/app/shared/dataPass';
import { Checkbox } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react';

interface GlobalCheckBoxProps {
    optionList: QuestionTypes;
    selectedAnswerOptions: (selected: SelectedAnswersType) => void;
    checkValidation:(validate:boolean) => void;
}

const CheckBox: React.FC<GlobalCheckBoxProps> = ({ optionList, selectedAnswerOptions,checkValidation }) => {
    const context = useContext(DataContext);

    if (!context) {
        throw new Error('DataContext must be used within a DataProvider');
    }

    const [isSelected, setIsSelected] = useState(Boolean(optionList?.Answers?.answer_text) || false);
    const [isDisabled, setDisabled] = useState<boolean>(false);
    const [answered, setAnswered] = useState<boolean>(false);

    useEffect(() => {
        setIsSelected(Boolean(optionList?.Answers?.answer_text) || false);
    }, [optionList.Answers?.answer_text]);

    useEffect(() => {
        console.log('checkbox =>',context.getPartner);

        if(context.getPartner && !answered){
            setDisabled(true);
        }else{
            if (!isSelected && optionList.IsRequired ) {
                checkValidation(true);
              }else{
                checkValidation(false);
              }
            setDisabled(false);
        }
       
        
      }, [isSelected,context.getPartner ]);

    const handleSelection = (e: boolean) => {
        setIsSelected(e)
        if(optionList.isPartner){
            context.setPartner(e);
            setAnswered(true)
        }
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
                    <Checkbox onValueChange={(e: boolean) => handleSelection(e)} isSelected={isSelected} isDisabled={isDisabled}>
                        {optionList.ControlLabel}
                    </Checkbox>
                </div>
            </div>
        </div>
    );
};

export default CheckBox;
