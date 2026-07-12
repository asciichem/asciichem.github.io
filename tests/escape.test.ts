import { describe, it, expect } from "vitest";
import { escapeHtml } from "../src/lib/escape.ts";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<tag>")).toBe("&lt;tag&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('"hi"')).toBe("&quot;hi&quot;");
  });

  it("passes through chemistry source unchanged", () => {
    expect(escapeHtml("H_2O")).toBe("H_2O");
    expect(escapeHtml("^14C")).toBe("^14C");
    expect(escapeHtml("Ca^2+")).toBe("Ca^2+");
  });

  it("handles empty strings", () => {
    expect(escapeHtml("")).toBe("");
  });
});
