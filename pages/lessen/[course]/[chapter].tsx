import React from "react";
import Layout from "components/layout";
import SectionCard from "components/sectionCard";
import { lessenSlug, lessenPath, getChapterBySlug, getContent } from "../../lessen";
import { join } from 'path';
import flatten from "lodash/flatten";


const EXCERPT_LENGTH = 250;

export default function ChapterTemplate({ chapter }) {
    return (
        <Layout crumbs={ chapter.crumbs }>
            <h1>{ chapter.title }</h1>
            {
                chapter.lessons.map((lesson, i) => 
                    <SectionCard key={ i } title={lesson.frontmatter.title}
                        cardImage={lesson.frontmatter.image ? join(lesson.slug, lesson.frontmatter.image) : null }
                        link={lesson.slug}>
                        { lesson.frontmatter.description ? lesson.frontmatter.description : `${lesson.content.slice(0, EXCERPT_LENGTH)}...` }
                    </SectionCard>)
            }
        </Layout>
    );
}


export async function getStaticProps({ params }) {
    const slug = join(lessenSlug, params.course, params.chapter);
    return {
        props: {
            chapter: getChapterBySlug(slug),
        }
    };
}

export async function getStaticPaths() {
  const content = getContent();

  return {
    paths: flatten(content.courses.map((course) => {
         return course.chapters.map((chapter) => {
             return {
                 params: {
                   course: chapter.slug.split('/').at(-2),
                   chapter: chapter.slug.split('/').at(-1),
                 },
             }
         });
    })),
    fallback: false,
  }
}