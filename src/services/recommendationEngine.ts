/**
 * 销售策略和话术推荐引擎
 * 基于客户画像、标签和历史沟通记录生成智能推荐
 */

import type {
  CustomerProfile,
  CustomerTags,
  RecommendationResult,
  SalesStrategy,
  ScriptRecommendation,
} from '../types/customer';

export class SalesRecommendationEngine {
  /**
   * 生成完整的推荐结果
   */
  static generateRecommendation(customer: CustomerProfile): RecommendationResult {
    const analysis = this.analyzeCustomer(customer);
    const strategy = this.generateStrategy(customer, analysis);
    const scripts = this.generateScripts(customer, analysis);
    const products = this.recommendProducts(customer, analysis);

    return {
      customerAnalysis: analysis,
      strategy,
      scripts,
      productRecommendations: products,
    };
  }

  /**
   * 基于当前选择的标签生成实时推荐（用于标签编辑页）
   */
  static generateRealtimeRecommendation(
    selectedTags: CustomerTags,
    _customerProfile?: Partial<CustomerProfile>
  ): {
    tips: string[];
    script: string;
    warnings?: string[];
  } {
    const tips: string[] = [];
    const warnings: string[] = [];
    let script = '';

    // 意愿分析
    if (selectedTags.intention?.includes('无意向-其他') ||
        selectedTags.intention?.includes('无意向-不需要')) {
      tips.push('客户意愿较低，建议深挖拒绝原因');
      tips.push('可询问："方便了解下您主要顾虑是什么吗？"');
      script = '我理解您的顾虑。其实很多客户一开始也有类似的想法，但了解清楚之后发现我们的方案正好能解决他们的问题。方便花2分钟了解下吗？';
    } else if (selectedTags.intention?.includes('有意向')) {
      tips.push('客户有意向，抓紧推进');
      tips.push('询问具体需求和时间规划');
      script = '太好了！那我详细给您介绍一下我们的方案。请问您这边大概需要多少资金？什么时候用？';
    }

    // 资产分析
    if (selectedTags.property?.includes('无房') && selectedTags.vehicle?.includes('无车')) {
      tips.push('无资产情况，推荐信用贷产品');
      tips.push('重点询问收入情况和社保公积金');
      if (!script) {
        script = '了解，像您这种情况我们也有合适的方案。请问您目前有稳定收入吗？每月大概多少？有缴纳社保或公积金吗？';
      }
    } else if (selectedTags.property?.includes('全款房') || selectedTags.property?.includes('按揭房')) {
      tips.push('有房产，可推荐房产抵押贷');
      tips.push('询问房产价值和贷款额度需求');
    }

    // 征信分析
    if (selectedTags.credit?.includes('当前逾期') || selectedTags.credit?.includes('逾期多')) {
      tips.push('⚠️ 征信有逾期，需谨慎处理');
      tips.push('了解逾期原因和是否已结清');
      tips.push('可推荐容忍度较高的产品');
      warnings.push('征信问题可能影响审批，需提前说明');
      if (!script) {
        script = '关于征信逾期的问题，我需要了解一下具体情况。请问逾期金额大概多少？现在结清了吗？逾期的原因是什么？';
      }
    } else if (selectedTags.credit?.includes('查询多')) {
      tips.push('征信查询次数多，可能影响审批');
      tips.push('建议先养征信3-6个月');
    }

    // 职业分析
    if (selectedTags.occupation?.includes('上班族-无公积金无个税')) {
      tips.push('无公积金个税，可能影响额度');
      tips.push('询问是否有银行流水或社保');
    } else if (selectedTags.occupation?.includes('企业主') ||
               selectedTags.occupation?.includes('个体户')) {
      tips.push('企业主/个体户，可推荐经营贷');
      tips.push('询问营业执照和经营流水');
    }

    // 用户等级分析
    if (selectedTags.userLevel === 'E级' || selectedTags.userLevel === 'D级') {
      warnings.push('客户等级较低，投入成本需权衡');
      tips.push('建议快速判断是否值得跟进');
    } else if (selectedTags.userLevel === 'S级' || selectedTags.userLevel === 'A级') {
      tips.push('⭐ 优质客户，重点跟进');
      tips.push('提供VIP级别服务');
    }

    // 微信状态
    if (selectedTags.wechat === '未加微') {
      tips.push('尝试添加微信，便于后续跟进');
      tips.push('话术："加个微信吧，我把详细资料发给您"');
    }

    return {
      tips: tips.length > 0 ? tips : ['继续收集客户信息'],
      script: script || '您好，请问您这边是有资金需求吗？方便了解下您的具体情况吗？',
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * 分析客户
   */
  private static analyzeCustomer(customer: CustomerProfile) {
    let riskLevel: 'low' | 'medium' | 'high' | 'very-high' = 'medium';
    let conversionProbability = 50;
    const keyPainPoints: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // 意愿分析
    if (customer.communication.intention.includes('无意向')) {
      conversionProbability -= 30;
      keyPainPoints.push('客户意愿低');
      weaknesses.push('沟通意愿不强');
    } else if (customer.communication.intention === '有意向') {
      conversionProbability += 20;
      strengths.push('有明确需求意向');
    }

    // 资产分析
    if (customer.profile.property.hasHouse) {
      conversionProbability += 15;
      strengths.push('有房产可抵押');
      riskLevel = 'low';
    }
    if (!customer.profile.property.hasHouse && !customer.profile.property.hasCar) {
      weaknesses.push('无抵押资产');
      riskLevel = riskLevel === 'low' ? 'medium' : 'high';
    }

    // 征信分析
    if (customer.profile.credit.status.includes('逾期')) {
      conversionProbability -= 20;
      keyPainPoints.push('征信有逾期记录');
      weaknesses.push('征信状况不佳');
      riskLevel = customer.profile.credit.status === '逾期多' ? 'very-high' : 'high';
    } else if (customer.profile.credit.status === '无逾期') {
      conversionProbability += 10;
      strengths.push('征信良好');
    }

    // 职业收入分析
    if (customer.profile.occupation.type.includes('上班族-有公积金或有个税')) {
      conversionProbability += 15;
      strengths.push('有稳定收入证明');
    } else if (customer.profile.occupation.type.includes('无业')) {
      conversionProbability -= 25;
      keyPainPoints.push('无稳定收入来源');
      weaknesses.push('还款能力存疑');
    }

    // 用户等级
    const levelScores = { S: 30, A: 20, B: 10, C: 0, D: -10, E: -20 };
    if (customer.profile.userLevel !== '未确定') {
      conversionProbability += levelScores[customer.profile.userLevel] || 0;
    }

    // 微信状态
    if (customer.communication.addedWechat) {
      conversionProbability += 5;
      strengths.push('已建立微信联系');
    }

    // 确保概率在0-100之间
    conversionProbability = Math.max(0, Math.min(100, conversionProbability));

    return {
      riskLevel,
      conversionProbability,
      keyPainPoints,
      strengths,
      weaknesses,
    };
  }

  /**
   * 生成销售策略
   */
  private static generateStrategy(
    customer: CustomerProfile,
    analysis: ReturnType<typeof this.analyzeCustomer>
  ): SalesStrategy {
    const strategies: string[] = [];
    const keyPoints: string[] = [];
    const risks: string[] = [];

    // 基于意愿的策略
    if (customer.communication.intention.includes('无意向')) {
      strategies.push('采用顾问式销售，先建立信任');
      strategies.push('深挖客户真实需求和顾虑');
      keyPoints.push('不要急于推销产品');
      keyPoints.push('多提问，少陈述');
    } else {
      strategies.push('快速推进，把握成交时机');
      keyPoints.push('明确需求后立即匹配产品');
    }

    // 基于征信的策略
    if (customer.profile.credit.status.includes('逾期')) {
      strategies.push('优先推荐征信容忍度高的产品');
      strategies.push('说明逾期解决方案');
      keyPoints.push('了解逾期原因和金额');
      keyPoints.push('评估是否可结清或开具非恶意证明');
      risks.push('征信问题可能导致审批不通过');
    }

    // 基于资产的策略
    if (!customer.profile.property.hasHouse && !customer.profile.property.hasCar) {
      strategies.push('推荐信用类产品');
      strategies.push('重点询问收入和社保情况');
      keyPoints.push('强调我们有无抵押方案');
    } else {
      strategies.push('推荐抵押类产品，额度更高利率更低');
      keyPoints.push('询问资产价值和贷款额度需求');
    }

    // 基于职业的策略
    if (customer.profile.occupation.type.includes('企业主') ||
        customer.profile.occupation.type.includes('个体户')) {
      strategies.push('推荐经营贷产品');
      keyPoints.push('了解企业经营情况和流水');
    }

    // 基于转化概率的策略
    if (analysis.conversionProbability < 30) {
      strategies.push('评估是否值得继续跟进');
      strategies.push('如继续，需要长期培育');
      risks.push('成交概率低，投入成本需控制');
    } else if (analysis.conversionProbability > 70) {
      strategies.push('重点客户，优先排期');
      strategies.push('提供VIP服务体验');
      keyPoints.push('快速响应客户需求');
    }

    const priority = analysis.conversionProbability > 60 ? 'high' :
                     analysis.conversionProbability > 30 ? 'medium' : 'low';

    return { priority, strategies, keyPoints, risks };
  }

  /**
   * 生成话术推荐
   */
  private static generateScripts(
    customer: CustomerProfile,
    analysis: ReturnType<typeof this.analyzeCustomer>
  ) {
    // 开场白
    const opening = this.generateOpeningScript(customer);

    // 异议处理
    const objectionHandling = this.generateObjectionHandlingScript(customer);

    // 价值主张
    const valueProposition = this.generateValuePropositionScript(customer, analysis);

    // 促成话术
    const closing = this.generateClosingScript(customer);

    return {
      opening,
      objectionHandling,
      valueProposition,
      closing,
    };
  }

  private static generateOpeningScript(customer: CustomerProfile): ScriptRecommendation {
    const scripts = [];

    // 基于意愿状态
    if (customer.communication.intention.includes('无意向')) {
      scripts.push({
        content: `${customer.name}先生/女士您好，我是XX金融的小王。看到您之前咨询过贷款相关的信息，想了解下您现在还有资金需求吗？`,
        tags: ['无意向', '初次回访'],
        tone: 'consultative' as const,
      });
      scripts.push({
        content: `您好${customer.name}，我这边是XX金融的。注意到您之前了解过我们的产品，想问下您现在方便聊两分钟吗？`,
        tags: ['无意向', '柔和开场'],
        tone: 'friendly' as const,
      });
    } else {
      scripts.push({
        content: `${customer.name}您好，我是XX金融的客户经理。根据您的需求，我这边给您匹配了几个非常合适的方案，现在方便和您详细介绍一下吗？`,
        tags: ['有意向', '直接推进'],
        tone: 'professional' as const,
      });
    }

    // 基于是否加微信
    if (!customer.communication.addedWechat) {
      scripts.push({
        content: `对了，为了方便后续给您发送详细资料，能加您微信吗？手机号就是微信号吧？`,
        tags: ['加微信'],
        tone: 'friendly' as const,
      });
    }

    return {
      scenario: '开场白',
      scripts,
      tips: [
        '语速适中，吐字清晰',
        '声音要有亲和力',
        '快速说明来意，节约客户时间',
      ],
    };
  }

  private static generateObjectionHandlingScript(customer: CustomerProfile): ScriptRecommendation {
    const scripts = [];

    // 征信异议
    if (customer.profile.credit.status.includes('逾期')) {
      scripts.push({
        content: '关于征信逾期的问题，我们这边其实有专门针对这种情况的产品。很多客户也是因为一时周转不开才逾期的，我们理解。关键是现在逾期结清了吗？金额大概多少？',
        tags: ['征信逾期'],
        tone: 'consultative' as const,
      });
      scripts.push({
        content: '如果逾期金额不大，或者已经结清了，我们可以尝试开具非恶意逾期证明，这样对审批会有帮助。',
        tags: ['征信逾期', '解决方案'],
        tone: 'professional' as const,
      });
    }

    // 无资产异议
    if (!customer.profile.property.hasHouse && !customer.profile.property.hasCar) {
      scripts.push({
        content: '没有房车也完全没关系，我们有专门的信用贷产品。只要您有稳定收入，缴纳社保或公积金，就可以申请。额度一般在月收入的10-20倍左右。',
        tags: ['无资产'],
        tone: 'consultative' as const,
      });
    }

    // 利率太高异议
    scripts.push({
      content: '关于利率的问题，我们的利率确实是根据客户资质来定的。像您这种情况（根据客户优势），我们可以申请更优惠的利率。而且相比其他渠道，我们的综合成本已经是很低的了。',
      tags: ['利率异议'],
      tone: 'professional' as const,
    });

    // 考虑一下异议
    scripts.push({
      content: '我理解您需要考虑。不过我想了解下，您主要是哪方面需要考虑？是利率、额度还是放款速度？或者是还有其他顾虑？这样我可以针对性地给您解答。',
      tags: ['考虑一下'],
      tone: 'consultative' as const,
    });

    return {
      scenario: '异议处理',
      scripts,
      tips: [
        '认同客户感受，不要直接反驳',
        '用提问找出真实顾虑',
        '提供具体解决方案',
      ],
    };
  }

  private static generateValuePropositionScript(
    _customer: CustomerProfile,
    analysis: ReturnType<typeof this.analyzeCustomer>
  ): ScriptRecommendation {
    const scripts = [];

    // 基于客户优势
    if (analysis.strengths.length > 0) {
      scripts.push({
        content: `根据您的情况（${analysis.strengths.join('、')}），我们这边可以给您申请比较优质的产品，额度会更高，利率也会更优惠。`,
        tags: ['强调优势'],
        tone: 'professional' as const,
      });
    }

    // 基于速度优势
    scripts.push({
      content: '我们这边最快当天就能出审批结果，通过后1-3个工作日就能放款。如果您急用的话，我们可以帮您走快速通道。',
      tags: ['速度优势'],
      tone: 'professional' as const,
    });

    // 基于专业性
    scripts.push({
      content: '我们已经帮助超过XX位客户成功获得贷款。我会根据您的实际情况，给您匹配最合适的产品，全程协助您办理，确保顺利通过审批。',
      tags: ['专业性'],
      tone: 'consultative' as const,
    });

    return {
      scenario: '价值主张',
      scripts,
      tips: [
        '突出差异化优势',
        '用数据和案例增强说服力',
        '强调对客户的具体价值',
      ],
    };
  }

  private static generateClosingScript(customer: CustomerProfile): ScriptRecommendation {
    const scripts = [];

    scripts.push({
      content: '那您看这样，我现在就帮您提交预审，今天就能知道结果。您这边准备一下身份证和银行卡，我们尽快帮您办理，好吗？',
      tags: ['假设成交法'],
      tone: 'professional' as const,
    });

    scripts.push({
      content: '现在我们有个活动，本月申请可以减免部分手续费。您要不先提交试试？反正预审不查征信，不通过也没影响。',
      tags: ['优惠促成'],
      tone: 'friendly' as const,
    });

    scripts.push({
      content: '我看您这边条件还是很不错的，通过率应该挺高。要不我帮您申请，咱们一起努力争取最好的额度和利率？',
      tags: ['共同目标'],
      tone: 'consultative' as const,
    });

    if (customer.communication.addedWechat) {
      scripts.push({
        content: '那我微信把详细的产品资料和申请流程发给您，您看一下。有任何问题随时问我，我会全程协助您的。',
        tags: ['微信跟进'],
        tone: 'friendly' as const,
      });
    }

    return {
      scenario: '促成话术',
      scripts,
      tips: [
        '制造紧迫感（优惠、名额）',
        '降低决策门槛（预审不查征信）',
        '给客户信心（成功案例）',
      ],
    };
  }

  /**
   * 推荐产品
   */
  private static recommendProducts(
    customer: CustomerProfile,
    _analysis: ReturnType<typeof this.analyzeCustomer>
  ) {
    const products = [];

    // 有房产 -> 推荐房产抵押贷
    if (customer.profile.property.hasHouse) {
      products.push({
        name: '房产抵押贷',
        reason: '客户有房产，可获得更高额度和更低利率',
        matchScore: 90,
      });
    }

    // 企业主/个体户 -> 推荐经营贷
    if (customer.profile.occupation.type === '企业主' ||
        customer.profile.occupation.type === '个体户') {
      products.push({
        name: '企业经营贷',
        reason: '客户有经营实体，可申请经营类贷款',
        matchScore: 85,
      });
    }

    // 上班族有公积金 -> 推荐公积金贷
    if (customer.profile.occupation.type.includes('有公积金')) {
      products.push({
        name: '公积金信用贷',
        reason: '客户缴纳公积金，可申请低息信用贷',
        matchScore: 80,
      });
    }

    // 征信良好无抵押 -> 推荐信用贷
    if (customer.profile.credit.status === '无逾期' &&
        !customer.profile.property.hasHouse &&
        !customer.profile.property.hasCar) {
      products.push({
        name: '纯信用贷',
        reason: '客户征信良好，可申请纯信用贷款',
        matchScore: 75,
      });
    }

    // 征信有问题 -> 推荐容忍度高的产品
    if (customer.profile.credit.status.includes('逾期')) {
      products.push({
        name: '征信容忍产品',
        reason: '客户征信有瑕疵，推荐容忍度较高的产品',
        matchScore: 60,
      });
    }

    return products.sort((a, b) => b.matchScore - a.matchScore);
  }
}
