package api

import (
	"errors"
	"fmt"
	"gin_demo/common"
	"gin_demo/global"
	"gin_demo/model"
	gorm2 "gin_demo/model/gorm"
	"gin_demo/model/response"
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
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
	if !errors.Is(global.DB.Where("username = ?", json.User).First(&gorm2.SysUser{}).Error, gorm.ErrRecordNotFound) {
		response.FailWithMessage("用户已注册", c)
		return
	}
	err := global.DB.Create(&gorm2.SysUser{
		Username: json.User,
		Password: json.Password,
		UUID: uuid.NewV4(),
	}).Error
	fmt.Println(err)
	if err != nil {
		response.FailWithMessage("注册失败，请重试", c)
		return
	}
	response.OkWithMessage("注册成功", c)
}
