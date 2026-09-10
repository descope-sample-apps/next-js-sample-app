'use client';

import { useEffect } from 'react';

// Catches whatever removes a node from <head>. React crashes with
// "removeChild of null" when it deletes a hoisted head element (title / meta /
// link) that someone else already detached, and the culprit is whoever shows up
// in these logs BEFORE the crash.
export default function HeadProbe() {
  useEffect(() => {
    const describe = (n: Node) =>
      n instanceof Element
        ? n.outerHTML.slice(0, 140)
        : `#text ${n.textContent?.slice(0, 40)}`;

    const observer = new MutationObserver((records) => {
      records.forEach((r) =>
        r.removedNodes.forEach((n) =>
          // eslint-disable-next-line no-console
          console.warn('[head probe] node left <head>:', describe(n)),
        ),
      );
    });
    observer.observe(document.head, { childList: true });

    const origRemoveChild = Node.prototype.removeChild;
    const origRemove = Element.prototype.remove;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (this === document.head) {
        // eslint-disable-next-line no-console
        console.warn(
          '[head probe] removeChild:',
          describe(child),
          new Error().stack,
        );
      }
      return origRemoveChild.call(this, child) as T;
    };

    Element.prototype.remove = function () {
      if (this.parentNode === document.head) {
        // eslint-disable-next-line no-console
        console.warn('[head probe] .remove():', describe(this), new Error().stack);
      }
      return origRemove.call(this);
    };

    return () => {
      observer.disconnect();
      Node.prototype.removeChild = origRemoveChild;
      Element.prototype.remove = origRemove;
    };
  }, []);

  return null;
}
