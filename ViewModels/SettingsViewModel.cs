using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ArborChat.Models;
using ArborChat.Services;
using System.Threading.Tasks;
using System.Windows.Input;

namespace ArborChat.ViewModels
{
    public partial class SettingsViewModel : ObservableObject
    {
        private readonly DatabaseService _databaseService;

        [ObservableProperty]
        private string _openAIKey;

        [ObservableProperty]
        private string _geminiKey;

        [ObservableProperty]
        private string _selectedAIModel;

        public ICommand SaveSettingsCommand { get; }

        public SettingsViewModel(DatabaseService databaseService)
        {
            _databaseService = databaseService;
            SaveSettingsCommand = new AsyncRelayCommand(SaveSettings);
            LoadSettings();
        }

        private async void LoadSettings()
        {
            var settings = await _databaseService.GetSettingsAsync();
            if (settings != null)
            {
                OpenAIKey = settings.OpenAIKey;
                GeminiKey = settings.GeminiKey;
                SelectedAIModel = settings.SelectedAIModel;
            }
        }

        private async Task SaveSettings()
        {
            var settings = await _databaseService.GetSettingsAsync();
            if (settings == null)
            {
                settings = new Settings();
            }

            settings.OpenAIKey = OpenAIKey;
            settings.GeminiKey = GeminiKey;
            settings.SelectedAIModel = SelectedAIModel;

            await _databaseService.SaveSettingsAsync(settings);
            // Optionally, provide user feedback (e.g., a toast message)
            await Shell.Current.DisplayAlert("Settings Saved", "Your API keys and selected model have been saved.", "OK");
        }
    }
}
