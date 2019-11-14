/**
 * 自己 || 子 || 孙 含有关键字
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
