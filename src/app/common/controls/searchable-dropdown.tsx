'use client';
import React from 'react';
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { animals } from '@/app/constants/AutoCompeleteData';
import { QuestionTypes } from '@/app/shared/dataPass';

interface GlobalAutoCompleteProps{
    optionList: QuestionTypes;
}

const AutoComplete : React.FC<GlobalAutoCompleteProps> =  ({ optionList }) => {

  return (
    <div className="mt-3 md:mt-4">
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Autocomplete 
                label={optionList.ControlLabel}
                placeholder={optionList.ControlPlaceholder}
                className="max-w-full"
                defaultItems={animals}
            >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
        </div>
    </div>
   
  );
};

export default AutoComplete;