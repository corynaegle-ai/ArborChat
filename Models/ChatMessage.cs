using SQLite;
using System;

namespace ArborChat.Models
{
    public class ChatMessage
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int SessionId { get; set; } // Foreign key to ChatSession
        public int? ParentMessageId { get; set; } // For threading, nullable
        public string Role { get; set; } = "user"; // "user" or "ai"
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsThreadMessage => ParentMessageId.HasValue;
    }
}
