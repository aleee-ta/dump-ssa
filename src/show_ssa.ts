import * as vscode from 'vscode';
import { select1SSAfile  } from './select_ssa';

export async function showSSA(): Promise<void> {
    const selectedFile = await select1SSAfile();
    if (!selectedFile) {
        vscode.window.showErrorMessage("No SSA file selected.");
        return;
    }
    const selectedSSAPath = selectedFile;

    try {
        const fileUri = vscode.Uri.file(selectedSSAPath);

        const document = await vscode.workspace.openTextDocument(fileUri);

        const editor = await vscode.window.showTextDocument(document, {
            viewColumn: vscode.ViewColumn.Beside,
            preview: false,
            preserveFocus: false
        });

        vscode.window.showInformationMessage("SSA file opened.");
    } catch (error) {
        vscode.window.showErrorMessage(`Error opening SSA file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}