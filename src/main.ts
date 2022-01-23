import * as core from "@actions/core";
import { checkoutMain, checkoutCurrentBranch } from "./helpers/git.helpers";
import {
  findLibraryVersion,
  formatVersion,
  versionDifference,
} from "./helpers/version.helpers";

const MAIN_DIRECTORY = "main";
const CURRENT_BRANCH_DIRECTORY = "current-branch";

const options = {
  githubToken: "github-token",
  failIfNotAhead: "fail-if-not-ahead",
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

    await checkoutMain(MAIN_DIRECTORY);
    await checkoutCurrentBranch(CURRENT_BRANCH_DIRECTORY, githubToken);

    const mainVersion = await findLibraryVersion(MAIN_DIRECTORY);
    const currentBranchVersion = await findLibraryVersion(
      CURRENT_BRANCH_DIRECTORY,
    );

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
