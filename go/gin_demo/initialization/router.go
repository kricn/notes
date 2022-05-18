package initialization

import (
	routers "gin_demo/routers"
	"github.com/gin-gonic/gin"
)

func InitRouters() {
	r := gin.Default()

	/** 静态文件使用 */
	r.Static("resource", "./resource")

	// 限制表单上传大小 8MB，默认为32MB
	r.MaxMultipartMemory = 8 << 20

	/** 路由分组 */
	privateRouter := r.Group("")

	routers := new (routers.Routers)
	/** 注册路由 */
	{
		routers.DealWithParams.InitDealWithParams(privateRouter)
		routers.FileUpload.InitFileUpload(privateRouter)
	}
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "success"})
	})
	r.Run(":1010")
}
