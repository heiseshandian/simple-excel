type Properties = Omit<RemoveMethods<CanvasRenderingContext2D>, "canvas">;

export class Canvas {
  ctx: CanvasRenderingContext2D;

  constructor(readonly target: HTMLCanvasElement) {
    const ctx = target.getContext("2d");
    if (!ctx) throw new Error("getContext(2d) is null");
    this.ctx = ctx;
  }

  size(width: number, height: number) {
    const { target, ctx: ctx } = this;
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;

    const dpr = window.devicePixelRatio;
    target.width = width * dpr;
    target.height = height * dpr;

    ctx.scale(dpr, dpr);
  }

  prop(props: Partial<Properties>): Canvas;
  prop(key: keyof Properties): any;
  prop(key: keyof Properties, value: any): Canvas;
  prop(key: any, value?: any): any {
    if (value) {
      (this.ctx as any)[key] = value;
      return this;
    }
    if (typeof key === "string") {
      return (this.ctx as any)[key];
    }
    Object.assign(this.ctx, key);
    return this;
  }

  // Paths
  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  closePath() {
    this.ctx.closePath();
    return this;
  }

  moveTo(x: number, y: number) {
    this.ctx.moveTo(x, y);
    return this;
  }

  lineTo(x: number, y: number) {
    this.ctx.lineTo(x, y);
    return this;
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.ctx.quadraticCurveTo(cpx, cpy, x, y);
    return this;
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this.ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    return this;
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.ctx.arcTo(x1, y1, x2, y2, radius);
    return this;
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this.ctx.ellipse(
      x,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise
    );
    return this;
  }

  rect(x: number, y: number, width: number, height: number) {
    this.ctx.rect(x, y, width, height);
    return this;
  }

  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radii?: number | DOMPointInit | Iterable<number | DOMPointInit>
  ) {
    this.ctx.roundRect(x, y, width, height, radii);
    return this;
  }

  // Drawing paths
  fill(fillRule?: CanvasFillRule) {
    this.ctx.fill(fillRule);
    return this;
  }

  stroke() {
    this.ctx.stroke();
    return this;
  }

  clip(fillRule?: CanvasFillRule) {
    this.ctx.clip(fillRule);
    return this;
  }

  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule) {
    return this.ctx.isPointInPath(x, y, fillRule);
  }

  isPointInStroke(x: number, y: number) {
    return this.ctx.isPointInStroke(x, y);
  }

  // Transformations
  getTransform() {
    return this.ctx.getTransform();
  }

  rotate(angle: number) {
    this.ctx.rotate(angle);
    return this;
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y);
    return this;
  }

  translate(x: number, y: number) {
    this.ctx.translate(x, y);
    return this;
  }

  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    this.ctx.setTransform(a, b, c, d, e, f);
    return this;
  }

  // Drawing images
  drawImage(image: CanvasImageSource, dx: number, dy: number) {
    this.ctx.drawImage(image, dx, dy);
    return this;
  }

  // Pixel manipulation
  createImageData(width: number, height: number) {
    return this.ctx.createImageData(width, height);
  }

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    return this.ctx.getImageData(sx, sy, sw, sh);
  }

  putImageData(imageData: ImageData, dx: number, dy: number) {
    this.ctx.putImageData(imageData, dx, dy);
    return this;
  }

  // draw line
  line(x1: number, y1: number, x2: number, y2: number) {
    this.moveTo(x1, y1).lineTo(x2, y2).stroke();
    return this;
  }

  // Drawing rectangles
  clearRect(x: number, y: number, width: number, height: number) {
    this.ctx.clearRect(x, y, width, height);
    return this;
  }

  fillRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x, y, width, height);
    return this;
  }

  strokeRect(x: number, y: number, width: number, height: number) {
    this.ctx.strokeRect(x, y, width, height);
    return this;
  }

  // Drawing text
  fillText(text: string, x: number, y: number, maxWidth?: number) {
    this.ctx.fillText(text, x, y, maxWidth);
    return this;
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this.ctx.strokeText(text, x, y, maxWidth);
    return this;
  }

  measureText(text: string) {
    return this.ctx.measureText(text);
  }

  // Line styles
  getLineDash() {
    return this.ctx.getLineDash();
  }

  setLineDash(segments: number[]) {
    this.ctx.setLineDash(segments);
    return this;
  }

  // Gradients and patterns
  createLinearGradient(x0: number, y0: number, x: number, y: number) {
    return this.ctx.createLinearGradient(x0, y0, x, y);
  }

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ) {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  createPattern(image: CanvasImageSource, repetition: string) {
    return this.ctx.createPattern(image, repetition);
  }

  // The canvas state
  save() {
    this.ctx.save();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }
}
