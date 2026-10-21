import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const compilerPackage = require.resolve('typescript/package.json');
const compiler = join(dirname(compilerPackage), JSON.parse(readFileSync(compilerPackage, 'utf8')).bin.tsc);
const dist = join(root, 'dist');
const temporary = join(dist, '.build');

rmSync(dist, { recursive: true, force: true });
try {
  // Use the native compiler's CLI; no TypeScript compiler API or plugin is needed.
  execFileSync(process.execPath, [compiler, '--project', join(root, 'tsconfig.json')], { stdio: 'inherit' });
  const bundle = await rollup({ input: join(temporary, 'index.js') });
  try {
    for (const [file, format] of [
      ['@sa-data.js', 'cjs'],
      ['@sa-data.modern.mjs', 'es'],
      ['@sa-data.module.mjs', 'es'],
      ['@sa-data.umd.js', 'umd'],
    ]) {
      await bundle.write({ file: join(dist, file), format, name: 'data', exports: 'named' });
    }
  } finally {
    await bundle.close();
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
