// src/renderer/src/components/agent/AgentStepTimeline.tsx

import { useState, useMemo } from 'react'
import {
  Brain,
  Wrench,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  XCircle,
  Loader2,
  Timer
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { AgentStep } from '../../types/agent'

interface AgentStepTimelineProps {
  steps: AgentStep[]
  currentStepId?: string
  isExpanded?: boolean
  onToggleExpand?: () => void
  className?: string
}

// Step type configuration with icons, colors, and labels
const STEP_CONFIG = {
  thinking: {
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: 'Thinking'
  },
  tool_call: {
    icon: Wrench,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    label: 'Tool Call'
  },
  tool_result: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    label: 'Result'
  },
  message: {
    icon: MessageSquare,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    label: 'Message'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    label: 'Error'
  }
} as const

// Tool status indicator configuration
const TOOL_STATUS_CONFIG = {
  pending: {
    icon: Loader2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    label: 'Pending',
    animate: true
  },
  approved: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    label: 'Approved',
    animate: false
  },
  denied: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Denied',
    animate: false
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    label: 'Completed',
    animate: false
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Failed',
    animate: false
  }
} as const

// Format duration between timestamps
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

// Format timestamp for display
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

// Individual step item component
function StepItem({ 
  step, 
  isLast,
  isCurrent,
  durationToNext 
}: { 
  step: AgentStep
  isLast: boolean
  isCurrent: boolean
  durationToNext?: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = STEP_CONFIG[step.type]
  const Icon = config.icon
  
  // Check if step has expandable content
  const hasDetails = step.content.length > 80 || 
                    (step.toolCall && (step.toolCall.args || step.toolCall.result))

  // Truncate content for preview
  const previewContent = step.content.length > 80 
    ? step.content.slice(0, 80) + '...' 
    : step.content

  return (
    <div className="relative">
      {/* Connecting line to next step */}
      {!isLast && (
        <div 
          className={cn(
            'absolute left-3.5 top-7 w-0.5 -bottom-1',
            isCurrent ? 'bg-violet-500/40' : 'bg-tertiary'
          )}
        />
      )}
      
      <div className={cn(
        'relative flex items-start gap-3 p-2 rounded-lg transition-all duration-150',
        isCurrent && 'bg-violet-500/10 ring-1 ring-violet-500/30',
        !isCurrent && 'hover:bg-secondary/30'
      )}>
        {/* Step icon */}
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
          'ring-1 ring-offset-1 ring-offset-background',
          config.bgColor,
          config.borderColor.replace('border-', 'ring-'),
          isCurrent && 'animate-pulse'
        )}>
          <Icon size={14} className={config.color} />
        </div>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium', config.color)}>
              {config.label}
            </span>
            
            {/* Tool status badge */}
            {step.toolCall && (
              <ToolStatusBadge status={step.toolCall.status} />
            )}
            
            {/* Timestamp */}
            <span className="text-[10px] text-text-muted ml-auto flex items-center gap-1">
              <Clock size={10} />
              {formatTimestamp(step.timestamp)}
            </span>
          </div>

          {/* Tool name if applicable */}
          {step.toolCall && (
            <div className="mt-1 text-[11px] text-text-muted font-mono">
              {step.toolCall.name}
            </div>
          )}

          {/* Content preview */}
          {step.content && (
            <p className="mt-1 text-xs text-text-muted leading-relaxed">
              {isExpanded ? step.content : previewContent}
            </p>
          )}

          {/* Expandable details */}
          {hasDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'mt-1.5 flex items-center gap-1 text-[10px] font-medium',
                'text-text-muted hover:text-text-normal transition-colors'
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronDown size={12} />
                  <span>Hide details</span>
                </>
              ) : (
                <>
                  <ChevronRight size={12} />
                  <span>Show details</span>
                </>
              )}
            </button>
          )}

          {/* Expanded details for tool calls */}
          {isExpanded && step.toolCall && (
            <div className="mt-2 space-y-2">
              {/* Tool arguments */}
              {step.toolCall.args && Object.keys(step.toolCall.args).length > 0 && (
                <div className={cn(
                  'rounded-md p-2 text-[10px] font-mono',
                  'bg-secondary/50 border border-tertiary/50'
                )}>
                  <div className="text-text-muted mb-1 font-sans font-medium">Arguments:</div>
                  <pre className="text-text-normal whitespace-pre-wrap break-all overflow-x-auto">
                    {JSON.stringify(step.toolCall.args, null, 2)}
                  </pre>
                </div>
              )}

              {/* Tool result */}
              {step.toolCall.result !== undefined && (
                <div className={cn(
                  'rounded-md p-2 text-[10px] font-mono',
                  'bg-emerald-500/10 border border-emerald-500/20'
                )}>
                  <div className="text-emerald-400 mb-1 font-sans font-medium">Result:</div>
                  <pre className="text-text-normal whitespace-pre-wrap break-all overflow-x-auto max-h-32 overflow-y-auto">
                    {typeof step.toolCall.result === 'string' 
                      ? step.toolCall.result 
                      : JSON.stringify(step.toolCall.result, null, 2)}
                  </pre>
                </div>
              )}

              {/* Tool error */}
              {step.toolCall.error && (
                <div className={cn(
                  'rounded-md p-2 text-[10px] font-mono',
                  'bg-red-500/10 border border-red-500/20'
                )}>
                  <div className="text-red-400 mb-1 font-sans font-medium">Error:</div>
                  <pre className="text-red-300 whitespace-pre-wrap break-all">
                    {step.toolCall.error}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Duration indicator */}
      {durationToNext !== undefined && !isLast && (
        <div className="flex items-center gap-1 ml-10 py-0.5 text-[9px] text-text-muted">
          <Timer size={9} />
          <span>{formatDuration(durationToNext)}</span>
        </div>
      )}
    </div>
  )
}

// Tool status badge component
function ToolStatusBadge({ status }: { status: keyof typeof TOOL_STATUS_CONFIG }) {
  const config = TOOL_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className={cn(
      'flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium',
      config.bgColor,
      config.color
    )}>
      <Icon size={10} className={config.animate ? 'animate-spin' : ''} />
      <span>{config.label}</span>
    </div>
  )
}

// Main timeline component
export function AgentStepTimeline({
  steps,
  currentStepId,
  isExpanded: externalIsExpanded,
  onToggleExpand,
  className
}: AgentStepTimelineProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(true)
  
  const isExpanded = externalIsExpanded ?? internalIsExpanded
  const handleToggle = onToggleExpand ?? (() => setInternalIsExpanded(!internalIsExpanded))

  // Calculate durations between steps
  const stepsWithDurations = useMemo(() => {
    return steps.map((step, index) => {
      const nextStep = steps[index + 1]
      const durationToNext = nextStep 
        ? nextStep.timestamp - step.timestamp 
        : undefined
      return { step, durationToNext }
    })
  }, [steps])

  // Summary stats
  const stats = useMemo(() => {
    const toolCalls = steps.filter(s => s.type === 'tool_call').length
    const errors = steps.filter(s => s.type === 'error').length
    const totalDuration = steps.length > 1 
      ? steps[steps.length - 1].timestamp - steps[0].timestamp 
      : 0
    return { toolCalls, errors, totalDuration }
  }, [steps])

  if (steps.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header with toggle */}
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between p-2 rounded-lg',
          'bg-secondary/30 hover:bg-secondary/50 transition-colors',
          'text-xs text-text-muted'
        )}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="font-medium">Execution Timeline</span>
          <span className="text-[10px]">({steps.length} steps)</span>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 text-[10px]">
          {stats.toolCalls > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <Wrench size={10} />
              {stats.toolCalls}
            </span>
          )}
          {stats.errors > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <AlertCircle size={10} />
              {stats.errors}
            </span>
          )}
          {stats.totalDuration > 0 && (
            <span className="flex items-center gap-1 text-text-muted">
              <Timer size={10} />
              {formatDuration(stats.totalDuration)}
            </span>
          )}
        </div>
      </button>

      {/* Expanded timeline */}
      {isExpanded && (
        <div className={cn(
          'mt-2 pl-1 space-y-0.5',
          'animate-in slide-in-from-top-2 duration-200'
        )}>
          {stepsWithDurations.map(({ step, durationToNext }, index) => (
            <StepItem
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
              isCurrent={step.id === currentStepId}
              durationToNext={durationToNext}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AgentStepTimeline
