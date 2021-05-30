import React from "react";
import { Link } from 'gatsby-theme-material-ui';
import SvgIcon from '@material-ui/core/SvgIcon';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import { Gray } from "./shortcodes/color";

interface PrintLinkProps {
  to: string;
}

const PdfIcon = (props) => {
    return (
        <SvgIcon viewBox={"0 0 48 48"} {...props}>
	        <path d="M 41.317838,9.8953842 32.087069,0.66461517 A 2.2523076,2.2523076 0 0 0 30.499377,0.01846134 H 29.945531 V 11.981538 H 41.908608 V 11.40923 a 2.2338461,2.2338461 0 0 0 -0.59077,-1.5138458 z" />
	        <path d="M 29.262454,15.027692 A 2.2523076,2.2523076 0 0 1 27.010146,12.775384 V -2e-7 H 8.3086084 A 2.2338461,2.2338461 0 0 0 6.0747623,2.2523074 V 45.673845 a 2.2338461,2.2338461 0 0 0 2.2338461,2.326154 H 39.693223 a 2.2338461,2.2338461 0 0 0 2.233846,-2.252308 V 15.027692 Z m 4.283077,20.787692 a 14.086153,14.086153 0 0 1 -5.981539,-1.846154 54.406152,54.406152 0 0 0 -7.384615,2.178461 c -2.381538,4.08 -4.043077,5.76 -5.704615,5.76 a 2.8615384,2.8615384 0 0 1 -2.012308,-0.923077 c -1.846153,-2.196923 2.547693,-5.058461 5.095385,-6.350769 v 0 a 86.326152,86.326152 0 0 0 3.803077,-8.012307 15.636923,15.636923 0 0 1 -0.756923,-7.2 2.3446153,2.3446153 0 0 1 4.467692,0.627692 13.181538,13.181538 0 0 1 -0.572308,6 9.3599998,9.3599998 0 0 0 3.987692,5.04 c 1.846154,-0.24 5.538462,-0.609231 6.886154,0.664615 a 2.4184615,2.4184615 0 0 1 -1.827692,4.061539 z" />
	        <path d="m 22.893223,19.624615 a 9.0461536,9.0461536 0 0 0 0.184616,4.393846 c 0.516923,-0.941539 0.590769,-4.393846 -0.184616,-4.393846 z" />
	        <path d="M 22.911685,28.412307 A 40.615384,40.615384 0 0 1 20.32707,34.283076 34.172307,34.172307 0 0 1 26.2163,32.233845 12.221538,12.221538 0 0 1 22.911685,28.412307 Z" />
	        <path d="m 30.388608,32.898461 c 3.470769,1.476923 3.987692,0.84923 3.987692,0.84923 0.387692,-0.258461 -0.221538,-1.107692 -3.987692,-0.84923 z" />
        </SvgIcon>
    );
};

const PrintLink = ({ to }: PrintLinkProps) => {
  return (
      <Link to={ to }>
      <Gray>
      <Grid container spacing={ 1 } alignItems="center" >
          <Grid item >
              <PdfIcon />
          </Grid>
          <Grid item >
              Download deze les als pdf
          </Grid>
      </Grid>
      </Gray>
      </Link>
  )
}

export default PrintLink;