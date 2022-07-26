package common

import (
	"gin_demo/api"
	"gin_demo/global"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type User struct {}

func (e *User) InitUserRouter(r *gin.RouterGroup) {
	baseApi := api.App.BaseApi
	r.Use(sessions.Sessions("captcha", global.CAPTCHA_STORE))
	r.POST("login", baseApi.Login)
	r.POST("register", baseApi.Register)
}
