import { SessionCardProps } from "@/lib/types";

const SessionCard = ({
  id,
  appName,
  sessionType,
  icon,
  iconBgColor,
  iconColor,
  status,
  expiryTime,
  progressPercent,
  permissionType,
  permissionDetails,
  onExtend,
  onEnd,
  onPause,
  onView
}: SessionCardProps) => {
  // Status badge styling
  const statusBadge = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400",
    limited: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400"
  };

  // Progress bar color based on time remaining
  const getProgressColor = () => {
    if (progressPercent < 30) return "bg-amber-500";
    if (progressPercent < 70) return "bg-blue-500";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
              <span className="material-icons">{icon}</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{appName}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">{sessionType}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${statusBadge[status]}`}>
            {status === "active" && "Active"}
            {status === "limited" && "Limited"}
            {status === "expired" && "Expired"}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">
              {status === "limited" ? "Spending Limit" : "Session expires in"}
            </span>
            <span className={`font-medium ${progressPercent < 30 ? "text-amber-600 dark:text-amber-400" : ""}`}>
              {expiryTime}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
            <div 
              className={`h-full ${getProgressColor()}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Permission Type</span>
            <span className="font-medium">{permissionType}</span>
          </div>
          {Object.entries(permissionDetails).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{key}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between dark:bg-gray-900 dark:border-gray-700">
        {onExtend && (
          <button 
            onClick={() => onExtend(id)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center dark:text-gray-300 dark:hover:text-gray-100"
          >
            <span className="material-icons text-sm mr-1">autorenew</span>
            <span>Extend</span>
          </button>
        )}
        {onView && (
          <button 
            onClick={() => onView(id)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center dark:text-gray-300 dark:hover:text-gray-100"
          >
            <span className="material-icons text-sm mr-1">description</span>
            <span>View Details</span>
          </button>
        )}
        {onPause && (
          <button 
            onClick={() => onPause(id)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center dark:text-gray-300 dark:hover:text-gray-100"
          >
            <span className="material-icons text-sm mr-1">pause</span>
            <span>Pause</span>
          </button>
        )}
        {onEnd && (
          <button 
            onClick={() => onEnd(id)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center dark:text-red-400 dark:hover:text-red-300"
          >
            <span className="material-icons text-sm mr-1">logout</span>
            <span>End Session</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
