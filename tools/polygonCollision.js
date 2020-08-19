/**
*顶点类
*/
class Point {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
}

/**
*向量类 以(0, 0)点为起点
*/
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	getMagnitude() {		
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	dotProduct(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
	
	add(vector) {
		let x = this.x + vector.x;
		let y = this.y + vector.y;
		
		return new Vector(x, y);
	}
	
	substract(vector) {
		let x = this.x - vector.x;
		let y = this.y - vector.y;
		
		return new Vector(x, y);
	}
	
	edge(vector) {
		return this.substract(vector);
	}
	
	perpendicular() {
		let x = this.y;
		let y = 0 - this.x;
		
		return new Vector(x, y);
	}
	
	normalize() {
		let m = this.getMagnitude();
		let x = 0;
		let y = 0
		
		if(m !== 0) {
			x = this.x / m;
			y = this.y / m;
		}
		
		return new Vector(x, y);
	}
	
	// 获取单位向量的法向量（垂直）
	normal() {
		let v = this.perpendicular();
		
		return v.normalize();
	}
}

/**
*向量投影类
*/
class Projection {
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}
	
	// 检测两条投影是否重叠
	overlaps(projection) {
		return this.max > projection.min && projection.max > this.min
	}
}

/**
*多边形类
*/
class Polygon {
	constructor(cxt, points = [], opt = {}) {
		this.cxt = cxt;
		this.points = points;
		this.init(opt);
	}
	
	init(opt) {
		this.strokeStyle = opt.strokeStyle || 'rgba(50, 143, 66, .85)';
		this.fillStyle = opt.fillStyle || 'rgba(75, 143, 143, .75)';
	}
	
	addPoint(x, y) {
		this.points.push({ x, y });
	}
	
	stroke() {
		this.cxt.save();
		this.cxt.strokeStyle = this.strokeStyle;
		this.createPath();
		this.cxt.stroke();
		this.cxt.restore();
	}
	
	fill() {
		this.cxt.save();
		this.cxt.fillStyle = this.fillStyle;
		this.createPath();
		this.cxt.fill();
		this.cxt.restore();
	}
	
	createPath() {
		if (this.points.length === 0) return false;
		
		this.cxt.beginPath();
		
		for(let i = 0, len = this.points.length; i < len; i++) {
			let p = this.points[i];
			
			this.cxt.lineTo(p.x, p.y);
		}
		
		this.cxt.closePath();
	}
	
	isPointInPath(x, y) {
		this.createPath();
		
		return this.cxt.isPointInPath(x, y);
	}
	
	move(dx, dy) {
		for(let i = 0, len = this.points.length; i < len; i++) {
			let p = this.points[i];
			p.x += dx;
			p.y += dy;
		}
	}
	
	collidesWith(polygon) {
		return polygonCollidesWithPolygon(this, polygon);
	}
	
	getAxes() {
		return getAxes(this);
	}
	
	project(axis) {
		return project(this, axis);
	}
}

function polygonCollidesWithPolygon(polygon1, polygon2) {
	if (!separationOnAxes(polygon1, polygon2)) return true;
	return false;
}

function separationOnAxes(polygon1, polygon2) {
	let axes = polygon1.getAxes().concat(polygon2.getAxes());
	
	for(let i = 0, len = axes.length; i < len; i++) {
		let axis = axes[i];
		let project1 = polygon1.project(axis);
		let project2 = polygon2.project(axis);
		
		if (!project1.overlaps(project2)) return true;
	}
	
	return false;
}


/**
*获得多边形距离圆心最近的顶点
*@param {Polygon} polygon 多边形
*@param {Circle} circle 圆形
*@return {Point} closestPoint 距离圆心最近的顶点
*/
function getPolygonClosestOnCircle(polygon, circle) {
	let minDist = Infinity;
	let closestPoint = {};
	let points = polygon.points;
	
	for(let i = points.length - 1; i >= 0; i--) {
		let p = points[i];
		let pDist = Math.abs(Math.sqrt(Math.pow(circle.x - p.x) + Math.pow(circle.y - p.y)));
		
		if (minDist > pDist) {
			minDist = pDist;
			closestPoint.x = p.x;
			closestPoint.y = p.y;
		}
	}
	
	return closestPoint;
}

/**
*检测多边形是否与圆形发生碰撞
*@param {Polygon} polygon 多边形
*@param {Circle} circle 圆形
*@return {Boolean} 是否发生碰撞
*/
function polygonCollidesWithCircle(polygon, circle) {
	let closestPoint = getPolygonClosestOnCircle(polygon, circle);
	let v1 = new Vector(closestPoint.x, closestPoint.y);
	let v2 = new Vector(circle.x, circle.y);
	let axis = v1.edge(v2).normal()；
	let project1 = project(polygon, axis);
	let project2 = project(circle, axis);
	
	return !project1.overlaps(project2);
	
}

function getAxes(polygon) {
	let axes = [];
	let v1 = new Vector();
	let v2 = new Vector();
	
	for(let i = 0, len = polygon.points.length; i < len; i++) {
		let p1 = polygon.points[i];
		let p2 = polygon.points[(i + 1) % len];
		
		v1.x = p1.x;
		v1.y = p1.y;
		v2.x = p2.x;
		v2.y = p2.y;
		
		axes.push(v1.edge(v2).normal());
	}
	
	return axes;
}

function project(shape, axis) {
	let scalars = [];
	let v = new Vector();
	
	if (shape.points) {
		shape.points.map(p => {
			v.x = p.x;
			v.y = p.y;
			
			scalars.push(v.dotProduct(axis));
		});
	} else {
		v.x = shape.x;
		v.y = shape.y;
		
		let dp = v.dotProduct(axis);
		
		scalars.push(dp)
		scalars.push(dp + shape.r);
		scalars.push(dp - shape.r);
	}
	
	scalars.sort((a, b) => (a - b));
	
	let min = scalars[0];
	let max = scalars[scalars.length - 1];
	
	return new Projection(min, max);
}

export { Point, Polygon }