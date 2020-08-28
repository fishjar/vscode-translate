// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const api = require("./api");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-translate" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "vscode-translate.translate",
    async function () {
      // The code you place here will be executed every time your command is executed

      // 获取选中文字
      const editor = vscode.window.activeTextEditor;
      const selection = editor.selections[0];
      console.log("selection", selection);
      const text = editor.document.getText(selection);
      console.log("txt", text);

      // 翻译
      let data;
      try {
        data = await api.fetchDict(text);
      } catch (err) {
        console.log("err", err);
      }
      console.log("data", data);
      if (!data) {
        return;
      }

      // Display a message box to the user
      if (data.google) {
        let msg = "";
        try {
          msg = data.google.sentences.map((item) => item.trans).join(", ");
        } catch (err) {
          console.log("err", err);
        }
        vscode.window.showInformationMessage(`${msg}`);
      }
      if (data.bing) {
        let msg = "";
        try {
          msg =
            `${data.bing.phonetic_US}${data.bing.phonetic_UK}` +
            data.bing.translation
              .map((item) => `[${item.pos}]${item.def}`)
              .join(", ");
        } catch (err) {
          console.log("err", err);
        }
        vscode.window.showInformationMessage(`${msg}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};