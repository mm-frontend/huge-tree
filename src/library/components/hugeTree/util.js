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
 * 获取子、孙后代 list
 * @param {String | Number} id 父节点
 * @param {Array} list 节点
 * @param {Boolean} leafOnly 只统计叶子节点,
 * @returns Array
 */
export function getPosterityList(node, list, leafOnly = false) {
  return list.filter(i => {
    if (leafOnly) {
      return i.isLeaf && isPosterity(node.path, i);
    }
    return isPosterity(node.path, i);
  });
}
