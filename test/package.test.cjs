const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');
const { after, before, test } = require('node:test');

const root = path.resolve(__dirname, '..');
const compilerPackage = require.resolve('typescript/package.json');
const compiler = process.env.CONSUMER_TSC || path.join(path.dirname(compilerPackage), JSON.parse(fs.readFileSync(compilerPackage, 'utf8')).bin.tsc);
const npmCli = [
  process.env.npm_execpath,
  path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'),
  path.resolve(path.dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js'),
].find(file => file && file.endsWith('npm-cli.js') && fs.existsSync(file));
assert.ok(npmCli, 'npm must be installed alongside Node.js to test the published package');

let temporary;
let installed;
let manifest;
let packed;
let requireConsumer;

function run(script, args, cwd) {
  try {
    return execFileSync(process.execPath, [script, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    throw new Error(`${script} ${args.join(' ')} failed\n${error.stdout}\n${error.stderr}`, { cause: error });
  }
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

function checkApi(api) {
  assert.deepEqual(Object.keys(api).sort(), [
    'Backhand', 'HockeyPosition', 'HockeyStick', 'RacketType', 'Shoot',
    'UserGender', 'UserHand', 'hockeyWebFeedback', 'idHockeyOptions',
    'idOps', 'idTennisOptions', 'objKeys', 'tennisWebFeedback', 'webFeedback',
  ]);
  // Baseline from the unchanged sources before the dependency upgrade.
  // Sort object keys, but preserve array order and every data value.
  const hash = createHash('sha256').update(JSON.stringify(canonical(api))).digest('hex');
  assert.equal(hash, 'f4f91a4e6ad0a1e537ee852bd695a72071592d88c21adb3d845f8fc6f0b19f62');
  assert.deepEqual(Array.from(api.objKeys({ left: 1, right: 2 })), ['left', 'right']);
  assert.deepEqual(Array.from(api.objKeys({})), []);
  assert.deepEqual(Array.from(api.objKeys(Object.assign(Object.create({ inherited: 1 }), { own: 2 }))), ['own']);
}

before(() => {
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sensearena-data-'));
  const output = run(npmCli, ['pack', '--json', '--pack-destination', temporary], root);
  // Lifecycle tools may write build logs before npm's JSON result.
  packed = JSON.parse(output.slice(output.lastIndexOf('\n[') + 1))[0];
  fs.writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({ private: true }));
  run(npmCli, ['install', path.join(temporary, packed.filename), '--omit=dev', '--strict-peer-deps', '--no-audit', '--no-fund'], temporary);
  installed = path.join(temporary, 'node_modules/@sensearena/data');
  manifest = JSON.parse(fs.readFileSync(path.join(installed, 'package.json'), 'utf8'));
  requireConsumer = createRequire(path.join(temporary, 'consumer.cjs'));
});

after(() => {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
});

test('npm tarball contains all declared entry points and no build-time dependencies', () => {
  const files = packed.files.map(file => file.path);
  assert.ok(files.includes('LICENSE'));
  assert.ok(files.includes('dist/index.d.ts'));
  assert.equal(files.some(file => file.startsWith('dist/.build/')), false);
  assert.ok(files.every(file => file.startsWith('dist/') || ['package.json', 'README.md', 'LICENSE'].includes(file)));
  for (const entry of [manifest.main, manifest.module, manifest['umd:main'], manifest.types, ...Object.values(manifest.exports['.'])]) {
    assert.ok(fs.existsSync(path.join(installed, entry)), `Missing entry point: ${entry}`);
  }
  assert.deepEqual(manifest.dependencies || {}, {});
  assert.deepEqual(manifest.peerDependencies || {}, {});
  for (const dependency of ['microbundle', 'rollup', 'typescript', 'tslib']) {
    assert.equal(fs.existsSync(path.join(temporary, 'node_modules', dependency)), false);
  }
});

test('CommonJS consumers receive the original public API and data', () => {
  checkApi(requireConsumer('@sensearena/data'));
});

test('ESM consumers receive the original named exports and data', () => {
  const consumer = path.join(temporary, 'consumer.mjs');
  fs.writeFileSync(consumer, `import * as api from '@sensearena/data';
    console.log(JSON.stringify({ data: api, exports: Object.keys(api).sort(), keys: api.objKeys({ left: 1, right: 2 }) }));`);
  const result = JSON.parse(run(consumer, [], temporary));
  const { objKeys, ...expectedData } = requireConsumer('@sensearena/data');
  assert.deepEqual(result.exports, Object.keys(requireConsumer('@sensearena/data')).sort());
  assert.deepEqual(result.keys, ['left', 'right']);
  assert.deepEqual(canonical(result.data), canonical(expectedData));
});

test('the legacy module field and browser UMD bundle preserve the public API', async () => {
  checkApi(await import(pathToFileURL(path.join(installed, manifest.module)).href));
  const context = {};
  const umd = fs.readFileSync(path.join(installed, manifest['umd:main']), 'utf8');
  vm.runInNewContext(umd, context);
  checkApi(context.data);
  checkApi(requireConsumer(path.join(installed, manifest['umd:main'])));
  const amdExports = {};
  const define = (dependencies, factory) => {
    assert.deepEqual(Array.from(dependencies), ['exports']);
    factory(amdExports);
  };
  define.amd = {};
  vm.runInNewContext(umd, { define });
  checkApi(amdExports);
});

const typeConsumer = `
import { UserGender, UserHand, HockeyPosition, RacketType, idOps, idHockeyOptions, idTennisOptions, objKeys } from '@sensearena/data';
const gender: UserGender = UserGender.Male;
const hands: UserHand[] = idOps.plays.map(option => option.value);
const positions: HockeyPosition[] = idHockeyOptions.positions.map(option => option.value);
const rackets: RacketType[] = idTennisOptions.racket.map(option => option.value);
const keys: ('left' | 'right')[] = objKeys({ left: 1, right: 2 });
// @ts-expect-error enum types must still reject arbitrary strings
const invalid: UserGender = 'invalid';
// @ts-expect-error objKeys must preserve the key union
const wrongKeys: 'missing'[] = objKeys({ left: 1 });
`;

const compilerMajor = Number(JSON.parse(fs.readFileSync(path.resolve(compiler, '../../package.json'), 'utf8')).version.split('.')[0]);
const resolutionModes = compilerMajor < 6 ? ['Node10', 'Node16', 'NodeNext', 'Bundler'] : ['Node16', 'NodeNext', 'Bundler'];

for (const mode of resolutionModes) {
  test(`installed declarations work with ${mode} resolution and strict library checking`, () => {
    const nodeModules = mode === 'Node16' || mode === 'NodeNext';
    const extensions = nodeModules ? ['cts', 'mts'] : ['ts'];
    const files = extensions.map(extension => {
      const file = `types-${mode}.${extension}`;
      fs.writeFileSync(path.join(temporary, file), typeConsumer);
      return file;
    });
    const config = `tsconfig-${mode}.json`;
    fs.writeFileSync(path.join(temporary, config), JSON.stringify({
      compilerOptions: {
        strict: true, noEmit: true, skipLibCheck: false, types: [], target: 'ES2022',
        module: nodeModules ? mode : 'ESNext', moduleResolution: mode,
      },
      files,
    }));
    run(compiler, ['--project', config], temporary);
  });
}
