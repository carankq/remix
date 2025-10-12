import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Footer,
  Header
} from "/build/_shared/chunk-AU4OH443.js";
import {
  Link,
  useLoaderData
} from "/build/_shared/chunk-GMJD2T6U.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-EO5KY7YH.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/blogs._index.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/blogs._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/blogs._index.tsx"
  );
  import.meta.hot.lastModified = "1760269058383.1968";
}
function BlogsIndexRoute() {
  _s();
  const {
    items
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/blogs._index.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container px-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl text-gray-900 mb-4", children: "Blogs" }, void 0, false, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white border border-gray-100 rounded-md", children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-4 text-gray-600", children: "No blogs." }, void 0, false, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 51,
        columnNumber: 35
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { children: items.map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-3 border border-gray-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-gray-900", children: b.title }, void 0, false, {
            fileName: "app/routes/blogs._index.tsx",
            lineNumber: 55,
            columnNumber: 25
          }, this),
          b.summary && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-gray-600", children: b.summary }, void 0, false, {
            fileName: "app/routes/blogs._index.tsx",
            lineNumber: 56,
            columnNumber: 39
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/blogs._index.tsx",
          lineNumber: 54,
          columnNumber: 23
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/blogs/${b.slug}`, className: "no-underline text-gray-900", children: "Read \u2192" }, void 0, false, {
          fileName: "app/routes/blogs._index.tsx",
          lineNumber: 58,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 53,
        columnNumber: 21
      }, this) }, b.slug, false, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 52,
        columnNumber: 33
      }, this)) }, void 0, false, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 51,
        columnNumber: 94
      }, this) }, void 0, false, {
        fileName: "app/routes/blogs._index.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/blogs._index.tsx",
      lineNumber: 48,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/blogs._index.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Footer, {}, void 0, false, {
      fileName: "app/routes/blogs._index.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/blogs._index.tsx",
    lineNumber: 45,
    columnNumber: 10
  }, this);
}
_s(BlogsIndexRoute, "QTcMLrwv6qbqQLxz/9EAbv4V7kM=", false, function() {
  return [useLoaderData];
});
_c = BlogsIndexRoute;
var _c;
$RefreshReg$(_c, "BlogsIndexRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  BlogsIndexRoute as default
};
//# sourceMappingURL=/build/routes/blogs._index-YW5QUUK3.js.map
