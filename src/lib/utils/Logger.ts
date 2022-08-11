/* eslint-disable no-console */
const DO_LOG = import.meta.env.VITE_LOGGER_IS_ENABLED === "true";

// eslint-disable-next-line one-var
export const log = (...args: any[]): void => {
    if (DO_LOG) {
      console.log(...args);
    }
  },
  warn = (...args: any[]): void => {
    if (DO_LOG) {
      console.warn(...args);
    }
  },
  error = (...args: any[]): void => {
    if (DO_LOG) {
      console.error(...args);
    }
  },
  info = (...args: any[]): void => {
    if (DO_LOG) {
      console.info(...args);
    }
  },
  debug = (...args: any[]): void => {
    if (DO_LOG) {
      console.debug(...args);
    }
  },
  assert = (...args: any[]): void => {
    if (DO_LOG) {
      console.assert(...args);
    }
  },
  trace = (...args: any[]): void => {
    if (DO_LOG) {
      console.trace(...args);
    }
  },
  dir = (...args: any[]): void => {
    if (DO_LOG) {
      console.dir(...args);
    }
  },
  table = (...args: any[]): void => {
    if (DO_LOG) {
      console.table(...args);
    }
  },
  time = (...args: any[]): void => {
    if (DO_LOG) {
      console.time(...args);
    }
  },
  timeEnd = (...args: any[]): void => {
    if (DO_LOG) {
      console.timeEnd(...args);
    }
  },
  group = (...args: any[]): void => {
    if (DO_LOG) {
      console.group(...args);
    }
  };
