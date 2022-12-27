package common

import (
	"gin_demo/api"
	"github.com/gin-gonic/gin"
)

type Common struct {}

func (c *Common) InitCommonRouter(r *gin.RouterGroup) {
	commonApi := api.App.CommonApi
	r.GET("captcha", commonApi.GenerateCaptcha)
}