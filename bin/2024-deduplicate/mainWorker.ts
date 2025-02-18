import { Worker } from "worker_threads";

//internal function to create worker
function runService<T>(workerData: [number[], {}], path: string) {
  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(path, { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(
          new Error(`Stopped the Worker Thread with the exit code: ${code}`)
        );
    });
  });
}

//function to start workers in sequence
export function promiseWorker<T>(
  workerData: number[],
  credentials: {},
  workerpath: string
) {
  return runService<T>([workerData, credentials], workerpath);
}
