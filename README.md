# Is H5P library updated

This action checks whether the current branch's H5P version is ahead of, equal to or behind the main branch's H5P version, by checking the `library.json` files of the two branches.

## Usage

This action needs to be triggered by `pull_request`, something like this:

```yml
on:
  pull_request:
    types:
      - opened
      - synchronize
```

### Break the build if the version numbers aren't updated

```yml
- uses: boyum/is-h5p-library-updated-action@v1.1
  with:
    fail-if-not-ahead: true
```

### Post a comment if the version numbers aren't updated

```yml
- uses: boyum/is-h5p-library-updated-action@v1.1
  id: h5p-version-check

- uses: jwalton/gh-find-current-pr@v1 # https://github.com/jwalton/gh-find-current-pr
  id: findPrNumber

- name: Create comment
  uses: peter-evans/create-or-update-comment@v1 # https://github.com/peter-evans/create-or-update-comment
  if: ${{ steps.h5p-version-check.outputs.is-ahead == 'false' }}
  with:
    issue-number: ${{ steps.findPrNumber.outputs.number }}
    body: |
      The library version was not updated.

      Current version: ${{ steps.h5p-version-check.current-version-formatted }}
      Main version: ${{ steps.h5p-version-check.main-version-formatted }}
```

### Create a release only if there's a new version

```yml
- uses: boyum/is-h5p-library-updated-action@v1.1
  id: h5p-version-check

- uses: boyum/pack-h5p-action@0.0.6 # https://github.com/boyum/pack-h5p-action
  id: release-h5p

- uses: "marvinpinto/action-automatic-releases@latest" # https://github.com/marvinpinto/actions/tree/master/packages/automatic-releases
  if: ${{ github.ref == 'refs/heads/main' && steps.h5p-version-check.outputs.is-ahead == 'true' }}
  with:
    repo_token: "${{ secrets.GITHUB_TOKEN }}"
    automatic_release_tag: ${{steps.release-h5p.outputs.version}}
    prerelease: false
    files: |
      ${{steps.release-h5p.outputs.filePath}}
```

### Options

| Name | Required | Default value | Description |
|---|---|---|---|
| `github-token` | false | `secrets.GITHUB_TOKEN` | GITHUB_TOKEN or a repo scoped PAT. |
| `fail-if-not-ahead` | false | `false` | Fail this step if the current branch's version is not ahead of the main branch's version. |
| `working-directory` | false  | `.` | The directory where the library.json file is located, relative to the Git project. |

### Outputs

| Name | Description |
|---|---|
| `is-ahead` | True if the current branch's version is ahead of the main branch's version |
| `are-equal` | True if the current branch's version and the main branch's versions are equal |
| `is-behind` | True if the current branch's version is behind the main branch's version |
| `current-version` | The current version as a JSON string with `majorVersion`, `minorVersion`, and `patchVersion` properties |
| `main-version` | The main version as a JSON string with `majorVersion`, `minorVersion`, and `patchVersion` properties |
| `current-version-formatted` | The current version as a string on the format `vx.y.z` |
| `main-version-formatted` | The main version as a string on the format `vx.y.z` |

## Development

### Releasing new versions

#### Create release

Each release has its own Git *tag*. Do these steps to create a new release:

1. Create the tag: `git tag <version>`
1. Push the tag to origin: `git push origin <version>`

#### Update release

Because the release is now tagged to a specific commit, if you want to update the release, the tag has to be destroyed and re-created:

1. Delete the tag: `git push origin --delete <version>`
1. Delete the local tag: `git tag -d <version>`
1. Create the tag again: `git tag <version>`
1. Push the tag to origin: `git push origin <version>`
