package server

import (
	"gin_demo/model/response"
	"github.com/gin-gonic/gin"
	"net/http"
)

type FileUpload struct {}

// 单/多文件
// type 1 多文件 其他值为单文件
func uploadHandler(c *gin.Context) {
	uploadType := c.DefaultQuery("type", "0")
	path := "resource/"
	if uploadType != "1" {
		file, err := c.FormFile("file")
		filePath := path + file.Filename
		if err != nil {
			uploadFile(err, c)
			return
		}
		err = c.SaveUploadedFile(file, "./" + filePath)
		if err != nil {
			uploadFile(err, c)
			return
		}
		response.OkWithDetailed(map[string]interface{}{
			"path": filePath,
		}, "上传成功", c)
	} else {
		form, err := c.MultipartForm()
		if err != nil {
			uploadFile(err, c)
			return
		}
		// 获取所有图片
		files := form.File["file"]
		// 遍历所有图片
		for _, file := range files {
			// 逐个存
			if err := c.SaveUploadedFile(file, "./" + path + file.Filename); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"code": -1,
					"msg": err,
				})
				return
			}
		}
		response.OkWithMessage("上传成功", c)
	}
}

func uploadFile(err error, c *gin.Context) {
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": -1,
			"msg": err,
		})
	}
}

func (e *FileUpload) InitFileUpload (r *gin.RouterGroup) {
	r.POST("upload", uploadHandler)
}