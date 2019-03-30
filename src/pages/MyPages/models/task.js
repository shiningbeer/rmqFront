import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { task } from '@/services/myapi';

export default {
  namespace: 'task',

  state: {
    newTask: {
      name: '',
      description: '',
      targetList: [],
      pluginList: [],
    },
    taskList: [],
    taskDetail: {},
    taskResult: []
  },

  effects: {
    *add({ newTask }, { put, call }) {
      const result = yield call(task.add, { newTask });
      result == 'ok' ? message.success('新建任务成功') : message.warning('新建任务失败')
        yield put({
          type: 'get',
          condition:{}
        })
    },
    *get({ condition }, { put, call }) {
      const result = yield call(task.get, { condition });
      yield put({
        type: 'getTaskList',
        taskList: result
      });
    },
    *getDetail({ taskId }, { put, call }) {
      const result = yield call(task.getDetail, { taskId });
      yield put({
        type: 'getTaskDetail',
        taskDetail: result
      });
    },

    *getTaskResult({ taskId }, { put, call }) {
      const result = yield call(task.getResult, { taskId });
      yield put({
        type: 'getResult',
        taskResult: result
      });
    },
    *del({ taskId }, { call, put }) {
      const re = yield call(task.del, { taskId });
      re == 'ok' ? message.success('删除任务成功') : message.warning('删除任务失败')
      yield put({
        type: 'get',
        condition: {},
      });
    },
    *start({ taskId, nodeList }, { call, put }) {
      const re = yield call(task.start, { taskId, nodeList });
      re == 'ok' ? message.success('任务已开始') : message.warning('开始任务失败')
      yield put({
        type: 'get',
        condition: {},
      });
    },
    *resume({ taskId }, { call, put }) {
      const re = yield call(task.resume, { taskId });
      re == 'ok' ? message.success('继续任务成功') : message.warning('继续任务失败')
      yield put({
        type: 'get',
        condition: {},
      });
    },
    *pause({ taskId }, { call, put }) {
      const re = yield call(task.pause, { taskId });
      re == 'ok' ? message.success('成功暂停任务') : message.warning('暂停任务失败')
      yield put({
        type: 'get',
        condition: {},
      });
    },
    *resultToES({ taskId }, { call, put }) {
      const re = yield call(task.resultToES, { taskId });
      re == 'ok' ? message.success('成功导入ES数据库') : message.warning('导入ES数据库失败')
      yield put({
        type: 'getDetail',
        taskId: taskId
      });
    },

  },

  reducers: {
    saveStepData(state, { stepData }) {
      console.log(stepData)
      return {
        ...state,
        newTask: {
          ...state.newTask,
          ...stepData,
        },
      };
    },

    getTaskList(state, { taskList }) {
      return {
        ...state,
        taskList,
      };
    },
    getTaskDetail(state, { taskDetail }) {
      return {
        ...state,
        taskDetail,
      };
    },

    getResult(state, { taskResult }) {
      return {
        ...state,
        taskResult,
      };
    },
  },
};
