const observer = require("@nx-js/observer-util");
import React from "react";
import {unstable_batchedUpdates as rdBatched} from "react-dom";
import {unstable_batchedUpdates as rnBatched} from "react-native";

let TARGET_LIB_NAME;
if (__TARGET__ === "browser")
  TARGET_LIB_NAME = "nx-component-observer-react";
if (__TARGET__ === "native")
  TARGET_LIB_NAME = "nx-component-observer-react/native";
if (__TARGET__ === "custom")
  TARGET_LIB_NAME = "nx-component-observer-react/custom";
if (!observer)
  throw new Error(
    TARGET_LIB_NAME + " requires the @nx-js/observer-util package"
  );
if (!React)
  throw new Error(TARGET_LIB_NAME + " requires React to be available");
export {
  componentObserve,
  ComponentObserve,
  renderReporter,
  componentByNodeRegistery,
  trackComponents,
  useStaticRendering
} from "./componentObserve";

export {default as Provider} from "./Provider";
export {default as inject} from "./inject";

export default module.exports
