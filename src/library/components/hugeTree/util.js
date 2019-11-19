/**
 * 判断子节点是否是父节点的后代，排除了自身。
 * @param {Array} basePath 父节点的path
 * @param {Object}} node 子节点
 */
export function isPosterity(basePath, node) {
  if (String(basePath) === String(node.path)) return false;
  let isMatch = true;
  basePath.forEach((id, index) => {
    if (id !== node.path[index]) isMatch = false;
  });
  return isMatch;
}

export function isSelf(basePath, node) {
  return String(basePath) === String(node.path);
}

/**
 * 自己 || 子 || 孙 是否含有关键字
 * @param {Object} node 当前节点
 * @param {String} keyword
 * @param {Array} list
 * @returns {Boolean}
 */
export function isIncludesKeyword(node, keyword, list) {
  const isInclude = node.label.includes(keyword);
  if (isInclude) {
    // 自己匹配上了
    return true;
  }
  if (!node.isLeaf) {
    const allDirectChildren = list.filter(i => i.parentId === node.id);
    return allDirectChildren.some(i => isIncludesKeyword(i, keyword, list));
  }
  return false;
}

/**
 * 获取后代 叶子节点的数量
 * @param {Object} node
 * @param {Array}} tree
 * @returns {Number}
 */
export function getLeafCount(tree, node) {
  const subTree = findSubTree(tree, node.id);
  let count = 0;
  depthFirstEach({ tree: subTree }, node => {
    if (node.isLeaf) {
      count++;
    }
  });
  return count;
}

/**
 * 深度优先遍历算法, 遍历tree的每一项
 * @param {Object} {tree, path: 父节点的path, init: 是否是初始化}
 * @param {Callback}} cb 回调函数，参数为 node
 */
export function depthFirstEach({ tree, path = [], init = false }, cb) {
  if (!Array.isArray(tree)) {
    console.warn('The tree in the first argument to function depthFirstEach must be an array');
    return;
  }
  if (!tree || tree.length === 0) return;
  for (let node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (init) {
      node.path = [...path, node.id];
      node.isLeaf = !hasChildren;
    }
    if (cb) cb(node);
    if (hasChildren) {
      depthFirstEach({ tree: node.children, path: node.path, init }, cb);
    }
  }
}

export function listToTree(filterList) {
  if (!Array.isArray(filterList)) {
    console.warn('The parameter filterList to function listToTree must be an array');
    return;
  }
  if (!filterList || filterList.length === 0) return [];
  let root = [];
  console.time();
  filterList.forEach(node => {
    const parentNode = findParentNodeByPath(filterList, node.path);
    if (parentNode) {
      parentNode.children.push(node);
    } else {
      root.push(node);
    }
  });
  console.timeEnd();
  return root;
}

function findParentNodeByPath(list, path) {
  const node = list.find(node => {
    const parentPath = node.path;
    return path.length - parentPath.length === 1 && String(path).includes(parentPath);
  });
  return node;
}
/**
 * 广度优先遍历算法，
 * @param {Object} {tree, limitDeep: 限制遍历的深度， deep: 当前深度}
 * @param {Callback} cb
 */
export function breadthFirstEach({ tree, limitDeep = Number.MAX_SAFE_INTEGER, deep = 0 }, cb) {
  if (!Array.isArray(tree)) {
    console.warn('The tree in the first argument to function breadthFirstEach must be an array');
    return;
  }
  if (!tree || tree.length === 0) return;
  tree.forEach(node => {
    if (cb) cb(node);
  });
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1);
  breadthFirstEach({ tree: childrenList, limitDeep, deep: deep++ }, cb);
}

/**
 * 广度优先遍历算法，找子树, 不包含自己
 * @param {Array} trees 原始树，数组
 * @param {Number|String} rootId 子树根结点
 * @return {Object} 子树
 */
export function findSubTree(tree, rootId) {
  if (!Array.isArray(tree)) {
    console.warn('The parameter tree to function breadthFirstEach must be an array');
    return;
  }
  if (!tree || tree.length === 0) return [];
  const item = tree.find(node => node.id === rootId);
  if (item) return item.children;
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1);
  return findSubTree(childrenList, rootId);
}

/**
 * 广度优先遍历算法，节点自己
 * @param {Array} trees 原始树，数组
 * @param {Number|String} rootId 自身id
 * @return {Object} node
 */
export function findNode(tree, rootId) {
  if (!Array.isArray(tree)) {
    console.warn('The parameter tree to function findNode must be an array');
    return;
  }
  if (!tree || tree.length === 0) return [];
  const item = tree.find(node => node.id === rootId);
  if (item) return item;
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1);
  return findNode(childrenList, rootId);
}
