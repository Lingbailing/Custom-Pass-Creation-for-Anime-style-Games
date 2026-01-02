// js / console / image.js
/**
 * 这个 js 用来修改图片
 */
import {back, template} from "../../assets/template.js";
import {readTemplate} from "../parser/main.js";
// 修改人物图片
const imageUpload = document.getElementById("imageUpload");
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  replaceImage("assets/layers/tuPian.png", url);
  setTimeout(() => {
    readTemplate(template, "ctx01");
    readTemplate(back, "ctx02");
  }, 200);
});
export const runtimeImageMap = {}; // 运行时图片映射表
function replaceImage(originalSrc, newSrc) {
  runtimeImageMap[originalSrc] = newSrc;
  readTemplate(template, "ctx01");
  readTemplate(back, "ctx02");
}
// 人物移动
export const runtimeLayerState = {
  tu_pian: {
    x: null,
    y: null,
    scale: 1
  }
}
// 选择职业
const seProfession = document.getElementById("seProfession");
const dataProfession = template.layers[0].children[2].children;
dataProfession.forEach(item => {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.name;
  seProfession.appendChild(option);
});
// add custom option
{
  const option = document.createElement("option");
  option.value = 'custom_profession';
  option.textContent = '自定义...';
  seProfession.appendChild(option);
}
seProfession.addEventListener("change", function () {
  const seValue = this.value;
  template.layers[0].children[2].visible = seValue !== "null";
  for (let i = 0; i < template.layers[0].children[2].children.length; i++)
    template.layers[0].children[2].children[i].visible = seValue === template.layers[0].children[2].children[i].id;
  readTemplate(template, "ctx01");
  // show upload control when custom selected
  const profLabel = document.getElementById('professionUploadLabel');
  const profInput = document.getElementById('professionUpload');
  if (seValue === 'custom_profession') {
    if (profLabel) profLabel.style.display = '';
    if (profInput) profInput.style.display = '';
  } else {
    if (profLabel) profLabel.style.display = 'none';
    if (profInput) profInput.style.display = 'none';
  }
});
// 选择阵营
const seFaction = document.getElementById("seFaction");
const dataFaction = template.layers[1].children[0].children;
dataFaction.forEach(item => {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.name;
  seFaction.appendChild(option);
});
// add custom option
{
  const option = document.createElement("option");
  option.value = 'custom_faction';
  option.textContent = '自定义...';
  seFaction.appendChild(option);
}
seFaction.addEventListener("change", function () {
  const seValue = this.value;
  template.layers[1].children[0].visible = seValue !== "null";
  for (let i = 0; i < template.layers[1].children[0].children.length; i++)
    template.layers[1].children[0].children[i].visible = seValue === template.layers[1].children[0].children[i].id;
  readTemplate(template, "ctx01");
  // show upload control when custom selected
  const facLabel = document.getElementById('factionUploadLabel');
  const facInput = document.getElementById('factionUpload');
  if (seValue === 'custom_faction') {
    if (facLabel) facLabel.style.display = '';
    if (facInput) facInput.style.display = '';
  } else {
    if (facLabel) facLabel.style.display = 'none';
    if (facInput) facInput.style.display = 'none';
  }
});

// handle uploaded profession icon
const professionUpload = document.getElementById('professionUpload');
if (professionUpload) {
  professionUpload.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const group = template.layers[0].children[2];
    // remove existing custom if any
    for (let i = group.children.length-1; i >=0; i--) {
      if (group.children[i].id === 'custom_profession') group.children.splice(i,1);
    }
    // add custom child
    group.children.push({
      id: 'custom_profession',
      type: 'image',
      visible: true,
      opacity: 100,
      name: '自定义',
      src: url,
      layout: { left: 0, top: 0 }
    });
    // hide others
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].visible = group.children[i].id === 'custom_profession';
    }
    template.layers[0].children[2].visible = true;
    readTemplate(template, 'ctx01');
  });
}

// handle uploaded faction icon
const factionUpload = document.getElementById('factionUpload');
if (factionUpload) {
  factionUpload.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const group = template.layers[1].children[0];
    // remove existing custom if any
    for (let i = group.children.length-1; i >=0; i--) {
      if (group.children[i].id === 'custom_faction') group.children.splice(i,1);
    }
    // add custom child
    group.children.push({
      id: 'custom_faction',
      type: 'image',
      visible: true,
      opacity: 100,
      name: '自定义',
      src: url,
      layout: { left: 0, top: 0 }
    });
    // hide others
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].visible = group.children[i].id === 'custom_faction';
    }
    template.layers[1].children[0].visible = true;
    readTemplate(template, 'ctx01');
  });
}
// 是否显示明日方舟 Logo
const logo = document.querySelectorAll("input[name='logoVisible']");
logo.forEach(radio => {
  radio.addEventListener("change", () => {
    // find decorative patterns group and the mrfz_logo child by id to avoid index fragility
    const deco = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
    if (deco && deco.children) {
      const mrfz = deco.children.find(ch => ch.id === 'mrfz_logo');
      if (mrfz) mrfz.visible = radio.value === 't';
    }
    readTemplate(template, "ctx01");
  });
});
// 是否显示切割线
const cut = document.querySelectorAll("input[name='cutVisible']");
cut.forEach(radio => {
  radio.addEventListener("change", () => {
    template.layers[0].children[0].visible = radio.value === "t";
    readTemplate(template, "ctx01");
  });
});

// ==== Barcode generation (custom) ====
const createBarcodeBtn = document.getElementById('createBarcode');
const removeBarcodeBtn = document.getElementById('removeBarcode');
const barcodeDataInput = document.getElementById('barcodeData');
const barcodeWidthInput = document.getElementById('barcodeWidth');
const barcodeHeightInput = document.getElementById('barcodeHeight');
const barcodeBarWidthInput = document.getElementById('barcodeBarWidth');

function drawBarcodeToDataURL(text, width, height, barWidth) {
  const canvas = document.createElement('canvas');
  // JsBarcode will draw to canvas; set reasonable base dimensions
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  try {
    const JB = window.JsBarcode || JsBarcode;
    JB(canvas, String(text || ''), {
      format: 'CODE128',
      width: Math.max(1, barWidth),
      height: Math.max(1, height),
      displayValue: false,
      margin: 0
    });
  } catch (err) {
    console.warn('JsBarcode not available or failed, fallback to empty canvas', err);
  }
  // rotate 90deg clockwise (向下翻转)
  const rotated = document.createElement('canvas');
  rotated.width = canvas.height; // new width = old height
  rotated.height = canvas.width; // new height = old width
  const rctx = rotated.getContext('2d');
  // fill background
  rctx.fillStyle = '#ffffff';
  rctx.fillRect(0,0,rotated.width, rotated.height);
  // translate to center and rotate 90deg
  rctx.translate(rotated.width / 2, rotated.height / 2);
  rctx.rotate(Math.PI / 2);
  rctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return rotated.toDataURL('image/png');
}

function insertBarcodeIntoTemplate(dataUrl, width, height) {
  // find decorative patterns group under front
  const group = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
  if (!group) {
    console.warn('找不到 group_decorative_patterns，无法插入条形码');
    return;
  }
  // remove existing barcode_custom if exists
  for (let i = group.children.length - 1; i >= 0; i--) {
    if (group.children[i].id === 'barcode_custom') group.children.splice(i, 1);
  }
  // insert new image child at beginning so it's rendered on top (front)
  group.children.unshift({
    id: 'barcode_custom',
    type: 'image',
    visible: true,
    opacity: 100,
    name: '自定义条形码',
    src: dataUrl,
    layout: { left: 0, top: 700 }
  });

  // also insert barcode into back at x=500,y=700 (ensure removed first)
  if (back && back.layers) {
    // remove existing back barcode if any
    for (let i = back.layers.length - 1; i >= 0; i--) {
      if (back.layers[i].id === 'barcode_custom_back') back.layers.splice(i, 1);
    }
    // insert at beginning so it renders on top
    back.layers.unshift({
      id: 'barcode_custom_back',
      type: 'image',
      visible: true,
      opacity: 100,
      name: '自定义条形码(背面)',
      src: dataUrl,
      layout: { left: 510, top: 700 }
    });
  }
}

createBarcodeBtn && createBarcodeBtn.addEventListener('click', () => {
  const text = barcodeDataInput.value || '';
  const width = Number(barcodeWidthInput.value) || 590;
  const height = Number(barcodeHeightInput.value) || 80;
  const barWidth = parseFloat(barcodeBarWidthInput.value) || 3.5;
  const dataUrl = drawBarcodeToDataURL(text, width, height, barWidth);
  insertBarcodeIntoTemplate(dataUrl, width, height);
  // ensure runtime image mapping not needed since src is dataURL
  setTimeout(() => {
    readTemplate(template, 'ctx01');
    readTemplate(back, 'ctx02');
  }, 50);
});

removeBarcodeBtn && removeBarcodeBtn.addEventListener('click', () => {
  const group = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
  if (group) {
    for (let i = group.children.length - 1; i >= 0; i--) {
      if (group.children[i].id === 'barcode_custom') group.children.splice(i, 1);
    }
  }
  // remove back barcode
  if (back && back.layers) {
    for (let i = back.layers.length - 1; i >= 0; i--) {
      if (back.layers[i].id === 'barcode_custom_back') back.layers.splice(i, 1);
    }
  }
  readTemplate(template, 'ctx01');
  readTemplate(back, 'ctx02');
});
