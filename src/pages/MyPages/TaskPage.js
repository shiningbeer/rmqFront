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
import NewTaskModal from './NewTaskModal'
import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ task,loading }) => ({
  task:task.taskList,
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
    mouseOverEditBtnIndex: -1,
    mouseOverDelBtnIndex: -1,
    modalVisible: false,
    selectedPlugin: {},
    NewTaskModalVisible:false,
  }

  render() {
    const {
      taskList,
      loading,
      dispatch,
    } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="waiting">我的</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );
    const editBtnOutLook = (index) => index == this.state.mouseOverEditBtnIndex ?
      {
        size: 28,
        color: 'red'
      } :
      {
        size: 28,
        color: 'dodgerblue'
      }
    const delBtnOutLook = (index) => index == this.state.mouseOverDelBtnIndex ?
      {
        size: 30,
        color: 'red'
      } :
      {
        size: 30,
        color: 'dodgerblue'
      }
    const onModalOk = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          dispatch({
            type: 'plugin/update',
            payload: {
              name: this.state.selectedPlugin.name,
              update: values
            }
          })
          resetFields()
          this.setState({
            modalVisible: false,
          })
        }
      })
    }

    const onModalCancel = () => {
      this.setState({
        modalVisible: false,
      })
      resetFields()

    }
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
    function showConfirm(name) {
      confirm({
        title: '确认删除',
        content: `确认要删除插件"${name}"吗？`,
        onOk() {
          dispatch({
            type: 'plugin/del',
            payload: name,
          });
        },
        onCancel() { },
      });
    }

    const columns = [
      {
        title: '任务名',
        dataIndex: 'name',
        width: '20%',
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
        title: '描述',
        dataIndex: 'description',
        width: '20%',
        render: (text, record) => {
          if (text == '')
            return '该插件尚未添加任何描述信息'
          else
            return text
        },
      },
      {
        title: '类型',
        dataIndex: 'port',
        width: '10%',
        render: (text, record) => {
          if (text == '')
            return '请完善'
          else
            return text
        },
      },
      {
        title: '执行阶段',
        dataIndex: 'dd',
        width: '10%',
        render: (text, record) => {
          if (text == '')
            return '请完善'
          else
            return text
        },
      },
      {
        title: '当前进度',
        dataIndex: 'protocal',
        width: '20%',
        render: (text, record) => {
          if (text == '')
            return '请完善'
          else
            return text
        },
      },
      {
        title: '用户',
        dataIndex: 'user',
        width: '10%',
        render: (text, record) => {
          if (text == '')
            return '请完善'
          else
            return text
        },
      },
      {
        title: '操作',
        width: '10%',
        render: (text, record) => {
          let index = record._id

          if (record.user == localStorage.getItem('icsUser'))
            return (
              <Fragment>
                <FaEdit
                  style={{ fontSize: editBtnOutLook(index).size, color: editBtnOutLook(index).color, marginTop: 6 }}
                  onMouseEnter={() => this.setState({ mouseOverEditBtnIndex: index })}
                  onMouseLeave={() => this.setState({ mouseOverEditBtnIndex: -1 })}
                  onClick={() => this.setState({ modalVisible: true, selectedPlugin: record })}
                />
                <Divider type="vertical" />
                <FaTrashO
                  style={{ fontSize: delBtnOutLook(index).size, color: delBtnOutLook(index).color }}
                  onClick={() => showConfirm(record.name)}
                  onMouseEnter={() => this.setState({ mouseOverDelBtnIndex: index })}
                  onMouseLeave={() => this.setState({ mouseOverDelBtnIndex: -1 })}
                />
              </Fragment>)
          else
            return (
              <Fragment>
                <FaEdit
                  style={{ fontSize: editBtnOutLook(index).size, color: 'grey', marginTop: 6 }}
                />
                <Divider type="vertical" />
                <FaTrashO
                  style={{ fontSize: delBtnOutLook(index).size, color: 'grey' }}
                />
              </Fragment>)


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
            <Button onClick={() => { this.setState({NewTaskModalVisible:true}) }} type="dashed"
              style=
              {{ width: '100%', marginBottom: 18, fontWeight: '400', fontSize: 20, height:60 }}
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
            hideModal={()=>{this.setState({NewTaskModalVisible:false})}}
          />
       
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
