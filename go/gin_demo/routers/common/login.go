package common

import (
	"gin_demo/api"
	"gin_demo/middleware"
	"github.com/gin-gonic/gin"
)

type User struct {}

func (e *User) InitUserRouter(r *gin.RouterGroup) {
	baseApi := api.App.BaseApi
	r.Use(middleware.Session("gin_demo"))
	r.POST("login", baseApi.Login)
	r.POST("register", baseApi.Register)
}
