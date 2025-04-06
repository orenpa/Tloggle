import * as vscode from 'vscode';
import { ConsoleLogProvider } from './providers/consoleLogProvider';
import { ConsoleLogManager } from './utils/consoleLogManager';

export function activate(context: vscode.ExtensionContext) {
    // Create instances of our main classes
    const consoleLogManager = new ConsoleLogManager();
    const consoleLogProvider = new ConsoleLogProvider(consoleLogManager);

    // Register the TreeDataProvider and get TreeView instance
    const treeView = vscode.window.createTreeView('consoleLogs', {
        treeDataProvider: consoleLogProvider,
        canSelectMany: false
    });

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

    let collapseAllCommand = vscode.commands.registerCommand('console-log-manager.collapseAll', () => {
        vscode.commands.executeCommand('workbench.actions.treeView.consoleLogs.collapseAll');
    });

    let expandAllCommand = vscode.commands.registerCommand('console-log-manager.expandAll', async () => {
        // First refresh to ensure we have all items
        await consoleLogProvider.refresh();
        
        // Get all items
        const items = await consoleLogProvider.getChildren();
        
        // Expand each item without changing the selection
        for (const item of items) {
            await treeView.reveal(item, {
                expand: true,
                focus: false,
                select: false
            });
        }
    });

    let showAllCommand = vscode.commands.registerCommand('console-log-manager.showAll', async () => {
        await consoleLogProvider.toggleAllLogs(false);
    });

    let hideAllCommand = vscode.commands.registerCommand('console-log-manager.hideAll', async () => {
        await consoleLogProvider.toggleAllLogs(true);
    });

    // Add subscriptions
    context.subscriptions.push(
        refreshCommand,
        toggleCommand,
        collapseAllCommand,
        expandAllCommand,
        showAllCommand,
        hideAllCommand,
        treeView
    );

    // Initial scan
    consoleLogProvider.refresh();
}

export function deactivate() {} 