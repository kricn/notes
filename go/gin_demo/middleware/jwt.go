package middleware

import (
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
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": err.Error()})
			return
		}
		// 设置用户上下文
		c.Set("User", *claims)
		c.Next()
	}
}
