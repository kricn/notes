package server

import (
	"gin_demo/model/response"
	"github.com/gin-gonic/gin"
)

type User struct {}

// GetUserInfo 获取用户信息
func getUserInfo(c *gin.Context) {
	//token := c.GetHeader("Authorization")
	//claims := utils.ParseToken()
	response.OkWithMessage("成功", c)
}

func (user *User) InitRouters (r *gin.RouterGroup)  {
	r.GET("getUserInfo", getUserInfo)
}

