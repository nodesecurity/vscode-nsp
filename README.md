# Node Security Platform (nsp) for Visual Studio Code

This extension adds the `nsp` command to check your package.json / npm-shrinkwrap.json against the Node Security project inventory of known vulnerabilities.

Note: This extension does require internet access to https://api.nodesecurity.io and will not currently work offline

## Usage

First, you will need to install Visual Studio Code 0.10. In the command palette (cmd-shift-p) select Install Extension and choose nsp.

## Options

The following Visual Studio Code settings are available for the nsp extension. These can be set in the user preferences (cmd+,) or workspace settings (.vscode/settings.json). 

Valid formatters are default, summary, json, codeclimate, and none.


```
{
  "nsp.output": "default"	
}
```

Additional information about the Node Security Platform can be found at https://nodesecurity.io
