import * as vscode from 'vscode';
import { select2SSAfile } from './select_ssa';

export async function getSSADiff(): Promise<void> {
    const files = await select2SSAfile();
    if (!files) {
        return;
    }
    try {
        const firstFileUri = vscode.Uri.file(files.file1);
        const secondFileUri = vscode.Uri.file(files.file2);

        await vscode.commands.executeCommand('vscode.diff', firstFileUri, secondFileUri, "SSA File Comparison");
        vscode.window.showInformationMessage("Diff view opened successfully.");
    } catch (error) {
        vscode.window.showErrorMessage(`Error opening diff view: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    return;
}