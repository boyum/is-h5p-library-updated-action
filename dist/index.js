import './sourcemap-register.cjs';/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (undefined && undefined.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (undefined && undefined.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const path_1 = require("path");
const git_helpers_1 = require("./helpers/git.helpers");
const version_helpers_1 = require("./helpers/version.helpers");
const MAIN_DIRECTORY = "main";
const CURRENT_BRANCH_DIRECTORY = "current-branch";
const options = {
    githubToken: "github-token",
    failIfNotAhead: "fail-if-not-ahead",
    workingDirectory: "working-directory",
};
const outputs = {
    isAhead: "is-ahead",
    areEqual: "are-equal",
    isBehind: "is-behind",
    currentVersion: "current-version",
    mainVersion: "main-version",
    currentVersionFormatted: "current-version-formatted",
    mainVersionFormatted: "main-version-formatted",
};
async function run() {
    try {
        const githubToken = core.getInput(options.githubToken);
        const failIfNotAhead = core.getInput(options.failIfNotAhead) === "true";
        const workingDirectory = core.getInput(options.workingDirectory);
        core.info(`Ref: '${github.context.ref}'`);
        core.info(`Event name: '${github.context.eventName}'`);
        core.info(`Action: '${github.context.action}'`);
        core.info("Options:");
        core.info(`${options.failIfNotAhead}: '${failIfNotAhead}'`);
        core.info(`${options.workingDirectory}: '${workingDirectory}'`);
        await (0, git_helpers_1.checkoutMain)(MAIN_DIRECTORY);
        await (0, git_helpers_1.checkoutCurrentBranch)(CURRENT_BRANCH_DIRECTORY, githubToken);
        const mainLibrary = (0, path_1.join)(MAIN_DIRECTORY, workingDirectory);
        const mainVersion = await (0, version_helpers_1.findLibraryVersion)(mainLibrary);
        const currentBranchLibrary = (0, path_1.join)(CURRENT_BRANCH_DIRECTORY, workingDirectory);
        const currentBranchVersion = await (0, version_helpers_1.findLibraryVersion)(currentBranchLibrary);
        const versionDiff = (0, version_helpers_1.versionDifference)(currentBranchVersion, mainVersion);
        const isAhead = versionDiff === 1;
        const areEqual = versionDiff === 0;
        const isBehind = versionDiff === -1;
        core.setOutput(outputs.isAhead, isAhead);
        core.setOutput(outputs.areEqual, areEqual);
        core.setOutput(outputs.isBehind, isBehind);
        core.setOutput(outputs.currentVersion, currentBranchVersion);
        core.setOutput(outputs.mainVersion, mainVersion);
        core.setOutput(outputs.currentVersionFormatted, (0, version_helpers_1.formatVersion)(currentBranchVersion));
        core.setOutput(outputs.mainVersionFormatted, (0, version_helpers_1.formatVersion)(mainVersion));
        if (failIfNotAhead && !isAhead) {
            core.setFailed(`Current branch's version is not ahead of main branch.
      Remember to update \`library.json\`.
      Current branch version: ${(0, version_helpers_1.formatVersion)(currentBranchVersion)}.
      Main version: ${(0, version_helpers_1.formatVersion)(mainVersion)}`);
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
run();


//# sourceMappingURL=index.js.map