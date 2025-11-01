'use client'

import { useWorkspaceStore } from '@/stores/workspaceStore'
import PlanningCard from '@/components/agent_cards/PlanningCard'
import ExecutionCard from '@/components/agent_cards/ExecutionCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Zap, Lightbulb, Target, Workflow } from 'lucide-react'

export default function WorkspaceCanvas() {
  const { plans, currentWorkspace } = useWorkspaceStore()

  const pendingPlans = plans.filter(plan => plan.status === 'pending')
  const executingPlans = plans.filter(plan => plan.status === 'executing')
  const completedPlans = plans.filter(plan => plan.status === 'completed')

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {plans.length === 0 ? (
        // Welcome State
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              Welcome to bl1nk Note
            </h2>
            
            <p className="text-muted-foreground mb-8 text-lg">
              Your AI-powered workspace for intelligent automation and design. 
              Start by typing a command in the chat below to create your first plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="text-center p-4">
                <CardHeader className="pb-2">
                  <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI analyzes your request and creates a detailed execution plan
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-4">
                <CardHeader className="pb-2">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Approve</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Review and approve the plan before execution begins
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center p-4">
                <CardHeader className="pb-2">
                  <Workflow className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Execute</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Watch as AI executes your plan step by step
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Try these example commands:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  "Create a landing page for my startup"
                </code>
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  "Design a mobile app wireframe"
                </code>
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  "Analyze user data and create insights"
                </code>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Plans Grid
        <div className="space-y-6">
          {/* Pending Plans */}
          {pendingPlans.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-yellow-500" />
                Pending Approval ({pendingPlans.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingPlans.map((plan) => (
                  <PlanningCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* Executing Plans */}
          {executingPlans.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Workflow className="h-5 w-5 mr-2 text-blue-500" />
                In Progress ({executingPlans.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {executingPlans.map((plan) => (
                  <ExecutionCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Plans */}
          {completedPlans.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-green-500" />
                Completed ({completedPlans.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {completedPlans.map((plan) => (
                  <Card key={plan.id} className="plan-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{plan.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{plan.steps?.length || 0} steps completed</span>
                        <span className="text-green-600 font-medium">✓ Done</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
