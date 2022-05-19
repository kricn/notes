package middleware

import (
	"gin_demo/model"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

const contextKeyUserObj = "authedUserObj"
const bearerLength = len("Bearer ")

func ctxTokenToUser(c *gin.Context) {
	token, ok := c.GetQuery("_t")
	if !ok {
		hToken := c.GetHeader("Authorization")
		if len(hToken) < bearerLength {
			c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": "header Authorization has not Bearer token"})
			return
		}
		token = strings.TrimSpace(hToken[bearerLength:])
	}
	usr, err := model.JwtParseUser(token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"msg": err.Error()})
		return
	}

	//store the user Model in the context
	c.Set(contextKeyUserObj, *usr)
	c.Next()
	// after request
}

func JwtMiddleware(c *gin.Context) {
	ctxTokenToUser(c)
}

//func mWuserId(c *gin.Context) (uint, error) {
//	v,exist := c.Get(contextKeyUserObj)
//	if !exist {
//		return 0,errors.New(contextKeyUserObj + " not exist")
//	}
//	user, ok := v.(model.User)
//	if ok {
//		return user.Id, nil
//	}
//	return 0,errors.New("can't convert to user struct")
//}