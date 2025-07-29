import React from 'react';
import { Link } from 'gatsby-theme-material-ui';
import Box from "@mui/material/Box";
import { TrakteerButtons } from 'pages/trakteer';


export default function Sponsors({ width = "56mm" }) {
    const imgStyles = {width: width};
    return (
        <Box style={{breakInside: "avoid"}} sx={{py: 3}}>
            <h2>Steun Hoe Zit Het! ❤️</h2>
            <TrakteerButtons />
        </Box>
    );
}
