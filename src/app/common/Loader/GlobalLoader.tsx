'use client';
import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import { Spinner } from '@nextui-org/react';

const GlobalLoader = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-10">
    <Spinner label="Loading..." color="primary" labelColor="foreground" size='lg'/>
    </div>
   
  );
};

export default GlobalLoader;