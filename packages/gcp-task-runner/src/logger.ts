import { output } from '@nx/workspace'

export class Logger {
  public debug(message: string): void {
    if (!process.env.NX_VERBOSE_LOGGING) {
      return
    }

    output.log({
      title: 'GCP Task runner',
      bodyLines: message.split('\n') ?? []
    })
  }

  public error(message: string, error: Error): void {
    output.error({
      title: message,
      bodyLines: error?.message?.split('\n') ?? []
    })
  }

  public warn(message: string, error?: Error): void {
    output.warn({
      title: message,
      bodyLines: error?.message?.split('\n') ?? []
    })
  }

  public success(message: string): void {
    output.success({
      title: 'GCP Task runner',
      bodyLines: message.split('\n')
    })
  }

  public note(message: string): void {
    output.addNewline()
    output.note({
      title: 'GCP Task runner',
      bodyLines: message.split('\n')
    })
    output.addNewline()
  }
}
