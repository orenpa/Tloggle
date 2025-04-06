# Console Log Manager

A Visual Studio Code extension that helps you manage `console.log` statements in your JavaScript/TypeScript projects.

## Features

- 🔍 **Scan Project**: Automatically finds all console.log statements in your project
- 📝 **Easy Navigation**: Click on any log to jump directly to its location in the code
- 🔄 **Toggle Logs**: Quickly comment/uncomment console logs with a single click
- 🎯 **Smart Detection**: Uses AST parsing to accurately find console logs (no regex!)
- 🚫 **Ignore Comments**: Automatically detects and marks commented logs
- 📁 **File Organization**: Groups logs by file for easy navigation

## Installation

1. Open VS Code
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS)
3. Type `ext install console-log-manager`
4. Press Enter

## Usage

1. Open the Console Logs panel in the Activity Bar
2. Click the refresh button to scan for console logs
3. Click on any log to jump to its location
4. Use the toggle button (👁️) to comment/uncomment logs

### Supported File Types

- JavaScript (.js)
- TypeScript (.ts)
- React JSX (.jsx)
- React TSX (.tsx)

### Commands

- `Console Log Manager: Refresh` - Rescan project for console logs
- `Console Log Manager: Toggle Log` - Comment/uncomment the selected log

## Requirements

- Visual Studio Code version 1.85.0 or higher

## Extension Settings

This extension contributes the following settings:

* None currently (future versions will add customization options)

## Known Issues

- Large projects may take a moment to scan
- Some complex template literal logs might not be detected
- Multi-line console logs are currently shown on a single line

## Release Notes

### 0.1.0

Initial release of Console Log Manager:
- Basic console.log detection
- Toggle functionality
- File navigation
- Tree view organization

## Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/yourusername/console-log-manager).

## License

This extension is licensed under the MIT License.
