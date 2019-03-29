import React, { PureComponent, Fragment } from 'react';
import crypto from 'crypto'
import Identicon from 'identicon.js'
import { connect } from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Steps,
    Radio,
    Avatar,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicList.less';
import Result from '@/components/Result'
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
@connect(({ target, plugin, loading }) => ({
    targetList: target.targetList,
    pluginList: plugin.pluginList,
    loadingTarget: loading.effects['targetget'],
    loadingPlugin: loading.effects['plugin/get']
}))
@Form.create()
export default class UpdateForm extends PureComponent {


    constructor(props) {
        super(props);

        this.state = {

            currentStep: 0,
            name: '',
            type: '',
            desc: '',
            selectedTargets: [],
            selectedPlugins: [],


        };

        this.formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch({
            type: 'target/get',
            payload: {},
        });
        dispatch({
            type: 'plugin/get',
            payload: {},
        });
    }
    handleNext = currentStep => {
        const { form, } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if (currentStep == 1 && this.state.selectedTargets.length == 0) {
                message.error('请至少选译一个目标！')
                return
            }
            if (currentStep == 2 && this.state.selectedPlugins.length == 0) {
                message.error('请至少选译一个插件！')
                return
            }
            this.setState({ ...fieldsValue });
            if (currentStep < 3) {
                this.forward();
            }

        })
    }
    onCancel = () => {
        const { hideModal } = this.props
        hideModal()
        this.setState({ currentStep: 0 })
    }

    backward = () => {
        const { currentStep } = this.state;
        this.setState({
            currentStep: currentStep - 1,
        });
    };

    forward = () => {
        const { currentStep } = this.state;
        this.setState({
            currentStep: currentStep + 1,
        });
    };

    renderContent = (currentStep) => {
        const { form, targetList, pluginList, loadingPlugin,loadingTarget } = this.props;
        const { type, selectedTargets, name, desc } = this.state;

        if (currentStep === 1) {
            if (type == 'plugin') {
                return [

                    <p>第二步</p>,
                    <p>插件任务</p>
                ]
            }
            let columns = [
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
                    // width: '10%',
                    render: (text, record) => {
                        if (text == '')
                            return '请完善'
                        else
                            return text
                    },
                },


            ];
            return [
                <StandardTable
                    selectedRows={selectedTargets}
                    loading={loadingTarget}
                    data={{ list: targetList, pagination: { pageSize: 6 } }}
                    columns={columns}
                    onSelectRow={(rows) => { this.setState({ selectedTargets: rows }) }}
                //   onChange={this.handleStandardTableChange}
                />,
            ]

        }
        if (currentStep === 2) {
            if (type == 'plugin')
                return [

                    <p>第三步</p>,
                    <p>插件任务</p>
                ]
            let columns = [
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
                    width: '40%',
                    render: (text, record) => {
                        if (text == '')
                            return '该插件尚未添加任何描述信息'
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
                    title: '默认端口',
                    dataIndex: 'port',
                    render: (text, record) => {
                        if (text == '')
                            return '请完善'
                        else
                            return text
                    },
                },



            ];
            return [
                <StandardTable
                    selectedRows={this.state.selectedPlugins}
                    loading={loadingPlugin}
                    data={{ list: pluginList, pagination: { pageSize: 6 } }}
                    columns={columns}
                    onSelectRow={(rows) => { this.setState({ selectedPlugins: rows }) }}
                //   onChange={this.handleStandardTableChange}
                />,
            ]
        }
        if (currentStep === 3) {
            return [
      <Result
        type="success"
        title="配置完成"
        description="请核对信息，确认无误请按“完成”提交。"
        // extra={information}
        // actions={actions}
        // className={styles.result}
      />,
            ];
        }
        return [
            <FormItem key="name" {...this.formLayout} label="任务名称">
                {form.getFieldDecorator('name', {
                    // rules: [{ required: true, message: '请输入任务名称！' }],
                    initialValue: name
                })(<Input placeholder="必填项" />)}
            </FormItem>,
            <FormItem key="type" {...this.formLayout} label="任务类型">
                {form.getFieldDecorator('type', {
                    // rules: [{ required: true, message: '请选择任务类型！' }],
                })(
                    <RadioGroup>
                        <Radio value="port">端口任务</Radio>
                        <Radio value="plugin">插件任务</Radio>
                        <Radio value="combine">联合任务</Radio>
                    </RadioGroup>
                )}
            </FormItem>,
            <FormItem key="desc" {...this.formLayout} label="任务描述">
                {form.getFieldDecorator('desc', {
                    rules: [{ required: false }],
                    initialValue: desc,
                })(<TextArea rows={4} placeholder="可不填，请输入任务的基本描述信息。" />)}
            </FormItem>,
            <div className={styles.desc}>
                <h3>说明：</h3>
                <p>任务名为任务非唯一标识，取名时请简要标记任务的特点。在任务描述中可对任务进行一些介绍，以在查阅时了解任务的目的和性质。</p>

            </div>,
        ];
    };

    renderFooter = currentStep => {
        const { visible, hideModal } = this.props;
        if (currentStep === 1 || currentStep === 2) {
            return [
                <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
                    上一步
        </Button>,
                <Button key="cancel" onClick={() => this.onCancel()}>
                    取消
        </Button>,
                <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                    下一步
        </Button>,
            ];
        }
        if (currentStep === 3) {
            return [
                <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
                    上一步
        </Button>,
                <Button key="cancel" onClick={() => this.onCancel()}>
                    取消
        </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
                    完成
        </Button>,
            ];
        }
        return [
            <Button key="cancel" onClick={() => this.onCancel()}>
                取消
      </Button>,
            <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                下一步
      </Button>,
        ];
    };

    render() {
        const { visible, hideModal, targetList } = this.props;
        const { currentStep } = this.state;

        return (
            <Modal
                width={'60%'}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="新建任务"
                visible={visible}
                footer={this.renderFooter(currentStep)}
                onCancel={() => this.onCancel()}
                maskClosable={false}
            >
                <Steps style={{ marginBottom: 80 }} current={currentStep}>
                    <Step title="输入基本信息" />
                    <Step title="选择目标" />
                    <Step title="选择插件/端口" />
                    <Step title="完成" />
                </Steps>
                {this.renderContent(currentStep)}
            </Modal>
        );
    }
}