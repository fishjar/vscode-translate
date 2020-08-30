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
      const text = editor.document.getText(selection).trim();
      console.log("txt", text);
      if (!text) {
        vscode.window.showInformationMessage(`未选中任何文本！`);
        return;
      }
      vscode.window.showInformationMessage(`${text}`);

      try {
        // google翻译
        let data = await api.fetchDict(text);
        let msg = data.sentences.map((item) => item.trans).join(", ");
        vscode.window.showInformationMessage(`${msg}`);

        // 判断是否单个英文单词
        if (data.src !== "en" || /\n|\r/.test(text)) {
          return;
        }

        // bing翻译
        data = await api.fetchDict(text, "bing");
        msg =
          `${data.phonetic_US}${data.phonetic_UK}` +
          data.translation.map((item) => `[${item.pos}]${item.def}`).join(", ");
        vscode.window.showInformationMessage(`${msg}`);
      } catch (err) {
        console.log("err", err);
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
