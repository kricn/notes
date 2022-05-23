package main

import (
	"gin_demo/initialization"
)

func main() {
	// 初始化数据库
	initialization.GormMysql()
	// 初始化路由
	// 路由在最后初始化
	initialization.InitRouters()
}