package routers

import (
	"gin_demo/model"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DealWithParams struct {}

// 处理 json 格式的请求
func jsonHandler (c *gin.Context) {
	// 声明接收的变量
	var json model.Login
	// 将request的body中的数据，自动按照json格式解析到结构体
	if err := c.ShouldBindJSON(&json); err != nil {
		// 返回错误信息
		// gin.H封装了生成json数据的工具
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 判断用户名密码是否正确
	if json.User != "root" || json.Password != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "304"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "200"})
}

/** 处理 formData 格式的请求 */
func formHandler(c *gin.Context)  {
	// 声明接收的变量
	var form model.Login
	// Bind()默认解析并绑定form格式
	// 根据请求头中content-type自动推断
	if err := c.Bind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 判断用户名密码是否正确
	if form.User != "root" || form.Password != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "304"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "200"})
}

/** 处理 uri 上的请求 */
func uriHandler(c *gin.Context) {
	// 声明接收的变量
	var login model.Login
	// Bind()默认解析并绑定form格式
	// 根据请求头中content-type自动推断
	if err := c.ShouldBindUri(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 判断用户名密码是否正确
	if login.User != "root" || login.Password != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "304"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "200"})
}

/** 处理 get 请求 */
func getQueryHandler(c *gin.Context)  {
	var query model.Login
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 获取所有参数
	//allQuery := c.Request.URL.Query()
	//fmt.Println(allQuery)
	c.JSON(http.StatusOK, gin.H{
		"msg": "success",
		"username": query.User,
		"password": query.Password,
	})
}

func privateTestHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"msg": "success",
	})
}

func (e *DealWithParams) InitDealWithParams(r *gin.RouterGroup) {
	r.POST("loginJSON", jsonHandler)
	r.POST("loginForm", formHandler)
	r.GET(":user/:password", uriHandler)
	r.GET("getByQuery", getQueryHandler)
	r.GET("private_test", privateTestHandler)
}
