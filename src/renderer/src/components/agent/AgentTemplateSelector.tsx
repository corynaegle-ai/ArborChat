import { Bug, Code2, FileText, PenTool, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'
import { AgentTemplate } from '../../types/agent'

interface AgentTemplateSelectorProps {
    selectedTemplateId: string | null
    onSelectTemplate: (template: AgentTemplate | null) => void
}

const TEMPLATES: AgentTemplate[] = [
    {
        id: 'general-assistant',
        name: 'General Assistant',
        description: 'A versatile assistant for various coding tasks',
        icon: 'Zap',
        category: 'custom',
        instructions: 'You are a helpful coding assistant. Please help the user with their request.',
        toolPermission: 'standard',
        tags: ['general', 'helper'],
        isBuiltIn: true,
        requiresDirectory: false
    },
    {
        id: 'code-refactor',
        name: 'Code Refactor',
        description: 'Improve code quality and maintainability',
        icon: 'Code2',
        category: 'custom',
        instructions: 'Analyze the provided code and suggest improvements for readability, performance, and structure. Apply best practices.',
        toolPermission: 'standard',
        tags: ['refactor', 'cleanup'],
        isBuiltIn: true,
        requiresDirectory: false
    },
    {
        id: 'bug-fixer',
        name: 'Bug Fixer',
        description: 'Identify and resolve code issues',
        icon: 'Bug',
        category: 'custom',
        instructions: 'Analyze the error or issue description. Locate the source of the bug and implement a fix. verify the fix if possible.',
        toolPermission: 'standard',
        tags: ['debug', 'fix'],
        isBuiltIn: true,
        requiresDirectory: true
    },
    {
        id: 'documentation',
        name: 'Documentation',
        description: 'Generate or improve documentation',
        icon: 'FileText',
        category: 'custom',
        instructions: 'Review the code and generate comprehensive documentation, including comments, README updates, or API references.',
        toolPermission: 'standard',
        tags: ['docs', 'writing'],
        isBuiltIn: true,
        requiresDirectory: true
    }
]

export function AgentTemplateSelector({ selectedTemplateId, onSelectTemplate }: AgentTemplateSelectorProps) {

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Code2': return <Code2 size={18} />
            case 'Bug': return <Bug size={18} />
            case 'FileText': return <FileText size={18} />
            case 'Zap': return <Zap size={18} />
            default: return <PenTool size={18} />
        }
    }

    return (
        <div className="space-y-3">
            <label className="text-xs font-medium text-text-muted">Choose a Template</label>
            <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => {
                    const isSelected = selectedTemplateId === template.id
                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onSelectTemplate(isSelected ? null : template)}
                            className={cn(
                                'flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                                isSelected
                                    ? 'bg-violet-500/10 border-violet-500/50 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]'
                                    : 'bg-secondary/30 border-secondary/50 hover:bg-secondary/50 hover:border-violet-500/30'
                            )}
                        >
                            <div className={cn(
                                'p-2 rounded-lg',
                                isSelected ? 'bg-violet-500/20 text-violet-300' : 'bg-secondary/50 text-text-muted'
                            )}>
                                {getIcon(template.icon)}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-text-normal">{template.name}</div>
                                <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{template.description}</div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
