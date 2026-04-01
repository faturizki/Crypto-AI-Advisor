#!/bin/bash
# @file jest.config.js
# @description Jest test configuration for monorepo

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "apps/**/src/**/*.ts",
    "packages/**/src/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  projects: [
    {
      displayName: "backend",
      testMatch: ["<rootDir>/apps/backend/src/**/*.test.ts"],
      preset: "ts-jest",
    },
    {
      displayName: "ai-scoring",
      testMatch: ["<rootDir>/packages/ai-scoring/src/**/*.test.ts"],
      preset: "ts-jest",
    },
  ],
};
