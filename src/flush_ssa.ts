import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function flushSSALogs(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return;
    }

    const logDirPath = path.join(workspaceFolder.uri.fsPath, 'target', 'log');

    try {
        if (!fs.existsSync(logDirPath)) {
            vscode.window.showInformationMessage("Logs directory does not exist.");
            return;
        }

        const confirm = await vscode.window.showWarningMessage(
            "Are you sure you want to delete all files in the logs directory?",
            { modal: true },
            "Yes",
            "Cancel"
        );

        if (confirm !== "Yes") {
            vscode.window.showInformationMessage("Operation cancelled.");
            return;
        }

        await clearDirectory(logDirPath);

        vscode.window.showInformationMessage("Logs directory has been successfully flushed.");
    } catch (error) {
        vscode.window.showErrorMessage(`Error flushing logs: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

async function clearDirectory(dirPath: string): Promise<void> {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            await removeDirectory(fullPath);
        } else {
            await fs.promises.unlink(fullPath);
        }
    }
}

async function removeDirectory(dirPath: string): Promise<void> {
    await clearDirectory(dirPath);
    await fs.promises.rmdir(dirPath);
}

