package initialization

import (
	"fmt"
	"gin_demo/config"
	"gin_demo/global"
	gormModel "gin_demo/model/gorm"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
)

// RegisterTables 注册数据库表专用
// Author SliverHorn
func RegisterTables(db *gorm.DB) {
	err := db.AutoMigrate(
		gormModel.SysUser{},
	)
	if err != nil {
		fmt.Println("register table failed")
		os.Exit(0)
	}
}

// GormMysql 初始化Mysql数据库
func GormMysql() *gorm.DB {
	global.ORM_DB_CONFIG = config.Mysql{
		Path: "127.0.0.1",
		Port: "3306",
		Username: "root",
		Password: "root",
		Dbname: "gin",
	}
	m := global.ORM_DB_CONFIG
	if m.Dbname == "" {
		return nil
	}
	mysqlConfig := mysql.Config{
		DSN:                       m.Dsn(), // DSN data source name
		DefaultStringSize:         191,     // string 类型字段的默认长度
		SkipInitializeWithVersion: false,   // 根据版本自动配置
	}
	fmt.Println("数据库连接中...")
	if db, err := gorm.Open(mysql.New(mysqlConfig)); err != nil {
		fmt.Println("数据库连接失败")
		return nil
	} else {
		//sqlDB.SetMaxIdleConns(m.MaxIdleConns)
		//sqlDB.SetMaxOpenConns(m.MaxOpenConns)
		// 初始化表
		RegisterTables(db)
		fmt.Println("数据库链接成功")
		return db
	}
}

