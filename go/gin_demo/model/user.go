package model

import (
	"gin_demo/common"
	uuid "github.com/satori/go.uuid"
)

func (loginForm LoginForm) GetMessages() common.ValidatorMessages {
	return common.ValidatorMessages{
		"Username.required": "请输入用户名",
		"Password.required": "请输入密码",
		"Code.required": "请输入验证码",
	}
}

// ResponseLoginInfo 登录响应信息
type ResponseLoginInfo struct {
	// *model.User, // 合并结构体
	UserInfo ResponseUserInfo `json:"user_info"`
	Token string `json:"token"`
}

// ResponseUserInfo 返回的用户信息
type ResponseUserInfo struct {
	Username    string `json:"username" uri:"username" xml:"username""`
	UUID        uuid.UUID      `json:"uuid" gorm:"comment:用户UUID"`                                                              // 用户登录密码
	NickName    string         `json:"nickName" gorm:"default:系统用户;comment:用户昵称"`                                            // 用户侧边主题
	HeaderImg   string         `json:"headerImg" gorm:"default:https://qmplusimg.henrongyi.top/gva_header.jpg;comment:用户头像"` // 用户头像
}

// LoginForm 定义接收数据的结构体
type LoginForm struct {
	// binding:"required"修饰的字段，若接收为空值，则报错，是必须字段
	Username    string `form:"username" json:"username" uri:"username" xml:"username" binding:"required"`
	Password string `form:"password" json:"password" uri:"password" xml:"password" binding:"required"`
	Code     string `form:"code" json:"code" uri:"code" xml:"code" binding:"required"`
}

// UserInfo 所有的用户信息
type UserInfo struct {
	UUID        uuid.UUID      `json:"uuid" gorm:"comment:用户UUID"`                                                           // 用户UUID
	Username    string         `json:"userName" gorm:"comment:用户登录名"`                                                        // 用户登录名
	Password    string         `json:"-"  gorm:"comment:用户登录密码"`                                                             // 用户登录密码
	NickName    string         `json:"nickName" gorm:"default:系统用户;comment:用户昵称"`                                            // 用户侧边主题
	HeaderImg   string         `json:"headerImg" gorm:"default:https://qmplusimg.henrongyi.top/gva_header.jpg;comment:用户头像"` // 用户头像
}