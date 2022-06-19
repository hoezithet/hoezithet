import React from 'react';
import styled from "styled-components";
import MuiPaper from '@mui/material/Paper';


const _Paper = styled(MuiPaper)`
    padding: 32px;
    margin: 16px;
    break-inside: "avoid";
`;


const Paper = (props: React.PropsWithChildren<any>) => {
    return (
        <_Paper>
            { props.children }
        </_Paper>
    );
};

export default Paper;
