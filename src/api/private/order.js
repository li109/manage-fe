import request from '@/utils/request'

export function getOrderList(page, size) {
  if (!page) {
    page = 1
  }
  if (!size) {
    size = 10
  }
  return request({
    url: 'api/order/list',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

export function addOrder(data) {
  return request({
    url: 'api/order/save',
    method: 'post',
    data
  })
}
