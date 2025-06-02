import React from 'react';
import clsx from 'clsx';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return (
    <>
      <section className="bg-bodyBackground w-full text-white">
        <div
          className={clsx(
            'w-11/12 md:w-container95 min-h-[calc(100vh-568px)] lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto',
            className,
          )}
        >
          {children}
        </div>
      </section>
    </>
  );
};

export default Container;
