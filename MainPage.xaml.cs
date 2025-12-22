using ArborChat.ViewModels; // Added for MainViewModel
using System.Collections.Specialized; // Added for NotifyCollectionChangedEventHandler
using System.Linq; // Added for LastOrDefault()

namespace ArborChat;

public partial class MainPage : ContentPage
{
    private MainViewModel _viewModel => BindingContext as MainViewModel;

	public MainPage(MainViewModel viewModel) // Injected MainViewModel
	{
		InitializeComponent();
        BindingContext = viewModel; // Set BindingContext

        // Subscribe to collection changed events for auto-scrolling
        _viewModel.CurrentChatMessages.CollectionChanged += OnCurrentChatMessagesCollectionChanged;
        _viewModel.CurrentThreadMessages.CollectionChanged += OnCurrentThreadMessagesCollectionChanged;
	}

    private void OnCurrentChatMessagesCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.Action == NotifyCollectionChangedAction.Add)
        {
            MainChatCollectionView.ScrollTo(_viewModel.CurrentChatMessages.LastOrDefault(), null, ScrollToPosition.End, false);
        }
    }

    private void OnCurrentThreadMessagesCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.Action == NotifyCollectionChangedAction.Add)
        {
            ThreadChatCollectionView.ScrollTo(_viewModel.CurrentThreadMessages.LastOrDefault(), null, ScrollToPosition.End, false);
        }
    }


    private async void OnSettingsClicked(object? sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//Views/SettingsPage"); // Using Shell navigation
    }
}
