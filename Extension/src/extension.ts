/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-07-19 13:17:41
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-24 16:18:31
 */
// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";
import axios from "axios";
import * as path from "path";

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "codesearch" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("codesearch.codeSearch", () => {
    // The code you place here will be executed every time your command is executed

    const options = {
      ignoreFocusOut: true,
      password: false,
      prompt: "Please type the description about the code you want to search:",
    };
    let indexes: string[];
    axios({
      method: "get",
      url: "http://localhost:9200/_aliases",
    }).then((response) => {
      indexes = Object.keys(response.data).filter((t: any) => t[0] != ".");
      vscode.window.showQuickPick(indexes).then((index) => {
        vscode.window.showInputBox(options).then((value) => {
          if (value === undefined || value.trim() === "") {
            vscode.window.showInformationMessage("Please type your words.");
          } else {
            const panel = vscode.window.createWebviewPanel(
              "codeSearch", // Identifies the type of the webview. Used internally
              "Code Search", // Title of the panel displayed to the user
              vscode.ViewColumn.One, // Editor column to show the new webview panel in.
              {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "src"))],
              } // Webview options. More on these later.
            );
            const queryItem: string = value.trim();

            const cssDiskPath = vscode.Uri.file(
              path.join(context.extensionPath, "src/theme/prism.css")
            );
            const cssSrc = cssDiskPath.with({ scheme: "vscode-resource" }).toString();

            const jsDiskPath = vscode.Uri.file(path.join(context.extensionPath, "src/prism.js"));
            const jsSrc = jsDiskPath.with({ scheme: "vscode-resource" }).toString();

            // Set initial content
            updateWebview(cssSrc, jsSrc, panel, queryItem, "");

            // do search
            search(cssSrc, jsSrc, panel, queryItem, index);
          }
        });
      });
    });
  });

  context.subscriptions.push(disposable);
}

const updateWebview = (
  cssSrc: string,
  jsSrc: string,
  panel: vscode.WebviewPanel,
  queryItem: string,
  results: string
) => {
  panel.title = "Code Search for " + queryItem;
  panel.webview.html = getWebviewContent(cssSrc, jsSrc, queryItem, results);
};

const search = (
  cssSrc: string,
  jsSrc: string,
  panel: vscode.WebviewPanel,
  queryItem: string,
  index: string | undefined
) => {
  var results = "";
  axios({
    method: "get",
    url: "http://localhost:9200/" + index + "/_search?size=50",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      query: {
        multi_match: {
          query: queryItem,
          type: "best_fields",
          fields: ["name^2", "description^4", "code"],
          tie_breaker: 0.3,
        },
      },
    }),
  })
    .then((response) => {
      console.log(response.data);
      if (response.data.hits.total.value === 0) {
        results = '<h1>对不起没有检索到"' + queryItem + '"的相关代码</h1>';
      } else {
        results =
          '<h1>"' + queryItem + '"的检索结果共<b>' + response.data.hits.total.value + "</b>条</h1>";
      }
      response.data.hits.hits.forEach(
        (e: { _source: { name: string; description: string; code: string; link: string } }) => {
          results += `<h1 style="color:#2EA9DF">${e._source.name.split("/").pop()}</h1>
              <div>${e._source.description}</div><br/>
              <div>来自于<a href=${e._source.link} >${e._source.link}</a></div><br/>
              <div>文件路径：${e._source.name}</div><br/>
              <details>
                <summary>查看代码</summary>
                <pre><code class="language-typescript">${e._source.code}
                </code></pre>
              </details>
              <hr style="border: 0;
              padding-top: 1px;
              background: linear-gradient(to right, transparent, #d0d0d5, transparent);"/>
                `;
        }
      );

      updateWebview(cssSrc, jsSrc, panel, queryItem, results);
    })
    .catch((error) => {
      updateWebview(cssSrc, jsSrc, panel, queryItem, error);
    });
};

const getWebviewContent = (cssSrc: string, jsSrc: string, query: string, results: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${'Code Search for "' + query + '"'}</title>
		{<link href=${cssSrc} rel="stylesheet" />}
		<script src=${jsSrc}></script>
</head>
<body>
		<div>${results}</div>
</body>
</html>`;
};

// this method is called when your extension is deactivated
export function deactivate() {}

// <link rel="stylesheet" href="/path/to/styles/default.css">
// 		<script src="/path/to/highlight.min.js"></script>
// 		<script>hljs.highlightAll();</script>
