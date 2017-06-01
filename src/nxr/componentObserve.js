import React from "react";
import ReactDOM from "react-dom";
import EventEmitter from "./utils/EventEmitter";
import inject from "./inject";
import observer from "@nx-js/observer-util";

/**
 * dev tool support
 */
let isDevtoolsEnabled = false;

let isUsingStaticRendering = false;

let warnedAboutObserverInjectDeprecation = false;

// WeakMap<Node, Object>;
export const componentByNodeRegistery = typeof WeakMap !== "undefined"
  ? new WeakMap()
  : undefined;
export const renderReporter = new EventEmitter();

function findDOMNode(component) {
  if (ReactDOM)
    return ReactDOM.findDOMNode(component);
  return null;
}

function reportRendering(component) {
  const node = findDOMNode(component);
  if (node && componentByNodeRegistery)
    componentByNodeRegistery.set(node, component);

  renderReporter.emit({
    event: "render",
    renderTime: component.__$nxRenderEnd - component.__$nxRenderStart,
    totalTime: Date.now() - component.__$nxRenderStart,
    component: component,
    node: node
  });
}

export function trackComponents() {
  if (typeof WeakMap === "undefined")
    throw new Error(
      "[nx-component-observe-react] tracking components is not supported in this browser."
    );
  if (!isDevtoolsEnabled)
    isDevtoolsEnabled = true;
}

export function useStaticRendering(useStaticRendering) {
  isUsingStaticRendering = useStaticRendering;
}

/**
 * Utilities
 */
function patch(target, funcName, runMixinFirst = false) {
  const base = target[funcName];
  const mixinFunc = reactiveMixin[funcName];
  if (!base) {
    target[funcName] = mixinFunc;
  } else {
    target[funcName] = runMixinFirst === true ? function() {
        mixinFunc.apply(this, arguments);
        base.apply(this, arguments);
      } : function() {
        base.apply(this, arguments);
        mixinFunc.apply(this, arguments);
      };
  }
}

function isObjectShallowModified(prev, next) {
  if (
    null == prev || null == next || typeof prev !== "object" ||
      typeof next !== "object"
  ) {
    return prev !== next;
  }
  const keys = Object.keys(prev);
  if (keys.length !== Object.keys(next).length) {
    return true;
  }
  let key;
  for (let i = keys.length - 1; i >= 0, key = keys[i]; i--) {
    if (next[key] !== prev[key]) {
      return true;
    }
  }
  return false;
}

/**
 * ReactiveMixin
 */
const reactiveMixin = {
  componentWillMount: function() {
    if (isUsingStaticRendering === true)
      return;
    // Generate friendly name for debugging
    const initialName = this.displayName || this.name ||
      this.constructor &&
        (this.constructor.displayName || this.constructor.name) ||
      "<component>";
    const rootNodeID = this._reactInternalInstance &&
      this._reactInternalInstance._rootNodeID;

    /**
     * If props are shallowly modified, react will render anyway,
     * so atom.reportChanged() should not result in yet another re-render
     */
    let skipRender = false;
    /**
     * forceUpdate will re-assign this.props. We don't want that to cause a loop,
     * so detect these changes
     */
    let isForcingUpdate = false;

    function makePropertyObservableReference(propName) {
      let self = this;
      let v;
      observer.observe(() => {
        let valueHolder = self[propName];
        if (!isForcingUpdate && !isObjectShallowModified(valueHolder, v)) {
          skipRender = true;
        }
        v = valueHolder;
      });
    }

    // make this.props an observable reference, see #124
    // makePropertyObservableReference.call(this, "props");
    // make state an observable reference
    //makePropertyObservableReference.call(this, "state");
    // wire up reactive render
    const baseRender = this.render.bind(this);
    let signal = null;
    let self = this;
    let renderResult = null;
    const initialRender = () => {
      if (!reactiveRender.$nx) {
        signal = observer.observe(() => {
          renderResult = baseRender();
          // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
          // This unidiomatic React usage but React will correctly warn about this so we continue as usual
          // See #85 / Pull #44
          if (typeof self.componentWillReact === "function")
            self.componentWillReact();
          // TODO: wrap in action?
          if (self.__$nxIsUnmounted !== true) {
            // If we are unmounted at this point, componentWillReact() had a side effect causing the component to unmounted
            // TODO: remove this check? Then react will properly warn about the fact that this should not happen? See #73
            // However, people also claim this migth happen during unit tests..
            let hasError = true;
            try {
              isForcingUpdate = true;
              if (!skipRender) {
                React.Component.prototype.forceUpdate.call(self);
              }
              hasError = false;
            } finally {
              isForcingUpdate = false;
              if (hasError)
                observer.unobserve(signal);
            }
          }
        });
      }
      reactiveRender.$nx = signal;
      this.render = reactiveRender;
      return reactiveRender();
    };

    const reactiveRender = () => {
      if (renderResult) {
        return renderResult;
      }
      return baseRender();
    };

    this.render = initialRender;
  },
  componentWillUnmount: function() {
    if (isUsingStaticRendering === true)
      return;
    this.render.$nx && observer.unobserve(this.render.$nx);
    this.__$nxIsUnmounted = true;
    if (isDevtoolsEnabled) {
      const node = findDOMNode(this);
      if (node && componentByNodeRegistery) {
        componentByNodeRegistery.delete(node);
      }
      renderReporter.emit({event: "destroy", component: this, node: node});
    }
  },
  componentDidMount: function() {
    if (isDevtoolsEnabled) {
      reportRendering(this);
    }
  },
  componentDidUpdate: function() {
    if (isDevtoolsEnabled) {
      reportRendering(this);
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (isUsingStaticRendering) {
      console.warn(
        "[nx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side."
      );
    }

    // update on any state changes (as is the default)
    if (this.state !== nextState) {
      return true;
    }
    // update if props are shallowly not equal, inspired by PureRenderMixin
    // we could return just 'false' here, and avoid the `skipRender` checks etc
    // however, it is nicer if lifecycle events are triggered like usually,
    // so we return true here if props are shallowly modified.
    return isObjectShallowModified(this.props, nextProps);
  }
};

/**
 * Observer function / decorator
 */
export function componentObserve(arg1, arg2) {
  if (typeof arg1 === "string") {
    throw new Error("Store names should be provided as array");
  }
  if (Array.isArray(arg1)) {
    // component needs stores
    if (!warnedAboutObserverInjectDeprecation) {
      warnedAboutObserverInjectDeprecation = true;
      console.warn(
        'nx-component-observe-react] Using componentObserve to inject stores is deprecated since 4.0. Use `@inject("store1", "store2") @componentObserve ComponentClass` or `inject("store1", "store2")(componentObserve(componentClass))` instead of `@componentObserve(["store1", "store2"]) ComponentClass`'
      );
    }
    if (!arg2) {
      // invoked as decorator
      return componentClass => componentObserve(arg1, componentClass);
    } else {
      return inject.apply(null, arg1)(componentObserve(arg2));
    }
  }
  const componentClass = arg1;

  if (componentClass.isNxInjector === true) {
    console.warn(
      "nx componentObserve: You are trying to use 'componentObserve' on a component that already has 'inject'. Please apply 'componentObserve' before applying 'inject'"
    );
  }

  // Stateless function component:
  // If it is function but doesn't seem to be a react class constructor,
  // wrap it to a react class automatically
  if (
    typeof componentClass === "function" &&
      (!componentClass.prototype || !componentClass.prototype.render) &&
      !componentClass.isReactClass &&
      !React.Component.isPrototypeOf(componentClass)
  ) {
    return componentObserve(
      React.createClass({
        displayName: componentClass.displayName || componentClass.name,
        propTypes: componentClass.propTypes,
        contextTypes: componentClass.contextTypes,
        getDefaultProps: function() {
          return componentClass.defaultProps;
        },
        render: function() {
          return componentClass.call(this, this.props, this.context);
        }
      })
    );
  }

  if (!componentClass) {
    throw new Error("Please pass a valid component to 'componentObserve'");
  }

  const target = componentClass.prototype || componentClass;
  mixinLifecycleEvents(target);
  componentClass.isNxReactObserver = true;
  return componentClass;
}

function mixinLifecycleEvents(target) {
  patch(target, "componentWillMount", true);
  [
    "componentDidMount",
    "componentWillUnmount",
    "componentDidUpdate"
  ].forEach(function(funcName) {
    patch(target, funcName);
  });
  if (!target.shouldComponentUpdate) {
    target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate;
  }
}

// TODO: support injection somehow as well?
export const ComponentObserve = componentObserve(({children}) => children());

ComponentObserve.propTypes = {children: React.PropTypes.func.isRequired};
