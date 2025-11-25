/**
 * 应用主入口 - 展示两个页面的使用示例
 */

import React, { useState } from 'react';
import { ConfigProvider, Tabs, Button } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { CustomerDetailPage } from './components/DetailPage/CustomerDetailPage';
import { FollowUpEditModal } from './components/FollowUpEdit/FollowUpEditModal';
import type { CustomerProfile, CustomerTags } from './types/customer';

// 模拟客户数据（基于截图中的黄光塔客户信息）
const mockCustomer: CustomerProfile = {
  id: 'C6636159627957370881',
  name: '黄光塔',
  userId: 'UR240800251scno',
  lastFollowUpTime: '2025-10-15 16:24:04',

  tags: {
    userLevel: 'E级',
    intention: ['无意向-其他'],
    property: ['无房'],
    vehicle: ['无车'],
    credit: ['无逾期'],
    occupation: ['上班族-无公积金无个税'],
    wechat: '已加微',
    other: ['贷款不符'],
  },

  profile: {
    leadValue: 5,
    userLevel: 'E',

    property: {
      hasHouse: false,
      houseType: '无房',
      hasCar: false,
      carType: '无车',
    },

    debt: {
      hasLoan: false,
    },

    credit: {
      status: '逾期少',
      details: '两三个月逾期，几千前',
    },

    occupation: {
      type: '上班族-无公积金无个税',
      income: '现金收入',
    },
  },

  communication: {
    intention: '无意向-其他',
    addedWechat: true,
    isIndependent: true,
    hasComplaint: false,
    isQualified: false,
  },

  loanRequirement: {
    amount: '20-30万',
    urgency: 'medium',
  },

  customerInsights: {
    concerns: [
      '担心对方是骗子',
      '听不清重复报告被拒',
      '担心贷款App额度真实性',
      '需要人签和征信报告查询感到真实性',
      '担心征信查询过多影响贷款',
      '贷款App申请真实性担忧',
      '担心征信查询过多影响贷款',
    ],
    realNeeds: [
      '真实性质疑',
      '需要人签知道报告查过多',
      '贷款App额度真实性质疑',
      '担心征信查询过多不愿贷款',
    ],
    trustLevel: 'low',
  },
};

function App() {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const handleSaveFollowUp = (tags: CustomerTags, content: string) => {
    console.log('保存跟进信息:', { tags, content });
    setShowFollowUpModal(false);
    // 这里可以调用API保存数据
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: '20px', background: '#fff' }}>
        <Tabs
          defaultActiveKey="detail"
          items={[
            {
              key: 'detail',
              label: '📋 客户详情页（带智能助手）',
              children: <CustomerDetailPage customer={mockCustomer} />,
            },
            {
              key: 'edit',
              label: '✏️ 跟进编辑弹窗（实时话术）',
              children: (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h3>点击下方按钮打开跟进编辑弹窗</h3>
                  <p style={{ color: '#666', marginBottom: 20 }}>
                    跟进编辑弹窗会根据你选择的标签实时推荐话术和策略
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setShowFollowUpModal(true)}
                  >
                    打开跟进编辑弹窗
                  </Button>

                  <div style={{ marginTop: 40, textAlign: 'left', maxWidth: 800, margin: '40px auto' }}>
                    <h4>功能说明：</h4>
                    <ul>
                      <li>选择不同标签组合，实时话术助手会动态调整推荐内容</li>
                      <li>标签包括：用户等级、意愿、房产、车产、征信、职业等</li>
                      <li>系统会根据标签组合给出针对性的沟通建议和话术</li>
                      <li>支持一键复制话术，提高销售效率</li>
                      <li>对于高风险标签（如征信逾期）会给出特殊提示</li>
                    </ul>
                  </div>
                </div>
              ),
            },
          ]}
        />

        <FollowUpEditModal
          visible={showFollowUpModal}
          onCancel={() => setShowFollowUpModal(false)}
          onSave={handleSaveFollowUp}
          customerProfile={mockCustomer}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
