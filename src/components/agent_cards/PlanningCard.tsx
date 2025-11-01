'use client'

import { useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plan } from '@/types/api'
import { 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Target,
  Loader2
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface PlanningCardProps {
  plan: Plan
}

export default function PlanningCard({ plan }: PlanningCardProps) {
  const { approvePlan, isLoading } = useWorkspaceStore()
  const [expanded, setExpanded] = useState(false)
  const [approving, setApproving] = useState(false)

  const handleApprove = async () => {
    try {
      setApproving(true)
      await approvePlan(plan.id)
    } catch (error) {
      console.error('Failed to approve plan:', error)
    } finally {
      setApproving(false)
    }
  }

  return (
    <Card className="plan-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center">
              <Target className="h-4 w-4 mr-2 text-yellow-500" />
              {plan.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {plan.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className="status-badge text-yellow-600 bg-yellow-100">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Steps:</span>
            <span className="ml-2 font-medium">{plan.steps?.length || 0}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-2 font-medium">{formatRelativeTime(plan.created_at)}</span>
          </div>
        </div>

        {/* Steps Preview */}
        {plan.steps && plan.steps.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-sm font-medium text-left hover:text-primary transition-colors"
            >
              <span>Execution Steps</span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expanded && (
              <div className="mt-3 space-y-2">
                {plan.steps.slice(0, 5).map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-3 p-2 bg-muted/50 rounded-md">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{step.title}</p>
                      {step.description && (
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      )}
                      {step.tool && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                            {step.tool}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {plan.steps.length > 5 && (
                  <div className="text-center text-xs text-muted-foreground">
                    ... and {plan.steps.length - 5} more steps
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button
            onClick={handleApprove}
            disabled={approving || isLoading}
            className="flex-1"
          >
            {approving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Plan
              </>
            )}
          </Button>
          
          <Button variant="outline" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Plan Metadata */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Plan ID: {plan.id.slice(0, 8)}...</span>
            <span>Status: {plan.status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
