package initialization

import (
	"gin_demo/middleware"
	"gin_demo/model/response"
	routers "gin_demo/routers"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", "*")  // 可将将 * 替换为指定的域名
			c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
			c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
			c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
			c.Header("Access-Control-Allow-Credentials", "true")
		}
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		c.Next()
	}
}

func InitRouters() {
	r := gin.Default()
	r.Use(Cors())
	/** 静态文件使用 */
	r.Static("resource", "./resource")

	// 限制表单上传大小 8MB，默认为32MB
	r.MaxMultipartMemory = 8 << 20



	/** 路由分组 */
	privateRouter := r.Group("")
	privateRouter.Use(middleware.JwtAuth())

	// 用户组
	userRouter := privateRouter.Group("user")

	/** common router */
	commonRouter := r.Group("")

	routers := new (routers.Routers)
	// 注册公共路由
	{
		routers.CommonUser.InitUserRouter(commonRouter)
		routers.Common.InitCommonRouter(commonRouter)
	}
	/** 注册私有路由 */
	{
		routers.DealWithParams.InitDealWithParams(privateRouter)
		routers.FileUpload.InitFileUpload(privateRouter)
		/** 注册用户组路由 */
		routers.User.InitRouters(userRouter)
	}
	r.GET("/test", func(c *gin.Context) {
		response.Ok(c)
	})
	r.Run(":1010")
}
