import {createTheme, style} from "@vanilla-extract/css";


const props = {
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
            bg: "#5d5c5c",
            filter: "brightness(140%)" //文字が背景につぶれないように
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
            x: "2px",
            y: ".125rem"
        },
        radius: "0.25rem",
        color: "rgba(0, 0, 0, 0.075)"
    },
    transition: {
        bg: "background-color 0.3s ease-out"
    }
};

export const [toggle_button_theme, vars] = createTheme(props);

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
    boxShadow: [props.shadow.offset.x, props.shadow.offset.y, props.shadow.radius , props.shadow.color].join(' '),

    ':hover': {
        backgroundColor: vars.hovered.color.bg,
        filter: vars.hovered.color.filter,
        padding: vars.hovered.space.padding,
        transition: vars.transition.bg
    }
});