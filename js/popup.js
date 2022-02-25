export class Popup {
    static _nodes = [];

    constructor(node) {
        this._node = node;
        Popup._nodes.push(this);
    }

    get node() { 
        return this._node;
    }

    open() {
        if(this.isOpened()) return;

        Popup._nodes.forEach(item => item.close());

        this.node?.classList.add('active');
        this.node?.dispatchEvent(new CustomEvent('open'));   
    }
    close() {
        if(!this.isOpened()) return;

        this.node?.classList.remove('active');
        this.node?.dispatchEvent(new CustomEvent('close'));
    }
    
    isOpened() {
        return this.node?.classList.contains('active');
    }
}