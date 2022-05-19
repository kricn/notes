package common

import (
	"encoding/json"
	"errors"
	"github.com/go-playground/validator/v10"
)

// Validator 验证器接口
type Validator interface {
	// GetMessages GetMessage 获取验证器自定义错误信息
	GetMessages() ValidatorMessages
}

// ValidatorMessages 验证器自定义错误信息字典
type ValidatorMessages map[string]string

// GetErrorMsg 获取自定义错误信息
func GetErrorMsg(request Validator, err error) string {
	var j *json.UnmarshalTypeError
	if errors.As(err, &j) {
		return "Parameter error"
	}
	for _, v := range err.(validator.ValidationErrors) {
		if message, exist := request.GetMessages()[v.Field() + "." + v.Tag()]; exist {
			return message
		}
		return v.Error()
	}
	return "Parameter error"
}

