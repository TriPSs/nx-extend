import { output } from '@nx/workspace'

export class Logger {
  public debug(message: string): void {
    if (!process.env.NX_VERBOSE_LOGGING) {
      return
    }

    output.log({
      title: 'GCP-NX',
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
      title: message
    })
  }
}
