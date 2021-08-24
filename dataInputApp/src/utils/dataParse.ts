/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 16:05:43
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-24 11:01:26
 */
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

let datas: Array<object> = [];

// 数据解析主函数
const dataParse = (
  projectUrl: string,
  index: string,
  fileConfig: File | string | Blob,
  methodConfig: File | string | Blob
) => {
  console.log(projectUrl, index, fileConfig, methodConfig);
  getProject(projectUrl, index, fileConfig, methodConfig);
};

// 使用git将项目拉到本地
const getProject = (
  projectUrl: string,
  index: string,
  fileConfig: File | string | Blob,
  methodConfig: File | string | Blob
) => {
  let re = /(?<=\/)[^\/]*(?=\.git)/;
  let projectName = projectUrl.match(re)[0];
  console.log(process.env);
  let cmdStr = "git clone " + projectUrl;
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      let wholeFile: string[];
      let methodFile: string[];
      getWholeFile(fileConfig).then((result: string[]) => {
        wholeFile = result;
        console.log(wholeFile);
        getMethodFile(methodConfig).then((res: string[]) => {
          methodFile = res;
          console.log(methodFile);
          getFiles(projectName, projectUrl, index, wholeFile, methodFile);
        });
      });
      console.log(stdout);
      exec("code " + process.env.PWD + "/" + projectName + ".json");
    }
  });
};

// 递归遍历文件夹函数
const travel = (dir: string, callback: any) => {
  fs.readdirSync(dir).forEach((file: any) => {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
};

// 获取所需文件夹下所有文件的路径
const getFiles = (
  projectName: string,
  projectUrl: string,
  index: string,
  wholeFile: string[],
  methodFile: string[]
) => {
  wholeFile.forEach((val: string) => {
    travel(process.env.PWD + "/" + projectName + val, (pathname: any) => {
      getFileContent(pathname, projectUrl, projectName, index);
    });
  });
  methodFile.forEach((val: string) => {
    travel(process.env.PWD + "/" + projectName + val, (pathname: any) => {
      getMethodContent(pathname, projectUrl);
    });
  });
  console.log(datas);
};

// 获取所需的全文件类型的文件夹或文件列表
const getWholeFile = (fileConfig: File | string | Blob) => {
  return new Promise((resolve, reject) => {
    let content = "";
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      content = e.target.result;
      const result = content.split(/\r\n|\n/);
      resolve(result);
    };
    reader.onerror = (e: any) => {
      reject(e);
    };
    if (typeof fileConfig === "object") {
      reader.readAsText(fileConfig, "utf-8");
    }
  });
};

// 获取所需的工具函数类型的文件夹或文件列表
const getMethodFile = (methodConfig: File | string | Blob) => {
  return new Promise((resolve, reject) => {
    let content = "";
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      content = e.target.result;
      const result = content.split(/\r\n|\n/);
      resolve(result);
    };
    reader.onerror = (e: any) => {
      reject(e);
    };
    if (typeof methodConfig === "object") {
      reader.readAsText(methodConfig, "utf-8");
    }
  });
};

// 获取单个文件内容并解析写入json文件
const getFileContent = (
  filePath: string,
  projectUrl: string,
  projectName: string,
  indexNow: string
) => {
  let file: { id: string; name: string; description: string | null; link: string; code: string } = {
    id: "",
    name: "",
    description: "",
    link: "",
    code: "",
  };
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    if (data.search(/Version|version/) === -1)
      file.description = data
        .match(/(?<=\@(D|d)escription)[\s\S]*(?=\n\s\*\s\@(A|a))/)?.[0]
        .replace(/:|：/g, "")
        .replace(/\n/g, " ")
        .replace(/\*/g, " ");
    else
      file.description = data
        .match(/(?<=\@(D|d)escription)[\s\S]*(?=\n\s\*\s\@(V|v))/)?.[0]
        .replace(/:|：/g, "")
        .replace(/\n/g, " ")
        .replace(/\*/g, " ");

    file.code = data.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/"/g, "'");
    file.link = projectUrl;
    file.id = filePath.split(process.env.PWD + "/")[1];
    file.name = file.id;
    datas.push(file);
    let tool = { index: { _index: indexNow, _id: file.id } };
    let temp = JSON.stringify(tool);
    let value = JSON.stringify(file);
    fs.appendFileSync(projectName + ".json", temp);
    fs.appendFileSync(projectName + ".json", "\n");
    fs.appendFileSync(projectName + ".json", value);
    fs.appendFileSync(projectName + ".json", "\n");
  });
};

// 获取工具函数内容并解析写入json文件
const getMethodContent = (filePath: string, projectUrl: string) => {
  // let file: { id: string; name: string; description: string | null; link: string; code: string } = {
  //   id: "",
  //   name: "",
  //   description: "",
  //   link: "",
  //   code: "",
  // };
  // fs.readFile(filePath, "utf-8", (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   if (data.search(/Version|version/) === -1)
  //     file.description = data
  //       .match(/(?<=\@(D|d)escription)[\s\S]*(?=\n\s\*\s\@(A|a))/)?.[0]
  //       .replace(/:|：/, "")
  //       .replace(/\n/, " ");
  //   else
  //     file.description = data
  //       .match(/(?<=\@(D|d)escription)[\s\S]*(?=\n\s\*\s\@(V|v))/)?.[0]
  //       .replace(/:|：/, "")
  //       .replace(/\n/, " ");
  //   file.code = data.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
  //   file.link = projectUrl;
  //   file.id = filePath.split(process.env.PWD + "/")[1];
  //   file.name = file.id;
  //   //console.log(file);
  //   datas.push(file);
  // });
  // /\*|\n\s\*(\s|/)
};

export { dataParse };
