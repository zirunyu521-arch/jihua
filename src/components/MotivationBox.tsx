import { motion } from "framer-motion";

interface MotivationBoxProps {
    user1Suns: number;
    user2Suns: number;
    targetSuns: number;
}

const MotivationBox: React.FC<MotivationBoxProps> = (
    {
        user1Suns,
        user2Suns,
        targetSuns
    }
) => {
    const user1ProgressPercentage = Math.min(user1Suns / targetSuns * 100, 100);
    const user2ProgressPercentage = Math.min(user2Suns / targetSuns * 100, 100);
    const user1Achieved = user1Suns >= targetSuns;
    const user2Achieved = user2Suns >= targetSuns;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg z-10 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-2">
                    {}
                    <div className="flex items-center justify-center">
                        <h3 className="font-bold text-base text-gray-800">
                            <i className="fas fa-gift text-red-500 mr-2"></i>两人每月均完成3个太阳即可奖励一下自己！
                                        </h3>
                    </div>
                    {}
                    <></>
                    {}
                    <div className="flex justify-center text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                            <span>于子润: </span>
                            {user1Achieved ? <span className="text-green-600 font-bold">已达成!</span> : <span>{user1Suns}/{targetSuns}</span>}
                            <div className="flex ml-1">
                                {Array.from({
                                    length: targetSuns
                                }).map((_, index) => <motion.div
                                    key={`sun-user1-${index}`}
                                    className={`text-xs mx-0.5 ${index < (user1Achieved ? targetSuns : user1Suns) ? "text-yellow-500" : "text-gray-300"}`}
                                    animate={index < (user1Achieved ? targetSuns : user1Suns) ? {
                                        rotate: 360
                                    } : {}}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: index * 0.3
                                    }}>
                                    <i className="fas fa-sun"></i>
                                </motion.div>)}
                            </div>
                        </div>
                        <span className="mx-3">|</span>
                        <div className="flex items-center">
                            <span>梁美姿: </span>
                            {user2Achieved ? <span className="text-green-600 font-bold">已达成!</span> : <span>{user2Suns}/{targetSuns}</span>}
                            <div className="flex ml-1">
                                {Array.from({
                                    length: targetSuns
                                }).map((_, index) => <motion.div
                                    key={`sun-user2-${index}`}
                                    className={`text-xs mx-0.5 ${index < (user2Achieved ? targetSuns : user2Suns) ? "text-yellow-500" : "text-gray-300"}`}
                                    animate={index < (user2Achieved ? targetSuns : user2Suns) ? {
                                        rotate: 360
                                    } : {}}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: index * 0.3
                                    }}>
                                    <i className="fas fa-sun"></i>
                                </motion.div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MotivationBox;