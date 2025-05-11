import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";

const Sidebar = () => {
  const [location] = useLocation();
  const { isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col dark:bg-gray-950 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
            <span className="material-icons text-sm">shield</span>
          </div>
          <h1 className="text-xl font-semibold">PermissionHub</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">ERC-7715 Permission Manager</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 dark:text-gray-400">Dashboard</p>
          <Link href="/">
            <a className={`flex items-center space-x-2 p-2 rounded-md ${
              location === "/" 
                ? "bg-blue-50 text-primary dark:bg-blue-900 dark:bg-opacity-20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            } font-medium`}>
              <span className="material-icons text-sm">dashboard</span>
              <span>Overview</span>
            </a>
          </Link>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 dark:text-gray-400">Permissions</p>
          <Link href="/streams">
            <a className={`flex items-center space-x-2 p-2 rounded-md ${
              location === "/streams" 
                ? "bg-blue-50 text-primary dark:bg-blue-900 dark:bg-opacity-20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
              <span className="material-icons text-sm">attach_money</span>
              <span>Financial Streams</span>
            </a>
          </Link>
          <Link href="/sessions">
            <a className={`flex items-center space-x-2 p-2 rounded-md ${
              location === "/sessions" 
                ? "bg-blue-50 text-primary dark:bg-blue-900 dark:bg-opacity-20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
              <span className="material-icons text-sm">timer</span>
              <span>Sessions & Delegations</span>
            </a>
          </Link>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 dark:text-gray-400">Settings</p>
          <Link href="/settings">
            <a className={`flex items-center space-x-2 p-2 rounded-md ${
              location === "/settings" 
                ? "bg-blue-50 text-primary dark:bg-blue-900 dark:bg-opacity-20" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}>
              <span className="material-icons text-sm">security</span>
              <span>Security</span>
            </a>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={isConnected ? disconnectWallet : connectWallet}
          className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span className="material-icons text-sm">account_balance_wallet</span>
          <span>{isConnected ? "Disconnect Wallet" : "Connect Wallet"}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
