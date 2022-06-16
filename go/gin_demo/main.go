package main

import (
	"gin_demo/global"
	"gin_demo/initialization"
)

func main() {
	// 初始化数据库
	global.DB = initialization.GormMysql()
	if global.DB != nil {
		db, _ := global.DB.DB()
		defer db.Close()
	}
	// 初始化路由
	// 路由在最后初始化
	initialization.InitRouters()
}