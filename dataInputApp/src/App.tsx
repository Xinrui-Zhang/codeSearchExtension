/*
 * @Description:
 * @Version: 2.0
 * @Autor: xrzhang03
 * @Date: 2021-08-20 11:09:29
 * @LastEditors: xrzhang03
 * @LastEditTime: 2021-08-20 14:19:33
 */

import { hot } from "react-hot-loader";
import * as React from "react";
import Home from "./pages/Home";

const App = () => (
  <div className="root">
    <Home />
  </div>
);

export default hot(module)(App);
