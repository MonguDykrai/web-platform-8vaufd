class Circle {
  constructor({ xpoint, ypoint, radius, color, context }) {
    this.xpoint = xpoint;
    this.ypoint = ypoint;
    this.radius = radius;
    this.color = color;
    this.context = context;
  }

  draw() {
    console.log(this.context, 433);
    this.context.beginPath();
    this.context.arc(
      this.xpoint,
      this.ypoint,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    this.context.strokeStyle = 'grey';
    this.context.lineWidth = 3;
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }
}
