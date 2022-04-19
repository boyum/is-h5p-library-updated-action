import fs from "fs";
import type { Library } from "h5p-types";
import path from "path";
import type { Version } from "../types/version";

export async function findLibraryVersion(directory: string): Promise<Version> {
  const libraryString = (
    await fs.promises.readFile(path.join(directory, "library.json"))
  ).toString("utf-8");
  const library: Library = JSON.parse(libraryString);

  return library;
}

/**
 * Returns 1 if A is ahead of B, 0 if they are equal, -1 if B is ahead of A
 */
export function versionDifference(
  versionA: Version,
  versionB: Version,
): 1 | 0 | -1 {
  const versionsAreEqual =
    versionA.majorVersion === versionB.majorVersion &&
    versionA.minorVersion === versionB.minorVersion &&
    versionA.patchVersion === versionB.patchVersion;
  if (versionsAreEqual) {
    return 0;
  }

  const aIsAheadOfB =
    versionA.majorVersion > versionB.majorVersion ||
    (versionA.majorVersion === versionB.majorVersion &&
      versionA.minorVersion > versionB.minorVersion) ||
    (versionA.majorVersion === versionB.majorVersion &&
      versionA.minorVersion === versionB.minorVersion &&
      versionA.patchVersion > versionB.patchVersion);

  return aIsAheadOfB ? 1 : -1;
}

export function formatVersion(
  version: Version,
): `v${number}.${number}.${number}` {
  return `v${version.majorVersion}.${version.minorVersion}.${version.patchVersion}`;
}
