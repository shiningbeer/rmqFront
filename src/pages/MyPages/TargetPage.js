import React, { PureComponent, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import crypto from 'crypto'
import Identicon from 'identicon.js'
import { FaEdit, FaTrashO } from 'react-icons/lib/fa'
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Tabs, Input, Progress, Button, Icon, Dropdown, Menu, Avatar, Modal, Form, DatePicker, message, Upload, Select, Table, Divider, } from 'antd';
const Dragger = Upload.Dragger;
const { TabPane } = Tabs
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ target, targetI, loading }) => ({
  targetList: target.targetList,
  targetListI: targetI.targetList,
  loading: loading.effects['plugin/get']
}))
@Form.create()
class BasicList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'target/get',
      payload: {},
    });
    dispatch({
      type: 'targetI/get',
      payload: {},
    });
  }
  state = {
    modalVisible: false,
    selectedPlugin: {},
    targetType: 'CIDR',
  }

  render() {
    const {
      targetList,
      targetListI,
      loading,
      dispatch,
    } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    const getProps = (url) => {
      return {
        name: 'file',
        multiple: true,
        action: url,
        headers: { 'token': localStorage.getItem('token') },
        onChange(info) {
          const status = info.file.status;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            dispatch({
              type: 'target/get',
              payload: {},
            });
            dispatch({
              type: 'targetI/get',
              payload: {},
            });
          } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
          }
        },
      }
    }
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="waiting">我的</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const onModalOk = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          if (this.state.targetType == 'CIDR')
            dispatch({
              type: 'target/update',
              payload: {
                targetId: this.state.selectedPlugin._id,
                update: values
              }
            })
          else
            dispatch({
              type: 'targetI/update',
              payload: {
                targetId: this.state.selectedPlugin._id,
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
    function showConfirm(record, targetType) {
      confirm({
        title: '确认删除',
        content: `确认要删除${targetType}目标"${record.name}"吗？`,
        onOk() {
          if (targetType == 'CIDR')
            dispatch({
              type: 'target/del',
              payload: record._id,
            });
          else
            dispatchdispatch({
              type: 'targetI/del',
              payload: record._id,
            });
        },
        onCancel() { },
      });
    }

    function getAvatar(text) {
      let hash = crypto.createHash('md5')
      hash.update(text);
      let imgData = new Identicon(hash.digest('hex')).toString()
      let imgUrl = 'data:image/png;base64,' + imgData
      return (
        <span><Avatar src={imgUrl} shape="square" size="small" style={{ marginRight: '10px' }} />{text}</span>
      )
    }
    const getColumns = (targetType) => {
      return ([
        {
          title: '目标名',
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
          width: '40%',
          render: (text, record) => {
            if (text == '')
              return '该目标尚未添加任何描述信息'
            else
              return text
          },
        },
        {
          title: '行数',
          dataIndex: 'lines',
          width: '10%',
          render: (text, record) => {
            if (text == '')
              return '请完善'
            else
              return text
          },
        },


        {
          title: '上传用户',
          dataIndex: 'createdby',
          width: '20%',
        },
        {
          title: '操作',
          width: '10%',
          render: (text, record) => {
            let index = record._id

            if (record.createdby == localStorage.getItem('icsUser'))
              return (
                <Fragment>
                  <FaEdit
                    className={styles.icon}
                    style={{ marginTop: 6 }}
                    onClick={() => this.setState({ modalVisible: true, selectedPlugin: record, targetType, })}
                  />
                  <Divider type="vertical" />
                  <FaTrashO
                    className={styles.icon}
                    onClick={() => showConfirm(record, targetType)}
                  />
                </Fragment>)
            else
              return (
                <Fragment>
                  <FaEdit
                    style={{ fontSize: 28, color: 'grey', marginTop: 6 }}
                  />
                  <Divider type="vertical" />
                  <FaTrashO
                    style={{ fontSize: 28, color: 'grey' }}
                  />
                </Fragment>)


          },
        },
      ])
    };
    return (
      <PageHeaderWrapper content={
        <div>
          <p>目标分为CIDR格式及IPV4格式两种类型，前者每一行形如“192.168.0.0/24”，用于端口任务，后者每一行形如“192.168.0.1”，用于插件任务。</p>
          <p>上传目标后可对目标的一些信息进行修改。</p>
        </div>
      }>
        <Tabs size='large'>
          <TabPane tab={<h3 style={{ fontWeight: 600 }}>CIDR格式</h3>} key='cidr'>
            <div className={styles.standardList}>
              <Dragger {...getProps('http://localhost:1978/target/add')}>
                <p className="ant-upload-drag-icon">
                  <Icon type="upload" />上传本地CIDR格式IP文件（可将文件直接拖拽入框）
              </p>
              </Dragger>

              <Card
                className={styles.listCard}
                bordered={false}
                title="CIDR格式目标列表"
                style={{ marginTop: 10 }}
                bodyStyle={{ padding: '0 32px 40px 32px' }}
                extra={extraContent}
              >
                <Table
                  loading={loading}
                  dataSource={targetList}
                  columns={getColumns('CIDR')}
                />
              </Card>
            </div>
          </TabPane>
          <TabPane tab={<h3 style={{ fontWeight: 600 }}>IPV4格式</h3>} key='ipv4'>
            <div className={styles.standardList}>
              <Dragger {...getProps('http://localhost:1978/targetI/add')}>
                <p className="ant-upload-drag-icon">
                  <Icon type="upload" />上传本地IPV4格式IP文件（可将文件直接拖拽入框）
              </p>
              </Dragger>
              <Card
                className={styles.listCard}
                bordered={false}
                title="IPV4格式目标列表"
                style={{ marginTop: 10 }}
                bodyStyle={{ padding: '0 32px 40px 32px' }}
                extra={extraContent}
              >
                <Table
                  loading={loading}
                  dataSource={targetListI}
                  columns={getColumns('IPV4')}
                />
              </Card>
            </div>
          </TabPane>

        </Tabs>


        <Modal
          title={`编辑${this.state.targetType}目标信息-->${this.state.selectedPlugin.name}`}
          visible={this.state.modalVisible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          maskClosable={false}>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="目标名"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入目标名',
                }],
                initialValue: this.state.selectedPlugin.name,
              })(
                <Input placeholder="必填项，目标的名称" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="目标描述"
            >
              {getFieldDecorator('description', { initialValue: this.state.selectedPlugin.description, })(
                <TextArea style={{ minHeight: 16 }} placeholder="可不填，目标的简单描述。" rows={4} />
              )}
            </FormItem>




          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
