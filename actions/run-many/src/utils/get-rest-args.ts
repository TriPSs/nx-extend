export function getRestArgs() {
  return process.argv
    .slice(2)
    .map((a) => `"${a}"`)
    .join(' ')
}
