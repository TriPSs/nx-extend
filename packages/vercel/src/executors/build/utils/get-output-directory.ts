export const getOutputDirectory = (framework:string, outputPath:string): string => {
  if (framework === 'nextjs') {
    return `${outputPath}/.next`
  }

  return outputPath
}
