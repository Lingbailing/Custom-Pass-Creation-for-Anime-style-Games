// js / console / color.js
/**
 * 这个用来修改颜色
 */
import {back, template} from "../../assets/template.js";
import {readTemplate} from "../parser/main.js";
// 是否显示渐变色（切换为单 checkbox）
const jianBianToggle = document.getElementById('toggleJianBian');
if (jianBianToggle) {
  jianBianToggle.addEventListener('change', () => {
    template.layers[0].children[3].children[2].visible = jianBianToggle.checked;
    readTemplate(template, 'ctx01');
  });
}
// 渐变色颜色
const jianBian = document.getElementById("jian_bian");
jianBian.addEventListener("input", (e) => {
  template.layers[0].children[3].children[2].color = e.target.value;
  // readTemplate(template, "ctx01");
});
// 是否显示挡板（切换为单 checkbox）
const dangBanToggle = document.getElementById('toggleDangBan');
if (dangBanToggle) {
  dangBanToggle.addEventListener('change', () => {
    template.layers[1].children[1].visible = dangBanToggle.checked;
    back.layers[2].visible = dangBanToggle.checked;
    readTemplate(template, 'ctx01');
    readTemplate(back, 'ctx02');
  });
}
// 挡板颜色
const dangBan = document.getElementById("dang_ban");
dangBan.addEventListener("input", (e) => {
  template.layers[1].children[1].color = e.target.value;
  back.layers[2].color = e.target.value;
  // readTemplate(template, "ctx01");
  // readTemplate(back, "ctx02");
});
// 背影颜色
const beiYing = document.getElementById("bei_ying");
// helper - find layer by id in back/template
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