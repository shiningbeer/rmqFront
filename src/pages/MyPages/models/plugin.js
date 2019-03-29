import { plugin } from '@/services/myapi';
import { message } from 'antd';
import { parse } from 'path-to-regexp';
import { parseTwoDigitYear } from 'moment';
export default {
  namespace: 'plugin',

  state: {
    pluginList: [],
    numOfChecked:0
  },

  effects: {
    *get(_, { call, put }) {
      const response = yield call(plugin.get);
      yield put({
        type: 'getSuccess',
        pluginList: response,
      });
    },    
    *del({payload}, { call, put }) {
      const re =yield call(plugin.del,{pluginName:payload});
      re=='ok'?message.success('删除插件成功'):message.warning('删除插件失败')
      const response = yield call(plugin.get);
      yield put({
        type: 'getSuccess',
        pluginList: response,
      });
    }, 
    
    *update({payload}, { call, put }) {
      const re =yield call(plugin.update,payload);
      re=='ok'?message.success('更新插件成功'):message.warning('更新插件失败')
      const response = yield call(plugin.get);
      yield put({
        type: 'getSuccess',
        pluginList: response,
      });
    }, 

  },

  reducers: {
    getSuccess(state, {pluginList}) {
      for(var item of pluginList){
          item.checked=false
      }
      return {
        ...state,
        pluginList:pluginList,
      };
    },
    checkedAll(state,{checked}){
        let num=checked?state.pluginList.length:0
        for(var item of state.pluginList){
          if(item.protocal==''||item.port=='')
              continue
            item.checked=checked
        }
        
        return {
            ...state,
            numOfChecked:num,
            pluginList:state.pluginList,
          };
    },
    checkedOne(state,{index}){
        state.pluginList[index].checked=!state.pluginList[index].checked
        let num=0
        for(var item of state.pluginList){
          item.checked?num=num+1:num=num
        }
        return {
            ...state,
            numOfChecked:num,
            pluginList:state.pluginList,
          };

    },
  },
};
