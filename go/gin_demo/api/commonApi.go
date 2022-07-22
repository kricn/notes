package api

import (
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
)

type CommonApi struct {}

func (common *CommonApi) GenerateCaptcha(c *gin.Context) {
	utils.Captcha(c, 4)
}