# Flutter Project Setup Extension

An advanced VS Code extension that automates Flutter project setup with predefined architecture, packages, and development workflows. Features both interactive UI panels and convenient tree views for enhanced productivity.

## 🚀 Key Features

### **Complete Project Architecture**
- **Smart Template System**: Replaces lib folder with a pre-configured Clean Architecture template from GitHub
- **Automatic Package Management**: Installs 20+ essential Flutter packages with optimized configurations
- **Intelligent Name Resolution**: Auto-detects project name and replaces placeholders throughout the entire codebase
- **VS Code Integration**: Creates comprehensive tasks.json with development, building, and deployment workflows

### **Interactive User Interface**
- **Webview Panel**: Beautiful, responsive interface for accessing all features
- **Tree View Integration**: Dedicated sidebar panel for quick access to tools
- **Status Bar Controls**: One-click access to frequently used commands
- **Command Palette Support**: Full integration with VS Code command system

### **Advanced Feature Generation**
- **Feature Creator**: Generate complete feature modules following Clean Architecture principles
- **UI Template Generator**: Pre-built templates for Login, Profile, and Dynamic List pages  
- **Unit Test Setup**: Automated test file creation with sample test cases
- **Localization Support**: Multi-language setup with JSON-based translation files

### **Development Workflow Tools**
- **Dependency Management**: Smart package installation and conflict resolution
- **Cache Management**: Automated Flutter cache cleaning and repair tools
- **Project Placeholder Replacement**: Bulk find-and-replace for project-specific naming
- **VS Code Window Management**: Automated reload and refresh capabilities

## 📦 Pre-Installed Packages

The extension automatically installs these carefully selected packages:

**State Management & Architecture:**
- `flutter_bloc` - Predictable state management
- `dartz` - Functional programming utilities
- `equatable` - Value equality comparison
- `get_it` - Service locator pattern

**Network & Data:**
- `dio` - Powerful HTTP client
- `pretty_dio_logger` - Network request logging
- `connectivity_plus` - Network connectivity detection
- `shared_preferences` - Local data persistence

**UI & Navigation:**
- `go_router` - Declarative routing
- `flutter_screenutil` - Responsive screen adaptation
- `cached_network_image` - Optimized image loading
- `flutter_svg` - SVG support
- `shimmer` - Loading animations
- `flutter_spinkit` - Loading indicators

**User Experience:**
- `bot_toast` - Elegant toast notifications
- `fluttertoast` - Simple toast messages
- `auto_size_text` - Responsive text sizing
- `percent_indicator` - Progress indicators
- `smooth_page_indicator` - Page view indicators

**Utilities:**
- `url_launcher` - External URL handling
- `file_picker` - File selection dialogs
- `dropdown_button2` - Enhanced dropdown widgets
- `flutter_html` - HTML rendering
- `logger` - Advanced logging system
- `easy_localization` - Internationalization support

## 🎯 How to Use

### **Method 1: Interactive Panel**
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "Show Flutter Setup Panel"
3. Use the interactive buttons for each function

### **Method 2: Tree View**
1. Look for the Flutter icon in the Activity Bar (left sidebar)
2. Click to open the "Flutter Tools" panel
3. Select any tool from the list

### **Method 3: Status Bar**
1. Look for the status bar buttons at the bottom:
   - 🚀 Flutter Setup (opens main panel)
   - 🛠️ Setup Project (runs complete setup)
   - ➕ Create Feature (generates new features)

### **Method 4: Command Palette**
Access individual commands directly:
- `Setup Flutter Project` - Complete project initialization
- `Create Flutter Feature` - Generate feature modules
- `Generate UI Template` - Create UI page templates
- `Setup Unit Tests` - Initialize testing framework
- `Setup Localization` - Configure multi-language support

## 🏗️ What the Extension Does

### **Complete Project Setup Process:**
1. **Template Integration**: Downloads and integrates Clean Architecture template
2. **Package Installation**: Adds all essential packages to pubspec.yaml
3. **Name Resolution**: Replaces all placeholder names with your project name
4. **Configuration Setup**: Creates optimized VS Code tasks and settings
5. **Cache Optimization**: Cleans and refreshes Flutter dependencies

### **Feature Generation:**
- Creates complete feature folders following Clean Architecture
- Generates data, domain, and presentation layers
- Includes models, repositories, use cases, and UI components
- Follows established naming conventions and file structures

### **UI Template System:**
- **Login Page**: Email/password forms with validation
- **Profile Page**: User information display and editing
- **Dynamic List**: Scrollable lists with network data integration

## 🖥️ Cross-Platform Support

**Fully tested and optimized for:**
- macOS (Darwin)
- Linux (Ubuntu, Debian, etc.)
- Windows (PowerShell and Command Prompt)

**Smart platform detection automatically handles:**
- File system operations
- Command execution
- Path resolution
- Package management

## ⚡ Requirements

- **Flutter SDK** (latest stable version recommended)
- **Git** (for template repository cloning)
- **Active Internet Connection** (for initial template download)
- **VS Code** 1.90.0 or higher
- **Open Flutter Project Workspace**

## 🔧 Extension Commands

| Command | Description | Keyboard Shortcut |
|---------|-------------|-------------------|
| `flutter-project-setup.showMainPanel` | Open interactive setup panel | - |
| `flutter-project-setup.setupProject` | Run complete project setup | - |
| `flutter-project-setup.createFeature` | Generate new feature module | - |
| `flutter-project-setup.generateUITemplate` | Create UI page templates | - |
| `flutter-project-setup.setupUnitTests` | Initialize unit testing | - |
| `flutter-project-setup.setupLocalization` | Configure internationalization | - |

## 🎨 Extension Settings

Configure the extension behavior through VS Code settings:

```json
{
  "flutterProjectSetup.defaultPackages": [
    "flutter_bloc",
    "dartz",
    "easy_localization"
  ]
}
```

## ⚠️ Important Notes

- **Backup Recommendation**: The extension will replace your existing `lib` folder. Consider backing up any custom code before running the setup.
- **Network Dependency**: Initial setup requires internet access to clone the template repository.
- **Clean Architecture**: The generated code follows Clean Architecture principles. Familiarity with this pattern is recommended.
- **Package Versions**: The extension installs the latest versions of packages. Review and lock versions as needed for production projects.

## 🐛 Known Issues & Limitations

- **Internet Dependency**: Template download requires active internet connection
- **Existing Code**: May overwrite existing lib folder content without warning
- **Large Projects**: Setup time varies based on project size and internet speed
- **Git Requirements**: Requires Git to be installed and accessible from command line

## 📋 Troubleshooting

### **Common Issues:**

**Extension not visible:** Restart VS Code after installation

**Setup fails:** Ensure Git is installed and internet connection is stable

**Package conflicts:** Use the "Fix Package Dependencies Issues" command

**Permission errors:** Ensure VS Code has write permissions to project folder

### **Debug Steps:**
1. Check VS Code's Developer Console (`Help > Toggle Developer Tools`)
2. Verify Flutter and Git installations
3. Confirm project workspace is properly opened
4. Try running commands individually rather than complete setup

## 🚀 Release Notes

### **1.1.0** - Latest Release
- **New**: Interactive Webview Panel with modern UI
- **New**: Tree View integration in Activity Bar
- **New**: UI Template Generator (Login, Profile, Dynamic List)
- **New**: Unit Test setup automation
- **New**: Localization configuration support
- **Enhanced**: Status bar integration with multiple quick-access buttons
- **Enhanced**: Cross-platform compatibility improvements
- **Enhanced**: Error handling and user feedback
- **Fixed**: Various minor bugs and performance optimizations

### **1.0.3**
- Enhanced package installation reliability
- Improved placeholder replacement algorithm
- Added comprehensive task automation

### **1.0.0**
- Initial stable release
- Basic project setup functionality
- Package installation automation

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

**Repository**: [GitHub Repository](https://github.com/Eldeengawy/flutter-project-setup.git)

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- VS Code team for the excellent extensibility platform
- Clean Architecture community for architectural guidance
- All contributors and users providing feedback

---

**Made with ❤️ for the Flutter community**

*Transform your Flutter development workflow with automated setup, intelligent code generation, and modern development tools.*