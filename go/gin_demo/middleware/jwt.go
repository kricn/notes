package middleware

import (
	"gin_demo/global"
	"gin_demo/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)


func JwtAuth() gin.HandlerFunc {
	const bearerLength = len("Bearer ")
	return func (c *gin.Context) {
		hToken := c.GetHeader("Authorization")
		if len(hToken) < bearerLength {
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": "header Authorization has not Bearer token"})
			return
		}
		// 分离token的值
		token := strings.TrimSpace(hToken[bearerLength:])
		claims, err := utils.ParseToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": "无效token"})
			return
		}
		// 设置用户上下文
		global.RDB.HSet("user", "user", claims)
		c.Next()
	}
}
