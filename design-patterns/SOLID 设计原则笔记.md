# SOLID 设计原则笔记

## 一、核心定义

SOLID 是**五个面向对象设计（OOD）基本原则**的缩写（由 Robert C. Martin 提出），核心目标：让代码更易维护、易扩展、易复用、降低耦合、减少 bug。

|缩写|英文全称|中文名称|核心一句话|
|---|---|---|---|
|S|Single Responsibility Principle|单一职责原则|一个类只做一件事，只被一个因素修改|
|O|Open/Closed Principle|开闭原则|对扩展开放，对修改关闭|
|L|Liskov Substitution Principle|里氏替换原则|子类必须能完全替换父类，不破坏原有逻辑|
|I|Interface Segregation Principle|接口隔离原则|接口要小而专，不要大而全，避免强迫实现无用方法|
|D|Dependency Inversion Principle|依赖倒置原则|依赖抽象（接口/抽象类），不依赖具体实现|
## 二、逐原则详解

### 1. 单一职责原则（SRP）

- 核心：一个类/模块只负责一项职责，仅因一个业务方向的变更而修改。

- 反例：一个类同时处理用户存储 + 邮件发送 + 日志记录 → 任意功能改动都可能引发连锁 bug。

- 好处：职责清晰、复杂度低、便于测试、修改影响范围小。

### 2. 开闭原则（OCP）

- 核心：预留扩展点，新增功能通过「扩展」实现，不修改原有稳定代码。

- 实现方式：接口、抽象类、多态、策略模式。

- 例子：新增「微信支付」时，不修改支付宝/银行卡支付代码，仅新增支付实现类。

- 好处：保护已有逻辑，避免改出问题，便于迭代。

### 3. 里氏替换原则（LSP）

- 核心：子类可完全替换父类出现在任意使用父类的场景，程序行为不变、不报错。

- 约束：

    - 子类不能强于父类的前置条件（不更苛刻）；

    - 子类不能弱于父类的后置条件（不减少保证）；

    - 不破坏父类约定、不抛出父类未声明的异常。

- 反例：正方形继承长方形 → 替换后宽高逻辑出错，违反 LSP。

- 好处：保证继承体系正确性，多态能正常使用。

### 4. 接口隔离原则（ISP）

- 核心：接口拆分细化，客户端仅依赖需要的方法，不强迫实现无用接口。

- 反例：超大 `IAnimal` 接口包含 `fly()`/`swim()`/`run()` → 鸡需实现空的 `fly()`/`swim()`，污染接口。

- 改进：拆分为 `IFlyable`/`ISwimmable`/`IRunnable`，按需实现。

- 好处：接口简洁、解耦、避免冗余代码。

### 5. 依赖倒置原则（DIP）

- 核心：

    1. 高层模块不依赖低层模块，二者都依赖抽象；

    2. 抽象不依赖细节，细节依赖抽象。

- 落地：代码依赖接口/抽象类，通过「依赖注入（DI）」传入具体实现。

- 例子：业务逻辑依赖 `IDbConnection`，而非 `MysqlConnection` → 切换 PostgreSQL 仅换实现类，业务代码不动。

- 好处：高度解耦、便于替换实现、便于单元测试（mock 抽象）。

## 三、代码演示（JavaScript）

### 1. 反例：违反 SOLID 的「全能类」

```JavaScript

// 违反：单一职责（包揽存储/日志/通知）、开闭原则（新增功能需改此类）、依赖倒置（硬编码具体实现）
class BadUserManager {
  saveUser(user) {
    try {
      localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      console.log(`[${new Date()}] 用户 ${user.name} 已存储`);
    } catch (e) {
      alert(`存储失败：${e.message}，已发送邮件给管理员`);
    }
  }

  getUser(id) {
    const user = localStorage.getItem(`user_${id}`);
    return user ? JSON.parse(user) : null;
  }

  sendWelcomeMsg(user) {
    alert(`欢迎你，${user.name}！（邮件发送）`);
  }
}

// 使用
const badManager = new BadUserManager();
badManager.saveUser({ id: 1, name: "张三", age: 25 });
```

### 2. 正例：遵循 SOLID 的重构版本

```JavaScript

// 步骤1：定义抽象接口（接口隔离+依赖倒置）
class IUserStorage {
  saveUser(user) { throw new Error("必须实现saveUser方法"); }
  getUser(id) { throw new Error("必须实现getUser方法"); }
}

class ILogger {
  log(message) { throw new Error("必须实现log方法"); }
  error(message) { throw new Error("必须实现error方法"); }
}

class INotifier {
  sendWelcome(user) { throw new Error("必须实现sendWelcome方法"); }
}

// 步骤2：具体实现类（单一职责）
class LocalStorageUserStorage extends IUserStorage {
  saveUser(user) {
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
  }
  getUser(id) {
    const user = localStorage.getItem(`user_${id}`);
    return user ? JSON.parse(user) : null;
  }
}

class ConsoleLogger extends ILogger {
  log(message) { console.log(`[INFO][${new Date()}] ${message}`); }
  error(message) { console.error(`[ERROR][${new Date()}] ${message}`); }
}

class EmailNotifier extends INotifier {
  sendWelcome(user) { console.log(`[邮件] 欢迎你，${user.name}！`); }
}

// 扩展：新增短信通知（开闭原则：无需修改原有代码）
class SmsNotifier extends INotifier {
  sendWelcome(user) { console.log(`[短信] 欢迎你，${user.name}！`); }
}

// 步骤3：高层业务类（依赖抽象+依赖注入）
class GoodUserManager {
  constructor(storage, logger, notifier) {
    this.storage = storage;
    this.logger = logger;
    this.notifier = notifier;
  }

  createUser(user) {
    try {
      this.storage.saveUser(user);
      this.logger.log(`用户 ${user.name} 已创建`);
      this.notifier.sendWelcome(user);
      return true;
    } catch (e) {
      this.logger.error(`创建用户失败：${e.message}`);
      return false;
    }
  }

  getUser(id) {
    return this.storage.getUser(id);
  }
}

// 使用示例
const storage = new LocalStorageUserStorage();
const logger = new ConsoleLogger();
const emailNotifier = new EmailNotifier();
const userManager1 = new GoodUserManager(storage, logger, emailNotifier);
userManager1.createUser({ id: 1, name: "张三", age: 25 });

// 切换短信通知（无代码修改）
const smsNotifier = new SmsNotifier();
const userManager2 = new GoodUserManager(storage, logger, smsNotifier);
userManager2.createUser({ id: 2, name: "李四", age: 30 });
```

## 四、核心对比

|维度|违反 SOLID 的代码|遵循 SOLID 的代码|
|---|---|---|
|单一职责|一个类包揽多职责|每个类只做一件事|
|开闭原则|新增功能需修改原有类|新增功能仅扩展，不修改|
|依赖倒置|依赖具体实现（如 localStorage）|依赖抽象接口|
|接口隔离|无接口，功能耦合|接口拆分，按需实现|
|维护性|改一处影响全局，易出 bug|低耦合，修改/扩展不影响原有逻辑|
## 五、关键总结

1. **单一职责是基础**：拆分代码粒度，让每个类/函数只负责一个核心功能；

2. **抽象是核心手段**：通过接口定义规范，解耦具体实现与业务逻辑；

3. **开闭原则是目标**：新增功能靠「扩展」而非「修改」，保护稳定代码；

4. **依赖注入是落地方式**：将具体实现通过构造函数传入，而非硬编码在业务类中；

5. **整体关系**：单一职责 → 里氏替换/接口隔离 → 依赖倒置 → 实现开闭原则，最终达成「高内聚、低耦合」的代码目标。
> （注：文档部分内容可能由 AI 生成）