import React from "react";
import Layout from "components/layout";
import Link from 'next/link';
import Image from 'next/image';
import SectionCard from "components/sectionCard";
import { join } from 'path';
import { lessenSlug, lessenPath, getCourseBySlug, getContent } from "../lessen";


const ChapterCard = ({ chapter }) => {
    return (
        <SectionCard
        title={chapter.frontmatter.title}
        cardImage={chapter.frontmatter.image ? join(chapter.slug, chapter.frontmatter.image) : null}
        link={chapter.slug}>
            <ol>
                { 
                    chapter.lessons.map(
                        (l, i) => (
                            <li key={i}>
                                <Link href={l.slug}>
                                    <a>{l.frontmatter.title}</a>
                                </Link>
                            </li>
                        )
                    )
                }
            </ol>
        </SectionCard>
    );
};

export const CourseChapters = ({ course }) => {
    return (
        <div>
            {course.chapters.map((chapter, i) => 
                 <div key={i}>
                    <ChapterCard chapter={chapter} />
                  </div>
             )}
        </div>
    );
}

export default function CourseTemplate({ course }) {
    const crumbs = [{
        title: 'Lessen',
        slug: lessenSlug,
    }, {
        title: course.frontmatter.title,
        slug: course.slug,
    }];
    return (
        <Layout crumbs={ crumbs }>
            <h1>{ course.frontmatter.title }</h1>
            <CourseChapters course={course} />
        </Layout>
    );
}

export async function getStaticProps({ params }) {
    const slug = join(lessenSlug, params.course);
    return {
        props: {
            course: getCourseBySlug(slug)
        }
    };
}

export async function getStaticPaths() {
  const content = getContent();

  return {
    paths: content.courses.map((course) => {
      return {
        params: {
          course: course.slug.split('/').at(-1),
        },
      }
    }),
    fallback: false,
  }
}