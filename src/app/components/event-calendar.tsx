'use client'
import moment from 'moment';
// In a page or component that uses CustomCalendar
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import { ApiResponse } from '../shared/response/apiResponse';
import { getCalendarList } from '../services/post-service';
import { CalendarListType, CustomDateEventType, Post } from '../shared/dataPass';
import { ErrorCode, LocalStorageType } from '../constants/pages';
import { logout } from '../services/auth-service';
import { useRouter } from 'next/navigation';
import navigations from '../constants/navigations';

const CustomCalendar = dynamic(() => import('../common/custom-calendar'), {
  ssr: false,
});

const CalendarPage: React.FC = () => {
  const [event , setEvent] = useState<Post[]>([])
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const hasFetched = useRef(false);
  const startOfWeek = moment(new Date()).startOf('week').toDate(); // Get start of the week
  const endOfWeek = moment(new Date()).endOf('week').toDate(); // Get end of the week
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getCalendarData({startWeekDate: moment(startOfWeek).format('YYYY-MM-DD') ,endWeekDate: moment(endOfWeek).format('YYYY-MM-DD') ,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
    }
  },[]);

  const getCalendarData = async(obj : CalendarListType) => {
    setIsLoading(true);
    const response : ApiResponse<Post[]> = await getCalendarList(obj);
    if(response?.IsSuccess){
      setIsLoading(false);
      response?.Data.forEach((element:Post) => {
        element.allDay = true;
        const inputDate = moment(element.start).startOf('day'); // Convert to moment object and reset to start of the day
        const currentDate = moment().startOf('day'); // Get the current date and reset to start of the day
        element.isPast = inputDate.isBefore(currentDate);
        element.start = new Date(element.start);
        element.end = new Date(element.end);
      });
      setEvent(response?.Data)
    }else{
      if(response.StatusCode == ErrorCode.UNAUTHORISED){
        logoutFn();
      }
      setIsLoading(false);
    }
  }

  const logoutFn = async() => {
    const response : ApiResponse<[]>  = await logout(localStorage.getItem(LocalStorageType.ACCESS_TOKEN) || '');
    
    if(response?.IsSuccess){
          setIsLoading(false);
          localStorage.clear();
          router.push(navigations.login)
    }else{
          setIsLoading(false);
          if(response.StatusCode == ErrorCode.UNAUTHORISED){
            logoutFn();
          }
    }
  }


  const getWeekDates = (obj:CustomDateEventType) => {
    const startOfWeek = obj.startDate; // Get start of the week
    const endOfWeek = obj.endDate; // Get end of the week
   
    getCalendarData({startWeekDate: moment(startOfWeek).format('YYYY-MM-DD') ,endWeekDate: moment(endOfWeek).format('YYYY-MM-DD') ,userId:parseInt(localStorage.getItem(LocalStorageType.USER_ID) || '')})
  }


  return(
    <div>
      <div className="page-content">
      <CustomCalendar data={event} getDate={getWeekDates}/>
     </div>
    </div> 
    );

}

  

export default CalendarPage;
