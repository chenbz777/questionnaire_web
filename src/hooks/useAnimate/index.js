const animateElement = (element, animation) => {

  if (!element) {
    return false;
  }

  if (!animation) {
    return false;
  }

  // 动画名称
  const animationName = animation.includes('animate__') ? animation : `animate__${animation}`;

  // 获取元素
  const node = document.querySelector(element);

  // 判断元素是否存在
  if (!node) {
    return false;
  }

  // 判断动画是否存在
  if (node.classList.contains(animationName)) {
    return false;
  }

  node.classList.add('animate__animated', animationName);

  // 动画执行完毕后的回调
  function handleAnimationEnd(event) {

    event.stopPropagation();

    node.classList.remove('animate__animated', animationName);
  }

  // 监听动画执行完毕
  node.addEventListener('animationend', handleAnimationEnd, { once: true });
};


export default function useAnimate() {
  return {
    animateElement
  };
}