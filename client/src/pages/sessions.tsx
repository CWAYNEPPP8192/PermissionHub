import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import SessionCard from "@/components/dashboard/session-card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sessions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['/api/permissions'],
  });
  
  // Filter session-based and delegation type permissions
  const allSessions = permissions.filter((p: any) => 
    p.type === 'session-based' || p.type === 'delegation'
  );
  
  const sessions = allSessions.filter((p: any) => p.type === 'session-based');
  const delegations = allSessions.filter((p: any) => p.type === 'delegation');
  
  // Filtered by active tab
  let displayedSessions = allSessions;
  if (activeTab === "sessions") {
    displayedSessions = sessions;
  } else if (activeTab === "delegations") {
    displayedSessions = delegations;
  }
  
  // Mutation for updating permission
  const updatePermissionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest('PATCH', `/api/permissions/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permissions'] });
      toast({
        title: "Session Updated",
        description: "The session has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update session: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle session actions
  const handleExtendSession = (id: number) => {
    // Set a new expiry time 2 hours in the future
    const newExpiryTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    
    updatePermissionMutation.mutate({
      id,
      updates: { expiryTime: newExpiryTime }
    });
  };
  
  const handleEndSession = (id: number) => {
    updatePermissionMutation.mutate({
      id,
      updates: { isActive: false }
    });
  };
  
  // Table columns definition
  const columns = [
    {
      header: "App",
      accessorKey: "appName" as const,
    },
    {
      header: "Type",
      accessorKey: "type" as const,
      cell: (item: any) => item.type === 'session-based' ? 'Session' : 'Delegation',
    },
    {
      header: "Created",
      accessorKey: "createdAt" as const,
      cell: (item: any) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Expires",
      accessorKey: "expiryTime" as const,
      cell: (item: any) => item.expiryTime ? new Date(item.expiryTime).toLocaleString() : 'N/A',
    },
    {
      header: "Status",
      accessorKey: "isActive" as const,
      cell: (item: any) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
          <span>{item.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      ),
    },
  ];
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading sessions...</div>;
  }
  
  const activeSessions = displayedSessions.filter((s: any) => s.isActive);
  const inactiveSessions = displayedSessions.filter((s: any) => !s.isActive);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Sessions & Delegations</h1>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="delegations">Delegations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Sessions & Delegations</h2>
              {activeSessions.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">No active sessions or delegations found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSessions.map((session: any) => {
                    // Map session data to the component props
                    let icon = 'smart_toy';
                    let iconBgColor = 'bg-emerald-100';
                    let iconColor = 'text-secondary';
                    let details: Record<string, string> = {};
                    let status: 'active' | 'limited' | 'expired' = 'active';
                    let progressPercent = 50;
                    let actions: any = {};
                    
                    // Customize based on session type
                    if (session.appName.includes('Game')) {
                      icon = 'sports_esports';
                      iconBgColor = 'bg-violet-100';
                      iconColor = 'text-accent';
                      details = {
                        'Approved Functions': 'useItem(), transferInGame()',
                      };
                      progressPercent = 30;
                      actions = {
                        onExtend: handleExtendSession,
                        onEnd: handleEndSession,
                      };
                    } else if (session.appName.includes('DAO')) {
                      icon = 'how_to_vote';
                      iconBgColor = 'bg-blue-100';
                      iconColor = 'text-primary';
                      details = {
                        'Proposal ID': session.additionalData?.proposalId || 'DIP-247',
                      };
                      progressPercent = 85;
                      actions = {
                        onView: () => {},
                        onEnd: handleEndSession,
                      };
                    } else if (session.appName.includes('AI')) {
                      status = 'limited';
                      details = {
                        'Max Trades': `${session.maxCalls} per day (${session.callsUsed} used)`,
                      };
                      progressPercent = 65;
                      actions = {
                        onView: () => {},
                        onPause: handleEndSession,
                      };
                    }
                    
                    return (
                      <SessionCard
                        key={session.id}
                        id={session.id}
                        appName={session.appName}
                        sessionType={session.name}
                        icon={icon}
                        iconBgColor={iconBgColor}
                        iconColor={iconColor}
                        status={status}
                        expiryTime={session.appName.includes('Game') ? '28 minutes' : 
                                    session.appName.includes('DAO') ? '2 days 4 hours' :
                                    `${session.maxAmount} ${session.additionalData?.token} (65% used)`}
                        progressPercent={progressPercent}
                        permissionType={session.description.split(' ')[0]}
                        permissionDetails={details}
                        {...actions}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            {inactiveSessions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Session History</h2>
                <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                  <DataTable
                    columns={columns}
                    data={inactiveSessions}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-6">
            {/* Session-specific content would mirror the "all" tab but filtered */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
              {activeSessions.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">No active sessions found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Session cards would go here */}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="delegations" className="space-y-6">
            {/* Delegation-specific content would mirror the "all" tab but filtered */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Delegations</h2>
              {activeSessions.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">No active delegations found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Delegation cards would go here */}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sessions;
