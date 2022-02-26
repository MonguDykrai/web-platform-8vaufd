function addLine(id, x1, y1, x2, y2) {
  const canvas = document.getElementById(id);
  const newLine = document.createElement('div');
  newLine.classList.add('line');
  // 求两点之间的距离 https://zhidao.baidu.com/question/2122016758828229227.html
  // Math.sqrt() 函数返回一个数的平方根
  // Math.pow() 函数返回基数（base）的指数（exponent）次幂，即 base^exponent。
  const length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  // Math.atan2() 返回从原点(0,0)到(x,y)点的线段与x轴正方向之间的平面角度(弧度值)，也就是Math.atan2(y,x)
  // Math.atan2((y2 - y1), (x2 - x1)) 求弧度
  // 弧度 * (180 / Math.PI) 求角度
  // const ang = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  newLine.style.left = `${x1}px`;
  newLine.style.top = `${y1}px`;
  newLine.style.width = `${length}px`;
  newLine.style.transform = `rotate(${ang}deg)`;

  newLine.addEventListener('click', (e) => {
    console.log(e);
  });

  canvas.appendChild(newLine);
}

// addLine('container', 50, 40, 100, 180);
// addLine('container', 80, 50, 50, 150);
// addLine('container', 50, 50, 150, 50);
