package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()
	binds := NewBinds() //binds backend funcs to frontend.
	err := wails.Run(&options.App{
		Title:     "CricketBugging",
		Width:     1024,
		Height:    600,
		MinWidth:  1024,
		MinHeight: 900,
		Frameless: false,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			binds,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
