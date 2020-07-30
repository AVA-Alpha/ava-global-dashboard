class Mediator {
    constructor() {
        this.objectArray = []
    }

    push(obj) {
        this.objectArray.push(obj)
    }

    highlightTime(start, end) {
        for(var i = 0; i<this.objectArray.length; i++) {
            this.objectArray[i].highlightTime(start, end)
        }
    }

    unHighlightTime(start, end) {
        for(var i = 0; i<this.objectArray.length; i++) {
            this.objectArray[i].unHighlightTime(start, end)
        }
    }
}