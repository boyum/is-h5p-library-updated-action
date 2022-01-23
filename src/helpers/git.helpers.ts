import * as exec from "@actions/exec";
import * as github from "@actions/github";

export async function checkoutRepo(directoryName: string): Promise<void> {
  const { owner, repo } = github.context.repo;
  const gitHubUri = `git@github.com:${owner}/${repo}.git`;

  await exec.exec(`git clone ${gitHubUri} ${directoryName}`);
}

export async function checkoutMain(directoryName: string): Promise<void> {
  await checkoutRepo(directoryName);
}

export async function checkoutCurrentBranch(
  directoryName: string,
): Promise<void> {
  await checkoutRepo(directoryName);

  const currentBranch = github.context.ref.replace("refs/heads/", "");
  await exec.exec(`cd ${directoryName}`);
  await exec.exec(`git checkout ${currentBranch}`);
}
