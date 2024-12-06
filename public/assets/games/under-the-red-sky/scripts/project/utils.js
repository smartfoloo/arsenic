//Utils class written by Federico Calchera, MIT License

export default class Utils {

    static get halfPI() {
        return 1.5708
    };

    //math
    static lerp(a, b, alpha) {
        return a + alpha * (b - a)
    };

    static unlerp(min, max, value) {
        return (value - min) / (max - min);
    };

    static remap(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    };

    static wrap0(value, max) {
        return (value % max + max) % max;
    };

    static wrap = function wrap(value, min, max) {
        const diff = max - min;
        if (diff === 0)
            return max;
        if (value < min) {
            const r = max - (min - value) % diff;
            return r === max ? 0 : r
        } else
            return min + (value - min) % diff
    }

    static clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    };

    static unrotate(angle, instX, instY, x, y) {
        return Math.cos(angle) * (x - instX) - Math.sin(angle) * (y - instY)
    };

    static snap(value, step) {
        return Math.floor(value / step) * step;
    };

    static flipAngleHorizontally(angle) {
        return 180 - angle
    }
    static flipAngleVertically(angle) {
        return 360 - angle
    }

    static wrapDegrees(degrees) {
        (degrees % 360 + 360) % 360
    }

    //conversion
    static toRadians(degrees) {
        return degrees * (Math.PI / 180)
    };

    static toDegrees(radians) {
        return (radians * 180) / Math.PI
    };

    //data
    static deduplicateArray(arr) {
        return [...new Set(arr)]
    };

	
}
