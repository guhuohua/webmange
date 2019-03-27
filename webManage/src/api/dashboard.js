import request from '@/utils/request'

export function info(query) {
  return request({
    url: '/dashboard/dashboard',
    method: 'get',
    params: query
  })
}
