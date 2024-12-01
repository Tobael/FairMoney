import {createTheme as muiCreateTheme} from "@mui/material/styles";

export const theme = muiCreateTheme({
    palette: {
        landing: {
            main: "#999999",
            contrastText: "#ffffff",
        },
        default: {
            main: "#00B55B",
            contrastText: "#ffffff",
        },
    },
    components: {
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: "white", // Ändere die Farbe des InputAdornments
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& fieldset": {
                        borderColor: "white", // Standardfarbe
                    },
                    "&:hover fieldset": {
                        borderColor: "white", // Hover-Farbe
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "white", // Fokus-Farbe
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "white", // Standard-Label-Farbe
                    "&.Mui-focused": {
                        color: "white", // Label-Farbe bei Fokus
                    },
                    "&.Mui-error": {
                        color: "white", // Label-Farbe bei Fehler
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&:before": {
                        borderBottomColor: "white", // Farbe der unteren Linie im normalen Zustand
                    },
                    "&:after": {
                        borderBottomColor: "white", // Farbe der unteren Linie im unselect Zustand
                    },
                    "&.Mui-focused:after": {
                        borderBottomColor: "white", // Farbe der unteren Linie, wenn das Feld fokussiert ist
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: "70%",
                    height: "50px",
                    maxWidth: "500px",
                    color: "white",

                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: "20px"
                },
            },
        },
        MuiFab: {
            variants: [
                {
                    props: {variant: "default"},
                    style: {
                        backgroundColor: "#00B55B",
                        color: "#ffffff",
                        "&:disabled": {
                            backgroundColor: "#00B55B",
                            color: "white",
                            opacity: 0.6,
                        },
                    },
                },
            ],
        },
        MuiButton: {
            variants: [
                {
                    props: {variant: "default"},
                    style: {
                        width: "70%",
                        maxWidth: "500px",
                        backgroundColor: "#00B55B",
                        color: "#ffffff",
                        "&:disabled": {
                            backgroundColor: "#00B55B",
                            color: "white",
                            opacity: 0.6,
                        },
                    },
                },
                {
                    props: {variant: "landing"},
                    style: {
                        width: "70%",
                        maxWidth: "500px",
                        color: "#ffffff",
                        backgroundColor: "#999999",

                        "&:disabled": {
                            backgroundColor: "#999999",
                            color: "white",
                            opacity: 0.6,
                        },
                    },
                },
            ],
        },
    },
});
