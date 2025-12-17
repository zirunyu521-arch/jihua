import { useState } from "react";
import { motion } from "framer-motion";
import { UserData, PlanType } from "@/types";
import AchievementSection from "./AchievementSection";

interface PersonPlanSectionProps {
    user: UserData;
    userId: "user1" | "user2";
    addPlanItem: (userId: "user1" | "user2", planType: PlanType, content: string) => void;
    togglePlanItem: (userId: "user1" | "user2", planType: PlanType, id: string) => void;
    deletePlanItem: (userId: "user1" | "user2", planType: PlanType, id: string) => void;
    addStar: (userId: "user1" | "user2") => boolean;
    canAddStarToday: (userId: "user1" | "user2") => boolean;
}

const PersonPlanSection: React.FC<PersonPlanSectionProps> = (
    {
        user,
        userId,
        addPlanItem,
        togglePlanItem,
        deletePlanItem,
        addStar,
        canAddStarToday
    }
) => {
    const [activeTab, setActiveTab] = useState<PlanType>(PlanType.SHORT_TERM);
    const [newPlanContent, setNewPlanContent] = useState("");
    const [showStarAnimation, setShowStarAnimation] = useState(false);

    const handleAddPlan = () => {
        if (newPlanContent.trim()) {
            addPlanItem(userId, activeTab, newPlanContent.trim());
            setNewPlanContent("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddPlan();
        }
    };

    const handleAddStar = () => {
        const success = addStar(userId);

        if (success) {
            setShowStarAnimation(true);
            setTimeout(() => setShowStarAnimation(false), 1000);
        }
    };

    const plans = activeTab === PlanType.SHORT_TERM ? user.shortTermPlans : user.longTermPlans;
    const isUser1 = userId === "user1";
    const bgColor = isUser1 ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20" : "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20";
    const headerColor = isUser1 ? "bg-blue-500 text-white" : "bg-pink-500 text-white";

    return (
        <div className={`${bgColor} rounded-xl shadow-lg p-4 flex flex-col h-full`}>
            <div className={`${headerColor} rounded-lg p-2 mb-2`}>
                <h2 className="text-xl font-bold text-center">{user.name}</h2>
            </div>
            <AchievementSection
                user={user}
                userId={userId}
                addStar={handleAddStar}
                canAddStarToday={canAddStarToday(userId)}
                showStarAnimation={showStarAnimation}
                isUser1={isUser1} />
            <div
                className="flex mb-3 rounded-lg overflow-hidden bg-white/70 dark:bg-gray-800/70 mt-2">
                <button
                    className={`flex-1 py-2 px-4 transition-all ${activeTab === PlanType.SHORT_TERM ? isUser1 ? "bg-blue-500 text-white" : "bg-pink-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    onClick={() => setActiveTab(PlanType.SHORT_TERM)}>
                    <i className="fas fa-calendar-day mr-2"></i>短期计划
                            </button>
                <button
                    className={`flex-1 py-2 px-4 transition-all ${activeTab === PlanType.LONG_TERM ? isUser1 ? "bg-blue-500 text-white" : "bg-pink-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    onClick={() => setActiveTab(PlanType.LONG_TERM)}>
                    <i className="fas fa-calendar-alt mr-2"></i>长期计划
                </button>
            </div>
            <div className="flex mb-3">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="添加新计划..."
                    value={newPlanContent}
                    onChange={e => setNewPlanContent(e.target.value)}
                    onKeyPress={handleKeyPress} />
                <button
                    className={`px-4 py-2 rounded-r-lg font-medium ${isUser1 ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-pink-500 hover:bg-pink-600 text-white"} transition-colors`}
                    onClick={handleAddPlan}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>
            <div
                className="flex-1 overflow-y-auto bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 flex-grow">
                {plans.length === 0 ? <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <i className="fas fa-sticky-note text-4xl mb-2"></i>
                    <p>暂无计划，添加一个新计划吧！</p>
                </div> : <ul className="space-y-2">
                    {plans.map(plan => <motion.li
                        key={plan.id}
                        initial={{
                            opacity: 0,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            height: 0
                        }}
                        className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className={`mr-3 h-5 w-5 rounded-full ${isUser1 ? "accent-blue-500" : "accent-pink-500"}`}
                                checked={plan.completed}
                                onChange={() => togglePlanItem(userId, activeTab, plan.id)} />
                            <span
                                className={`${plan.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"} transition-all`}>
                                {plan.content}
                            </span>
                        </div>
                        <button
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            onClick={() => deletePlanItem(userId, activeTab, plan.id)}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </motion.li>)}
                </ul>}
            </div>
        </div>
    );
};

export default PersonPlanSection;