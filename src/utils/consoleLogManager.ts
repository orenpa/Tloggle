import * as vscode from 'vscode';
import * as fs from 'fs/promises';

interface ConsoleLog {
    filePath: string;
    lineNumber: number;
    content: string;
    isCommented: boolean;
}

export class ConsoleLogManager {
    private supportedExtensions = ['.js', '.ts', '.jsx', '.tsx'];

    async scanForConsoleLogs(): Promise<ConsoleLog[]> {
        const logs: ConsoleLog[] = [];
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            return logs;
        }

        for (const folder of workspaceFolders) {
            const files = await vscode.workspace.findFiles(
                `**/*.{js,ts,jsx,tsx}`,
                '**/node_modules/**'
            );

            for (const file of files) {
                try {
                    const content = await fs.readFile(file.fsPath, 'utf-8');
                    const lines = content.split('\n');

                    lines.forEach((line, index) => {
                        if (line.includes('console.log') || 
                            line.includes('console.error') || 
                            line.includes('console.warn')) {
                            const isCommented = this.isLineCommented(line);
                            logs.push({
                                filePath: file.fsPath,
                                lineNumber: index + 1,
                                content: line.trim(),
                                isCommented
                            });
                        }
                    });
                } catch (error) {
                    console.error(`Error parsing ${file.fsPath}:`, error);
                }
            }
        }

        return logs;
    }

    private isLineCommented(line: string): boolean {
        const trimmedLine = line.trim();
        return trimmedLine.startsWith('//') || trimmedLine.startsWith('/*');
    }

    async toggleLog(logItem: { filePath: string; lineNumber: number }): Promise<void> {
        try {
            const content = await fs.readFile(logItem.filePath, 'utf-8');
            const lines = content.split('\n');
            const lineIndex = logItem.lineNumber - 1;
            const currentLine = lines[lineIndex];

            if (this.isLineCommented(currentLine)) {
                // Uncomment the line
                lines[lineIndex] = currentLine.replace(/^(\s*)(\/\/\s*|\/\*\s*|\*\s*)/, '$1');
            } else {
                // Comment the line
                lines[lineIndex] = currentLine.replace(/^(\s*)/, '$1// ');
            }

            await fs.writeFile(logItem.filePath, lines.join('\n'), 'utf-8');
        } catch (error) {
            console.error('Error toggling console log:', error);
            throw error;
        }
    }
} 