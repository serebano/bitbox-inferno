/**
 * Turns a React component or stateless render function into a reactive component.
 */
import React = require("react");

export type IStoresToProps<T, P> = (stores: any, nextProps: P, context:any) => T;
export type IReactComponent<P> = React.StatelessComponent<P> | React.ComponentClass<P>

export function componentObserve<P>(clazz: IReactComponent<P>): React.ClassicComponentClass<P>;
export function componentObserve<P>(clazz: React.ClassicComponentClass<P>): React.ClassicComponentClass<P>;
export function componentObserve<P, TFunction extends React.ComponentClass<P>>(target: TFunction): TFunction; // decorator signature

export function inject<P>(...stores: string[]): <TFunction extends IReactComponent<P>>(target: TFunction) => TFunction; // decorator signature
export function inject<T, P>(storesToProps : IStoresToProps<T, P>): <TFunction extends IReactComponent<T | P>>(target: TFunction) => TFunction; // decorator

// Deprecated: componentObserve with with stores
export function componentObserve<P>(stores: string[], clazz: IReactComponent<P>): React.ClassicComponentClass<P>;
export function componentObserve<P>(stores: string[], clazz: React.ClassicComponentClass<P>): React.ClassicComponentClass<P>;
export function componentObserve<P>(stores: string[]): <TFunction extends IReactComponent<P>>(target: TFunction) => TFunction; // decorator signature

export class Provider extends React.Component<any, {}> {

}

export class componentObserve extends React.Component<{ children?: () => React.ReactElement<any> }, {}> {

}

export function useStaticRendering(value: boolean): void;

/**
 * Enable dev tool support, makes sure that renderReport emits events.
 */
export function trackComponents():void;

export const renderReporter: RenderReporter;

export interface RenderReporter {
  on(handler: (data: IRenderEvent) => void): void;
}

export interface IRenderEvent {
    event: "render" | "destroy";
    renderTime?: number;
    totalTime?: number;
    component: React.ReactElement<any>; // Component instance
    node: any; // DOMNode
}

/**
 * WeakMap DOMNode -> Component instance
 */
export const componentByNodeRegistery: any;

