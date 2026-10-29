const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { execSync } = require('child_process');

async function pushUpdate() {
  const dir = path.resolve(__dirname);
  const token = execSync('gh auth token').toString().trim();
  const branch = await git.currentBranch({ fs, dir }) || 'master';

  const statusMatrix = await git.statusMatrix({ fs, dir });
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (filepath.startsWith('.next/') || filepath.startsWith('node_modules/')) continue;
    if (workdir === 0) {
      await git.remove({ fs, dir, filepath });
    } else if (workdir !== stage) {
      await git.add({ fs, dir, filepath });
    }
  }

  const sha = await git.commit({
    fs,
    dir,
    author: { name: 'dals-kids-assistant', email: 'assistant@dalskids.com' },
    message: 'Feat: Add Curious George worksheet preset and phrase parsing improvements',
  });
  console.log('Committed:', sha);

  await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: branch,
    onAuth: () => ({ username: token, password: '' }),
  });
  console.log('Successfully pushed Curious George update to GitHub & Vercel!');
}

pushUpdate().catch(console.error);
