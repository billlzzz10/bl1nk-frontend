'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Button } from '@/components/ui/Button'
import { 
  Settings, 
  User, 
  LogOut, 
  Plus,
  ChevronDown,
  Zap,
  Activity
} from 'lucide-react'

export default function WorkspaceHeader() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { currentWorkspace, workspaces } = useWorkspaceStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <header className="workspace-header">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">bl1nk Note</span>
        </div>

        {/* Workspace Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          >
            <span>{currentWorkspace?.name || 'Select Workspace'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {workspaceMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-popover border rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Workspaces
                </div>
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    className="w-full text-left px-2 py-2 text-sm hover:bg-accent rounded-md"
                    onClick={() => {
                      // Switch workspace logic here
                      setWorkspaceMenuOpen(false)
                    }}
                  >
                    {workspace.name}
                  </button>
                ))}
                <hr className="my-2" />
                <button className="w-full text-left px-2 py-2 text-sm hover:bg-accent rounded-md flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* System Status */}
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-green-500" />
          <span>System Healthy</span>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden md:block">{user?.name || user?.email}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-popover border rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="px-2 py-2 text-sm border-b">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-muted-foreground text-xs">{user?.email}</div>
                </div>
                <button className="w-full text-left px-2 py-2 text-sm hover:bg-accent rounded-md flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button 
                  className="w-full text-left px-2 py-2 text-sm hover:bg-accent rounded-md flex items-center space-x-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
