import * as actionTypes from './actionTypes'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  type: [
    {name: '设备', value: '01'},
    {name: '部件', value: '02'},
  ],
  maintainType: [
    {name: '维修', value: '01'},
    {name: '维护', value: '02'},
  ],
  unitClass: [],  //部件分类
  class: [],  //设备分类
  classification: [],  //ABC分类
  objectCls: [],  //固定资产分类
  vehicleRoute: [],  //行车路线
  anchorsections: [],  //锚段号
  stationtracks: [],  //股道号
  catenaryType: [],  //触网类型
  peoples: [],  //人员
  catenaryLocationType: [],  //布置位置
  overheadLineDebugItem: [],  //项目
  configLocations:[], //线路信息
  templates:[],
  unitTemplates:[]
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_OBJECTCLS:
      return state.set('objectCls', action.data)
    case actionTypes.CHANGE_CLASS:
      return state.set('class', action.data)
    case actionTypes.CHANGE_CLASSIFICATION:
      return state.set('classification', action.data)
    case actionTypes.CHANGE_UNITCLASS:
      return state.set('unitClass', action.data)
    case actionTypes.CHANGE_VEHICLE_ROUTE:
      return state.set('vehicleRoute', action.data)
      case actionTypes.CHANGE_ANCHORSECTIONS:
    return state.set('anchorsections', action.data)
    case actionTypes.CHANGE_STATIONTRACKS:
      return state.set('stationtracks', action.data)
    case actionTypes.CHANGE_CATENARY_TYPE:
      return state.set('catenaryType', action.data)
    case actionTypes.CHANGE_CATENARY_LOCATION_TYPE:
      return state.set('catenaryLocationType', action.data)
    case actionTypes.CHANGE_OVERHEAD_LINE_DEBUG_ITEM:
      return state.set('overheadLineDebugItem', action.data)
    case actionTypes.CHANGE_ConfigLocation:
      return state.set('configLocations', action.data)
    case actionTypes.CHANGE_People:
      return state.set('peoples', action.data)
    case actionTypes.CHANGE_Template:
      return state.set('templates', action.data)
    case actionTypes.CHANGE_UnitTemplate:
      return state.set('unitTemplates', action.data)
    default:
      return state
  }
}
