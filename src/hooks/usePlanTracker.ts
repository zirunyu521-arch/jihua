import { useState, useEffect, useRef } from 'react';
import { UserData, PlanItem, PlanType } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// 生成唯一ID
const generateId = (): string => {
  // 使用UUID生成更可靠的唯一ID
  try {
    return uuidv4();
  } catch {
    // 降级方案
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// 检查今天是否已经添加过星星
const canAddStarToday = (lastStarAdded: string): boolean => {
  const today = new Date().toDateString();
  const lastAddedDate = new Date(lastStarAdded).toDateString();
  return today !== lastAddedDate;
};

// 获取当前月份的格式化字符串 (YYYY-MM)
const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// 导出数据为URL参数
const exportDataToUrl = (user1: UserData, user2: UserData, version: number): string => {
  try {
    // 精简数据结构以减少大小
    const compressedData = {
      v: version, // 版本号简写
      t: Date.now(), // 时间戳简写
      u1: {
        n: user1.name,
        st: user1.shortTermPlans.map(p => ({ i: p.id, c: p.content, co: p.completed })),
        lt: user1.longTermPlans.map(p => ({ i: p.id, c: p.content, co: p.completed })),
        s: user1.stars,
        su: user1.suns,
        lsa: user1.lastStarAdded,
        lrm: user1.lastResetMonth,
        ma: user1.monthlyAchievements
      },
      u2: {
        n: user2.name,
        st: user2.shortTermPlans.map(p => ({ i: p.id, c: p.content, co: p.completed })),
        lt: user2.longTermPlans.map(p => ({ i: p.id, c: p.content, co: p.completed })),
        s: user2.stars,
        su: user2.suns,
        lsa: user2.lastStarAdded,
        lrm: user2.lastResetMonth,
        ma: user2.monthlyAchievements
      }
    };
    
    // 转换为字符串并压缩
    const jsonData = JSON.stringify(compressedData);
    const encodedData = btoa(jsonData);
    
    // 再次检查大小
    if (encodedData.length > 2000) {
      // 进一步精简数据，只保留最新的计划
      const ultraCompressedData = {
        ...compressedData,
        u1: {
          ...compressedData.u1,
          st: compressedData.u1.st.slice(0, 15),
          lt: compressedData.u1.lt.slice(0, 10)
        },
        u2: {
          ...compressedData.u2,
          st: compressedData.u2.st.slice(0, 15),
          lt: compressedData.u2.lt.slice(0, 10)
        }
      };
      
      const ultraJsonData = JSON.stringify(ultraCompressedData);
      const ultraEncodedData = btoa(ultraJsonData);
      
      if (ultraEncodedData.length > 2000) {
        throw new Error('数据过大，无法导出');
      }
      
      const url = new URL(window.location.href);
      url.searchParams.set('data', ultraEncodedData);
      window.history.replaceState(null, '', url.toString());
      toast('数据过大，已自动精简后导出，可能只包含部分计划');
      return url.toString();
    }
    
    const url = new URL(window.location.href);
    url.searchParams.set('data', encodedData);
    window.history.replaceState(null, '', url.toString());
    return url.toString();
  } catch (error) {
    console.error('导出数据失败:', error);
    // 提供更具体的错误信息
    if (error instanceof Error && error.message === '数据过大，无法导出') {
      toast('数据过大，无法全部导出，请尝试删除一些不必要的计划');
    } else {
      toast('导出数据失败，请重试');
    }
    return '';
  }
};

// 从URL参数导入数据
const importDataFromUrl = (): { user1: UserData; user2: UserData; version: number } | null => {
  try {
    const url = new URL(window.location.href);
    const encodedData = url.searchParams.get('data');
    
    if (!encodedData) {
      return null;
    }
    
    const decodedData = JSON.parse(atob(encodedData));
    
    // 处理精简格式数据
    if (decodedData.v !== undefined && decodedData.u1 && decodedData.u2) {
      // 还原用户1数据
      const user1: UserData = {
        name: decodedData.u1.n,
        shortTermPlans: decodedData.u1.st.map((p: any) => ({
          id: p.i,
          content: p.c,
          completed: p.co,
          createdAt: new Date().toISOString()
        })),
        longTermPlans: decodedData.u1.lt.map((p: any) => ({
          id: p.i,
          content: p.c,
          completed: p.co,
          createdAt: new Date().toISOString()
        })),
        stars: decodedData.u1.s,
        suns: decodedData.u1.su,
        lastStarAdded: decodedData.u1.lsa,
        lastResetMonth: decodedData.u1.lrm,
        monthlyAchievements: decodedData.u1.ma || []
      };
      
      // 还原用户2数据
      const user2: UserData = {
        name: decodedData.u2.n,
        shortTermPlans: decodedData.u2.st.map((p: any) => ({
          id: p.i,
          content: p.c,
          completed: p.co,
          createdAt: new Date().toISOString()
        })),
        longTermPlans: decodedData.u2.lt.map((p: any) => ({
          id: p.i,
          content: p.c,
          completed: p.co,
          createdAt: new Date().toISOString()
        })),
        stars: decodedData.u2.s,
        suns: decodedData.u2.su,
        lastStarAdded: decodedData.u2.lsa,
        lastResetMonth: decodedData.u2.lrm,
        monthlyAchievements: decodedData.u2.ma || []
      };
      
      return {
        user1,
        user2,
        version: decodedData.v
      };
    }
    
    // 处理旧格式数据
    if (decodedData.user1 && decodedData.user2) {
      return {
        user1: decodedData.user1,
        user2: decodedData.user2,
        version: decodedData.version || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('导入数据失败:', error);
    // 尝试更宽容的错误处理
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('data');
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      console.error('清理URL参数失败:', e);
    }
    return null;
  }
};

export const usePlanTracker = () => {
  // 初始化用户数据
  const initializeUserData = (name: string): UserData => {
    return {
      name,
      shortTermPlans: [],
      longTermPlans: [],
      stars: 0,
      suns: 0,
      lastStarAdded: '',
      lastResetMonth: getCurrentMonth(),
      monthlyAchievements: []
    };
  };

  // 从localStorage加载数据
  const loadFromStorage = (): { user1: UserData; user2: UserData; version: number } => {
    try {
      // 首先尝试从URL导入数据
      const urlData = importDataFromUrl();
      if (urlData) {
        // 保存到localStorage
        saveToStorage(urlData.user1, urlData.user2);
        toast('成功导入共享数据！');
        return urlData;
      }

      // 如果URL中没有数据，则从localStorage加载
      const user1Data = localStorage.getItem('user1Data');
      const user2Data = localStorage.getItem('user2Data');
      
      // 加载后检查是否需要重置月度数据
      const loadUser = (data: string | null, name: string): UserData => {
        if (!data) return initializeUserData(name);
        
        const user = JSON.parse(data);
        
        // 兼容旧版本数据，添加缺少的字段
        if (!user.lastResetMonth) {
          user.lastResetMonth = getCurrentMonth();
          user.monthlyAchievements = [];
        }
        
        // 检查是否需要进行月度重置
        const currentMonth = getCurrentMonth();
        if (user.lastResetMonth !== currentMonth) {
          // 保存上月成就
          user.monthlyAchievements.unshift({
            month: user.lastResetMonth,
            stars: user.stars,
            suns: user.suns
          });
          
          // 重置当月成就
          user.stars = 0;
          user.suns = 0;
          user.lastResetMonth = currentMonth;
        }
        
        return user;
      };
      
      return {
        user1: loadUser(user1Data, '于子润'),
        user2: loadUser(user2Data, '梁美姿'),
        version: 0
      };
    } catch (error) {
      console.error('加载数据失败:', error);
      return {
        user1: initializeUserData('于子润'),
        user2: initializeUserData('梁美姿'),
        version: 0
      };
    }
  };

  // 保存数据到localStorage
  const saveToStorage = (user1: UserData, user2: UserData): void => {
    try {
      localStorage.setItem('user1Data', JSON.stringify(user1));
      localStorage.setItem('user2Data', JSON.stringify(user2));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

// 状态管理
  const [user1, setUser1] = useState<UserData>(() => loadFromStorage().user1);
  const [user2, setUser2] = useState<UserData>(() => loadFromStorage().user2);
  const [version, setVersion] = useState<number>(() => loadFromStorage().version);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [documentId, setDocumentId] = useState<string>(() => {
    // 尝试从URL获取文档ID
    const url = new URL(window.location.href);
    return url.searchParams.get('docId') || '';
  });
  
  // 用于Netlify部署的特殊标识
  const isNetlifyDeployed = () => {
    return window.location.hostname.endsWith('netlify.app') || 
           window.location.hostname !== 'localhost';
  };
  
  // 同步锁，防止重复同步
  const syncLockRef = useRef<boolean>(false);
  
// 在Netlify部署环境中，我们将使用增强的URL同步机制
  // 检查是否支持实时同步（在Netlify上始终返回false，因为没有后端API）
  const isRealTimeSyncSupported = () => {
    return false;
  };

// 在Netlify环境中，我们使用URL参数同步替代后端同步
  // 从后端获取最新数据（在Netlify上不使用）
  const fetchFromBackend = async (): Promise<boolean> => {
    return false;
  };
  
  // 保存数据到后端（在Netlify上不使用）
  const saveToBackend = async (): Promise<boolean> => {
    return false;
  };
  
// 在Netlify环境中创建共享文档（使用URL参数）
  const createNewDocument = async (): Promise<string> => {
    try {
      // 生成唯一文档ID
      const newDocId = generateId();
      setDocumentId(newDocId);
      
      // 更新URL以包含文档ID
      const url = new URL(window.location.href);
      url.searchParams.set('docId', newDocId);
      window.history.replaceState(null, '', url.toString());
      
      // 立即生成分享链接以确保数据被编码到URL中
      generateShareLink();
      
      toast('已创建共享文档，现在可以与他人通过分享链接同步数据了！');
      return newDocId;
    } catch (error) {
      console.error('创建文档失败:', error);
      toast('创建共享文档失败，请重试');
      return '';
    }
  };

// 当数据变化时保存到localStorage并更新URL
  useEffect(() => {
    saveToStorage(user1, user2);
    
    // 自动保存到后端（如果支持实时同步）
    if (isRealTimeSyncSupported()) {
      saveToBackend();
    }
    
    // 如果是在Netlify环境且有文档ID，则每次数据变化都更新URL参数
    if (isNetlifyDeployed() && documentId) {
      generateShareLink();
    }
    
    setLastSyncTime(Date.now());
  }, [user1, user2]);

  // 添加计划项
  const addPlanItem = (userId: 'user1' | 'user2', planType: PlanType, content: string): void => {
    const newPlanItem: PlanItem = {
      id: generateId(),
      content,
      completed: false,
      createdAt: formatDate(new Date())
    };

    if (userId === 'user1') {
      setUser1(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: [
          ...prev[planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'],
          newPlanItem
        ]
      }));
    } else {
      setUser2(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: [
          ...prev[planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'],
          newPlanItem
        ]
      }));
    }
  };

  // 切换计划项完成状态
  const togglePlanItem = (userId: 'user1' | 'user2', planType: PlanType, id: string): void => {
    if (userId === 'user1') {
      setUser1(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: prev[
          planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'
        ].map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      }));
    } else {
      setUser2(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: prev[
          planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'
        ].map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      }));
    }
  };

  // 删除计划项
  const deletePlanItem = (userId: 'user1' | 'user2', planType: PlanType, id: string): void => {
    if (userId === 'user1') {
      setUser1(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: prev[
          planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'
        ].filter(item => item.id !== id)
      }));
    } else {
      setUser2(prev => ({
        ...prev,
        [planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans']: prev[
          planType === PlanType.SHORT_TERM ? 'shortTermPlans' : 'longTermPlans'
        ].filter(item => item.id !== id)
      }));
    }
  };

  // 添加星星
  const addStar = (userId: 'user1' | 'user2'): boolean => {
    const user = userId === 'user1' ? user1 : user2;
    
    if (!canAddStarToday(user.lastStarAdded)) {
      return false;
    }

    let updatedUser: UserData;
    
    if (userId === 'user1') {
      updatedUser = {
        ...user1,
        stars: user1.stars + 1,
        lastStarAdded: formatDate(new Date())
      };
      
      // 每5个星星兑换1个太阳
      if (updatedUser.stars >= 5) {
        updatedUser.suns += Math.floor(updatedUser.stars / 5);
        updatedUser.stars = updatedUser.stars % 5;
      }
      
      setUser1(updatedUser);
    } else {
      updatedUser = {
        ...user2,
        stars: user2.stars + 1,
        lastStarAdded: formatDate(new Date())
      };
      
      // 每5个星星兑换1个太阳
      if (updatedUser.stars >= 5) {
        updatedUser.suns += Math.floor(updatedUser.stars / 5);
        updatedUser.stars = updatedUser.stars % 5;
      }
      
      setUser2(updatedUser);
    }
    
    return true;
  };

  // 获取总太阳数
  const getTotalSuns = (): number => {
    return user1.suns + user2.suns;
  };

// 生成分享链接
const generateShareLink = (): string => {
  // 生成新版本号
  const newVersion = version + 1;
  setVersion(newVersion);
  
  // 在Netlify环境中，始终使用URL参数方式同步数据
  const shareUrl = exportDataToUrl(user1, user2, newVersion);
  
  // 如果有文档ID，确保URL中包含文档ID
  if (documentId && shareUrl) {
    const url = new URL(shareUrl);
    url.searchParams.set('docId', documentId);
    const finalUrl = url.toString();
    
    // 复制到剪贴板
    navigator.clipboard.writeText(finalUrl).then(() => {
      toast('分享链接已复制到剪贴板！请让对方使用这个链接查看最新计划');
    }).catch(err => {
      console.error('复制失败:', err);
      toast('复制失败，请手动复制链接');
    });
    
    return finalUrl;
  }
  
  if (shareUrl) {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast('分享链接已复制到剪贴板！请让对方使用这个链接查看最新计划');
    }).catch(err => {
      console.error('复制失败:', err);
      toast('复制失败，请手动复制链接');
    });
  }
  
  return shareUrl;
};

  // 检查并同步来自其他用户的更新
  const checkForUpdates = async (): Promise<boolean> => {
    // 防止重复同步
    if (syncLockRef.current) {
      return false;
    }
    
    syncLockRef.current = true;
    setIsSyncing(true);
    
    try {
      // 如果支持实时同步，优先从后端获取更新
      if (isRealTimeSyncSupported()) {
        return await fetchFromBackend();
      }
      
      // 否则使用旧的URL导入方式
      const urlData = importDataFromUrl();
      
      if (urlData && urlData.version > version) {
        // 发现新版本数据，更新本地状态
        setUser1(urlData.user1);
        setUser2(urlData.user2);
        setVersion(urlData.version);
        setLastSyncTime(Date.now());
        toast('已同步最新数据！');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('检查更新失败:', error);
      return false;
    } finally {
      setIsSyncing(false);
      syncLockRef.current = false;
    }
  };

  // 定期检查更新 (每5秒)
  useEffect(() => {
    const interval = setInterval(() => {
      checkForUpdates();
    }, 5000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(interval);
  }, [version, documentId]);

  // 每当数据变化时，自动导出到localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        const dataToSave = {
          user1,
          user2,
          version,
          lastSaved: Date.now()
        };
        localStorage.setItem('sharedPlanData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('保存到localStorage失败:', error);
      }
    };
    
    saveToLocalStorage();
  }, [user1, user2, version]);

  return {
    user1,
    user2,
    addPlanItem,
    togglePlanItem,
    deletePlanItem,
    addStar,
    getTotalSuns,
    canAddStarToday: (userId: 'user1' | 'user2') => canAddStarToday(userId === 'user1' ? user1.lastStarAdded : user2.lastStarAdded),
    generateShareLink,
    checkForUpdates,
    isSyncing,
    lastSyncTime,
    documentId,
    createNewDocument,
    isRealTimeSyncSupported
  };
};