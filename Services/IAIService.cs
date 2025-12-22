using System.Threading.Tasks;
using System.Collections.Generic;
using ArborChat.Models; // Assuming ChatMessage is relevant for AI services

namespace ArborChat.Services
{
    public interface IAIService
    {
        string ModelName { get; }
        Task<ChatMessage> GetResponseAsync(List<ChatMessage> conversationHistory);
        // Potentially add a method for streaming responses or other AI specific functionalities
    }
}
