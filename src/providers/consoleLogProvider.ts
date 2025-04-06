import * as vscode from 'vscode';
import { ConsoleLogManager } from '../utils/consoleLogManager';

export class ConsoleLogItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly filePath?: string,
        public readonly lineNumber?: number,
        public readonly logContent?: string,
        public readonly isCommented?: boolean,
        public readonly isFile: boolean = false,
        public readonly children?: ConsoleLogItem[]
    ) {
        super(label, collapsibleState);

        if (isFile) {
            // This is a file node
            this.contextValue = 'file';
            this.iconPath = new vscode.ThemeIcon('file');
        } else if (filePath && lineNumber) {
            // This is a log entry node
            this.tooltip = `Click to toggle console.log`;
            this.description = logContent;
            this.iconPath = new vscode.ThemeIcon(
                isCommented ? 'circle-outline' : 'circle-filled'
            );
            this.command = {
                command: 'console-log-manager.toggleLog',
                title: 'Toggle Console Log',
                arguments: [this]
            };
            this.contextValue = 'consoleLog';
        }
    }
}

export class ConsoleLogProvider implements vscode.TreeDataProvider<ConsoleLogItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ConsoleLogItem | undefined | null | void> = new vscode.EventEmitter<ConsoleLogItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ConsoleLogItem | undefined | null | void> = this._onDidChangeTreeData.event;
    private fileNodes: Map<string, ConsoleLogItem> = new Map();

    constructor(private consoleLogManager: ConsoleLogManager) {}

    refresh(): void {
        this.fileNodes.clear();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ConsoleLogItem): ConsoleLogItem {
        return element;
    }

    async getChildren(element?: ConsoleLogItem): Promise<ConsoleLogItem[]> {
        if (element) {
            // If it's a file node, return its log entries
            if (element.contextValue === 'file') {
                return element.children || [];
            }
            return [];
        }

        // Root level - show files
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
            const relativePath = vscode.workspace.asRelativePath(filePath);
            const logItems = fileLogs.map(log => new ConsoleLogItem(
                `Line ${log.lineNumber}: ${log.content}`,
                vscode.TreeItemCollapsibleState.None,
                filePath,
                log.lineNumber,
                log.content,
                log.isCommented
            ));

            const fileItem = new ConsoleLogItem(
                relativePath,
                vscode.TreeItemCollapsibleState.Expanded,
                filePath,
                undefined,
                undefined,
                undefined,
                true,
                logItems
            );

            this.fileNodes.set(filePath, fileItem);
            items.push(fileItem);
        }

        return items;
    }
} 