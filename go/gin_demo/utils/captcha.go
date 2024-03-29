package utils

import (
	"bytes"
	"gin_demo/global"
	"github.com/dchest/captcha"
	"net/http"
	"time"
)


func GenerateCaptcha(length ...int) string {
	l := captcha.DefaultLen
	if len(length) == 1 {
		l = length[0]
	}
	return captcha.NewLen(l)
}

func SetCaptcha(key string, value string)  {
	global.RDB.Set(key, value, time.Minute * 10)
}

func CaptchaVerify(key string, code string) bool {
	if captchaId, err := global.RDB.Get(key).Result(); err == nil{
		global.RDB.Del(key)
		if captcha.VerifyString(captchaId, code) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}

func Serve(w http.ResponseWriter, r *http.Request, id, ext, lang string, download bool, width, height int) error {
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	var content bytes.Buffer
	switch ext {
	case ".png":
		w.Header().Set("Content-Type", "image/png")
		_ = captcha.WriteImage(&content, id, width, height)
	case ".wav":
		w.Header().Set("Content-Type", "audio/x-wav")
		_ = captcha.WriteAudio(&content, id, lang)
	default:
		return captcha.ErrNotFound
	}

	if download {
		w.Header().Set("Content-Type", "application/octet-stream")
	}
	http.ServeContent(w, r, id+ext, time.Time{}, bytes.NewReader(content.Bytes()))
	return nil
}

