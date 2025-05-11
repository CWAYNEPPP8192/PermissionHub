import { useState } from "react";
import { PermissionModalProps } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const PermissionModal = ({
  isOpen,
  onClose,
  request,
  onDeny,
  onGrant
}: PermissionModalProps) => {
  const [securityConfirmed, setSecurityConfirmed] = useState(false);

  if (!request) return null;

  const handleGrant = () => {
    if (!securityConfirmed) return;
    onGrant(request.id);
    setSecurityConfirmed(false);
    onClose();
  };

  const handleDeny = () => {
    onDeny(request.id);
    setSecurityConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSecurityConfirmed(false);
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Permission Request</DialogTitle>
          <DialogDescription>
            Review the permission details before granting access
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-full ${request.iconBgColor} flex items-center justify-center ${request.iconColor}`}>
              <span className="material-icons">{request.icon}</span>
            </div>
            <div className="ml-4">
              <h4 className="font-medium">{request.appName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{request.description}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-medium mb-2">Permission Details</h5>
            <div className="bg-gray-50 rounded-md p-3 space-y-3 dark:bg-gray-900">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Contract Address</span>
                <span className="font-mono">{request.contractAddress.slice(0, 6)}...{request.contractAddress.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Function Signature</span>
                <span className="font-mono">{request.functionSignature}</span>
              </div>
              {request.maxAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Maximum Value</span>
                  <span>{request.maxAmount} {request.token}</span>
                </div>
              )}
              {request.maxCalls && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Maximum Calls</span>
                  <span>{request.maxCalls} calls</span>
                </div>
              )}
              {request.expiryTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Expires</span>
                  <span>{request.expiryTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="security-warning" 
                checked={securityConfirmed}
                onCheckedChange={(checked) => setSecurityConfirmed(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="security-warning"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand the security implications
                </Label>
                <p className="text-sm text-muted-foreground">
                  This permission gives the application limited access to interact with your wallet.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleDeny}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Deny
            </button>
            <button 
              onClick={handleGrant}
              disabled={!securityConfirmed}
              className={`flex-1 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 ${!securityConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Grant Permission
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionModal;
