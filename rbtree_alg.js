class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = "red";
    this.padTop = 5;
  }
}
class RedBlackTree {
  constructor() {
    this.root = null;
    this.tips = [];
  }
  insert(key) {
    this.tips = [];
    var treeNode = new Node(key);
    if (this.root === null) {
      this.root = treeNode;
    } else {
      var currentNode = this.root;
      var nextNode = currentNode;
      while (nextNode !== null) {
        currentNode = nextNode;
        if (currentNode.value > treeNode.value) {
          nextNode = currentNode.left;
        } else if (currentNode.value < treeNode.value) {
          nextNode = currentNode.right;
        } else {
          return; // return if node with that key already exists
        }
      }
      if (currentNode.value > treeNode.value) {
        currentNode.left = treeNode;
        this.tips.push(
          ` Users node is less than ${currentNode.value}, we will locate it like a left child`
        );
      } else {
        currentNode.right = treeNode;
        this.tips.push(
          ` Users node is more than ${currentNode.value}, we will locate it like a right child`
        );
      }
      treeNode.parent = currentNode;
    }
    this.insertCase1(treeNode); // need to change root after all rotations
    while (treeNode.parent !== null) {
      treeNode = treeNode.parent;
    }
    this.root = treeNode;
  }
  insertCase1(treeNode) {
    if (treeNode.parent === null) {
      this.tips.push(`Change root color to black if we need`);
      treeNode.color = "black";
    } else {
      this.insertCase2(treeNode);
    }
  }
  // if parent of treeNode is black
  insertCase2(treeNode) {
    if (treeNode.parent.color === "black") {
      this.tips.push(
        " Users node parent is black, so we didn`t change anything"
      );
      return;
    } else {
      this.insertCase3(treeNode);
    }
  }
  // if parent and uncle are red
  insertCase3(treeNode) {
    var uncle = this.getUncle(treeNode);
    if (uncle !== null && this.getUncle(treeNode).color === "red") {
      treeNode.parent.color = "black";
      uncle.color = "black";
      var grandparent = this.getGrandparent(treeNode);
      grandparent.color = "red";
      this.tips.push(
        "Uncle and parent are red, parent and uncle color we need to" +
          " set with black, and grandparent`s color we change to black if we need"
      );
      this.insertCase1(grandparent);
    } else {
      this.insertCase4(treeNode);
    }
  }
  // if parent is red, but uncle is not and treeNode is the left son while parent is right son
  // or treeNode is right son and parent is left son
  insertCase4(treeNode) {
    var grandparent = this.getGrandparent(treeNode);
    if (
      treeNode.parent.right === treeNode &&
      grandparent.left === treeNode.parent
    ) {
      this.tips.push(
        "if treenode is right son and it`s parent is left, do left rotation" +
          " on parent"
      );
      this.rotateLeft(treeNode.parent);
      treeNode = treeNode.left;
    } else if (
      treeNode.parent.left === treeNode &&
      grandparent.right === treeNode.parent
    ) {
      this.tips.push(
        "if treenode is left son and it`s parent is right, do right rotation" +
          " on parent"
      );
      this.rotateRight(treeNode.parent);
      treeNode = treeNode.right;
    }
    this.insertCase5(treeNode);
  }
  // last case
  insertCase5(treeNode) {
    var grandparent = this.getGrandparent(treeNode);
    ("change parent color on black");
    treeNode.parent.color = "black";
    grandparent.color = "red";
    if (
      treeNode.parent.left === treeNode &&
      grandparent.left === treeNode.parent
    ) {
      if (grandparent) {
        this.tips.push(
          "if node is left son and parent is left son, do right rotation" +
            " on grandparent"
        );
      }
      this.rotateRight(grandparent);
    } else {
      if (grandparent) {
        this.tips.push("Rotate left on grandparent");
      }
      this.rotateLeft(grandparent);
    }
  }
  rotateLeft(treeNode) {
    var pivot = treeNode.right;
    if (pivot == null) return;
    pivot.parent = treeNode.parent;
    if (treeNode.parent != null) {
      if (treeNode.parent.left === treeNode) {
        treeNode.parent.left = pivot;
      } else {
        treeNode.parent.right = pivot;
      }
    }
    treeNode.right = pivot.left;
    if (pivot.left != null) {
      pivot.left.parent = treeNode;
    }
    treeNode.parent = pivot;
    pivot.left = treeNode;
  }
  rotateRight(treeNode) {
    var pivot = treeNode.left;
    if (pivot === null) return;
    pivot.parent = treeNode.parent;
    if (treeNode.parent !== null) {
      if (treeNode.parent.left === treeNode) {
        treeNode.parent.left = pivot;
      } else {
        treeNode.parent.right = pivot;
      }
    }
    treeNode.left = pivot.right;
    if (pivot.right !== null) {
      pivot.right.parent = treeNode;
    }
    treeNode.parent = pivot;
    pivot.right = treeNode;
  }
  rotateLeftToDelete(node) {
    let tempNode = node.right;
    node.right = tempNode.left;
    if (tempNode.left !== null) {
      tempNode.left.parent = node;
    }
    tempNode.parent = node.parent;
    if (node.parent === null) {
      this.root = tempNode;
    } else if (node === node.parent.left) {
      node.parent.left = tempNode;
    } else {
      node.parent.right = tempNode;
    }
    tempNode.left = node;
    node.parent = tempNode;
  }

  rotateRightToDelete(node) {
    let tempNode = node.left;
    node.left = tempNode.right;
    if (tempNode.right !== null) {
      tempNode.right.parent = node;
    }
    tempNode.parent = node.parent;
    if (node.parent === null) {
      this.root = tempNode;
    }
  }
  delete(value) {
    this.tips = [];
    let node = this.findNode(value);
    if (node == null) {
      return;
    }
    if (node.left === null && node.right === null) {
      this.tips.push("Just a leaf, easy to delete");
    }
    if (node.left !== null && node.right !== null) {
      let predecessor = this.getPredecessor(node);
      node.value = predecessor.value;
      node = predecessor;
      this.tips.push(`Change to predecessor: ${predecessor.value}`);
    }
    let child = node.right === null ? node.left : node.right;
    console.log(child);
    if (child) {
      this.tips.push(`Found child to change: ${child.value}`);
    }
    if (this.getColor(node) === "black") {
      node.color = this.getColor(child);
      this.deleteCase1(node);
    }
    this.replaceNode(node, child);
    if (this.getColor(this.root) === "red") {
      this.tips.push("Root needs to be black, so change color");
      this.root.color = "black";
    }
  }
  replaceNode(oldNode, newNode) {
    if (oldNode.parent === null) {
      this.root = newNode;
      this.tips.push("giving value to root");
    } else {
      if (oldNode === oldNode.parent.left) {
        oldNode.parent.left = newNode;
      } else {
        oldNode.parent.right = newNode;
      }
    }
    if (newNode !== null) {
      newNode.parent = oldNode.parent;
    }
  }

  deleteCase1(node) {
    if (node.parent === null) {
      this.tips.push("Node parent is root, so end");
      return;
    }
    this.deleteCase2(node);
  }

  deleteCase2(node) {
    let sibling = this.getSibling(node);
    if (this.getColor(sibling) === "red") {
      node.parent.color = "red";
      this.tips.push(
        `'brother' color is red, so change ${sibling.value} color to black and ${parent.value} to red`
      );
      sibling.color = "black";
      if (node === node.parent.left) {
        this.tips.push("rotate left");
        this.rotateLeftToDelete(node.parent);
      } else {
        this.rotateRightToDelete(node.parent);
        this.tips.push("rotate right");
      }
    }
    this.deleteCase3(node);
  }
  deleteCase3(node) {
    let sibling = this.getSibling(node);
    if (
      this.getColor(node.parent) === "black" &&
      this.getColor(sibling) === "black" &&
      this.getColor(sibling.left) === "black" &&
      this.getColor(sibling.right) === "black"
    ) {
      sibling.color = "red";
      this.tips.push(`Change color of ${sibling.value} to red`);
      this.deleteCase1(node.parent);
    } else {
      this.deleteCase4(node);
    }
  }

  deleteCase4(node) {
    let sibling = this.getSibling(node);
    if (
      this.getColor(node.parent) === "red" &&
      this.getColor(sibling) === "black" &&
      this.getColor(sibling.left) === "black" &&
      this.getColor(sibling.right) === "black"
    ) {
      this.tips.push(
        `change ${sibling.value} color to red and ${parent.value} color to black `
      );
      sibling.color = "red";
      node.parent.color = "black";
    } else {
      this.deleteCase5(node);
    }
  }
  deleteCase5(node) {
    let sibling = this.getSibling(node);
    if (
      node === node.parent.left &&
      this.getColor(sibling) === "black" &&
      this.getColor(sibling.left) === "red" &&
      this.getColor(sibling.right) === "black"
    ) {
      sibling.color = "red";
      sibling.left.color = "black";
      this.tips.push(
        `change ${sibling.value} color to red and ${sibling.left.value} color to black `
      );
      this.rotateRightToDelete(sibling);
      this.tips.push(`rotate ${sibling.value} right`);
    } else if (
      node === node.parent.right &&
      this.getColor(sibling) === "black" &&
      this.getColor(sibling.right) === "red" &&
      this.getColor(sibling.left) === "black"
    ) {
      sibling.color = "red";
      sibling.right.color = "black";
      this.tips.push(
        `change ${sibling.value} color to red and ${sibling.right.value} color to black `
      );
      this.rotateLeftToDelete(sibling);
      this.tips.push(`rotate ${sibling.value} left`);
    }
    this.deleteCase6(node);
  }

  deleteCase6(node) {
    let sibling = this.getSibling(node);
    sibling.color = this.getColor(node.parent);
    node.parent.color = "black";
    if (node === node.parent.left && sibling.right !== null) {
      sibling.right.color = "black";
      this.tips.push(`change ${sibling.right.value} color to black`);
      this.rotateLeftToDelete(node.parent);
      this.tips.push("rotate left");
    }
  }
  getPredecessor(node) {
    let currentNode = node.left;
    while (currentNode.right !== null) {
      currentNode = currentNode.right;
    }
    return currentNode;
  }
  getColor(node) {
    if (node === null) {
      return "black";
    }
    return node.color;
  }
  getSibling(node) {
    if (node.parent === null) {
      return null;
    }
    if (node === node.parent.left) {
      return node.parent.right;
    } else {
      return node.parent.left;
    }
  }
  getUncle(treeNode) {
    var grandparent = this.getGrandparent(treeNode);
    if (grandparent === null) {
      return null;
    }
    if (treeNode.parent === grandparent.left) {
      return grandparent.right;
    } else {
      return grandparent.left;
    }
  }

  getGrandparent(treeNode) {
    if (treeNode !== null && treeNode.parent !== null) {
      return treeNode.parent.parent; // also will return null, if parent has no parent. It's ok.
    } else {
      return null;
    }
  }

  findNode(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else {
        return currentNode;
      }
    }
    return null;
  }
}
