interface Phone {
    type(): string;
}

class Iphone implements Phone {
    type(): string {
        return "Iphone";
    }
}

class Huawei implements Phone {
    type(): string {
        return "Huawei";
    }
}

// class Factory {
//     createPhone(type: string): Phone | null {
//         if (type === "Iphone") {
//             return new Iphone();
//         } else if (type === "Huawei") {
//             return new Huawei();
//         }

//         return null;
//     }
// }

// const factory = new Factory();
// const iphone = factory.createPhone("Iphone");
// const huawei = factory.createPhone("Huawei");
// console.log(iphone?.type()); // Iphone
// console.log(huawei?.type()); // Huawei

interface Factory {
    createPhone(): Phone;
}

class IphoneFactory implements Factory {
    createPhone(): Phone {
        return new Iphone();
    }
}

class HuaweiFactory implements Factory {
    createPhone(): Phone {
        return new Huawei();
    }
}

const iphoneFactory = new IphoneFactory();
const huaweiFactory = new HuaweiFactory();

const iphone = iphoneFactory.createPhone();
const huawei = huaweiFactory.createPhone();

console.log(iphone.type()); // Iphone
console.log(huawei.type()); // Huawei