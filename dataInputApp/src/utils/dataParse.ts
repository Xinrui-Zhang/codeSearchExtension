/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 16:05:43
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-27 13:57:01
 */
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

// 数据解析主函数
const dataParse = (
  projectUrl: string,
  index: string,
  fileConfig: File | string | Blob,
  methodConfig: File | string | Blob
) => {
  let re = /(?<=\/)[^\/]*(?=\.git)/;
  let projectName = projectUrl.match(re)[0];
  let cmdStr = "git clone " + projectUrl;
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      let wholeFile: string[];
      let methodFile: string[];
      getWholeFile(fileConfig).then((result: string[]) => {
        wholeFile = result;
        getMethodFile(methodConfig).then((res: string[]) => {
          methodFile = res;
          getFiles(projectName, projectUrl, index, wholeFile, methodFile);
        });
      });
      console.log(stdout);
      exec("code " + process.env.PWD + "/" + projectName + ".json");
    }
  });
};

// 模块使用情况统计
const modulesUseParse = (
  projectUrl: string,
  index: string,
  fileConfig: File | string | Blob,
  methodConfig: File | string | Blob
) => {
  let re = /(?<=\/)[^\/]*(?=\.git)/;
  let projectName = projectUrl.match(re)[0];
  let cmdStr = "git clone " + projectUrl;
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      let wholeFile: string[];
      let methodFile: string[];
      getWholeFile(fileConfig).then((result: string[]) => {
        wholeFile = result;
        getMethodFile(methodConfig).then((res: string[]) => {
          methodFile = res;
          getModules(projectName, index, wholeFile, methodFile);
        });
      });
      console.log(stdout);
      exec("code " + process.env.PWD + "/" + projectName + ".json");
    }
  });
};

// 递归遍历文件夹函数
const travel = (dir: string, callback: any) => {
  if (fs.statSync(dir).isDirectory()) {
    fs.readdirSync(dir).forEach((file: any) => {
      var pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        travel(pathname, callback);
      } else {
        callback(pathname);
      }
    });
  } else callback(dir);
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

// 获取所需文件夹下所有文件的路径
const getFiles = (
  projectName: string,
  projectUrl: string,
  index: string,
  wholeFile: string[],
  methodFile: string[]
) => {
  wholeFile.forEach((val: string) => {
    if (val) {
      travel(process.env.PWD + "/" + projectName + val, (pathname: any) => {
        getFileContent(pathname, projectUrl, projectName, index);
      });
    }
  });
  methodFile.forEach((val: string) => {
    if (val) {
      travel(process.env.PWD + "/" + projectName + val, (pathname: any) => {
        getMethodContent(pathname, projectUrl, projectName, index);
      });
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
const getMethodContent = (
  filePath: string,
  projectUrl: string,
  projectName: string,
  indexNow: string
) => {
  let method: { id: string; name: string; description: string | null; link: string; code: string } =
    {
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
    let re: RegExp = new RegExp("(?<=/\\*\\*)[^/]*(?=\\*)", "g");
    let functions = data.split(re);
    let comments = data.match(re);
    comments.forEach((val, index) => {
      method.description = val.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
      method.code = functions[index + 1].replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
      method.link = projectUrl;
      method.id = filePath.split(process.env.PWD + "/")[1];
      method.name = method.id.split(projectName + "/")[1] + "_function";
      let tool = { index: { _index: indexNow } };
      let temp = JSON.stringify(tool);
      let value = JSON.stringify(method);
      fs.appendFileSync(projectName + ".json", temp);
      fs.appendFileSync(projectName + ".json", "\n");
      fs.appendFileSync(projectName + ".json", value);
      fs.appendFileSync(projectName + ".json", "\n");
    });
  });
};

const getModules = (
  projectName: string,
  index: string,
  wholeFile: string[],
  methodFile: string[]
) => {
  const files = wholeFile.concat(methodFile);
  files.forEach((val: string) => {
    if (val) {
      travel(process.env.PWD + "/" + projectName + val, (pathname: any) => {
        getModuleContent(pathname, projectName, index);
      });
    }
  });
};

const getModuleContent = (filePath: string, projectName: string, indexNow: string) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const moduleRe = /(?<=import)[^\n]*(?=from)/g;
    const sourceRe = /(?<=from)[^\n]*(?=\n)/g;
    const modules = data.match(moduleRe);
    const sources = data.match(sourceRe);
    const sourceTest = /^\.\/|^@\/api/;
    modules.forEach((val, index) => {
      sources[index] = sources[index].replace(/'|"|\s|;/g, "");
      if (sourceTest.test(sources[index])) {
      } else {
        val = val.replace(/{|}|,|\*\sas/g, "");
        const moduleItems = val.split(" ");
        moduleItems.forEach((va) => {
          if (va) {
            let module: {
              name: string;
              source: string;
              fileName: string;
              projectName: string;
            } = {
              name: va,
              source: sources[index],
              fileName: filePath.split(process.env.PWD + "/")[1],
              projectName: projectName,
            };
            let tool = {
              index: { _index: indexNow, _id: filePath.split(process.env.PWD + "/")[1] + "_" + va },
            };
            let temp = JSON.stringify(tool);
            let value = JSON.stringify(module);
            fs.appendFileSync(projectName + ".json", temp);
            fs.appendFileSync(projectName + ".json", "\n");
            fs.appendFileSync(projectName + ".json", value);
            fs.appendFileSync(projectName + ".json", "\n");
          }
        });
      }
    });
  });
};

export { dataParse, modulesUseParse };
