export default function getNameFromGitUrl (url: string): string {
  const matched = /([\w\d\-_]+?).git$/.exec(url)
  if (!matched) {
    return ''
  }

  return matched[1]
}
