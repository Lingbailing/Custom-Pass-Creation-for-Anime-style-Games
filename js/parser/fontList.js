/**
 * 字体列表配置模块
 * 定义通行证中所有可用字体及其对应的字体文件路径
 * 
 * @author Lingbailing
 * @description 字体资源映射表,用于动态加载和应用字体
 */

/**
 * 字体列表对象
 * 键: 字体家族名称
 * 值: 包含字体样式(Regular/Bold/Medium等)及其文件路径的对象
 * 
 * @type {Object.<string, Object.<string, string>>}
 * @example
 * {
 *   "字体名称": {
 *     "Regular": "字体文件路径",
 *     "Bold": "粗体文件路径"
 *   }
 * }
 */
export const fontList = {
  "Bebas Neue": {
    "Regular": "./assets/fonts/BebasNeue.otf",
  },
  "Noto Sans S Chinese": {
    "Medium": "./assets/fonts/NotoSansHans-Medium.otf",
    "Bold": "./assets/fonts/NotoSansHans-Bold.otf",
  },
  "Noto Sans": {
    "Regular": "./assets/fonts/NotoSans-Regular-2.ttf",
  },
  "Myriad Pro": {
    "Bold": "./assets/fonts/MyriadPro-Regular-14.otf",
  },
};
