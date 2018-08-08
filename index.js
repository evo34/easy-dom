/**
 * 判断 元素是否存在某个样式
 * @param el
 * @param cls
 * @returns {boolean}
 */
function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/**
 * 为 元素添加某个样式
 * @param element
 * @param cls
 */
function addClass (element, cls) {
  const className = element.className
  const classNames = className.split(/\s+/)
  if (classNames.indexOf(cls) === -1) {
    classNames.push(cls)
  }
  element.className = classNames.join(' ')
  return element
}

/**
 * 删除 样式
 * @param element
 * @param cls
 */
function removeClass (element, cls) {
  const className = element.className
  const classNames = className.split(/\s+/)
  let index
  if ((index = classNames.indexOf(cls)) > -1) {
    classNames.splice(index, 1)
  }
  element.className = classNames.join(' ')
  return element
}

/**
 * 找到最近的指定元素
 * @param node
 * @param cls 支持 .class #id div
 * @returns {*}
 */
function closest (node, cls) {
  let parentNode = node
  let validator = (node, cls) => {
    if (!node) return
    if (!node.tagName) return
    return node.tagName.toUpperCase() === cls.toUpperCase()
  }
  if (cls.indexOf('.') === 0) validator = (node, cls) => hasClass(node, cls.slice(1))
  if (cls.indexOf('#') === 0) validator = (node, cls) => node.id === cls.slice(1)

  while (parentNode) {
    if (validator(parentNode, cls)) {
      break
    }
    parentNode = parentNode.parentNode
  }
  return parentNode
}

/**
 * 代理方法
 * @param context
 * @param fnName
 * @returns {function(...[*]=): *}
 */
function proxy (context, fnName) {
  let fn
  const reminds = [].slice.call(arguments, 2)
  if (typeof context === 'function' && typeof fnName === 'object') {
    fn = context
    context = fnName
  } else {
    fn = context[fnName]
  }
  return function (...args) {
    args = reminds.concat(args)
    return fn.apply(context, args)
  }
}

/**
 * 监听监听
 * @param element
 * @param eventType
 * @param fn
 * @returns {*}
 */
function bind (element, eventType, fn) {
  if (document.addEventListener) {
    element.addEventListener(eventType, fn, false)
  } else if (document.attachEvent) {
    element.attachEvent('on' + eventType, fn)
  }
  return element
}

/**
 * 删除监听
 * @param element
 * @param eventType
 * @param fn
 * @returns {*}
 */
function unbind (element, eventType, fn) {
  if (document.removeEventListener) {
    element.removeEventListener(eventType, fn, false)
  } else if (document.detachEvent) {
    element.detachEvent('on' + eventType, fn)
  }
  return element
}

/**
 * dom元素包含
 * @param root
 * @param el
 * @returns {*}
 */
function contains (root, el) {
  if (root.compareDocumentPosition) { return root === el || !!(root.compareDocumentPosition(el) & 16) }
  if (root.contains && el.nodeType === 1) {
    return root.contains(el) && root !== el
  }
  while ((el = el.parentNode)) { if (el === root) return true }
  return false
}

/**
 * find scroll parent
 * @param element
 * @returns {*}
 */
function getScrollParent (element) {
  let root = window
  function getStyleComputedProperty (element, property) {
    let css = root.getComputedStyle(element, null)
    return css[property]
  }

  let parent = element.parentNode

  if (!parent) {
    return element
  }

  if (parent === root.document) {
    if (root.document.body.scrollTop || root.document.body.scrollLeft) {
      return root.document.body
    } else {
      return root.document.documentElement
    }
  }

  if ([ 'scroll', 'auto' ].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
    [ 'scroll', 'auto' ].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
    [ 'scroll', 'auto' ].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1) {
    return parent
  }
  return getScrollParent(element.parentNode)
}

/**
 *
 * @param Node
 * @param offset
 * @returns {*}
 */
function getOffset (Node, offset) {
  if (!offset) {
    offset = {}
    offset.top = 0
    offset.left = 0
  }
  if (Node === document.body) { // 当该节点为body节点时，结束递归
    return offset
  }

  offset.top += Node.offsetTop
  offset.left += Node.offsetLeft

  return getOffset(Node.offsetParent, offset)// 向上累加offset里的值
}

/**
 * 获取元素样式
 * @param element
 * @param styleName
 * @returns {*}
 */
function getStyle (element, styleName) {
  if (!element || !styleName) return null
  styleName = styleName.replace(/([A-Z])/g, "-$1")
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/**
 * 设置样式
 * @param element
 * @param styleName
 * @param value
 */
function setStyle(element, styleName, value) {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    let str = '';
    Object.keys(styleName).reduce((prev, key) => {
      prev += styleName[key]
      prev += ';'
      return prev
    }, str)
    element.style.cssText = str
  } else {
    element.style[styleName] = value
  }
}

export default {
  hasClass,
  addClass,
  removeClass,
  bind,
  unbind,
  closest,
  proxy,
  contains,
  getScrollParent,
  getOffset,
  getStyle,
  setStyle
}