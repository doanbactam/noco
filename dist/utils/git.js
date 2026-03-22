import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/utils/paths.ts
import path from "path";
import os from "os";
import fs from "fs/promises";
function getHomeDir() {
  return os.homedir();
}
function getConfig() {
  const homeDir = getHomeDir();
  const templateDir = path.join(homeDir, ".git-templates");
  const hooksDir = path.join(templateDir, "hooks");
  const hookFile = path.join(hooksDir, "commit-msg");
  return {
    templateDir,
    hooksDir,
    hookFile
  };
}
function toGitPath(filePath) {
  return filePath.replace(/\\/g, "/");
}
async function pathExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// src/utils/git.ts
import { execSync } from "child_process";
function getGitConfig(key) {
  try {
    const value = execSync(`git config --global ${key}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"]
    }).trim();
    return { exists: true, value };
  } catch (error) {
    return { exists: false, value: null };
  }
}
function setGitConfig(key, value) {
  execSync(`git config --global ${key} '${value}'`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"]
  });
}
function unsetGitConfig(key) {
  try {
    execSync(`git config --global --unset ${key}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"]
    });
  } catch {}
}
function getTemplateDir() {
  return getGitConfig("init.templatedir");
}
function setTemplateDir(templatePath) {
  const gitPath = toGitPath(templatePath);
  setGitConfig("init.templatedir", gitPath);
}
export {
  unsetGitConfig,
  setTemplateDir,
  setGitConfig,
  getTemplateDir,
  getGitConfig
};
