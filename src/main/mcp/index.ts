// src/main/mcp/index.ts

export { mcpManager } from './manager'
export { setupMCPHandlers, clearPendingCalls, getPendingCallCount } from './ipc'
export {
  loadMCPConfig,
  saveMCPConfig,
  updateMCPConfig,
  isDirectoryAllowed,
  isToolBlocked
} from './config'
export {
  DESKTOP_COMMANDER_CONFIG,
  TOOL_CATEGORIES,
  TOOL_RISK_LEVELS,
  getToolCategory,
  getToolRiskLevel
} from './servers/desktop-commander'
export {
  GITHUB_MCP_CONFIG,
  GITHUB_MCP_DOCKER_CONFIG,
  GITHUB_TOOL_CATEGORIES,
  GITHUB_TOOL_RISK_LEVELS,
  getGitHubToolCategory,
  getGitHubToolRiskLevel,
  getGitHubCategoryDescription,
  REQUIRED_GITHUB_SCOPES,
  READONLY_GITHUB_SCOPES
} from './servers/github'
export {
  FILESYSTEM_MCP_CONFIG,
  FILESYSTEM_TOOL_CATEGORIES,
  FILESYSTEM_TOOL_RISK_LEVELS,
  getFilesystemToolCategory,
  getFilesystemToolRiskLevel,
  getFilesystemCategoryDescription,
  updateFilesystemAllowedDirectory
} from './servers/filesystem'
export {
  BRAVE_SEARCH_MCP_CONFIG,
  BRAVE_SEARCH_TOOL_CATEGORIES,
  BRAVE_SEARCH_TOOL_RISK_LEVELS,
  getBraveSearchToolCategory,
  getBraveSearchToolRiskLevel,
  getBraveSearchCategoryDescription
} from './servers/brave-search'
export {
  MEMORY_MCP_CONFIG,
  MEMORY_TOOL_CATEGORIES,
  MEMORY_TOOL_RISK_LEVELS,
  getMemoryToolCategory,
  getMemoryToolRiskLevel,
  getMemoryCategoryDescription
} from './servers/memory'
export {
  isSecureStorageAvailable,
  saveGitHubToken,
  getGitHubToken,
  getGitHubTokenScopes,
  deleteGitHubToken,
  isGitHubConfigured,
  getGitHubTokenCreatedAt
} from './credentials'
export { generateToolSystemPrompt, generateToolList } from './prompts'
export * from './types'
