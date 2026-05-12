type LogArgs = unknown[];

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

export const logger = {
    debug: (...args: LogArgs) => {
        if (isDev) {
            console.log(...args);
        }
    },
    info: (...args: LogArgs) => {
        if (isDev) {
            console.info(...args);
        }
    },
    warn: (...args: LogArgs) => {
        console.warn(...args);
    },
    error: (...args: LogArgs) => {
        console.error(...args);
    },
};
