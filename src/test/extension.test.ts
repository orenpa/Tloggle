import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConsoleLogManager } from '../utils/consoleLogManager';

suite('Console Log Manager Extension Test Suite', () => {
    test('ConsoleLogManager.isLineCommented should correctly identify commented lines', async () => {
        const manager = new ConsoleLogManager();
        
        // Access private method for testing
        const isLineCommented = (manager as any).isLineCommented.bind(manager);
        
        assert.strictEqual(isLineCommented('// console.log("test")'), true);
        assert.strictEqual(isLineCommented('/* console.log("test") */'), true);
        assert.strictEqual(isLineCommented('console.log("test")'), false);
        assert.strictEqual(isLineCommented('    // console.log("test")'), true);
        assert.strictEqual(isLineCommented('    console.log("test")'), false);
    });

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('console-log-manager'));
    });

    test('Activation', async () => {
        const ext = vscode.extensions.getExtension('console-log-manager');
        await ext?.activate();
        assert.ok(true);
    });
}); 