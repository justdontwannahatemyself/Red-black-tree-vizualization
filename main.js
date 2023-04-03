import { RedBlackTree } from "./index.js";
const rbtree = new RedBlackTree();
document.querySelector("#add").addEventListener("click", () => {
  rbtree.insert(document.querySelector("#adding").value.trim());
});
