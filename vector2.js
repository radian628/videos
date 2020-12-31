function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function between(value, min, max) {
    return value == clamp(value, min, max);
}

function betweenExclusive(value, min, max) {
    return (value > min) && (value < max);
}

/** 2-Dimensional Vector Class */
export class V2 {
    /**
     * Vector constructor.
     * @param {number} x - X component of vector.
     * @param {number} y - Y component of vector.
     * 
     * Vector constructor.
     * @param {V2} x - Create copy of vector x.
     */
    constructor(x, y) {
        if (y === undefined && x instanceof V2) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Sets the vector's components.
     * @param {number} x - X component of vector. 
     * @param {number} y - Y component of vector.
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Create a vector from polar coordinates.
     * @param {number} angle - Angle of vector relative to the X axis.
     * @param {number} length - Magnitude of vector.
     */
    static fromPolar(angle, length) {
        return new V2(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    /**
     * Method derived from explanation here: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
     * Determine whether two lines (defined by a start and end point) intersect.
     * @param {V2} s1 - Start of first line.
     * @param {V2} e1 - End of first line.
     * @param {V2} s2 - Start of second line.
     * @param {V2} e2 - End of second line.
     */
    static areLineSegmentsIntersecting(s1, e1, s2, e2) {
        let l1 = new V2(e1).sub(s1);
        let l2 = new V2(e2).sub(s2);

        let startDiff = new V2(s2).sub(s1);

        let testValue1 = V2.cross2d(l1, l2);
        let testValue2 = V2.cross2d(startDiff, l1);

        let intersecting = false;

        if (testValue1 == 0 && testValue2 == 0) {
            let l1dot = V2.dot(l1, l1);

            let t0 = between(V2.dot(startDiff, l1) / l1dot, 0, 1);
            let t1 = t0 + V2.dot(l2, l1) / l1dot;

            intersecting = betweenExclusive(t0, 0, 1) || betweenExclusive(t1, 0, 1) || (t1 > 1 && t0 < 0) || (t0 > 1 && t1 < 0);
        } else if (testValue1 != 0) {

            let t = V2.cross2d(startDiff, l2) / testValue1;
            let u = V2.cross2d(startDiff, l1) / testValue1;

            intersecting = betweenExclusive(t, 0, 1) && betweenExclusive(u, 0, 1);

        }

        return intersecting
    }

    /**
     * Returns length of vector.
     */
    length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Adds another vector to this, and returns this vector.
     * @param {V2} v - The vector to add
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Subtracts another vector from this, and returns this vector.
     * @param {V2} v - The vector to subtract.
     */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiplies this vector by a scalar, and returns this vector.
     * @param {number} s - The number to multiply by.
     */
    mult(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /**
     * Divides this vector by a scalar, and returns this vector.
     * @param {number} s - The number to divide by.
     */
    div(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    /**
     * Changes the vector's length such that it is one, but retains the direction, then returns it.
     */
    normalize() {
        let len = this.length();
        this.div(len);
        return this;
    }

    /**
     * Scales the vector to a specific length while retaining its direction, and then returns it.
     * @param {number} s - The new length of the vector.
     */
    rescale(s) {
        this.normalize().mult(s);
        return this;
    }

    /**
     * Rotates a vector.
     * @param {number} angle - The number of radians to rotate by.
     */
    rotate(angle) {
        let v = V2.fromPolar(this.angle() + angle, this.length());
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * Returns the vector's angle relative to the x axis.
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the distance between this vector and another vector.
     * @param {V2} v - The vector to compare to. 
     */
    getDistanceTo(v) {
        return new V2(this).sub(v).length();
    }

    /**
     * Returns the direction pointing from the position corresponding to this vector, to the position correspondong to another vector.
     * @param {V2} v - The vector to point towards.
     */
    getDirectionTo(v) {
        let diff = new V2(v).sub(this);
        return diff.angle();
    }

    /**
     * Component-wise vector multiplication.
     * @param {V2} v - Vector to multiply by.
     */
    componentwiseMultiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    /**
     * Component-wise vector division.
     * @param {V2} v - Vector to divide by.
     */
    componentwiseDivide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    /**
     * 2-dimensional vector cross product.
     * @param {V2} v - First vector in cross product operation.
     * @param {V2} w - Second vector in cross product operation.
     */
    static cross2d(v, w) {
        return v.x * w.y - v.y * w.x;
    }

    /**
     * 2-dimensional vector dot product.
     * @param {V2} v - First vector in dot product operation.
     * @param {V2} w - Second vector in dot product operation.
     */
    static dot(v, w) {
        return v.x * w.y + v.x * w.y;
    }
}