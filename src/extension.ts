import fetch from 'node-fetch';
import { commands, ConfigurationTarget, ExtensionContext, window, workspace } from 'vscode';

import { ColorApiResponse } from './color-api-response.interface';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('vs-color-wheel.setPrimaryColor', async () => {
    let primaryColor = await window.showInputBox({
      value: '#ffffff',
      placeHolder: 'Enter the hexidecimal value for your desired primary color'
    });
    if (primaryColor) {
      primaryColor = primaryColor.replace('#', '');
      try {
        const response = await fetch(`http://thecolorapi.com/scheme?hex=${primaryColor}&mode=triad`);
        if (response.ok) {
          const colorResponse: ColorApiResponse = await response.json();
          await setColors(colorResponse);
        } else {
          window.showInformationMessage('Failed to set the themed colors');
          console.error(`API called failed: ${response.statusText}`);
        }
      } catch (error) {
        window.showInformationMessage('Failed to set the themed colors');
        console.error(error);
      }
    }
  }));
}

async function setColors(colors: ColorApiResponse): Promise<void> {
  const primaryColor = colors.seed.hex.value;
  const secondaryColor = colors.colors[0].hex.value;
  const tertiaryColor = colors.colors[1].hex.value;

  window.showInformationMessage(`Setting ${primaryColor} as the primary color of your theme`);

  const userConfig = ConfigurationTarget.Global;
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
        scope: 'support.class',
        settings: {
          foreground: secondaryColor
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
}

// this method is called when your extension is deactivated
export function deactivate() { }
