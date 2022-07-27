package common

import (
	"gin_demo/api"
	"github.com/gin-gonic/gin"
)

type User struct {}

func (e *User) InitUserRouter(r *gin.RouterGroup) {
	baseApi := api.App.BaseApi
	r.POST("login", baseApi.Login)
	r.POST("register", baseApi.Register)
}
