package api

type AppGroup struct {
	BaseApi
	CommonApi
	UserApi
}

var App = new(AppGroup)
