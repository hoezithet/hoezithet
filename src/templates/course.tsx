import React from "react";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from "gatsby-theme-material-ui";
import SectionCard, { CardImage } from "./sectionCard";
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import { MdxNode } from "./lesson";
import { graphql } from "gatsby";


const levelToGradeName = (level: number) => (
  `${Math.ceil(level / 2)}e graad`
);

const LessonListItem = styled('li')({
    fontSize: '12pt',
})

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
                        (l, i) => (
                            <LessonListItem key={i}>
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

const StyledAccordion = styled(Accordion)({
    backgroundColor: 'transparent',
});

export function CourseChapters({ chapters, lessons, defaultImg }: QueryData) {
    const gradePerChapter = chapters.nodes.map(c => levelToGradeName(c.frontmatter.level));
    const grades = Array.from(new Set(gradePerChapter));
    return (
        <>
            {grades.map((grade, index) => {
                const gradeChapterNodes = chapters.nodes.filter(c => levelToGradeName(c.frontmatter.level) === grade);
                const lessonsPerChapter = gradeChapterNodes.map(c => getChapterLessons(c, lessons));
                return (
                    <Grid key={index} container spacing={2}>
                        {gradeChapterNodes.map((c, index) => (
                            <React.Fragment key={index}>
                                <ChapterCard
                                    chapter={c}
                                    chapterLessons={lessonsPerChapter[index]}
                                    defaultImg={defaultImg}
                                />
                            </React.Fragment>
                            ))}
                    </Grid>
                );
            })}
        </>
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
                    level
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
