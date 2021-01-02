import React from "react";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from "gatsby-theme-material-ui";
import SectionCard, { CardImage } from "./sectionCard";
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import { MdxNode } from "./lesson";
import { graphql } from "gatsby";


const LessonListItem = styled.li`
    font-size: 12pt;
`

export interface MdxNodes {
    nodes: MdxNode[];
}

export interface MdxGroup {
    group: MdxNodes[]
}

interface QueryData {
    chapters: MdxNodes;
    lessons: MdxGroup;
    defaultImg: CardImage;
}

interface CourseData {
    pageContext: {
        crumbs: LayoutProps["crumbs"];
        slug: string;
        title: string;
        tree: object;
    };
    data: QueryData;
}

interface ChapterCardProps {
    chapter: MdxNode;
    chapterLessons: MdxNode[];
    defaultImg: CardImage;
}

function ChapterCard({ chapter, chapterLessons, defaultImg}: ChapterCardProps) {
    return (
        <SectionCard
        title={chapter.frontmatter.title}
        cardImage={chapter.frontmatter.image || defaultImg}
        link={chapter.fields.slug}>
            <ol>
                { 
                    chapterLessons.map(
                        l => (
                            <LessonListItem>
                                <Link to={l.fields.slug}>
                                    {l.frontmatter.title}
                                </Link>
                            </LessonListItem>
                        )
                    )
                }
            </ol>
        </SectionCard>

    )
}

function getChapterLessons(chapter: MdxNode, lessons: MdxGroup) {
    const chapterLessonGroups = lessons.group.filter(({ nodes }) =>
        nodes.every(n => n.fields.chapter_slug === chapter.fields.slug)
    );
    if (chapterLessonGroups.length > 0) {
        return chapterLessonGroups[0].nodes;
    } else {
        return [];
    }
}

export function CourseChapters({ chapters, lessons, defaultImg }: QueryData) {
    const lessonsPerChapter = chapters.nodes.map(c => getChapterLessons(c, lessons));
    return (
    <Grid container spacing={2}>
        { chapters.nodes.map((c, index) => (
            <ChapterCard chapter={c} chapterLessons={lessonsPerChapter[index]} defaultImg={defaultImg} />
        )
         ) }
    </Grid>
    );
}

export default function CourseTemplate({ pageContext, data }: CourseData) {
    const { crumbs, title , tree } = pageContext;
    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <CourseChapters chapters={data.chapters} lessons={data.lessons} defaultImg={data.defaultImg} />
        </Layout>
    );
}

export const courseQuery = graphql`
    query CourseQuery($slug: String!) {
        chapters: allMdx(
            filter: { fields: { content_type: { eq: "chapter" }, course_slug: { eq: $slug } } }
            sort: { fields: frontmatter___weight, order: ASC }
        ) {
            nodes {
                frontmatter {
                    image {
                        ...CardImageFragment
                    }
                    title
                }
                fields {
                    slug
                }
            }
        }
        lessons: allMdx(
            filter: { fields: { content_type: { eq: "lesson" }, course_slug: { eq: $slug } } }
            sort: { fields: frontmatter___weight, order: ASC }
        ) {
            group(field: fields___chapter_slug) {
                nodes {
                    frontmatter {
                        title
                    }
                    fields {
                        slug
                        chapter_slug
                    }
                }
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
