import * as vscode from 'vscode';
import { processSSAHovers,removeSSAHovers } from './process_hovers';
import { showSSA } from './show_ssa';
import { getSSADiff } from './diff_ssa';
import { flushSSALogs } from './flush_ssa';
import { compileWithSSA } from './compile_ssa';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "dump-ssa" is now active!');

    const updateReadonlySettings = () => {
        const config = vscode.workspace.getConfiguration('files');
        config.update(
            'readonlyInclude',
            {
                '**/target/log/**': true
            },
            vscode.ConfigurationTarget.Workspace
        ).then(() => {
            vscode.window.showInformationMessage("Updated files.readonlyInclude settings.");
        })
    };

    const commands = [
        { command: 'dump-ssa.processSSAHovers', callback: processSSAHovers },
        { command: 'dump-ssa.removeSSAHovers', callback: removeSSAHovers },
        { command: 'dump-ssa.showSSA', callback: showSSA },
        { command: 'dump-ssa.updateReadonlySettings', callback: updateReadonlySettings },
        { command: 'dump-ssa.getSSADiff', callback: getSSADiff },
        { command: 'dump-ssa.flushSSALogs', callback:  flushSSALogs },
        { command: 'dump-ssa.compileWithSSA', callback:  compileWithSSA }
    ];
    for (const { command, callback } of commands) {
        let disposable = vscode.commands.registerCommand(command, callback);
        context.subscriptions.push(disposable);
    }
}

export function deactivate() {}
