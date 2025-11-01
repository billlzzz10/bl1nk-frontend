'use client'

import { useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useAuthStore } from '@/stores/authStore'
import WorkspaceHeader from './WorkspaceHeader'
import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceCanvas from './WorkspaceCanvas'
import WorkspaceInspector from './WorkspaceInspector'
import ChatPane from './ChatPane'
import { Button } from '@/components/ui/Button'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'

export default function WorkspaceLayout() {
  const { currentWorkspace } = useWorkspaceStore()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)

  return (
    <div className="workspace-layout">
      {/* Header */}
      <WorkspaceHeader />

      {/* Main Content */}
      <div className="workspace-content">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="workspace-sidebar">
            <WorkspaceSidebar />
          </div>
        )}

        {/* Main Area */}
        <div className="workspace-main">
          {/* Canvas Area */}
          <div className="workspace-canvas">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <h1 className="text-xl font-semibold">
                  {currentWorkspace?.name || 'Workspace'}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInspectorOpen(!inspectorOpen)}
              >
                {inspectorOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </Button>
            </div>
            <WorkspaceCanvas />
          </div>

          {/* Chat Pane */}
          <div className="chat-pane">
            <ChatPane />
          </div>
        </div>

        {/* Inspector */}
        {inspectorOpen && (
          <div className="workspace-inspector">
            <WorkspaceInspector />
          </div>
        )}
      </div>
    </div>
  )
}
