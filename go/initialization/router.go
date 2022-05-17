package initialization

import (
	routers "gin_demo/routers"
	"github.com/gin-gonic/gin"
)

func InitRouters() {
	r := gin.Default()

	/** 路由分组 */
	privateRouter := r.Group("")

	routers := new (routers.Routers)
	/** 注册路由 */
	{
		routers.DealWithParams.InitDealWithParams(privateRouter)
	}
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "success"})
	})
	r.Run(":1010")
}
