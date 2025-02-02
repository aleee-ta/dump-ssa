import * as vscode from 'vscode';
import * as childProcess from 'child_process';

export async function compileWithSSA(): Promise<void> {
    const config = vscode.workspace.getConfiguration('dump-ssa');
    const nargoPath = config.get<string>('nargoPath') || 'nargo';
    const nargoFlags = config.get<string>('nargoFlags') || '';

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return;
    }

    try {
        const workingDirectory = workspaceFolder.uri.fsPath;
        const command = `${nargoPath} compile --dump-ssa ${nargoFlags}`;
        vscode.window.showInformationMessage(`Running: ${command}`);
        await executeCommand(command, workingDirectory);
        vscode.window.showInformationMessage("Compilation completed successfully.");
    } catch (error) {
        vscode.window.showErrorMessage(`Error during compilation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

async function executeCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Command failed: ${stderr || error.message}`);
                return reject(error);
            }
            if (stdout.trim()) {
                console.log(stdout);
            }
            resolve();
        });
    });
}