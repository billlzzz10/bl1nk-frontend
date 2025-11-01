'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play
} from 'lucide-react'
import { cn, formatBytes, formatNumber } from '@/lib/utils'

interface SystemStats {
  system: {
    cpu_percent: number
    memory_percent: number
    memory_used_gb: number
    memory_total_gb: number
    disk_percent: number
    disk_used_gb: number
    disk_total_gb: number
    uptime_hours: number
  }
  application: {
    requests_count: number
    errors_count: number
    active_connections: number
    error_rate: number
  }
  timestamp: string
}

export default function WorkspaceInspector() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getSystemStats()
      setStats(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runPlaywrightTest = async () => {
    try {
      setIsLoading(true)
      const result = await apiService.runPlaywrightTest()
      console.log('Playwright test result:', result)
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to run Playwright test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600'
    if (percentage < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthIcon = (percentage: number) => {
    if (percentage < 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-medium">System Monitor</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchStats}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {stats ? (
          <>
            {/* System Health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* CPU */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">CPU</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getHealthColor(stats.system.cpu_percent))}>
                      {stats.system.cpu_percent.toFixed(1)}%
                    </span>
                    {getHealthIcon(stats.system.cpu_percent)}
                  </div>
                </div>

                {/* Memory */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Memory</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getHealthColor(stats.system.memory_percent))}>
                      {stats.system.memory_percent.toFixed(1)}%
                    </span>
                    {getHealthIcon(stats.system.memory_percent)}
                  </div>
                </div>

                {/* Disk */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Disk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getHealthColor(stats.system.disk_percent))}>
                      {stats.system.disk_percent.toFixed(1)}%
                    </span>
                    {getHealthIcon(stats.system.disk_percent)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Wifi className="h-4 w-4 mr-2" />
                  Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {formatNumber(stats.application.requests_count)}
                    </div>
                    <div className="text-xs text-muted-foreground">Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {stats.application.errors_count}
                    </div>
                    <div className="text-xs text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {stats.application.active_connections}
                    </div>
                    <div className="text-xs text-muted-foreground">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {(stats.application.error_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Error Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Playwright Testing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  Playwright Testing
                </CardTitle>
                <CardDescription className="text-xs">
                  Run automated browser tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={runPlaywrightTest}
                  disabled={isLoading}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Memory Used:</span>
                    <span>{formatBytes(stats.system.memory_used_gb * 1024 * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Total:</span>
                    <span>{formatBytes(stats.system.memory_total_gb * 1024 * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disk Used:</span>
                    <span>{formatBytes(stats.system.disk_used_gb * 1024 * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>{stats.system.uptime_hours.toFixed(1)}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading system stats...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
