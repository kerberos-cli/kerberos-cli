import fs from 'fs-extra'
import commandExists from 'command-exists'
import isGitUrl from 'is-git-url'
import { spawn, getStdout } from './process'
import { execPath } from '../constants/config'

export async function checkGit(): Promise<void> {
  if (!(await commandExists('git'))) {
    throw new Error('Git is not installed.')
  }
}

export async function clone(repo: string, name?: string, cwd: string = execPath): Promise<void> {
  if (!isGitUrl(repo)) {
    throw new Error('Repo is not a valid git url')
  }

  await checkGit()
  await fs.ensureDir(cwd)

  const args = ['clone', repo]
  if (typeof name === 'string') {
    args.push(name)
  }

  await spawn('git', args, { cwd, stdio: 'inherit' })
}

export async function getGitBranch(): Promise<void> {
  const q = await getStdout('git branch -a')
  console.log(q)
}

getGitBranch().then(() => {
  
})

// function parseBranches(str) {
//   if (!str) return [];
//   var lines = str.trim().split(os.EOL);
//   var res = [];
//   for (var i = 0; i < lines.length; i++) {
//     var line = lines[i].trim().replace(/^\*\s*/, '');
//     res.push(line.split('/').pop());
//   }
//   return res;
// }