// main.js
/**
 * 写着玩的
 */
import "./assets/template.js";
import "./js/export.js";
import "./js/update.js";
import "./js/parser/main.js";
import "./js/console/main.js";

document.getElementById("lianXi").onclick = () => {
  alert(
      "- 原作者 QQ 3412725994 -\n" +
      "- 原作者交流群 1056969651 -\n"+
      "- 修改作者 :你联系个蛋呀，我不会呀-\n"+
      "- 如有侵权请联系删除 -"

  );
}
document.getElementById("github").onclick = () => {
  window.open("https://github.com/Lingbailing/Custom-Pass-Creation-for-Anime-style-Games", "_blank");
}
console.log("- main.js OK -");

