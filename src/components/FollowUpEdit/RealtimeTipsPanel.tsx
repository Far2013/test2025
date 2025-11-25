/**
 * 实时话术助手 - 标签编辑页顶部面板
 * 根据用户选择的标签实时推荐话术和策略
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Typography, Button, Alert } from 'antd';
import {
  BulbOutlined,
  CopyOutlined,
  WarningOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { CustomerTags, CustomerProfile } from '../../types/customer';
import { SalesRecommendationEngine } from '../../services/recommendationEngine';

const { Text, Paragraph } = Typography;

interface RealtimeTipsPanelProps {
  selectedTags: CustomerTags;
  customerProfile?: Partial<CustomerProfile>;
  visible?: boolean;
}

export const RealtimeTipsPanel: React.FC<RealtimeTipsPanelProps> = ({
  selectedTags,
  customerProfile,
  visible = true,
}) => {
  const [recommendation, setRecommendation] = useState<{
    tips: string[];
    script: string;
    warnings?: string[];
  } | null>(null);

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const result = SalesRecommendationEngine.generateRealtimeRecommendation(
      selectedTags,
      customerProfile
    );
    setRecommendation(result);
  }, [selectedTags, customerProfile]);

  if (!visible || !recommendation) {
    return null;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 可以添加成功提示
  };

  // 生成已选标签列表
  const renderSelectedTags = () => {
    const tags: JSX.Element[] = [];

    if (selectedTags.userLevel) {
      tags.push(
        <Tag key="level" color="purple">{selectedTags.userLevel}</Tag>
      );
    }

    selectedTags.intention?.forEach((tag, idx) => {
      tags.push(
        <Tag key={`intention-${idx}`} color={tag.includes('有意向') ? 'green' : 'orange'}>
          {tag}
        </Tag>
      );
    });

    selectedTags.property?.forEach((tag, idx) => {
      tags.push(
        <Tag key={`property-${idx}`} color="blue">{tag}</Tag>
      );
    });

    selectedTags.vehicle?.forEach((tag, idx) => {
      tags.push(
        <Tag key={`vehicle-${idx}`} color="cyan">{tag}</Tag>
      );
    });

    selectedTags.credit?.forEach((tag, idx) => {
      tags.push(
        <Tag key={`credit-${idx}`} color={tag.includes('逾期') ? 'red' : 'geekblue'}>
          {tag}
        </Tag>
      );
    });

    selectedTags.occupation?.forEach((tag, idx) => {
      tags.push(
        <Tag key={`occupation-${idx}`} color="lime">{tag}</Tag>
      );
    });

    if (selectedTags.wechat) {
      tags.push(
        <Tag key="wechat" color={selectedTags.wechat === '已加微' ? 'success' : 'default'}>
          {selectedTags.wechat}
        </Tag>
      );
    }

    return tags;
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 8,
        border: 'none',
      }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 标题栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <ThunderboltOutlined style={{ color: 'white', fontSize: 18 }} />
            <Text strong style={{ color: 'white', fontSize: 15 }}>
              💬 实时话术助手
            </Text>
          </Space>
          <Button
            type="text"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ color: 'white' }}
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        </div>

        {isExpanded && (
          <>
            {/* 已选标签 */}
            {renderSelectedTags().length > 0 && (
              <Card
                size="small"
                bodyStyle={{ padding: '8px 12px' }}
                style={{ background: 'rgba(255, 255, 255, 0.95)' }}
              >
                <Space size={[4, 4]} wrap>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    已选标签：
                  </Text>
                  {renderSelectedTags()}
                </Space>
              </Card>
            )}

            {/* 警告信息 */}
            {recommendation.warnings && recommendation.warnings.length > 0 && (
              <Alert
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                message={
                  <Space direction="vertical" size={4}>
                    {recommendation.warnings.map((warning, idx) => (
                      <Text key={idx} style={{ fontSize: 12 }}>
                        {warning}
                      </Text>
                    ))}
                  </Space>
                }
                style={{ padding: '8px 12px' }}
              />
            )}

            {/* 策略建议 */}
            <Card
              size="small"
              title={
                <Space>
                  <BulbOutlined style={{ color: '#faad14' }} />
                  <Text strong style={{ fontSize: 13 }}>当前建议</Text>
                </Space>
              }
              bodyStyle={{ padding: '12px' }}
              style={{ background: 'rgba(255, 255, 255, 0.95)' }}
            >
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {recommendation.tips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{tip}</Text>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 推荐话术 */}
            <Card
              size="small"
              title={
                <Space>
                  <MessageOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: 13 }}>推荐话术</Text>
                </Space>
              }
              bodyStyle={{ padding: '12px' }}
              style={{ background: 'rgba(255, 255, 255, 0.95)' }}
              extra={
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(recommendation.script)}
                  style={{ padding: 0 }}
                >
                  复制
                </Button>
              }
            >
              <Paragraph
                style={{
                  background: '#f0f5ff',
                  padding: 12,
                  borderRadius: 4,
                  marginBottom: 0,
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {recommendation.script}
              </Paragraph>
            </Card>

            {/* 快捷话术按钮 */}
            <Space size={[8, 8]} wrap>
              <Button
                size="small"
                onClick={() => copyToClipboard('方便了解下您主要顾虑是什么吗？')}
              >
                询问顾虑
              </Button>
              <Button
                size="small"
                onClick={() => copyToClipboard('您这边大概需要多少资金？什么时候用？')}
              >
                询问需求
              </Button>
              <Button
                size="small"
                onClick={() => copyToClipboard('加个微信吧，我把详细资料发给您')}
              >
                添加微信
              </Button>
              <Button
                size="small"
                onClick={() => copyToClipboard('我这边给您申请最优惠的方案，您看可以吗？')}
              >
                促成话术
              </Button>
            </Space>
          </>
        )}
      </Space>
    </Card>
  );
};

// 导入缺失的图标
import { MessageOutlined } from '@ant-design/icons';
