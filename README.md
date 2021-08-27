<!--
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 13:21:30
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-27 17:27:30
-->

# Code Search 服务

本项目提供了项目工程代码导入，根据注释等信息检索相关代码的功能，分为 VScode 插件与桌面程序两部分，各部分运行方式见各对应文件夹下的 README。

- Extension 文件夹下为代码检索插件的源码
- DataInputApp 文件夹下为处理、导入检索数据的桌面程序源码

在运行本项目前，需要启动 elastic search 和 kibana 服务，项目中默认 elastic search 端口为 9200

## /Extension

### 调试

1. npm install / yarn 安装依赖
2. F5 调试，进入 extension debug 模式
3. 调出命令搜索框后输入 code search 即可激活本插件

### 插件使用

1. 调出命令搜索框后输入 code search 即可激活本插件
2. 选择检索数据所在的索引
3. 输入检索内容
4. 查看检索结果

## /DataInputApp

### 运行

1. npm install / yarn 安装依赖
2. npm run start / yarn start 运行

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
