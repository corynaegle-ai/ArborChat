// src/main/mcp/credentials.ts

import { safeStorage, app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const CREDENTIALS_FILE = 'mcp-credentials.enc'

interface MCPCredentials {
  github?: {
    personalAccessToken: string
    tokenScopes?: string[]
    createdAt: string
  }
  ssh?: {
    host: string
    port: number
    username: string
    authType: 'password' | 'key'
    password?: string
    keyPath?: string
    createdAt: string
  }
}

/**
 * Check if the system supports secure storage
 */
export function isSecureStorageAvailable(): boolean {
  return safeStorage.isEncryptionAvailable()
}

/**
 * Get the credentials file path
 */
function getCredentialsPath(): string {
  return path.join(app.getPath('userData'), CREDENTIALS_FILE)
}

/**
 * Load credentials from encrypted storage
 */
async function loadCredentials(): Promise<MCPCredentials> {
  const credPath = getCredentialsPath()

  if (!fs.existsSync(credPath)) {
    return {}
  }

  try {
    const encryptedData = fs.readFileSync(credPath)
    const decryptedString = safeStorage.decryptString(encryptedData)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('[Credentials] Failed to load:', error)
    return {}
  }
}

/**
 * Save credentials to encrypted storage
 */
async function saveCredentials(credentials: MCPCredentials): Promise<void> {
  const credPath = getCredentialsPath()
  const jsonString = JSON.stringify(credentials)
  const encryptedBuffer = safeStorage.encryptString(jsonString)
  fs.writeFileSync(credPath, encryptedBuffer)
  console.log('[Credentials] Saved to', credPath)
}

/**
 * Save GitHub PAT securely
 * @param token - The GitHub Personal Access Token
 * @param scopes - Optional array of scopes the token has
 */
export async function saveGitHubToken(token: string, scopes?: string[]): Promise<void> {
  if (!isSecureStorageAvailable()) {
    throw new Error('Secure storage is not available on this system')
  }

  const credentials = await loadCredentials()

  credentials.github = {
    personalAccessToken: token,
    tokenScopes: scopes,
    createdAt: new Date().toISOString()
  }

  await saveCredentials(credentials)
  console.log('[Credentials] GitHub token saved securely')
}

/**
 * Retrieve GitHub PAT
 * @returns The stored token or null if not configured
 */
export async function getGitHubToken(): Promise<string | null> {
  const credentials = await loadCredentials()
  return credentials.github?.personalAccessToken || null
}

/**
 * Get GitHub token scopes (if stored)
 * @returns The stored scopes or undefined
 */
export async function getGitHubTokenScopes(): Promise<string[] | undefined> {
  const credentials = await loadCredentials()
  return credentials.github?.tokenScopes
}

/**
 * Delete GitHub credentials
 */
export async function deleteGitHubToken(): Promise<void> {
  const credentials = await loadCredentials()
  delete credentials.github
  await saveCredentials(credentials)
  console.log('[Credentials] GitHub token deleted')
}

/**
 * Check if GitHub is configured
 * @returns True if a GitHub token is stored
 */
export async function isGitHubConfigured(): Promise<boolean> {
  const token = await getGitHubToken()
  return token !== null && token.length > 0
}

/**
 * Get the creation date of the stored GitHub token
 * @returns ISO date string or undefined if not configured
 */
export async function getGitHubTokenCreatedAt(): Promise<string | undefined> {
  const credentials = await loadCredentials()
  return credentials.github?.createdAt
}

// =====================
// SSH Credential Functions
// =====================

export interface SSHCredentials {
  host: string
  port: number
  username: string
  authType: 'password' | 'key'
  password?: string
  keyPath?: string
}

/**
 * Save SSH credentials securely
 */
export async function saveSSHCredentials(creds: SSHCredentials): Promise<void> {
  if (!isSecureStorageAvailable()) {
    throw new Error('Secure storage is not available on this system')
  }

  const credentials = await loadCredentials()

  credentials.ssh = {
    ...creds,
    createdAt: new Date().toISOString()
  }

  await saveCredentials(credentials)
  console.log('[Credentials] SSH credentials saved securely')
}

/**
 * Retrieve SSH credentials
 * @returns The stored SSH credentials or null if not configured
 */
export async function getSSHCredentials(): Promise<SSHCredentials | null> {
  const credentials = await loadCredentials()
  if (!credentials.ssh) return null

  return {
    host: credentials.ssh.host,
    port: credentials.ssh.port,
    username: credentials.ssh.username,
    authType: credentials.ssh.authType,
    password: credentials.ssh.password,
    keyPath: credentials.ssh.keyPath
  }
}

/**
 * Delete SSH credentials
 */
export async function deleteSSHCredentials(): Promise<void> {
  const credentials = await loadCredentials()
  delete credentials.ssh
  await saveCredentials(credentials)
  console.log('[Credentials] SSH credentials deleted')
}

/**
 * Check if SSH is configured
 * @returns True if SSH credentials are stored
 */
export async function isSSHConfigured(): Promise<boolean> {
  const creds = await getSSHCredentials()
  return creds !== null
}

/**
 * Get the creation date of the stored SSH credentials
 * @returns ISO date string or undefined if not configured
 */
export async function getSSHCredentialsCreatedAt(): Promise<string | undefined> {
  const credentials = await loadCredentials()
  return credentials.ssh?.createdAt
}
