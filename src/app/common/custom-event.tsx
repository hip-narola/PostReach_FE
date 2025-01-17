import React from 'react';
import { Post } from '../shared/dataPass';
import { LengthConstant } from '../constants/pages';
interface EventProps {
  event: Post;
}

const CustomEvent: React.FC<EventProps> = ({ event }) => {
  const truncateContent = (content: string, wordLimit: number) => {
    if(content){
      const words = content.split(" ");
      return words.length > wordLimit
        ? words.slice(0, wordLimit).join(" ") + "..."
        : content;
    }else{
    
      return  content;
    }
    
};
  return (
    <div className={`event-post-wrapper relative ${event.isPast && 'past-event'}`}>
       
      {/* Time and Icon */}
      <div className='flex items-center justify-between gap-1 p-[6px] rounded rounded-lg border border-[#E4E7EC] bg-[#132E52]'>
        <span className='text-xs font-normal bg-white rounded-3xl px-1 text-[#323232]'>{event.time}</span>
        <img src={`../assets/icons/${event.channel}.svg`} alt="Instagram" width={20} height={20} />
      </div>
      
      {/* Profile Section */}
      <div className='flex items-center gap-2 mb-1'>
        <div className="h-6 w-6 rounded-full overflow-hidden">
          {event.profileImage ?
              <img src={event.profileImage} alt={event.user} width={24} height={24} className='w-full h-full object-cover'/>
              :
              <img src="/assets/icons/default-user.svg" className="h-full w-full object-cover rounded-full" alt="Default User"/>
          }
        </div>
        <span className='text-xs text-black font-normal'>{event.user}</span>
      </div>
      
      {/* Event Text */}
      <div className='text-xs text-[#323232] font-normal whitespace-normal'>
        {/* <span className='font-medium text-black'>{event.highlightedText}</span>  */}
        {truncateContent(event.content, LengthConstant.WordLimit)}
      </div>

      {/* Attached Image */}
      {event.image && (
        <div className="h-24 w-full rounded-lg overflow-hidden">
          <img src={event.image} alt="Event" width={250} height={150} className='w-full h-full object-cover' />
        </div>
      )}
    {/* Hover preview btn */}
      {!event.isPast && 
        <div className='hover-btn absolute rounded-lg top-0 left-0 h-full w-full flex items-center justify-center bg-[#00000033] opacity-0'>
          <a  className="preview-btn">
           <img  src='../assets/icons/view-password-eye.svg'/>
          </a>
        </div>
      }
    {/* Hover preview btn */}
    </div>
  );
};

export default CustomEvent;
