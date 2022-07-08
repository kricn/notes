package server

import (
	"gin_demo/api"
	"github.com/gin-gonic/gin"
)

type User struct {}

func (user *User) InitRouters (r *gin.RouterGroup)  {
	userApi := api.App.UserApi
	r.GET("getUserInfo", userApi.GetUserInfo)
	r.POST("updateUserInfo", userApi.UpdateUserInfo)
}

