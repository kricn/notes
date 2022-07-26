package api

import (
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
)

type CommonApi struct {}

func (common *CommonApi) GenerateCaptcha(c *gin.Context) {
	w, h := 107, 36
	captchaId := c.DefaultQuery("captchaId", "")
	captchaValue := utils.GenerateCaptcha(4)
	utils.SetCaptcha(captchaId, captchaValue, c)
	utils.Serve(c.Writer, c.Request, captchaValue, ".png", "zh", false, w, h)
}