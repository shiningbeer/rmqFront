import { usermgr } from '@/services/myapi';
import { message } from 'antd';
export default {
  namespace: 'usermgr',

  state: {
    usermgrList: [],
    numOfChecked:0
  },

  effects: {
    *get(_, { call, put }) {
      const response = yield call(usermgr.get);
      yield put({
        type: 'getSuccess',
        usermgrList: response,
      });
    },    
    *add({payload}, { call, put }) {
      const re =yield call(usermgr.add,{newUser:payload});
      re=='ok'?message.success('添加用户成功'):message.warning('添加用户失败')
      const response = yield call(usermgr.get);
      yield put({
        type: 'getSuccess',
        usermgrList: response,
      });
    },    
    *del({payload}, { call, put }) {
      const re =yield call(usermgr.del,{userId:payload});
      re=='ok'?message.success('删除用户成功'):message.warning('删除用户失败')
      const response = yield call(usermgr.get);
      yield put({
        type: 'getSuccess',
        usermgrList: response,
      });
    },    
  },

  reducers: {
    getSuccess(state, {usermgrList}) {
      for(var item of usermgrList){
          item.checked=false
      }
      return {
        ...state,
        usermgrList:usermgrList,
      };
    },
    checkedAll(state,{checked}){
        let num=checked?state.usermgrList.length:0
        for(var item of state.usermgrList){
            item.checked=checked
        }
        
        return {
            ...state,
            numOfChecked:num,
            usermgrList:state.usermgrList,
          };
    },
    checkedOne(state,{index}){
        state.usermgrList[index].checked=!state.usermgrList[index].checked
        let num=0
        for(var item of state.usermgrList){
          item.checked?num=num+1:num=num
        }
        return {
            ...state,
            numOfChecked:num,
            usermgrList:state.usermgrList,
          };

    },
  },
};
