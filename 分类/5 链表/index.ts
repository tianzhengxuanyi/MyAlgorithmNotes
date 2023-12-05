import { SingleLinkList, Node } from "./LinkList";
namespace printCommonPart {
    function printCommonPart(
        head1: Node | null,
        head2: Node | null
    ): Node | null {
        let A = head1,
            B = head2;
        while (A !== B) {
            A = A === null ? head1 : A.next;
            B = B === null ? head2 : B.next;
        }
        return A;
    }

    const linkList = new SingleLinkList();
    linkList.addAll([1, 2, 3, 4, 5]);
    const head1 = linkList.head!;
    const node3 = linkList.find(3);
    const linkList2 = new SingleLinkList();
    linkList2.addAll(["a", "b", "c"]);
    const head2 = linkList2.head!;
    const tail2 = linkList2.getLast();
    tail2!.next = node3;

    console.dir(head1, { depth: null });
    console.dir(head2, { depth: null });
    console.log(printCommonPart(head1, head2));
}
