import { describe, expect, it } from "vitest";
import { formatDateTime, formatDuration, formatTime } from "./format";

describe("formatDuration", () => {
  it("gère les valeurs nulles", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(undefined)).toBe("—");
  });

  it("formate les millisecondes (< 1 s)", () => {
    expect(formatDuration(500)).toBe("500 ms");
  });

  it("formate en secondes avec 1 décimale max", () => {
    expect(formatDuration(1500)).toBe("1,5 s");
    expect(formatDuration(60000)).toBe("60 s");
  });
});

describe("formatDateTime / formatTime", () => {
  it("gère les valeurs nulles", () => {
    expect(formatDateTime(null)).toBe("—");
    expect(formatTime(undefined)).toBe("—");
  });

  it("affiche une date/heure locale", () => {
    const iso = "2026-09-07T17:54:22";
    expect(formatDateTime(iso)).toMatch(/\d{2}\/\d{2}\/\d{4}.+\d{2}:\d{2}/);
    expect(formatTime(iso)).toMatch(/\d{2}:\d{2}/);
  });
});