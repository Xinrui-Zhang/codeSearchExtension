/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 16:05:43
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-23 17:50:59
 */
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

let datas: object[] = [];

const dataParse = (
  projectUrl: string,
  index: string,
  fileConfig: File | string | Blob,
  methodConfig: File | string | Blob
) => {
  console.log(projectUrl, index, fileConfig, methodConfig);
  getProject(projectUrl, fileConfig, methodConfig);
};
const getProject = (
  projectUrl: string,
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
      getWholeFile(fileConfig).then((result: string[]) => {
        wholeFile = result;
        console.log(wholeFile);
        let methodFile: string[];
        getMethodFile(methodConfig).then((res: string[]) => {
          methodFile = res;
          console.log(methodFile);
          getFiles(projectName, projectUrl, wholeFile, methodFile);
        });
      });

      console.log(stdout);
    }
  });
};

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

const getFiles = (
  projectName: string,
  projectUrl: string,
  wholeFile: string[],
  methodFile: any
) => {
  wholeFile.forEach((val: string) => {
    travel(process.env.PWD + "/" + projectName + val, function (pathname: any) {
      getFileContent(pathname, projectUrl);
    });
    console.log(datas);
  });
};

const getWholeFile = (fileConfig: File | string | Blob) => {
  return new Promise((resolve, reject) => {
    let content = "";
    const reader = new FileReader();
    // Wait till complete
    reader.onloadend = function (e: any) {
      content = e.target.result;
      const result = content.split(/\r\n|\n/);
      resolve(result);
    };
    // Make sure to handle error states
    reader.onerror = function (e: any) {
      reject(e);
    };
    if (typeof fileConfig === "object") {
      reader.readAsText(fileConfig, "utf-8");
    }
  });
};

const getMethodFile = (methodConfig: File | string | Blob) => {
  return new Promise((resolve, reject) => {
    let content = "";
    const reader = new FileReader();
    // Wait till complete
    reader.onloadend = function (e: any) {
      content = e.target.result;
      const result = content.split(/\r\n|\n/);
      resolve(result);
    };
    // Make sure to handle error states
    reader.onerror = function (e: any) {
      reject(e);
    };
    if (typeof methodConfig === "object") {
      reader.readAsText(methodConfig, "utf-8");
    }
  });
};

const getFileContent = (filePath: string, projectUrl: string) => {
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
        .replace(/:|：/, "")
        .replace(/\n/, " ");
    else
      file.description = data
        .match(/(?<=\@(D|d)escription)[\s\S]*(?=\n\s\*\s\@(V|v))/)?.[0]
        .replace(/:|：/, "")
        .replace(/\n/, " ");
    file.code = data.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
    file.link = projectUrl;
    file.id = filePath.split(process.env.PWD + "/")[1];
    file.name = file.id;
    //console.log(file);
    datas.push(file);
  });
};

export { dataParse };
