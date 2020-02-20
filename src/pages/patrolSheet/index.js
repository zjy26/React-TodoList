import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, Table, Tag, Menu, Dropdown, Icon } from 'antd';
import CancelModal from './cancelModal';
import AbnormalModal from './abnormalModal';

const { Option } = Select;
const brands = [];
for (let i = 10; i < 36; i++) {
  brands.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const { CheckableTag } = Tag;
const PatrolSheet = props => {
  const { getFieldDecorator } = props.form;
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //列表数据
  const [tagChecked, setTagChecked] = useState({  //筛选标签选择状态
    all: true,
    wait: true,
    patrol: true,
    finish: true,
    cancel: true,
    close: true
  });
  const [visible, setVisible] = useState({  //弹窗
    showCancel: false,
    showAbnormal: false
  });
  const [loading, setLoading] = useState(true);

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showCancel: false,
      showAbnormal: false
    });
  }

  //更多功能按钮
  const menu = (
    <Menu>
      <Menu.Item key="import">信息导入</Menu.Item>
      <Menu.Item key="download">下载</Menu.Item>
      <Menu.Item key="audit">审计</Menu.Item>
    </Menu>
  );

  //列表条目
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    render: (text, record) => {
      return (
       <a><Link to="/patrolSheetDetail">{text}</Link></a>
      )
    }
  },
  {
    title: '线路',
    dataIndex: 'line',
  },
  {
    title: '站点',
    dataIndex: 'site',
  },
  {
    title: '负责人',
    dataIndex: 'patrolPeople',
  },
  {
    title: '巡检时间',
    dataIndex: 'patrolTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '巡检结果',
    dataIndex: 'result',
    render: (text, record) => {
      return (
       text==="异常" ? <a onClick={ ()=>{setVisible({...visible, showAbnormal:true})} }>{text}</a> : <span>{text}</span>
      )
    }
  },
  {
    title: '人工确定',
    dataIndex: 'handleConfirm',
  },
  {
    title: '取消原因',
    dataIndex: 'CancelReason',
  },
  {
    title: '操作',
    dataIndex: 'option',
    render: () => {
      return (
        <span>
          <a onClick={ ()=>{setVisible({...visible, showCancel:true})} }>取消巡检</a>&nbsp;&nbsp;
          <a>编辑巡检</a>
        </span>
      )
    }
  }
];

  //获取线路站点
  useEffect(() => {
    Axios.get('/api/lineSite').then(res =>{
      if(res.status === 200){
        setLineSite(res.data);
      }
    }).catch((err) =>{
        console.log("线路站点数据加载失败")
    });
  }, []);

  //获取列表数据
  useEffect(() => {
    Axios.get('/api/patrolSheetList').then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  return (
    <div>
      <Form layout="inline" style={{margin: 30}}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('name')(
                <Input placeholder="请输入巡检单名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('patrolPeople')(
                <Input placeholder="请输入负责人姓名" />
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('patrolResult')(
                <Select placeholder="请选择巡检结果" style={{width:160}} >
                  <Option value="1">异常</Option>
                  <Option value="2">正常</Option>
                  <Option value="3">无结果</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('lineSite')(
                <Cascader options={lineSite} placeholder="请选择线路/站点" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('rangeData')(
                <DatePicker.RangePicker />
              )}
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Row>
      </Form>

      <div>
        <Row>
          <Col span={2} style={{textAlign: "center"}}><label>标签:</label></Col>
          <Col span={17}>
            <CheckableTag checked={tagChecked.all} onChange={(checked)=>{setTagChecked({all: checked, wait: checked, patrol: checked, finish: checked, cancel: checked, close: checked})}}>全部</CheckableTag>
            <CheckableTag checked={tagChecked.wait} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, wait: checked})}}>待巡检</CheckableTag>
            <CheckableTag checked={tagChecked.patrol} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, patrol: checked})}}>巡检中</CheckableTag>
            <CheckableTag checked={tagChecked.finish} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, finish: checked})}}>已完成</CheckableTag>
            <CheckableTag checked={tagChecked.cancel} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, cancel: checked})}}>已取消</CheckableTag>
            <CheckableTag checked={tagChecked.close} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, close: checked})}}>已关闭</CheckableTag>
          </Col>
          <Col span={2}>
            <Button type="danger"><Link to="/newPatrolSheet">新建</Link></Button>
            </Col>
            <Col span={3}>
            <Dropdown overlay={menu}>
              <Button type="danger">更多功能<Icon type="down" /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <Table columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>

      <CancelModal visible={visible.showCancel} {...{handleCancel}}/>
      <AbnormalModal visible={visible.showAbnormal} {...{handleCancel}}/>
    </div>
  )
}

export default Form.create()(PatrolSheet);