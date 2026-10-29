const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { execSync } = require('child_process');

async function pushClean() {
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
    message: 'Cleanup: remove push script and update word-list tts',
  });
  console.log('Clean commit:', sha);

  await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: branch,
    onAuth: () => ({ username: token, password: '' }),
  });
  console.log('Clean push complete!');
}

pushClean().catch(console.error);
