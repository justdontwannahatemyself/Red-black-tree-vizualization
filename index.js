const getTree = () => {
  rbtree.serialize();
  var width = window.innerWidth;
  var height = window.innerHeight;
  const margin = { top: 0, right: 30, bottom: 50, left: 30 };
  const svg = d3
    .select("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  width = width - margin.right - margin.left;
  height = height - margin.bottom - margin.top;
  const mytree = d3.tree().size([width, height * 0.9]);
  d3.select("svg").selectAll("*").remove();
  let str = JSON.parse(
    localStorage
      .getItem("root")
      .replaceAll("null", `{"color":1, "padTop": 4}`)
      .replaceAll(`"color":1`, `"color":"black"`)
      .replaceAll(`"color":0`, `"color":"red"`)
  );
  const root = d3.hierarchy(
    str
    /** не уверен там можно по прошлой ссылке поклацать посмотреть (сделать из первого obj?) */
    // `{{"color":"black","key":"1"},"children":[{"color":"black"},{"color":"red","key":"2"},"children":[{"color":"black"},{"color":"black"}]}]}`
  );
  console.log(
    localStorage
      .getItem("root")
      .replaceAll("null", `{"color":1, "padTop": 0}`)
      .replaceAll(`"color":1`, `"color":"black"`)
      .replaceAll(`"color":0`, `"color":"red"`)
  );
  const links = mytree(root).links();
  const linkPathGenerator = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y);
  svg
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("d", linkPathGenerator);
  svg
    .selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + 18 + ")")
    .attr("r", 18)
    .style("fill", (d) => d.data.color);
  let pos = str.key;
  svg
    .selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", (d) => d.x - 5)
    .attr("y", (d) => d.y + d.data.padTop)
    .text((d) => (d.data.padTop != 4 ? d.data.key : "L"))
    .style("fill", "white")
    .style("font-weight", 900);
};
var previous = "";
let rbtree = new RedBlackTree();
localStorage.clear();
document.querySelector("#add").addEventListener("click", () => {
  previous = localStorage.getItem("root");
  console.log(`prev: ${previous}`);
  const insertion = Number(document.querySelector("#adding").value.trim());
  rbtree.insert(insertion);
  document.querySelector("#adding").value = "";
  getTree();
  let moves = `<p id = "node">Current node to add: ${insertion} </p> <br>`;
  rbtree.tips.forEach((el, index) => {
    moves += `<p class = "move">${index + 1}) ${el}</p> <br>`;
  });
  document.querySelector("#lst").innerHTML = moves;
});

document.querySelector("#delete").addEventListener("click", () => {
  previous = rbtree.serialize();
  const deletion = Number(document.querySelector("#deleting").value.trim());
  rbtree.remove(deletion);
  document.querySelector("#deleting").value = "";
  getTree();
  let moves = `<p id = "node">Current node to delete: ${deletion} </p> <br>`;
  rbtree.tips.forEach((el, index) => {
    moves += `<p class = "move">${index + 1}) ${el}</p> <br>`;
  });
  document.querySelector("#lst").innerHTML = moves;
});
