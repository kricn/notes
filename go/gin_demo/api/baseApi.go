package api

import (
	"gin_demo/common"
	"gin_demo/model"
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
	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func (b *BaseApi) Register(c *gin.Context) {
	var json model.Login
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(400, gin.H{"message": common.GetErrorMsg(json, err)})
		return
	}

}
