/**
 * 跟进信息编辑弹窗完整示例
 * 展示如何集成实时话术助手
 */

import React, { useState } from 'react';
import { Modal, Card, Space, Button, Tag, Input, Typography } from 'antd';
import { RealtimeTipsPanel } from './RealtimeTipsPanel';
import type { CustomerTags, CustomerProfile } from '../../types/customer';

const { TextArea } = Input;
const { Text } = Typography;

interface FollowUpEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (tags: CustomerTags, content: string) => void;
  customerProfile?: Partial<CustomerProfile>;
}

export const FollowUpEditModal: React.FC<FollowUpEditModalProps> = ({
  visible,
  onCancel,
  onSave,
  customerProfile,
}) => {
  const [selectedTags, setSelectedTags] = useState<CustomerTags>({
    userLevel: undefined,
    intention: [],
    property: [],
    vehicle: [],
    credit: [],
    occupation: [],
    wechat: undefined,
    other: [],
  });

  const [followUpContent, setFollowUpContent] = useState('');

  // 用户等级选项
  const userLevels = ['S级', 'A级', 'B级', 'C级', 'D级', 'E级', '等级未确定'] as const;

  // 意愿标签选项
  const intentionTags = [
    '有意向',
    '无意向-开场日秒挂',
    '无意向-未申请',
    '无意向-不需要',
    '无意向-其他',
    '未接通-停机',
    '未接通',
    '无意向-不接受线下',
  ];

  // 房产标签
  const propertyTags = [
    '全款房',
    '按揭房',
    '抵押房',
    '政策房',
    '商业房',
    '异地房',
    '自建房',
    '无房',
    '房产未确认',
  ];

  // 车产标签
  const vehicleTags = [
    '全款车',
    '按揭车',
    '抵押车',
    '背户车',
    '异地车',
    '无车',
    '车产未确认',
  ];

  // 征信标签
  const creditTags = [
    '无逾期',
    '当前逾期',
    '逾期少',
    '逾期多',
    '黑户&呆账',
    '查询多',
    '征信未确认',
  ];

  // 职业标签
  const occupationTags = [
    '企业主',
    '个体户',
    '其他',
    '上班族-有公积金或有个税',
    '上班族-无公积金无个税',
    '无业',
    '职业未确认',
  ];

  // 加微标签
  const wechatTags = ['已加微', '未加微'] as const;

  // 其他标签
  const otherTags = [
    '无',
    '独自借款',
    '有诉讼',
    '贷款不符',
    '异地客户',
    '重点客户',
    'MGM/亲属办理',
    '不接受线下',
  ];

  const toggleTag = (category: keyof CustomerTags, tag: string) => {
    if (category === 'userLevel') {
      setSelectedTags({
        ...selectedTags,
        userLevel: selectedTags.userLevel === tag ? undefined : tag as any,
      });
    } else if (category === 'wechat') {
      setSelectedTags({
        ...selectedTags,
        wechat: selectedTags.wechat === tag ? undefined : tag as any,
      });
    } else {
      const current = selectedTags[category] as string[] || [];
      const isSelected = current.includes(tag);
      setSelectedTags({
        ...selectedTags,
        [category]: isSelected
          ? current.filter(t => t !== tag)
          : [...current, tag],
      });
    }
  };

  const isTagSelected = (category: keyof CustomerTags, tag: string) => {
    if (category === 'userLevel' || category === 'wechat') {
      return selectedTags[category] === tag;
    }
    return (selectedTags[category] as string[] || []).includes(tag);
  };

  const handleSave = () => {
    onSave(selectedTags, followUpContent);
  };

  const renderTagGroup = (
    title: string,
    category: keyof CustomerTags,
    tags: readonly string[]
  ) => {
    return (
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
          {title}
        </Text>
        <Space size={[8, 8]} wrap>
          {tags.map(tag => (
            <Tag
              key={tag}
              color={isTagSelected(category, tag) ? 'blue' : 'default'}
              style={{
                cursor: 'pointer',
                border: isTagSelected(category, tag) ? '1px solid #1890ff' : '1px solid #d9d9d9',
                fontWeight: isTagSelected(category, tag) ? 'bold' : 'normal',
              }}
              onClick={() => toggleTag(category, tag)}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  return (
    <Modal
      title="编辑跟进信息"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          确认保存
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 实时话术助手 */}
        <RealtimeTipsPanel
          selectedTags={selectedTags}
          customerProfile={customerProfile}
          visible={true}
        />

        {/* 标签选择区 */}
        <Card
          title={
            <Space>
              <Text strong>线索打标</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                已选 {
                  Object.values(selectedTags).flat().filter(Boolean).length
                }/59
              </Text>
            </Space>
          }
          extra={
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedTags({
                  userLevel: undefined,
                  intention: [],
                  property: [],
                  vehicle: [],
                  credit: [],
                  occupation: [],
                  wechat: undefined,
                  other: [],
                });
              }}
            >
              清空
            </Button>
          }
          size="small"
        >
          {renderTagGroup('用户等级', 'userLevel', userLevels)}
          {renderTagGroup('意愿标签', 'intention', intentionTags)}
          {renderTagGroup('房产标签', 'property', propertyTags)}
          {renderTagGroup('车产标签', 'vehicle', vehicleTags)}
          {renderTagGroup('征信标签', 'credit', creditTags)}
          {renderTagGroup('职业标签', 'occupation', occupationTags)}
          {renderTagGroup('加微标签', 'wechat', wechatTags)}
          {renderTagGroup('其他标签', 'other', otherTags)}
        </Card>

        {/* 跟进记录 */}
        <Card title="* 跟进记录" size="small">
          <TextArea
            value={followUpContent}
            onChange={(e) => setFollowUpContent(e.target.value)}
            placeholder="请输入详细跟进情况"
            rows={4}
            maxLength={500}
            showCount
          />
        </Card>
      </Space>
    </Modal>
  );
};
