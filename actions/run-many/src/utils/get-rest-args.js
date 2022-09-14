module.exports.getRestArgs = function () {
  return process.argv
    .slice(2)
    .map((a) => `"${a}"`)
    .join(' ')
}