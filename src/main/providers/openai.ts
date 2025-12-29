// src/main/providers/openai.ts

import OpenAI from 'openai'
import { AIProvider } from './base'
import { AIModel, StreamParams } from './types'

/**
 * Available OpenAI models (direct API)
 * These are the primary models users would want access to
 */
const OPENAI_MODELS: AIModel[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'Latest flagship model with superior reasoning',
    provider: 'openai',
    isLocal: false
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'Fast & cost-effective for most tasks',
    provider: 'openai',
    isLocal: false
  },
  {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    description: 'Fastest and most affordable model',
    provider: 'openai',
    isLocal: false
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Most advanced reasoning model',
    provider: 'openai',
    isLocal: false
  },
  {
    id: 'o3-mini',
    name: 'o3 Mini',
    description: 'Fast reasoning model',
    provider: 'openai',
    isLocal: false
  },
  {
    id: 'o4-mini',
    name: 'o4 Mini',
    description: 'Latest efficient reasoning model',
    provider: 'openai',
    isLocal: false
  }
]

/**
 * OpenAI Direct API Provider implementation
 * Provides access to OpenAI models via their official API
 */
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'

  /**
   * Check if this provider can handle the given model
   * Matches gpt-*, o1*, o3*, o4* patterns but NOT github: prefixed models
   */
  canHandleModel(modelId: string): boolean {
    // Don't handle GitHub-proxied models
    if (modelId.startsWith('github:')) {
      return false
    }
    
    // Match OpenAI model patterns
    return (
      OPENAI_MODELS.some((m) => m.id === modelId) ||
      modelId.startsWith('gpt-') ||
      modelId.startsWith('o1') ||
      modelId.startsWith('o3') ||
      modelId.startsWith('o4')
    )
  }

  /**
   * Validate connection with OpenAI API
   */
  async validateConnection(apiKey?: string): Promise<boolean> {
    if (!apiKey) {
      console.error('[OpenAI] No API key provided')
      return false
    }

    console.log('[OpenAI] validateConnection called')

    try {
      const client = new OpenAI({ apiKey })

      // Use a minimal API call to validate
      await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })

      console.log('[OpenAI] Validation successful!')
      return true
    } catch (error: unknown) {
      console.error('[OpenAI] validateConnection ERROR:', error)
      return false
    }
  }


  /**
   * Get available OpenAI models
   */
  async getAvailableModels(_apiKey?: string): Promise<AIModel[]> {
    // Return static list of primary models
    // Could be enhanced to fetch from API in the future
    return OPENAI_MODELS
  }

  /**
   * Stream response from OpenAI API
   */
  async streamResponse(params: StreamParams, apiKey?: string): Promise<void> {
    if (!apiKey) {
      throw new Error('API key is required for OpenAI provider')
    }

    const { window, messages, modelId } = params

    console.log('[OpenAI] streamResponse called')
    console.log('[OpenAI] Using model:', modelId)
    console.log('[OpenAI] Total messages received:', messages.length)

    try {
      const client = new OpenAI({ apiKey })

      // Extract system message for logging
      const systemMessage = messages.find((m) => m.role === 'system')
      if (systemMessage) {
        console.log('[OpenAI] System instruction: Present')
        console.log('[OpenAI] System instruction length:', systemMessage.content.length)
      }

      // Convert messages to OpenAI format
      const openaiMessages = messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      }))

      console.log('[OpenAI] Conversation messages:', openaiMessages.length)

      // Stream the response
      const stream = await client.chat.completions.create({
        model: modelId,
        max_tokens: 8192,
        messages: openaiMessages,
        stream: true
      })

      console.log('[OpenAI] Stream started, awaiting chunks...')
      let chunkCount = 0
      let fullResponse = ''

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          chunkCount++
          fullResponse += delta
          window.webContents.send('ai:token', delta)
        }
      }

      console.log('[OpenAI] Stream complete. Total chunks:', chunkCount)
      console.log('[OpenAI] Full response preview:', fullResponse.substring(0, 500))

      // Check for tool_use pattern
      if (fullResponse.includes('```tool_use')) {
        console.log('[OpenAI] ✅ Tool use block detected in response!')
      } else {
        console.log('[OpenAI] ❌ No tool_use block in response')
      }

      window.webContents.send('ai:done')
    } catch (error: unknown) {
      console.error('[OpenAI] streamResponse ERROR:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      window.webContents.send('ai:error', errorMessage)
      throw error
    }
  }
}
