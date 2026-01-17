/**
 * 主入口文件
 * 负责导入所有模块并初始化应用程序
 * 
 * @author Lingbailing
 * @description 通行证自定义工具 - 主程序入口
 */

// 导入模板数据
import "./assets/template.js";

// 导入导出功能模块
import "./js/export.js";

// 导入更新和刷新功能模块
import "./js/update.js";

// 导入模板解析器
import "./js/parser/main.js";

// 导入控制台交互模块
import "./js/console/main.js";

/**
 * 联系作者按钮点击事件
 * 显示作者联系信息
 */
document.getElementById("lianXi").onclick = () => {
  alert(
    "- 原作者 QQ 3412735994 -\n" +
    "- 原作者交流群 1056969651 -\n" +
    "- 修改作者: 你联系个蛋呀，我不会呀 -\n" +
    "- 如有侵权请联系删除 -"
  );
};

/**
 * GitHub按钮点击事件
 * 在新标签页打开项目GitHub仓库
 */
document.getElementById("github").onclick = () => {
  window.open("https://github.com/Lingbailing/Custom-Pass-Creation-for-Anime-style-Games", "_blank");
};

console.log("✓ 主程序加载完成");
