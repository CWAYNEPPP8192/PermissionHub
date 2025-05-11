export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  secondaryText?: string;
}

export interface StreamCardProps {
  id: number;
  appName: string;
  contractAddress: string;
  streamRate: string;
  totalStreamed: string;
  maxAmount: string;
  timeRemaining: string;
  token: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  onAdjust: (id: number) => void;
  onStop: (id: number) => void;
}

export interface SessionCardProps {
  id: number;
  appName: string;
  sessionType: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  status: "active" | "limited" | "expired";
  expiryTime: string;
  progressPercent: number;
  permissionType: string;
  permissionDetails: Record<string, string>;
  onExtend?: (id: number) => void;
  onEnd?: (id: number) => void;
  onPause?: (id: number) => void;
  onView?: (id: number) => void;
}

export interface PermissionRequestProps {
  id: number;
  appName: string;
  description: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  onReview: (id: number) => void;
  onGrant: (id: number) => void;
}

export interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: {
    id: number;
    appName: string;
    description: string;
    contractAddress: string;
    functionSignature: string;
    maxAmount?: string;
    maxCalls?: number;
    expiryTime?: string;
    icon: string;
    iconBgColor: string;
    iconColor: string;
    token?: string;
  };
  onDeny: (id: number) => void;
  onGrant: (id: number) => void;
}
