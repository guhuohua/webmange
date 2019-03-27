import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function readUser(data) {
  return request({
    url: '/user/detail',
    method: 'get',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function applyList(query) {
  return request({
    url: '/apply/list',
    method: 'get',
    params: query
  })
}

export function applyUser(data) {
  return request({
    url: '/apply/agree',
    method: 'post',
    data
  })
}

export function refuseUser(data) {
  return request({
    url: '/apply/refuse',
    method: 'post',
    data
  })
}

export function dividendUser(query) {
  return request({
    url: '/dashboard/dividend',
    method: 'get',
    params: query
  })
}

export function statisticalUser(query) {
  return request({
    url: '/dashboard/dividend/statistical',
    url: '/dashboard/dividend/statistical',
    method: 'get',
    params: query
  })
}
