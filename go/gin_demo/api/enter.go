package api

type AppGroup struct {
	BaseApi
	CommonApi
}

var App = new(AppGroup)
