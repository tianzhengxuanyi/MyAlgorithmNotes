## 1. HTML5相关：FileAPI 、拖拽、语义化

### 1.1 [FileAPI](https://wangdoc.com/javascript/bom/file)

### 拖拽

### 语义化

## 2. CSS相关
### 2.1 [BFC](https://blog.csdn.net/sinat_36422236/article/details/88763187)
  **BFC概念：** block formatting context，块级格式化上下文。

  BFC是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

  **BFC特性：**
  - 内部的Box会在垂直方向上一个接一个放置。
  - Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠。
  - 每个元素的外边距盒（margin box）的左边与包含块边框盒（border box）的左边相接触（从右向左的格式的话，则相反），即使存在浮动。
  - BFC的区域不会与float box重叠。
  - BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。
  - 计算BFC的高度时，浮动元素也会参与计算。
  
  **触发BFC：**
  - 根元素，即html
  - float的值不为none（默认）
  - overflow的值不为visible（默认）
  - display的值为table-cell, table-caption, inline-block, flex, 或者 inline-flex 中的其中一个
  - position的值为absolute或fixed

  **BFC应用：**
  - 自适应两行布局
    > 左列浮动（定宽或不定宽都可以），给右列开启 BFC。
  - 防止兄弟元素外边距合并
    > 创建一个新的 BFC。
  - 防止父子元素的外边距重叠
  
    父元素与其第一个/最后一个子元素之间不存在边框、内边距、行内内容，也没有创建块格式化上下文、或者清除浮动将两者的外边距 分开，此时子元素的外边距会“溢出”到父元素的外面。

    解决办法：
    - 给父元素触发 BFC（如添加overflow: hidden）
    - 给父元素添加 border
    - 给父元素添加 padding
  - 清除浮动，解决令父元素高度坍塌
    > 给父元素触发 BFC。

### 2.2 [盒子模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

CSS 中组成一个块级盒子需要：

  - Content box: 这个区域是用来显示内容，大小可以通过设置 width 和 height.
  - Padding box: 包围在内容区域外部的空白区域；大小通过 padding 相关属性设置。
  - Border box: 边框盒包裹内容和内边距。大小通过 border 相关属性设置。
  - Margin box: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 margin 相关属性设置。

**标准盒模型：** width和height只包含Content box的大小。通过 `box-sizing: content-box` 进行设置

**IE盒模型：** width和height包含Content box、Padding box、Border box。通过 `box-sizing: border-box` 进行设置

### 2.3 [粘性定位](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)
`position:sticky` 粘性定位。当元素在屏幕内，表现为`position:relative`，就要滚出显示器屏幕的时候，表现为`position:fixed`。

**sticky元素特性表现：**
  - sticky相对祖先元素第一个非static的元素。
  - 父级元素不能有任何overflow:visible以外的overflow设置，否则没有粘滞效果。
  - 父级元素设置和粘性定位元素等高的固定的height高度值，或者高度计算值和粘性定位元素高度一样，也没有粘滞效果。
  - 同一个父容器中的sticky元素，如果定位值相等，则会重叠；如果属于不同父元素，且这些父元素正好紧密相连，则挤开原来的元素，形成依次占位的效果。
  - sticky定位，不仅可以设置top，基于滚动容器上边缘定位；还可以设置bottom，也就是相对底部粘滞。如果是水平滚动，也可以设置left和right值。
  
[position sticky粘性定位的计算规则](https://www.zhangxinxu.com/wordpress/2020/03/position-sticky-rules/)


### 2.4 [em/px/rem/vh/vw区别](https://juejin.cn/post/6844903849136750605)

- px 相对长度单位，网页设计常用的基本单位，**相对于显示器屏幕分辨率**。
- em 相对长度单位，**相对于父元素的`font-size`**，如果父元素没有设置字体大小则相对与浏览器默认字体大小。
- rem 相对长度单位，**相对于HTML根元素的`font-size`**，如果HTML根元素没有设置字体大小则相对与浏览器默认字体大小。
- vh 相对长度单位，**相对于浏览器视口高度**，长度等于视口高度的1/100。
- vw 相对长度单位，**相对于浏览器视口宽度**，长度等于视口宽度的1/100。
- vmin 相对长度单位，**相对于视口的高度和宽度两者之间的最小值**。
- vmax 相对长度单位，**相对于视口的高度和宽度两者之间的最大值**。
- %（百分比）相对长度单位，**相对于父元素**。如果父元素没有指定高度，会按照子元素的实际高度，设置百分比则没有效果。
  
  父元素定义：
  1. 对于普通定位元素就是我们理解的父元素
  2. 对于position: absolute;的元素是相对于已定位的父元素
  3. 对于position: fixed;的元素是相对于ViewPort（可视窗口）
   
    
### 2.5 [css选择器权重规则](https://juejin.cn/post/6844903709772611592)

CSS选择器的优先级关系：
> 内联 > ID选择器 > 类选择器 > 标签选择器 

css选择器权重比较时会按照（内联，ID选择器，类选择器，标签选择器）从左至右按位比较，较大者胜出，如果相等，则继续往右移动一位进行比较 。如果4位全部相等，则后面的样式会覆盖前面。

css选择器权重计算时并不会进位，如11个标签选择器权重为（0，0，0，11）而不是（0，0，1，1）。

添加`!important`的样式会直接覆盖其他样式，相当于权重无限大。

### 2.7 [居中实现方式](https://juejin.cn/post/6844903679242305544#comment)

**仅居中元素定宽高适用：**
  - absolute + 负margin
  ```css
  .box {
    position: absolute;;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
  }
  ```
  - absolute + margin auto，通过设置各个方向的定位距离都是0，此时margin设为auto，就可以在各个方向上居中了
  ```css
  .box {
    position: absolute;;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  ```
  - absolute + calc
  ```css
  .box {
    position: absolute;;
    top: calc(50% - 50px); // 直接在定位时减去一半宽高
    left: calc(50% - 50px);
  }
  ```

**居中元素不定宽高：**
  - absolute + transform
  ```css
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ```
  - lineheight，把box设置为行内元素，通过通过父元素text-align做到水平居中，通过自身vertical-align和line-height垂直方向居中。
  ```css
  .wp { // 父元素
    line-height: 300px;
    text-align: center;
    font-size: 0px;
  }
  .box { // 子元素
    font-size: 16px;
    display: inline-block;
    vertical-align: middle;
    line-height: initial;
    text-align: left; /* 修正文字 */
  }
  ```
  - css-table
  ```css
    .wp { // 父元素
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    }
    .box { // 子元素
        display: inline-block;
    }
  ```
  - flex
  ```css
  .wp { // 父元素
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ```
  - grid
  ```css
  .wp { // 父元素
    display: grid;
  }
  .box { // 子元素
      align-self: center;
      justify-self: center;
  }
  ```

## 3. 浏览器相关
### 3.1 [回流重绘](https://segmentfault.com/a/1190000017329980)

浏览器渲染过程如下：
1. 解析HTML，生成DOM树，解析CSS，生成CSSOM树
2. 将DOM树和CSSOM树结合，生成渲染树(Render Tree)
3. Layout(回流):根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（位置，大小）
4. Painting(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素
5. Display:将像素发送给GPU，展示在页面上。

**回流：** 重新计算元素在视口中的几何信息。

**重绘：** 重新在屏幕绘制元素。

**回流触发时机：**
- 添加或删除可见的DOM元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
- 页面一开始渲染的时候（无法避免）
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）
- 获取需要通过即时计算得到的属性值，浏览器为了获取这些值，也会进行回流。除此还包括getComputedStyle、getBoundingClientRect方法
  > offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight

**重绘触发时机：**
- 触发回流时
- 颜色的修改
- 文本方向的修改
- 阴影的修改
  
注意：回流一定会触发重绘，而重绘不一定会回流

**减少回流和重绘：**
- 如果想设定元素的样式，通过改变元素的 class 类名 (尽可能在 DOM 树的最里层)
- 使用 JavaScript 动态插入多个节点时, 可以使用DocumentFragment创建后一次插入
- 使用display隐藏元素，修改完成后在恢复显示
- 以变量的形式缓存需要及时计算的属性值
- 避免使用 table 布局，table 中每个元素的大小以及内容的改动，都会导致整个 table 的重新计算
- 对于那些复杂的动画，对其设置 position: fixed/absolute，尽可能地使元素脱离文档流，从而减少对其他元素的影响
- 使用css3硬件加速，可以让transform、opacity、filters这些动画不会引起回流重绘

### 3.2 [浏览器输入解析过程](https://juejin.cn/post/6844903832435032072#comment)

- DNS域名解析
- 发起TCP连接
- 发送HTTP请求
- 服务器处理请求并返回HTTP报文
- 浏览器解析渲染页面
- 连接结束
  
### 3.3 [防抖节流](https://juejin.cn/post/6844903662519599111)

节流: n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效

防抖: n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时

#### 代码实现

**节流**

```js
// 时间戳
function throttled1(fn, delay = 500) {
    let prevTime = Date.now();

    return function(...args) {
        const context = this;
        let newTime = Date.now();
        if (newTime - prevTime >= delay) {
            fn.apply(context, args)
            prevTime = Date.now()
        }
    }
}

// 定时器
function throttled2(fn, delay = 500) {
    let timer;

    return function(...args) {
        if (timer) {
            return
        }
        const context = this;
        timer = setTimeout(() => {
            fn.apply(context, args)
            timer = null
        }, delay);
    }
}
```

**防抖**

```js
// 非立即执行
function debounce1(fn, wait) {
    let timer;

    return function(...args) {
        const context = this;
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(context, args);
            timer = null;
        }, wait)
    }
}

// 立即执行
function debounce2(fn, wait) {
    let timer;

    return function(...args) {
        const context = this;
        if (timer) {
            clearTimeout(timer);
        }
        let callNow = !timer;

        timer = setTimeout(() => {
            timer = null;
        }, wait)

        if (callNow) {
            fn.apply(context, args)
        }
    }
}
```

#### 应用场景

防抖在连续的事件，只需触发一次回调的场景有：

- 搜索框搜索输入。只需用户最后一次输入完，再发送请求
- 手机号、邮箱验证输入检测
- 窗口大小resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。

节流在间隔一段时间执行一次回调的场景有：

- 滚动加载，加载更多或滚到底部监听
- 搜索框，搜索联想功能
### 3.4 [浏览器缓存](https://juejin.cn/post/6844903764566999054?searchId=20230724122929A864D51E6A5FDBA0E727)

资源缓存的地方：
- memory cache（内存）
- disk cache（磁盘）

浏览器缓存的优点：

1. 减少了冗余的数据传输

2. 减少了服务器的负担，大大提升了网站的性能

3. 加快了客户端加载网页的速度

浏览器缓存类型：

1. 强缓存；expires 和 cahe-control
2. 协商缓存；Last-Modify/If-Modify-Since 和 ETag/If-None-Match

当浏览器再次访问一个已经访问过的资源时，它会这样做：
1. 看看是否命中强缓存，如果命中，就直接使用缓存了。
2. 如果没有命中强缓存，就发请求到服务器检查是否命中协商缓存。
3. 如果命中协商缓存，服务器会返回 304 告诉浏览器使用本地缓存。
4. 否则，返回最新的资源。
  
### 3.5 [浏览器安全](https://juejin.cn/post/6844903542340190215)
### 3.6 [web存储](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%AD%98%E5%82%A8%EF%BC%9F)

## 4. JS相关
### 4.1 [作用域](https://github.com/mqyqingfeng/Blog/issues/3)
### 4.2 [执行上下文](https://juejin.cn/post/6844904158957404167#heading-9)
### 4.3 [this](https://juejin.cn/post/6844904158957404167#heading-9)
### 4.4 [事件循环机制](https://juejin.cn/post/6844903553795014663#heading-10)
### 4.5 [Promise/async,await 原理及手动实现](https://www.jianshu.com/p/fe0159f8beb4)
### 4.6 [apply bind call 原理及手动实现](https://juejin.cn/post/7128233572380442660?searchId=20230724115644548DC0DBA0D9B79040ED)
### 4.7 [继承  MDN或红宝书](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
### 4.8 [闭包内存泄露解决方法](https://segmentfault.com/a/1190000039132414)
### 4.9 [原型原型链](https://github.com/mqyqingfeng/blog/issues/2)
### 4.10[深浅拷贝](https://juejin.cn/post/6844903692756336653?searchId=202307241225510B846F6DBBC10697F0EB)
### 4.11 [常用设计模式](https://juejin.cn/post/6844904032826294286?searchId=202307241227092390BF5F7E87949E3F62#comment)
#### 工厂模式：https://www.jianshu.com/p/38493eb4ffbd

1. 简单工厂类：一个工厂方法，依据传入的参数，生成对应的产品对象（只有一个工厂，根据不同的订单生产对应的产品）；
   - 具体类（具体产品，如苹果手机和华为手机）：Iphone、Huawei
   - 抽象类（抽象产品，Iphone和Huawei都属于手机，都具有相同的属性）：phone
   - 工厂类（具体工厂，用来生产Iphone和Huawei）：Factory
    ```ts
    // 抽象类
    interface Phone {
        type(): string;
    }

    // 具体类
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

    // 工厂类
    class Factory {
        createPhone(type: string): Phone | null {
            if (type === "Iphone") {
                return new Iphone();
            } else if (type === "Huawei") {
                return new Huawei();
            }

            return null;
        }
    }

    const factory = new Factory();
    const iphone = factory.createPhone("Iphone");
    const huawei = factory.createPhone("Huawei");
    console.log(iphone?.type()); // Iphone
    console.log(huawei?.type()); // Huawei
    ```

2. 工厂方法设计模型：将工厂提取成一个接口或抽象类，具体生产什么产品由子类决定（具有多个工厂，每个工厂生产对应的产品）；
   - 抽象产品类（具体产品，如苹果手机和华为手机）：Iphone、Huawei
   - 具体产品类（抽象产品，Iphone和Huawei都属于手机，都具有相同的属性）：phone
   - 抽象工厂类（由具体工厂类抽象出来，生产什么样的产品由子类<具体工厂类>来决定）
   - 具体工厂类（具体工厂，用来生产Iphone和Huawei）：IphoneFactory、HuaweiFactory
    ```ts
      // 抽象类
      interface Phone {
          type(): string;
      }

      // 具体类
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

      // 抽象工厂类
      interface Factory {
          createPhone(): Phone;
      }

      // 具体工厂类
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
    ```

3. 抽象工厂设计模式：抽象工厂和工厂方法的模式基本一样，区别在于，工厂方法是生产一个具体的产品，而抽象工厂可以用来生产一组相同，有相对关系的产品；
   - 抽象产品类（具体产品，如苹果手机和华为手机）：Iphone、Huawei
   - 具体产品类（抽象产品，Iphone和Huawei都属于手机，都具有相同的属性）：phone
   - 抽象工厂类（由具体工厂类抽象出来，生产什么样的产品由子类<具体工厂类>来决定）
   - 具体工厂类（具体工厂，用来生产Iphone和Huawei）：IphoneFactory、HuaweiFactory

  ```ts
  // 抽象产品类
  interface Phone {
    type(): string;
  }

  // 具体产品类
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

  // 抽象工厂类
  interface PhoneFactory {
    getCPU(): CPU;
    getScreen(): PhoneScreen;
    assemble(): Phone;
  }

  // 具体工厂类
  interface CPU {
    run(): void;
  }

  class CPU650 implements CPU {
      run(): void {
          console.log("CPU650")
      }
  }

  class CPU850 implements CPU {
      run(): void {
          console.log("CPU850")
      }
  }

  interface PhoneScreen {
      size(): void;
  }

  class Screen5 implements PhoneScreen {
      size(): void {
          console.log("Screen5")
      }
  }
  class Screen6 implements PhoneScreen {
      size(): void {
          console.log("Screen6")
      }
  }

  class Iphone14 implements PhoneFactory {
      getCPU() {
          return new CPU650();
      }
      getScreen(): PhoneScreen {
          return new Screen5();
      }
      assemble(): Phone {
          return new Iphone();
      }
  }
  class Iphone14Pro implements PhoneFactory {
      getCPU() {
          return new CPU850();
      }
      getScreen(): PhoneScreen {
          return new Screen6();
      }
      assemble(): Phone {
          return new Iphone();
      }
  }
  class HuaweiMeta60 implements PhoneFactory {
      getCPU() {
          return new CPU850();
      }
      getScreen(): PhoneScreen {
          return new Screen6();
      }
      assemble(): Phone {
          return new Huawei();
      }
  }
  ```

4. 例子：
  - JQuery的$()：它根据传入参数的不同创建元素或者去寻找上下文中的元素，创建成相应的jQuery对象。
  ```js
  class jQuery {
      constructor(selector) {
          super(selector)
      }
      add() {
          
      }
    // 此处省略若干API
  }

  window.$ = function(selector) {
      return new jQuery(selector)
  }
  ```

#### 单例模式

一个类只有一个实例，并提供一个访问它的全局访问点。

```ts
class Singleton {
    name: string;
    static instance: Singleton;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    static getInstance(name: string)  {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton(name);
        }

        return Singleton.instance;
    }
}

let instance_1 = Singleton.getInstance("instance_1");
let instance_2 = Singleton.getInstance("instance_2");

console.log(instance_1.getName()) // instance_1
console.log(instance_2.getName()) // instance_1
console.log(instance_1 === instance_1) // true
```

**例子：** 
- vuex 和 redux中的store
- 登录框、弹窗

**单体模式的优点是：**

- 可以用来划分命名空间，减少全局变量的数量。
- 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
- 可以被实例化，且实例化一次。

#### 适配器模式
将一个类的接口转化为另外一个接口，以满足用户需求，使类之间接口不兼容问题通过适配器得以解决。

**场景**
- 封装ajax接口
- vue的computed：原有data中的数据不满足当前的要求，通过计算属性的规则来适配成我们需要的格式，对原有数据并没有改变，只改变了原有数据的表现形式。
  
#### 代理模式：
为一个对象提供一个代用品或占位符，以便控制对它的访问。

**场景**
- HTML元 素事件代理
```html
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
<script>
  let ul = document.querySelector('#ul');
  ul.addEventListener('click', event => {
    console.log(event.target);
  });
</script>
```
  外观模式：
  为子系统的一组接口提供一个一致的界面，定义了一个高层接口，这个接口使子系统更加容易使用。
  兼容浏览器事件绑定、 封装接口
  观察者模式：
  定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使它们能够自动更新自己，当一个对象的改变需要同时改变其它对象，并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式。
  发布 & 订阅、dom事件、vue响应式
  迭代器模式：
  提供一种方法顺序一个聚合对象中各个元素，而又不暴露该对象的内部表示。
  Array.prototype.forEach、jQuery中的$.each()、ES6 Iterator
  策略模式：
  定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。
  表单验证
  模版方法模式：
  模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法和封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。
  子类中公共的行为应被提取出来并集中到一个公共父类中的避免代码重复
  职责链模式：
  使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
  JS 中的事件冒泡、作用域链、原型链
  备忘录模式：
  在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到保存的状态。
  分页控件、撤销组件、全局对象存储

## 5. ES6 https://es6.ruanyifeng.com/
## 6. ES7、ES8、ES9、ES10、ES11、ES12新特性 https://juejin.cn/post/724367723282789177
## 7. VUE3(生命周期、插槽、父子组件传值、v-modle、watch、路由)  https://cn.vuejs.org/   
## 8. Pinia https://pinia.vuejs.org/zh/
## 9. Ts(变量声明、接口、类、枚举、泛型)  https://www.tslang.cn/docs/handbook/basic-types.html
## 10. JSX语法  https://mdnice.com/writing/41e7052ecb7a45c6bafae884970a9432