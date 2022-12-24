"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
var Theme;
(function (Theme) {
    Theme["darkMode"] = "dark-mode";
    Theme["lightMode"] = "light-mode";
    Theme["skyBlue"] = "sky-blue";
})(Theme || (Theme = {}));
var View;
(function (View) {
    View["icon"] = "icon";
    View["content"] = "content";
    View["details"] = "details";
    View["list"] = "list";
    View["tiles"] = "tiles";
})(View || (View = {}));
const ViewsState = () => {
    const initViews = JSON.parse(localStorage.getItem("views") || "{}");
    const [views, setViews] = (0, react_1.useState)({
        pageCompactView: initViews.pageCompactView,
        treeCompactView: initViews.treeCompactView,
        appTheme: initViews.appTheme || Theme.lightMode,
        pageView: initViews.pageView || View.icon,
        treeWidth: initViews.treeWidth || 260,
        iconSize: initViews.iconSize || 12,
        detailsTabWidth: initViews.detailsTabWidth || {
            name: 15,
            modified: 12,
            type: 8,
            size: 5,
            duration: 5,
            dimensions: 5,
            description: 15,
        },
        detailsTabWidthLimits: {
            name: [5, 35],
            modified: [8, 15],
            type: [5, 10],
            size: [5, 8],
            duration: [5, 10],
            dimensions: [5, 10],
            description: [10, Infinity],
        },
    });
    (0, react_1.useEffect)(() => {
        localStorage.setItem("views", JSON.stringify(views));
    }, [views]);
    return { views, setViews };
};
exports.default = ViewsState;
