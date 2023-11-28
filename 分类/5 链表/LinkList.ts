export class Node {
    data: any;
    next: Node | null;
    constructor(data: any) {
        this.data = data;
        this.next = null;
    }
}

export abstract class LinkList {
    head!: Node | null;
    abstract add(data: any): void;
    abstract insert(data: any, target: Node): void;
    abstract find(data: any): Node | null;
    abstract remove(data: any): boolean;
}

export class SingleLinkList extends LinkList{
    head!: Node | null;
    constructor(head?: Node) {
        super();
        this.head = head ? head : null;
    }
    add(data: any) {}
    insert(data: any, target: Node): void {
        
    }
    find(data: any): Node | null {
        return this.head
    }
    remove(data: any): boolean {
        return true
    }
}