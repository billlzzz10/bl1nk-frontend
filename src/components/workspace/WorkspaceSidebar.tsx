'use client'

import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Button } from '@/components/ui/Button'
import { 
  FolderOpen, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  Pause
} from 'lucide-react'
import { cn, formatRelativeTime, getStatusColor } from '@/lib/utils'

export default function WorkspaceSidebar() {
  const { plans, approvePlan, executePlan } = useWorkspaceStore()

  const handleApprovePlan = async (planId: string) => {
    try {
      await approvePlan(planId)
    } catch (error) {
      console.error('Failed to approve plan:', error)
    }
  }

  const handleExecutePlan = async (planId: string) => {
    try {
      await executePlan(planId)
    } catch (error) {
      console.error('Failed to execute plan:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'executing':
        return <Play className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Project Explorer</h3>
        </div>
      </div>

      {/* Plans Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground">Plans</h4>
            <span className="text-xs text-muted-foreground">{plans.length}</span>
          </div>
          
          <div className="space-y-2">
            {plans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No plans yet</p>
                <p className="text-xs">Create one using the command center</p>
              </div>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(plan.status)}
                      <span className="text-sm font-medium truncate">
                        {plan.title}
                      </span>
                    </div>
                    <span className={cn(
                      "status-badge text-xs",
                      getStatusColor(plan.status)
                    )}>
                      {plan.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{plan.steps?.length || 0} steps</span>
                    <span>{formatRelativeTime(plan.created_at)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-2 flex space-x-1">
                    {plan.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                        onClick={() => handleApprovePlan(plan.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {plan.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="text-xs h-6"
                        onClick={() => handleExecutePlan(plan.id)}
                      >
                        Execute
                      </Button>
                    )}
                    {plan.status === 'executing' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                        disabled
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Running
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Files Section */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground">Files</h4>
            <span className="text-xs text-muted-foreground">0</span>
          </div>
          
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No files yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
