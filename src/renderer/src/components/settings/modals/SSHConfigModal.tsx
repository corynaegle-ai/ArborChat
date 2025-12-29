import { useState, useEffect } from 'react'
import { 
  X, 
  Server, 
  Key, 
  Check, 
  AlertCircle,
  Trash2,
  RefreshCw,
  User,
  Lock,
  FileKey,
  FolderOpen
} from 'lucide-react'
import { cn } from '../../../lib/utils'

interface SSHAccount {
  host: string
  username: string
}

interface SSHConfigModalProps {
  onClose: () => void
  onSave: () => void
}

export function SSHConfigModal({ onClose, onSave }: SSHConfigModalProps) {
  const [currentAccount, setCurrentAccount] = useState<SSHAccount | null>(null)
  const [host, setHost] = useState('')
  const [port, setPort] = useState('22')
  const [username, setUsername] = useState('')
  const [authType, setAuthType] = useState<'password' | 'key'>('key')
  const [password, setPassword] = useState('')
  const [keyPath, setKeyPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadCurrentAccount()
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const loadCurrentAccount = async () => {
    setCheckingStatus(true)
    try {
      const status = await window.api.mcp.ssh.getStatus()
      if (status.isConfigured && status.host) {
        setCurrentAccount({
          host: status.host,
          username: status.username || 'unknown'
        })
      } else {
        setShowForm(true)
      }
    } catch (error) {
      console.error('Failed to load SSH status:', error)
      setShowForm(true)
    } finally {
      setCheckingStatus(false)
    }
  }


  const handleSelectKeyFile = async () => {
    try {
      const path = await window.api.selectDirectory()
      if (path) {
        setKeyPath(path)
      }
    } catch (err) {
      console.error('Failed to select key file:', err)
    }
  }

  const handleSave = async () => {
    if (!host.trim() || !username.trim()) {
      setError('Host and username are required')
      return
    }

    if (authType === 'password' && !password.trim()) {
      setError('Password is required')
      return
    }

    if (authType === 'key' && !keyPath.trim()) {
      setError('SSH key path is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await window.api.mcp.ssh.configure({
        host: host.trim(),
        port: parseInt(port, 10) || 22,
        username: username.trim(),
        authType,
        password: authType === 'password' ? password : undefined,
        keyPath: authType === 'key' ? keyPath.trim() : undefined
      })
      
      if (result.success) {
        setSuccess(true)
        setCurrentAccount({
          host: host.trim(),
          username: username.trim()
        })
        setShowForm(false)
        
        setTimeout(() => {
          onSave()
        }, 1000)
      } else {
        setError(result.error || 'Failed to configure SSH')
      }
    } catch (err) {
      setError('Failed to connect via SSH. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await window.api.mcp.ssh.disconnect()
      setCurrentAccount(null)
      setShowForm(true)
      setSuccess(false)
      // Reset form
      setHost('')
      setPort('22')
      setUsername('')
      setPassword('')
      setKeyPath('')
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }


  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div 
        className={cn(
          "relative w-full max-w-lg",
          "bg-background rounded-xl border border-secondary",
          "shadow-2xl shadow-black/50",
          "animate-scale-in",
          "max-h-[90vh] overflow-y-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SSH Configuration</h2>
              <p className="text-xs text-text-muted">Connect to a remote server</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Loading State */}
          {checkingStatus && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-text-muted" size={24} />
            </div>
          )}

          {!checkingStatus && (
            <>
              {/* Success Banner */}
              {success && (
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Check className="text-green-400" size={18} />
                  <span className="text-sm text-green-400">
                    SSH connected successfully!
                  </span>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-400" size={18} />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {/* Current Account */}
              {currentAccount && !showForm && (
                <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Server size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white font-mono">
                            {currentAccount.username}@{currentAccount.host}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                            <Check size={10} />
                            Connected
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">
                          SSH credentials configured
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnect}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                        "text-red-400 hover:text-red-300 hover:bg-red-400/10",
                        "text-sm transition-colors"
                      )}
                    >
                      <Trash2 size={14} />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}


              {/* Form Section */}
              {showForm && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Key size={16} className="text-text-muted" />
                    <h3 className="font-medium text-white">
                      {currentAccount ? 'Update' : 'Add'} SSH Connection
                    </h3>
                  </div>

                  {/* Host and Port */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Host
                      </label>
                      <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="192.168.1.100 or server.example.com"
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-tertiary border border-gray-700",
                          "text-white placeholder-text-muted/50 font-mono text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Port
                      </label>
                      <input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="22"
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg",
                          "bg-tertiary border border-gray-700",
                          "text-white placeholder-text-muted/50 font-mono text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        )}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">
                      Username
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="root"
                        className={cn(
                          "w-full pl-10 pr-3 py-2.5 rounded-lg",
                          "bg-tertiary border border-gray-700",
                          "text-white placeholder-text-muted/50 font-mono text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        )}
                      />
                    </div>
                  </div>

                  {/* Auth Type Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">
                      Authentication Method
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAuthType('key')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                          authType === 'key'
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-secondary/30 border-secondary text-text-muted hover:text-white"
                        )}
                      >
                        <FileKey size={18} />
                        SSH Key
                      </button>
                      <button
                        onClick={() => setAuthType('password')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                          authType === 'password'
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-secondary/30 border-secondary text-text-muted hover:text-white"
                        )}
                      >
                        <Lock size={18} />
                        Password
                      </button>
                    </div>
                  </div>


                  {/* Password Input */}
                  {authType === 'password' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className={cn(
                            "w-full pl-10 pr-3 py-2.5 rounded-lg",
                            "bg-tertiary border border-gray-700",
                            "text-white placeholder-text-muted/50 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* SSH Key Path Input */}
                  {authType === 'key' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        SSH Private Key Path
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FileKey size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            value={keyPath}
                            onChange={(e) => setKeyPath(e.target.value)}
                            placeholder="~/.ssh/id_rsa"
                            className={cn(
                              "w-full pl-10 pr-3 py-2.5 rounded-lg",
                              "bg-tertiary border border-gray-700",
                              "text-white placeholder-text-muted/50 font-mono text-sm",
                              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            )}
                          />
                        </div>
                        <button
                          onClick={handleSelectKeyFile}
                          className={cn(
                            "px-3 py-2.5 rounded-lg",
                            "bg-secondary hover:bg-secondary/80",
                            "text-text-muted hover:text-white",
                            "transition-colors"
                          )}
                          title="Browse for key file"
                        >
                          <FolderOpen size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted">
                        Common locations: ~/.ssh/id_rsa, ~/.ssh/id_ed25519
                      </p>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="p-3 bg-tertiary/50 rounded-lg border border-tertiary text-sm">
                    <p className="text-text-muted">
                      <span className="text-yellow-400">⚠️ Security:</span> Credentials are stored 
                      locally using your system's secure storage. SSH key authentication is recommended.
                    </p>
                  </div>
                </div>
              )}

              {/* Update Button (when connected) */}
              {currentAccount && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 p-3 rounded-lg",
                    "border border-dashed border-secondary hover:border-primary/50",
                    "text-text-muted hover:text-white",
                    "transition-colors"
                  )}
                >
                  <RefreshCw size={16} />
                  Update Connection
                </button>
              )}
            </>
          )}
        </div>


        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-muted hover:text-white rounded-lg hover:bg-secondary transition-colors"
          >
            {currentAccount && !showForm ? 'Done' : 'Cancel'}
          </button>
          {showForm && !checkingStatus && (
            <button
              onClick={handleSave}
              disabled={!host.trim() || !username.trim() || loading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
                "bg-cyan-500 hover:bg-cyan-400 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors"
              )}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Connecting...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Connect SSH
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
