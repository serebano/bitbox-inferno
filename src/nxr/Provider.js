import React, {Component,PropTypes} from "react";

const specialReactKeys = {children: true, key: true, ref: true};

export default class Provider extends Component {
  static contextTypes = {nxStores: PropTypes.object};

  static childContextTypes = {nxStores: PropTypes.object.isRequired};

  render() {
    return React.Children.only(this.props.children);
  }

  getChildContext() {
    const stores = {};
    // inherit stores
    const baseStores = this.context.nxStores;
    if (baseStores)
      for (let key in baseStores) {
        stores[key] = baseStores[key];
      }
    // add own stores
    for (let key in this.props)
      if (!specialReactKeys[key] && key !== "suppressChangedStoreWarning")
        stores[key] = this.props[key];
    return {nxStores: stores};
  }

  componentWillReceiveProps(nextProps) {
    // Maybe this warning is too aggressive?
    if (Object.keys(nextProps).length !== Object.keys(this.props).length)
      console.warn(
        "NX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"
      );
    if (!nextProps.suppressChangedStoreWarning)
      for (let key in nextProps)
        if (!specialReactKeys[key] && this.props[key] !== nextProps[key])
          console.warn(
            "NX Provider: Provided store '" + key +
              "' has changed. Please avoid replacing stores as the change might not propagate to all children"
          );
  }
}
