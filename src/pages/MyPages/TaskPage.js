import React, { PureComponent, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import crypto from 'crypto'
import Identicon from 'identicon.js'
import { FaPlayCircle, FaPauseCircle, FaTrashO } from 'react-icons/lib/fa'
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar, Modal, Form, DatePicker, message, Upload, Select, Table, Divider, } from 'antd';
const Dragger = Upload.Dragger;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import NewTaskModal from './NewTaskModal'
import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ task, loading }) => ({
  taskList: task.taskList,
  loading: loading.effects['task/get']
}))
@Form.create()
class BasicList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/get',
      condition: {},
    });
  }
  state = {

    TaskDetailModalVisible: false,
    NewTaskModalVisible: false,
  }

  render() {
    const {
      taskList,
      loading,
      dispatch,
    } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    console.log(taskList)
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="waiting">我的</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const confirm = Modal.confirm;
    function showConfirm(record) {
      confirm({
        title: '确认删除',
        content: `确认要删除任务"${record.name}"吗？`,
        onOk() {
          dispatch({
            type: 'task/del',
            taskId: record._id,
          });
        },
        onCancel() { },
      });
    }

    const columns = [
      {
        title: '任务名',
        dataIndex: 'name',
        width: '15%',
        render: (text, record) => {
          let hash = crypto.createHash('md5')
          hash.update(text);
          let imgData = new Identicon(hash.digest('hex')).toString()
          let imgUrl = 'data:image/png;base64,' + imgData

          return (
            <span><Avatar src={imgUrl} shape="square" size="small" style={{ marginRight: '10px' }} />{text}</span>
          )
        },
      },
            {
        title: '类型',
        dataIndex: 'type',
        width: '10%',
        render: (text, record) => {
          if (text == 'port')
            return '端口'
          if (text == 'plugin')
            return '插件'
          if (text == 'combine')
            return '联合'
        },
      },
      {
        title: '插件',
        dataIndex: 'plugin',
        width: '10%',
        render: (text, record) => {
          if (text == null)
            return '无'
          else
            return text
        },
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '10%',
      },

      {
        title: '当前进度',
        dataIndex: 'process',
        width: '15%',
        render: (text, record) => {
          return (
            <Progress  percent={20} status={'normal'} strokeWidth={6} style={{ width: 160,paddingLeft:10 }}/> 
          )
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '15%',
        render: (text, record) => {
          return (
            moment(text).format('YYYY-MM-DD HH:mm')
          )
        },
      },
      {
        title: '用户',
        dataIndex: 'user',
        width: '5%',
        render: (text, record) => {
          if (text == '')
            return '请完善'
          else
            return text
        },
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => {
          let index = record._id
          let renderPlayPauseButton = () => {
            if (!record.started)
              return (
                <FaPlayCircle className={styles.icon}
                  onClick={() => dispatch({ type: 'task/start', taskId: record._id })}
                />
              )
            if (record.paused)
              return (
                <FaPlayCircle className={styles.icon}
                  onClick={() => dispatch({ type: 'task/resume', taskId: record._id })} />
              )
            return (
              <FaPauseCircle className={styles.icon}
                onClick={() => dispatch({ type: 'task/pause', taskId: record._id })}
              />
            )
          }
          let renderPlayPauseButton_notUser = () => {

            if (record.paused)
              return (
                <FaPlayCircle style={{ fontSize: 28, color: 'grey' }} />
              )
            return (
              <FaPauseCircle style={{ fontSize: 28, color: 'grey' }} />
            )
          }
          if (record.user == localStorage.getItem('icsUser'))
            return (
              <Fragment>
                <a>详情</a>
                <Divider type='vertical' />
                {renderPlayPauseButton()}
                <FaTrashO className={styles.icon}
                  onClick={() => showConfirm(record)}
                />
              </Fragment>)
          else
            return (
              <Fragment>
                <a>详情</a>
                <Divider type='vertical' />
                {renderPlayPauseButton_notUser()}
                <FaTrashO style={{ fontSize: 28, color: 'grey' }} />
              </Fragment>
            )


        },
      },
    ];
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    return (
      <PageHeaderWrapper content={
        <div>
          <p>支持三种类型任务，端口任务、插件任务以及联合任务。</p>
          <p>联合任务是指首先进行端口任务，然后以端口任务的结果作为目标，再次执行插件任务。</p>
        </div>
      }>

        <div className={styles.standardList}>

          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的任务" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32 IP/分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card>
          <Card
            className={styles.listCard}
            bordered={false}
            title="任务列表"
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button onClick={() => { this.setState({ NewTaskModalVisible: true }) }} type="dashed"
              style=
              {{ width: '100%', marginBottom: 18, fontWeight: '400', fontSize: 20, height: 60 }}
              icon="plus">
              新建任务
            </Button>
            <Table
              loading={loading}
              dataSource={taskList}
              columns={columns}
            />
          </Card>
        </div>
        <NewTaskModal
          visible={this.state.NewTaskModalVisible}
          hideModal={() => { this.setState({ NewTaskModalVisible: false }) }}
        />

      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
