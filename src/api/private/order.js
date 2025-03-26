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

export function getOrderDetails(id) {
  return request({
    url: 'api/order/info',
    method: 'get',
    params: {
      id
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

export function deleteOrder(data) {
  return request({
    url: 'api/order/delete',
    method: 'delete',
    data
  })
}

// 查询全部订单编号
export function getOrderNumList(orderNum) {
  return request({
    url: 'api/order/orderNumList',
    method: 'get',
    params: {
      orderNum
    }
  })
}
