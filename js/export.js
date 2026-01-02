// js / export.js
import {template, back} from "../assets/template.js";
import {runtimeImageMap} from "./console/image.js";
import {fontList} from "./parser/fontList.js";
import {readTemplate} from "./parser/main.js";

const canvas01 = document.getElementById("canvas01");
const canvas02 = document.getElementById("canvas02");

function downloadDataURL(dataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

document.getElementById("exportPNG1").onclick = () => {
  downloadDataURL(canvas01.toDataURL("image/png"), 'template.png');
};
document.getElementById("exportPNG2").onclick = () => {
  downloadDataURL(canvas02.toDataURL("image/png"), 'back.png');
};

// 导出双面并排 PNG
document.getElementById('exportBothPNG').onclick = () => {
  const w1 = canvas01.width;
  const h1 = canvas01.height;
  const w2 = canvas02.width;
  const h2 = canvas02.height;
  const outW = w1 + w2;
  const outH = Math.max(h1, h2);
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext('2d');
  // leave canvas transparent (do not fill with white)
  ctx.clearRect(0, 0, outW, outH);
  ctx.drawImage(canvas01, 0, 0);
  ctx.drawImage(canvas02, w1, 0);
  downloadDataURL(out.toDataURL('image/png'), 'both_sides.png');
};

// 导出双面 zip（需要 JSZip loaded）
document.getElementById('exportBothZip').onclick = async () => {
  try {
    if (typeof JSZip === 'undefined') {
      alert('未加载 JSZip，无法生成 zip。');
      return;
    }
    const zip = new JSZip();
    // convert canvases to blobs
    const blob1 = await new Promise(res => canvas01.toBlob(res, 'image/png'));
    const blob2 = await new Promise(res => canvas02.toBlob(res, 'image/png'));
    zip.file('template.png', blob1);
    zip.file('back.png', blob2);
    const content = await zip.generateAsync({type:'blob'});
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url; a.download = 'both_sides.zip'; a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert('生成 zip 失败：' + err.message);
  }
};

// 导出分享包（JSON）——包含模板、背面、运行时图片映射与字体映射
document.getElementById('exportShare').onclick = () => {
  try {
    const payload = {
      meta: { exportedAt: (new Date()).toISOString(), app: 'mrfztxz' },
      template,
      back,
      runtimeImageMap,
      fontList
    };
    const blob = new Blob([JSON.stringify(payload)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'design_share.json'; a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('导出分享文件失败', err);
    alert('导出失败：' + err.message);
  }
};

// 加载分享文件（JSON）
const importEl = document.getElementById('importShare');
if (importEl) {
  importEl.addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const data = JSON.parse(text);
      // validate
      if (!data || !data.template || !data.back) return alert('无效的分享文件');
      // apply: mutate current template/back objects in-place
      function apply(target, src) {
        Object.keys(target).forEach(k => delete target[k]);
        Object.assign(target, src);
      }
      apply(template, data.template);
      apply(back, data.back);
      // restore runtime images and fonts if present
      if (data.runtimeImageMap) {
        Object.keys(runtimeImageMap).forEach(k => delete runtimeImageMap[k]);
        Object.assign(runtimeImageMap, data.runtimeImageMap);
      }
      if (data.fontList) {
        Object.keys(data.fontList).forEach(fam => {
          fontList[fam] = data.fontList[fam];
        });
      }

      // helper - find text node by id in template/back
      function findTextNode(layers, id) {
        for (const lay of layers) {
          if (!lay) continue;
          if (lay.type === 'text' && (lay.id === id || lay.name === id)) return lay;
          if (lay.children && lay.children.length) {
            const found = findTextNode(lay.children, id);
            if (found) return found;
          }
        }
        return null;
      }

      // synchronize common UI controls
      try {
        // basic text fields (best-effort - mirror text.js mappings)
        const lt = findTextNode(template.layers, 'left_title');
        const n1 = findTextNode(template.layers, 'name1');
        const ar = findTextNode(template.layers, 'ARKNIGHTS - LT40');
        const st = findTextNode(template.layers, 'staff');
        const ox = findTextNode(template.layers, 'operator_of_rhodes_island');
        const prof = findTextNode(template.layers, 'profession');
        const atag = findTextNode(template.layers, '@ARKNIGHTS');
        const rh = findTextNode(template.layers, 'RHODES ISLAND INC.');

        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ''; };
        if (lt) setVal('left_title', lt.text);
        if (n1) setVal('name1', n1.text);
        if (ar) setVal('arknights1', ar.text);
        if (st) setVal('staff', st.text);
        if (ox) setVal('xz1', ox.text);
        if (prof) setVal('xz2', prof.text);
        if (atag) setVal('xz3', atag.text);
        if (rh) setVal('xz4', rh.text);

        // back fields
        const b_xzb1 = findTextNode(back.layers, 'operator_of_rhodes_island');
        const b_xzb2 = findTextNode(back.layers, 'profession');
        const b_xzb3 = findTextNode(back.layers, '©HYPERGRYPH');
        const b_xzb4 = findTextNode(back.layers, 'RHODES ISLAND INC.');
        if (b_xzb1) setVal('xzb1', b_xzb1.text);
        if (b_xzb2) setVal('xzb2', b_xzb2.text);
        if (b_xzb3) setVal('xzb3', b_xzb3.text);
        if (b_xzb4) setVal('xzb4', b_xzb4.text);

        // colors and toggles
          const jian = document.getElementById('jian_bian');
          const dang = document.getElementById('dang_ban');
          const bei = document.getElementById('bei_ying');
          // helper: normalize color to #rrggbb when possible
          function toHexColor(val, fallback = '#000000') {
            if (!val) return fallback;
            val = String(val).trim();
            if (val[0] === '#') {
              // short form #rgb -> expand
              if (val.length === 4) return '#' + val[1]+val[1]+val[2]+val[2]+val[3]+val[3];
              if (val.length === 7) return val.toLowerCase();
              return fallback;
            }
            // rgb(a) -> hex
            const m = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (m) {
              const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
              const hex = '#' + [r,g,b].map(n=>n.toString(16).padStart(2,'0')).join('');
              return hex;
            }
            return fallback;
          }
          // gradient color
          if (jian && template.layers[0] && template.layers[0].children[3] && template.layers[0].children[3].children[2]) {
            const raw = template.layers[0].children[3].children[2].color;
            jian.value = toHexColor(raw, '#00bfff');
          }
          // unify dang_ban color between template and back
          let frontDang = (template.layers[1] && template.layers[1].children[1] && template.layers[1].children[1].color) || null;
          let backDang = (back.layers[2] && back.layers[2].color) || null;
          let dangColor = toHexColor(frontDang || backDang, '#8a60ab');
          // apply unified color to both structures
          if (template.layers[1] && template.layers[1].children[1]) template.layers[1].children[1].color = dangColor;
          if (back.layers[2]) back.layers[2].color = dangColor;
          if (dang) { dang.value = dangColor; }
          //背影颜色 (tu_pian_back)
          if (bei && back.layers && back.layers[3]) {
            const rawb = back.layers[3].color;
            const bc = toHexColor(rawb, '#fff1b9');
            back.layers[3].color = bc;
            bei.value = bc;
          }

        // toggles: jianBian, dangBan, logo, cut
        const tJ = document.getElementById('toggleJianBian'); if (tJ) { tJ.checked = !!(template.layers[0] && template.layers[0].children[3] && template.layers[0].children[3].children[2] && template.layers[0].children[3].children[2].visible); tJ.dispatchEvent(new Event('change')); }
        const tD = document.getElementById('toggleDangBan'); if (tD) { tD.checked = !!(template.layers[1] && template.layers[1].children[1] && template.layers[1].children[1].visible); tD.dispatchEvent(new Event('change')); }
        const tL = document.getElementById('toggleLogo'); if (tL) { const deco = template.layers[0].children.find(c=>c.id==='group_decorative_patterns'); const m = deco && deco.children? deco.children.find(ch=>ch.id==='mrfz_logo'): null; tL.checked = !!(m && m.visible); tL.dispatchEvent(new Event('change')); }
        const tC = document.getElementById('toggleCut'); if (tC) { tC.checked = !!(template.layers[0] && template.layers[0].children[0] && template.layers[0].children[0].visible); tC.dispatchEvent(new Event('change')); }

        // profession / faction selects
        try {
          const seProfession = document.getElementById('seProfession');
          const profGroup = template.layers[0].children.find(c=>c.id==='group_profession_logo');
          if (seProfession && profGroup && profGroup.children) {
            const active = profGroup.children.find(ch=>ch.visible);
            if (active) seProfession.value = active.id;
            seProfession.dispatchEvent(new Event('change'));
          }
          const seFaction = document.getElementById('seFaction');
          const facGroup = template.layers[1].children.find(c=>c.id==='faction');
          if (seFaction && facGroup && facGroup.children) {
            const active = facGroup.children.find(ch=>ch.visible);
            if (active) seFaction.value = active.id;
            seFaction.dispatchEvent(new Event('change'));
          }
        } catch (e) {}

        // refresh advanced panel options if present
        const adv = document.getElementById('advancedToggle'); if (adv && adv.checked) {
          // trigger change so text.js repopulates select
          adv.dispatchEvent(new Event('change'));
        }
      } catch (uiErr) {
        console.warn('同步 UI 失败', uiErr);
      }

      // re-render using imported readTemplate
      try { readTemplate(template, 'ctx01'); } catch (e) { console.warn(e); }
      try { readTemplate(back, 'ctx02'); } catch (e) { console.warn(e); }

      alert('已加载分享文件，已应用到当前画布（如未生效请刷新页面）');
    } catch (err) {
      console.error('加载分享文件失败', err);
      alert('加载失败：' + err.message);
    }
    // clear input
    importEl.value = '';
  });
}