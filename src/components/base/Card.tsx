
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
