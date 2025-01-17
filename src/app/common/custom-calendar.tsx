import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState, memo, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomEvent from './custom-event';
import ApprovalPopup from '../components/post-approval/approval-popup';
import { ApproveRejectType, DeletePostType, Post, PostListType } from '../shared/dataPass';
import { PageConstant, Titles } from '../constants/pages';
import { CustomWeekHeader } from './cutsom-header';

interface CustomCalendarProps {
  data: Post[];
  getDate: (dates: { startDate: Date; endDate: Date }) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ data, getDate }) => {
  const localizer = momentLocalizer(moment);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<string>('');
  const [ isOpens,setOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PostListType>([]);

  useEffect(() => {
    // Set the initial date range when the component mounts
    const startOfWeek = moment(new Date()).startOf('week').toDate(); // Get start of the week
    const endOfWeek = moment(new Date()).endOf('week').toDate(); // Get end of the week
    setDateRange(`${moment(startOfWeek).format('MMMM D, YYYY')} – ${moment(endOfWeek).format('MMMM D, YYYY')}`);
    getDate({ startDate: startOfWeek, endDate: endOfWeek });
  },[]);

  const handleNavigate = (date: Date) => {
    const startOfWeek = moment(date).startOf('week').toDate(); // Get start of the week
    const endOfWeek = moment(date).endOf('week').toDate(); // Get end of the week
    setDateRange(`${moment(startOfWeek).format('MMMM D, YYYY')} – ${moment(endOfWeek).format('MMMM D, YYYY')}`);
    getDate({ startDate: startOfWeek, endDate: endOfWeek });
    setCurrentDate(date); // Update the state with the new date
  };

  const handleEventClick = (event: Post) => {
    setOpen(true);
    setSelectedData([event])
  };

  const handleDataFromChild = (data: ApproveRejectType | null,type:string) => {
    console.log('data,type =>',data,type);
    
    setOpen(false)
  };

  const handleRejectfromApproval = (obj:ApproveRejectType) => {
    console.log('obj =>',obj);
    
  };

  const handleDelete = (data:DeletePostType) => {
    console.log('obj =>',data);
    
  };

  return (
   <div className="overflow-x-auto">
     <div className="myCustomHeight relative border border-[#F3F3F3] rounded-lg min-w-[1024px]">
      {/* Display the week date range above the calendar */}
      <div className="calendar-header absolute text-left ml-20 md:ml-28 top-5 md:top-6 w-max">
        <span className='text-xl leading-[30px] font-medium text-[#323232]'>{dateRange}</span>
      </div>
      <div className='absolute right-4 md:right-5 top-2.5 md:top-4 border border-[#F3F3F3] rounded-lg w-max p-2'>
        <a className="flex items-center justify-center text-[15px] font-medium leading-8 min-w-[90px] bg-themeblue text-white h-8 text-center rounded-lg shadow-[0px_3px_1px_-2px_#00000033]">Weekly</a>
      </div>
      <Calendar
       className='postreach-calendar'
        events={data}
        startAccessor="start"
        endAccessor="end"
        date={currentDate} // Use date instead of defaultDate
        localizer={localizer}
        views={['week']} // Restrict to weekly view only
        defaultView="week"
        onSelectEvent={handleEventClick}
        onNavigate={handleNavigate} // Update date when navigating
        components={{
          week: {
            header: CustomWeekHeader,
          },
          event: CustomEvent, // Custom event component
        }}
        step={1440} // Render entire day as one slot (no time grid)
        timeslots={1}
      />

        {/* model  */}
            <ApprovalPopup
              showModal={isOpens}
              title={Titles.POST} 
              onSendData={handleDataFromChild} 
              type={PageConstant.CALENDAR} 
              popupData={selectedData} 
              rejectPopup={handleRejectfromApproval} DeletePopup={handleDelete}>
          </ApprovalPopup> 
        {/* model  */}
    </div>
   </div>
  );
};

export default memo(CustomCalendar);
