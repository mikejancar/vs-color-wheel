import { commands, ConfigurationTarget, ExtensionContext, window, workspace } from 'vscode';

import { ColorComputer } from './color-computer';
import { Scope } from './scope.interface';
import scopes from './scopes.json';
import { TextMateRule } from './text-mate-rule.interface';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('vs-color-wheel.setPrimaryColor', setPrimaryColor));
  context.subscriptions.push(commands.registerCommand('vs-color-wheel.removeCustomizations', removeCustomizations));
}

async function removeCustomizations(): Promise<void> {
  const userConfig = ConfigurationTarget.Global;
  await workspace.getConfiguration().update('editor.tokenColorCustomizations', undefined, userConfig);
}

async function setPrimaryColor(): Promise<void> {
  let primaryColor = await window.showInputBox({
    value: '#ffffff',
    placeHolder: 'Enter the hexidecimal value for your desired primary color'
  });
  if (primaryColor) {
    const colorComputer = new ColorComputer();
    primaryColor = primaryColor.replace('#', '');
    try {
      const primaryHsv = colorComputer.hexToHsv(primaryColor);
      const colorScheme = colorComputer.createTetradicScheme(primaryHsv);
      const schemeInHex = [];
      for (const color of colorScheme) {
        console.log(JSON.stringify(color));
        const hexColor = colorComputer.hsvToHex(color);
        console.log(JSON.stringify(hexColor));
        schemeInHex.push(hexColor);
      }
      console.log(JSON.stringify(schemeInHex));
      await setColors(schemeInHex);
    } catch (error) {
      window.showInformationMessage('Failed to set the themed colors');
      console.error(error);
    }
  }
}

async function setColors(colors: string[]): Promise<void> {
  window.showInformationMessage(`Setting ${colors[0]} as the primary color of your theme`);

  const rules: TextMateRule[] = [];
  scopes.forEach((scope: Scope) => {
    const foreground = scope.settings.foreground || colors[0];
    scope.scopes?.forEach(sc => rules.push(setColor(colors, sc, foreground)));
  });

  const userConfig = ConfigurationTarget.Global;
  await workspace.getConfiguration().update('editor.tokenColorCustomizations', { textMateRules: rules }, userConfig);
}

function setColor(colors: string[], scope: string, foreground: string) {
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  const tertiaryColor = colors[2];
  const quadraticColor = colors[3];

  let color: string | undefined;
  switch (foreground) {
    case 'primary':
      color = primaryColor;
      break;
    case 'secondary':
      color = secondaryColor;
      break;
    case 'tertiary':
      color = tertiaryColor;
      break;
    case 'quadratic':
      color = quadraticColor;
      break;
    default:
      color = foreground;
  }
  return { scope, settings: { foreground: color } };
}

// this method is called when your extension is deactivated
export function deactivate() { }
