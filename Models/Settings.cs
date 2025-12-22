using SQLite;

namespace ArborChat.Models
{
    public class Settings
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string OpenAIKey { get; set; }
        public string GeminiKey { get; set; }
        public string SelectedAIModel { get; set; } // e.g., "ChatGPT", "Gemini"
    }
}
