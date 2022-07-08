package api

import (
	"encoding/json"
	"errors"
	"gin_demo/global"
	"gin_demo/model"
	gorm2 "gin_demo/model/gorm"
	"gin_demo/model/response"
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"strings"
	"time"
)

type UserApi struct {}

const bearerLength = len("Bearer ")

// GetUserInfo 获取用户信息
func (user *UserApi) GetUserInfo(c *gin.Context) {
	token := strings.TrimSpace(c.GetHeader("Authorization")[bearerLength:])
	claims, _ := utils.ParseToken(token)
	var userInfo model.ResponseUserInfo
	cacheUserInfo, _ := global.RDB.Get(claims.Username).Result()
	json.Unmarshal([]byte(cacheUserInfo), &userInfo)
	response.OkWithDetailed(userInfo, "成功", c)
}

// UpdateUserInfo 更新用户信息
func (user *UserApi) UpdateUserInfo(c *gin.Context)  {
	token := strings.TrimSpace(c.GetHeader("Authorization")[bearerLength:])
	claims, _ := utils.ParseToken(token)
	var form model.UserInfo
	c.ShouldBindJSON(&form)
	if len(form.UUID) == 0 {
		response.FailWithMessage("缺少用户uuid", c)
		return
	}
	if claims.Uuid != form.UUID {
		response.FailWithMessage("表单uuid与token中的uuid不一致", c)
		return
	}
	if errors.Is(global.DB.Where("uuid = ?", form.UUID).First(&gorm2.SysUser{}).Error, gorm.ErrRecordNotFound) {
		response.FailWithMessage("用户不存在", c)
		return
	}
	global.DB.Model(gorm2.SysUser{}).Where("uuid = ?", form.UUID).Omit("uuid").Updates(form)
	var userInfo gorm2.SysUser
	global.DB.Where("uuid = ?", form.UUID).First(&gorm2.SysUser{})
	cacheData, _ := json.Marshal(userInfo)
	global.RDB.Set(userInfo.Username, cacheData, time.Hour * 8)
	response.OkWithMessage("更新成功", c)
}
