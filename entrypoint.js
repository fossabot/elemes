import { spawnSync } from 'child_process';
import { rmSync } from 'fs';

const result = spawnSync('/usr/local/bin/migrate', [
    '-source', 'file:///app/migrations',
    '-database', process.env.DATABASE_URL,
    'up'
], { stdio: 'inherit' });

if (result.status !== 0) {
    console.error('Migration failed');
    process.exit(result.status);
}

try {
    rmSync('/usr/local/bin/migrate', { force: true });
    rmSync('/app/migrations', { recursive: true, force: true });
} catch (err) {
    console.error('Error removing files:', err);
}

import('/app/.output/server/index.mjs');
