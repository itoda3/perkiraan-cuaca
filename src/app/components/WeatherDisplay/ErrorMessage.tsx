// src/components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="bg-red-500 p-3 rounded-md mb-4 text-center text-lg shadow-md w-full max-w-md">
      {message}
    </p>
  );
}