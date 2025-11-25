# CRM销售策略和话术推荐系统

一个智能的CRM销售辅助系统，基于客户画像自动推荐销售策略和话术，帮助销售人员提升沟通效率和成交率。

## 功能特点

### 1. 客户详情页 - AI智能销售助手

在客户详情页右侧显示智能销售助手面板，包含：

- **客户画像分析**
  - 风险等级评估
  - 成交概率预测
  - 关键痛点识别
  - 客户优势和劣势分析

- **销售策略推荐**
  - 基于客户画像的核心策略
  - 关键沟通要点
  - 风险提示

- **话术推荐**
  - 开场白话术
  - 异议处理话术
  - 价值主张话术
  - 促成话术
  - 一键复制功能

- **产品推荐**
  - 智能匹配适合的产品
  - 显示匹配度和推荐理由

### 2. 跟进编辑页 - 实时话术助手

在标签编辑页顶部显示实时话术助手，功能包括：

- **实时推荐**：根据选择的标签实时更新推荐内容
- **策略建议**：显示当前标签组合的沟通建议
- **话术推荐**：提供针对性的话术模板
- **风险警告**：对高风险标签（如征信逾期）显示警告
- **快捷话术**：常用话术一键复制

## 技术栈

- React 18 + TypeScript
- Ant Design 5 (UI组件库)
- Vite (构建工具)
- Ant Design Icons + Lucide React (图标)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看演示页面

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── DetailPage/
│   │   ├── CustomerDetailPage.tsx      # 客户详情页完整示例
│   │   └── SalesAssistant.tsx          # 智能销售助手组件
│   └── FollowUpEdit/
│       ├── FollowUpEditModal.tsx       # 跟进编辑弹窗示例
│       └── RealtimeTipsPanel.tsx       # 实时话术助手组件
├── services/
│   └── recommendationEngine.ts         # 推荐引擎核心逻辑
├── types/
│   └── customer.ts                     # TypeScript类型定义
└── App.tsx                             # 应用主入口
```

## 使用说明

### 在现有CRM中集成

#### 1. 集成客户详情页的智能助手

```tsx
import { SalesAssistant } from '@/components/DetailPage/SalesAssistant';
import type { CustomerProfile } from '@/types/customer';

// 在你的客户详情页组件中
function CustomerDetail() {
  const customer: CustomerProfile = {
    // ... 客户数据
  };

  return (
    <Layout>
      <Content>{/* 原有的客户详情内容 */}</Content>
      <Sider width={380}>
        <SalesAssistant customer={customer} />
      </Sider>
    </Layout>
  );
}
```

#### 2. 集成跟进编辑页的实时助手

```tsx
import { RealtimeTipsPanel } from '@/components/FollowUpEdit/RealtimeTipsPanel';
import type { CustomerTags } from '@/types/customer';

function FollowUpEdit() {
  const [selectedTags, setSelectedTags] = useState<CustomerTags>({});

  return (
    <Modal>
      <RealtimeTipsPanel
        selectedTags={selectedTags}
        customerProfile={customerProfile}
      />
      {/* 标签选择器等其他内容 */}
    </Modal>
  );
}
```

## 核心逻辑

### 推荐引擎

推荐引擎 (`SalesRecommendationEngine`) 提供两个主要方法：

#### 1. 生成完整推荐（用于详情页）

```typescript
const recommendation = SalesRecommendationEngine.generateRecommendation(customer);
// 返回：客户分析、策略、话术、产品推荐
```

#### 2. 生成实时推荐（用于标签编辑页）

```typescript
const realtime = SalesRecommendationEngine.generateRealtimeRecommendation(
  selectedTags,
  customerProfile
);
// 返回：tips（建议）、script（话术）、warnings（警告）
```

### 推荐逻辑

系统基于以下维度分析客户：

1. **意愿**: 有意向 / 无意向
2. **资产**: 房产、车产
3. **征信**: 逾期情况
4. **职业**: 企业主、上班族、个体户等
5. **用户等级**: S/A/B/C/D/E级
6. **微信状态**: 是否已加微信

根据这些维度，系统会：
- 评估风险等级（低/中/高/极高）
- 计算成交概率（0-100%）
- 识别关键痛点和优势
- 生成针对性的策略和话术

## 设计文档

详细的设计文档请查看 [DESIGN.md](./DESIGN.md)，包含：
- 完整的系统架构
- UI/UX设计原则
- 推荐引擎算法详解
- 扩展性设计
- 最佳实践

## 演示数据

项目包含基于真实场景的演示数据（黄光塔客户案例）：
- E级客户
- 无意向-其他
- 无房无车
- 征信有逾期
- 现金收入，无公积金

可以在App.tsx中查看和修改演示数据。

## 自定义和扩展

### 修改话术模板

编辑 `src/services/recommendationEngine.ts` 中的话术生成方法：
- `generateOpeningScript()` - 开场白
- `generateObjectionHandlingScript()` - 异议处理
- `generateValuePropositionScript()` - 价值主张
- `generateClosingScript()` - 促成话术

### 调整推荐逻辑

修改 `analyzeCustomer()` 方法中的评分规则，或 `generateStrategy()` 中的策略生成规则。

### 添加新的标签类型

1. 在 `src/types/customer.ts` 的 `CustomerTags` 接口中添加新字段
2. 在 `FollowUpEditModal.tsx` 中添加对应的标签选择器
3. 在推荐引擎中添加针对新标签的逻辑

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请提交Issue或联系技术团队。
