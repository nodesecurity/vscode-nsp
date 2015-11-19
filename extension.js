var vscode = require('vscode');
var Path = require('path');
var Nsp = require('nsp');

function activate(context) {

	var disposable = vscode.commands.registerCommand('extension.nspCheck', function () {
		var outputChannel = vscode.window.createOutputChannel('nsp');
		
		var payload = {
			package: Path.join(vscode.workspace.rootPath, 'package.json'),
			shrinkwrap: Path.join(vscode.workspace.rootPath, 'npm-shrinkwrap.json')
		}

		var formatter = Nsp.formatters[vscode.workspace.getConfiguration('nsp')['output']]
		Nsp.check(payload,function (err, data) {
			var output = formatter(err, data);
			
			// Error or vulns found
			if (err || data.length > 0) {
				outputChannel.show();
				return outputChannel.append(output);
			}

			return vscode.window.showInformationMessage(output);
		});
	});
	
	context.subscriptions.push(disposable);
	
}
exports.activate = activate;
