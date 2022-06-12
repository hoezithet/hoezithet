import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import SectionCard, { CardImage } from "./sectionCard";
import Grid from '@mui/material/Grid';
import { MdxNode } from "./lesson";

interface ChapterData {
    pageContext: {
        crumbs: LayoutProps["crumbs"];
        slug: string;
        title: string;
    };
    data: {
        lessons: {
            nodes: MdxNode[];
        };
        chapter: MdxNode;
        defaultImg: CardImage;
    };
}

export default function ChapterTemplate({ pageContext, data }: ChapterData) {
    const { crumbs, title } = pageContext;
    
    const lessonLinks = data.lessons.nodes.map(node => {
        const title = node.frontmatter.title;
        const cardImage = node.frontmatter.image || data.defaultImg;
        const link = node.fields.slug;
        return (<SectionCard key={ title } title={title} cardImage={cardImage} link={link}>
                    { node.frontmatter.description ? node.frontmatter.description : node.excerpt }
                </SectionCard>
            );
    }
    );

    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <Grid container spacing={2}>
                { lessonLinks }
            </Grid>
        </Layout>
    );
}

export const chapterQuery = graphql`
    query ChapterQuery($slug: String!) {
        lessons: allMdx(
            filter: { fields: { content_type: { eq: "lesson" }, chapter_slug: { eq: $slug } } }
            sort: { fields: frontmatter___weight, order: ASC }
        ) {
            nodes {
                fields {
                    slug
                }
                frontmatter {
                    title
                    description
                    image {
                        ...CardImageFragment
                    }
                    level
                }
                excerpt(pruneLength: 200, truncate: true)
            }
        }
        chapter: mdx(fields: {slug: {eq: $slug}}) {
            frontmatter {
              title
            }
        }
        defaultImg: file(
            sourceInstanceName: { eq: "images" }
            name: { eq: "default_title_img" }
            extension: { eq: "png" }
        ) {
            ...CardImageFragment
        }
    }
`;
