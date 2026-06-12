import { spawnSync } from 'child_process';
import path from 'path';
import { ROOT } from './lib/utils.mjs';

export async function run({ dryRun = false } = {}) {
  if (dryRun) {
    console.log('  npcs-bundle: dry-run, пропуск сборки aiNpcs.ts');
    return { section: 'npcs-bundle', dryRun: true };
  }
  const script = path.join(ROOT, 'scripts/rebuild-ai-npcs.mjs');
  const r = spawnSync(process.execPath, [script], { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) throw new Error('rebuild-ai-npcs.mjs завершился с ошибкой');
  return { section: 'npcs-bundle', written: [path.join(ROOT, 'src/data/aiNpcs.ts')] };
}
