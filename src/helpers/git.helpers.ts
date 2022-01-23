import * as exec from "@actions/exec";
import * as github from "@actions/github";

export async function authenticate(): Promise<void> {
  await exec.exec(`git config --global user.email "action@github.com"`);
  await exec.exec(`git config --global user.name "GitHub Action"`);
}

export async function checkoutRepo(directoryName: string): Promise<void> {
  const { owner, repo } = github.context.repo;
  const gitHubUri = `https://github.com/${owner}/${repo}.git`;

  await authenticate();
  await exec.exec(`git clone ${gitHubUri} ${directoryName}`);
}

export async function checkoutMain(directoryName: string): Promise<void> {
  await checkoutRepo(directoryName);
}

export async function checkoutCurrentBranch(
  directoryName: string,
  githubToken: string,
): Promise<void> {
  await checkoutRepo(directoryName);

  const currentBranch = await getBranchName(githubToken);

  await exec.exec(`git checkout ${currentBranch}`, undefined, {
    cwd: directoryName,
  });
}

export function getPrNumber(): number {
  const pullRequest = github.context.payload.pull_request;

  if (!pullRequest) {
    throw new Error(
      "Action was not triggered by `pull_request`, thus cannot complete.",
    );
  }

  return pullRequest.number;
}

export async function getBranchName(githubToken: string): Promise<string> {
  const octokit = github.getOctokit(githubToken);
  const { owner, repo } = github.context.repo;
  const prNumber = getPrNumber();

  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  return response.data.head.ref;
}
