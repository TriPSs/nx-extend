export function getRestArgs() {
  return process.argv
    .slice(2)
    .filter((arg) => (
      !arg.includes('--tag')
      && !arg.includes('--target')
      && !arg.includes('--parallel')
      && !arg.includes('--config')
    ))
    .map((a) => `"${a}"`)
    .join(' ')
}
