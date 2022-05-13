import axios from 'axios'

export const isApiLive = async (url: string): Promise<boolean> => {
  return axios.get(url, {
    timeout: 500
  }).then((response) => {
    return response.status >= 200 && response.status < 300

  }).catch(() => {
    return false
  })
}