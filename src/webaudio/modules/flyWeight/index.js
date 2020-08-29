export default class FlyWeight {
    
    array;
    cursor;

    constructor(length) {
        if (length) {
            this.array = length ? new Array(length).fill(null) : null;
            this.cursor = length ? 0 : -1;
        }
    }

    static fromArray(source) {
        const buffer = new FlyWeight();
        buffer.array = Array.from(source);
        buffer.cursor = 0;
        return buffer;
    }

    ensureSlot() {
        // create a reusable holder object (if one doesn't exist)
        if(!this.array[this.cursor]) {
            this.array[this.cursor] = {}; 
        }
    }

    write(callback) {
        this.ensureSlot();
        callback(this.cursor, this.array);
        this.cursor++;
        if (this.cursor === this.array.length) {
            this.cursor = 0;
        }
    }

    writeAt(index, callback) {
        this.ensureSlot();
        callback(index, this.array);
    }

    iterateReverse(callback) {
        let cursor = this.cursor - 1;
        let j = this.array.length;
        while (j--) {
            if (cursor < 0) {
                cursor = this.array.length - 1; 
            }
            callback(cursor, this.array);
            cursor--;
        }
    }

    stitch() {
        // creates a new array of equal length, 
        // consistent of one or two slices (at most), first being from current index to end,
        // with second starting at 0 index, upto but not including the current cursor position,
        // thus straightening out the circular loop.

        const first = this.array.slice(this.cursor); 
        const second = this.cursor > 0 ? this.array.slice(0, this.cursor) : [];

        return first.concat(second);
    }
}