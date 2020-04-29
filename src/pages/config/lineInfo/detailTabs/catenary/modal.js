import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, Select, message } from 'antd'
import { configLocation } from '../../../../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  }
}

const CatenaryModal = props => {
  const {modalProperty, visible, setDirty, handleCancel, MyContext} = props
  const {entity, lineCode} = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(()=>{
    if(visible) {
      modalProperty.type==="add" ?
      configLocation.configCatenaryNew()
      .then((res)=>{
        setInitValues(res)
        form.resetFields()
      })
      :
      configLocation.configCatenaryDetail(modalProperty.id)
      .then(res=> {
        if(res) {
          setInitValues({
            ...res,
            brand: res.brand.id
          })
          form.resetFields()
        }
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
    .then(values => {
      switch (modalProperty.type) {
        case "add":
          configLocation.configCatenaryAdd({...values, line:lineCode})
          .then(()=>{
            handleCancel()
            setDirty((dirty)=>dirty+1)
          })
          break;
        case "edit":
          configLocation.configCatenaryUpdate(modalProperty.id, {...values, _method:'PUT'})
          .then(()=>{
            message.success("编辑成功")
            setDirty(dirty=>dirty+1)
            handleCancel()
          })
          break;
        default:
          handleCancel()
      }
    })
  }

  return (
    <Modal
      title= {modalProperty.title}
      okText="确认"
      cancelText="取消"
      onOk= {handleSubmit}
      visible={visible}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout} form={form} initialValues={initValues}>
        <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请输入设备分类'}]}>
          <Select placeholder="请输入设备分类">
            {
              entity.classOption.map(item  => (
              <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
          <Select placeholder="请选择品牌">
          {
            entity.brandOption.map(item  => (
            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
            ))
          }
          </Select>
        </Form.Item>
        <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
          <Input placeholder="请输入型号"/>
        </Form.Item>
        <Form.Item label="规格" name="spec">
          <Input placeholder="请输入规格"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CatenaryModal)