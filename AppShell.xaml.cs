namespace ArborChat;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();
        Routing.RegisterRoute("Views/SettingsPage", typeof(Views.SettingsPage)); // Added
	}
}
