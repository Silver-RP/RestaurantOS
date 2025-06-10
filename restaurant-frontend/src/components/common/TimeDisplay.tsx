import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const formatDate = (date: string | Date) => {
  try {
    return format(new Date(date), 'HH:mm:ss - dd/MM/yyyy', { locale: vi });
  } catch {
    return 'N/A';
  }
};

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="text-sm font-normal">{formatDate(currentTime)}</div>;
};

export default TimeDisplay;
