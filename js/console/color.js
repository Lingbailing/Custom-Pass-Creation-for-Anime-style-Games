/**
 * 颜色控制模块
 * 负责处理通行证的颜色相关功能
 * 
 * @author Lingbailing
 * @description 管理渐变色、挡板颜色、背影颜色等视觉样式
 */

import { back, template } from "../../assets/template.js";
import { readTemplate } from "../parser/main.js";

/**
 * 渐变色显示/隐藏切换
 * 控制正面渐变色图层的可见性
 */
const jianBianToggle = document.getElementById('toggleJianBian');
if (jianBianToggle) {
  jianBianToggle.addEventListener('change', () => {
    template.layers[0].children[3].children[2].visible = jianBianToggle.checked;
    readTemplate(template, 'ctx01');
  });
}

/**
 * 渐变色颜色选择器
 * 修改渐变色的颜色值
 */
const jianBian = document.getElementById("jian_bian");
jianBian.addEventListener("input", (e) => {
  template.layers[0].children[3].children[2].color = e.target.value;
});

/**
 * 挡板显示/隐藏切换
 * 同时控制正面和背面挡板的可见性
 */
const dangBanToggle = document.getElementById('toggleDangBan');
if (dangBanToggle) {
  dangBanToggle.addEventListener('change', () => {
    template.layers[1].children[1].visible = dangBanToggle.checked;
    back.layers[2].visible = dangBanToggle.checked;
    readTemplate(template, 'ctx01');
    readTemplate(back, 'ctx02');
  });
}

/**
 * 挡板颜色选择器
 * 同时修改正面和背面挡板的颜色
 */
const dangBan = document.getElementById("dang_ban");
dangBan.addEventListener("input", (e) => {
  template.layers[1].children[1].color = e.target.value;
  back.layers[2].color = e.target.value;
});

/**
 * 背影颜色选择器
 * 修改背面角色背影的颜色
 */
const beiYing = document.getElementById("bei_ying");

/**
 * 辅助函数：根据ID在图层树中查找图层
 * @param {Array} layers - 图层数组
 * @param {string} id - 要查找的图层ID
 * @returns {Object|null} 找到的图层对象或null
 */
function findLayerById(layers, id) {
  for (const lay of layers) {
    if (!lay) continue;
    if (lay.id === id || lay.name === id) return lay;
    if (lay.children && lay.children.length) {
      const found = findLayerById(lay.children, id);
      if (found) return found;
    }
  }
  return null;
}

if (beiYing) {
  beiYing.addEventListener("input", (e) => {
    const target = findLayerById(back.layers, 'tu_pian_back') || findLayerById(back.layers, 'tu_pian');
    if (target) target.color = e.target.value;
    // 立即重绘背面
    readTemplate(back, "ctx02");
  });
}
