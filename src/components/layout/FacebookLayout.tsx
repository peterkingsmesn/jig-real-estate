import React, { ReactNode } from 'react';
import FacebookHeader from './FacebookHeader';
import FacebookSidebar from './FacebookSidebar';
import FacebookRightSidebar from './FacebookRightSidebar';

interface FacebookLayoutProps {
  children: ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  section?: string;
}

const FacebookLayout: React.FC<FacebookLayoutProps> = ({
  children,
  showLeftSidebar = true,
  showRightSidebar = true,
  section = 'default',
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <FacebookHeader />
      
      {/* Main Content Area */}
      <div className="flex pt-14">
        {/* Left Sidebar */}
        {showLeftSidebar && (
          <div className="hidden lg:block fixed left-0 w-80 h-[calc(100vh-56px)] overflow-y-auto">
            <FacebookSidebar />
          </div>
        )}
        
        {/* Center Content */}
        <main 
          className={`flex-1 min-h-[calc(100vh-56px)] ${
            showLeftSidebar ? 'lg:ml-80' : ''
          } ${showRightSidebar ? 'lg:mr-80' : ''}`}
        >
          <div className="max-w-3xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
        
        {/* Right Sidebar */}
        {showRightSidebar && (
          <div className="hidden xl:block fixed right-0 w-80 h-[calc(100vh-56px)] overflow-y-auto">
            <FacebookRightSidebar section={section} />
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">홈</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-xs mt-1">친구</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <span className="text-xs mt-1">동영상</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">마켓</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">메뉴</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacebookLayout;