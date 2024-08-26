import service from './request'
export function getInventoryInfo(params: any) {
  return service({
    url: '/api/v1/inventory_info?sku='+ params.sku,
    method: 'get'
  })
}

export function getSkuInfo(params: any) {
    return service({
      url: '/api/v1/sku_info?sku='+ params.sku + (params.manu ? '&manu='+ params.manu : ''),
      method: 'get'
    })
  }

export function getSkuAttributeInfo() {
    return service({
      url: '/api/v1/sku_attribute_info',
      method: 'get'
    })
  }
  export function getSkuAddInfo(params: any) {
    return service({
      url: '/api/v1/sku_add_info?sku='+ params.sku + "&manufacturer="+ params.manufacturer,
      method: 'get'
    })
  }