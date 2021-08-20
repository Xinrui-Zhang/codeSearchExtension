/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 14:10:58
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-20 16:17:34
 */

import React, { useState, useEffect } from "react";
import { Button, Col, Input, Layout, Row, Select, Upload } from "antd";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { dataParse } from "../utils/dataParse";
import { getIndexes, importData } from "../utils/esCommunication";

const { Header, Footer, Content } = Layout;

const Home = () => {
  const [projectUrl, setProjectUrl] = useState("");
  const [fileConfig, setFileConfig] = useState({});
  const [methodConfig, setMethodConfig] = useState({});
  const [index, setIndex] = useState("");
  const [indexes, setIndexes] = useState([{ label: "", value: "" }]);

  useEffect(() => {
    getIndexes();
    setIndexes([{ label: "codesearch", value: "codesearch" }]);
  }, []);

  const uploadData = (data: UploadRequestOption<any>) => {
    importData(index, data.file);
  };

  const generateData = () => {
    dataParse(projectUrl, fileConfig, methodConfig);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ textAlign: "center" }}>
        <h1 style={{ color: "white" }}>代码检索数据导入</h1>
      </Header>
      <Content>
        <Row style={{ marginTop: "8%" }}>
          <Col offset="4" span="16">
            <Input
              allowClear
              placeholder="请输入项目URL(SSH/HTTP)"
              onChange={(e) => {
                setProjectUrl(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "5%" }}>
          <Col offset="5" span="4">
            <Upload
              accept=".txt"
              showUploadList={false}
              customRequest={(data) => {
                setFileConfig(data.file);
              }}>
              <Button>导入完整文件配置</Button>
            </Upload>
          </Col>
          <Col offset="1" span="4">
            <Upload
              accept=".txt"
              showUploadList={false}
              customRequest={(data) => {
                setMethodConfig(data.file);
              }}>
              <Button>导入工具方法配置</Button>
            </Upload>
          </Col>
          <Col offset="1" span="4">
            <Button type="primary" onClick={generateData}>
              生成数据文件
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: "5%" }}>
          <Col offset="7" span="6">
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="请选择数据所在索引"
              options={indexes}
              onChange={(value) => {
                setIndex(value === undefined ? "" : String(value));
              }}></Select>
          </Col>
          <Col offset="1" span="4">
            <Upload accept=".json" showUploadList={false} customRequest={uploadData}>
              <Button type="primary">导入数据文件</Button>
            </Upload>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
