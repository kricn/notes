package global

import (
	"gin_demo/config"
	"sync"
)

var (
	ORM_DB_CONFIG config.Mysql
	lock       sync.RWMutex
)
