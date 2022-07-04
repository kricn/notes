package initialization

import (
	"fmt"
	"github.com/go-redis/redis"
)

// InitClient 初始化连接
func InitClient() (rdb *redis.Client, err error) {
	// 通过 redis.NewClient 函数即可创建一个 redis 客户端, 这个方法接收一个 redis.Options 对象参数, 通过这个参数, 我们可以配置 redis 相关的属性, 例如 redis 服务器地址, 数据库名, 数据库密码等。
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	// 通过 client.Ping() 来检查是否成功连接到了 redis 服务器
	fmt.Println("redis 连接中...")
	_, err = rdb.Ping().Result()
	if err != nil {
		return nil, err
	}
	fmt.Println("redis 连接成功")
	return rdb, nil
}
