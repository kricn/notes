package gorm

import (
	"gin_demo/global"
	"github.com/satori/go.uuid"
)

type SysUser struct {
	global.ORM_MODEL
	UUID        uuid.UUID      `json:"uuid" gorm:"comment:用户UUID"`                                                           // 用户UUID
	Username    string         `json:"userName" gorm:"comment:用户登录名"`                                                        // 用户登录名
	Password    string         `json:"-"  gorm:"comment:用户登录密码"`                                                             // 用户登录密码
	NickName    string         `json:"nickName" gorm:"default:系统用户;comment:用户昵称"`                                            // 用户侧边主题
	HeaderImg   string         `json:"headerImg" gorm:"default:https://qmplusimg.henrongyi.top/gva_header.jpg;comment:用户头像"` // 用户头像
}

func (SysUser) TableName () string {
	return "sys_users"
}
