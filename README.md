# Flutter Project Setup Extension

Automates Flutter project setup with predefined tasks and configurations.

## Features

- **Complete Project Setup**: Replaces lib folder with a pre-configured template from GitHub
- **Automatic Package Installation**: Installs essential Flutter packages automatically
- **Smart Name Replacement**: Auto-detects project name and replaces placeholders throughout the codebase
- **VS Code Integration**: Adds tasks.json with useful Flutter development tasks
- **Cross-Platform Support**: Works on macOS, Linux, and Windows

## Usage

1. Open a Flutter project in VS Code
2. Use Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Type "Setup Flutter Project" and press Enter
4. Or click the "🔧 Setup Flutter Project" button in the status bar

The extension will:
- Replace your `lib` folder with a template from [setup_project repository](https://github.com/Eldeengawy/setup_project.git)
- Install essential Flutter packages (flutter_bloc, dio, go_router, etc.)
- Replace placeholder names with your actual project name
- Set up VS Code tasks for future development

## Installed Packages

- `flutter_bloc` - State management
- `dartz` - Functional programming utilities
- `dio` - HTTP client
- `go_router` - Navigation
- `shared_preferences` - Local storage
- `flutter_screenutil` - Screen adaptation
- `cached_network_image` - Image caching
- And many more useful packages...

## Requirements

- Flutter SDK
- Git
- An open Flutter project workspace

## Extension Settings

This extension contributes the following commands:

- `flutter-project-setup.setupProject`: Setup Flutter Project

## Known Issues

- Requires active internet connection for cloning template repository
- May overwrite existing lib folder content

## Release Notes

### 0.0.1

Initial release with basic project setup functionality.

## Contributing

Issues and feature requests are welcome!

## License

MIT
