import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function runEditorial(command) {
  const manager = fileURLToPath(new URL('../editorial/manage.py', import.meta.url));
  const child = spawn('python3', [manager, command, ...process.argv.slice(2)], { stdio: 'inherit' });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => child.kill(signal));
  }
  child.on('error', error => {
    console.error(error.message);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
  });
}
