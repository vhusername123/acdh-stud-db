import { Worker } from "worker_threads";

//internal function to create worker
function runService(workerData: [number[], {}], path: string) {
  return new Promise((resolve, reject) => {
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
export async function run(
  workerData: number[],
  credentials: {},
  workerpath: string
) {
  const result = await runService([workerData, credentials], workerpath);
  console.log(result);
}
