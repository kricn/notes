package server

import (
	"encoding/json"
	"gin_demo/global"
	"gin_demo/model"
	"gin_demo/model/response"
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
	"strings"
)

type User struct {}

const bearerLength = len("Bearer ")

// GetUserInfo 获取用户信息
func getUserInfo(c *gin.Context) {
	token := strings.TrimSpace(c.GetHeader("Authorization")[bearerLength:])
	claims, _ := utils.ParseToken(token)
	var userInfo model.ResponseUserInfo
	cacheUserInfo, _ := global.RDB.Get(claims.Username).Result()
	json.Unmarshal([]byte(cacheUserInfo), &userInfo)
	response.OkWithDetailed(userInfo, "成功", c)
}

func (user *User) InitRouters (r *gin.RouterGroup)  {
	r.GET("getUserInfo", getUserInfo)
}

