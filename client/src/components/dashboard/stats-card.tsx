import { StatsCardProps } from "@/lib/types";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  iconBgColor, 
  iconColor, 
  trend, 
  secondaryText 
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <span className="material-icons">{icon}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {trend && (
          <span className={trend.positive ? "text-green-500 font-medium" : "text-amber-500 font-medium"}>
            {trend.value}
          </span>
        )}
        {" "}
        {secondaryText}
      </div>
    </div>
  );
};

export default StatsCard;
