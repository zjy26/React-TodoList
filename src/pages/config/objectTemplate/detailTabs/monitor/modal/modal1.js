import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Select, message } from 'antd'
import { properties } from '../../../../../../api'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'
import debounce from 'lodash/debounce'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  }
}

const Modal1 = props => {
  const { modalProperty, visible, handleCancel, setDirty, MyContext } = props
  const { templateCode, propertiesOption, uomsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        configObjectTemplate.propertyTemplateDetail(modalProperty.id)
          .then(res => {
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
            })
            form.resetFields()
          })
      } else {
        configObjectTemplate.propertyTemplateNew()
          .then(res => {
            setInitValues({
              ...res,
              code: res.code ? res.code : undefined,
              uom: res.uom ? res.uom : undefined,
            })
            form.resetFields()
          })
      }
    }
  }, [form, modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (modalProperty.type === "add") {
          configObjectTemplate.propertyTemplateAdd({
            ...values,
            template: templateCode,
            source: modalProperty.activeKey,
            _method: 'PUT'
          })
            .then((res) => {
              if (res.success) {
                handleCancel()
                setDirty(dirty => dirty + 1)
                message.success("新建成功")
              } else {
                message.error(res.message)
              }
            })
        } else {
          configObjectTemplate.propertyTemplateUpdate(modalProperty.id,
            {
              ...values,
              template: templateCode,
              source: modalProperty.activeKey,
              _method: 'PUT'
            }
          )
            .then(() => {
              message.success("编辑成功")
              handleCancel()
              setDirty(dirty => dirty + 1)
            })
        }
      })
  }

  //属性搜索时请求
  const propertySearch = (key) => {
    properties({
      limit: 30,
      filter: JSON.stringify([{ property: 'desc', value: key }])
    })
      .then(res => {
        setPropertyData(res.models)
      })
  }
  const handleSearch = debounce(propertySearch, 500)

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      width={800}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form name="templateMonitorForm1" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            {
              modalProperty.type === "add" ?
                <Form.Item label="属性代码" name="code" rules={[{ required: true, message: '请选择属性代码' }]}>
                  <Select
                    showSearch
                    filterOption={false}
                    onSearch={handleSearch}
                    placeholder="请输入属性代码"
                    onChange={
                      (val, opt) => form.setFieldsValue({
                        descr: opt.name
                      })
                    }
                  >
                    {
                      propertyData.map(item => (
                        <Select.Option key={item.code} value={item.code} name={item.desc}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                :
                <Form.Item label="属性代码" name="code">
                  <Input disabled />
                </Form.Item>
            }
          </Col>
          <Col span={12}>
            <Form.Item label="属性名称" name="descr">
              <Input placeholder="请输入属性名称" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remarks">
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="阈值上限" name="maxValue">
              <InputNumber placeholder="请输入阈值上限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="阈值下限" name="minValue">
              <InputNumber placeholder="请输入阈值下限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="增量阈值上限" name="incMaxValue">
              <InputNumber placeholder="请输入增值阈值上限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="增量阈值下限" name="incMinValue">
              <InputNumber placeholder="请输入增值阈值下限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="阈值中线" name="medianValue">
              <InputNumber placeholder="请输入阈值中线" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="计量单位" name="uom">
              <Select placeholder="请选择计量单位" allowClear>
                {
                  uomsOption.map(item => (
                    <Select.OptGroup key={item.id} label={item.text}>
                      {
                        item.children.map(child => (
                          <Select.Option key={child.model.code} value={child.model.code}>{child.model.name} ({child.model.symbol})</Select.Option>
                        ))
                      }
                    </Select.OptGroup>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="故障原因" name="reason">
              <Input.TextArea placeholder="请输入故障原因" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="处理方法" name="action">
              <Input.TextArea placeholder="请输入处理方法" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(Modal1)
