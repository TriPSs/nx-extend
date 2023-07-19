import axios, { AxiosRequestConfig } from 'axios'
import { Agent } from 'https'

export const isApiLive = async (
  url: string,
  options: Partial<{ rejectUnauthorized: boolean }> = {}
): Promise<boolean> => {
  const axiosConfig: AxiosRequestConfig = {
    timeout: 500
  }

  if (options?.rejectUnauthorized !== undefined) {
    axiosConfig.httpsAgent = new Agent({
      rejectUnauthorized: options.rejectUnauthorized
    })
  }

  return axios
    .get(url, axiosConfig)
    .then((response) => (
      response.status >= 200 && response.status < 300
    ))
    .catch(() => {
      return false
    })
}
