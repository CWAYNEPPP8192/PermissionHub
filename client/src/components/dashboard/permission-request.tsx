import { PermissionRequestProps } from "@/lib/types";

const PermissionRequest = ({
  id,
  appName,
  description,
  icon,
  iconBgColor,
  iconColor,
  onReview,
  onGrant
}: PermissionRequestProps) => {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
            <span className="material-icons">{icon}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{appName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button 
            onClick={() => onReview(id)}
            className="flex-1 md:flex-none px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Review Details
          </button>
          <button 
            onClick={() => onGrant(id)}
            className="flex-1 md:flex-none px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 text-sm"
          >
            Grant Permission
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionRequest;
