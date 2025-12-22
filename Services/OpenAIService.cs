using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArborChat.Models;

namespace ArborChat.Services
{
    public class OpenAIService : IAIService
    {
        public string ModelName => "Dummy OpenAI";

        public OpenAIService(string apiKey)
        {
            // Constructor doesn't need to do anything now
        }

        public async Task<ChatMessage> GetResponseAsync(List<ChatMessage> conversationHistory)
        {
            await Task.Delay(1000); // Simulate network latency
            return new ChatMessage
            {
                Role = "ai",
                Content = "This is a placeholder response from the dummy OpenAI service.",
                Timestamp = DateTime.UtcNow
            };
        }
    }
}