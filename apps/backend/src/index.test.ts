import { DexscreenerClient } from "../src/dexscreener";
import { Database } from "../src/database";

describe("DexscreenerClient", () => {
  it("should initialize without errors", () => {
    const client = new DexscreenerClient();
    expect(client).toBeDefined();
  });
});

describe("Database", () => {
  it("should throw error without credentials", () => {
    expect(() => new Database("", "")).toThrow();
  });
});
