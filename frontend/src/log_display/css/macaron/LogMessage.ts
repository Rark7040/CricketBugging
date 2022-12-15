import {styled} from "@macaron-css/react";

export const DisplayedLogStyle = styled('div', {
   base: {
       borderRadius: 3,

       ':hover': {
           border: '2px solid' + '#9870e5'
       }
   },
    variants: {
       displayed_content: {
           visible: {
              backgroundColor: '#1c1c1c',
           },
           invisible: {
               backgroundColor: '#222',
           }
       }
    },
    defaultVariants: {
       displayed_content: 'invisible'
    }
});

export const LogTitleStyle = styled('div', {
    base: {
        ':hover': {
            filter: "brightness(130%)",
            borderRadius: 2
        }
    },
    variants: {
        displayed_content: {
            visible: {
                paddingTop: 5,
                paddingBottom: 10
            },
            invisible: {
                paddingTop: 0,
                paddingBottom: 0
            }
        }
    },
    defaultVariants: {
        displayed_content: 'invisible'
    }
});

export const LogContentStyle = styled('div', {
    base: {
        marginTop: 0
    },
    variants: {
        displayed: {
            visible: {
                display: 'block',
            },
            invisible: {
                display: 'none'
            }
        }
    },
    defaultVariants: {
        displayed: 'invisible',
    }
});