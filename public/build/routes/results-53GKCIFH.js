import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Footer,
  Header
} from "/build/_shared/chunk-AU4OH443.js";
import {
  Form,
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

// app/routes/results.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/results.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/results.tsx"
  );
  import.meta.hot.lastModified = "1760268019302.0146";
}
function ResultsRoute() {
  _s();
  const {
    instructors
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "bg-deep-navy pt-20 pb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container px-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl text-white", children: "Results" }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 57,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "count-pill", children: [
          instructors.length,
          " matches"
        ] }, void 0, true, {
          fileName: "app/routes/results.tsx",
          lineNumber: 58,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/results.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "flex items-center gap-3 mt-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { name: "q", placeholder: "Search", className: "w-full" }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 61,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { name: "postcode", placeholder: "Postcode(s)", className: "w-full" }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 62,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "btn btn-primary", children: "Update" }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/results.tsx",
        lineNumber: 60,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/results.tsx",
      lineNumber: 55,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 54,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container px-4 py-8", children: instructors.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white border border-gray-100 rounded-md px-4 py-4 text-gray-600", children: "No instructors found." }, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 70,
      columnNumber: 39
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-4", children: instructors.map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: "bg-white border border-gray-100 rounded-md px-4 py-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-2xl text-gray-900", children: i.name }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 74,
          columnNumber: 23
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-gray-600", children: i.description }, void 0, false, {
          fileName: "app/routes/results.tsx",
          lineNumber: 75,
          columnNumber: 23
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-gray-600 mt-6", children: [
          "\xA3",
          i.pricePerHour,
          "/hr \u2022 ",
          i.vehicleType,
          " \u2022 ",
          i.yearsOfExperience,
          " yrs \u2022 ",
          i.rating,
          "\u2605 (",
          i.totalReviews,
          ")"
        ] }, void 0, true, {
          fileName: "app/routes/results.tsx",
          lineNumber: 76,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/results.tsx",
        lineNumber: 73,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/contact?id=${i.id}`, className: "btn btn-primary", children: "Contact" }, void 0, false, {
        fileName: "app/routes/results.tsx",
        lineNumber: 79,
        columnNumber: 23
      }, this) }, void 0, false, {
        fileName: "app/routes/results.tsx",
        lineNumber: 78,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/results.tsx",
      lineNumber: 72,
      columnNumber: 19
    }, this) }, i.id, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 71,
      columnNumber: 37
    }, this)) }, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 70,
      columnNumber: 153
    }, this) }, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 69,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 68,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Footer, {}, void 0, false, {
      fileName: "app/routes/results.tsx",
      lineNumber: 86,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/results.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
_s(ResultsRoute, "tM2JjQ7afm1XQt+cfm8uY3VRoDc=", false, function() {
  return [useLoaderData];
});
_c = ResultsRoute;
var _c;
$RefreshReg$(_c, "ResultsRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ResultsRoute as default
};
//# sourceMappingURL=/build/routes/results-53GKCIFH.js.map
