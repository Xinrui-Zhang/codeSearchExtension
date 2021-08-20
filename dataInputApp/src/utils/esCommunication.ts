/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 16:07:21
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-20 17:36:50
 */
import axios from "axios";

const getIndexes = () => {
  // const { net } = require("electron");
  // const request = net.request("http://localhost:9200/_aliases");
  // request.on("response", (response) => {
  //   console.log(`STATUS: ${response.statusCode}`);
  //   console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
  //   response.on("data", (chunk) => {
  //     console.log(`BODY: ${chunk}`);
  //   });
  //   response.on("end", () => {
  //     console.log("No more data in response.");
  //   });
  // });
  // request.end();
  // axios({
  //   method: "get",
  //   url: "http://localhost:9200/_cat/indices?v",
  // }).then((res) => {
  //   console.log(res);
  // });
  console.log("get indexer");
};

const importData = (index: string, data: Object) => {
  console.log(index, data);
};

export { getIndexes, importData };
