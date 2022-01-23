import * as exec from "@actions/exec";
import * as github from "@actions/github";

export async function checkoutMain(directoryName: string): Promise<void> {
  const { owner, repo } = github.context.repo;
  await exec.exec(`gh repo clone ${owner}/${repo} ${directoryName}`);
}

export async function checkoutCurrentBranch(
  directoryName: string,
): Promise<void> {
  const { owner, repo } = github.context.repo;
  const currentBranch = github.context.ref.replace("refs/heads/", "");

  await exec.exec(`gh repo clone ${owner}/${repo} ${directoryName}`);
  await exec.exec("cd current-branch");
  await exec.exec(`git checkout ${currentBranch}`);
}
