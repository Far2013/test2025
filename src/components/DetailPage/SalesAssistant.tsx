/**
 * 销售智能助手 - CRM详情页右侧面板
 * 展示客户分析、策略推荐和话术推荐
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Collapse, Progress, Space, Typography, Divider } from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  MessageOutlined,
  CopyOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { CustomerProfile, RecommendationResult } from '../../types/customer';
import { SalesRecommendationEngine } from '../../services/recommendationEngine';

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

interface SalesAssistantProps {
  customer: CustomerProfile;
}

export const SalesAssistant: React.FC<SalesAssistantProps> = ({ customer }) => {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['analysis', 'strategy', 'scripts']);

  useEffect(() => {
    const result = SalesRecommendationEngine.generateRecommendation(customer);
    setRecommendation(result);
  }, [customer]);

  if (!recommendation) {
    return <Card loading />;
  }

  const { customerAnalysis, strategy, scripts, productRecommendations } = recommendation;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'very-high': return 'error';
      default: return 'default';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return '低风险';
      case 'medium': return '中等风险';
      case 'high': return '高风险';
      case 'very-high': return '极高风险';
      default: return '未知';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以添加Toast提示
  };

  return (
    <div style={{
      width: '380px',
      height: '100vh',
      overflowY: 'auto',
      background: '#f5f5f5',
      padding: '16px',
    }}>
      {/* 标题 */}
      <Card
        size="small"
        style={{ marginBottom: 16, textAlign: 'center' }}
      >
        <Space>
          <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Text strong style={{ fontSize: 16 }}>AI智能销售助手</Text>
        </Space>
      </Card>

      <Collapse
        activeKey={expandedPanels}
        onChange={(keys) => setExpandedPanels(keys as string[])}
        bordered={false}
        style={{ background: 'transparent' }}
      >
        {/* 客户画像分析 */}
        <Panel
          header={
            <Space>
              <TrophyOutlined />
              <Text strong>客户画像分析</Text>
            </Space>
          }
          key="analysis"
        >
          <Card size="small" style={{ marginBottom: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">风险等级：</Text>
                <Tag color={getRiskColor(customerAnalysis.riskLevel)}>
                  {getRiskText(customerAnalysis.riskLevel)}
                </Tag>
              </div>

              <div>
                <Text type="secondary">成交概率：</Text>
                <Progress
                  percent={customerAnalysis.conversionProbability}
                  size="small"
                  strokeColor={
                    customerAnalysis.conversionProbability > 60 ? '#52c41a' :
                    customerAnalysis.conversionProbability > 30 ? '#faad14' : '#ff4d4f'
                  }
                />
              </div>

              {customerAnalysis.keyPainPoints.length > 0 && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text type="secondary">关键痛点：</Text>
                    <div style={{ marginTop: 4 }}>
                      {customerAnalysis.keyPainPoints.map((point, idx) => (
                        <Tag key={idx} color="red" style={{ marginBottom: 4 }}>
                          <WarningOutlined /> {point}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {customerAnalysis.strengths.length > 0 && (
                <div>
                  <Text type="secondary">客户优势：</Text>
                  <div style={{ marginTop: 4 }}>
                    {customerAnalysis.strengths.map((strength, idx) => (
                      <Tag key={idx} color="green" style={{ marginBottom: 4 }}>
                        <CheckCircleOutlined /> {strength}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {customerAnalysis.weaknesses.length > 0 && (
                <div>
                  <Text type="secondary">劣势因素：</Text>
                  <div style={{ marginTop: 4 }}>
                    {customerAnalysis.weaknesses.map((weakness, idx) => (
                      <Tag key={idx} color="orange" style={{ marginBottom: 4 }}>
                        {weakness}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Space>
          </Card>
        </Panel>

        {/* 销售策略推荐 */}
        <Panel
          header={
            <Space>
              <BulbOutlined />
              <Text strong>推荐策略</Text>
              <Tag color={
                strategy.priority === 'high' ? 'red' :
                strategy.priority === 'medium' ? 'orange' : 'default'
              }>
                {strategy.priority === 'high' ? '高优先级' :
                 strategy.priority === 'medium' ? '中优先级' : '低优先级'}
              </Tag>
            </Space>
          }
          key="strategy"
        >
          <Card size="small" style={{ marginBottom: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">核心策略：</Text>
                <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                  {strategy.strategies.map((s, idx) => (
                    <li key={idx}><Text>{s}</Text></li>
                  ))}
                </ul>
              </div>

              {strategy.keyPoints.length > 0 && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text type="secondary">关键要点：</Text>
                    <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                      {strategy.keyPoints.map((point, idx) => (
                        <li key={idx}><Text mark>{point}</Text></li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {strategy.risks.length > 0 && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text type="secondary">风险提示：</Text>
                    <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                      {strategy.risks.map((risk, idx) => (
                        <li key={idx}><Text type="danger">{risk}</Text></li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </Space>
          </Card>
        </Panel>

        {/* 话术推荐 */}
        <Panel
          header={
            <Space>
              <MessageOutlined />
              <Text strong>话术推荐</Text>
            </Space>
          }
          key="scripts"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* 开场白 */}
            <Card
              title="📞 开场白"
              size="small"
              extra={<Tag color="blue">必备</Tag>}
            >
              {scripts.opening.scripts.map((script, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <Paragraph
                    style={{
                      background: '#f0f2f5',
                      padding: 12,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  >
                    {script.content}
                  </Paragraph>
                  <Space>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(script.content)}
                    >
                      复制
                    </Button>
                    {script.tags?.map((tag, tidx) => (
                      <Tag key={tidx} color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              ))}
              {scripts.opening.tips && (
                <>
                  <Divider style={{ margin: '12px 0' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    💡 提示：{scripts.opening.tips.join('；')}
                  </Text>
                </>
              )}
            </Card>

            {/* 异议处理 */}
            <Card
              title="🛡️ 异议处理"
              size="small"
              extra={<Tag color="orange">重要</Tag>}
            >
              {scripts.objectionHandling.scripts.map((script, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <Paragraph
                    style={{
                      background: '#fff7e6',
                      padding: 12,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  >
                    {script.content}
                  </Paragraph>
                  <Space>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(script.content)}
                    >
                      复制
                    </Button>
                    {script.tags?.map((tag, tidx) => (
                      <Tag key={tidx} color="orange">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              ))}
            </Card>

            {/* 价值主张 */}
            <Card
              title="💎 价值主张"
              size="small"
            >
              {scripts.valueProposition.scripts.map((script, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <Paragraph
                    style={{
                      background: '#f6ffed',
                      padding: 12,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  >
                    {script.content}
                  </Paragraph>
                  <Space>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(script.content)}
                    >
                      复制
                    </Button>
                    {script.tags?.map((tag, tidx) => (
                      <Tag key={tidx} color="green">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              ))}
            </Card>

            {/* 促成话术 */}
            <Card
              title="🎯 促成话术"
              size="small"
              extra={<Tag color="red">关键</Tag>}
            >
              {scripts.closing.scripts.map((script, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <Paragraph
                    style={{
                      background: '#fff1f0',
                      padding: 12,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  >
                    {script.content}
                  </Paragraph>
                  <Space>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(script.content)}
                    >
                      复制
                    </Button>
                    {script.tags?.map((tag, tidx) => (
                      <Tag key={tidx} color="red">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              ))}
            </Card>
          </Space>
        </Panel>

        {/* 产品推荐 */}
        {productRecommendations && productRecommendations.length > 0 && (
          <Panel
            header={
              <Space>
                <TrophyOutlined />
                <Text strong>推荐产品</Text>
              </Space>
            }
            key="products"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {productRecommendations.map((product, idx) => (
                <Card
                  key={idx}
                  size="small"
                  style={{
                    background: idx === 0 ? '#e6f7ff' : 'white',
                    borderColor: idx === 0 ? '#1890ff' : '#d9d9d9',
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>{product.name}</Text>
                      {idx === 0 && <Tag color="gold" style={{ marginLeft: 8 }}>最匹配</Tag>}
                    </div>
                    <Progress
                      percent={product.matchScore}
                      size="small"
                      strokeColor="#52c41a"
                      format={(percent) => `匹配度 ${percent}%`}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {product.reason}
                    </Text>
                  </Space>
                </Card>
              ))}
            </Space>
          </Panel>
        )}
      </Collapse>
    </div>
  );
};
