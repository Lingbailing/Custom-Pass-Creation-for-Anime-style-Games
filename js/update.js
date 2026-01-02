/**
 * 更新和刷新功能模块
 * 负责处理画布刷新和页面重置功能
 * 
 * @author Lingbailing
 * @description 提供刷新和重置按钮的事件处理
 */

import { readTemplate } from "./parser/main.js";
import { back, template } from "../assets/template.js";

/**
 * 刷新按钮点击事件
 * 重新渲染正面和背面画布
 */
document.getElementById("shuaXin").onclick = () => {
  readTemplate(template, "ctx01");
  readTemplate(back, "ctx02");
};

/**
 * 重置按钮点击事件
 * 重新加载整个页面,恢复到初始状态
 */
document.getElementById("chongZhi").onclick = () => {
  location.reload();
};

/**
 * 页面加载完成事件
 * 延迟渲染画布以确保所有资源加载完成
 */
window.onload = () => {
  setTimeout(() => {
    readTemplate(template, "ctx01");
    readTemplate(back, "ctx02");
    console.log("✓ 画布初始化完成");
  }, 200);
};
