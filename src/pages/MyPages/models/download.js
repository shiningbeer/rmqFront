
import { download} from '@/services/myapi';
import { message } from 'antd';
export default {
    namespace: 'download',

    state:[],
    effects: {

        *download({ payload }, { call, put }) {
            const response = yield call(download, { id: payload });
            console.log(response)

        },
    },
     reducers: {
         ok(){
             return({...state})
         }
             
         
     }
};
