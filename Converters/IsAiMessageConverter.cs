using System;
using System.Globalization;
using Microsoft.Maui.Controls;

namespace ArborChat.Converters
{
    public class IsAiMessageConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is string role)
            {
                return role.ToLowerInvariant() == "ai" || role.ToLowerInvariant() == "model"; // "model" for Gemini
            }
            return false;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
