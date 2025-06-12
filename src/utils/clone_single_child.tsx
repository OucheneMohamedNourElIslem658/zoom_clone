import clsx from "clsx";
import React from "react";

/** @internal */
export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, any>,
  key?: any,
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      const element = child as React.ReactElement<any>;
      if (element.props.className) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.className = clsx(element.props.className, props.className);
        props.style = { ...element.props.style, ...props.style };
      }
      return React.cloneElement(element, { ...props, key });
    }
    return child;
  });
}