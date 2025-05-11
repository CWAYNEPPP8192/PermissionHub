import { StreamCardProps } from "@/lib/types";

const StreamCard = ({
  id,
  appName,
  contractAddress,
  streamRate,
  totalStreamed,
  maxAmount,
  timeRemaining,
  token,
  icon,
  iconBgColor,
  iconColor,
  onAdjust,
  onStop
}: StreamCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
              <span className="material-icons">{icon}</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{appName}</h3>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Active stream</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <span className="material-icons">more_vert</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 mb-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500 dark:text-gray-400">Stream rate</span>
              <span className="font-medium">{streamRate} {token} per second</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
              <div className={`h-full ${token === 'USDC' ? 'bg-green-500' : 'bg-amber-500'} w-1/2 stream-animation`}></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total streamed</span>
              <div className="font-medium">{totalStreamed} {token}</div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Max amount</span>
              <div className="font-medium">{maxAmount} {token}</div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Time remaining</span>
              <div className="font-medium">{timeRemaining}</div>
            </div>
          </div>
        </div>
        
        <div className="text-xs font-mono bg-gray-50 rounded p-2 text-gray-600 overflow-x-auto dark:bg-gray-900 dark:text-gray-300">
          Contract: <span className="text-primary">{contractAddress}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between dark:bg-gray-900 dark:border-gray-700">
        <button 
          onClick={() => onAdjust(id)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center dark:text-gray-300 dark:hover:text-gray-100"
        >
          <span className="material-icons text-sm mr-1">edit</span>
          <span>Adjust Limits</span>
        </button>
        <button 
          onClick={() => onStop(id)}
          className="text-sm text-red-600 hover:text-red-800 flex items-center dark:text-red-400 dark:hover:text-red-300"
        >
          <span className="material-icons text-sm mr-1">cancel</span>
          <span>Stop Stream</span>
        </button>
      </div>
    </div>
  );
};

export default StreamCard;
