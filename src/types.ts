// 定义计划项类型
export interface PlanItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

// 定义月度成就数据
export interface MonthlyAchievement {
  month: string; // 格式: YYYY-MM
  stars: number;
  suns: number;
}

// 定义用户数据类型
export interface UserData {
  name: string;
  shortTermPlans: PlanItem[];
  longTermPlans: PlanItem[];
  stars: number; // 当月星星数
  suns: number; // 当月太阳数
  lastStarAdded: string; // 上次添加星星的日期
  lastResetMonth: string; // 上次重置月份
  monthlyAchievements: MonthlyAchievement[]; // 历史月度成就记录
}

// 定义计划类型枚举
export enum PlanType {
  SHORT_TERM = 'shortTerm',
  LONG_TERM = 'longTerm'
}

// 定义共享文档类型
export interface SharedDocument {
  id: string;
  user1: UserData;
  user2: UserData;
  version: number;
  lastUpdated: string;
  createdBy: string;
}