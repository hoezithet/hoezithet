import React, { createContext } from 'react';
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { getSrc } from "gatsby-plugin-image";
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import { ToggleImage } from "../components/shortcodes/toggleImage";
import Color, {
    Black,
    LightBlue,
    Blue,
    DarkBlue,
    DarkRed,
    Navy,
    Green,
    Yellow,
    Gold,
    Orange,
    Red,
    Purple,
    Gray,
    Mute,
} from "../components/shortcodes/color";
import Toc from "../components/toc";
import Layout from "../components/layout";
import Sponsors from '../components/sponsors';
import Feedback from "../components/feedback";
import PrintLink from "../components/printlink";
import { Exercise } from "../components/shortcodes/exercise";
import { ExVar, MdWithExVars } from "../components/shortcodes/exerciseVar";
import { FillStringWithFeedback as FillString } from "../components/shortcodes/fillAnswer";
import { MultipleAnswerWithFeedback as MultipleAnswer } from "../components/shortcodes/multipleAnswer";
import { MultipleChoiceWithFeedback as MultipleChoice } from "../components/shortcodes/multipleChoice";
import { Explanation } from "../components/shortcodes/explanation";
import { ExerciseStepper } from "../components/shortcodes/exerciseStepper";
import { SaveablePlot as Plot } from "../components/shortcodes/plot";
import { SaveableDrawing as Drawing } from "../components/shortcodes/drawing";
import { ArrowLine } from "../components/shortcodes/arrow";
import { Fx } from "../components/shortcodes/fx";
import { SvgNote } from "../components/shortcodes/svgNote";
import { Annot } from "../components/shortcodes/annot";
import { Line } from "../components/shortcodes/line";
import { Point } from "../components/shortcodes/point";
import { Rectangle } from "../components/shortcodes/rectangle";
import { HairLines } from "../components/shortcodes/hairlines";
import { AnimTex, ExplanationStep, EqnSqrtStep } from "../components/shortcodes/animTex";
import { Link } from 'gatsby-theme-material-ui';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BlockquoteBox from "../components/blockquote";
import Table from '../components/table';
import { LayoutProps } from "../components/layout";
import Comments from "../components/comments";
import SectionCard, { CardImage } from "./sectionCard";

export const shortcodes = {
    Mute,
    Attention,
    Expand,
    ToggleImage,
    Color,
    Black,
    LightBlue,
    Blue,
    DarkBlue,
    Navy,
    Green,
    Yellow,
    Gold,
    Orange,
    Red, DarkRed, Purple, Gray,
    FillString, MultipleAnswer, MultipleChoice, Explanation,
    Exercise, ExerciseStepper,
    MdWithExVars, ExVar,
    Plot, Drawing, Fx, Point, Annot, HairLines, Line, ArrowLine, Rectangle, SvgNote,
    AnimTex, ExplanationStep, EqnSqrtStep,
};

export const components = {
    a: Link,
    blockquote: BlockquoteBox,
    table: Table,
}

export interface MdxNode {
    frontmatter: {
        title: string;
        description: string;
        tags: string[];
        image: CardImage;
        level: number;
    };
    body: string;
    tableOfContents: { items: { url: string; title: string }[] };
    fields: {
        slug: string
        content_type: string;
        chapter_slug: string;
        course_slug: string;
        all_courses_slug: string;
    };
    excerpt: string;
}

export interface LessonData {
    data: {
        lesson: MdxNode;
        nextLesson: MdxNode;
        prevLesson: MdxNode;
        defaultImg: CardImage;
    };
    pageContext: {
      crumbs: LayoutProps["crumbs"];
    };
}

export const LessonContext = createContext({title: "", slug: ""});

export default function Template(
    { data, pageContext }: LessonData // this prop will be injected by the GraphQL query below.
) {
    const { lesson, nextLesson, prevLesson, defaultImg } = data;
    const { frontmatter, body, tableOfContents } = lesson;
    const { crumbs } = pageContext;
    const prevSiblingCard = (
      prevLesson ? 
      <SectionCard title={ `👈 Vorige les: ${prevLesson.frontmatter.title}` } cardImage={prevLesson.frontmatter.image || defaultImg } link={prevLesson.fields.slug} />
      :
      <></>
    );
    
    const nextSiblingCard = (
      nextLesson ? 
      <SectionCard title={ `Volgende les: ${nextLesson.frontmatter.title} 👉` } cardImage={nextLesson.frontmatter.image || defaultImg } link={nextLesson.fields.slug} />
      :
      <></>
    );
    
    const image = frontmatter.image;
    const slug = lesson.fields.slug;
    const pdfLink = `${slug.split('/').slice(3, -1).join("-").replace(" ", "_")}.pdf`;
    return (
        <LessonContext.Provider value={{title: frontmatter.title, slug: slug}}>
            <Layout crumbs={ crumbs } description={ frontmatter.description }
                    tags={ frontmatter.tags } image={ image ? getSrc(image.childImageSharp.gatsbyImageData) : getSrc(defaultImg.childImageSharp.gatsbyImageData) } >
                <h1>{frontmatter.title}</h1>
                <PrintLink to={ pdfLink } />
                <Toc>
                    { tableOfContents }
                </Toc>
                <MDXProvider components={ shortcodes }>
                  <MDXProvider components={ components }>
                      <MDXRenderer>{body}</MDXRenderer>
                  </MDXProvider>
                </MDXProvider>
                <PrintLink to={ pdfLink } />
                <Feedback />
                <Box my={ 4 }>
                    <Grid container spacing={ 2 } justify="space-between">
                        { prevSiblingCard }
                        { nextSiblingCard }
                    </Grid>
                </Box>
                <Box my={ 4 } textAlign="center" justifyContent="center">
                    <Sponsors />
                </Box>
                <Comments />
            </Layout>
        </LessonContext.Provider>
    );
}

export const pageQuery = graphql`
           query LessonQuery($filePath: String!, $prevPath: String, $nextPath: String) {
               lesson: mdx(fileAbsolutePath: { eq: $filePath }) {
                   body
                   frontmatter {
                       title
                       description
                       tags
                       image {
                           ...CardImageFragment
                       }
                   }
                   tableOfContents(maxDepth: 2)
                   fields {
                       slug
                   }
               }
               prevLesson: mdx(fileAbsolutePath: { eq: $prevPath }) {
                   ...SiblingMdxFragment
               }
               nextLesson: mdx(fileAbsolutePath: { eq: $nextPath }) {
                   ...SiblingMdxFragment
               }
               defaultImg: file(
                   sourceInstanceName: { eq: "images" }
                   name: { eq: "default_title_img" }
                   extension: { eq: "png" }
               ) {
                   ...CardImageFragment
               }
           }

           fragment SiblingMdxFragment on Mdx {
               fileAbsolutePath
               frontmatter {
                   title
                   image {
                       ...CardImageFragment
                   }
               }
               fields {
                   slug
               }
           }
       `;
