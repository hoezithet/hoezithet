import React from 'react';
import { graphql, StaticQuery } from "gatsby";
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Img from "gatsby-image";

const allImgsQuery = graphql`
    {
        allFile(filter: { extension: { eq: "png" } }) {
            edges {
            node {
                childImageSharp {
                fluid(maxWidth: 500) {
                    ...GatsbyImageSharpFluid_tracedSVG
                }
                }
                publicURL
                absolutePath
            }
            }
        }
    }
`;

function getImageComponent(fluid, publicURL: string, alt: string) {
    return (
        <a href={publicURL}>
            <Img loading="eager" fluid={fluid} alt={alt} />
        </a>
    );
}

function renderStrippedImage(imgData, props) {
    const imgEdge = imgData.allFile.edges.find(({ node }) =>
        node.absolutePath.endsWith(props.src)
    );
    const absPath = imgEdge.node.absolutePath;
    const strippedAbsPath = absPath.replace(/\.[^.]+$/, '_stripped.png');
    const strippedImgEdge = imgData.allFile.edges.find(({ node }) =>
        node.absolutePath === strippedAbsPath
    );
    if (strippedImgEdge !== undefined) {
        const node = strippedImgEdge.node;
        return getImageComponent(node.childImageSharp.fluid, node.publicURL, props.alt);
    } else {
        return null;
    }
}

function renderRegularImage(imgData, props) {
    const imgEdge = imgData.allFile.edges.find(({ node }) =>
        node.absolutePath.endsWith(props.src)
    );
    const node = imgEdge.node;
    return getImageComponent(node.childImageSharp.fluid, node.publicURL, props.alt);
}

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showStripped: true};
    }

    switchPressed(event) {
        this.setState({showStripped: !event.target.checked})
    }

    render() {
        return <StaticQuery
                query={ allImgsQuery }
        render={imgData => {
            const image = renderRegularImage(imgData, this.props);
            const strippedImg = renderStrippedImage(imgData, this.props);

            const useStripped = strippedImg !== null;

            const explanationSwitch = (
                    <Grid xs={ 12 } item>
                        <Grid container justify="flex-end" alignItems="center">
                            <Grid item>
                                <Switch color="primary" onChange={e => this.switchPressed(e)} />
                            </Grid>
                            <Grid item>
                                <span>Toon uitleg</span>
                            </Grid>
                        </Grid>
                    </Grid>
            );

            return (
                <Grid container>
                    <Grid xs={ 12 } item>
                        <Box maxWidth={ 500 } margin={ "auto" }>
                            { useStripped && this.state.showStripped ? strippedImg : image }
                        </Box>
                    </Grid>
                    { useStripped ? explanationSwitch : null }
                </Grid>
            );
        }
        } />;
    }
}

export default Image;
