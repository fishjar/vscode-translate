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
      console.log("select txt", text);
      if (!text) {
        vscode.window.showInformationMessage(`未选中任何文本！`);
        return;
      }
      vscode.window.showInformationMessage(`${text}`);

      try {
        const resGoogle = await api.fetchGoogle(text);
        if (!resGoogle) {
          vscode.window.showInformationMessage(`请重试!`);
          return;
        }
        vscode.window.showInformationMessage(`[谷歌翻译] ${resGoogle.trans}`);

        if (resGoogle.isWord) {
          // 英文单词
          const resDict = await api.fetchDict(text);
          if (!resDict || !Array.isArray(resDict)) {
            vscode.window.showInformationMessage(`请重试!`);
            return;
          }
          resDict.forEach((item) => {
            const trans = item.trans
              .map((t) => `[${t.pos}] ${t.def}`)
              .join("; ");
            const variants = item.variants
              .map((v) => `[${v.pos}] ${v.def}`)
              .join("; ");
            const msg = `[${item.botName}] ${item.phoneticUS} ${item.phoneticUK} ${trans} ${variants}`;
            vscode.window.showInformationMessage(msg);
          });
        } else {
          // 非英文单词
          const resTrans = await api.fetchTrans(text, resGoogle.tl);
          if (!resTrans || !Array.isArray(resTrans)) {
            vscode.window.showInformationMessage(`请重试!`);
            return;
          }
          resTrans.forEach((item) => {
            const msg = `[${item.botName}] ${item.result}`;
            vscode.window.showInformationMessage(msg);
          });
        }
      } catch (err) {
        console.log("err", err);
        vscode.window.showInformationMessage(`翻译出错了：${err.message}`);
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
