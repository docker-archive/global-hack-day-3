package godoauth

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/docker/libtrust"
	"gopkg.in/yaml.v2"
)

type Config struct {
	Version string     `yaml:"version,omitempty"`
	Log     Log        `yaml:"log,omitempty"`
	Storage Storage    `yaml:"storage,omitempty"`
	HTTP    ServerConf `yaml:"http"`
	Token   Token      `yaml:"token"`
}

type Log struct {
	Level string `yaml:"level,omitempty"`
	File  string `yaml:"file,omitempty"`
}

type Storage struct {
	Vault Vault `yaml:"vault"`
}

type Vault struct {
	Host      string `yaml:"host"`
	Port      int    `yaml:"port"`
	AuthToken string `yaml:"auth_token"`
	Proto     string `yaml:"proto"`
}

type ServerConf struct {
	Addr    string    `yaml:"addr"`
	Timeout string    `yaml:"timeout"`
	TLS     ServerTLS `yaml:"tls"`

	publicKey  libtrust.PublicKey
	privateKey libtrust.PrivateKey
}

type ServerTLS struct {
	Certificate string `yaml:"certificate,omitempty"`
	Key         string `yaml:"key,omitempty"`
}

type Token struct {
	Issuer      string `yaml:"issuer"`
	Expiration  int64  `yaml:"expiration"`
	Certificate string `yaml:"certificate,omitempty"`
	Key         string `yaml:"key,omitempty"`

	publicKey  libtrust.PublicKey
	privateKey libtrust.PrivateKey
}

func (c *Config) Parse(path string) error {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}

	if err := yaml.Unmarshal(b, c); err != nil {
		return err
	}
	if c.Token.Certificate != "" && c.Token.Key != "" {
		c.Token.publicKey, c.Token.privateKey, err = c.loadCerts(c.Token.Certificate, c.Token.Key)
		if err != nil {
			return err
		}
	}
	// Sign something dummy to find out which algorithm is used.
	_, sigAlg, err := c.Token.privateKey.Sign(strings.NewReader("whoami"), 0)
	if err != nil {
		return fmt.Errorf("failed to sign: %s", err)
	}
	// check if the library supports this sign algorithm
	if alg := jwt.GetSigningMethod(sigAlg); alg == nil {
		return fmt.Errorf("signing algorithm not supported: %s", sigAlg)
	}
	return nil
}

func (c *Config) loadCerts(certFile, keyFile string) (pk libtrust.PublicKey, prk libtrust.PrivateKey, err error) {
	certificate, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		return
	}
	x509Cert, err := x509.ParseCertificate(certificate.Certificate[0])
	if err != nil {
		return
	}
	pk, err = libtrust.FromCryptoPublicKey(x509Cert.PublicKey)
	if err != nil {
		return
	}
	prk, err = libtrust.FromCryptoPrivateKey(certificate.PrivateKey)
	return
}
