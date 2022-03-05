export class Popup {
    static _nodes = [];

    constructor(node) {
        if(!node) throw new Error('dom element is undefined at new Popup');

        this._node = node;
        this._class = 'active';
        Popup._nodes.push(this);
    }

    get node() { 
        return this._node;
    }

    open() {
        if(this.isOpened()) return;

        Popup._nodes.forEach(item => item.close());

        this.node.classList.add(this._class);
        this.node.dispatchEvent(new CustomEvent('open'));   
    }
    close() {
        if(!this.isOpened()) return;

        this.node.classList.remove(this._class);
        this.node.dispatchEvent(new CustomEvent('close'));
    }
    
    isOpened() {
        return this.node.classList.contains(this._class);
    }
}