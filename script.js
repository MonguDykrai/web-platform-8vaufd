class Rectangle {
  constructor(xpoint, ypoint, width, height, color, context) {
    this.xpoint = xpoint;
    this.ypoint = ypoint;
    this.width = width;
    this.height = height;
    this.color = color;
    this.path2DInstance = null;
    this.context = context; // 画布上下文
    this.isTarget = false; // 事件对象
    this.uuid = Date.now() + `${parseInt(Math.random() * 10000000)}`;
  }

  draw(color = '') {
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath
    // https://www.rgraph.net/blog/path-objects.html
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
    this.path2DInstance = new Path2D();
    this.path2DInstance.rect(this.xpoint, this.ypoint, this.width, this.height);
    this.context.strokeStyle = 'red'; // 路径颜色
    this.context.lineWidth = 3; // 路径宽度
    // this.context.fillStyle = color || this.color; // 填充的颜色
    this.context.stroke(this.path2DInstance); // 绘制路径
    // this.context.fill(this.path2DInstance); // 填色
  }

  /**
   * 激活元素（用户选中元素）
   */
  activity() {
    this.draw('yellow');
  }

  /**
   * 元素失活与被元素激活相对
   */
  inactivity() {
    this.draw(this.color);
  }

  clickRectangle(xmouse, ymouse) {
    this.inactivity(); // 变更为失活状态

    if (this.context.isPointInPath(this.path2DInstance, xmouse, ymouse)) {
      this.isTarget = true;
    } else {
      this.isTarget = false;
    }
  }
}

class Canvas {
  constructor({
    width,
    height,
    canvasId,
    backgroundColor = '#444',
    domCanvasId,
  }) {
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;
    this.backgroundColor = backgroundColor;
    this.domCanvas = document.getElementById(domCanvasId);
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // this.addClickEventListener();
    this.eles = [];
    this.target = null; // 事件对象
    this.circle = null; // drawRect step1 的 circle 实例
  }

  /**
   * rect | line
   */
  addClassnameCrosshair(mode = 'rect') {
    if (mode === 'rect') {
      if (!this.canvas.classList.contains('cursor-crosshair')) {
        this.canvas.classList.add('cursor-crosshair');
      }
    }

    if (mode === 'line') {
      if (!this.canvas.classList.contains('cursor-crosshair')) {
        this.canvas.classList.add('cursor-crosshair');
      }
      if (!this.domCanvas.classList.contains('cursor-crosshair')) {
        this.domCanvas.classList.add('cursor-crosshair');
      }
    }
  }

  /**
   * rect | line
   */
  removeClassnameCrosshair(mode = 'rect') {
    if (mode === 'rect') {
      if (this.canvas.classList.contains('cursor-crosshair')) {
        this.canvas.classList.remove('cursor-crosshair');
      }
    }

    if (mode === 'line') {
      if (this.canvas.classList.contains('cursor-crosshair')) {
        this.canvas.classList.remove('cursor-crosshair');
      }
      if (this.domCanvas.classList.contains('cursor-crosshair')) {
        this.domCanvas.classList.remove('cursor-crosshair');
      }
    }
  }

  // 打印绘制矩形的 x, y
  printDrawRectClickEventHandlerPoint(e) {
    if (document.getElementById('layerInfoId')) {
      const div = document.getElementById('layerInfoId');
      div.textContent = `layerX: ${e.layerX}, layerY: ${e.layerY}`;
    } else {
      const div = document.createElement('div');
      div.id = 'layerInfoId';
      div.textContent = `layerX: ${e.layerX}, layerY: ${e.layerY}`;
      document.body.appendChild(div);
    }
  }

  // drawRect 事件句柄
  drawRectClickEventHandler(e) {
    this.printDrawRectClickEventHandlerPoint(e);
    // console.log(e);
    // console.log(e.layerX, e.layerY);
    // console.log(Circle);
    const circle = new Circle({
      xpoint: e.layerX,
      ypoint: e.layerY,
      radius: 5,
      color: 'blue',
      context: this.context,
    });
    this.circle = circle; // 缓存 circle 实例
    // console.log(circle);
    circle.draw();
  }

  /**
   * 清空画布
   */
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 绘制矩形
  drawRect() {
    console.log('drawRect');
    this.addClassnameCrosshair();

    this.canvas.addEventListener(
      'click',
      this.drawRectClickEventHandler.bind(this)
    );

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.circle) {
        this.clearCanvas(); // 清空整张画布
        this.circle.draw(); // 重新把实心圆画上
        const x1 = this.circle.xpoint;
        const y1 = this.circle.ypoint;
        const x2 = e.layerX;
        const y2 = e.layerY;
        let pointX = -1;
        let pointY = -1;
        let width = -1;
        let height = -1;
        if (x2 < x1) {
          // x2 比 x1 的值小则 pointX 的值应该取 x2 的
          pointX = x2;
          // x2 比 x2 的值小则 width 为 x1 - x2 的值
          width = x1 - x2;
        } else if (x1 < x2) {
          // x1 比 x2 的值小则 pointX 的值应该取 x1 的
          pointX = x1;
          // x1 比 x2 的值小则 width 为 x2 - x1 的值
          width = x2 - x1;
        }
        if (y2 < y1) {
          // y2 比 y1 的值小则 pointY 的值应该取 y2 的
          pointY = y2;
          // y2 比 y1 的值小则 height 为 y1 - y2 的值
          height = y1 - y2;
        } else if (y1 < y2) {
          // y1 比 y2 的值小则 pointY 的值应该取 y1 的
          pointY = y1;
          // y1 比 y2 的值小则 height 为 y2 - y1 的值
          height = y2 - y1;
        }
        const currentDrawingRect = new Rectangle(
          pointX,
          pointY,
          width,
          height,
          'red',
          this.context
        );
        currentDrawingRect.draw(); // 会画出一个实心的矩形，需要做处理，每次画时先清除先前画的
      }
    });
  }

  // 结束绘制矩形
  stopDrawRect() {
    console.log('stopDrawRect');
    this.removeClassnameCrosshair();
  }

  // 开始标定
  drawLine() {
    console.log('drawLine');
    this.addClassnameCrosshair('line');
  }

  // 结束标定
  stopDrawLine() {
    this.removeClassnameCrosshair('line');
  }

  // 具体绘制矩形的函数
  addRect({ x, y, width, height, color }) {
    const rect = new Rectangle(x, y, width, height, color, this.context);
    this.eles.push(rect);
    rect.draw();
  }

  /**
   * 给 Canvas 画布注册 click 事件，监听用户点击了哪个 Rectangle 实例
   */
  addClickEventListener(isStopBubble = false) {
    this.canvas.addEventListener('click', (event) => {
      // debugger;
      this.eles.forEach((ele) => (ele.isTarget = false)); // 重置 isTarget

      if (isStopBubble) {
      } else {
        this.eles.forEach((ele) => {
          ele.clickRectangle(event.layerX, event.layerY);
        });
      }

      const targets = this.eles.filter((ele) => ele.isTarget);
      if (targets.length) {
        let targetIndex = 0; // 目标事件对象索引
        let target = targets.pop(); // 取出事件对象
        target.activity(); // 激活目标事件对象
        this.eles.some((ele, index) => {
          if (ele.uuid === target.uuid) {
            targetIndex = index;
            return true;
          }
        });
        this.eles.splice(targetIndex, 1); // 将事件对象从元素列表中移除（被点击的元素优先级需要提高！！！）
        // this.target = target; // 用户当前选中的元素
        this.eles.push(target); // 将事件对象添加到元素列表最后，保证元素被赋予最高优先级
      }
    });
  }
}

const canvas = new Canvas({
  canvasId: 'canvas',
  domCanvasId: 'holograph', // 雷达全息图画布ID
  width: document.getElementById('combination').getBoundingClientRect().width, // 获取父容器的宽度
  height: 350,
});

// canvas.addRect({
//   x: 100,
//   y: 100,
//   width: 40,
//   height: 60,
//   color: 'orange',
// });

// canvas.addRect({
//   x: 120,
//   y: 120,
//   width: 40,
//   height: 60,
//   color: 'purple',
// });

// canvas.addRect({
//   x: 90,
//   y: 90,
//   width: 40,
//   height: 60,
//   color: 'ivory',
// });
