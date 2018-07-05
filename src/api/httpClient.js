import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/list',
    method: 'get',
    params: query
  })
}

export function fetchPages(query,page) {
  return request({
    url: '/page',
    method: 'get',
    params: { query,page }
  })
}

export function postReq(data) {
  return request({
    url: '/',
    method: 'post',
    data
  })
}

export function postReqWithUrl(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}


export function putReq(data) {
  return request({
    url: '/',
    method: 'put',
    data
  })
}

export function putReqWithUrl(url, data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function fetchListWithUrl(url,query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}
export function deleteReqWithUrl(url, data) {
  return request({
    url: url,
    method: 'delete',
    data
  })
}

export function getCount(url, data){
  return request({
    url: url,
    method: 'get',
    data
  })
}

export function getWithoutData(url){
  return request({
    url: url,
    method: 'get'
  })
}

export function postReqWithUrlParams(url, params) {
  return request({
    url: url,
    method: 'post',
    params
  })
}

export function get(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export function myDeleteReqWithUrl(url, data) {
  return request({
    url: url,
    method: 'delete',
    params:data
  })
}


