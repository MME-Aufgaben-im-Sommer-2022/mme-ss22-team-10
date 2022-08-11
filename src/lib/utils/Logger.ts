/* eslint-disable no-console */
export const log = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.log(...args);
    }
  },
  warn = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.warn(...args);
    }
  },
  error = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.error(...args);
    }
  },
  info = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.info(...args);
    }
  },
  debug = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.debug(...args);
    }
  },
  assert = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.assert(...args);
    }
  },
  trace = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.trace(...args);
    }
  },
  dir = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.dir(...args);
    }
  },
  table = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.table(...args);
    }
  },
  time = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.time(...args);
    }
  },
  timeEnd = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.timeEnd(...args);
    }
  },
  group = (...args: any[]): void => {
    if (import.meta.env.VITE_LOGGER_IS_ENABLED) {
      console.group(...args);
    }
  };
