const vscode = require("vscode");
const api = require("./api");

/**
 * 执行翻译
 */
async function translate() {
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
  // vscode.window.showInformationMessage(`${text}`);

  try {
    const resGoogle = await api.fetchGoogle(text);
    if (!resGoogle) {
      vscode.window.showInformationMessage(`请重试!`);
      return;
    }

    if (resGoogle.isWord) {
      // 英文单词，展示单词本身及谷歌翻译结果，并查询bing词典
      vscode.window.showInformationMessage(
        `${text} ${resGoogle.trans.join(" ")}`
      );

      const resDict = await api.fetchBingDict(text);
      if (!resDict) {
        vscode.window.showInformationMessage(`请重试!`);
        return;
      }
      const trans = resDict.trans.map((t) => `[${t.pos}] ${t.def}`).join("; ");
      const variants = resDict.variants
        .map((v) => `[${v.pos}] ${v.def}`)
        .join("; ");
      let msg = "";
      resDict.phoneticUS && (msg += `${resDict.phoneticUS} `);
      resDict.phoneticUK && (msg += `${resDict.phoneticUK} `);
      trans && (msg += `${trans} `);
      variants && (msg += `${variants} `);
      vscode.window.showInformationMessage(msg);
    } else {
      // 非英文单词，仅展示谷歌翻译结果
      vscode.window.showInformationMessage(`${resGoogle.trans.join(" ")}`);
    }
  } catch (err) {
    console.log("err", err);
    vscode.window.showInformationMessage(`翻译出错了：${err.message}`);
  }
}

module.exports = translate;
