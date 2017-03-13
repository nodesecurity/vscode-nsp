const vscode = require('vscode');
const Path = require('path');
const Nsp = require('nsp');
const Fs = require('fs');

/**
 * @name walkTreeSync
 * @function
 * 
 * @description
 * Recursively walk the directory tree
 * looking for all package.json files.
 * Ignores all 'node_modules' directories
 * 
 * @todo
 * Maybe add other common folders
 * to ignored list? examples:
 * .git, .vscode, .idea, etc...
 * 
 * @param {string} dir - Lookup directory
 * @param {array} filelist - package.json files collection
 * @returns {array} filelist - package.json files collection
 */
const walkTreeSync = (dir, filelist = []) => {
	Fs.readdirSync(dir).map(file => {
		filelist = (Fs.statSync(Path.join(dir, file)).isDirectory() &&
			!Path.join(dir, file).endsWith('node_modules')) ?
				walkTreeSync(Path.join(dir, file), filelist) 
			:
				(file == 'package.json' || file == 'npm-shrinkwrap.json') ?
					filelist.concat(Path.join(dir, file))
				:
					filelist;
	})
	return filelist;
}

/**
 * @name outputProblems
 * @function
 * 
 * @description
 * Output the results once all
 * package.json files have been analyzed
 * 
 * @param {vscode.OutputChannel} outputChannel
 * @param {array} summary - All problems to be displayed in outputChannel
 * @param {number} totalVulns - Total number of vulnerabilities found
 */
const outputProblems = (outputChannel, summary, totalVulns) => {
	if (totalVulns > 0) {
		outputChannel.show();
		summary.map(item => {
			outputChannel.append(item);
		});
		vscode.window.showInformationMessage('(+) ' + totalVulns + ' vulnerabilities found.');
	} else
		vscode.window.showInformationMessage('No known vulnerabilities found.');
}

const activate = (context) => {

	let disposable = vscode.commands.registerCommand('nspCheck', () => {
		let formatter = Nsp.formatters[vscode.workspace.getConfiguration('nsp')['output']]
		let outputChannel = vscode.window.createOutputChannel('nsp');
		let output = [];
		let warnings = 0; //Keep total warnings to display in InformationMessage
		let analyzed = 0; //FIXME: Using a counter is kinda ugly

		files = walkTreeSync(vscode.workspace.rootPath);

		files.forEach(pkgfile => {
			let payload = {
				package: pkgfile.endsWith("package.json") ? pkgfile : undefined,
				shrinkwrap: pkgfile.endsWith("npm-shrinkwrap.json") ? pkgfile : undefined,
			}

			Nsp.check(payload, (err, data) => {
				if (data.length > 0)
					warnings += data.length;

				if (err || data.length > 0)
					output.push(formatter(err, data));

				analyzed != files.length - 1 ? analyzed++ : outputProblems(outputChannel, output, warnings);
			});
		});
	});
	context.subscriptions.push(disposable);
}

exports.activate = activate;