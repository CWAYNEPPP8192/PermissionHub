import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 dark:bg-gray-950 dark:border-gray-800">
      <Link href="/">
        <a className={`flex flex-col items-center justify-center p-2 ${
          location === "/" ? "text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="material-icons text-lg">dashboard</span>
          <span className="text-xs mt-1">Overview</span>
        </a>
      </Link>
      <Link href="/streams">
        <a className={`flex flex-col items-center justify-center p-2 ${
          location === "/streams" ? "text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="material-icons text-lg">water_drop</span>
          <span className="text-xs mt-1">Streams</span>
        </a>
      </Link>
      <Link href="/sessions">
        <a className={`flex flex-col items-center justify-center p-2 ${
          location === "/sessions" ? "text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="material-icons text-lg">timer</span>
          <span className="text-xs mt-1">Sessions</span>
        </a>
      </Link>
      <Link href="/settings">
        <a className={`flex flex-col items-center justify-center p-2 ${
          location === "/settings" ? "text-primary" : "text-gray-500 dark:text-gray-400"
        }`}>
          <span className="material-icons text-lg">settings</span>
          <span className="text-xs mt-1">Settings</span>
        </a>
      </Link>
    </div>
  );
};

export default MobileNavigation;
