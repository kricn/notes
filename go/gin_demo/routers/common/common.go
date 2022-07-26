package common

import (
	"gin_demo/api"
	"gin_demo/global"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type Common struct {}

func (c *Common) InitCommonRouter(r *gin.RouterGroup) {
	commonApi := api.App.CommonApi
	r.Use(sessions.Sessions("captcha", global.CAPTCHA_STORE))
	r.GET("captcha", commonApi.GenerateCaptcha)
}