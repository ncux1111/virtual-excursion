const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const devServerUrl = "http://127.0.0.1:5173";
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const electronCommand = path.join(rootDir, "node_modules", ".bin", isWindows ? "electron.cmd" : "electron");

let viteProcess = null;
let electronProcess = null;

function canReachDevServer() {
  return new Promise((resolve) => {
    const request = http.get(devServerUrl, (response) => {
      response.resume();
      resolve(response.statusCode && response.statusCode < 500);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(900, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForDevServer(timeoutMs = 45000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await canReachDevServer()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Vite dev server did not start at ${devServerUrl}`);
}

function startVite() {
  viteProcess = spawn(
    npmCommand,
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort"],
    {
      cwd: rootDir,
      stdio: "inherit",
      env: process.env,
    },
  );

  viteProcess.on("exit", (code) => {
    if (electronProcess && !electronProcess.killed) {
      electronProcess.kill();
    }

    if (code && code !== 0) {
      process.exitCode = code;
    }
  });
}

function startElectron() {
  electronProcess = spawn(electronCommand, [path.join(rootDir, "electron", "main.cjs")], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: devServerUrl,
    },
  });

  electronProcess.on("exit", (code) => {
    if (viteProcess && !viteProcess.killed) {
      viteProcess.kill();
    }

    process.exit(code ?? 0);
  });
}

function cleanup() {
  if (electronProcess && !electronProcess.killed) {
    electronProcess.kill();
  }

  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill();
  }
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

(async () => {
  if (!(await canReachDevServer())) {
    startVite();
  }

  await waitForDevServer();
  startElectron();
})().catch((error) => {
  cleanup();
  console.error(error);
  process.exit(1);
});
