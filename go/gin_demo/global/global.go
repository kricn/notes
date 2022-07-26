package global

import (
	"gin_demo/config"
	"github.com/gin-contrib/sessions"
	"github.com/go-redis/redis"
	"gorm.io/gorm"
	"sync"
)

var (
	ORM_DB_CONFIG config.Mysql
	lock       sync.RWMutex
	DB *gorm.DB
	RDB *redis.Client
	CAPTCHA_STORE sessions.Store
)
