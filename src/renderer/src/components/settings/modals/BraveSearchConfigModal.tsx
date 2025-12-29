import { useState, useEffect } from 'react'
import { X, Search, Key, ExternalLink, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface BraveSearchConfigModalProps {
  onClose: () => void
  onSave: () => void
}

export function BraveSearchConfigModal({ onClose, onSave }: BraveSearchConfigModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [hasExistingKey, setHasExistingKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)

  useEffect(() => {
    loadCurrentKey()
  }, [])

  const loadCurrentKey = async () => {
    try {
      const hasKey = await window.api.credentials.hasKey('brave-search')
      setHasExistingKey(hasKey)
      if (!hasKey) setShowKeyInput(true)
    } catch (error) {
      console.error('Failed to check Brave Search key:', error)
      setShowKeyInput(true)
    }
  }

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return
    setLoading(true)
    setError(null)

    try {
      const validation = await window.api.mcp.braveSearch.validateKey(apiKey.trim())
      if (!validation.valid) {
        setError(validation.error || 'Invalid API key')
        setLoading(false)
        return
      }

      const result = await window.api.credentials.setKey('brave-search', apiKey.trim())
      if (result.success) {
        setSuccess(true)
        setHasExistingKey(true)
        setApiKey('')
        setShowKeyInput(false)
        setTimeout(() => onSave(), 1000)
      } else {
        setError('Failed to save API key')
      }
    } catch (err) {
      setError('Failed to configure Brave Search')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveKey = async () => {
    try {
      await window.api.credentials.deleteKey('brave-search')
      setHasExistingKey(false)
      setShowKeyInput(true)
    } catch (error) {
      console.error('Failed to remove key:', error)
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
              <Search size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Brave Search Configuration</h2>
              <p className="text-xs text-text-muted">Connect to Brave Search API</p>
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
              <span className="text-sm text-green-400">Brave Search connected successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400" size={18} />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {hasExistingKey && !showKeyInput && (
            <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <Key size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">API Key Configured</span>
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">Brave Search is ready to use</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveKey}
                  className="px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {(showKeyInput || !hasExistingKey) && (
            <div className="space-y-4">
              <div className="p-3 bg-tertiary/50 rounded-lg border border-tertiary text-sm">
                <p className="text-text-muted mb-2">
                  Get a Brave Search API key to enable web search capabilities.
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open('https://brave.com/search/api/', '_blank')
                  }}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Get a Brave Search API key
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Brave Search API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="BSA..."
                  className="w-full px-3 py-2.5 rounded-lg bg-tertiary border border-gray-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === 'Enter' && apiKey.trim() && handleSaveKey()}
                />
              </div>
            </div>
          )}

          {hasExistingKey && !showKeyInput && (
            <button
              onClick={() => setShowKeyInput(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-secondary hover:border-primary/50 text-text-muted hover:text-white"
            >
              <RefreshCw size={16} />
              Update API Key
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-muted hover:text-white rounded-lg hover:bg-secondary"
          >
            {hasExistingKey && !showKeyInput ? 'Done' : 'Cancel'}
          </button>
          {(showKeyInput || !hasExistingKey) && (
            <button
              onClick={handleSaveKey}
              disabled={!apiKey.trim() || loading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary/90 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save API Key
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
