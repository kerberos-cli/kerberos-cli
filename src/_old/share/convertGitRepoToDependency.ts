export default function convertGitRepoToDependency(gitRepo: string, version?: string): string {
  return `git+${gitRepo}${version ? `#${version}`: ''}`
}
