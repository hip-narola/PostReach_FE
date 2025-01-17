"use client";
import React, { memo } from "react";
import 'react-multi-carousel/lib/styles.css';
import {Button, Progress} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Questionnaire, QuestionnaireListType } from "../shared/dataPass";
interface GlobalTableProps {
    data: QuestionnaireListType;
    onSendData: (data: number) => void; // Prop to handle close action
  }

  const GlobalTable: React.FC<GlobalTableProps> = ({  data, onSendData }) => {
  
  const handlePopup = (questionType:number) => {
    onSendData(questionType)
  }
  
  
  return (
    <div>
        <h3 className="text-xl leading-8 text-[#323232] font-semibold mb-6">Questionnaires  <span className="text-xs text-[#888888] font-normal">03</span></h3>
        <div className="table-responsive">
        <Table hideHeader removeWrapper aria-label="Example static collection table" className="questionnaires-table">
            <TableHeader >
                <TableColumn> </TableColumn>
                <TableColumn> </TableColumn>
                <TableColumn> </TableColumn>
                <TableColumn> </TableColumn>
                <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
                {data && data.map((item:Questionnaire,index:number) => (
                    <TableRow key={index}>
                        <TableCell className="text-left">
                          <div className="bg-[#F8FBFF] rounded-lg p-5 m-auto h-20 w-20 text-center">
                          <img  src={`../../assets/icons/${item.icon}`} />
                          </div>
                          </TableCell>
                        <TableCell>
                          <div className="text-lg md:text-xl leading-8 text-[#323232] font-semibold">{item.name}</div>
                          </TableCell>
                        <TableCell>
                          <div className="flex flex-col flex-wrap justify-center items-center text-lg text-[#323232] font-medium">
                          <span className="text-[#4F4F4F]">{item.time} </span>
                          <span>{item.minutes}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2 text-lg text-[#323232] font-medium">{item.percentage ? item.percentage : 0}%
                           <span className="min-w-52"> {item.percentage && item.percentage == 100 ? 
                                <Progress color="success" aria-label="Loading..." value={item.percentage} />
                                : <Progress color="primary" aria-label="Loading..." value={item.percentage} />
                             }</span>
                            
                            {item.completeStep}/{item.totalStep}</div>
                        </TableCell>
                        <TableCell><Button color="primary" className="theme-primary-btn btn-sm  rounded-[40px] min-w-28 w-auto px-5 my-0 capitalize font-medium" onClick={() => handlePopup(item.id)}>View/Edit</Button></TableCell>
                    </TableRow>
                ))}
              
            </TableBody>
    </Table>
    </div>
    </div>
   
   
  );
}

export default memo(GlobalTable);



