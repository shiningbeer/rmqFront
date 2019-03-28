import React, { PureComponent, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import crypto from 'crypto'
import Identicon from 'identicon.js'
import { FaEdit, FaTrashO } from 'react-icons/lib/fa'
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar, Modal, Form, DatePicker, message, Upload, Select, Table, Divider, } from 'antd';
const Dragger = Upload.Dragger;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ usermgr, loading }) => ({
  usermgrList:usermgr.usermgrList,
  loading: loading.effects['usermgr/get'],
  addUserLoading:loading.effects['usermgr/add']
}))
@Form.create()
class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'usermgr/get',
      payload: {
        count: 6,
      },
    });
  }
  state={
    mouseOverEditBtnIndex:-1,
    mouseOverDelBtnIndex:-1
  }
  render() {
 

    return (
      <PageHeaderWrapper title='敬请期待！' content='本页面主要用于节点的部署和监控，尚未实现，目前节点需要手动部署。'>
        
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
