import { describe, it, expect } from "vitest";
import type { Version } from "../types/version.js";
import { versionDifference } from "./version.helpers.js";

describe(versionDifference.name, () => {
  it("should return 1 if the first version is ahead of the second: major", () => {
    const versionA: Version = {
      majorVersion: 1,
      minorVersion: 0,
      patchVersion: 0,
    };

    const versionB: Version = {
      majorVersion: 0,
      minorVersion: 1,
      patchVersion: 1,
    };

    const expected = 1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return 1 if the first version is ahead of the second: minor", () => {
    const versionA: Version = {
      majorVersion: 0,
      minorVersion: 1,
      patchVersion: 0,
    };

    const versionB: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 1,
    };

    const expected = 1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return 1 if the first version is ahead of the second: patch", () => {
    const versionA: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 1,
    };

    const versionB: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 0,
    };

    const expected = 1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return 0 if the first version is equal to the second", () => {
    const versionA: Version = {
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    const versionB: Version = {
      majorVersion: 1,
      minorVersion: 1,
      patchVersion: 1,
    };

    const expected = 0;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return -1 if the first version is behind the second: major", () => {
    const versionA: Version = {
      majorVersion: 0,
      minorVersion: 1,
      patchVersion: 1,
    };

    const versionB: Version = {
      majorVersion: 1,
      minorVersion: 0,
      patchVersion: 0,
    };

    const expected = -1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return -1 if the first version is behind the second: minor", () => {
    const versionA: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 1,
    };

    const versionB: Version = {
      majorVersion: 0,
      minorVersion: 1,
      patchVersion: 0,
    };

    const expected = -1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });

  it("should return -1 if the first version is behind the second: patch", () => {
    const versionA: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 0,
    };

    const versionB: Version = {
      majorVersion: 0,
      minorVersion: 0,
      patchVersion: 1,
    };

    const expected = -1;
    const actual = versionDifference(versionA, versionB);

    expect(actual).toBe<typeof actual>(expected);
  });
});
