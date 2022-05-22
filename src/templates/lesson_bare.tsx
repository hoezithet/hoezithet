import React, { useContext, createContext, useState } from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Helmet } from 'react-helmet';
import Sponsors from "../components/sponsors";
import HzhTheme from "../components/theme";

import BareLessonContext from "contexts/bareLessonContext";

import { Link } from "gatsby-theme-material-ui";
import Box from "@material-ui/core/Box";
import { components, MdxNode, shortcodes } from "./lesson";
import LessonContext from "../contexts/lessonContext";
import { ToggleImageBare } from "../components/shortcodes/toggleImage";
import { makeStyles } from '@material-ui/core/styles';
import { LessonSolutions } from '../components/shortcodes/lessonSolutions'


const useStyles = makeStyles({
    img: {
        width: "100%",
        height: "auto",
        position: "absolute",
        top: "0px",
    },
    header: {
        breakInside: "avoid",
        "&::after": {
            content: '""',
            display: "block",
            height: "100px",
            marginBottom: "-100px",
        }
    }
});

const BareImage = (props) => {
    const classes = useStyles();
    return (
        <img src={props.src} className={`gatsby-resp-image-image bare-img ${classes.img}`}/>
    );
};

const BareH1 = (props) => {
    const classes = useStyles();
    return (
        <h1 {...props} className={`${props.className || ""} ${classes.header}`}/>
    );
};

const BareH2 = (props) => {
    const classes = useStyles();
    return (
        <h2 {...props} className={`${props.className || ""} ${classes.header}`}/>
    );
};

const BareH3 = (props) => {
    const classes = useStyles();
    return (
        <h3 {...props} className={`${props.className || ""} ${classes.header}`}/>
    );
};

type AnchorProps = {
    href: string
};

const BareAnchor = (props: AnchorProps) => {
    const lessonContext = useContext(BareLessonContext);
    const href = lessonContext && lessonContext.absURL
        ?
        new URL(props.href, lessonContext.absURL).href
        : props.href;
    const newProps = {
        ...props,
        href: href
    };
    return (
        <a {...newProps} />
    );
};


const bareShortcodes = {
    ...shortcodes,
    ToggleImage: ToggleImageBare,
};

const bareComponents = {
    ...components,
    img: BareImage,
    h1: BareH1,
    h2: BareH2,
    h3: BareH3,
    a: BareAnchor
};

export interface LessonData {
    data: {
        lesson: MdxNode;
        site: {
            siteMetadata: {
                siteUrl: string;
            };
        };
    };
}

export default function Template({ data }: LessonData) {
    const { lesson, site } = data;
    const { siteMetadata } = site;
    const { frontmatter, body, fields } = lesson;
    const absURL = `${new URL(fields.slug, siteMetadata.siteUrl)}`;
    const slug = lesson.fields.slug;
    
    const [appendixItems, setAppendixItems] = useState([]);
    return (
        <BareLessonContext.Provider value={{absURL: absURL, setAppendixItems: setAppendixItems}}>
        <LessonContext.Provider value={{title: frontmatter.title, slug: slug}}>
        <HzhTheme>
            <>
                <Helmet title={frontmatter.title} />
                <h1>{frontmatter.title}</h1>
                <p>
                    <span>Bron: </span>
                    <Link to={absURL}>{absURL}</Link>
                </p>
                <MDXProvider components={bareShortcodes}>
                    <MDXProvider components={bareComponents}>
                        <MDXRenderer>{body}</MDXRenderer>
                    </MDXProvider>
                </MDXProvider>
                <Box my={4} textAlign="center" justifyContent="center">
                    <Sponsors width="28mm" showTreat={false} />
                </Box>
                { appendixItems.length > 0 ?
                  <>
                  <h2 style={{pageBreakBefore: "always"}}>Appendices</h2>
                  {
                      appendixItems.map(({appendixId, expandId, title, children, idx}) => (
                          <div key={idx} id={appendixId}>
                              <h3>A{idx}. {title} <a href={`#${expandId}`}>↩</a></h3>
                              { children }
                          </div>
                      ))
                  }
                  </>
                  : null }
                <LessonSolutions />
            </>
        </HzhTheme>
        </LessonContext.Provider>
        </BareLessonContext.Provider>
    );
}

export const pageQuery = graphql`
    query BareLessonQuery($filePath: String!) {
        lesson: mdx(fileAbsolutePath: { eq: $filePath }) {
            body
            frontmatter {
                title
            }
            fields {
                slug
            }
        }

        site {
            siteMetadata {
                siteUrl
                title
            }
        }
    }
`;
