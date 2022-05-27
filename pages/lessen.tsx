import React from "react";
import Layout, { LayoutProps } from "../components/layout";
import { CourseChapters, MdxGroup, MdxNodes } from "./course";
import { graphql } from "gatsby";
import { CardImage } from "./sectionCard";
import { MdxNode } from "./lesson";

interface AllCoursesData {
    pageContext: {
        slug: string;
        title: string;
        crumbs: LayoutProps["crumbs"];
    };
    data: {
        courses: MdxNodes;
        chapters: MdxGroup;
        lessons: MdxGroup;
        defaultImg: CardImage;
    }
}

function getCourseChapters(course: MdxNode, chapters: MdxGroup) {
    const courseChapterGroups = chapters.group.filter(({ nodes }) =>
        nodes.every(n => n.fields.course_slug === course.fields.slug)
    );
    if (courseChapterGroups.length > 0) {
        return courseChapterGroups[0];
    } else {
        return {nodes: []};
    }
}

export default function AllCoursesTemplate({ pageContext, data }: AllCoursesData) {
    const { title, crumbs } = pageContext;
    const chaptersPerCourse = data.courses.nodes.map(c => getCourseChapters(c, data.chapters));
    return (
        <Layout crumbs={crumbs}>
            {data.courses.nodes.map((course, index) => (
                <>
                    <h1>{course.frontmatter.title}</h1>
                    <CourseChapters
                        chapters={chaptersPerCourse[index]}
                        lessons={data.lessons}
                        defaultImg={data.defaultImg}
                    />
                </>
            ))}
        </Layout>
    );
}

export const allCoursesQuery = graphql`
    query AllCoursesQuery($slug: String!) {
        courses: allMdx(
            filter: { fields: { content_type: { eq: "course" }, all_courses_slug: { eq: $slug } } }
            sort: { fields: frontmatter___weight, order: ASC }
        ) {
            nodes {
                frontmatter {
                    title
                }
                fields {
                    slug
                }
            }
        }
        chapters: allMdx(
            filter: { fields: { content_type: { eq: "chapter" }, all_courses_slug: { eq: $slug } } }
            sort: { fields: frontmatter___weight, order: ASC }
        ) {
            group(field: fields___course_slug) {
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
                        course_slug
                    }
                }
            }
        }
        lessons: allMdx(
            filter: { fields: { content_type: { eq: "lesson" }, all_courses_slug: { eq: $slug } } }
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
                        course_slug
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
