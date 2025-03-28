import request from '@/utils/request'

export function getOrderList(orderNum, page, size) {
  if(!orderNum) {
    orderNum = '' 
  }
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
      orderNum,
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

// 编辑订单
export function editOrder(data) {
  return request({
    url: 'api/order/update',
    method: 'put',
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

// 更改工序信息
export function updateProcedure(data) {
  return request({
    url: 'api/procedure/update',
    method: 'put',
    data
  })
}

// 审核工序信息
export function updateCheck(params) {
  return request({
    url: 'api/procedure/check',
    method: 'post',
    params
  })
}

// 查询工序下拉列表
export function getProcedureList() {
  return request({
    url: 'api/procedure/getProcedureList',
    method: 'get'
  })
}
