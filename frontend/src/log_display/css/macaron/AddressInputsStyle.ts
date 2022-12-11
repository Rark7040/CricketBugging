import {styled} from "@macaron-css/react";

export const AddressInputsBoxStyle = styled('div', {
    base: {
        marginTop: 20,
        marginLeft: 17,
        padding: 7,

        borderRadius: '.25rem',
        boxShadow: '0 1px 6px -1px ' + 'rgb(0, 0, 0, 20%)',

        backgroundColor: '#666',
        textAlign: 'left'
    }
});

export const RunningStatusStyle = styled('div', {
    base: {
        height: "10px",
        width: "15px",
        borderRadius: 30,
        margin: '1px -4px 4px',
    },
    variants: {
        color: {
            running: {
                backgroundColor: '#6cff56'
            },
            stopped: {
                backgroundColor: '#ff3c3c'
            }
        }
    },
    defaultVariants: {
        color: 'stopped'
    }
});

export const RunningStatusWrapperStyle = styled('div', {
    base: {
        width: '90%',
        borderBottom: '2px solid ' + '#777',
        margin: '0 auto'
    }
});

export const AddressLabelStyle= styled('div', {
    base: {
        textAlign: 'left',
        fontSize: '.7rem'
    }
});

export const AddressInputStyle = styled('input', {
    base: {
        textAlign: 'left',
        borderRadius: 3,
        border: 'none',
        outline: 'none',
        margin: 4,
        height: 27,
        width: 140,
        lineHeight: 30,
        padding: '0 30px',
        backgroundColor: '#ddd',

        ':hover': {
            border: 'border: 1px solid ' + 'rgba(14, 14, 14, 20%)',
            backgroundColor: '#fff',
        },

        ':focus': {
            border: 'border: 1px solid ' + 'rgba(14, 14, 14, 20%)',
            backgroundColor: '#fff',
        }
    }
});