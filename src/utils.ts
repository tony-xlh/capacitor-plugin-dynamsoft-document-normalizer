import type { Point } from "dynamsoft-capture-vision-bundle";

export function intersectionOverUnion(pts1:Point[] ,pts2:Point[]) : number {
  const rect1 = getRectFromPoints(pts1);
  const rect2 = getRectFromPoints(pts2);
  return rectIntersectionOverUnion(rect1, rect2);
}

function rectIntersectionOverUnion(rect1:Rect, rect2:Rect) : number {
  const leftColumnMax = Math.max(rect1.left, rect2.left);
  const rightColumnMin = Math.min(rect1.right,rect2.right);
  const upRowMax = Math.max(rect1.top, rect2.top);
  const downRowMin = Math.min(rect1.bottom,rect2.bottom);

  if (leftColumnMax>=rightColumnMin || downRowMin<=upRowMax){
    return 0;
  }

  const s1 = rect1.width*rect1.height;
  const s2 = rect2.width*rect2.height;
  const sCross = (downRowMin-upRowMax)*(rightColumnMin-leftColumnMax);
  return sCross/(s1+s2-sCross);
}

function getRectFromPoints(points:Point[]) : Rect {
  if (points[0]) {
    let left:number;
    let top:number;
    let right:number;
    let bottom:number;
    
    left = points[0].x;
    top = points[0].y;
    right = 0;
    bottom = 0;

    points.forEach(point => {
      left = Math.min(point.x,left);
      top = Math.min(point.y,top);
      right = Math.max(point.x,right);
      bottom = Math.max(point.y,bottom);
    });

    const r:Rect = {
      left: left,
      top: top,
      right: right,
      bottom: bottom,
      width: right - left,
      height: bottom - top
    };
    
    return r;
  }else{
    throw new Error("Invalid number of points");
  }
}

export interface Rect {
  left:number;
  right:number;
  top:number;
  bottom:number;
  width:number;
  height:number;
}
