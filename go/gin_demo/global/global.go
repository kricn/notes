package global

import (
	"gin_demo/config"
	"gorm.io/gorm"
	"sync"
)

var (
	ORM_DB_CONFIG config.Mysql
	lock       sync.RWMutex
	DB *gorm.DB
)
