// src/main/mcp/servers/brave-search.ts

import { MCPServerConfig } from '../types'

/**
 * Brave Search MCP Server Configuration
 *
 * Provides web search capabilities powered by Brave Search API.
 * Enables AI to access current information and perform research.
 *
 * Note: The @modelcontextprotocol/server-brave-search package is deprecated.
 * Consider using @modelcontextprotocol/server-fetch for web content access
 * or implementing a custom search solution.
 */
export const BRAVE_SEARCH_MCP_CONFIG: MCPServerConfig = {
  name: 'brave-search',
  // Uses npx to run without requiring global install
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-brave-search'],
  enabled: false, // Disabled by default until API key is configured
  env: {
    // API key will be injected from secure credential storage at runtime
    // BRAVE_API_KEY: '' // Set dynamically
  }
}

/**
 * Tool categories for UI grouping and filtering
 */
export const BRAVE_SEARCH_TOOL_CATEGORIES: Record<string, string[]> = {
  webSearch: ['brave_web_search', 'brave_local_search']
}

/**
 * Risk levels for Brave Search tools
 *
 * All search operations are read-only and safe
 */
export const BRAVE_SEARCH_TOOL_RISK_LEVELS: Record<string, 'safe' | 'moderate' | 'dangerous'> = {
  // Safe - all search operations are read-only
  brave_web_search: 'safe',
  brave_local_search: 'safe'
}

/**
 * Get the category for a Brave Search tool
 */
export function getBraveSearchToolCategory(toolName: string): string | undefined {
  for (const [category, tools] of Object.entries(BRAVE_SEARCH_TOOL_CATEGORIES)) {
    if (tools.includes(toolName)) {
      return category
    }
  }
  return undefined
}

/**
 * Get the risk level for a Brave Search tool (defaults to 'safe' if unknown)
 */
export function getBraveSearchToolRiskLevel(toolName: string): 'safe' | 'moderate' | 'dangerous' {
  return BRAVE_SEARCH_TOOL_RISK_LEVELS[toolName] || 'safe'
}

/**
 * Get human-readable description for a Brave Search tool category
 */
export function getBraveSearchCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    webSearch: 'Web Search'
  }
  return descriptions[category] || category
}
