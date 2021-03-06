/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 14:10:58
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-26 11:03:26
 */

import React, { useState, useEffect } from "react";
import { Button, Col, Input, Layout, message, Row, Select, Upload } from "antd";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { dataParse, modulesUseParse } from "../utils/dataParse";
import { getIndexes, importData } from "../utils/esCommunication";

const { Header, Footer, Content } = Layout;

const Home = () => {
  const [projectUrl, setProjectUrl] = useState("");
  const [fileConfig, setFileConfig] = useState<File | string | Blob>();
  const [methodConfig, setMethodConfig] = useState<File | string | Blob>();
  const [index, setIndex] = useState("");
  const [indexes, setIndexes] = useState<{ label: string; value: string }[]>();

  useEffect(() => {
    let temp = getIndexes();
    let indexList: { label: string; value: string }[] = [];
    temp.forEach((val): void => {
      indexList.push({ label: val, value: val });
    });
    setIndexes(indexList);
  }, []);

  const uploadData = (data: UploadRequestOption<any>) => {
    importData(data.file);
  };

  const generateData = () => {
    if (!projectUrl) {
      message.error("请输入项目url！");
      return;
    } else if (!index) {
      message.error("请选择数据索引！");
      return;
    } else if (!fileConfig) {
      message.error("请上传完整文件配置文件！");
      return;
    } else if (!methodConfig) {
      message.error("请上传工具方法配置文件！");
      return;
    }
    dataParse(projectUrl, index, fileConfig, methodConfig);
  };

  const generateModules = () => {
    if (!projectUrl) {
      message.error("请输入项目url！");
      return;
    } else if (!index) {
      message.error("请选择数据索引！");
      return;
    } else if (!fileConfig) {
      message.error("请上传完整文件配置文件！");
      return;
    } else if (!methodConfig) {
      message.error("请上传工具方法配置文件！");
      return;
    }
    modulesUseParse(projectUrl, index, fileConfig, methodConfig);
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
          <Col offset="4" span="6">
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
            <Upload
              accept=".txt"
              showUploadList={false}
              customRequest={(data) => {
                setFileConfig(data.file);
              }}>
              <Button>完整文件配置</Button>
            </Upload>
          </Col>
          <Col offset="1" span="4">
            <Upload
              accept=".txt"
              showUploadList={false}
              customRequest={(data) => {
                setMethodConfig(data.file);
              }}>
              <Button>工具方法配置</Button>
            </Upload>
          </Col>
        </Row>
        <Row style={{ marginTop: "5%" }}>
          <Col offset="5" span="4">
            <Button type="primary" onClick={generateData}>
              生成数据文件
            </Button>
          </Col>
          <Col offset="1" span="4">
            <Button type="primary" onClick={generateModules}>
              生成模块统计
            </Button>
          </Col>
          <Col offset="1" span="4">
            <Upload accept=".json" showUploadList={false} customRequest={uploadData}>
              <Button type="primary" danger>
                导入数据文件
              </Button>
            </Upload>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
