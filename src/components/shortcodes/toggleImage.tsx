import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import React, { useState } from "react";

interface ToggleImageProps {
    children: {
        props: {
            children: (JSX.Element|string)[];
        };
    };
    toggleText: string;
}

export const ToggleImage = ({children, toggleText}: ToggleImageProps) => {
    const [state, setState] = useState({ toggled: false });
    const imgs = children.props.children.filter(c => c !== "\n")
    const img1 = imgs[0];
    const img2 = imgs[1];

  const explanationSwitch = (
      <Grid xs={12} item>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                  <Switch color="primary" onChange={e => setState({ toggled: e.target.checked })} />
              </Grid>
              <Grid item>
                  <span>{ toggleText }</span>
              </Grid>
          </Grid>
      </Grid>
  );

  return (
    <Grid container>
      <Grid xs={ 12 } item>
        <Box margin={ "auto" }>
          { state.toggled ? img2 : img1 }
        </Box>
      </Grid>
      { explanationSwitch }
    </Grid>
  );
}

export const ToggleImageBare = ({children, toggleText}: ToggleImageProps) => {
    const imgs = children.props.children.filter(c => c !== "\n")
    const img = imgs[1];

  const explanationSwitch = (
      <Grid xs={12} item>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                  <Switch color="primary" onChange={e => setState({ toggled: e.target.checked })} />
              </Grid>
              <Grid item>
                  <span>{ toggleText }</span>
              </Grid>
          </Grid>
      </Grid>
  );

  return (
      <Box margin={ "auto" }>
        { img }
      </Box>
  );
}