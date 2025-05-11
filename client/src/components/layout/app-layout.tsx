import { ReactNode } from "react";
import Sidebar from "./sidebar";
import MobileNavigation from "./mobile-navigation";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isConnected, address, network, connectWallet } = useWallet();
  const [location] = useLocation();
  
  // Get the title based on the current path
  const getTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard Overview";
      case "/streams":
        return "Financial Streams";
      case "/sessions":
        return "Sessions & Delegations";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (desktop) */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation (mobile + desktop) */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between dark:bg-gray-950 dark:border-gray-800">
          <div className="flex items-center md:hidden">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
              <span className="material-icons text-sm">shield</span>
            </div>
            <h1 className="text-xl font-semibold ml-2">PermissionHub</h1>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">{getTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm border border-gray-300 rounded-md py-1 px-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>{network}</span>
              <span className="material-icons text-sm">arrow_drop_down</span>
            </button>
            
            {!isConnected ? (
              <button 
                onClick={() => connectWallet()}
                className="md:hidden flex items-center space-x-1 text-sm bg-primary text-white rounded-md py-1 px-3 hover:bg-primary-dark"
              >
                <span className="material-icons text-sm">account_balance_wallet</span>
                <span>Connect</span>
              </button>
            ) : (
              <div className="md:flex items-center space-x-2 text-sm border border-gray-300 rounded-md py-1 px-3 dark:border-gray-700 hidden">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-mono">{address && `${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default AppLayout;
