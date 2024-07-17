import React from 'react';

/*
  Over time there may be more useful event item components that can be included
  in the library
*/

export type DefaultEventItemProps = {
  title: string;
  date: string;
  id: number;
};

export const MonthlyCalendarEventItem = ({
  title,
  date,
  id
}: DefaultEventItemProps) => {
    const url = '/event-detail?id=' + id;
  return (
    <li className="rc-py-2 event-item">
      <div className="rc-flex rc-text-sm rc-flex-1 rc-justify-between">
        <h3 className="rc-font-medium"><a href={url}> {title} </a></h3>
        <p className="rc-text-gray-500">{date}</p>
      </div>
    </li>
  );
};