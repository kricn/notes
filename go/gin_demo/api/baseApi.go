package api

import (
	"gin_demo/common"
	"gin_demo/model"
	"gin_demo/model/response"
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

type BaseApi struct {}

func (b *BaseApi) Login(c *gin.Context) {
	var json model.Login
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(400, gin.H{"message": common.GetErrorMsg(json, err)})
		return
	}
	if !utils.CaptchaVerify(c, json.Code) {
		response.FailWithMessage("验证码错误", c)
		return
	}
	token, err := utils.GenerateToken(&model.User{
		User: json.User,
		Password: json.Password,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "生成token出错，请重新登录",
		})
		return
	}
	response.OkWithDetailed(&model.LoginResponse{
		UserInfo: model.UserInfo{
			User: json.User,
		},
		Token: token,
	}, "登录成功", c)
}

func (b *BaseApi) Register(c *gin.Context) {
	var json model.Login
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(400, gin.H{"message": common.GetErrorMsg(json, err)})
		return
	}
	if !utils.CaptchaVerify(c, json.Code) {
		response.FailWithMessage("验证码错误", c)
		return
	}
	// todo 查村用户是否存在
	response.OkWithMessage("注册成功", c)
}
