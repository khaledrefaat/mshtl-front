import React from 'react';
import { Alert } from 'react-bootstrap';

const Error: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Alert variant="danger" className="text-center mt-3 w-100">
      {children}
    </Alert>
  );
};

export default Error;
