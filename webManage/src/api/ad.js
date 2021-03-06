import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/info/list',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/info/create',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/info/read',
    method: 'get',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/info/update',
    method: 'post',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: '/info/delete',
    method: 'post',
    data
  })
}
