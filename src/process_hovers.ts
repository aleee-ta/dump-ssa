import { selectSSAVersion } from "./select_location";
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let selectedLocationPath: string | undefined;
let decorationType: vscode.TextEditorDecorationType | undefined;

interface SSASpan {
    span: { start: number; end: number };
    file: number;
}

interface SSAInstruction {
    [key: string]: [SSASpan, string];
}

function applyHovers(ssaData: SSAInstruction): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active text editor.");
        return;
    }

    const document = editor.document;
    if (path.basename(document.fileName) !== "main.nr") {
        vscode.window.showErrorMessage(`No supported file type.`);
        return;
    }
    const decorations: vscode.DecorationOptions[] = [];

    for (const [instructionId, [spanInfo, content]] of Object.entries(ssaData)) {
        const startPosition = document.positionAt(spanInfo.span.start);
        const endPosition = document.positionAt(spanInfo.span.end);

        const range = new vscode.Range(startPosition, endPosition);
        const hoverContent = new vscode.MarkdownString(content);

        decorations.push({ range, hoverMessage: hoverContent });
    }

    decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 240, 100, 0.3)',
        border: '1px solid yellow',
    });

    editor.setDecorations(decorationType, decorations);

    vscode.window.showInformationMessage("SSA Hovers applied successfully.");
}

export function removeSSAHovers(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active text editor.");
        return;
    }

    if (!decorationType) {
        vscode.window.showWarningMessage("No SSA hovers or highlights to remove.");
        return;
    }

    editor.setDecorations(decorationType, []);

    decorationType.dispose();
    decorationType = undefined;

    vscode.window.showInformationMessage("SSA Hovers and highlights removed successfully.");
}

export async function processSSAHovers(): Promise<void> {
    if (!selectedLocationPath) {
        const selectedFile = await selectSSAVersion();
        if (!selectedFile) {
            vscode.window.showErrorMessage("No SSA file selected.");
            return;
        }
        selectedLocationPath = selectedFile;
    } else {
        const items = [{ label: 'yes'}, { label: 'no' }];
        const result = await vscode.window.showQuickPick(items, { placeHolder: "Save the previous selection?" });
        if (result?.label === 'no') {
            const selectedFile = await selectSSAVersion();
            if (!selectedFile) {
                vscode.window.showErrorMessage("No SSA file selected.");
                return;
            }
            selectedLocationPath = selectedFile;
        }
    }
    try {
        const fileContent = fs.readFileSync(selectedLocationPath, 'utf8');
        const ssaData: SSAInstruction = JSON.parse(fileContent);
        applyHovers(ssaData);
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error processing SSA file: ${error.message}`);
        } else {
            vscode.window.showErrorMessage(`Error processing SSA file.`);
        }
    }
}
