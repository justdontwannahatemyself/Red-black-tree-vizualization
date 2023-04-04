const getTree = (strr) => {
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
  const root = d3.hierarchy(JSON.parse(strr));

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

  svg
    .selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", (d) => d.x - 5)
    .attr("y", (d) => d.y + d.data.padTop)
    .text((d) => (d.data.padTop != 4 ? d.data.value : "L"))
    .style("fill", "white")
    .style("font-weight", 900);
};

var previous = "";
let rbtree = new RedBlackTree();
localStorage.clear();
document.querySelector("#add").addEventListener("click", () => {
  if (localStorage.getItem("tree")) {
    previous = localStorage.getItem("tree");
  }
  if (previous) {
    document.querySelector("#previous").classList.remove("blocked");
  } else {
    document.querySelector("#previous").classList.add("blocked");
  }
  //
  //
  //
  const insertion = Number(document.querySelector("#adding").value.trim());
  if (insertion > 99 || insertion < -99) {
    document.querySelector("#adding").value = "";
    return;
  }
  rbtree.insert(insertion);
  let moves = `<p id = "node">Current node to add: ${insertion} </p> <br>`;
  rbtree.tips.forEach((el, index) => {
    moves += `<p class = "move">${index + 1}) ${el}</p> <br>`;
  });
  document.querySelector("#lst").innerHTML = moves;
  document.querySelector("#adding").value = "";
  //
  //
  let convertedTree = convertTree(rbtree.root);
  localStorage.setItem(
    "tree",
    JSON.stringify(convertedTree).replaceAll(
      `"null"`,
      `{"color": "black", "padTop": 4}`
    )
  );
  getTree(localStorage.getItem("tree"));
  //
  //
});
//
//
//

document.querySelector("#previous").addEventListener("click", (e) => {
  if (!previous) {
    return;
  }
  if (e.target.innerHTML == "Previous") {
    getTree(previous);
    e.target.innerHTML = "Return";
  } else {
    getTree(localStorage.getItem("tree"));
    e.target.innerHTML = "Previous";
  }
});
//
//
//
document.querySelector("#delete").addEventListener("click", () => {
  if (localStorage.getItem("tree")) {
    previous = localStorage.getItem("tree");
  }
  if (previous) {
    document.querySelector("#previous").classList.remove("blocked");
  } else {
    document.querySelector("#previous").classList.add("blocked");
  }
  //
  //

  const deletion = Number(document.querySelector("#deleting").value.trim());
  rbtree.delete(deletion);
  document.querySelector("#deleting").value = "";
  let convertedTree = convertTree(rbtree.root);
  localStorage.setItem(
    "tree",
    JSON.stringify(convertedTree).replaceAll(
      `"null"`,
      `{"color": "black", "padTop": 4}`
    )
  );
  getTree(localStorage.getItem("tree"));
  let moves = `<p id = "node">Current node to delete: ${deletion} </p> <br>`;
  rbtree.tips.forEach((el, index) => {
    moves += `<p class = "move">${index + 1}) ${el}</p> <br>`;
  });
  document.querySelector("#lst").innerHTML = moves;
});

function convertTree(node) {
  if (node === null) {
    return null;
  }
  let newNode = {
    value: node.value,
    color: node.color,
    padTop: node === rbtree.root ? 22 : 5,
    children: [],
  };
  if (node.left !== null) {
    newNode.children.push(convertTree(node.left));
  } else {
    newNode.children.push("null");
  }
  if (node.right !== null) {
    newNode.children.push(convertTree(node.right));
  } else {
    newNode.children.push("null");
  }
  return newNode;
}
