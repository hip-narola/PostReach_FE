'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Tooltip,
  Spinner,
} from '@nextui-org/react';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { InfiniteScrollType, Post, PostListType } from '../shared/dataPass';
import { infinitePostHistoryHeader, infinitePostListHeader } from '../constants/infinite-table';
import moment from 'moment';
import { CommonWords, LengthConstant, LocalStorageType, PageConstant } from '../constants/pages';

interface GlobalTableProps {
  tableData: PostListType; 
  onScrollData: (data: InfiniteScrollType) => void; // Prop to handle close action
  type:string,
  selectedData: (data: Post[]) => void;
  openPopup: (data: PostListType,type:string) => void;
}

const InfiniteScroll: React.FC<GlobalTableProps> = ({ tableData ,onScrollData, type,selectedData ,openPopup}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Number of items to display per page.
  const [data, setData] = useState<PostListType>(tableData.slice(0, itemsPerPage));
  const [selectedRows, setSelectedRows] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
     setData(tableData);
  },[tableData])
 
  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // const nextData = tableData.slice(startIndex, endIndex);
    // setData((prevData) => [...prevData, ...nextData]);
    setCurrentPage(nextPage);
    if (endIndex >= tableData.length) {
      setHasMore(false);
    }
    const obj ={
      limit: 10,
      pageNumber:nextPage,
      userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')
    }
    onScrollData(obj)
  };

  const truncateContent = (content: string, wordLimit: number): string => {
    if(content){
      const words = content.split(' ');
      return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...': content;
    }else{
      return content;
    }
  };

    const handleSelectionChange = (item: Post) => {
      setSelectedRows((prev) => {
        const isSelected = prev.find((row) => row.id === item.id);
        if (isSelected) {
          // Remove the item if already selected
          return prev.filter((row) => row.id !== item.id);
        } else {
          // Add the item to selected rows
          return [...prev, item];
        }
      });
    };
    useEffect(() => {
      selectedData(selectedRows);
    },[selectedRows]);

    const handlePopup = (item:Post,type:string)  => {
      openPopup([item],type)
    }

    const [ loaderRef,scrollerRef] = useInfiniteScroll({
      hasMore,
      onLoadMore: loadMore,
    });

  return (
    <div>
      {tableData && 
        <Table
          isHeaderSticky
          aria-label="Example table with infinite pagination"
          baseRef={scrollerRef}
          bottomContent={
            hasMore ? (
              <div className="flex w-full justify-center">
                <Spinner ref={loaderRef} color="white" />
              </div>
            ) : null
          }
          classNames={{
            wrapper:'p-0 rounded-lg  border-[#EAECF0] border rounded-lg shadow-none',
            base: 'max-h-[520px] overflow-y-auto',
            table: 'post-history-table min-w-[760px]',
            thead:'shadow-none',
            th:'py-3 text-sm leading-[22px] font-normal text-[#454545]',
          
            td:'p-3  text-sm font-normal text-[#5D5D5D] border-[#EAECF0] border-t border-b cursor-pointer '
          }}
        >
              {type === PageConstant.HISTORY ? (
                    <TableHeader className="bg-[#F9FAFB]" columns={infinitePostHistoryHeader}>
                      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                ) : (
                    <TableHeader className="bg-[#F9FAFB]" columns={infinitePostListHeader}>
                      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                )}

                {tableData.length === 0 ? (
                  <TableBody emptyContent={<div>There is no data found</div>}>{[]}</TableBody>
                ) : type === PageConstant.HISTORY ? (
				            <TableBody  items={data as Post[]}>
                                  {(item) => (
                                    <TableRow className='td' key={item.id}  onClick={() =>handlePopup(item,PageConstant.HISTORY)}>
                                      <TableCell>
                                        <Checkbox 
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={() => handleSelectionChange(item)}> 
                                        </Checkbox>
                                      </TableCell>
                                    <TableCell>
                                    <div className="w-[76px] h-[76px] overflow-hidden">
                                    <div className="w-[76px] h-[76px] overflow-hidden">
                                          {item.image ? 
                                          <img src={item.image} width={76} height={76} className={"w-full h-full rounded object-cover"}/>
                                          :
                                          <img src='../assets/images/Image_not_available.png' width={76} height={76} className={"w-full h-full rounded object-cover"}/>}
                                        </div>
                                      </div>
                                    
                                    </TableCell>
                                    <TableCell>
                                    <Tooltip color="default" delay={100} placement={"top-start"} classNames={{ base: [
          // arrow color
          "",
        ],
        content: ["py-2 shadow-medium"],
      }}  content={ <div style={{ color:"#454545",maxWidth: "340px", whiteSpace: "normal" }}><pre className="whitespace-break-spaces font-Roboto">{item.content}</pre></div>}>
                                      {truncateContent(item.content, LengthConstant.WordLimit)}
                                    </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      {item.hashtags.map((val,index) => (
                                        <p key={index}>{val}</p>
                                      ))}
                                    </TableCell>
                                    <TableCell>
                                      <img
                                        src={`../assets/icons/${item.channel}.svg`}
                                        alt="channel"
                                        style={{ width: '32px', height: '32px' }}
                                      />
                                    </TableCell>
                                    <TableCell> 
                                        <div className='flex items-center gap-2 text-[#5d5d5d] text-sm'>
                                          <img  src='../assets/icons/calendar-plus.svg'/>{moment(item.scheduled_at).format('DD/MM/YYYY')}
                                        </div>
                                        <div className='flex items-center gap-2 text-[#5d5d5d] text-sm mt-4'>
                                          <img  src='../assets/icons/time.svg'/>{moment(item.scheduled_at).format('HH:mm A')} 
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                      {item.analytics && item.analytics.length > 0 ? (
                                        item.analytics.map((analyticsItem, index) => {
                                          // Extract the key and value from each object in the analytics array
                                          const key = Object.keys(analyticsItem)[0]; // "comments", "likes", or "views"
                                          const value = analyticsItem[key]; // The corresponding value

                                          return (
                                            <div key={index} className="flex items-center gap-2">
                                              {/* Conditionally render the icon based on the key */}
                                            
                                              {key === CommonWords.VIEWS && (
                                                <div className="flex items-center gap-1">
                                                  <img src="../assets/icons/views.svg" alt="Views Icon" style={{ width: '16px', height: '16px' }} />
                                                  <span>{value}</span>
                                                </div>
                                              )}
                                              {key === CommonWords.LIKES && (
                                                <div className="flex items-center gap-1">
                                                  <img src="../assets/icons/likes.svg" alt="Likes Icon" style={{ width: '16px', height: '16px' }} />
                                                  <span>{value}</span>
                                                </div>
                                              )}
                                              {key === CommonWords.COMMENTS && (
                                                <div className="flex items-center gap-1">
                                                  <img src="../assets/icons/comments.svg" alt="Comments Icon" style={{ width: '16px', height: '16px' }} />
                                                  <span>{value}</span>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <span>No data available</span>
                                      )}
                                    </TableCell>

                                    <TableCell>
                                      <button onClick={() =>handlePopup(item,PageConstant.HISTORY)} className="preview-btn">
                                        <img  src='../assets/icons/view-password-eye.svg'/>
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                )}
                    </TableBody>
								) : (
								    <TableBody  items={data}>
                                  {(item) => (
                                    <TableRow className='td' key={item.id}
                                    onClick={() =>handlePopup(item,CommonWords.PREVIEW)}
                                    >
                                      <TableCell>
                                        <Checkbox 
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={() => handleSelectionChange(item)}> 
                                        </Checkbox>
                                      </TableCell>
                                      <TableCell>{item.postId}</TableCell>
                                      <TableCell>
                                        <div className="w-[76px] h-[76px] overflow-hidden">
                                          {item.image ? 
                                          <img src={item.image} width={76} height={76} className={"w-full h-full rounded object-cover"}/>
                                          :
                                          <img src='../assets/images/Image_not_available.png' width={76} height={76} className={"w-full h-full rounded object-cover"}/>}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                      <Tooltip color="default" delay={100} placement={"top-start"}  classNames={{base: [
          // arrow color
          "",
        ],
        content: ["py-2 shadow-medium"],
      }}  content={ <div style={{ color:"#454545",maxWidth: "340px", whiteSpace: "normal" }}><pre className="whitespace-break-spaces font-Roboto">{item.content}</pre></div>}>
                                        {truncateContent(item.content, LengthConstant.WordLimit)}
                                      </Tooltip>
                                      </TableCell>
                                      <TableCell>
                                        {item.hashtags.map((val,index) => (
                                          <p key={index}>{val}</p>
                                        ))}
                                      </TableCell>
                                      <TableCell>
                                        <img
                                          src={`../assets/icons/${item.channel}.svg`}
                                          alt="channel"
                                          style={{ width: '32px', height: '32px' }}
                                        />
                                      </TableCell>
                                      <TableCell> 
                                          <div className='flex items-center gap-2 text-[#5d5d5d] text-sm'>
                                            <img  src='../assets/icons/calendar-plus.svg'/>{moment(item.scheduled_at).format('DD/MM/YYYY')}
                                          </div>
                                          <div className='flex items-center gap-2 text-[#5d5d5d] text-sm mt-4'>
                                            <img  src='../assets/icons/time.svg'/>{moment(item.scheduled_at).format('HH:mm A')} 
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                        <button onClick={() =>handlePopup(item,CommonWords.PREVIEW)} className="preview-btn">
                                          <img  src='../assets/icons/view-password-eye.svg'/>
                                        </button>
                                      </TableCell>
                                    </TableRow>
                                  )}
                    </TableBody>
								)} 

            
              {/* {tableData.length == 0 && (
                  <TableBody emptyContent={<div>There is no data found</div>}>{[]}</TableBody>
              )} */}
        </Table>
      } 
    </div>
  );
};

export default InfiniteScroll;
