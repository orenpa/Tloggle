import * as vscode from 'vscode';
import { ConsoleLogProvider } from './providers/consoleLogProvider';
import { ConsoleLogManager } from './utils/consoleLogManager';

export function activate(context: vscode.ExtensionContext) {
    // Create instances of our main classes
    const consoleLogManager = new ConsoleLogManager();
    const consoleLogProvider = new ConsoleLogProvider(consoleLogManager);

    // Register the TreeDataProvider
    vscode.window.registerTreeDataProvider('consoleLogs', consoleLogProvider);

    // Register commands
    let refreshCommand = vscode.commands.registerCommand('console-log-manager.refresh', () => {
        consoleLogProvider.refresh();
    });

    let toggleCommand = vscode.commands.registerCommand('console-log-manager.toggleLog', async (logItem) => {
        if (logItem) {
            await consoleLogManager.toggleLog(logItem);
            consoleLogProvider.refresh();
        }
    });

    // Add subscriptions
    context.subscriptions.push(refreshCommand);
    context.subscriptions.push(toggleCommand);

    // Initial scan
    consoleLogProvider.refresh();
}

export function deactivate() {} 