import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { isConnected, address, network } = useWallet();
  const { toast } = useToast();
  
  const [autoRevokeEnabled, setAutoRevokeEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultMaxDuration, setDefaultMaxDuration] = useState("7");
  const [defaultMaxAmount, setDefaultMaxAmount] = useState("100");
  
  const handleSaveSecuritySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your security settings have been updated successfully.",
    });
  };
  
  const handleSaveDefaultSettings = () => {
    toast({
      title: "Default Settings Saved",
      description: "Your default permission settings have been updated.",
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="security">
        <TabsList className="mb-6">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="defaults">Default Settings</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>
                  Manage your connected wallet and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Connected Wallet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isConnected 
                          ? `${address?.slice(0, 10)}...${address?.slice(-8)}`
                          : "No wallet connected"
                        }
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400">
                        {network}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure automatic permission revocation and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-revoke">Automatic Revocation</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically revoke permissions when they expire
                      </p>
                    </div>
                    <Switch
                      id="auto-revoke"
                      checked={autoRevokeEnabled}
                      onCheckedChange={setAutoRevokeEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Permission Alerts</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications about permission activities
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <Button onClick={handleSaveSecuritySettings}>
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Default Permission Settings</CardTitle>
              <CardDescription>
                Configure default settings for new permission requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-duration">Default Maximum Duration (days)</Label>
                    <Input
                      id="max-duration"
                      type="number"
                      value={defaultMaxDuration}
                      onChange={(e) => setDefaultMaxDuration(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Maximum duration for session-based permissions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Default Maximum Amount</Label>
                    <Input
                      id="max-amount"
                      type="number"
                      value={defaultMaxAmount}
                      onChange={(e) => setDefaultMaxAmount(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Maximum token amount for financial stream permissions
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleSaveDefaultSettings}>
                  Save Default Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Permission Activity History</CardTitle>
              <CardDescription>
                View your recent permission activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Streaming Music App</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permission Granted
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      5 days ago
                    </p>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">DAO Voting Portal</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permission Granted
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      1 day ago
                    </p>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">NFT Marketplace</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permission Request Denied
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
