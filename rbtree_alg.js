class TreeNode {
  constructor(key) {
    this.key = 0;
    this.isLeaf = false;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.color = TreeColors.red;
    if (key !== null) {
      this.key = key;
    } else {
      this.isLeaf = true;
    }
  }
}

var TreeColors;
(function (TreeColors) {
  TreeColors[(TreeColors["red"] = 0)] = "red";
  TreeColors[(TreeColors["black"] = 1)] = "black";
})(TreeColors || (TreeColors = {}));

class RedBlackTree {
  constructor() {
    this.root = null;
    this.list = [];
    this.tips = [];
  }
  insert(key) {
    this.tips = [];
    var treeNode = new TreeNode(key);
    this.list.push(treeNode);
    if (this.root === null) {
      this.root = treeNode;
    } else {
      var currentNode = this.root;
      var nextNode = currentNode;
      while (nextNode !== null) {
        currentNode = nextNode;
        if (currentNode.key > treeNode.key) {
          nextNode = currentNode.left;
        } else if (currentNode.key < treeNode.key) {
          nextNode = currentNode.right;
        } else {
          this.list.slice[(0, -1)];
          return; // return if node with that key already exists
        }
      }
      if (currentNode.key > treeNode.key) {
        currentNode.left = treeNode;
        this.tips.push(
          ` Users node is less than ${currentNode.key}, we will locate it like a left child`
        );
      } else {
        currentNode.right = treeNode;
        this.tips.push(
          ` Users node is more than ${currentNode.key}, we will locate it like a right child`
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
  find(key) {
    var currentNode = this.root;
    while (currentNode !== null && currentNode.key !== key) {
      if (currentNode.key > key) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return currentNode;
  }
  sibling(treeNode) {
    if (treeNode.parent === null) {
      return null;
    }
    if (treeNode === treeNode.parent.left) {
      return treeNode.parent.right;
    } else {
      return treeNode.parent.left;
    }
  }
  replaceNode(toReplace, replaceBy) {
    if (toReplace.parent !== null) {
      if (toReplace.parent.left === toReplace) {
        toReplace.parent.left = replaceBy;
      } else {
        toReplace.parent.right = replaceBy;
      }
    } else {
      this.root = replaceBy;
    }
    if (replaceBy !== null) {
      replaceBy.parent = toReplace.parent;
    }
  }
  remove(key) {
    this.tips = [];
    var nodeToRemove = this.find(key);
    if (nodeToRemove === null) {
      this.tips.push("Can`t find this number");
      return;
    }
    var closestValueNode = null;
    if (nodeToRemove.left !== null) {
      var leftSubTree = nodeToRemove.left;
      while (leftSubTree.right !== null) {
        leftSubTree = leftSubTree.right;
      }
      closestValueNode = leftSubTree;
    } else if (nodeToRemove.right !== null) {
      var rightSubTree = nodeToRemove.right;
      while (rightSubTree.left !== null) {
        rightSubTree = rightSubTree.left;
      }
      closestValueNode = rightSubTree;
    }
    this.tips.push(`Closest value node = ${closestValueNode.key}`);
    if (closestValueNode !== null) {
      var temp = nodeToRemove.key;
      nodeToRemove.key = closestValueNode.key;
      closestValueNode.key = temp;
      nodeToRemove = closestValueNode;
    }
    var child =
      nodeToRemove.right === null ? nodeToRemove.left : nodeToRemove.right;
    if (child === null) {
      // just to make it a node, not null
      child = new TreeNode(null);
      child.color = TreeColors.black;
    }
    this.replaceNode(nodeToRemove, child);
    if (nodeToRemove.color === TreeColors.black) {
      if (child.color === TreeColors.red) {
        child.color = TreeColors.black;
      } else {
        this.removeCase1(child);
      }
    }
    if (child.isLeaf) {
      this.replaceNode(child, null);
    }
  }
  removeCase1(treeNode) {
    if (treeNode.parent !== null) {
      this.removeCase2(treeNode);
    }
  }
  removeCase2(treeNode) {
    var sibling = this.sibling(treeNode);
    if (sibling !== null && sibling.color === TreeColors.red) {
      treeNode.parent.color = TreeColors.red;
      sibling.color = TreeColors.black;
      if (treeNode.parent.right === treeNode) {
        this.rotateRight(treeNode.parent);
      } else {
        this.rotateLeft(treeNode.parent);
      }
    }
    this.removeCase3(treeNode);
  }
  removeCase3(treeNode) {
    var sibling = this.sibling(treeNode);
    if (
      treeNode.parent.color === TreeColors.red &&
      sibling.color === TreeColors.black &&
      (sibling.left === null || sibling.left.color === TreeColors.black) &&
      (sibling.right === null || sibling.right.color === TreeColors.black)
    ) {
      sibling.color = TreeColors.red;
      this.removeCase1(treeNode.parent);
    } else {
      this.removeCase4(treeNode);
    }
  }
  removeCase4(treeNode) {
    var sibling = this.sibling(treeNode);
    if (
      treeNode.parent.color === TreeColors.red &&
      sibling.color === TreeColors.black &&
      (sibling.left === null || sibling.left.color === TreeColors.black) &&
      (sibling.right === null || sibling.right.color === TreeColors.black)
    ) {
      sibling.color = TreeColors.red;
      treeNode.parent.color = TreeColors.black;
    } else {
      this.removeCase5(treeNode);
    }
  }
  removeCase5(treeNode) {
    var sibling = this.sibling(treeNode);
    if (sibling.color === TreeColors.black) {
      if (
        treeNode === treeNode.parent.left &&
        (sibling.right === null || sibling.right.color === TreeColors.black) &&
        sibling.left !== null &&
        sibling.left.color === TreeColors.red
      ) {
        sibling.color = TreeColors.red;
        sibling.left.color = TreeColors.black;
        this.rotateRight(sibling);
      } else if (
        treeNode === treeNode.parent.right &&
        (sibling.left === null || sibling.left.color === TreeColors.black) &&
        sibling.right !== null &&
        sibling.right.color === TreeColors.red
      ) {
        sibling.color = TreeColors.red;
        sibling.right.color = TreeColors.black;
        this.rotateLeft(sibling);
      }
    }
    this.removeCase6(treeNode);
  }
  removeCase6(treeNode) {
    var sibling = this.sibling(treeNode);
    sibling.color = treeNode.parent.color;
    if (treeNode === treeNode.parent.left) {
      sibling.right.color = TreeColors.black;
      this.rotateLeft(treeNode.parent);
    } else {
      sibling.left.color = TreeColors.black;
      this.rotateRight(treeNode.parent);
    }
  }
  grandparent(treeNode) {
    if (treeNode !== null && treeNode.parent !== null) {
      return treeNode.parent.parent; // also will return null, if parent has no parent. It's ok.
    } else {
      return null;
    }
  }
  uncle(treeNode) {
    var grandparent = this.grandparent(treeNode);
    if (grandparent === null) {
      return null;
    }
    if (treeNode.parent === grandparent.left) {
      return grandparent.right;
    } else {
      return grandparent.left;
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

  // if treeNode is in root
  insertCase1(treeNode) {
    if (treeNode.parent === null) {
      this.tips.push(`Change root color to black if we need`);
      treeNode.color = TreeColors.black;
    } else {
      this.insertCase2(treeNode);
    }
  }
  // if parent of treeNode is black
  insertCase2(treeNode) {
    if (treeNode.parent.color === TreeColors.black) {
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
    var uncle = this.uncle(treeNode);
    if (uncle !== null && uncle.color === TreeColors.red) {
      treeNode.parent.color = TreeColors.black;
      uncle.color = TreeColors.black;
      var grandparent = this.grandparent(treeNode);
      grandparent.color = TreeColors.red;
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
    var grandparent = this.grandparent(treeNode);
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
    var grandparent = this.grandparent(treeNode);
    ("change parent color on black");
    treeNode.parent.color = TreeColors.black;
    grandparent.color = TreeColors.red;
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
  serialize() {
    localStorage.clear();
    this.list.forEach((element) => {
      if (element) {
        element.children = [element.left, element.right];
        if (element == this.root) {
          element.padTop = 22;
        } else {
          element.padTop = 5;
        }
      }
    });
    localStorage.setItem(
      "root",
      JSON.stringify(this.root, ["color", "key", "children", "padTop"])
    );
    // console.log(
    //   JSON.parse(
    //     localStorage
    //       .getItem("root")
    //       .replaceAll("null", `{"color":1}`)
    //       .replaceAll(`"color":1`, `"color":"black"`)
    //       .replaceAll(`"color":0`, `"color":"red"`)
    //   )
    // );
  }
}
