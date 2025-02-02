import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const SSAMapper: { [key: string]: string } = {
    initial: "Initial SSA",
    rm_unreachable_1: "Removing Unreachable Functions (1st)",
    defunc: "Defunctionalization",
    inlining_simple: "Inlining simple functions",
    mem2reg_1: "Mem2Reg (1st)",
    rm_rc_pairs: "Removing Paired rc_inc & rc_decs",
    preprocess: "Preprocessing Functions",
    inline_1: "Inlining (1st)",
    mem2reg_2: "Mem2Reg (2nd)",
    simplify_1: "Simplifying (1st)",
    as_slice: "`as_slice` optimization",
    rm_unreachable_2: "Removing Unreachable Functions (2nd)",
    assert: "`static_assert` and `assert_constant`",
    loop_invariant: "Loop Invariant Code Motion",
    unroll: "Unrolling",
    simplify_2: "Simplifying (2nd)",
    mem2reg_3: "Mem2Reg (3rd)",
    flatten: "Flattening",
    rm_big_shifts: "Removing Bit Shifts",
    mem2reg_4: "Mem2Reg (4th)",
    inline_2: "Inlining (2nd)",
    rm_ifelse: "Remove IfElse",
    fold_constraints: "Constant Folding",
    rm_enable_side_eff: "EnableSideEffectsIf removal",
    fold_constants: "Constraint Folding",
    add_not_equal: "Adding constrain not equal",
    rm_dead_1: "Dead Instruction Elimination (1st)",
    simplify_3: "Simplifying (3rd)",
    array_set_optimize: "Array Set Optimizations",
    check_undeconstrain: "Check for Underconstrained Values",
    check_missing_brillig: "Check for Missing Brillig Call Constraints",
    inline_brillig: "Brillig Calls Inlining",
    rm_dead_2: "Dead Instruction Elimination (2nd)",
};


function createDateTimeFromTimestamp(timestamp: string): Date | null  {
    const seconds = parseInt(timestamp, 10);

    if (isNaN(seconds)) {
        return null;
    }
    const date = new Date(seconds * 1000);
    return date;
}

function getDirectories(dirPath: string): string[] {
    try {
        return fs.readdirSync(dirPath)
            .filter((file) => fs.statSync(path.join(dirPath, file)).isDirectory());
    } catch (err) {
        vscode.window.showErrorMessage(`Error reading directory: ${dirPath}`);
        return [];
    }
}

function getFiles(dirPath: string): string[] {
    try {
        return fs.readdirSync(dirPath)
            .filter((file) => fs.statSync(path.join(dirPath, file)).isFile());
    } catch (err) {
        vscode.window.showErrorMessage(`Error reading directory: ${dirPath}`);
        return [];
    }
}

function showFolderPicker(folders: string[]): Thenable<{ label: string; value: string} | undefined> {
    const formatted_folders = folders.map(
        folder => ({ 
                label: createDateTimeFromTimestamp(folder)?.toLocaleString() ?? "unparsed", 
                value: folder 
            })
    );
    return vscode.window.showQuickPick(formatted_folders, { placeHolder: "Select a folder" });
}

function showFilePicker(files: string[]): Thenable<{ label: string; value: string} | undefined> {
    const formatted_files = files.map(file => ({label: SSAMapper[path.basename(file, ".ssa.json").slice(3)], value: file}));
    return vscode.window.showQuickPick(formatted_files, { placeHolder: "Select SSA processsing step" });
}


export async function selectSSAVersion(): Promise<string | undefined> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return undefined;
    }

    const logDir = path.join(workspaceFolder.uri.fsPath, 'target', 'log');
    const folders = getDirectories(logDir);

    if (folders.length === 0) {
        vscode.window.showInformationMessage("No folders found in the log directory.");
        return undefined;
    }

    const selectedFolder = await showFolderPicker(folders);
    if (!selectedFolder) {
        vscode.window.showInformationMessage("Operation cancelled.");
        return undefined;
    }

    const selectedFolderPath = path.join(logDir, selectedFolder.value, 'locations');

    const files = getFiles(selectedFolderPath);
    if (files.length === 0) {
        vscode.window.showInformationMessage("No files found in the selected directory.");
        return undefined;
    }

    const selectedFile = await showFilePicker(files);
    if (!selectedFile) {
        vscode.window.showInformationMessage("Operation cancelled.");
        return undefined;
    }

    const selectedFilePath = path.join(selectedFolderPath, selectedFile.value);
    vscode.window.showInformationMessage(`Selected file: ${selectedFilePath}`);
    return selectedFilePath;
}