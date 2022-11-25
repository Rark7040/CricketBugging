package main

import (
	"cricket-bugging/gophertunnel"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()
	tunnel := gophertunnel.NewGopherTunnel()
	err := wails.Run(&options.App{
		Title:  "CricketBugging",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			tunnel,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
