package api

import (
	"encoding/json"
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
	"time"
)

type BaseApi struct {}

func (b *BaseApi) Login(c *gin.Context) {
	var form model.LoginForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(400, gin.H{"message": common.GetErrorMsg(form, err)})
		return
	}
	//if !utils.CaptchaVerify(c, json.Code) {
	//	response.FailWithMessage("验证码错误", c)
	//	return
	//}
	queryUser := &gorm2.SysUser{}
	if errors.Is(global.DB.Where("username = ? AND password = ?", form.Username, form.Password).Find(&queryUser).Error, gorm.ErrRecordNotFound) {
		response.FailWithMessage("用户名或密码错误", c)
		return
	}
	token, err := utils.GenerateToken(&model.UserInfo{
		Username: form.Username,
		Password: form.Password,
		UUID: queryUser.UUID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "授权失败，请重新登录",
		})
		return
	}
	cacheData, _ := json.Marshal(queryUser)
	global.RDB.Set(queryUser.Username, cacheData, time.Hour * 8)
	response.OkWithDetailed(&model.ResponseLoginInfo{
		UserInfo: model.ResponseUserInfo{
			UUID: queryUser.UUID,
			Username: queryUser.Username,
			NickName: queryUser.NickName,
			HeaderImg: queryUser.HeaderImg,
		},
		Token: token,
	}, "登录成功", c)
}

func (b *BaseApi) Register(c *gin.Context) {
	var json model.LoginForm
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(400, gin.H{"message": common.GetErrorMsg(json, err)})
		return
	}
	if !utils.CaptchaVerify(c, json.Code) {
		response.FailWithMessage("验证码错误", c)
		return
	}
	if !errors.Is(global.DB.Where("username = ?", json.Username).First(&gorm2.SysUser{}).Error, gorm.ErrRecordNotFound) {
		response.FailWithMessage("用户已注册", c)
		return
	}
	err := global.DB.Create(&model.UserInfo{
		Username: json.Username,
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
