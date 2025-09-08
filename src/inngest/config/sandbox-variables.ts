import "server-only";

export const SANDBOX_NAME = "runp-test-dev"; // SANDBOX_NAME relates to the E2B docker image's name, they MUST match
export const SANDBOX_PORT = 3000; // nextjs sandbox template port
export const SANDBOX_TIMEOUT = 60_000 * 10 * 3; // 1h = 3_600_000, 30m=60_000*10*3
