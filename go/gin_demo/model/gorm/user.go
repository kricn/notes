package gorm

import (
	"gin_demo/global"
	"gin_demo/model"
)

type SysUser struct {
	global.ORM_MODEL
	model.UserInfo
}

func (SysUser) TableName () string {
	return "sys_users"
}
