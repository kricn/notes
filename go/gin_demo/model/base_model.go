package model

import "gin_demo/common"

// Login 定义接收数据的结构体
type Login struct {
	// binding:"required"修饰的字段，若接收为空值，则报错，是必须字段
	User    string `form:"username" json:"username" uri:"username" xml:"username" binding:"required"`
	Password string `form:"password" json:"password" uri:"password" xml:"password" binding:"required"`
	Code     string `form:"code" json:"code" uri:"code" xml:"code"`
}
func (loginForm Login) GetMessages() common.ValidatorMessages {
	return common.ValidatorMessages{
		"User.required": "请输入用户名",
		"Password.required": "请输入密码",
	}
}

type User struct {
	User    string `form:"username" json:"username" uri:"username" xml:"username""`
	Password string `form:"password" json:"password" uri:"password" xml:"password""`
}

