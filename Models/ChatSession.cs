using SQLite;
using System;
using System.Collections.Generic;

namespace ArborChat.Models
{
    public class ChatSession
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Title { get; set; } = "New Chat";
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
    }
}
