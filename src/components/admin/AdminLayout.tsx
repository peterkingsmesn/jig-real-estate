import { useState, ReactNode } from 'react';
import Head from 'next/head';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ 
  children, 
  title = '관리자 모드', 
  description = 'Philippines Rental 관리자 패널' 
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <Head>
        <title>{title} - Philippines Rental Admin</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <AdminSidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main content */}
        <div className={`
          flex-1 transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}
          ml-0
        `}>
          {/* Content area */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}