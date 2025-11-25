/**
 * 客户详情页完整示例
 * 展示如何集成销售助手组件
 */

import React from 'react';
import { Layout, Card, Tag, Descriptions, Timeline, Typography, Space, Divider } from 'antd';
import { SalesAssistant } from './SalesAssistant';
import type { CustomerProfile } from '../../types/customer';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface CustomerDetailPageProps {
  customer: CustomerProfile;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 左侧主内容区 */}
      <Content style={{ padding: '16px', flex: 1 }}>
        {/* 客户基本信息 */}
        <Card style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>
                {customer.name} {customer.userId}
              </Title>
              <Space>
                <Tag color="blue">手动回填/正常分配</Tag>
                {customer.communication.intention.includes('无意向') && (
                  <Tag color="red">AI无兴趣未接通</Tag>
                )}
                <Tag color="purple">{customer.profile.userLevel}</Tag>
              </Space>
            </div>
          </Space>
        </Card>

        {/* 跟进信息 */}
        <Card title="跟进信息" style={{ marginBottom: 16 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="最近跟进">
              {customer.lastFollowUpTime}
            </Descriptions.Item>
            <Descriptions.Item label="跟进标签">
              <Space size={[4, 4]} wrap>
                {customer.tags.userLevel && <Tag color="purple">{customer.tags.userLevel}</Tag>}
                {customer.tags.intention?.map((tag, idx) => (
                  <Tag key={idx} color="orange">{tag}</Tag>
                ))}
                {customer.tags.property?.map((tag, idx) => (
                  <Tag key={idx} color="blue">{tag}</Tag>
                ))}
                {customer.tags.vehicle?.map((tag, idx) => (
                  <Tag key={idx} color="cyan">{tag}</Tag>
                ))}
                {customer.tags.credit?.map((tag, idx) => (
                  <Tag key={idx} color="red">{tag}</Tag>
                ))}
                {customer.tags.occupation?.map((tag, idx) => (
                  <Tag key={idx} color="green">{tag}</Tag>
                ))}
                {customer.tags.wechat && <Tag color="lime">{customer.tags.wechat}</Tag>}
                {customer.tags.other?.map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* AI图像总结 */}
        <Card
          title={
            <Space>
              <Text>🤖 AI图像总结</Text>
              <Tag icon="👍">赞</Tag>
              <Tag icon="👎">踩</Tag>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="线索价值">{customer.profile.leadValue}</Descriptions.Item>
            <Descriptions.Item label="用户等级">{customer.profile.userLevel}</Descriptions.Item>

            <Descriptions.Item label="资产情况" span={2}>
              {customer.profile.property.houseType || '无房'}、
              {customer.profile.property.carType || '无车'}
            </Descriptions.Item>

            <Descriptions.Item label="负债情况" span={2}>
              {customer.profile.debt.hasLoan ? `有贷款: ${customer.profile.debt.loanTypes?.join('、')}` : '无贷款'}
            </Descriptions.Item>

            <Descriptions.Item label="征信情况" span={2}>
              {customer.profile.credit.status}
              {customer.profile.credit.details && ` - ${customer.profile.credit.details}`}
            </Descriptions.Item>

            <Descriptions.Item label="沟通情况" span={2}>
              意愿: {customer.communication.intention}
              {customer.communication.addedWechat && ' | 已加微信'}
            </Descriptions.Item>

            <Descriptions.Item label="贷款要求" span={2}>
              {customer.loanRequirement.amount && `金额: ${customer.loanRequirement.amount}`}
              {customer.loanRequirement.purpose && ` | 用途: ${customer.loanRequirement.purpose}`}
            </Descriptions.Item>

            {customer.customerInsights && (
              <>
                <Descriptions.Item label="客户敏感点" span={2}>
                  {customer.customerInsights.concerns.join('；')}
                </Descriptions.Item>
                <Descriptions.Item label="真实性判断" span={2}>
                  {customer.customerInsights.realNeeds.join('；')}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>

        {/* 沟通记录时间线（示例） */}
        <Card title="沟通记录" style={{ marginBottom: 16 }}>
          <Timeline
            items={[
              {
                children: (
                  <div>
                    <Text type="secondary">2025-10-15 16:24:04</Text>
                    <Divider type="vertical" />
                    <Text>客户表示现金收入，无资产证明，三无客户</Text>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <Text type="secondary">2025-10-14</Text>
                    <Divider type="vertical" />
                    <Text>多次沟通贷款需求，客户犹豫中</Text>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Content>

      {/* 右侧智能助手 */}
      <Sider
        width={380}
        style={{
          background: 'transparent',
          position: 'sticky',
          top: 0,
          right: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <SalesAssistant customer={customer} />
      </Sider>
    </Layout>
  );
};
