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
	
	// return a scalar
	getMagnitude() {		
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	// return a scalar
	dotProduct(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
	
	// return a vector
	multiple(scalar) {
		let x = scalar * this.x;
		let y = scalar * this.y;
		
		return new Vector(x, y);
	}
	
	// return a vector
	add(vector) {
		let x = this.x + vector.x;
		let y = this.y + vector.y;
		
		return new Vector(x, y);
	}
	
	// return a vector
	subtract(vector) {
		// let x = this.x - vector.x;
		// let y = this.y - vector.y;
		let minusVector = vector.multiple(-1)
		let x = this.x + minusVector.x;
		let y = this.y + minusVector.y;
		
		return new Vector(x, y);
	}
	
	// return a vector
	edge(vector) {
		return this.subtract(vector);
	}
	
	// return a perpendicular vector
	perpendicular() {
		let x = this.y;
		let y = 0 - this.x;
		
		return new Vector(x, y);
	}
	
	// return a unit vector
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
	
	// 获取法向量（垂直）的单位向量
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
	
	// 返回两条投影重叠部分的长度
	overlap(projection) {
		let overlap = 0;
		
		if (this.overlaps(projection)) {
			let max = Math.min(this.max, projection.max);
			let min = Math.max(projection.min, this.min);
			
			overlap = Math.abs(max - min);
		}
		
		return overlap;
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
	
	boundingBox() {
		let left = Infinity;
		let right = -Infinity;
		let top = Infinity;
		let bottom = -Infinity;
		let width;
		let height;
		let halfWidth;
		let halfHeight;
		
		for(let i = 0, len = this.points.length; i < len; i++) {
			let p = this.points[i];
			
			if (left > p.x) left = p.x;
			if (right < p.x) right = p.x;
			if (top > p.y) top = p.y;
			if (bottom < p.y) bottom = p.y;
		}
		
		width = Math.abs(right - left);
		height = Math.abs(bottom - top);
		halfWidth = width / 2;
		halfHeight = height / 2;
		
		return {
			left,
			right,
			top,
			bottom,
			width,
			height,
			halfWidth,
			halfHeight
		};
	}
	
	centroid() {
		let bbox = this.boundingBox();
		
		return new Point(bbox.left + bbox.halfWidth, bbox.top + bbox.halfHeight);
	}
	
	move(dx, dy) {
		for(let i = 0, len = this.points.length; i < len; i++) {
			let p = this.points[i];
			p.x += dx;
			p.y += dy;
		}
	}
	
	collidesWith(shape) {
		if (shape.points) {
			return polygonCollidesWithPolygon(this, shape);
		} else {
			return polygonCollidesWithCircle(this, shape);
		}
	}
	
	getAxes() {
		return getAxes(this);
	}
	
	project(axis) {
		return project(this, axis);
	}
}

/**
*圆形类
*/
class Circle {
	constructor(cxt, cx, cy, r, opt = {}) {
		this.cxt = cxt;
		this.x = cx;
		this.y = cy;
		this.r = r;
		this.init(opt);
	}
	
	init(opt) {
		this.strokeStyle = opt.strokeStyle || 'rgba(50, 143, 66, .85)';
		this.fillStyle = opt.fillStyle || 'rgba(75, 143, 143, .75)';
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
		this.cxt.beginPath();
		this.cxt.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		this.cxt.closePath();
	}
	
	isPointInPath(x, y) {
		this.createPath();
		
		return this.cxt.isPointInPath(x, y);
	}
	
	boundingBox() {
		let left = this.x - this.r;
		let right = this.x + this.r;
		let top = this.y - this.r;
		let bottom = this.y + this.r;
		let width = Math.abs(right - left);
		let height = width;
		let halfWidth = width / 2;
		let halfHeight = halfWidth;
		
		return {
			left,
			right,
			top,
			bottom,
			width,
			height,
			halfWidth,
			halfHeight
		};
	}
	
	centroid() {
		return new Point(this.x, this.y);
	}
	
	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
	
	collidesWith(shape) {
		if (shape.points) {
			return polygonCollidesWithCircle(shape, this);
		} else {
			let dist = Math.sqrt(Math.pow(this.x - shape.x, 2) + Math.pow(this.y - shape.y, 2));
			let rDist = this.r + shape.r;
			let centroid1 = this.centroid();
			let centroid2 = shape.centroid();
			let centroid1Vector = new Vector(centroid1.x, centroid1.y);
			let centroid2Vector = new Vector(centroid2.x, centroid2.y);
			let centroid21Vector = centroid1Vector.subtract(centroid2Vector);
			let centroid21UnitVector = centroid21Vector.normalize();
			let overlap = 0;
			
			if (dist < rDist) {
				overlap = Math.abs(rDist - dist);
				
				return {
					axis: centroid21UnitVector,
					overlap
				};
			}
			
			return {
				axis: undefined,
				overlap
			};
		}
		
	}
	
	getAxes() {
		return undefined;
	}
	
	project(axis) {
		return project(this, axis);
	}
}

/**
*检测两个图形在所有的检测轴上是否存在间隙
*@param {Array} axes 所有的检测轴
*@param {Object} shape1 图形1
*@param {Object} shape2 图形2
*@return {Boolean} 检测结果
*/
function separationOnAxes(axes, shape1, shape2) {
	
	for(let i = 0, len = axes.length; i < len; i++) {
		let axis = axes[i];
		let project1 = shape1.project(axis);
		let project2 = shape2.project(axis);
		
		if (!project1.overlaps(project2)) return true;
	}
	
	return false;
}

/**
*检测两个图形在所有的检测轴上是否存在间隙 并返回最小平移向量
*@param {Array} axes 所有的检测轴
*@param {Object} shape1 图形1
*@param {Object} shape2 图形2
*@return {Object} 最小平移向量
*/
function minimumTranslationVector(axes, shape1, shape2) {
	let overlap;
	let leastAxis;
	let leastOverlap = Infinity;

	for(let i = 0, len = axes.length; i < len; i++) {
		let axis = axes[i];
		let project1 = shape1.project(axis);
		let project2 = shape2.project(axis);
		overlap = project1.overlap(project2);
		
		if (overlap === 0) {
			return {
				axis: undefined,
				overlap: 0
			};
		}
		
		if (overlap < leastOverlap) {
			leastAxis = axis;
			leastOverlap = overlap;
		}
	}
	
	return {
		axis: leastAxis,
		overlap: leastOverlap
	};
}

/**
*检测并修改最小平移向量的方向
*@param {Object} shape1 图形1
*@param {Object} shape2 图形2
*@param {Object} mtv 最小平移向量
*@return {Object} 修改后的最小平移向量
*/
function changeMTVDirection(shape1, shape2, mtv) {
	let centroid1 = shape1.centroid();
	let centroid2 = shape2.centroid();
	let centroid1Vector = new Vector(centroid1.x, centroid1.y);
	let centroid2Vector = new Vector(centroid2.x, centroid2.y);
	let centroid12Vector = centroid2Vector.subtract(centroid1Vector);
	let centroid12UnitVector = centroid12Vector.normalize();
	
	if (typeof mtv.axis === 'undefined') {
		mtv.axis = centroid12UnitVector;
	}
	
	if (centroid12UnitVector.dotProduct(mtv.axis) > 0) {
		mtv.axis = mtv.axis.multiple(-1);
	}
	
	return mtv;
}

/**
*根据最小平移向量将图形1从图形2上分离
*@param {Object} shape1 图形1
*@param {Object} shape2 图形2
*@param {Object} mtv 最小平移向量
*@return {Void}
*/
function separate(shape1, shape2, mtv) {
	let dx;
	let dy;
	mtv = changeMTVDirection(shape1, shape2, mtv);
	dx = mtv.axis.x * mtv.overlap;
	dy = mtv.axis.y * mtv.overlap;
	shape1.move(dx, dy);
}

/**
*根据最小平移向量和图形1的运动速度，计算图形1与图形2碰撞的反射向量
*@param {Object} shape1 图形1
*@param {Object} shape2 图形2
*@param {Object} mtv 最小平移向量
*@param {Object} velocity 图形1的运动速度
*@return {Object} 反射向量
*/
function bounce(shape1, shape2, mtv, velocity) {
	let edgeUnitVector = mtv.axis.perpendicular();
	let velocityVector = new Vector(velocity.x, velocity.y);
	let velocityUnitVector = velocityVector.normalize();
	let edgeVector = edgeUnitVector.multiple(velocityVector.dotProduct(edgeUnitVector));
	let reflectVector = edgeVector.multiple(2).subtract(velocityVector);
	
	return reflectVector;
}

/**
*检测图形是否与边界碰撞
*@param {Object} shape 图形
*@param {Number} boundingLeft 左边界
*@param {Number} boundingRight 右边界
*@param {Number} boundingTop 上边界
*@param {Number} boundingBottom 下边界
*@param {Function} handler 处理函数
*@return {Object} 与边界碰撞情况
*/
function detectCollisionsWithBounding(shape, boundingLeft, boundingRight, boundingTop, boundingBottom, handler) {
	if (typeof shape === 'undefined') throw 'parameter shape missing';
	if (typeof boundingLeft === 'undefined') throw 'parameter boundingLeft missing';
	if (typeof boundingRight === 'undefined') throw 'parameter boundingRight missing';
	if (typeof boundingTop === 'undefined') throw 'parameter boundingTop missing';
	if (typeof boundingBottom === 'undefined') throw 'parameter boundingBottom missing';
	
	let bbox = shape.boundingBox();
	let hasCollision = false;
	let collidesWith = {
		left: false,
		right: false,
		top: false,
		bottom: false
	};
	
	// 与左边界发生碰撞
	if (bbox.left < boundingLeft) {
		hasCollision = true;
		collidesWith.left = true;
	}
	
	// 与右边界发生碰撞
	if (bbox.right > boundingRight) {
		hasCollision = true;
		collidesWith.right = true;
	}
	
	// 与上边界发生碰撞
	if (bbox.top < boundingTop) {
		hasCollision = true;
		collidesWith.top = true;
	}
	
	// 与下边界发生碰撞
	if (bbox.bottom > boundingBottom) {
		hasCollision = true;
		collidesWith.bottom = true;
	}
	
	if (hasCollision) {
		typeof handler === 'function' && handler.call(null, collidesWith);
	}
	
	return collidesWith;
}

/**
*检测两个多边形是否发生碰撞
*@param {Polygon} polygon1 多边形1
*@param {Polygon} polygon2 多边形2
*@return {Boolean} 检测结果
*/
function polygonCollidesWithPolygon(polygon1, polygon2) {
	let axes = polygon1.getAxes().concat(polygon2.getAxes());
	
	// return !separationOnAxes(axes, polygon1, polygon2)
	return minimumTranslationVector(axes, polygon1, polygon2);
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
		let pDist = Math.abs(Math.sqrt(Math.pow(circle.x - p.x, 2) + Math.pow(circle.y - p.y, 2)));
		
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
	let axes = polygon.getAxes();
	let closestPoint = getPolygonClosestOnCircle(polygon, circle);
	let v1 = new Vector(closestPoint.x, closestPoint.y);
	let v2 = new Vector(circle.x, circle.y);
	axes.push(v1.edge(v2).normal());
	
	// return !separationOnAxes(axes, polygon, circle);
	return minimumTranslationVector(axes, polygon, circle);
	
}

/**
*获取多边形的所有检测轴
*@param {Polygon} polygon 多边形
*@return {Array} axes 存储所有检测轴的数组
*/
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

/**
*获取图形在检测轴上的投影
*@param {Object} shape 图形1
*@param {Vector} axis 检测轴
*@return {Projection} 投影对象
*/
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

export { Point, Polygon, Circle, separate, bounce, detectCollisionsWithBounding }