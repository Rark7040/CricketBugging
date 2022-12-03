package main

import (
	"embed"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

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
		Width:     1100,
		Height:    650,
		MinWidth:  1100,
		MinHeight: 650,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Windows: &windows.Options{
			BackdropType: windows.Mica,
			Theme:        windows.Light,
			CustomTheme: &windows.ThemeSettings{
				LightModeTitleBar:  windows.RGB(255, 255, 255),
				LightModeTitleText: windows.RGB(20, 20, 20),
			},
		},
		Bind: []interface{}{
			binds,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
