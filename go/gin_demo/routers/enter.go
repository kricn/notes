package routers

import (
	"gin_demo/routers/common"
	"gin_demo/routers/server"
)

type Routers struct {
	server.DealWithParams
	server.FileUpload
	common.User
}