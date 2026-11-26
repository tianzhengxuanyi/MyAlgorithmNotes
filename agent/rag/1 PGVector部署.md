# PGVector部署

## 安装docker-desktop

1. 安装docker-desktop：在https://www.docker.com/products/docker-desktop/下载安装docker-desktop
2. 启动docker-desktop
3. 配置国内镜像加速器
    - 打开 Docker Desktop，点右上角齿轮 Settings
    - 左侧找到 Docker Engine，右侧 JSON 全部替换成下面这段
        ```json
        {
        "registry-mirrors": [
            "https://docker.m.daocloud.io",
            "https://docker.xuanyuan.me",
            "https://docker.1ms.run",
            "https://hub-mirror.c.163.com"
        ],
        "builder": {
            "gc": {
            "defaultKeepStorage": "20GB"
            }
        },
        "experimental": false
        }
        ```
    - 右下角 Apply & Restart 等待 Docker 完全重启

## 安装pgvector镜像

1. cmd 执行以下命令安装pgvector镜像
    ```bash
    docker pull pgvector/pgvector:pg16
    ```

## 运行pgvector容器

```bash
docker run -d  --name pg-vector -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=vector_db -v pgvector-data:/var/lib/postgresql/data pgvector/pgvector:pg16
```

本地 psql 命令进入容器数据库
```bash
docker exec -it pg-vector psql -U postgres -d vector_db
```

进入后先执行开启向量插件（必须做）
```bash
CREATE EXTENSION IF NOT EXISTS vector;
```

## 可视化工具链接

- vscode 插件：mysql
- 参数填写：
    - Host：127.0.0.1
    - Port：5432
    - Database：vector_db
    - User：postgres
    - Password：123456

# redis 部署

1. 安装redis镜像
```bash
docker pull redis:7-alpine
```

2. 运行redis容器
```bash
docker run -d --name redis7 --restart always -p 6379:6379 -v /data/redis:/data redis:7-alpine redis-server --requirepass 123456 --appendonly yes
```

# mysql docker部署

1. 安装mysql镜像

```bash
# 拉取 mysql8.0
docker pull mysql:8.0
```

2. 运行mysql容器

```bash
docker run -d --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -e TZ=Asia/Shanghai mysql:8.0
```