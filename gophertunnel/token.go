package gophertunnel

import (
	"cricketbugging/log"
	"encoding/json"
	"fmt"
	"github.com/sandertv/gophertunnel/minecraft/auth"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/microsoft"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type deviceAuthConnect struct {
	UserCode        string `json:"user_code"`
	DeviceCode      string `json:"device_code"`
	VerificationURI string `json:"verification_uri"`
	Interval        int    `json:"interval"`
	ExpiresIn       int    `json:"expiresIn"`
}

type deviceAuthPoll struct {
	Error        string `json:"error"`
	UserID       string `json:"user_id"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

func genToken(l *log.Logger) oauth2.TokenSource {
	check := func(err error) {
		if err != nil {
			panic(err)
		}
	}
	token := new(oauth2.Token)
	tokenData, err := ioutil.ReadFile("token.tok")
	if err == nil {
		_ = json.Unmarshal(tokenData, token)
	} else {
		token, err = RequestLiveToken(l)
		check(err)
	}
	tsrc := auth.RefreshTokenSource(token)
	_, err = tsrc.Token()
	if err != nil {
		token, err = RequestLiveToken(l)
		check(err)
		tsrc = auth.RefreshTokenSource(token)
	}
	go func() {
		c := make(chan os.Signal, 3)
		signal.Notify(c, syscall.SIGTERM, syscall.SIGINT)
		<-c

		tok, _ := tsrc.Token()
		b, _ := json.Marshal(tok)
		_ = ioutil.WriteFile("token.tok", b, 0644)
		os.Exit(0)
	}()
	return tsrc
}

func RequestLiveToken(l *log.Logger) (*oauth2.Token, error) {
	d, err := startDeviceAuth()
	if err != nil {
		return nil, err
	}
	l.Logging(log.NewMsgNoContent(fmt.Sprintf("Authenticate at %v using the code %v", d.VerificationURI, d.UserCode)))
	ticker := time.NewTicker(time.Second * time.Duration(d.Interval))
	defer ticker.Stop()

	for range ticker.C {
		t, err := pollDeviceAuth(d.DeviceCode)
		if err != nil {
			return nil, fmt.Errorf("error polling for device auth: %w", err)
		}
		// If the token could not be obtained yet (authentication wasn't finished yet), the token is nil.
		// We just retry if this is the case.
		if t != nil {
			l.Logging(log.NewMsgNoContent(fmt.Sprintf("Authentication successful")))
			return t, nil
		}
	}
	panic("unreachable")
}

// startDeviceAuth starts the device auth, retrieving a login URI for the user and a code the user needs to
// enter.
func startDeviceAuth() (*deviceAuthConnect, error) {
	resp, err := http.PostForm("https://login.live.com/oauth20_connect.srf", url.Values{
		"client_id":     {"0000000048183522"},
		"scope":         {"service::user.auth.xboxlive.com::MBI_SSL"},
		"response_type": {"device_code"},
	})
	if err != nil {
		return nil, fmt.Errorf("POST https://login.live.com/oauth20_connect.srf: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("POST https://login.live.com/oauth20_connect.srf: %v", resp.Status)
	}
	data := new(deviceAuthConnect)
	return data, json.NewDecoder(resp.Body).Decode(data)
}

// pollDeviceAuth polls the token endpoint for the device code. A token is returned if the user authenticated
// successfully. If the user has not yet authenticated, err is nil but the token is nil too.
func pollDeviceAuth(deviceCode string) (t *oauth2.Token, err error) {
	resp, err := http.PostForm(microsoft.LiveConnectEndpoint.TokenURL, url.Values{
		"client_id":   {"0000000048183522"},
		"grant_type":  {"urn:ietf:params:oauth:grant-type:device_code"},
		"device_code": {deviceCode},
	})
	if err != nil {
		return nil, fmt.Errorf("POST https://login.live.com/oauth20_token.srf: %w", err)
	}
	poll := new(deviceAuthPoll)
	if err := json.NewDecoder(resp.Body).Decode(poll); err != nil {
		return nil, fmt.Errorf("POST https://login.live.com/oauth20_token.srf: json decode: %w", err)
	}
	_ = resp.Body.Close()
	if poll.Error == "authorization_pending" {
		return nil, nil
	} else if poll.Error == "" {
		return &oauth2.Token{
			AccessToken:  poll.AccessToken,
			TokenType:    poll.TokenType,
			RefreshToken: poll.RefreshToken,
			Expiry:       time.Now().Add(time.Duration(poll.ExpiresIn) * time.Second),
		}, nil
	}
	return nil, fmt.Errorf("non-empty unknown poll error: %v", poll.Error)
}
