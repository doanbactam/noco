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

// node_modules/mimic-function/index.js
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
}, canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === undefined || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
}, changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
}, wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`, toStringDescriptor, toStringName, changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  const { writable, enumerable, configurable } = toStringDescriptor;
  Object.defineProperty(to, "toString", { value: newToString, writable, enumerable, configurable });
};
var init_mimic_function = __esm(() => {
  toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
  toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
});

// node_modules/restore-cursor/node_modules/onetime/index.js
var calledFunctions, onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = undefined;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
}, onetime_default;
var init_onetime = __esm(() => {
  init_mimic_function();
  calledFunctions = new WeakMap;
  onetime.callCount = (function_) => {
    if (!calledFunctions.has(function_)) {
      throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
    }
    return calledFunctions.get(function_);
  };
  onetime_default = onetime;
});

// node_modules/restore-cursor/node_modules/signal-exit/dist/mjs/signals.js
var signals;
var init_signals = __esm(() => {
  signals = [];
  signals.push("SIGHUP", "SIGINT", "SIGTERM");
  if (process.platform !== "win32") {
    signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
  }
  if (process.platform === "linux") {
    signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
  }
});

// node_modules/restore-cursor/node_modules/signal-exit/dist/mjs/index.js
class Emitter {
  emitted = {
    afterExit: false,
    exit: false
  };
  listeners = {
    afterExit: [],
    exit: []
  };
  count = 0;
  id = Math.random();
  constructor() {
    if (global[kExitEmitter]) {
      return global[kExitEmitter];
    }
    ObjectDefineProperty(global, kExitEmitter, {
      value: this,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  on(ev, fn) {
    this.listeners[ev].push(fn);
  }
  removeListener(ev, fn) {
    const list = this.listeners[ev];
    const i = list.indexOf(fn);
    if (i === -1) {
      return;
    }
    if (i === 0 && list.length === 1) {
      list.length = 0;
    } else {
      list.splice(i, 1);
    }
  }
  emit(ev, code, signal) {
    if (this.emitted[ev]) {
      return false;
    }
    this.emitted[ev] = true;
    let ret = false;
    for (const fn of this.listeners[ev]) {
      ret = fn(code, signal) === true || ret;
    }
    if (ev === "exit") {
      ret = this.emit("afterExit", code, signal) || ret;
    }
    return ret;
  }
}

class SignalExitBase {
}
var processOk = (process3) => !!process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function", kExitEmitter, global, ObjectDefineProperty, signalExitWrap = (handler) => {
  return {
    onExit(cb, opts) {
      return handler.onExit(cb, opts);
    },
    load() {
      return handler.load();
    },
    unload() {
      return handler.unload();
    }
  };
}, SignalExitFallback, SignalExit, process3, onExit, load, unload;
var init_mjs = __esm(() => {
  init_signals();
  kExitEmitter = Symbol.for("signal-exit emitter");
  global = globalThis;
  ObjectDefineProperty = Object.defineProperty.bind(Object);
  SignalExitFallback = class SignalExitFallback extends SignalExitBase {
    onExit() {
      return () => {};
    }
    load() {}
    unload() {}
  };
  SignalExit = class SignalExit extends SignalExitBase {
    #hupSig = process3.platform === "win32" ? "SIGINT" : "SIGHUP";
    #emitter = new Emitter;
    #process;
    #originalProcessEmit;
    #originalProcessReallyExit;
    #sigListeners = {};
    #loaded = false;
    constructor(process3) {
      super();
      this.#process = process3;
      this.#sigListeners = {};
      for (const sig of signals) {
        this.#sigListeners[sig] = () => {
          const listeners = this.#process.listeners(sig);
          let { count } = this.#emitter;
          const p = process3;
          if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
            count += p.__signal_exit_emitter__.count;
          }
          if (listeners.length === count) {
            this.unload();
            const ret = this.#emitter.emit("exit", null, sig);
            const s = sig === "SIGHUP" ? this.#hupSig : sig;
            if (!ret)
              process3.kill(process3.pid, s);
          }
        };
      }
      this.#originalProcessReallyExit = process3.reallyExit;
      this.#originalProcessEmit = process3.emit;
    }
    onExit(cb, opts) {
      if (!processOk(this.#process)) {
        return () => {};
      }
      if (this.#loaded === false) {
        this.load();
      }
      const ev = opts?.alwaysLast ? "afterExit" : "exit";
      this.#emitter.on(ev, cb);
      return () => {
        this.#emitter.removeListener(ev, cb);
        if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) {
          this.unload();
        }
      };
    }
    load() {
      if (this.#loaded) {
        return;
      }
      this.#loaded = true;
      this.#emitter.count += 1;
      for (const sig of signals) {
        try {
          const fn = this.#sigListeners[sig];
          if (fn)
            this.#process.on(sig, fn);
        } catch (_) {}
      }
      this.#process.emit = (ev, ...a) => {
        return this.#processEmit(ev, ...a);
      };
      this.#process.reallyExit = (code) => {
        return this.#processReallyExit(code);
      };
    }
    unload() {
      if (!this.#loaded) {
        return;
      }
      this.#loaded = false;
      signals.forEach((sig) => {
        const listener = this.#sigListeners[sig];
        if (!listener) {
          throw new Error("Listener not defined for signal: " + sig);
        }
        try {
          this.#process.removeListener(sig, listener);
        } catch (_) {}
      });
      this.#process.emit = this.#originalProcessEmit;
      this.#process.reallyExit = this.#originalProcessReallyExit;
      this.#emitter.count -= 1;
    }
    #processReallyExit(code) {
      if (!processOk(this.#process)) {
        return 0;
      }
      this.#process.exitCode = code || 0;
      this.#emitter.emit("exit", this.#process.exitCode, null);
      return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
    }
    #processEmit(ev, ...args) {
      const og = this.#originalProcessEmit;
      if (ev === "exit" && processOk(this.#process)) {
        if (typeof args[0] === "number") {
          this.#process.exitCode = args[0];
        }
        const ret = og.call(this.#process, ev, ...args);
        this.#emitter.emit("exit", this.#process.exitCode, null);
        return ret;
      } else {
        return og.call(this.#process, ev, ...args);
      }
    }
  };
  process3 = globalThis.process;
  ({
    onExit,
    load,
    unload
  } = signalExitWrap(processOk(process3) ? new SignalExit(process3) : new SignalExitFallback));
});

// node_modules/restore-cursor/index.js
import process4 from "node:process";
var terminal, restoreCursor, restore_cursor_default;
var init_restore_cursor = __esm(() => {
  init_onetime();
  init_mjs();
  terminal = process4.stderr.isTTY ? process4.stderr : process4.stdout.isTTY ? process4.stdout : undefined;
  restoreCursor = terminal ? onetime_default(() => {
    onExit(() => {
      terminal.write("\x1B[?25h");
    }, { alwaysLast: true });
  }) : () => {};
  restore_cursor_default = restoreCursor;
});

// node_modules/cli-cursor/index.js
import process5 from "node:process";
var isHidden = false, cliCursor, cli_cursor_default;
var init_cli_cursor = __esm(() => {
  init_restore_cursor();
  cliCursor = {};
  cliCursor.show = (writableStream = process5.stderr) => {
    if (!writableStream.isTTY) {
      return;
    }
    isHidden = false;
    writableStream.write("\x1B[?25h");
  };
  cliCursor.hide = (writableStream = process5.stderr) => {
    if (!writableStream.isTTY) {
      return;
    }
    restore_cursor_default();
    isHidden = true;
    writableStream.write("\x1B[?25l");
  };
  cliCursor.toggle = (force, writableStream) => {
    if (force !== undefined) {
      isHidden = force;
    }
    if (isHidden) {
      cliCursor.show(writableStream);
    } else {
      cliCursor.hide(writableStream);
    }
  };
  cli_cursor_default = cliCursor;
});

// node_modules/cli-spinners/spinners.json
var require_spinners = __commonJS((exports, module) => {
  module.exports = {
    dots: {
      interval: 80,
      frames: [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏"
      ]
    },
    dots2: {
      interval: 80,
      frames: [
        "⣾",
        "⣽",
        "⣻",
        "⢿",
        "⡿",
        "⣟",
        "⣯",
        "⣷"
      ]
    },
    dots3: {
      interval: 80,
      frames: [
        "⠋",
        "⠙",
        "⠚",
        "⠞",
        "⠖",
        "⠦",
        "⠴",
        "⠲",
        "⠳",
        "⠓"
      ]
    },
    dots4: {
      interval: 80,
      frames: [
        "⠄",
        "⠆",
        "⠇",
        "⠋",
        "⠙",
        "⠸",
        "⠰",
        "⠠",
        "⠰",
        "⠸",
        "⠙",
        "⠋",
        "⠇",
        "⠆"
      ]
    },
    dots5: {
      interval: 80,
      frames: [
        "⠋",
        "⠙",
        "⠚",
        "⠒",
        "⠂",
        "⠂",
        "⠒",
        "⠲",
        "⠴",
        "⠦",
        "⠖",
        "⠒",
        "⠐",
        "⠐",
        "⠒",
        "⠓",
        "⠋"
      ]
    },
    dots6: {
      interval: 80,
      frames: [
        "⠁",
        "⠉",
        "⠙",
        "⠚",
        "⠒",
        "⠂",
        "⠂",
        "⠒",
        "⠲",
        "⠴",
        "⠤",
        "⠄",
        "⠄",
        "⠤",
        "⠴",
        "⠲",
        "⠒",
        "⠂",
        "⠂",
        "⠒",
        "⠚",
        "⠙",
        "⠉",
        "⠁"
      ]
    },
    dots7: {
      interval: 80,
      frames: [
        "⠈",
        "⠉",
        "⠋",
        "⠓",
        "⠒",
        "⠐",
        "⠐",
        "⠒",
        "⠖",
        "⠦",
        "⠤",
        "⠠",
        "⠠",
        "⠤",
        "⠦",
        "⠖",
        "⠒",
        "⠐",
        "⠐",
        "⠒",
        "⠓",
        "⠋",
        "⠉",
        "⠈"
      ]
    },
    dots8: {
      interval: 80,
      frames: [
        "⠁",
        "⠁",
        "⠉",
        "⠙",
        "⠚",
        "⠒",
        "⠂",
        "⠂",
        "⠒",
        "⠲",
        "⠴",
        "⠤",
        "⠄",
        "⠄",
        "⠤",
        "⠠",
        "⠠",
        "⠤",
        "⠦",
        "⠖",
        "⠒",
        "⠐",
        "⠐",
        "⠒",
        "⠓",
        "⠋",
        "⠉",
        "⠈",
        "⠈"
      ]
    },
    dots9: {
      interval: 80,
      frames: [
        "⢹",
        "⢺",
        "⢼",
        "⣸",
        "⣇",
        "⡧",
        "⡗",
        "⡏"
      ]
    },
    dots10: {
      interval: 80,
      frames: [
        "⢄",
        "⢂",
        "⢁",
        "⡁",
        "⡈",
        "⡐",
        "⡠"
      ]
    },
    dots11: {
      interval: 100,
      frames: [
        "⠁",
        "⠂",
        "⠄",
        "⡀",
        "⢀",
        "⠠",
        "⠐",
        "⠈"
      ]
    },
    dots12: {
      interval: 80,
      frames: [
        "⢀⠀",
        "⡀⠀",
        "⠄⠀",
        "⢂⠀",
        "⡂⠀",
        "⠅⠀",
        "⢃⠀",
        "⡃⠀",
        "⠍⠀",
        "⢋⠀",
        "⡋⠀",
        "⠍⠁",
        "⢋⠁",
        "⡋⠁",
        "⠍⠉",
        "⠋⠉",
        "⠋⠉",
        "⠉⠙",
        "⠉⠙",
        "⠉⠩",
        "⠈⢙",
        "⠈⡙",
        "⢈⠩",
        "⡀⢙",
        "⠄⡙",
        "⢂⠩",
        "⡂⢘",
        "⠅⡘",
        "⢃⠨",
        "⡃⢐",
        "⠍⡐",
        "⢋⠠",
        "⡋⢀",
        "⠍⡁",
        "⢋⠁",
        "⡋⠁",
        "⠍⠉",
        "⠋⠉",
        "⠋⠉",
        "⠉⠙",
        "⠉⠙",
        "⠉⠩",
        "⠈⢙",
        "⠈⡙",
        "⠈⠩",
        "⠀⢙",
        "⠀⡙",
        "⠀⠩",
        "⠀⢘",
        "⠀⡘",
        "⠀⠨",
        "⠀⢐",
        "⠀⡐",
        "⠀⠠",
        "⠀⢀",
        "⠀⡀"
      ]
    },
    dots13: {
      interval: 80,
      frames: [
        "⣼",
        "⣹",
        "⢻",
        "⠿",
        "⡟",
        "⣏",
        "⣧",
        "⣶"
      ]
    },
    dots8Bit: {
      interval: 80,
      frames: [
        "⠀",
        "⠁",
        "⠂",
        "⠃",
        "⠄",
        "⠅",
        "⠆",
        "⠇",
        "⡀",
        "⡁",
        "⡂",
        "⡃",
        "⡄",
        "⡅",
        "⡆",
        "⡇",
        "⠈",
        "⠉",
        "⠊",
        "⠋",
        "⠌",
        "⠍",
        "⠎",
        "⠏",
        "⡈",
        "⡉",
        "⡊",
        "⡋",
        "⡌",
        "⡍",
        "⡎",
        "⡏",
        "⠐",
        "⠑",
        "⠒",
        "⠓",
        "⠔",
        "⠕",
        "⠖",
        "⠗",
        "⡐",
        "⡑",
        "⡒",
        "⡓",
        "⡔",
        "⡕",
        "⡖",
        "⡗",
        "⠘",
        "⠙",
        "⠚",
        "⠛",
        "⠜",
        "⠝",
        "⠞",
        "⠟",
        "⡘",
        "⡙",
        "⡚",
        "⡛",
        "⡜",
        "⡝",
        "⡞",
        "⡟",
        "⠠",
        "⠡",
        "⠢",
        "⠣",
        "⠤",
        "⠥",
        "⠦",
        "⠧",
        "⡠",
        "⡡",
        "⡢",
        "⡣",
        "⡤",
        "⡥",
        "⡦",
        "⡧",
        "⠨",
        "⠩",
        "⠪",
        "⠫",
        "⠬",
        "⠭",
        "⠮",
        "⠯",
        "⡨",
        "⡩",
        "⡪",
        "⡫",
        "⡬",
        "⡭",
        "⡮",
        "⡯",
        "⠰",
        "⠱",
        "⠲",
        "⠳",
        "⠴",
        "⠵",
        "⠶",
        "⠷",
        "⡰",
        "⡱",
        "⡲",
        "⡳",
        "⡴",
        "⡵",
        "⡶",
        "⡷",
        "⠸",
        "⠹",
        "⠺",
        "⠻",
        "⠼",
        "⠽",
        "⠾",
        "⠿",
        "⡸",
        "⡹",
        "⡺",
        "⡻",
        "⡼",
        "⡽",
        "⡾",
        "⡿",
        "⢀",
        "⢁",
        "⢂",
        "⢃",
        "⢄",
        "⢅",
        "⢆",
        "⢇",
        "⣀",
        "⣁",
        "⣂",
        "⣃",
        "⣄",
        "⣅",
        "⣆",
        "⣇",
        "⢈",
        "⢉",
        "⢊",
        "⢋",
        "⢌",
        "⢍",
        "⢎",
        "⢏",
        "⣈",
        "⣉",
        "⣊",
        "⣋",
        "⣌",
        "⣍",
        "⣎",
        "⣏",
        "⢐",
        "⢑",
        "⢒",
        "⢓",
        "⢔",
        "⢕",
        "⢖",
        "⢗",
        "⣐",
        "⣑",
        "⣒",
        "⣓",
        "⣔",
        "⣕",
        "⣖",
        "⣗",
        "⢘",
        "⢙",
        "⢚",
        "⢛",
        "⢜",
        "⢝",
        "⢞",
        "⢟",
        "⣘",
        "⣙",
        "⣚",
        "⣛",
        "⣜",
        "⣝",
        "⣞",
        "⣟",
        "⢠",
        "⢡",
        "⢢",
        "⢣",
        "⢤",
        "⢥",
        "⢦",
        "⢧",
        "⣠",
        "⣡",
        "⣢",
        "⣣",
        "⣤",
        "⣥",
        "⣦",
        "⣧",
        "⢨",
        "⢩",
        "⢪",
        "⢫",
        "⢬",
        "⢭",
        "⢮",
        "⢯",
        "⣨",
        "⣩",
        "⣪",
        "⣫",
        "⣬",
        "⣭",
        "⣮",
        "⣯",
        "⢰",
        "⢱",
        "⢲",
        "⢳",
        "⢴",
        "⢵",
        "⢶",
        "⢷",
        "⣰",
        "⣱",
        "⣲",
        "⣳",
        "⣴",
        "⣵",
        "⣶",
        "⣷",
        "⢸",
        "⢹",
        "⢺",
        "⢻",
        "⢼",
        "⢽",
        "⢾",
        "⢿",
        "⣸",
        "⣹",
        "⣺",
        "⣻",
        "⣼",
        "⣽",
        "⣾",
        "⣿"
      ]
    },
    sand: {
      interval: 80,
      frames: [
        "⠁",
        "⠂",
        "⠄",
        "⡀",
        "⡈",
        "⡐",
        "⡠",
        "⣀",
        "⣁",
        "⣂",
        "⣄",
        "⣌",
        "⣔",
        "⣤",
        "⣥",
        "⣦",
        "⣮",
        "⣶",
        "⣷",
        "⣿",
        "⡿",
        "⠿",
        "⢟",
        "⠟",
        "⡛",
        "⠛",
        "⠫",
        "⢋",
        "⠋",
        "⠍",
        "⡉",
        "⠉",
        "⠑",
        "⠡",
        "⢁"
      ]
    },
    line: {
      interval: 130,
      frames: [
        "-",
        "\\",
        "|",
        "/"
      ]
    },
    line2: {
      interval: 100,
      frames: [
        "⠂",
        "-",
        "–",
        "—",
        "–",
        "-"
      ]
    },
    pipe: {
      interval: 100,
      frames: [
        "┤",
        "┘",
        "┴",
        "└",
        "├",
        "┌",
        "┬",
        "┐"
      ]
    },
    simpleDots: {
      interval: 400,
      frames: [
        ".  ",
        ".. ",
        "...",
        "   "
      ]
    },
    simpleDotsScrolling: {
      interval: 200,
      frames: [
        ".  ",
        ".. ",
        "...",
        " ..",
        "  .",
        "   "
      ]
    },
    star: {
      interval: 70,
      frames: [
        "✶",
        "✸",
        "✹",
        "✺",
        "✹",
        "✷"
      ]
    },
    star2: {
      interval: 80,
      frames: [
        "+",
        "x",
        "*"
      ]
    },
    flip: {
      interval: 70,
      frames: [
        "_",
        "_",
        "_",
        "-",
        "`",
        "`",
        "'",
        "´",
        "-",
        "_",
        "_",
        "_"
      ]
    },
    hamburger: {
      interval: 100,
      frames: [
        "☱",
        "☲",
        "☴"
      ]
    },
    growVertical: {
      interval: 120,
      frames: [
        "▁",
        "▃",
        "▄",
        "▅",
        "▆",
        "▇",
        "▆",
        "▅",
        "▄",
        "▃"
      ]
    },
    growHorizontal: {
      interval: 120,
      frames: [
        "▏",
        "▎",
        "▍",
        "▌",
        "▋",
        "▊",
        "▉",
        "▊",
        "▋",
        "▌",
        "▍",
        "▎"
      ]
    },
    balloon: {
      interval: 140,
      frames: [
        " ",
        ".",
        "o",
        "O",
        "@",
        "*",
        " "
      ]
    },
    balloon2: {
      interval: 120,
      frames: [
        ".",
        "o",
        "O",
        "°",
        "O",
        "o",
        "."
      ]
    },
    noise: {
      interval: 100,
      frames: [
        "▓",
        "▒",
        "░"
      ]
    },
    bounce: {
      interval: 120,
      frames: [
        "⠁",
        "⠂",
        "⠄",
        "⠂"
      ]
    },
    boxBounce: {
      interval: 120,
      frames: [
        "▖",
        "▘",
        "▝",
        "▗"
      ]
    },
    boxBounce2: {
      interval: 100,
      frames: [
        "▌",
        "▀",
        "▐",
        "▄"
      ]
    },
    triangle: {
      interval: 50,
      frames: [
        "◢",
        "◣",
        "◤",
        "◥"
      ]
    },
    binary: {
      interval: 80,
      frames: [
        "010010",
        "001100",
        "100101",
        "111010",
        "111101",
        "010111",
        "101011",
        "111000",
        "110011",
        "110101"
      ]
    },
    arc: {
      interval: 100,
      frames: [
        "◜",
        "◠",
        "◝",
        "◞",
        "◡",
        "◟"
      ]
    },
    circle: {
      interval: 120,
      frames: [
        "◡",
        "⊙",
        "◠"
      ]
    },
    squareCorners: {
      interval: 180,
      frames: [
        "◰",
        "◳",
        "◲",
        "◱"
      ]
    },
    circleQuarters: {
      interval: 120,
      frames: [
        "◴",
        "◷",
        "◶",
        "◵"
      ]
    },
    circleHalves: {
      interval: 50,
      frames: [
        "◐",
        "◓",
        "◑",
        "◒"
      ]
    },
    squish: {
      interval: 100,
      frames: [
        "╫",
        "╪"
      ]
    },
    toggle: {
      interval: 250,
      frames: [
        "⊶",
        "⊷"
      ]
    },
    toggle2: {
      interval: 80,
      frames: [
        "▫",
        "▪"
      ]
    },
    toggle3: {
      interval: 120,
      frames: [
        "□",
        "■"
      ]
    },
    toggle4: {
      interval: 100,
      frames: [
        "■",
        "□",
        "▪",
        "▫"
      ]
    },
    toggle5: {
      interval: 100,
      frames: [
        "▮",
        "▯"
      ]
    },
    toggle6: {
      interval: 300,
      frames: [
        "ဝ",
        "၀"
      ]
    },
    toggle7: {
      interval: 80,
      frames: [
        "⦾",
        "⦿"
      ]
    },
    toggle8: {
      interval: 100,
      frames: [
        "◍",
        "◌"
      ]
    },
    toggle9: {
      interval: 100,
      frames: [
        "◉",
        "◎"
      ]
    },
    toggle10: {
      interval: 100,
      frames: [
        "㊂",
        "㊀",
        "㊁"
      ]
    },
    toggle11: {
      interval: 50,
      frames: [
        "⧇",
        "⧆"
      ]
    },
    toggle12: {
      interval: 120,
      frames: [
        "☗",
        "☖"
      ]
    },
    toggle13: {
      interval: 80,
      frames: [
        "=",
        "*",
        "-"
      ]
    },
    arrow: {
      interval: 100,
      frames: [
        "←",
        "↖",
        "↑",
        "↗",
        "→",
        "↘",
        "↓",
        "↙"
      ]
    },
    arrow2: {
      interval: 80,
      frames: [
        "⬆️ ",
        "↗️ ",
        "➡️ ",
        "↘️ ",
        "⬇️ ",
        "↙️ ",
        "⬅️ ",
        "↖️ "
      ]
    },
    arrow3: {
      interval: 120,
      frames: [
        "▹▹▹▹▹",
        "▸▹▹▹▹",
        "▹▸▹▹▹",
        "▹▹▸▹▹",
        "▹▹▹▸▹",
        "▹▹▹▹▸"
      ]
    },
    bouncingBar: {
      interval: 80,
      frames: [
        "[    ]",
        "[=   ]",
        "[==  ]",
        "[=== ]",
        "[====]",
        "[ ===]",
        "[  ==]",
        "[   =]",
        "[    ]",
        "[   =]",
        "[  ==]",
        "[ ===]",
        "[====]",
        "[=== ]",
        "[==  ]",
        "[=   ]"
      ]
    },
    bouncingBall: {
      interval: 80,
      frames: [
        "( ●    )",
        "(  ●   )",
        "(   ●  )",
        "(    ● )",
        "(     ●)",
        "(    ● )",
        "(   ●  )",
        "(  ●   )",
        "( ●    )",
        "(●     )"
      ]
    },
    smiley: {
      interval: 200,
      frames: [
        "😄 ",
        "😝 "
      ]
    },
    monkey: {
      interval: 300,
      frames: [
        "🙈 ",
        "🙈 ",
        "🙉 ",
        "🙊 "
      ]
    },
    hearts: {
      interval: 100,
      frames: [
        "💛 ",
        "💙 ",
        "💜 ",
        "💚 ",
        "❤️ "
      ]
    },
    clock: {
      interval: 100,
      frames: [
        "🕛 ",
        "🕐 ",
        "🕑 ",
        "🕒 ",
        "🕓 ",
        "🕔 ",
        "🕕 ",
        "🕖 ",
        "🕗 ",
        "🕘 ",
        "🕙 ",
        "🕚 "
      ]
    },
    earth: {
      interval: 180,
      frames: [
        "🌍 ",
        "🌎 ",
        "🌏 "
      ]
    },
    material: {
      interval: 17,
      frames: [
        "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "████████▁▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "██████████▁▁▁▁▁▁▁▁▁▁",
        "███████████▁▁▁▁▁▁▁▁▁",
        "█████████████▁▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁▁██████████████▁▁▁▁",
        "▁▁▁██████████████▁▁▁",
        "▁▁▁▁█████████████▁▁▁",
        "▁▁▁▁██████████████▁▁",
        "▁▁▁▁██████████████▁▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁██████████████▁",
        "▁▁▁▁▁▁██████████████",
        "▁▁▁▁▁▁██████████████",
        "▁▁▁▁▁▁▁█████████████",
        "▁▁▁▁▁▁▁█████████████",
        "▁▁▁▁▁▁▁▁████████████",
        "▁▁▁▁▁▁▁▁████████████",
        "▁▁▁▁▁▁▁▁▁███████████",
        "▁▁▁▁▁▁▁▁▁███████████",
        "▁▁▁▁▁▁▁▁▁▁██████████",
        "▁▁▁▁▁▁▁▁▁▁██████████",
        "▁▁▁▁▁▁▁▁▁▁▁▁████████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "██████▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "████████▁▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "█████████▁▁▁▁▁▁▁▁▁▁▁",
        "███████████▁▁▁▁▁▁▁▁▁",
        "████████████▁▁▁▁▁▁▁▁",
        "████████████▁▁▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "██████████████▁▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁██████████████▁▁▁▁▁",
        "▁▁▁█████████████▁▁▁▁",
        "▁▁▁▁▁████████████▁▁▁",
        "▁▁▁▁▁████████████▁▁▁",
        "▁▁▁▁▁▁███████████▁▁▁",
        "▁▁▁▁▁▁▁▁█████████▁▁▁",
        "▁▁▁▁▁▁▁▁█████████▁▁▁",
        "▁▁▁▁▁▁▁▁▁█████████▁▁",
        "▁▁▁▁▁▁▁▁▁█████████▁▁",
        "▁▁▁▁▁▁▁▁▁▁█████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁████████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"
      ]
    },
    moon: {
      interval: 80,
      frames: [
        "🌑 ",
        "🌒 ",
        "🌓 ",
        "🌔 ",
        "🌕 ",
        "🌖 ",
        "🌗 ",
        "🌘 "
      ]
    },
    runner: {
      interval: 140,
      frames: [
        "🚶 ",
        "🏃 "
      ]
    },
    pong: {
      interval: 80,
      frames: [
        "▐⠂       ▌",
        "▐⠈       ▌",
        "▐ ⠂      ▌",
        "▐ ⠠      ▌",
        "▐  ⡀     ▌",
        "▐  ⠠     ▌",
        "▐   ⠂    ▌",
        "▐   ⠈    ▌",
        "▐    ⠂   ▌",
        "▐    ⠠   ▌",
        "▐     ⡀  ▌",
        "▐     ⠠  ▌",
        "▐      ⠂ ▌",
        "▐      ⠈ ▌",
        "▐       ⠂▌",
        "▐       ⠠▌",
        "▐       ⡀▌",
        "▐      ⠠ ▌",
        "▐      ⠂ ▌",
        "▐     ⠈  ▌",
        "▐     ⠂  ▌",
        "▐    ⠠   ▌",
        "▐    ⡀   ▌",
        "▐   ⠠    ▌",
        "▐   ⠂    ▌",
        "▐  ⠈     ▌",
        "▐  ⠂     ▌",
        "▐ ⠠      ▌",
        "▐ ⡀      ▌",
        "▐⠠       ▌"
      ]
    },
    shark: {
      interval: 120,
      frames: [
        "▐|\\____________▌",
        "▐_|\\___________▌",
        "▐__|\\__________▌",
        "▐___|\\_________▌",
        "▐____|\\________▌",
        "▐_____|\\_______▌",
        "▐______|\\______▌",
        "▐_______|\\_____▌",
        "▐________|\\____▌",
        "▐_________|\\___▌",
        "▐__________|\\__▌",
        "▐___________|\\_▌",
        "▐____________|\\▌",
        "▐____________/|▌",
        "▐___________/|_▌",
        "▐__________/|__▌",
        "▐_________/|___▌",
        "▐________/|____▌",
        "▐_______/|_____▌",
        "▐______/|______▌",
        "▐_____/|_______▌",
        "▐____/|________▌",
        "▐___/|_________▌",
        "▐__/|__________▌",
        "▐_/|___________▌",
        "▐/|____________▌"
      ]
    },
    dqpb: {
      interval: 100,
      frames: [
        "d",
        "q",
        "p",
        "b"
      ]
    },
    weather: {
      interval: 100,
      frames: [
        "☀️ ",
        "☀️ ",
        "☀️ ",
        "🌤 ",
        "⛅️ ",
        "🌥 ",
        "☁️ ",
        "🌧 ",
        "🌨 ",
        "🌧 ",
        "🌨 ",
        "🌧 ",
        "🌨 ",
        "⛈ ",
        "🌨 ",
        "🌧 ",
        "🌨 ",
        "☁️ ",
        "🌥 ",
        "⛅️ ",
        "🌤 ",
        "☀️ ",
        "☀️ "
      ]
    },
    christmas: {
      interval: 400,
      frames: [
        "🌲",
        "🎄"
      ]
    },
    grenade: {
      interval: 80,
      frames: [
        "،  ",
        "′  ",
        " ´ ",
        " ‾ ",
        "  ⸌",
        "  ⸊",
        "  |",
        "  ⁎",
        "  ⁕",
        " ෴ ",
        "  ⁓",
        "   ",
        "   ",
        "   "
      ]
    },
    point: {
      interval: 125,
      frames: [
        "∙∙∙",
        "●∙∙",
        "∙●∙",
        "∙∙●",
        "∙∙∙"
      ]
    },
    layer: {
      interval: 150,
      frames: [
        "-",
        "=",
        "≡"
      ]
    },
    betaWave: {
      interval: 80,
      frames: [
        "ρββββββ",
        "βρβββββ",
        "ββρββββ",
        "βββρβββ",
        "ββββρββ",
        "βββββρβ",
        "ββββββρ"
      ]
    },
    fingerDance: {
      interval: 160,
      frames: [
        "🤘 ",
        "🤟 ",
        "🖖 ",
        "✋ ",
        "🤚 ",
        "👆 "
      ]
    },
    fistBump: {
      interval: 80,
      frames: [
        "🤜　　　　🤛 ",
        "🤜　　　　🤛 ",
        "🤜　　　　🤛 ",
        "　🤜　　🤛　 ",
        "　　🤜🤛　　 ",
        "　🤜✨🤛　　 ",
        "🤜　✨　🤛　 "
      ]
    },
    soccerHeader: {
      interval: 80,
      frames: [
        " 🧑⚽️       🧑 ",
        "🧑  ⚽️      🧑 ",
        "🧑   ⚽️     🧑 ",
        "🧑    ⚽️    🧑 ",
        "🧑     ⚽️   🧑 ",
        "🧑      ⚽️  🧑 ",
        "🧑       ⚽️🧑  ",
        "🧑      ⚽️  🧑 ",
        "🧑     ⚽️   🧑 ",
        "🧑    ⚽️    🧑 ",
        "🧑   ⚽️     🧑 ",
        "🧑  ⚽️      🧑 "
      ]
    },
    mindblown: {
      interval: 160,
      frames: [
        "😐 ",
        "😐 ",
        "😮 ",
        "😮 ",
        "😦 ",
        "😦 ",
        "😧 ",
        "😧 ",
        "🤯 ",
        "💥 ",
        "✨ ",
        "　 ",
        "　 ",
        "　 "
      ]
    },
    speaker: {
      interval: 160,
      frames: [
        "🔈 ",
        "🔉 ",
        "🔊 ",
        "🔉 "
      ]
    },
    orangePulse: {
      interval: 100,
      frames: [
        "🔸 ",
        "🔶 ",
        "🟠 ",
        "🟠 ",
        "🔶 "
      ]
    },
    bluePulse: {
      interval: 100,
      frames: [
        "🔹 ",
        "🔷 ",
        "🔵 ",
        "🔵 ",
        "🔷 "
      ]
    },
    orangeBluePulse: {
      interval: 100,
      frames: [
        "🔸 ",
        "🔶 ",
        "🟠 ",
        "🟠 ",
        "🔶 ",
        "🔹 ",
        "🔷 ",
        "🔵 ",
        "🔵 ",
        "🔷 "
      ]
    },
    timeTravel: {
      interval: 100,
      frames: [
        "🕛 ",
        "🕚 ",
        "🕙 ",
        "🕘 ",
        "🕗 ",
        "🕖 ",
        "🕕 ",
        "🕔 ",
        "🕓 ",
        "🕒 ",
        "🕑 ",
        "🕐 "
      ]
    },
    aesthetic: {
      interval: 80,
      frames: [
        "▰▱▱▱▱▱▱",
        "▰▰▱▱▱▱▱",
        "▰▰▰▱▱▱▱",
        "▰▰▰▰▱▱▱",
        "▰▰▰▰▰▱▱",
        "▰▰▰▰▰▰▱",
        "▰▰▰▰▰▰▰",
        "▰▱▱▱▱▱▱"
      ]
    },
    dwarfFortress: {
      interval: 80,
      frames: [
        " ██████£££  ",
        "☺██████£££  ",
        "☺██████£££  ",
        "☺▓█████£££  ",
        "☺▓█████£££  ",
        "☺▒█████£££  ",
        "☺▒█████£££  ",
        "☺░█████£££  ",
        "☺░█████£££  ",
        "☺ █████£££  ",
        " ☺█████£££  ",
        " ☺█████£££  ",
        " ☺▓████£££  ",
        " ☺▓████£££  ",
        " ☺▒████£££  ",
        " ☺▒████£££  ",
        " ☺░████£££  ",
        " ☺░████£££  ",
        " ☺ ████£££  ",
        "  ☺████£££  ",
        "  ☺████£££  ",
        "  ☺▓███£££  ",
        "  ☺▓███£££  ",
        "  ☺▒███£££  ",
        "  ☺▒███£££  ",
        "  ☺░███£££  ",
        "  ☺░███£££  ",
        "  ☺ ███£££  ",
        "   ☺███£££  ",
        "   ☺███£££  ",
        "   ☺▓██£££  ",
        "   ☺▓██£££  ",
        "   ☺▒██£££  ",
        "   ☺▒██£££  ",
        "   ☺░██£££  ",
        "   ☺░██£££  ",
        "   ☺ ██£££  ",
        "    ☺██£££  ",
        "    ☺██£££  ",
        "    ☺▓█£££  ",
        "    ☺▓█£££  ",
        "    ☺▒█£££  ",
        "    ☺▒█£££  ",
        "    ☺░█£££  ",
        "    ☺░█£££  ",
        "    ☺ █£££  ",
        "     ☺█£££  ",
        "     ☺█£££  ",
        "     ☺▓£££  ",
        "     ☺▓£££  ",
        "     ☺▒£££  ",
        "     ☺▒£££  ",
        "     ☺░£££  ",
        "     ☺░£££  ",
        "     ☺ £££  ",
        "      ☺£££  ",
        "      ☺£££  ",
        "      ☺▓££  ",
        "      ☺▓££  ",
        "      ☺▒££  ",
        "      ☺▒££  ",
        "      ☺░££  ",
        "      ☺░££  ",
        "      ☺ ££  ",
        "       ☺££  ",
        "       ☺££  ",
        "       ☺▓£  ",
        "       ☺▓£  ",
        "       ☺▒£  ",
        "       ☺▒£  ",
        "       ☺░£  ",
        "       ☺░£  ",
        "       ☺ £  ",
        "        ☺£  ",
        "        ☺£  ",
        "        ☺▓  ",
        "        ☺▓  ",
        "        ☺▒  ",
        "        ☺▒  ",
        "        ☺░  ",
        "        ☺░  ",
        "        ☺   ",
        "        ☺  &",
        "        ☺ ☼&",
        "       ☺ ☼ &",
        "       ☺☼  &",
        "      ☺☼  & ",
        "      ‼   & ",
        "     ☺   &  ",
        "    ‼    &  ",
        "   ☺    &   ",
        "  ‼     &   ",
        " ☺     &    ",
        "‼      &    ",
        "      &     ",
        "      &     ",
        "     &   ░  ",
        "     &   ▒  ",
        "    &    ▓  ",
        "    &    £  ",
        "   &    ░£  ",
        "   &    ▒£  ",
        "  &     ▓£  ",
        "  &     ££  ",
        " &     ░££  ",
        " &     ▒££  ",
        "&      ▓££  ",
        "&      £££  ",
        "      ░£££  ",
        "      ▒£££  ",
        "      ▓£££  ",
        "      █£££  ",
        "     ░█£££  ",
        "     ▒█£££  ",
        "     ▓█£££  ",
        "     ██£££  ",
        "    ░██£££  ",
        "    ▒██£££  ",
        "    ▓██£££  ",
        "    ███£££  ",
        "   ░███£££  ",
        "   ▒███£££  ",
        "   ▓███£££  ",
        "   ████£££  ",
        "  ░████£££  ",
        "  ▒████£££  ",
        "  ▓████£££  ",
        "  █████£££  ",
        " ░█████£££  ",
        " ▒█████£££  ",
        " ▓█████£££  ",
        " ██████£££  ",
        " ██████£££  "
      ]
    }
  };
});

// node_modules/cli-spinners/index.js
var require_cli_spinners = __commonJS((exports, module) => {
  var spinners = Object.assign({}, require_spinners());
  var spinnersList = Object.keys(spinners);
  Object.defineProperty(spinners, "random", {
    get() {
      const randomIndex = Math.floor(Math.random() * spinnersList.length);
      const spinnerName = spinnersList[randomIndex];
      return spinners[spinnerName];
    }
  });
  module.exports = spinners;
});

// node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;
  const csi = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
  const pattern = `${osc}|${csi}`;
  return new RegExp(pattern, onlyFirst ? undefined : "g");
}

// node_modules/strip-ansi/index.js
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }
  if (!string.includes("\x1B") && !string.includes("")) {
    return string;
  }
  return string.replace(regex, "");
}
var regex;
var init_strip_ansi = __esm(() => {
  regex = ansiRegex();
});

// node_modules/get-east-asian-width/lookup-data.js
var ambiguousRanges, fullwidthRanges, halfwidthRanges, narrowRanges, wideRanges;
var init_lookup_data = __esm(() => {
  ambiguousRanges = [161, 161, 164, 164, 167, 168, 170, 170, 173, 174, 176, 180, 182, 186, 188, 191, 198, 198, 208, 208, 215, 216, 222, 225, 230, 230, 232, 234, 236, 237, 240, 240, 242, 243, 247, 250, 252, 252, 254, 254, 257, 257, 273, 273, 275, 275, 283, 283, 294, 295, 299, 299, 305, 307, 312, 312, 319, 322, 324, 324, 328, 331, 333, 333, 338, 339, 358, 359, 363, 363, 462, 462, 464, 464, 466, 466, 468, 468, 470, 470, 472, 472, 474, 474, 476, 476, 593, 593, 609, 609, 708, 708, 711, 711, 713, 715, 717, 717, 720, 720, 728, 731, 733, 733, 735, 735, 768, 879, 913, 929, 931, 937, 945, 961, 963, 969, 1025, 1025, 1040, 1103, 1105, 1105, 8208, 8208, 8211, 8214, 8216, 8217, 8220, 8221, 8224, 8226, 8228, 8231, 8240, 8240, 8242, 8243, 8245, 8245, 8251, 8251, 8254, 8254, 8308, 8308, 8319, 8319, 8321, 8324, 8364, 8364, 8451, 8451, 8453, 8453, 8457, 8457, 8467, 8467, 8470, 8470, 8481, 8482, 8486, 8486, 8491, 8491, 8531, 8532, 8539, 8542, 8544, 8555, 8560, 8569, 8585, 8585, 8592, 8601, 8632, 8633, 8658, 8658, 8660, 8660, 8679, 8679, 8704, 8704, 8706, 8707, 8711, 8712, 8715, 8715, 8719, 8719, 8721, 8721, 8725, 8725, 8730, 8730, 8733, 8736, 8739, 8739, 8741, 8741, 8743, 8748, 8750, 8750, 8756, 8759, 8764, 8765, 8776, 8776, 8780, 8780, 8786, 8786, 8800, 8801, 8804, 8807, 8810, 8811, 8814, 8815, 8834, 8835, 8838, 8839, 8853, 8853, 8857, 8857, 8869, 8869, 8895, 8895, 8978, 8978, 9312, 9449, 9451, 9547, 9552, 9587, 9600, 9615, 9618, 9621, 9632, 9633, 9635, 9641, 9650, 9651, 9654, 9655, 9660, 9661, 9664, 9665, 9670, 9672, 9675, 9675, 9678, 9681, 9698, 9701, 9711, 9711, 9733, 9734, 9737, 9737, 9742, 9743, 9756, 9756, 9758, 9758, 9792, 9792, 9794, 9794, 9824, 9825, 9827, 9829, 9831, 9834, 9836, 9837, 9839, 9839, 9886, 9887, 9919, 9919, 9926, 9933, 9935, 9939, 9941, 9953, 9955, 9955, 9960, 9961, 9963, 9969, 9972, 9972, 9974, 9977, 9979, 9980, 9982, 9983, 10045, 10045, 10102, 10111, 11094, 11097, 12872, 12879, 57344, 63743, 65024, 65039, 65533, 65533, 127232, 127242, 127248, 127277, 127280, 127337, 127344, 127373, 127375, 127376, 127387, 127404, 917760, 917999, 983040, 1048573, 1048576, 1114109];
  fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];
  halfwidthRanges = [8361, 8361, 65377, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65512, 65518];
  narrowRanges = [32, 126, 162, 163, 165, 166, 172, 172, 175, 175, 10214, 10221, 10629, 10630];
  wideRanges = [4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749, 9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929, 11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591, 12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388, 44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180, 94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374, 127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589, 127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955, 127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317, 128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591, 128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748, 128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535, 129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770, 129775, 129784, 131072, 196605, 196608, 262141];
});

// node_modules/get-east-asian-width/utilities.js
var isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i = mid * 2;
    if (codePoint < ranges[i]) {
      high = mid - 1;
    } else if (codePoint > ranges[i + 1]) {
      low = mid + 1;
    } else {
      return true;
    }
  }
  return false;
};

// node_modules/get-east-asian-width/lookup.js
function findWideFastPathRange(ranges) {
  let fastPathStart = ranges[0];
  let fastPathEnd = ranges[1];
  for (let index = 0;index < ranges.length; index += 2) {
    const start = ranges[index];
    const end = ranges[index + 1];
    if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) {
      return [start, end];
    }
    if (end - start > fastPathEnd - fastPathStart) {
      fastPathStart = start;
      fastPathEnd = end;
    }
  }
  return [fastPathStart, fastPathEnd];
}
var minimumAmbiguousCodePoint, maximumAmbiguousCodePoint, minimumFullWidthCodePoint, maximumFullWidthCodePoint, minimumHalfWidthCodePoint, maximumHalfWidthCodePoint, minimumNarrowCodePoint, maximumNarrowCodePoint, minimumWideCodePoint, maximumWideCodePoint, commonCjkCodePoint = 19968, wideFastPathStart, wideFastPathEnd, isAmbiguous = (codePoint) => {
  if (codePoint < minimumAmbiguousCodePoint || codePoint > maximumAmbiguousCodePoint) {
    return false;
  }
  return isInRange(ambiguousRanges, codePoint);
}, isFullWidth = (codePoint) => {
  if (codePoint < minimumFullWidthCodePoint || codePoint > maximumFullWidthCodePoint) {
    return false;
  }
  return isInRange(fullwidthRanges, codePoint);
}, isWide = (codePoint) => {
  if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) {
    return true;
  }
  if (codePoint < minimumWideCodePoint || codePoint > maximumWideCodePoint) {
    return false;
  }
  return isInRange(wideRanges, codePoint);
};
var init_lookup = __esm(() => {
  init_lookup_data();
  minimumAmbiguousCodePoint = ambiguousRanges[0];
  maximumAmbiguousCodePoint = ambiguousRanges.at(-1);
  minimumFullWidthCodePoint = fullwidthRanges[0];
  maximumFullWidthCodePoint = fullwidthRanges.at(-1);
  minimumHalfWidthCodePoint = halfwidthRanges[0];
  maximumHalfWidthCodePoint = halfwidthRanges.at(-1);
  minimumNarrowCodePoint = narrowRanges[0];
  maximumNarrowCodePoint = narrowRanges.at(-1);
  minimumWideCodePoint = wideRanges[0];
  maximumWideCodePoint = wideRanges.at(-1);
  [wideFastPathStart, wideFastPathEnd] = findWideFastPathRange(wideRanges);
});

// node_modules/get-east-asian-width/index.js
function validate(codePoint) {
  if (!Number.isSafeInteger(codePoint)) {
    throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
  }
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
  validate(codePoint);
  if (isFullWidth(codePoint) || isWide(codePoint) || ambiguousAsWide && isAmbiguous(codePoint)) {
    return 2;
  }
  return 1;
}
var init_get_east_asian_width = __esm(() => {
  init_lookup();
  init_lookup();
});

// node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS((exports, module) => {
  module.exports = () => {
    return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
  };
});

// node_modules/string-width/index.js
function stringWidth(string, options = {}) {
  if (typeof string !== "string" || string.length === 0) {
    return 0;
  }
  const {
    ambiguousIsNarrow = true,
    countAnsiEscapeCodes = false
  } = options;
  if (!countAnsiEscapeCodes) {
    string = stripAnsi(string);
  }
  if (string.length === 0) {
    return 0;
  }
  let width = 0;
  const eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
  for (const { segment: character } of segmenter.segment(string)) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159) {
      continue;
    }
    if (codePoint >= 8203 && codePoint <= 8207 || codePoint === 65279) {
      continue;
    }
    if (codePoint >= 768 && codePoint <= 879 || codePoint >= 6832 && codePoint <= 6911 || codePoint >= 7616 && codePoint <= 7679 || codePoint >= 8400 && codePoint <= 8447 || codePoint >= 65056 && codePoint <= 65071) {
      continue;
    }
    if (codePoint >= 55296 && codePoint <= 57343) {
      continue;
    }
    if (codePoint >= 65024 && codePoint <= 65039) {
      continue;
    }
    if (defaultIgnorableCodePointRegex.test(character)) {
      continue;
    }
    if (import_emoji_regex.default().test(character)) {
      width += 2;
      continue;
    }
    width += eastAsianWidth(codePoint, eastAsianWidthOptions);
  }
  return width;
}
var import_emoji_regex, segmenter, defaultIgnorableCodePointRegex;
var init_string_width = __esm(() => {
  init_strip_ansi();
  init_get_east_asian_width();
  import_emoji_regex = __toESM(require_emoji_regex(), 1);
  segmenter = new Intl.Segmenter;
  defaultIgnorableCodePointRegex = /^\p{Default_Ignorable_Code_Point}$/u;
});

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = new Map;
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
import process2 from "node:process";
import os from "node:os";
import tty from "node:tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env))) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? `\r
` : `
`) + postfix;
    endIndex = index + 1;
    index = string.indexOf(`
`, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === undefined ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf(`
`);
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// node_modules/ora/index.js
import process9 from "node:process";
init_cli_cursor();
var import_cli_spinners = __toESM(require_cli_spinners(), 1);

// node_modules/log-symbols/node_modules/is-unicode-supported/index.js
import process6 from "node:process";
function isUnicodeSupported() {
  if (process6.platform !== "win32") {
    return process6.env.TERM !== "linux";
  }
  return Boolean(process6.env.CI) || Boolean(process6.env.WT_SESSION) || Boolean(process6.env.TERMINUS_SUBLIME) || process6.env.ConEmuTask === "{cmd::Cmder}" || process6.env.TERM_PROGRAM === "Terminus-Sublime" || process6.env.TERM_PROGRAM === "vscode" || process6.env.TERM === "xterm-256color" || process6.env.TERM === "alacritty" || process6.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}

// node_modules/log-symbols/index.js
var main = {
  info: source_default.blue("ℹ"),
  success: source_default.green("✔"),
  warning: source_default.yellow("⚠"),
  error: source_default.red("✖")
};
var fallback = {
  info: source_default.blue("i"),
  success: source_default.green("√"),
  warning: source_default.yellow("‼"),
  error: source_default.red("×")
};
var logSymbols = isUnicodeSupported() ? main : fallback;
var log_symbols_default = logSymbols;

// node_modules/ora/index.js
init_strip_ansi();
init_string_width();

// node_modules/is-interactive/index.js
function isInteractive({ stream = process.stdout } = {}) {
  return Boolean(stream && stream.isTTY && process.env.TERM !== "dumb" && !("CI" in process.env));
}

// node_modules/is-unicode-supported/index.js
import process7 from "node:process";
function isUnicodeSupported2() {
  const { env: env2 } = process7;
  const { TERM, TERM_PROGRAM } = env2;
  if (process7.platform !== "win32") {
    return TERM !== "linux";
  }
  return Boolean(env2.WT_SESSION) || Boolean(env2.TERMINUS_SUBLIME) || env2.ConEmuTask === "{cmd::Cmder}" || TERM_PROGRAM === "Terminus-Sublime" || TERM_PROGRAM === "vscode" || TERM === "xterm-256color" || TERM === "alacritty" || TERM === "rxvt-unicode" || TERM === "rxvt-unicode-256color" || env2.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}

// node_modules/stdin-discarder/index.js
import process8 from "node:process";
var ASCII_ETX_CODE = 3;

class StdinDiscarder {
  #activeCount = 0;
  start() {
    this.#activeCount++;
    if (this.#activeCount === 1) {
      this.#realStart();
    }
  }
  stop() {
    if (this.#activeCount <= 0) {
      throw new Error("`stop` called more times than `start`");
    }
    this.#activeCount--;
    if (this.#activeCount === 0) {
      this.#realStop();
    }
  }
  #realStart() {
    if (process8.platform === "win32" || !process8.stdin.isTTY) {
      return;
    }
    process8.stdin.setRawMode(true);
    process8.stdin.on("data", this.#handleInput);
    process8.stdin.resume();
  }
  #realStop() {
    if (!process8.stdin.isTTY) {
      return;
    }
    process8.stdin.off("data", this.#handleInput);
    process8.stdin.pause();
    process8.stdin.setRawMode(false);
  }
  #handleInput(chunk) {
    if (chunk[0] === ASCII_ETX_CODE) {
      process8.emit("SIGINT");
    }
  }
}
var stdinDiscarder = new StdinDiscarder;
var stdin_discarder_default = stdinDiscarder;

// node_modules/ora/index.js
var import_cli_spinners2 = __toESM(require_cli_spinners(), 1);

class Ora {
  #linesToClear = 0;
  #isDiscardingStdin = false;
  #lineCount = 0;
  #frameIndex = -1;
  #lastSpinnerFrameTime = 0;
  #options;
  #spinner;
  #stream;
  #id;
  #initialInterval;
  #isEnabled;
  #isSilent;
  #indent;
  #text;
  #prefixText;
  #suffixText;
  color;
  constructor(options) {
    if (typeof options === "string") {
      options = {
        text: options
      };
    }
    this.#options = {
      color: "cyan",
      stream: process9.stderr,
      discardStdin: true,
      hideCursor: true,
      ...options
    };
    this.color = this.#options.color;
    this.spinner = this.#options.spinner;
    this.#initialInterval = this.#options.interval;
    this.#stream = this.#options.stream;
    this.#isEnabled = typeof this.#options.isEnabled === "boolean" ? this.#options.isEnabled : isInteractive({ stream: this.#stream });
    this.#isSilent = typeof this.#options.isSilent === "boolean" ? this.#options.isSilent : false;
    this.text = this.#options.text;
    this.prefixText = this.#options.prefixText;
    this.suffixText = this.#options.suffixText;
    this.indent = this.#options.indent;
    if (process9.env.NODE_ENV === "test") {
      this._stream = this.#stream;
      this._isEnabled = this.#isEnabled;
      Object.defineProperty(this, "_linesToClear", {
        get() {
          return this.#linesToClear;
        },
        set(newValue) {
          this.#linesToClear = newValue;
        }
      });
      Object.defineProperty(this, "_frameIndex", {
        get() {
          return this.#frameIndex;
        }
      });
      Object.defineProperty(this, "_lineCount", {
        get() {
          return this.#lineCount;
        }
      });
    }
  }
  get indent() {
    return this.#indent;
  }
  set indent(indent = 0) {
    if (!(indent >= 0 && Number.isInteger(indent))) {
      throw new Error("The `indent` option must be an integer from 0 and up");
    }
    this.#indent = indent;
    this.#updateLineCount();
  }
  get interval() {
    return this.#initialInterval ?? this.#spinner.interval ?? 100;
  }
  get spinner() {
    return this.#spinner;
  }
  set spinner(spinner) {
    this.#frameIndex = -1;
    this.#initialInterval = undefined;
    if (typeof spinner === "object") {
      if (spinner.frames === undefined) {
        throw new Error("The given spinner must have a `frames` property");
      }
      this.#spinner = spinner;
    } else if (!isUnicodeSupported2()) {
      this.#spinner = import_cli_spinners.default.line;
    } else if (spinner === undefined) {
      this.#spinner = import_cli_spinners.default.dots;
    } else if (spinner !== "default" && import_cli_spinners.default[spinner]) {
      this.#spinner = import_cli_spinners.default[spinner];
    } else {
      throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
    }
  }
  get text() {
    return this.#text;
  }
  set text(value = "") {
    this.#text = value;
    this.#updateLineCount();
  }
  get prefixText() {
    return this.#prefixText;
  }
  set prefixText(value = "") {
    this.#prefixText = value;
    this.#updateLineCount();
  }
  get suffixText() {
    return this.#suffixText;
  }
  set suffixText(value = "") {
    this.#suffixText = value;
    this.#updateLineCount();
  }
  get isSpinning() {
    return this.#id !== undefined;
  }
  #getFullPrefixText(prefixText = this.#prefixText, postfix = " ") {
    if (typeof prefixText === "string" && prefixText !== "") {
      return prefixText + postfix;
    }
    if (typeof prefixText === "function") {
      return prefixText() + postfix;
    }
    return "";
  }
  #getFullSuffixText(suffixText = this.#suffixText, prefix = " ") {
    if (typeof suffixText === "string" && suffixText !== "") {
      return prefix + suffixText;
    }
    if (typeof suffixText === "function") {
      return prefix + suffixText();
    }
    return "";
  }
  #updateLineCount() {
    const columns = this.#stream.columns ?? 80;
    const fullPrefixText = this.#getFullPrefixText(this.#prefixText, "-");
    const fullSuffixText = this.#getFullSuffixText(this.#suffixText, "-");
    const fullText = " ".repeat(this.#indent) + fullPrefixText + "--" + this.#text + "--" + fullSuffixText;
    this.#lineCount = 0;
    for (const line of stripAnsi(fullText).split(`
`)) {
      this.#lineCount += Math.max(1, Math.ceil(stringWidth(line, { countAnsiEscapeCodes: true }) / columns));
    }
  }
  get isEnabled() {
    return this.#isEnabled && !this.#isSilent;
  }
  set isEnabled(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("The `isEnabled` option must be a boolean");
    }
    this.#isEnabled = value;
  }
  get isSilent() {
    return this.#isSilent;
  }
  set isSilent(value) {
    if (typeof value !== "boolean") {
      throw new TypeError("The `isSilent` option must be a boolean");
    }
    this.#isSilent = value;
  }
  frame() {
    const now = Date.now();
    if (this.#frameIndex === -1 || now - this.#lastSpinnerFrameTime >= this.interval) {
      this.#frameIndex = ++this.#frameIndex % this.#spinner.frames.length;
      this.#lastSpinnerFrameTime = now;
    }
    const { frames } = this.#spinner;
    let frame = frames[this.#frameIndex];
    if (this.color) {
      frame = source_default[this.color](frame);
    }
    const fullPrefixText = typeof this.#prefixText === "string" && this.#prefixText !== "" ? this.#prefixText + " " : "";
    const fullText = typeof this.text === "string" ? " " + this.text : "";
    const fullSuffixText = typeof this.#suffixText === "string" && this.#suffixText !== "" ? " " + this.#suffixText : "";
    return fullPrefixText + frame + fullText + fullSuffixText;
  }
  clear() {
    if (!this.#isEnabled || !this.#stream.isTTY) {
      return this;
    }
    this.#stream.cursorTo(0);
    for (let index = 0;index < this.#linesToClear; index++) {
      if (index > 0) {
        this.#stream.moveCursor(0, -1);
      }
      this.#stream.clearLine(1);
    }
    if (this.#indent || this.lastIndent !== this.#indent) {
      this.#stream.cursorTo(this.#indent);
    }
    this.lastIndent = this.#indent;
    this.#linesToClear = 0;
    return this;
  }
  render() {
    if (this.#isSilent) {
      return this;
    }
    this.clear();
    this.#stream.write(this.frame());
    this.#linesToClear = this.#lineCount;
    return this;
  }
  start(text) {
    if (text) {
      this.text = text;
    }
    if (this.#isSilent) {
      return this;
    }
    if (!this.#isEnabled) {
      if (this.text) {
        this.#stream.write(`- ${this.text}
`);
      }
      return this;
    }
    if (this.isSpinning) {
      return this;
    }
    if (this.#options.hideCursor) {
      cli_cursor_default.hide(this.#stream);
    }
    if (this.#options.discardStdin && process9.stdin.isTTY) {
      this.#isDiscardingStdin = true;
      stdin_discarder_default.start();
    }
    this.render();
    this.#id = setInterval(this.render.bind(this), this.interval);
    return this;
  }
  stop() {
    if (!this.#isEnabled) {
      return this;
    }
    clearInterval(this.#id);
    this.#id = undefined;
    this.#frameIndex = 0;
    this.clear();
    if (this.#options.hideCursor) {
      cli_cursor_default.show(this.#stream);
    }
    if (this.#options.discardStdin && process9.stdin.isTTY && this.#isDiscardingStdin) {
      stdin_discarder_default.stop();
      this.#isDiscardingStdin = false;
    }
    return this;
  }
  succeed(text) {
    return this.stopAndPersist({ symbol: log_symbols_default.success, text });
  }
  fail(text) {
    return this.stopAndPersist({ symbol: log_symbols_default.error, text });
  }
  warn(text) {
    return this.stopAndPersist({ symbol: log_symbols_default.warning, text });
  }
  info(text) {
    return this.stopAndPersist({ symbol: log_symbols_default.info, text });
  }
  stopAndPersist(options = {}) {
    if (this.#isSilent) {
      return this;
    }
    const prefixText = options.prefixText ?? this.#prefixText;
    const fullPrefixText = this.#getFullPrefixText(prefixText, " ");
    const symbolText = options.symbol ?? " ";
    const text = options.text ?? this.text;
    const separatorText = symbolText ? " " : "";
    const fullText = typeof text === "string" ? separatorText + text : "";
    const suffixText = options.suffixText ?? this.#suffixText;
    const fullSuffixText = this.#getFullSuffixText(suffixText, " ");
    const textToWrite = fullPrefixText + symbolText + fullText + fullSuffixText + `
`;
    this.stop();
    this.#stream.write(textToWrite);
    return this;
  }
}
function ora(options) {
  return new Ora(options);
}

// src/utils/logger.ts
class Logger {
  spinner = null;
  silent;
  constructor(silent = false) {
    this.silent = silent;
  }
  info(message) {
    if (this.silent)
      return;
    console.log(source_default.blue("ℹ"), message);
  }
  success(message) {
    if (this.silent)
      return;
    console.log(source_default.green("✓"), message);
  }
  warning(message) {
    if (this.silent)
      return;
    console.log(source_default.yellow("⚠"), message);
  }
  error(message) {
    if (this.silent)
      return;
    console.log(source_default.red("✗"), message);
  }
  debug(message) {
    if (this.silent)
      return;
    if (process.env.DEBUG) {
      console.log(source_default.gray("›"), source_default.gray(message));
    }
  }
  header(message) {
    if (this.silent)
      return;
    console.log("");
    console.log(source_default.bold.cyan(message));
    console.log(source_default.cyan("─".repeat(message.length)));
  }
  blank() {
    if (this.silent)
      return;
    console.log("");
  }
  start(text) {
    if (this.silent) {
      this.spinner = ora({ silent: true, text }).start();
    } else {
      this.spinner = ora({ text, color: "cyan" }).start();
    }
    return this.spinner;
  }
  succeed(text) {
    this.spinner?.succeed(text);
    this.spinner = null;
  }
  fail(text) {
    this.spinner?.fail(text);
    this.spinner = null;
  }
  stop() {
    this.spinner?.stop();
    this.spinner = null;
  }
  box(title, content) {
    if (this.silent)
      return;
    const lines = content.split(`
`);
    const maxLength = Math.max(title.length, ...lines.map((l) => l.length));
    console.log("");
    console.log(source_default.cyan("┌" + "─".repeat(maxLength + 2) + "┐"));
    console.log(source_default.cyan("│") + " " + source_default.bold(title) + " ".repeat(maxLength - title.length + 1) + source_default.cyan("│"));
    console.log(source_default.cyan("├" + "─".repeat(maxLength + 2) + "┤"));
    for (const line of lines) {
      console.log(source_default.cyan("│") + " " + line + " ".repeat(maxLength - line.length + 1) + source_default.cyan("│"));
    }
    console.log(source_default.cyan("└" + "─".repeat(maxLength + 2) + "┘"));
    console.log("");
  }
  table(headers, rows) {
    if (this.silent)
      return;
    const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i]?.length || 0)));
    const printRow = (row) => {
      console.log(row.map((cell, i) => cell.padEnd(colWidths[i])).join("   "));
    };
    console.log("");
    printRow(headers.map((h) => source_default.bold(h)));
    console.log(headers.map((_, i) => "─".repeat(colWidths[i])).join("   "));
    for (const row of rows) {
      printRow(row);
    }
    console.log("");
  }
}
var logger = new Logger;

// src/utils/paths.ts
import path from "path";
import os2 from "os";
import fs from "fs/promises";
function getHomeDir() {
  return os2.homedir();
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

// src/types.ts
var AI_PATTERN_REGEX = "^Co-Authored-By: (Claude|GitHub Copilot|ChatGPT|Anthropic|OpenAI|Cursor AI|AI Assistant|Tabnine|CodeWhisperer|Codeium|Replit Ghostwriter|Sourcegraph Cody|Cody).*";
var DEFAULT_AI_PATTERNS = [
  {
    name: "AI Co-Authors",
    pattern: AI_PATTERN_REGEX
  }
];

// src/utils/hook.ts
function generateHookContent(options = {}) {
  const patterns = options.patterns || DEFAULT_AI_PATTERNS;
  const sedCommands = patterns.map((p) => `sed -i '/${p.pattern}/d' "$COMMIT_MSG_FILE"`).join(`
`);
  return `#!/bin/bash
# git-no-ai-author: Remove AI co-author signatures from commit messages
# Generated by npx git-no-ai-author
# See: https://github.com/yourusername/git-no-ai-author

COMMIT_MSG_FILE=$1

# AI patterns to remove from commit messages
${sedCommands}

# Remove trailing empty lines
sed -i -e :a -e '/^$/{$d;N;ba' -e '}' "$COMMIT_MSG_FILE"
`;
}
function getDefaultPatterns() {
  return DEFAULT_AI_PATTERNS;
}
function getPatternNames() {
  return DEFAULT_AI_PATTERNS.map((p) => p.name);
}

// src/utils/git.ts
import { execFileSync } from "child_process";
function getGitConfig(key) {
  try {
    const value = execFileSync("git", ["config", "--global", key], {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"]
    }).trim();
    return { exists: true, value };
  } catch (error) {
    return { exists: false, value: null };
  }
}
function setGitConfig(key, value) {
  execFileSync("git", ["config", "--global", key, value], {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"]
  });
}
function unsetGitConfig(key) {
  try {
    execFileSync("git", ["config", "--global", "--unset", key], {
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

// src/install.ts
import fs2 from "fs/promises";
async function install(options = {}) {
  const logger2 = new Logger(options.silent);
  const config = getConfig();
  try {
    logger2.start("Creating git templates directory...");
    await fs2.mkdir(config.hooksDir, { recursive: true });
    const hookContent = generateHookContent();
    await fs2.writeFile(config.hookFile, hookContent, { mode: 493 });
    logger2.succeed(`Hook created at ${config.hookFile}`);
    logger2.start("Configuring git templates...");
    const currentTemplate = getTemplateDir();
    const templateDirForGit = toGitPath(config.templateDir);
    if (currentTemplate.exists && currentTemplate.value !== templateDirForGit) {
      logger2.warning(`Current template directory: ${currentTemplate.value}`);
      logger2.info(`To use the new hook, run:`);
      logger2.blank();
      logger2.info(`  git config --global init.templatedir '${templateDirForGit}'`);
      logger2.blank();
      return {
        success: true,
        message: "Hook installed but git config needs update",
        hookPath: config.hookFile,
        needsInit: true
      };
    }
    if (!currentTemplate.exists) {
      setTemplateDir(config.templateDir);
      logger2.succeed(`Git template directory set to ${templateDirForGit}`);
    } else {
      logger2.succeed(`Git template directory already configured`);
    }
    logger2.blank();
    logger2.success("✨ Installation complete!");
    return {
      success: true,
      message: "Successfully installed git-no-ai-author",
      hookPath: config.hookFile,
      needsInit: false
    };
  } catch (error) {
    logger2.fail("Installation failed");
    if (error instanceof Error) {
      logger2.error(error.message);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
async function main2() {
  const logger2 = new Logger;
  logger2.header("\uD83D\uDE80 git-no-ai-author");
  logger2.blank();
  const result = await install();
  if (result.success) {
    logger2.blank();
    logger2.info("The following AI signatures will be removed:");
    const patterns = getPatternNames();
    patterns.forEach((p) => logger2.info(`  • ${p}`));
    logger2.blank();
    logger2.info("For existing repositories, run:");
    logger2.blank();
    logger2.info("  cd <your-repo> && git init");
    logger2.blank();
    process.exit(0);
  } else {
    logger2.blank();
    logger2.error("Installation failed. Please try again.");
    process.exit(1);
  }
}
export {
  main2 as main,
  install
};
