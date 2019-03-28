import { stringify } from 'qs';
import fetch from 'dva/fetch';
import request from '@/utils/request';
const urlbase='http://localhost:1978'
var myRequest = (url, option) => {
    let newOption={
        ...option,
        url: url,
        json: true,
        headers: {
            Accept: 'application/json',
            "content-type": "application/json",
            'token':localStorage.getItem('token'),
        },
    }
    newOption.body = JSON.stringify(newOption.body);
    return fetch(url,newOption)
    .then((response)=>{
        return {
          code:response.status,
          body:response.json()
        }
    })
    .catch((e)=>{
      return {
        code:600,
        body:'服务器无法连接'
      }

    })
    
}

export async function getUserTarget(params) {
  return request('/api/project/notice');
}


export const target={
  //mock:'/api/target/get'
  //real:urlbase+'/target/get'
  get:async ()=>request(urlbase+'/target/get', {
    method: 'POST',
  }),
  add:async (params)=>request(urlbase+'/target/add', {
    method: 'POST',
    body:params
  }),
  del:async (params)=>request(urlbase+'/target/delete', {
    method: 'POST',
    body:params
  }),
  getZmapResult:async ()=>request(urlbase+'/target/getZmapResult', {
    method: 'POST',
  }),

  update:async (params)=>request(urlbase+'/target/update', {
    method: 'POST',
    body:params
  }),

}
export const plugin={
  //mock:'/api/plugin/get'
  //real:urlbase+'/plugin/get'
  get:async ()=>request(urlbase+'/plugin/get', {
    method: 'POST',
  }),
  del:async (params)=>request(urlbase+'/plugin/delete', {
    method: 'POST',
    body:params
  }),
  update:async (params)=>request(urlbase+'/plugin/update', {
    method: 'POST',
    body:params
  }),
  
  
}
export const node={
  //mock:'/api/node/get'
  //real:urlbase+'/node/get'
  get:async ()=>request(urlbase+'/node/get', {
    method: 'POST',
  }),
  add:async (params)=>request(urlbase+'/node/add', {
    method: 'POST',
    body:params
  }),
  del:async (params)=>request(urlbase+'/node/delete', {
    method: 'POST',
    body:params
  }),
  
  getToken:async (url,params)=>myRequest(url+'/user/gettoken', {
    method: 'POST',
    body:params
  }),
}


export const usermgr={
  //mock:'/api/usermgr/get'
  //real:urlbase+'/user/get'
  get:async ()=>request(urlbase+'/user/get', {
    method: 'POST',
  }),
  getToken:async (params)=>request(urlbase+'/user/gettoken', {
    method: 'POST',
    body:params
  }),
  add:async (params)=>request(urlbase+'/user/add', {
    method: 'POST',
    body:params
  }),
  del:async (params)=>request(urlbase+'/user/delete', {
    method: 'POST',
    body:params
  }),
  
}

export const task={
  //mock:'/api/task/add'
  //real:urlbase+'/task/add'
  add:async (params)=>request(urlbase+'/task/add', {
    method: 'POST',
    body:params
  }),
  //mock:'/api/task/get'
  //real:urlbase+'/task/get'
  get:async (params)=>request(urlbase+'/task/get', {
    method: 'POST',
    body:params
  }),
  getDetail:async (params)=>request(urlbase+'/task/getdetail', {
    method: 'POST',
    body:params
  }),

  getResult:async (params)=>request(urlbase+'/task/getResult', {
    method: 'POST',
    body:params
  }),
  del:async (params)=>request(urlbase+'/task/delete', {
    method: 'POST',
    body:params
  }),
  start:async (params)=>request(urlbase+'/task/start', {
    method: 'POST',
    body:params
  }),
  resume:async (params)=>request(urlbase+'/task/resume', {
    method: 'POST',
    body:params
  }),
  pause:async (params)=>request(urlbase+'/task/pause', {
    method: 'POST',
    body:params
  }),
  resultToES:async (params)=>request(urlbase+'/task/resultToES', {
    method: 'POST',
    body:params
  }),
  
}










//********demo code */
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
