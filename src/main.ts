import * as core from "@actions/core";
import * as github from "@actions/github";
import { join } from "node:path";
import { checkoutCurrentBranch, checkoutMain } from "./helpers/git.helpers.js";
import {
  findLibraryVersion,
  formatVersion,
  versionDifference,
} from "./helpers/version.helpers.js";

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

async function run(): Promise<void> {
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

    await checkoutMain(MAIN_DIRECTORY);
    await checkoutCurrentBranch(CURRENT_BRANCH_DIRECTORY, githubToken);

    const mainLibrary = join(MAIN_DIRECTORY, workingDirectory);
    const mainVersion = await findLibraryVersion(mainLibrary);

    const currentBranchLibrary = join(
      CURRENT_BRANCH_DIRECTORY,
      workingDirectory,
    );
    const currentBranchVersion = await findLibraryVersion(currentBranchLibrary);

    const versionDiff = versionDifference(currentBranchVersion, mainVersion);

    const isAhead = versionDiff === 1;
    const areEqual = versionDiff === 0;
    const isBehind = versionDiff === -1;

    core.setOutput(outputs.isAhead, isAhead);
    core.setOutput(outputs.areEqual, areEqual);
    core.setOutput(outputs.isBehind, isBehind);

    core.setOutput(outputs.currentVersion, currentBranchVersion);
    core.setOutput(outputs.mainVersion, mainVersion);

    core.setOutput(
      outputs.currentVersionFormatted,
      formatVersion(currentBranchVersion),
    );
    core.setOutput(outputs.mainVersionFormatted, formatVersion(mainVersion));

    if (failIfNotAhead && !isAhead) {
      core.setFailed(`Current branch's version is not ahead of main branch.
      Remember to update \`library.json\`.
      Current branch version: ${formatVersion(currentBranchVersion)}.
      Main version: ${formatVersion(mainVersion)}`);
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
