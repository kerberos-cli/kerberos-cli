/* prettier-ignore */
/** linux 常用命令 */
const linux = [
  'cd',
  'ls', 'ls -l', 'll',
  'export', 'grep', 'cat', 'tail', 'echo', 'pwd',
  'mkdir', 'cp', 'mv', 'rm',
  'vim', 'vi', 'chown', 'chmod', 'tar',
  'ps', 'kill', 'killall',
]

/* prettier-ignore */
/** Git 常用命令 */
const git = [
  'git',
  'git add', 'git rm', 'git mv',
  'git status', 'git log', 'git show', 'git branch',
  'git commit', 'git merge', 'git rebase', 'git reset',
  'git fetch', 'git pull', 'git push',
]

/* prettier-ignore */
/** Node 常用命令 */
const node = [
  'node', 'npm', 'yarn'
]

export default [...linux, ...git, ...node]
