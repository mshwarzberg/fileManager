"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Main_tsx_1 = require("../Main/Main.tsx");
function View({ contextMenu }) {
    const { setViews, views: { iconSize, pageView }, } = (0, react_1.useContext)(Main_tsx_1.GeneralContext);
    const views = ["Small", "Medium", "Large", "Extra Large"];
    function matchSize() {
        if (iconSize <= 8) {
            return "Small";
        }
        if (iconSize > 8 && iconSize <= 10) {
            return "Medium";
        }
        if (iconSize > 10 && iconSize <= 12) {
            return "Large";
        }
        return "Extra Large";
    }
    return (<div className={`sort-by-sub-menu ${contextMenu.x + 320 > window.innerWidth ? "position-left" : ""}`}>
      {views.map((viewOption) => {
            return (<button key={viewOption} onClick={() => {
                    let newSize;
                    switch (viewOption) {
                        case "Small":
                            newSize = 8;
                            break;
                        case "Medium":
                            newSize = 10;
                            break;
                        case "Large":
                            newSize = 12;
                            break;
                        case "Extra Large":
                            newSize = 14;
                            break;
                        default:
                            newSize = 10;
                    }
                    setViews((prevViews) => (Object.assign(Object.assign({}, prevViews), { iconSize: newSize, pageView: "icon" })));
                }}>
            {viewOption === matchSize() && pageView === "icon" && (<div id="dot"/>)}
            {viewOption} Icons
          </button>);
        })}
      <div id="divider" style={{
            height: "1rem",
            backgroundColor: "rebeccapurple",
            width: "100%",
        }}/>
      {["List", "Details", "Tiles", "Content"].map((view) => {
            return (<button key={view} onClick={() => {
                    setViews((prevViews) => (Object.assign(Object.assign({}, prevViews), { pageView: view.toLowerCase() })));
                }}>
            {view.toLowerCase() === pageView && <div id="dot"/>}
            {view}
          </button>);
        })}
    </div>);
}
exports.default = View;
