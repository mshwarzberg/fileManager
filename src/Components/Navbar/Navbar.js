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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ButtonNavigation_1 = __importDefault(require("./ButtonNavigation"));
const Main_tsx_1 = require("../Main/Main.tsx");
const TrashButtons_1 = __importDefault(require("./TrashButtons"));
const CurrentDirectory_1 = __importDefault(require("./CurrentDirectory"));
function Navbar({ setPopup, drag }) {
    const { state: { currentDirectory }, setSettings, settings: { showDirectoryTree }, views: { appTheme }, directoryItems, setDirectoryItems, } = (0, react_1.useContext)(Main_tsx_1.GeneralContext);
    return (<div id="navbar" className={`navbar-${appTheme}`}>
      <button className={`button-${appTheme}`} id="toggle-directory-tree" onClick={() => {
            setSettings((prevSettings) => (Object.assign(Object.assign({}, prevSettings), { showDirectoryTree: !prevSettings.showDirectoryTree })));
        }}>
        {showDirectoryTree ? "Hide" : "Show"} Tree
      </button>
      <ButtonNavigation_1.default />
      {currentDirectory === "Trash" ? (<TrashButtons_1.default setPopup={setPopup} directoryItems={directoryItems} setDirectoryItems={setDirectoryItems}/>) : (<CurrentDirectory_1.default drag={drag} setPopup={setPopup}/>)}
    </div>);
}
exports.default = Navbar;
