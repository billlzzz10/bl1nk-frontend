'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plan } from '@/types/api'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Activity
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface ExecutionCardProps {
  plan: Plan
}

export default function ExecutionCard({ plan }: ExecutionCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  // Simulate step progression
  useEffect(() => {
    if (plan.status === 'executing' && plan.steps) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1
          if (next >= plan.steps!.length) {
            clearInterval(interval)
            return plan.steps!.length - 1
          }
          return next
        })
      }, 3000) // Progress every 3 seconds for demo

      return () => clearInterval(interval)
    }
  }, [plan.status, plan.steps])

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'executing'
    return 'pending'
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'executing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const completedSteps = plan.steps?.filter((_, index) => index < currentStep).length || 0
  const totalSteps = plan.steps?.length || 0
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <Card className="execution-card border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500" />
              {plan.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {plan.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className="status-badge text-blue-600 bg-blue-100">
              <Play className="h-3 w-3 mr-1" />
              Executing
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSteps} of {totalSteps} steps</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {progress.toFixed(0)}% complete
          </div>
        </div>

        {/* Current Step Highlight */}
        {plan.steps && plan.steps[currentStep] && (
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-900">Currently Executing</span>
            </div>
            <p className="text-sm text-blue-800">{plan.steps[currentStep].title}</p>
            {plan.steps[currentStep].description && (
              <p className="text-xs text-blue-700 mt-1">{plan.steps[currentStep].description}</p>
            )}
          </div>
        )}

        {/* Steps List */}
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
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {plan.steps.map((step, index) => {
                  const status = getStepStatus(index)
                  return (
                    <div 
                      key={step.id} 
                      className={cn(
                        "flex items-start space-x-3 p-2 rounded-md transition-colors",
                        status === 'completed' && "bg-green-50 border border-green-200",
                        status === 'executing' && "bg-blue-50 border border-blue-200",
                        status === 'pending' && "bg-muted/30"
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getStepIcon(status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          status === 'completed' && "text-green-900",
                          status === 'executing' && "text-blue-900",
                          status === 'pending' && "text-muted-foreground"
                        )}>
                          {step.title}
                        </p>
                        {step.description && (
                          <p className={cn(
                            "text-xs mt-1",
                            status === 'completed' && "text-green-700",
                            status === 'executing' && "text-blue-700",
                            status === 'pending' && "text-muted-foreground"
                          )}>
                            {step.description}
                          </p>
                        )}
                        {step.tool && (
                          <div className="mt-1">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs",
                              status === 'completed' && "bg-green-100 text-green-800",
                              status === 'executing' && "bg-blue-100 text-blue-800",
                              status === 'pending' && "bg-gray-100 text-gray-600"
                            )}>
                              {step.tool}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button variant="outline" size="sm" disabled>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            View Logs
          </Button>
        </div>

        {/* Execution Metadata */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Started: {formatRelativeTime(plan.updated_at)}</span>
            <span>ETA: ~{Math.max(0, totalSteps - currentStep) * 3}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
