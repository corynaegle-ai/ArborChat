// src/main/mcp/servers/filesystem.ts

import { MCPServerConfig } from '../types'
import { app } from 'electron'
import { join } from 'path'

/**
 * Filesystem MCP Server Configuration
 *
 * Provides secure file system access with configurable allowed directories.
 * Enables AI to read, write, search, and list files within permitted paths.
 */
export const FILESYSTEM_MCP_CONFIG: MCPServerConfig = {
  name: 'filesystem',
  // Uses npx to run without requiring global install
  command: 'npx',
  args: [
    '-y',
    '@modelcontextprotocol/server-filesystem',
    // Default to user's Documents folder - will be updated via config
    join(app.getPath('documents'), 'ArborChat')
  ],
  enabled: false, // Disabled by default until user configures directory
  env: {}
}

/**
 * Tool categories for UI grouping and filtering
 */
export const FILESYSTEM_TOOL_CATEGORIES: Record<string, string[]> = {
  read: ['read_file', 'read_multiple_files', 'get_file_info'],
  write: ['write_file', 'edit_file', 'create_directory'],
  search: ['search_files', 'list_directory', 'list_allowed_directories'],
  management: ['move_file', 'directory_tree']
}

/**
 * Risk levels for each Filesystem tool
 *
 * - safe: Read-only operations, no side effects
 * - moderate: Write operations in allowed directories
 * - dangerous: Move/delete operations
 */
export const FILESYSTEM_TOOL_RISK_LEVELS: Record<string, 'safe' | 'moderate' | 'dangerous'> = {
  // Safe - read-only operations
  read_file: 'safe',
  read_multiple_files: 'safe',
  get_file_info: 'safe',
  list_directory: 'safe',
  list_allowed_directories: 'safe',
  search_files: 'safe',
  directory_tree: 'safe',

  // Moderate - write operations in allowed directories
  write_file: 'moderate',
  edit_file: 'moderate',
  create_directory: 'moderate',

  // Dangerous - move/rename operations
  move_file: 'dangerous'
}

/**
 * Get the category for a filesystem tool
 */
export function getFilesystemToolCategory(toolName: string): string | undefined {
  for (const [category, tools] of Object.entries(FILESYSTEM_TOOL_CATEGORIES)) {
    if (tools.includes(toolName)) {
      return category
    }
  }
  return undefined
}

/**
 * Get the risk level for a filesystem tool (defaults to 'moderate' if unknown)
 */
export function getFilesystemToolRiskLevel(toolName: string): 'safe' | 'moderate' | 'dangerous' {
  return FILESYSTEM_TOOL_RISK_LEVELS[toolName] || 'moderate'
}

/**
 * Get human-readable description for a filesystem tool category
 */
export function getFilesystemCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    read: 'File Reading',
    write: 'File Writing',
    search: 'File Search & Discovery',
    management: 'File Management'
  }
  return descriptions[category] || category
}

/**
 * Update the allowed directory in the config
 */
export function updateFilesystemAllowedDirectory(directory: string): MCPServerConfig {
  return {
    ...FILESYSTEM_MCP_CONFIG,
    args: ['-y', '@modelcontextprotocol/server-filesystem', directory]
  }
}
