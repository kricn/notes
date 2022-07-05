package middleware

import (
	"gin_demo/global"
	"gin_demo/utils"
	"github.com/dgrijalva/jwt-go"
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
			response := handleTokenUnValidationResponse(err)
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{
				"code": response.code,
				"msg": response.msg,
			})
			return
		}
		// 设置用户上下文
		global.RDB.HSet("user", "user", claims)
		c.Next()
	}
}

type ResponseInfo struct {
	code int
	msg string
}

func handleTokenUnValidationResponse(err error) (info ResponseInfo) {
	ve := err.(*jwt.ValidationError)
	if ve.Errors & jwt.ValidationErrorExpired != 0 {
		return ResponseInfo{
			code: -1001,
			msg: "token 过期",
		}
	} else {
		return ResponseInfo{
			code: -1,
			msg: "无效 token",
		}
	}
}
