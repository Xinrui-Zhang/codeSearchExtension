<!--
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 13:21:30
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-12-31 11:03:16
-->

# Code Search 服务

本项目提供了项目工程代码导入，根据注释等信息检索相关代码的功能，分为 VScode 插件与桌面程序两部分，各部分运行方式见各对应文件夹下的 README。

- Extension 文件夹下为代码检索插件的源码
- DataInputApp 文件夹下为处理、导入检索数据的桌面程序源码

在运行本项目前，需要启动 elastic search 和 kibana 服务，项目中默认 elastic search 端口为 9200，服务启动在本地，如果在服务器上启动，需将项目中的 localhost 改为对应 IP/域名。

- docker 拉取镜像

  ```cmd
  docker pull elasticsearch:7.0.1
  docker pull kibana:7.0.1
  ```

- docker 运行镜像
  ```cmd
  docker run --name es01-test -p 9200:9200 -p 9300:9300 -e ES_JAVA_OPTS="-Xms512m -Xmx512m" -e "discovery.type=single-node" -e bootstrap.system_call_filter=false -e bootstrap.memory_lock=false elasticsearch:7.0.1
  docker run --name kib01-test --net elastic -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://localhost:9200" kibana:7.0.1
  ```
  **注意：要先运行 elastic search，再运行 kibana，且运行 kibana 时要将其与 elasticsearch 运行位置配置匹配。**
- docker 停止镜像

  ```cmd
   docker stop es01-test
   docker stop kib01-test
  ```

- docker 删除镜像
  ```cmd
   docker rm es01-test
   docker rm kib01-test
  ```

## /Extension

### 调试

1. `npm install` / `yarn` 安装依赖
2. F5 调试，进入 extension debug 模式
3. 调出命令搜索框后输入 code search 即可激活本插件

### 打包

1. `npm install -g vsce` 安装打包工具
2. `vsce package` 打包，生成.vsix 文件

### 插件安装

`code --install-extension xxx.vsix(文件路径)`

### 插件使用

1. 调出命令搜索框后输入 code search 即可激活本插件
2. 选择检索数据所在的索引
3. 输入检索内容
4. 查看检索结果

## /DataInputApp

### 运行

1. `npm install` / `yarn` 安装依赖
2. `npm run start` / `yarn start` 运行

### 使用

1. 输入需要导入项目的 url
2. 选择该项目内容所属的索引
3. 上传文件维度的配置文件
   （即在 txt 文件中，填写需要导入文件所在文件夹或文件路径，例：/src/components，如无所需文件则上传空 txt 文件）
4. 上传函数维度的配置文件
   （即在 txt 文件中，填写需要导入文件所在文件夹或文件路径，例：/src/utils，如无所需文件则上传空 txt 文件）
5. 生成数据文件
   对数据文件中匹配有误的部分做人工调整
6. 点击上传调整后的数据文件

另：本项目还可以生成针对 import...from...形式的模块引入次数，此功能使用文件维度配置文件上传按钮上传配置文件，函数维度传空 txt 文件，点击生成模块统计按钮，生成相应数据文件后进行上传，可在可视化 dashboard 中查看统计结果。
