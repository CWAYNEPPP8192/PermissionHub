import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGamification } from "@/hooks/use-gamification";

import StatsCard from "@/components/dashboard/stats-card";
import StreamCard from "@/components/dashboard/stream-card";
import SessionCard from "@/components/dashboard/session-card";
import PermissionRequest from "@/components/dashboard/permission-request";
import CodeExample from "@/components/dashboard/code-example";
import PermissionModal from "@/components/modals/permission-modal";
import HealthScore from "@/components/gamification/health-score";
import BadgesList from "@/components/gamification/badges";

const Dashboard = () => {
  const { toast } = useToast();
  const { 
    healthFactors, 
    badges, 
    recentAchievements, 
    updatePermissionCounts,
    resetRecentAchievements 
  } = useGamification();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Fetch permissions and requests
  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery<any[]>({
    queryKey: ['/api/permissions'],
  });
  
  const { data: permissionRequests = [], isLoading: isLoadingRequests } = useQuery<any[]>({
    queryKey: ['/api/permission-requests'],
  });
  
  // Update gamification stats based on permission data
  useEffect(() => {
    if (permissions.length > 0) {
      const timeBoundCount = permissions.filter(p => p.expiryTime).length;
      const limitedCount = permissions.filter(p => p.maxAmount || p.maxCalls).length;
      const expiredCount = permissions.filter(p => p.expiryTime && !p.isActive).length;
      const revokedCount = permissions.filter(p => !p.isActive && !p.expiryTime).length;
      
      updatePermissionCounts({
        total: permissions.length,
        active: permissions.filter(p => p.isActive).length,
        expired: expiredCount,
        revoked: revokedCount,
        unlimited: permissions.length - limitedCount,
        timeBound: timeBoundCount
      });
    }
  }, [permissions, updatePermissionCounts]);
  
  // Clear recent achievements when they've been shown
  useEffect(() => {
    if (recentAchievements.length > 0) {
      const timer = setTimeout(() => {
        resetRecentAchievements();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recentAchievements, resetRecentAchievements]);
  
  // Get active counts for stats cards
  const activePermissions = permissions.filter((p: any) => p.isActive).length;
  const activeStreams = permissions.filter((p: any) => p.isActive && p.type === 'token-stream').length;
  const activeSessions = permissions.filter((p: any) => p.isActive && (p.type === 'session-based' || p.type === 'delegation')).length;
  
  // Filter streams and sessions/delegations
  const streams = permissions.filter((p: any) => p.type === 'token-stream' && p.isActive).slice(0, 2);
  const sessions = permissions.filter((p: any) => (p.type === 'session-based' || p.type === 'delegation') && p.isActive).slice(0, 3);
  
  // Mutations
  const approvePermissionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('POST', `/api/permission-requests/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/permission-requests'] });
      toast({
        title: "Permission Granted",
        description: "The permission has been successfully granted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to grant permission: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  const deletePermissionRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/permission-requests/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permission-requests'] });
      toast({
        title: "Request Denied",
        description: "The permission request has been denied.",
      });
    }
  });
  
  const updatePermissionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest('PATCH', `/api/permissions/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permissions'] });
      toast({
        title: "Permission Updated",
        description: "The permission has been successfully updated.",
      });
    }
  });
  
  // Handle modal actions
  const handleReviewRequest = (id: number) => {
    const request = permissionRequests.find((r: any) => r.id === id);
    if (request) {
      // Map the request data to the format expected by the modal
      const iconMap: Record<string, { icon: string, bg: string, color: string }> = {
        'contract-interaction': { icon: 'swap_horiz', bg: 'bg-blue-100', color: 'text-primary' },
        'session-based': { icon: 'grid_view', bg: 'bg-violet-100', color: 'text-accent' },
      };
      
      const requestWithIcons = {
        id: request.id,
        appName: request.appName,
        description: request.description,
        contractAddress: request.contractAddress,
        functionSignature: request.functionSignature,
        maxAmount: request.maxAmount,
        maxCalls: request.maxCalls,
        expiryTime: request.expiryTime ? 'In 7 days' : undefined,
        icon: iconMap[request.type]?.icon || 'shield',
        iconBgColor: iconMap[request.type]?.bg || 'bg-blue-100',
        iconColor: iconMap[request.type]?.color || 'text-primary',
        token: request.additionalData?.token
      };
      
      setSelectedRequest(requestWithIcons);
      setModalOpen(true);
    }
  };
  
  const handleGrantPermission = (id: number) => {
    approvePermissionMutation.mutate(id);
  };
  
  const handleDenyPermission = (id: number) => {
    deletePermissionRequestMutation.mutate(id);
  };
  
  const handleAdjustStream = (id: number) => {
    toast({
      title: "Adjust Stream",
      description: "Stream adjustment feature is coming soon.",
    });
  };
  
  const handleStopStream = (id: number) => {
    updatePermissionMutation.mutate({
      id,
      updates: { isActive: false }
    });
  };
  
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
  
  const formattedCode = `<span class="text-blue-600">await</span> <span class="text-purple-600">walletClient</span>.<span class="text-green-600">grantPermissions</span>([{
  <span class="text-amber-700">permission</span>: {
    <span class="text-amber-700">type</span>: <span class="text-green-600">"contract-interaction"</span>,
    <span class="text-amber-700">data</span>: {
      <span class="text-amber-700">contract</span>: <span class="text-green-600">"0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"</span>,
      <span class="text-amber-700">functionSig</span>: <span class="text-green-600">"approve(address,uint256)"</span>,
      <span class="text-amber-700">maxCalls</span>: <span class="text-purple-600">1</span>
    }
  }
}]);`;

  return (
    <div>
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Active Permissions"
          value={activePermissions}
          icon="verified_user"
          iconBgColor="bg-blue-100"
          iconColor="text-primary"
          trend={{ value: "+2", positive: true }}
          secondaryText="new since yesterday"
        />
        
        <StatsCard
          title="Active Streams"
          value={activeStreams}
          icon="water_drop"
          iconBgColor="bg-emerald-100"
          iconColor="text-secondary"
          secondaryText="100 USDC streamed today"
        />
        
        <StatsCard
          title="Active Sessions"
          value={activeSessions}
          icon="timer"
          iconBgColor="bg-violet-100"
          iconColor="text-accent"
          trend={{ value: "1", positive: false }}
          secondaryText="expiring in 30 minutes"
        />
      </div>
      
      {/* Active Financial Streams Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Financial Streams</h2>
          <Link href="/streams">
            <a className="text-primary text-sm flex items-center">
              <span>View All</span>
              <span className="material-icons text-sm ml-1">chevron_right</span>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {streams.map((stream: any) => (
            <StreamCard
              key={stream.id}
              id={stream.id}
              appName={stream.appName}
              contractAddress={stream.contractAddress}
              streamRate={stream.amountPerSecond}
              totalStreamed={stream.totalAmount}
              maxAmount={stream.maxAmount}
              timeRemaining={stream.appName.includes('Music') ? '~8 days' : '~3 days'}
              token={stream.additionalData?.token || 'ETH'}
              icon={stream.appName.includes('Music') ? 'music_note' : 'article'}
              iconBgColor={stream.appName.includes('Music') ? 'bg-blue-100' : 'bg-amber-100'}
              iconColor={stream.appName.includes('Music') ? 'text-primary' : 'text-amber-500'}
              onAdjust={handleAdjustStream}
              onStop={handleStopStream}
            />
          ))}
        </div>
      </div>
      
      {/* Active Sessions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Sessions & Delegations</h2>
          <Link href="/sessions">
            <a className="text-primary text-sm flex items-center">
              <span>View All</span>
              <span className="material-icons text-sm ml-1">chevron_right</span>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session: any) => {
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
      </div>
      
      {/* Permission Requests Section */}
      {permissionRequests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">New Permission Requests</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            {permissionRequests.map((request: any) => (
              <PermissionRequest
                key={request.id}
                id={request.id}
                appName={request.appName}
                description={request.description}
                icon={request.appName.includes('DeFi') ? 'swap_horiz' : 'grid_view'}
                iconBgColor={request.appName.includes('DeFi') ? 'bg-blue-100' : 'bg-violet-100'}
                iconColor={request.appName.includes('DeFi') ? 'text-primary' : 'text-accent'}
                onReview={handleReviewRequest}
                onGrant={handleGrantPermission}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Implementation Example */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Developer Implementation Example</h2>
        </div>
        
        <CodeExample
          title="ERC-7715 Implementation Sample"
          description="This example demonstrates how to request a single-use token approval permission. Ideal for dApps that want to reset approvals after transactions without requiring manual user intervention."
          code={formattedCode}
        />
      </div>
      
      {/* Permission Modal */}
      <PermissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
        onDeny={handleDenyPermission}
        onGrant={handleGrantPermission}
      />
    </div>
  );
};

export default Dashboard;
