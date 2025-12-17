import { motion } from "framer-motion";
import { UserData } from "@/types";

interface AchievementSectionProps {
    user: UserData;
    userId: "user1" | "user2";
    addStar: () => void;
    canAddStarToday: boolean;
    showStarAnimation: boolean;
    isUser1: boolean;
}

const AchievementSection: React.FC<AchievementSectionProps> = (
    {
        user,
        addStar,
        canAddStarToday,
        showStarAnimation,
        isUser1
    }
) => {
    const renderStars = () => {
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(<motion.div
                key={`star-${i}`}
                className={`text-xl ${i < user.stars ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                animate={i < user.stars ? {
                    scale: [1, 1.2, 1]
                } : {}}
                transition={{
                    duration: 0.5
                }}>
                <i className="fas fa-star"></i>
            </motion.div>);
        }

        return stars;
    };

    const renderSuns = () => {
        const suns = [];

        for (let i = 0; i < user.suns; i++) {
            suns.push(<motion.div
                key={`sun-${i}`}
                className="text-xl text-yellow-500"
                animate={{
                    rotate: 360,

                    boxShadow: [
                        "0 0 5px rgba(255, 221, 0, 0.5)",
                        "0 0 20px rgba(255, 221, 0, 0.8)",
                        "0 0 5px rgba(255, 221, 0, 0.5)"
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}>
                <i className="fas fa-sun"></i>
            </motion.div>);
        }

        return suns;
    };

    // 渲染上个月成就
    const renderLastMonthAchievements = () => {
        if (!user.monthlyAchievements || user.monthlyAchievements.length === 0) {
            return null;
        }

        const lastMonthAchievement = user.monthlyAchievements[0];
        // 格式化月份显示
        const formatMonth = (monthStr: string) => {
            const [year, month] = monthStr.split('-');
            return `${year}年${month}月`;
        };

        return (
            <div className="mt-2 border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formatMonth(lastMonthAchievement.month)}成就</div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                        <span className="text-yellow-400 mr-1"><i className="fas fa-star"></i></span>
                        <span className="text-sm font-medium">{lastMonthAchievement.stars}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1"><i className="fas fa-sun"></i></span>
                        <span className="text-sm font-medium">{lastMonthAchievement.suns}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">当月成就进度</h3>
                {renderLastMonthAchievements()}
            </div>
            <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-300">本月小星星</span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white">{user.stars}/5</span>
                </div>
                <div className="flex space-x-1">
                    {renderStars()}
                </div>
            </div>
            <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-300">本月太阳</span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white">{user.suns}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {renderSuns().length > 0 ? renderSuns() : <span className="text-xs text-gray-500 dark:text-gray-400">还没有太阳哦</span>}
                </div>
            </div>
            <button
                className={`w-full mt-2 py-1.5 rounded-lg transition-all flex items-center justify-center text-sm ${canAddStarToday ? isUser1 ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-pink-500 hover:bg-pink-600 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"}`}
                onClick={addStar}
                disabled={!canAddStarToday}>
                {canAddStarToday ? <>
                    <i className="fas fa-plus mr-1"></i>添加星星
                              </> : <>
                    <i className="fas fa-clock mr-1"></i>明天再来
                              </>}
                {showStarAnimation && <motion.div
                    className="absolute text-yellow-400 text-2xl"
                    initial={{
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: -30
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                    transition={{
                        duration: 0.6
                    }}>
                    <i className="fas fa-star"></i>
                </motion.div>}
            </button>
        </div>
    );
};

export default AchievementSection;