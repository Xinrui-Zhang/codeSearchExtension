/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 16:07:21
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-24 17:13:36
 */

import { ipcRenderer } from "electron";

// 获取当前已有索引列表
const getIndexes = (): Array<string> => {
  let temp = JSON.parse(ipcRenderer.sendSync("getIndexes"));
  let indexes = Object.keys(temp).filter((t: any) => t[0] != ".");
  return indexes;
};

// 导入数据
const importData = (data: File | string | Blob) => {
  var reader = new FileReader();
  let fileContent: string | ArrayBuffer;
  reader.onload = function (e) {
    fileContent = reader.result;
    console.log(fileContent);
    ipcRenderer.send("importDatas", fileContent);
  };
  if (typeof data === "object") {
    console.log(reader.readAsText(data, "utf-8"));
  }
  ipcRenderer.on("importFinished", (event, data) => {
    if (data.errors) {
      var notification = new Notification("导入失败!");
    } else {
      var notification = new Notification("导入成功！");
    }
  });
};

export { getIndexes, importData };
