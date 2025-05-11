import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import StreamCard from "@/components/dashboard/stream-card";
import { DataTable } from "@/components/ui/data-table";

const Streams = () => {
  const { toast } = useToast();
  
  // Fetch all permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['/api/permissions'],
  });
  
  // Filter only token-stream type permissions
  const streams = permissions.filter((p: any) => p.type === 'token-stream');
  
  // Mutation for updating permission
  const updatePermissionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest('PATCH', `/api/permissions/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permissions'] });
      toast({
        title: "Stream Updated",
        description: "The financial stream has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update stream: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle stream actions
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
  
  // Table columns definition
  const columns = [
    {
      header: "App",
      accessorKey: "appName" as const,
    },
    {
      header: "Rate",
      accessorKey: "amountPerSecond" as const,
      cell: (stream: any) => `${stream.amountPerSecond} ${stream.additionalData?.token || 'ETH'}/sec`,
    },
    {
      header: "Total Streamed",
      accessorKey: "totalAmount" as const,
      cell: (stream: any) => `${stream.totalAmount} ${stream.additionalData?.token || 'ETH'}`,
    },
    {
      header: "Max Amount",
      accessorKey: "maxAmount" as const,
      cell: (stream: any) => `${stream.maxAmount} ${stream.additionalData?.token || 'ETH'}`,
    },
    {
      header: "Status",
      accessorKey: "isActive" as const,
      cell: (stream: any) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${stream.isActive ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
          <span>{stream.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      ),
    },
  ];
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading financial streams...</div>;
  }
  
  const activeStreams = streams.filter((s: any) => s.isActive);
  const inactiveStreams = streams.filter((s: any) => !s.isActive);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Financial Streams</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Active Streams</h2>
            {activeStreams.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No active financial streams found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeStreams.map((stream: any) => (
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
            )}
          </div>
          
          {inactiveStreams.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Stream History</h2>
              <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                <DataTable
                  columns={columns}
                  data={inactiveStreams}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Streams;
