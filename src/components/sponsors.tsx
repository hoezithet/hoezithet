import React from 'react';
import kuLeuvenLogo from "../../images/sponsor/KULEUVEN_RGB_LOGO.png";
import vivesLogo from "../../images/sponsor/VIVES.png";
import { Link } from 'gatsby-theme-material-ui';
import Grid from "@mui/material/Grid";


export default function Sponsors({ width = "56mm", showTreat = true}) {
    const imgStyles = {width: width};
    return (
        <div style={{breakInside: "avoid"}}>
        <p style={{fontWeight: "bold"}}>Hoe Zit Het? wordt met trots gesteund door</p>
        <Grid container spacing={ 4 } justifyContent="center" alignItems="center" >
          <Grid item>
            <a href="https://www.kuleuven.be/kuleuven">
                <img src={ kuLeuvenLogo } style={imgStyles} alt="KU Leuven sponsor" />
            </a>
          </Grid>
          <Grid item>
            <a href="https://www.vives.be/">
                <img src={ vivesLogo } style={imgStyles} alt="VIVES sponsor" />
            </a>
          </Grid>
        </Grid>
        { showTreat ?
          <p>
              Wil jij ook steunen? Trakteer Hoe Zit Het? op een drankje! 🥤 Ga daarvoor naar <Link to="/trakteer">de trakteer-pagina</Link>.
          </p>
          : null }
        </div>
    );
}
