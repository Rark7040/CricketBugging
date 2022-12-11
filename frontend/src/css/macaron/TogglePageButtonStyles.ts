import {styled} from "@macaron-css/react";

export const TogglePageButtonStyle = styled('button', {
    base: {
        backgroundColor: 'rgba(0, 0, 0, 0%)',

        color: '#cecece',
        fontWeight: 400,
        textTransform: 'uppercase',

        marginTop: 30,
        padding: 6,

        border: '1px solid ' + '#b7b7b7',
        borderRadius: 2,

        boxShadow: '2px .125rem .25rem ' + 'rgba(0, 0, 0, 0.075)',

        ':hover': {
            backgroundColor: '#5d5c5c',
            filter: 'brightness(140%)',
            padding: 4,
            transition: 'background-color 0.3s ease-out'
        }
    }
});
