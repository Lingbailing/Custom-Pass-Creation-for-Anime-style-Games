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
});
export const runtimeImageMap = {}; // 运行时图片映射表
function replaceImage(originalSrc, newSrc) {
  runtimeImageMap[originalSrc] = newSrc;
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
  });
}
// 是否显示明日方舟 Logo（切换为单 checkbox）
const logoToggle = document.getElementById('toggleLogo');
if (logoToggle) {
  // 初始化状态
  const deco = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
  if (deco && deco.children) {
    const mrfz = deco.children.find(ch => ch.id === 'mrfz_logo');
    if (mrfz) logoToggle.checked = mrfz.visible;
  }
  
  logoToggle.addEventListener('change', () => {
    const deco = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
    if (deco && deco.children) {
      const mrfz = deco.children.find(ch => ch.id === 'mrfz_logo');
      if (mrfz) mrfz.visible = logoToggle.checked;
    }
  });
}

// 处理 Logo 上传
const logoUpload = document.getElementById('logoUpload');
if (logoUpload) {
  logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // 替换默认的 logo 图片路径映射
    replaceImage("assets/layers/front/mrfz logo.png", url);
    // 确保 logo 可见
    if (logoToggle && !logoToggle.checked) {
      logoToggle.checked = true;
      // 触发 change 事件以更新模板状态
      logoToggle.dispatchEvent(new Event('change'));
    }
  });
}

// 是否显示切割线（切换为单 checkbox）
const cutToggle = document.getElementById('toggleCut');
if (cutToggle) {
  // 初始化状态
  const cuttingLine = template.layers[0].children[0]; // id: cutting_line
  if (cuttingLine) cutToggle.checked = cuttingLine.visible;

  cutToggle.addEventListener('change', () => {
    template.layers[0].children[0].visible = cutToggle.checked;
  });
}

// ==== Barcode generation (custom) ====
const createBarcodeBtn = document.getElementById('createBarcode');
const removeBarcodeBtn = document.getElementById('removeBarcode');
const barcodeDataInput = document.getElementById('barcodeData');
const barcodeWidthInput = document.getElementById('barcodeWidth');
const barcodeHeightInput = document.getElementById('barcodeHeight');
const barcodePosXInput = document.getElementById('barcodePosX');
const barcodePosYInput = document.getElementById('barcodePosY');
const barcodeBarWidthInput = document.getElementById('barcodeBarWidth');
const barcodeBarColorInput = document.getElementById('barcodeBarColor');
const barcodeTransparentCheckbox = document.getElementById('barcodeTransparent');

// keep track of whether we've overridden frame images so we can restore
const originalFrameMap = {};

function drawBarcodeCanvas(text, width, height, barWidth, barColor = '#000000', background = 'transparent') {
  const canvas = document.createElement('canvas');
  // JsBarcode will draw to canvas; set reasonable base dimensions
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');
  // clear background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  try {
    const JB = window.JsBarcode || JsBarcode;
    JB(canvas, String(text || ''), {
      format: 'CODE128',
      width: Math.max(1, barWidth),
      height: Math.max(1, height),
      displayValue: false,
      margin: 0,
      lineColor: barColor || '#000000',
      background: background === 'transparent' ? undefined : background
    });
  } catch (err) {
    console.warn('JsBarcode not available or failed, fallback to empty canvas', err);
  }
  // rotate 90deg clockwise
  const rotated = document.createElement('canvas');
  rotated.width = canvas.height; // new width = old height
  rotated.height = canvas.width; // new height = old width
  const rctx = rotated.getContext('2d');
  rctx.clearRect(0,0,rotated.width, rotated.height);
  // translate to center and rotate 90deg
  rctx.translate(rotated.width / 2, rotated.height / 2);
  rctx.rotate(Math.PI / 2);
  rctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return rotated;
}

function canvasToDataURL(canvas) {
  return canvas.toDataURL('image/png');
}

function createMaskFromBarcodeCanvas(barcodeCanvas, threshold = 128) {
  const w = barcodeCanvas.width, h = barcodeCanvas.height;
  const ctx = barcodeCanvas.getContext('2d');
  const img = ctx.getImageData(0,0,w,h);
  const mask = document.createElement('canvas');
  mask.width = w; mask.height = h;
  const mctx = mask.getContext('2d');
  const out = mctx.createImageData(w,h);
  for (let i=0;i<img.data.length;i+=4) {
    const r = img.data[i], g = img.data[i+1], b = img.data[i+2], a = img.data[i+3];
    // brightness
    const bright = 0.299*r + 0.587*g + 0.114*b;
    if (a > 0 && bright < threshold) {
      // bar pixel -> opaque white
      out.data[i] = 255; out.data[i+1] = 255; out.data[i+2] = 255; out.data[i+3] = 255;
    } else {
      // transparent
      out.data[i] = 0; out.data[i+1] = 0; out.data[i+2] = 0; out.data[i+3] = 0;
    }
  }
  mctx.putImageData(out, 0, 0);
  return mask;
}

async function punchHolesInFrame(frameSrc, maskCanvas, x = 0, y = 700) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const cctx = c.getContext('2d');
      cctx.drawImage(img, 0, 0);
      // use mask to clear areas of frame where mask opaque
      cctx.globalCompositeOperation = 'destination-out';
      cctx.drawImage(maskCanvas, x, y);
      cctx.globalCompositeOperation = 'source-over';
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = frameSrc;
  });
}

function insertBarcodeIntoTemplate(dataUrl, width, height, x, y) {
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
    layout: { left: x, top: y }
  });

  // also insert barcode into back at symmetric position (ensure removed first)
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
      layout: { left: 590 - height - x, top: y }
    });
  }
}

async function updateBarcode() {
  const text = barcodeDataInput.value || '';
  const width = Number(barcodeWidthInput.value) || 590;
  const height = Number(barcodeHeightInput.value) || 80;
  const posX = Number(barcodePosXInput.value) || 0;
  const posY = Number(barcodePosYInput.value) || 700;
  const barWidth = parseFloat(barcodeBarWidthInput.value) || 3.5;
  const barColor = (barcodeBarColorInput && barcodeBarColorInput.value) || '#000000';
  const transparentBars = !!(barcodeTransparentCheckbox && barcodeTransparentCheckbox.checked);

  const rotated = drawBarcodeCanvas(text, width, height, barWidth, barColor, transparentBars ? 'transparent' : '#ffffff');
  if (transparentBars) {
    // create mask from barcode (bars opaque)
    const mask = createMaskFromBarcodeCanvas(rotated);
    // frame sources in template/back
    const decoGroup = template.layers[0].children.find(c=>c.id==='group_decorative_patterns');
    const frontFrameSrc = decoGroup && decoGroup.children ? decoGroup.children.find(ch=>ch.id==='frame')?.src : null;
    const backFrameSrc = back.layers.find(l=>l.id==='frame')?.src;
    // store originals if not stored
    if (frontFrameSrc && !(frontFrameSrc in originalFrameMap)) originalFrameMap[frontFrameSrc] = null;
    if (backFrameSrc && !(backFrameSrc in originalFrameMap)) originalFrameMap[backFrameSrc] = null;
    // punch holes and set runtimeImageMap to modified frames
    if (frontFrameSrc) {
      const dataUrlF = await punchHolesInFrame(frontFrameSrc, mask, posX, posY);
      if (dataUrlF) runtimeImageMap[frontFrameSrc] = dataUrlF;
    }
    if (backFrameSrc) {
      const dataUrlB = await punchHolesInFrame(backFrameSrc, mask, 590 - height - posX, posY);
      if (dataUrlB) runtimeImageMap[backFrameSrc] = dataUrlB;
    }
    // remove any overlay barcode images
    const group = template.layers[0].children.find(c => c.id === 'group_decorative_patterns');
    if (group) {
      for (let i = group.children.length - 1; i >= 0; i--) {
        if (group.children[i].id === 'barcode_custom') group.children.splice(i, 1);
      }
    }
    if (back && back.layers) {
      for (let i = back.layers.length - 1; i >= 0; i--) {
        if (back.layers[i].id === 'barcode_custom_back') back.layers.splice(i, 1);
      }
    }
  } else {
    // non-transparent: produce colored barcode and insert as image; also restore any modified frames
    const dataUrl = canvasToDataURL(rotated);
    // restore frames if we previously modified them
    Object.keys(originalFrameMap).forEach(k => { if (runtimeImageMap[k]) delete runtimeImageMap[k]; });
    insertBarcodeIntoTemplate(dataUrl, width, height, posX, posY);
  }
  // 自动刷新画布
  readTemplate(template, "ctx01");
  readTemplate(back, "ctx02");
}

createBarcodeBtn && createBarcodeBtn.addEventListener('click', updateBarcode);
[barcodeDataInput, barcodeWidthInput, barcodeHeightInput, barcodePosXInput, barcodePosYInput, barcodeBarWidthInput, barcodeBarColorInput, barcodeTransparentCheckbox].forEach(el => {
  if (el) el.addEventListener('input', updateBarcode);
  if (el && el.type === 'checkbox') el.addEventListener('change', updateBarcode);
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
  // restore frames if modified
  const decoGroup = template.layers[0].children.find(c=>c.id==='group_decorative_patterns');
  const frontFrameSrc = decoGroup && decoGroup.children ? decoGroup.children.find(ch=>ch.id==='frame')?.src : null;
  const backFrameSrc = back.layers.find(l=>l.id==='frame')?.src;
  if (frontFrameSrc && runtimeImageMap[frontFrameSrc]) delete runtimeImageMap[frontFrameSrc];
  if (backFrameSrc && runtimeImageMap[backFrameSrc]) delete runtimeImageMap[backFrameSrc];
  // clear originalFrameMap entries
  if (frontFrameSrc && (frontFrameSrc in originalFrameMap)) delete originalFrameMap[frontFrameSrc];
  if (backFrameSrc && (backFrameSrc in originalFrameMap)) delete originalFrameMap[backFrameSrc];
  // 自动刷新画布
  readTemplate(template, "ctx01");
  readTemplate(back, "ctx02");
});
