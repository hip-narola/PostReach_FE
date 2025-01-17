import React from 'react';
import moment from 'moment';
import { HeaderProps } from 'react-big-calendar';

export const CustomWeekHeader: React.FC<HeaderProps> = ({ date }) => {
  const formattedDate = moment(date).format('ddd DD'); // Format as "Mon 30"
  return <span>{formattedDate}</span>;
};