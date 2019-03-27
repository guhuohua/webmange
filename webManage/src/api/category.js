import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/type/list',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/type/rootList',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/type/create',
    method: 'post',
    data
  })
}

export function readCategory(data) {
  return request({
    url: '/type/read',
    method: 'get',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/type/update',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/type/delete',
    method: 'post',
    data
  })
}
