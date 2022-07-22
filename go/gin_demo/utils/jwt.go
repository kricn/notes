package utils

import (
	"errors"
	"gin_demo/model"
	"github.com/dgrijalva/jwt-go"
	uuid "github.com/satori/go.uuid"
	"time"
)

// 自定义一个字符串，加密 key
var jwtSecret = []byte("gin_demo_jwt_key")
// jwt 颁发者
const jwtIss = "demo"

// Claims Claim是一些实体（通常指的用户）的状态和额外的元数据
type Claims struct {
	jwt.StandardClaims
	Username     string `json:"username"`
	Password string `json:"password"`
	Uuid uuid.UUID `json:"uuid"`
}

// GenerateToken 根据用户的用户名和密码产生token
func GenerateToken(user *model.UserInfo) (string, error) {
	// 设置 token 有效时间
	nowTime := time.Now()
	expireTime := nowTime.Add(3 * time.Hour)

	claims := &Claims{
		Username:     user.Username,
		Password: user.Password,
		Uuid: user.UUID,
		StandardClaims: jwt.StandardClaims{
			// 过期时间
			ExpiresAt: expireTime.Unix(),
			// 指定token发行人
			Issuer: jwtIss,
		},
	}

	tokenClaims:=jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	//该方法内部生成签名字符串，再用于获取完整、已签名的token
	token,err:=tokenClaims.SignedString(jwtSecret)
	return token,err
}

// ParseToken 根据传入的token值获取到Claims对象信息，（进而获取其中的用户名和密码）
func ParseToken(token string) (*Claims, error) {
	if token == "" {
		return nil, errors.New("no token is found in Authorization Bearer")
	}
	//用于解析鉴权的声明，方法内部主要是具体的解码和校验的过程，最终返回*Token
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if tokenClaims!=nil{
		// 从tokenClaims中获取到Claims对象，并使用断言，将该对象转换为我们自己定义的Claims
		// 要传入指针，项目中结构体都是用指针传递，节省空间。
		if claims,ok:=tokenClaims.Claims.(*Claims);ok&&tokenClaims.Valid{
			return claims,nil
		}
	}
	return nil,err
}

