
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Analysis Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
