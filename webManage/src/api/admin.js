import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/employee/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/employee/create',
    method: 'post',
    data
  })
}

export function readminAdmin(data) {
  return request({
    url: '/employee/readmin',
    method: 'get',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/employee/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/employee/delete',
    method: 'post',
    data
  })
}
