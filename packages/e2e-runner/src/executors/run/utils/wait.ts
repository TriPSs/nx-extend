export const wait = (seconds): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve()
  }, seconds * 1000)
})
