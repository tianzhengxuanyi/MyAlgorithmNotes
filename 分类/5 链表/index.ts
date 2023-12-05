import { SingleLinkList } from "./LinkList";
namespace printCommonPart {
    function printCommonPart() {
        console.log(1);
    }

    const linkList = new SingleLinkList();
    linkList.addAll([1,2,3,4,5]);
    const head1 = linkList.head;
    printCommonPart();
}
