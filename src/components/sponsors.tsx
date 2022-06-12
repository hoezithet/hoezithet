import React from 'react';
import styled from "styled-components";
import kuLeuvenLogo from "../../images/sponsor/KULEUVEN_RGB_LOGO.png";
import vivesLogo from "../../images/sponsor/VIVES.png";
import { Link } from 'gatsby-theme-material-ui';
import Grid from "@mui/material/Grid";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
    img: {
        width: props => props.imgWidth
    },
    wrapper: {
        breakInside: "avoid"
    },
    headText: {
        fontWeight: "bold"
    }
});


export default function Sponsors({ width = "56mm", showTreat = true}) {
    const classes = useStyles({imgWidth: width});
    return (
        <div className={classes.wrapper}>
        <p className={classes.headText}>Hoe Zit Het? wordt met trots gesteund door</p>
        <Grid container spacing={ 4 } justifyContent="center" alignItems="center" >
          <Grid item>
            <a href="https://www.kuleuven.be/kuleuven">
                <img src={ kuLeuvenLogo } className={classes.img} alt="KU Leuven sponsor" />
            </a>
          </Grid>
          <Grid item>
            <a href="https://www.vives.be/">
                <img src={ vivesLogo } className={classes.img} alt="VIVES sponsor" />
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
