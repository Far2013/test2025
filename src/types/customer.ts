/**
 * 客户数据类型定义
 */

export interface CustomerProfile {
  id: string;
  name: string;
  userId: string;
  lastFollowUpTime: string;

  // 客户标签
  tags: CustomerTags;

  // 客户画像
  profile: {
    leadValue: number; // 线索价值 1-10
    userLevel: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | '未确定';

    // 资产情况
    property: {
      hasHouse: boolean;
      houseType?: '全款房' | '按揭房' | '抵押房' | '政策房' | '商业房' | '异地房' | '自建房' | '无房';
      hasCar: boolean;
      carType?: '全款车' | '按揭车' | '抵押车' | '背户车' | '异地车' | '无车';
    };

    // 负债情况
    debt: {
      hasLoan: boolean;
      loanTypes?: string[];
    };

    // 征信情况
    credit: {
      status: '无逾期' | '当前逾期' | '逾期少' | '逾期多' | '黑户&呆账' | '查询多' | '征信未确认';
      details?: string;
    };

    // 职业情况
    occupation: {
      type: '企业主' | '个体户' | '其他' | '上班族-有公积金或有个税' | '上班族-无公积金无个税' | '无业' | '职业未确认';
      income?: string;
    };
  };

  // 沟通情况
  communication: {
    intention: '有意向' | '无意向-开场日秒挂' | '无意向-未申请' | '无意向-不需要' | '无意向-其他' | '未接通-停机' | '未接通' | '无意向-不接受线下';
    addedWechat: boolean;
    isIndependent: boolean; // 是否独自借款
    hasComplaint: boolean; // 是否有诉讼
    isQualified: boolean; // 是否贷款不符
  };

  // 贷款需求
  loanRequirement: {
    amount?: string;
    purpose?: string;
    urgency?: 'low' | 'medium' | 'high';
  };

  // 客户敏感点和真实性
  customerInsights?: {
    concerns: string[]; // 顾虑点
    realNeeds: string[]; // 真实需求
    trustLevel: 'low' | 'medium' | 'high'; // 信任程度
  };
}

export interface CustomerTags {
  userLevel?: 'S级' | 'A级' | 'B级' | 'C级' | 'D级' | 'E级' | '等级未确定';
  intention?: string[];
  property?: string[];
  vehicle?: string[];
  credit?: string[];
  occupation?: string[];
  wechat?: '已加微' | '未加微';
  other?: string[];
}

export interface FollowUpRecord {
  time: string;
  tags: CustomerTags;
  content: string;
  operator: string;
}

export interface SalesStrategy {
  priority: 'high' | 'medium' | 'low';
  strategies: string[];
  keyPoints: string[];
  risks: string[];
}

export interface ScriptRecommendation {
  scenario: string; // 场景：开场白、异议处理、促成等
  scripts: {
    content: string;
    tags?: string[]; // 适用标签
    tone?: 'professional' | 'friendly' | 'consultative'; // 语气
  }[];
  tips?: string[]; // 注意事项
}

export interface RecommendationResult {
  customerAnalysis: {
    riskLevel: 'low' | 'medium' | 'high' | 'very-high';
    conversionProbability: number; // 0-100
    keyPainPoints: string[];
    strengths: string[];
    weaknesses: string[];
  };

  strategy: SalesStrategy;

  scripts: {
    opening: ScriptRecommendation; // 开场白
    objectionHandling: ScriptRecommendation; // 异议处理
    valueProposition: ScriptRecommendation; // 价值主张
    closing: ScriptRecommendation; // 促成话术
  };

  productRecommendations?: {
    name: string;
    reason: string;
    matchScore: number; // 0-100
  }[];
}
