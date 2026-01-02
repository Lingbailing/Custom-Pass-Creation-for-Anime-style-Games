// js / console / text.js
import {back, template} from "../../assets/template.js";
import {readTemplate} from "../parser/main.js";
import {fontList} from "../parser/fontList.js";

const leftTitle = document.getElementById("left_title");
const name1 = document.getElementById("name1");
// const name2 = document.getElementById("name2");
const arknights1 = document.getElementById("arknights1");
const staff = document.getElementById("staff");
const xz1 = document.getElementById("xz1");
const xz2 = document.getElementById("xz2");
const xz3 = document.getElementById("xz3");
const xz4 = document.getElementById("xz4");
const xzb1 = document.getElementById("xzb1");
const xzb2 = document.getElementById("xzb2");
const xzb3 = document.getElementById("xzb3");
const xzb4 = document.getElementById("xzb4");
const fieldSelect = document.getElementById("fieldSelect");
const posLeft = document.getElementById("posLeft");
const posTop = document.getElementById("posTop");
const posRotate = document.getElementById("posRotate");
const fontSelect = document.getElementById("fontSelect");
const fontUpload = document.getElementById("fontUpload");
const applyStyle = document.getElementById("applyStyle");
const fontStyleSelect = document.getElementById('fontStyleSelect');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const fontTrackingInput = document.getElementById('fontTracking');
const advancedToggle = document.getElementById('advancedToggle');
const advancedPanel = document.getElementById('advancedPanel');
const fieldText = document.getElementById("fieldText");
// track fields locked by advanced editor (store composite key owner::id)
const advancedLockedFields = new Set();

// map composite node keys (owner::id) to basic input elements
const basicInputsByNodeId = {};
// helper to register both template/back variants
function registerBasicInputForId(id, inputsForTemplate = [], inputsForBack = []) {
  basicInputsByNodeId[`template::${id}`] = inputsForTemplate.filter(Boolean);
  basicInputsByNodeId[`back::${id}`] = inputsForBack.filter(Boolean);
}

// register known mappings (front/back)
registerBasicInputForId('left_title', [leftTitle], [leftTitle]);
registerBasicInputForId('name1', [name1], [null]);
registerBasicInputForId('ARKNIGHTS - LT40', [arknights1], [null]);
registerBasicInputForId('staff', [staff], [null]);
registerBasicInputForId('operator_of_rhodes_island', [xz1], [xzb1]);
registerBasicInputForId('profession', [xz2], [xzb2]);
registerBasicInputForId('@ARKNIGHTS', [xz3], [null]);
registerBasicInputForId('RHODES ISLAND INC.', [xz4], [xzb4]);
registerBasicInputForId('©HYPERGRYPH', [null], [xzb3]);

function lockNodeId(nodeKey) {
  if (!nodeKey) return;
  if (advancedLockedFields.has(nodeKey)) return;
  advancedLockedFields.add(nodeKey);
  const inputs = basicInputsByNodeId[nodeKey] || [];
  inputs.forEach(el => {
    if (!el) return;
    try { el.disabled = true; el.classList.add('locked-input'); el.title = '已通过高级编辑锁定，无法通过基础面板修改'; } catch (e) {}
  });
}
leftTitle.value = template.layers[0].children[1].children[0].text;
name1.value = template.layers[0].children[1].children[1].text;
// name2.value = template.layers[0].children[1].children[1].text;
arknights1.value = template.layers[0].children[1].children[2].text;
staff.value = template.layers[0].children[1].children[3].text;
xz1.value = template.layers[0].children[1].children[4].text;
xz2.value = template.layers[0].children[1].children[5].text;
xz3.value = template.layers[0].children[1].children[6].text;
xz4.value = template.layers[0].children[1].children[7].text;
xzb1.value = back.layers[0].children[2].text;
xzb2.value = back.layers[0].children[3].text;
xzb3.value = back.layers[0].children[4].text;
xzb4.value = back.layers[0].children[1].text;
leftTitle.addEventListener("input", () => {
  template.layers[0].children[1].children[0].text = leftTitle.value;
  back.layers[0].children[0].text = leftTitle.value;
  // readTemplate(template, "ctx01");
  // readTemplate(back, "ctx02");
});
name1.addEventListener("input", () => {
  template.layers[0].children[1].children[1].text = name1.value;
  // readTemplate(template, "ctx01");
});
// name2.addEventListener("input", () => {
//   template.layers[0].children[1].children[1].text = name2.value;
//   // readTemplate(template, "ctx01");
// });
arknights1.addEventListener("input", () => {
  template.layers[0].children[1].children[2].text = arknights1.value;
  // readTemplate(template, "ctx01");
});
staff.addEventListener("input", () => {
  template.layers[0].children[1].children[3].text = staff.value;
  // readTemplate(template, "ctx01");
});
xz1.addEventListener("input", () => {
  template.layers[0].children[1].children[4].text = xz1.value;
  // readTemplate(template, "ctx01");
});
xz2.addEventListener("input", () => {
  template.layers[0].children[1].children[5].text = xz2.value;
  // readTemplate(template, "ctx01");
});
xz3.addEventListener("input", () => {
  template.layers[0].children[1].children[6].text = xz3.value;
  // readTemplate(template, "ctx01");
});
xz4.addEventListener("input", () => {
  template.layers[0].children[1].children[7].text = xz4.value;
  // readTemplate(template, "ctx01");
});
xzb1.addEventListener("input", () => {
  back.layers[0].children[2].text = xzb1.value;
});
xzb2.addEventListener("input", () => {
  back.layers[0].children[3].text = xzb2.value;
});
xzb3.addEventListener("input", () => {
  back.layers[0].children[4].text = xzb3.value;
});
xzb4.addEventListener("input", () => {
  back.layers[0].children[1].text = xzb4.value;
});

// helper: traverse template/back to find all text nodes
function collectTextNodes(root, list = [], owner = 'template') {
  if (!root) return list;
  if (Array.isArray(root)) {
    root.forEach(r => collectTextNodes(r, list, owner));
    return list;
  }
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (node.type === 'text') {
      list.push({id: node.id || node.name || '', node, owner});
    }
    if (node.children && node.children.length) {
      node.children.forEach(c => stack.push(c));
    }
  }
  return list;
}

// mapping from template node id/name to friendly display names
const fieldFriendlyNames = {
  'left_title': '主标题',
  'name1': '角色名',
  'ARKNIGHTS - LT40': '编号',
  'staff': 'STAFF',
  'operator_of_rhodes_island': '组织说明',
  'profession': '职业',
  '@ARKNIGHTS': '作者标签',
  'RHODES ISLAND INC.': '主标题（侧列）'
};

function findNodeById(compositeKey) {
  // compositeKey expected as 'owner::id' (owner = 'template' or 'back')
  if (!compositeKey) return null;
  const parts = String(compositeKey).split('::');
  if (parts.length === 2) {
    const owner = parts[0];
    const id = parts[1];
    if (owner === 'back') {
      const list = collectTextNodes(back.layers, [], 'back');
      const found = list.find(item => item.id === id);
      return found || null;
    } else {
      const list = collectTextNodes(template.layers, [], 'template');
      const found = list.find(item => item.id === id);
      return found || null;
    }
  }
  // fallback: search both
  const t = collectTextNodes(template.layers);
  const b = collectTextNodes(back.layers, [], 'back');
  const all = t.concat(b);
  return all.find(item => item.id === compositeKey) || null;
}

// populate field select with available text nodes
function populateFieldSelect() {
  const nodes = collectTextNodes(template.layers).concat(collectTextNodes(back.layers, [], 'back'));
  fieldSelect.innerHTML = '';
  nodes.forEach(n => {
    const opt = document.createElement('option');
    const owner = n.owner === 'back' ? 'back' : 'template';
    const key = `${owner}::${n.id}`;
    opt.value = key;
    const displayName = n.node.name || n.id || n.node.id || '(unnamed)';
    const preview = n.node.text ? String(n.node.text).slice(0, 30) : '';
    const friendly = fieldFriendlyNames[n.id] || fieldFriendlyNames[n.node.id] || displayName;
    const ownerLabel = owner === 'back' ? '背面' : '正面';
    opt.textContent = `${ownerLabel} · ${friendly}` + (preview ? ' — ' + preview : '');
    fieldSelect.appendChild(opt);
  });
}

// populate font select from fontList
function populateFontSelect() {
  fontSelect.innerHTML = '';
  Object.keys(fontList).forEach(family => {
    const opt = document.createElement('option');
    opt.value = family;
    opt.textContent = family;
    fontSelect.appendChild(opt);
  });
}

function populateFontStyleSelect(family) {
  fontStyleSelect.innerHTML = '';
  const styles = fontList[family] ? Object.keys(fontList[family]) : [];
  if (styles.length === 0) {
    const opt = document.createElement('option');
    opt.value = 'Regular';
    opt.textContent = 'Regular';
    fontStyleSelect.appendChild(opt);
    return;
  }
  styles.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    fontStyleSelect.appendChild(opt);
  });
}

// when field changes, show current values
fieldSelect.addEventListener('change', () => {
  const entry = findNodeById(fieldSelect.value);
  if (!entry) return;
  const node = entry.node;
  posLeft.value = (node.layout && typeof node.layout.left !== 'undefined') ? node.layout.left : '';
  posTop.value = (node.layout && typeof node.layout.top !== 'undefined') ? node.layout.top : '';
  posRotate.value = (node.layout && typeof node.layout.rotate !== 'undefined') ? node.layout.rotate : 0;
  fontSelect.value = (node.font && node.font.family) ? node.font.family : fontSelect.value;
  fieldText.value = node.text || '';
  // populate font style and other font-related controls
  const family = (node.font && node.font.family) ? node.font.family : fontSelect.value;
  populateFontStyleSelect(family);
  fontStyleSelect.value = (node.font && node.font.style) ? node.font.style : fontStyleSelect.value;
  fontSizeInput.value = (node.font && typeof node.font.size !== 'undefined') ? node.font.size : '';
  fontColorInput.value = (node.font && node.font.color) ? node.font.color : '#ffffff';
  fontTrackingInput.value = (node.font && typeof node.font.tracking !== 'undefined') ? node.font.tracking : 0;
});

// realtime update of selected node text
fieldText.addEventListener('input', () => {
  const id = fieldSelect.value;
  const entry = findNodeById(id);
  if (!entry) return;
  const node = entry.node;
  node.text = fieldText.value;
  // lock this node from basic edits
  lockNodeId(id);
  try {
    readTemplate(template, 'ctx01');
    readTemplate(back, 'ctx02');
  } catch (err) {
    // ignore if readTemplate unavailable
  }
});

// upload custom font and register via FontFace
fontUpload.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const name = file.name.replace(/\.[^.]+$/, '');
  try {
    const data = await file.arrayBuffer();
    // register font and set a blob url in fontList for later loading
    const blobUrl = URL.createObjectURL(new Blob([data]));
    const styleName = 'Regular';
    const fontKey = `${name}::${styleName}`;
    const ff = new FontFace(fontKey, `url(${blobUrl})`);
    await ff.load();
    document.fonts.add(ff);
    // add to fontSelect and in-memory fontList
    fontList[name] = fontList[name] || {};
    fontList[name].Regular = blobUrl;
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name + ' (uploaded)';
    fontSelect.appendChild(opt);
    fontSelect.value = name;
  } catch (err) {
    console.error('加载字体失败', err);
    alert('加载字体失败: ' + err.message);
  }
});

// when font family changes, update style list
fontSelect.addEventListener('change', () => {
  populateFontStyleSelect(fontSelect.value);
});

// ensure a font is loaded (if referenced in fontList as a path)
async function ensureFontLoaded(family, style = 'Regular') {
  if (!family) return;
  // if already available in document.fonts, resolve immediately
  try {
    const fontKey = `${family}::${style}`;
    if (document.fonts.check(`1px "${fontKey}"`)) return;
  } catch (e) {}
  const entry = fontList[family];
  if (!entry) return;
  const path = entry[style] || entry['Regular'];
  if (!path) return;
  try {
    const fontKey = `${family}::${style}`;
    const ff = new FontFace(fontKey, `url(${path})`);
    await ff.load();
    document.fonts.add(ff);
    await document.fonts.load(`1px "${fontKey}"`);
    return;
  } catch (err) {
    console.warn('无法加载字体', family, style, err);
  }
}

// apply style (position + font)
function renderNow() {
  try {
    readTemplate(template, 'ctx01');
    readTemplate(back, 'ctx02');
  } catch (err) {
    // ignore
  }
}

const debouncedRender = (function() {
  let tid = null;
  return function(wait = 250) {
    if (tid) clearTimeout(tid);
    tid = setTimeout(() => {
      renderNow();
      tid = null;
    }, wait);
  };
})();

applyStyle.addEventListener('click', async () => {
  const id = fieldSelect.value;
  const entry = findNodeById(id);
  if (!entry) return alert('未找到对应文本节点');
  const node = entry.node;
  node.layout = node.layout || {};
  if (posLeft.value !== '') node.layout.left = Number(posLeft.value);
  if (posTop.value !== '') node.layout.top = Number(posTop.value);
  if (posRotate.value !== '') node.layout.rotate = Number(posRotate.value);
  node.font = node.font || {};
  if (fontSelect.value) node.font.family = fontSelect.value;
  if (fontStyleSelect.value) node.font.style = fontStyleSelect.value;
  if (fontSizeInput.value !== '') node.font.size = Number(fontSizeInput.value);
  if (fontColorInput.value) node.font.color = fontColorInput.value;
  if (fontTrackingInput.value !== '') node.font.tracking = Number(fontTrackingInput.value);
  // ensure the font is loaded before render
  try {
    await ensureFontLoaded(node.font.family, node.font.style);
  } catch (e) {}
  // lock this node from basic edits
  lockNodeId(id);
  debouncedRender(100);
});

// realtime inputs: debounce updates to avoid high freq render
fieldText.addEventListener('input', () => {
  const id = fieldSelect.value;
  const entry = findNodeById(id);
  if (!entry) return;
  const node = entry.node;
  node.text = fieldText.value;
  debouncedRender(150);
});

[posLeft, posTop, posRotate, fontSelect, fontStyleSelect, fontSizeInput, fontColorInput, fontTrackingInput].forEach(el => {
  if (!el) return;
  el.addEventListener('input', () => {
    const id = fieldSelect.value;
    const entry = findNodeById(id);
    if (!entry) return;
    const node = entry.node;
    node.layout = node.layout || {};
    if (posLeft.value !== '') node.layout.left = Number(posLeft.value);
    if (posTop.value !== '') node.layout.top = Number(posTop.value);
    if (posRotate.value !== '') node.layout.rotate = Number(posRotate.value);
    node.font = node.font || {};
    if (fontSelect.value) node.font.family = fontSelect.value;
    if (fontStyleSelect.value) node.font.style = fontStyleSelect.value;
    if (fontSizeInput.value !== '') node.font.size = Number(fontSizeInput.value);
    if (fontColorInput.value) node.font.color = fontColorInput.value;
    if (fontTrackingInput.value !== '') node.font.tracking = Number(fontTrackingInput.value);
    // lock this node from basic edits
    lockNodeId(id);
    debouncedRender(200);
  });
});

// init
populateFontSelect();
// advanced panel toggle: init hidden; populate fields when enabled
advancedToggle.addEventListener('change', () => {
  if (advancedToggle.checked) {
    advancedPanel.style.display = '';
    populateFieldSelect();
    if (fieldSelect.options.length) fieldSelect.selectedIndex = 0;
    fieldSelect.dispatchEvent(new Event('change'));
  } else {
    advancedPanel.style.display = 'none';
  }
});