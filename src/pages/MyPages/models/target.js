import { target } from '@/services/myapi';
import { message } from 'antd';
export default {
  namespace: 'target',

  state: {
    targetList: [],
    numOfChecked: 0
  },

  effects: {
    *get(_, { call, put }) {
      const response = yield call(target.get);
      yield put({
        type: 'getSuccess',
        targetList: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(target.add, { newTarget: payload });
      if (response == 'ok') {
        message.success('提交成功')
      }
      else
        message.warning('提交失败')

    },
    *del({ payload }, { call, put }) {
      const re = yield call(target.del, { targetId: payload });
      re == 'ok' ? message.success('删除目标成功') : message.warning('删除目标失败')
      const response = yield call(target.get);
      yield put({
        type: 'getSuccess',
        targetList: response,
      });
    },
    *update({ payload }, { call, put }) {
      const re = yield call(target.update, payload);
      re == 'ok' ? message.success('更新目标成功') : message.warning('更新目标失败')
      const response = yield call(target.get);
      yield put({
        type: 'getSuccess',
        targetList: response,
      });
    },
  },

  reducers: {
    getSuccess(state, { targetList }) {
      for (var item of targetList) {
        item.checked = false
      }
      return {
        ...state,
        targetList: targetList,
      };
    },
    checkedAll(state, { checked }) {
      let num = checked ? state.targetList.length : 0
      for (var item of state.targetList) {
        item.checked = checked
      }

      return {
        ...state,
        numOfChecked: num,
        targetList: state.targetList,
      };
    },
    checkedOne(state, { index }) {
      state.targetList[index].checked = !state.targetList[index].checked
      let num = 0
      for (var item of state.targetList) {
        item.checked ? num = num + 1 : num = num
      }
      return {
        ...state,
        numOfChecked: num,
        targetList: state.targetList,
      };

    },
  },
};
