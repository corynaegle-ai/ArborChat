import { useState, useEffect } from 'react'
import { X, FolderOpen, Check, AlertCircle, HardDrive } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface FilesystemConfigModalProps {
  onClose: () => void
  onSave: () => void
}

export function FilesystemConfigModal({ onClose, onSave }: FilesystemConfigModalProps) {
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadCurrentDirectory()
  }, [])

  const loadCurrentDirectory = async () => {
    try {
      const directory = await window.api.mcp.filesystem.getAllowedDirectory()
      if (directory) {
        setCurrentDirectory(directory)
      }
    } catch (error) {
      console.error('Failed to load filesystem directory:', error)
    }
  }

  const handleSelectDirectory = async () => {
    setLoading(true)
    setError(null)

    try {
      const selectedPath = await window.api.mcp.filesystem.selectDirectory()
      if (selectedPath) {
        setCurrentDirectory(selectedPath)
        setSuccess(true)
        setTimeout(() => onSave(), 1000)
      }
    } catch (err) {
      setError('Failed to select directory. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-background rounded-xl border border-secondary shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <HardDrive size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Filesystem Configuration</h2>
              <p className="text-xs text-text-muted">Select workspace directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white hover:bg-secondary rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {success && (
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Check className="text-green-400" size={18} />
              <span className="text-sm text-green-400">Directory configured successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400" size={18} />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <div className="p-3 bg-tertiary/50 rounded-lg border border-tertiary text-sm">
            <p className="text-text-muted mb-2">
              Select a directory where the AI can read and write files. The AI will only have access
              to files within this directory.
            </p>
            <p className="text-text-muted">
              <strong className="text-white">Recommendation:</strong> Create a dedicated folder like
              ArborChat Workspace in your Documents folder.
            </p>
          </div>

          {currentDirectory && (
            <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <FolderOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">Current Directory</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                      Configured
                    </span>
                  </div>
                  <p className="text-sm text-text-muted font-mono break-all">{currentDirectory}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSelectDirectory}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium',
              'bg-primary hover:bg-primary/90 text-white disabled:opacity-50',
              'transition-colors'
            )}
          >
            <FolderOpen size={18} />
            {currentDirectory ? 'Change Directory' : 'Select Directory'}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-muted hover:text-white rounded-lg hover:bg-secondary"
          >
            {currentDirectory ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
