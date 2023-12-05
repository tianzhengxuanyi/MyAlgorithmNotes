export class Node {
    data: any;
    next: Node | null;
    prev?: Node | null;
    constructor(data: any) {
        this.data = data;
        this.next = null;
    }
}

export abstract class LinkList {
    head!: Node | null;
    abstract add(data: any): void;
    abstract addAll(data: any[]): void;
    abstract insert(data: any, target: Node): void;
    abstract getLast(): Node | null;
    abstract find(data: any): Node | null;
    abstract remove(data: any): boolean;
}

export class SingleLinkList extends LinkList {
    head!: Node | null;
    constructor(head?: Node) {
        super();
        this.head = head ? head : null;
    }
    add(data: any) {
        const node = data instanceof Node ? data : new Node(data);
        if (this.head === null) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
    }
    addAll(data: any[]) {
        let current = this.head;
        while (current?.next) {
            current = current.next;
        }
        for (let i = 0; i < data.length; i++) {
            const node = data[i] instanceof Node ? data[i] : new Node(data[i]);
            if (current === null) {
                this.head = node;
                current = node;
            } else {
                current.next = node;
                current = node;
            }
        }
    }
    getLast() {
        let current = this.head;
        while (current?.next) {
            current = current.next;
        }
        return current;
    }
    insert(data: any, target: Node): void {}
    find(data: any): Node | null {
        let current = this.head;

        return current;
    }
    remove(data: any): boolean {
        return true;
    }
}

const list = new SingleLinkList();
list.add(new Node(6));
list.addAll([1,2,3,4]);


console.info(list);
