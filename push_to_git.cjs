const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { execSync } = require('child_process');

async function pushToGitHub() {
  const dir = path.resolve(__dirname);
  console.log('Project dir:', dir);

  // 1. GitHub 토큰 가져오기
  let token = '';
  try {
    token = execSync('gh auth token').toString().trim();
    console.log('Got GitHub token from gh CLI!');
  } catch (err) {
    console.error('Failed to get token from gh CLI:', err.message);
    return;
  }

  // 2. 현재 브랜치 확인
  const branch = await git.currentBranch({ fs, dir }) || 'master';
  console.log('Current branch:', branch);

  // 3. 변경된 파일 목록 찾기
  const FILE = 0, WORKDIR = 2, STAGE = 3;
  const statusMatrix = await git.statusMatrix({ fs, dir });
  console.log(`Checking ${statusMatrix.length} tracked/untracked entries...`);

  // .gitignore에 따라 제외될 파일들 외에 추가할 파일 스테이징
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (filepath.startsWith('.next/') || filepath.startsWith('node_modules/') || filepath.startsWith('.user_uploaded/')) {
      continue;
    }

    if (workdir !== stage) {
      if (workdir === 0) {
        // 파일 삭제됨
        console.log('Removing:', filepath);
        await git.remove({ fs, dir, filepath });
      } else {
        // 파일 추가 또는 수정됨
        console.log('Adding:', filepath);
        await git.add({ fs, dir, filepath });
      }
    }
  }

  // 4. 커밋 생성
  console.log('Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'dals-kids-assistant',
      email: 'assistant@dalskids.com',
    },
    message: 'Fix: Fix quiz option shuffle bug, add TTS pronunciation audio, and improve worksheet OCR',
  });
  console.log('Commit created with SHA:', sha);

  // 5. 원격 푸시
  console.log('Pushing to GitHub origin master...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: branch,
    onAuth: () => ({
      username: token,
      password: '',
    }),
  });

  console.log('Push Result:', pushResult);
  console.log('Successfully pushed to GitHub! Vercel will automatically trigger a deployment.');
}

pushToGitHub().catch(err => {
  console.error('Git push failed:', err);
});
