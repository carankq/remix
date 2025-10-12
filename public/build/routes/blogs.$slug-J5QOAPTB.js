import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Footer,
  Header
} from "/build/_shared/chunk-AU4OH443.js";
import {
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

// app/routes/blogs.$slug.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/blogs.$slug.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/blogs.$slug.tsx"
  );
  import.meta.hot.lastModified = "1760269068531.3462";
}
function BlogSlugRoute() {
  _s();
  const {
    md,
    slug
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container px-4 py-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white border border-gray-100 rounded-md px-4 py-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", { style: {
      whiteSpace: "pre-wrap"
    }, children: md }, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 55,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 54,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Footer, {}, void 0, false, {
      fileName: "app/routes/blogs.$slug.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/blogs.$slug.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s(BlogSlugRoute, "G8d0U6yyy+D92tKUWV9oB8dQaK0=", false, function() {
  return [useLoaderData];
});
_c = BlogSlugRoute;
var _c;
$RefreshReg$(_c, "BlogSlugRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  BlogSlugRoute as default
};
//# sourceMappingURL=/build/routes/blogs.$slug-J5QOAPTB.js.map
