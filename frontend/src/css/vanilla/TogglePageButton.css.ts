import {createTheme, style} from "@vanilla-extract/css";


export const [toggle_button_theme, vars] = createTheme({
    txt: {
        color: "#cecece",
        weight: "400",
        transform: "uppercase"
    },
    normal: {
        color: {
            bg: "rgba(255, 255, 255, 0)"
        },
        space: {
            top_margin: "30px",
            padding: "6px",
        }
    },
    hovered: {
        color: {
            bg: "#7a7a7a",
            filter: "brightness(150%)"
        },
        space: {
            padding: "4px",
        },
    },
    border: {
        radius: "2px",
        style: "solid",
        width: "1px",
        color: "#b7b7b7"
    },
    shadow: {
        offset: {
            x: "0",
            y: ".125rem"
        },
        radius: "0.25rem",
        color: "rgba(0, 0, 0, 0.075)"
    },
    transition: {
        padding: "padding 0.13s",
        bg: "background-color 0.5s ease-out"
    }
});

export const toggle_button_style = style({
    color: vars.txt.color,
    fontWeight: vars.txt.weight,
    textTransform: vars.txt.transform,

    backgroundColor: vars.normal.color.bg,
    marginTop: vars.normal.space.top_margin,
    padding: vars.normal.space.padding,

    borderRadius: vars.border.radius,
    borderStyle: vars.border.style,
    borderWidth: vars.border.width,
    borderColor: vars.border.color,
    boxShadow: [vars.shadow.offset.x, vars.shadow.offset.y, vars.shadow.radius , vars.shadow.color],

    ':hover': {
        backgroundColor: vars.hovered.color.bg,
        filter: vars.hovered.color.filter,
        padding: vars.hovered.space.padding,
        transition: [vars.transition.padding, vars.transition.bg]
    }
});