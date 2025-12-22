using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArborChat.Models;

namespace ArborChat.Services
{
    public class GeminiService : IAIService
    {
        public string ModelName => "Dummy Gemini";

        public GeminiService(string apiKey)
        {
            // Constructor doesn't need to do anything now
        }

        public async Task<ChatMessage> GetResponseAsync(List<ChatMessage> conversationHistory)
        {
            await Task.Delay(1000); // Simulate network latency
            return new ChatMessage
            {
                Role = "ai",
                Content = "This is a placeholder response from the dummy Gemini service.",
                Timestamp = DateTime.UtcNow
            };
        }
    }
}