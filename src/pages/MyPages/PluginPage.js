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

@connect(({ plugin, loading }) => ({
  pluginList: plugin.pluginList,
  loading: loading.effects['plugin/get']
}))
@Form.create()
class BasicList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'plugin/get',
      payload: {},
    });
  }
  state = {
    mouseOverEditBtnIndex: -1,
    mouseOverDelBtnIndex: -1,
    modalVisible: false,
    selectedPlugin: {},
  }

  render() {
    const {
      pluginList,
      loading,
      dispatch,
    } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
    const props = {
      name: 'file',
      multiple: true,
      action: 'http://localhost:1978/plugin/add',
      headers: { 'token': localStorage.getItem('token') },
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          dispatch({
            type: 'plugin/get',
            payload: {
              count: 6,
            },
          });
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
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
    function getAvatar(text) {
      let hash = crypto.createHash('md5')
      hash.update(text);
      let imgData = new Identicon(hash.digest('hex')).toString()
      let imgUrl = 'data:image/png;base64,' + imgData
      return (
        <span><Avatar src={imgUrl} shape="square" size="small" style={{ marginRight: '10px' }} />{text}</span>
      )
    }
    const columns = [
      {
        title: '插件名',
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
        width: '30%',
        render: (text, record) => {
          if (text == '')
            return '该插件尚未添加任何描述信息'
          else
            return text
        },
      },
      {
        title: '默认端口',
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
        title: '使用协议',
        dataIndex: 'protocal',
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
        dataIndex: 'user',
        width: '20%',
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
                  className={styles.icon}
                  style={{marginTop:6}}
                  onClick={() => this.setState({ modalVisible: true, selectedPlugin: record })}
                />
                <Divider type="vertical" />
                <FaTrashO
                  className={styles.icon}
                  onClick={() => showConfirm(record.name)}
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
    ];
    return (
      <PageHeaderWrapper content='目前插件只支持Python编写。按上传按钮将本地插件上传至服务器，供平台使用，上传后必须完善端口号、协议等信息。'>
        <div className={styles.standardList}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="upload" />上传本地插件（可将文件直接拖拽入框）
              </p>
          </Dragger>

          <Card
            className={styles.listCard}
            bordered={false}
            title={`插件总数：${pluginList.length}个`}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Table
              loading={loading}
              dataSource={pluginList}
              columns={columns}
            />
          </Card>
        </div>
        <Modal
          title={`编辑插件信息-->${this.state.selectedPlugin.name}`}
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
              label="插件描述"
            >
              {getFieldDecorator('description', { initialValue: this.state.selectedPlugin.description, })(
                <TextArea style={{ minHeight: 16 }} placeholder="可不填，插件的简单描述。" rows={4} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="使用协议"
            >
              <div>
                {getFieldDecorator('protocal', {
                  initialValue: this.state.selectedPlugin.protocal,
                  rules: [{
                    required: true, message: '请选择协议',
                  }],
                })(
                  <Radio.Group>
                    <RadioButton value='TCP'>TCP</RadioButton>
                    <RadioButton value='UDP'>UDP</RadioButton>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="使用端口"
            >
              {getFieldDecorator('port', {
                rules: [{
                  required: true, message: '请输入端口号',
                  pattern:'^([1-9][0-9]*)$'
                }],
                initialValue: this.state.selectedPlugin.port,
              })(
                <Input placeholder="必填项，插件使用的端品号" />
              )}
            </FormItem>

          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
