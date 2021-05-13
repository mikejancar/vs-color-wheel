import { commands, ConfigurationTarget, ExtensionContext, window, workspace } from 'vscode';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('vs-color-wheel.setPrimaryColor', async () => {
    const primaryColor = await window.showInputBox({
      value: '#ffffff',
      placeHolder: 'Enter the hexidecimal value for your desired primary color'
    });
    const secondaryColor = "#48c5ff";
    const tertiaryColor = "#8248ff";
    window.showInformationMessage(`Setting ${primaryColor} as the primary color of your theme`);
    const userConfig = ConfigurationTarget.Global;
    try {
      await workspace.getConfiguration().update('editor.tokenColorCustomizations', {
        functions: primaryColor,
        keywords: secondaryColor,
        strings: tertiaryColor,
        textMateRules: [
          {
            scope: 'keyword',
            settings: {
              foreground: secondaryColor
            }
          },
          {
            scope: 'entity.name.type',
            settings: {
              foreground: primaryColor
            }
          },
          {
            scope: 'support.constant',
            settings: {
              foreground: secondaryColor
            }
          },
          {
            scope: 'support.type',
            settings: {
              foreground: primaryColor
            }
          },
          {
            scope: 'variable.parameter',
            settings: {
              foreground: primaryColor
            }
          },
          {
            scope: 'constant.language',
            settings: {
              foreground: tertiaryColor
            }
          },
          {
            scope: 'constant.character',
            settings: {
              foreground: secondaryColor
            }
          },
          {
            scope: 'constant.numeric',
            settings: {
              foreground: tertiaryColor
            }
          },
          {
            scope: 'constant.other',
            settings: {
              foreground: secondaryColor
            }
          },
          {
            scope: 'source',
            settings: {
              foreground: '#ffffff'
            }
          }
        ]
      }, userConfig);
    } catch (error) {
      console.error(error);
    }
  }));
}

// this method is called when your extension is deactivated
export function deactivate() { }
