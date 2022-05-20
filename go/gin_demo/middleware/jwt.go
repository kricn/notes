package middleware

import (
	"fmt"
	"gin_demo/unit"
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
		token := strings.TrimSpace(hToken[bearerLength:])
		fmt.Println(token)
		claims, err := unit.ParseToken(token)
		fmt.Println(err)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": err.Error()})
			return
		}
		c.Set("User", *claims)
		c.Next()
	}
}
