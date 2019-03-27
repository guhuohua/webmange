import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}

export function listSwiper(query) {
  return request({
    url: '/goods/swiper',
    method: 'get',
    params: query
  })
}

export function publishGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/goods/edit',
    method: 'post',
    data
  })
}

export function typeList() {
  return request({
    url: '/type/typeList',
    method: 'get'
  })
}

export function getRandomGoodsSn() {
  return request({
    url: '/goods/goodsSn',
    method: 'get'
  })
}

export function listCatAndBrand() {
  return request({
    url: '/type/typeList',
    method: 'get'
  })
}


export function detailGoodsText(id) {
  return request({
    url: '/goods/goodsText/' + id,
    method: 'get'
  })
}
