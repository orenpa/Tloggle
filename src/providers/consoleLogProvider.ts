import * as vscode from 'vscode';
import { ConsoleLogManager } from '../utils/consoleLogManager';

export class ConsoleLogItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly filePath?: string,
        public readonly lineNumber?: number,
        public readonly logContent?: string,
        public readonly isCommented?: boolean
    ) {
        super(label, collapsibleState);

        if (filePath && lineNumber) {
            this.tooltip = `Click to toggle console.log`;
            this.description = logContent;
            
            // Set icon to match VSCode's breakpoint style
            this.iconPath = new vscode.ThemeIcon(
                isCommented ? 'circle-outline' : 'circle-filled'
            );

            // Make the item clickable for toggling
            this.command = {
                command: 'console-log-manager.toggleLog',
                title: 'Toggle Console Log',
                arguments: [this]
            };

            // Set context value for when-clause in package.json
            this.contextValue = 'consoleLog';
        }
    }
}

export class ConsoleLogProvider implements vscode.TreeDataProvider<ConsoleLogItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ConsoleLogItem | undefined | null | void> = new vscode.EventEmitter<ConsoleLogItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ConsoleLogItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private consoleLogManager: ConsoleLogManager) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ConsoleLogItem): ConsoleLogItem {
        return element;
    }

    async getChildren(element?: ConsoleLogItem): Promise<ConsoleLogItem[]> {
        if (element) {
            return []; // No nested items for now
        }

        const logs = await this.consoleLogManager.scanForConsoleLogs();
        const fileGroups = new Map<string, Array<{ lineNumber: number; content: string; isCommented: boolean }>>();

        // Group logs by file
        for (const log of logs) {
            if (!fileGroups.has(log.filePath)) {
                fileGroups.set(log.filePath, []);
            }
            fileGroups.get(log.filePath)?.push({
                lineNumber: log.lineNumber,
                content: log.content,
                isCommented: log.isCommented
            });
        }

        const items: ConsoleLogItem[] = [];

        // Create tree items
        for (const [filePath, fileLogs] of fileGroups) {
            // Add file as parent
            const fileItem = new ConsoleLogItem(
                vscode.workspace.asRelativePath(filePath),
                vscode.TreeItemCollapsibleState.Expanded,
                filePath
            );
            items.push(fileItem);

            // Add logs as children
            for (const log of fileLogs) {
                const logItem = new ConsoleLogItem(
                    `Line ${log.lineNumber}: ${log.content}`,
                    vscode.TreeItemCollapsibleState.None,
                    filePath,
                    log.lineNumber,
                    log.content,
                    log.isCommented
                );
                items.push(logItem);
            }
        }

        return items;
    }
} 