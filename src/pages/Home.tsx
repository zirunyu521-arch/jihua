import { motion } from "framer-motion";
import { useState } from "react";
import { usePlanTracker } from "@/hooks/usePlanTracker";
import PersonPlanSection from "@/components/PersonPlanSection";
import MotivationBox from "@/components/MotivationBox";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
const TARGET_SUNS = 3;

export default function Home() {
    const {
        user1,
        user2,
        addPlanItem,
        togglePlanItem,
        deletePlanItem,
        addStar,
        getTotalSuns,
        canAddStarToday,
        generateShareLink,
        checkForUpdates,
        isSyncing,
        lastSyncTime,
        documentId,
        createNewDocument,
        isRealTimeSyncSupported
    } = usePlanTracker();

    const {
        theme,
        toggleTheme
    } = useTheme();

    // 背景图片状态管理
    const [backgroundImage, setBackgroundImage] = useState(() => {
        const savedBg = localStorage.getItem('backgroundImage');
        return savedBg || "https://space-static.coze.site/coze_space/7584441734518014271/upload/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251212084458_492_195_4608x3456.jpg?sign=1768484021-3573420cd9-0-f6ada3539e5a150ded668019e6e5292f34cec1bb1b61ee7e50071951283f7fec";
    });

    // 系统预设背景
    const presetBackgrounds = [
        "https://space-static.coze.site/coze_space/7584441734518014271/upload/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251212084458_492_195_4608x3456.jpg?sign=1768484021-3573420cd9-0-f6ada3539e5a150ded668019e6e5292f34cec1bb1b61ee7e50071951283f7fec",
        "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=romantic%20sunset%20at%20beach%2C%20warm%20colors&sign=6d54b6e0606ecfcf7868b2adf3d9a96a",
        "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20path%20in%20spring%2C%20green%20nature&sign=6817d7cd2ffb4e28e6528b2c49322ad3",
        "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20night%20view%2C%20lights%2C%20modern&sign=77e80ed2be7c590846dbfdee2309833f"
    ];

    // 更换背景
    const changeBackground = (imageUrl: string) => {
        setBackgroundImage(imageUrl);
        localStorage.setItem('backgroundImage', imageUrl);
    };

    // 上传自定义背景
    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                changeBackground(imageUrl);
                toast('背景图片上传成功！');
            };
            reader.readAsDataURL(file);
        }
    };

    const totalSuns = getTotalSuns();

     const formatLastSyncTime = () => {
        const now = Date.now();
        const diff = now - lastSyncTime;
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) {
            return `${seconds}s`;
        }

        const minutes = Math.floor(seconds / 60);
        return `${minutes}m`;
    };

    // 格式化当前日期
    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 relative pb-24"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%"
            }}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: -20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}
                className="max-w-7xl mx-auto mb-6">
             <div className="relative mb-1">
                <div className="text-center">
                    <h1
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">双人计划与进度追踪
                    </h1>
                    <div className="mt-1">
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {getCurrentDate()}
                        </span>
                    </div>
                </div>
                <div className="absolute right-0 top-0 flex justify-end gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                    </button>
                    <button
                        onClick={checkForUpdates}
                        disabled={isSyncing}
                        className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors relative">
                        {isSyncing ? <i className="fas fa-sync-alt fa-spin"></i> : <i className="fas fa-sync-alt"></i>}
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {formatLastSyncTime()}
                        </span>
                     </button>
                     <button
                        onClick={generateShareLink}
                        className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <i className="fas fa-share-alt"></i>
                    </button>
                    {/* 实时同步切换按钮 */}
                    {!documentId && (
                      <button
                        onClick={createNewDocument}
                        className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                      </button>
                    )}
                    {/* 背景选择下拉菜单 */}
                    <div className="relative group">
                        <button className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                            <i className="fas fa-image"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div className="p-2">
                                <h4 className="font-medium text-sm mb-2">选择背景</h4>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {presetBackgrounds.map((bg, index) => (
                                        <button
                                            key={index}
                                            onClick={() => changeBackground(bg)}
                                            className="h-16 rounded overflow-hidden"
                                            style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}
                                        />
                                    ))}
                                </div>
                                <div className="border-t pt-2">
                                    <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                                        <i className="fas fa-upload mr-2"></i> 上传图片
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleBackgroundUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-1">一起制定计划，共同成长进步！
            </p>
            {/* 实时同步状态显示 */}
            {documentId && (
              <div className="text-center mt-2 text-sm text-green-600 dark:text-green-400">
                <i className="fas fa-sync-alt fa-spin mr-1"></i>
                已启用实时数据同步
              </div>
            )}
            </motion.div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -20
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2
                    }}
                    className="h-[calc(100vh-180px)]">
                    <PersonPlanSection
                        user={user1}
                        userId="user1"
                        addPlanItem={addPlanItem}
                        togglePlanItem={togglePlanItem}
                        deletePlanItem={deletePlanItem}
                        addStar={addStar}
                        canAddStarToday={canAddStarToday} />
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 20
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.4
                    }}
                    className="h-[calc(100vh-180px)]">
                    <PersonPlanSection
                        user={user2}
                        userId="user2"
                        addPlanItem={addPlanItem}
                        togglePlanItem={togglePlanItem}
                        deletePlanItem={deletePlanItem}
                        addStar={addStar}
                        canAddStarToday={canAddStarToday} />
                </motion.div>
            </div>
              <MotivationBox user1Suns={user1.suns} user2Suns={user2.suns} targetSuns={TARGET_SUNS} />
              
              {/* 在Netlify环境中显示额外的同步提示 */}
              {window.location.hostname.endsWith('netlify.app') && (
                <div className="fixed bottom-24 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400">
                  提示：数据将通过URL实时同步，请确保两人使用相同的链接
                </div>
              )}
            </div>
        );
    }