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
exports.GeneralContext = void 0;
const react_1 = __importStar(require("react"));
const DirectoryState_1 = __importDefault(require("./State/DirectoryState"));
const SettingsState_1 = __importDefault(require("./State/SettingsState"));
const ViewsState_tsx_1 = __importDefault(require("./State/ViewsState.tsx"));
const Page_1 = __importDefault(require("../DirectoryPage/Page"));
const DetailsView_1 = __importDefault(require("../DirectoryPage/Views/DetailsView"));
const Navbar_tsx_1 = __importDefault(require("../Navbar/Navbar.tsx"));
const DirectoryTree_1 = __importDefault(require("../DirectoryTree/DirectoryTree"));
const PageItem_1 = __importDefault(require("../DirectoryPage/Item/PageItem"));
const UIandUX_1 = __importDefault(require("./UIandUX"));
const Title_1 = __importDefault(require("../Miscellaneous/Title"));
const Sort_1 = __importDefault(require("../../Helpers/Sort"));
const FormatMetadata_1 = __importDefault(require("../../Helpers/FS and OS/FormatMetadata"));
const FormatDriveOutput_1 = __importDefault(require("../../Helpers/FS and OS/FormatDriveOutput"));
const FormatTrash_1 = __importDefault(require("../../Helpers/FS and OS/FormatTrash"));
const RandomID_1 = __importDefault(require("../../Helpers/RandomID"));
exports.GeneralContext = (0, react_1.createContext)();
const fs = window.require("fs");
const { execSync, exec } = window.require("child_process");
function App() {
    const { state, state: { currentDirectory, drive }, dispatch, } = (0, DirectoryState_1.default)();
    const { settings, setSettings } = (0, SettingsState_1.default)();
    const { views, views: { pageView, detailsTabWidth }, setViews, } = (0, ViewsState_tsx_1.default)();
    const [directoryItems, setDirectoryItems] = (0, react_1.useState)([]);
    const [selectedItems, setSelectedItems] = (0, react_1.useState)([]);
    const [lastSelected, setLastSelected] = (0, react_1.useState)();
    const [renameItem, setRenameItem] = (0, react_1.useState)({});
    const [popup, setPopup] = (0, react_1.useState)({});
    const [clipboard, setClipboard] = (0, react_1.useState)({});
    const [drag, setDrag] = (0, react_1.useState)({});
    const [reload, setReload] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)();
    const [title, setTitle] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        console.clear();
        execSync("powershell.exe Set-ExecutionPolicy RemoteSigned -Scope CurrentUser");
    }, []);
    (0, react_1.useEffect)(() => {
        function updatePage() {
            if (currentDirectory === "Trash") {
                exec(`powershell.exe "./resources/PS1Scripts/GetRecycleBin.ps1"`, (_error, output) => {
                    setDirectoryItems((0, FormatTrash_1.default)(output));
                    setLoading(false);
                });
            }
            else if (drive && currentDirectory) {
                document.title = currentDirectory || "";
                let result = [];
                try {
                    if (currentDirectory === "Trash") {
                        setDirectoryItems(JSON.parse(localStorage.getItem("trash")) || []);
                        return;
                    }
                    else {
                        result = fs
                            .readdirSync(currentDirectory, {
                            withFileTypes: true,
                        })
                            .map((file) => {
                            return (0, FormatMetadata_1.default)(file, currentDirectory, drive);
                        })
                            .filter((item) => {
                            return item.name && item;
                        });
                    }
                    setDirectoryItems(result);
                    (0, Sort_1.default)(setDirectoryItems, "name", true);
                }
                catch (e) {
                    if (currentDirectory) {
                        setPopup({
                            show: true,
                            body: (<div id="body">
                  <h1 id="description">{e.toString()}</h1>
                </div>),
                            ok: (<button onClick={() => {
                                    setPopup({});
                                }}>
                  OK
                </button>),
                        });
                    }
                }
                setLoading();
            }
            else {
                exec(`wmic LogicalDisk where(DriveType=3) get Name,Size,VolumeName, FreeSpace, FileSystem`, (_, data) => {
                    setDirectoryItems((0, FormatDriveOutput_1.default)(data));
                    setLoading();
                });
            }
        }
        setDirectoryItems([]);
        setLoading(true);
        updatePage();
        // eslint-disable-next-line
    }, [currentDirectory, reload, drive]);
    (0, react_1.useEffect)(() => {
        document.body.className = views.appTheme;
    }, [views.appTheme]);
    const renderDirectoryItems = directoryItems.map((directoryItem, indexOfDirectoryItem) => {
        if (!directoryItem.name) {
            return <react_1.Fragment key={(0, RandomID_1.default)()}/>;
        }
        return (<PageItem_1.default key={directoryItem.key || directoryItem.name} lastSelected={[lastSelected, setLastSelected]} selectedItems={[selectedItems, setSelectedItems]} detailsTabWidth={detailsTabWidth} directoryItem={directoryItem} setDrag={setDrag} indexOfDirectoryItem={indexOfDirectoryItem}/>);
    });
    return (<exports.GeneralContext.Provider value={{
            state,
            dispatch,
            directoryItems,
            setDirectoryItems,
            settings,
            setSettings,
            renameItem,
            setRenameItem,
            views,
            setViews,
        }}>
      <Navbar_tsx_1.default setPopup={setPopup} drag={drag}/>
      <DirectoryTree_1.default />
      <Page_1.default selectedItems={[selectedItems, setSelectedItems]} clipboard={clipboard} reload={reload} loading={loading} setLastSelected={setLastSelected}>
        {pageView === "details" && (<DetailsView_1.default detailsTabWidth={detailsTabWidth} viewTypes={[
                "Name",
                "Modified",
                "Type",
                "Size",
                "Dimensions",
                "Duration",
                "Description",
            ]} setDirectoryItems={setDirectoryItems} setSettings={setSettings}/>)}
        {renderDirectoryItems}
      </Page_1.default>
      <UIandUX_1.default lastSelected={[lastSelected, setLastSelected]} selectedItems={[selectedItems, setSelectedItems]} popup={[popup, setPopup]} clipboard={[clipboard, setClipboard]} drag={[drag, setDrag]} reload={[reload, setReload]}/>
      <Title_1.default title={title} setTitle={setTitle}/>
      {drag.x && drag.y && (<div id="drag-box" style={{
                left: drag.x + "px",
                top: drag.y + "px",
            }}>
          <p id="count">{selectedItems.length}</p>
          <div id="mode">
            {drag.mode ? (`
              + ${drag.mode === "move" ? "Move" : "Copy"} items to ${drag.destination}`) : (<div id="not-allowed">
                <div id="line-through"/>
              </div>)}
          </div>
        </div>)}
    </exports.GeneralContext.Provider>);
}
exports.default = App;
