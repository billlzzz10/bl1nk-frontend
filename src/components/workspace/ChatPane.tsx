'use client'

import { useState, useRef, useEffect } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Send, Loader2, MessageSquare, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  type: 'user' | 'system' | 'plan'
  content: string
  timestamp: Date
  data?: any
}

export default function ChatPane() {
  const { sendCommand, isLoading } = useWorkspaceStore()
  const [command, setCommand] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to bl1nk Note! Type a command to get started. For example: "Create a landing page for my startup" or "Analyze the user data and create a report".',
      timestamp: new Date(),
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setCommand('')

    try {
      const plan = await sendCommand(command)
      
      const planMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'plan',
        content: `Created plan: ${plan.title}`,
        timestamp: new Date(),
        data: plan,
      }

      setMessages(prev => [...prev, planMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your command. Please try again.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Command Center</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          AI-Powered Workspace Assistant
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.type === 'plan'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </div>
              
              {message.type === 'plan' && message.data && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="text-xs">
                    <div>Steps: {message.data.steps?.length || 0}</div>
                    <div>Status: {message.data.status}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing your command...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type your command here... (e.g., 'Create a dashboard for sales data')"
              disabled={isLoading}
              className="pr-10"
            />
            <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            type="submit"
            disabled={!command.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            <span>Try:</span>
            <button 
              className="text-primary hover:underline"
              onClick={() => setCommand('Create a landing page for my startup')}
            >
              "Create a landing page"
            </button>
            <button 
              className="text-primary hover:underline"
              onClick={() => setCommand('Analyze user data and create insights')}
            >
              "Analyze data"
            </button>
            <button 
              className="text-primary hover:underline"
              onClick={() => setCommand('Design a mobile app wireframe')}
            >
              "Design wireframe"
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
