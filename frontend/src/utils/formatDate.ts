import { getDate, getMonth, getYear, getHours } from 'date-fns';

const formatDate = (date: Date): string => {
  const parsedDate = `${getDate(date)}/${getMonth(date)}/${getYear(
    date,
  )} ${getHours(date)}`;

  return parsedDate;
};

export default formatDate;
