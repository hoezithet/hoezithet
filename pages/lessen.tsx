import React from "react";
import Layout from "components/layout";
import matter from 'gray-matter';
import fs from 'fs';
import { join } from 'path';
import { CourseChapters } from './lessen/[course]';


const contentPath = join(process.cwd(), 'content');
export const lessenPath = join(contentPath, 'lessen');
export const lessenSlug = '/lessen';
const REGISTRY = {};

const getPathSlugMdxs = ({path, slug}) => {
    const slugs = fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .map(s => join(slug, s));
    return slugs.map((slug) => getMdxBySlug(slug));
};

const getParentCrumbs = (slug) => {
    const slugItems = slug.split('/').slice(1);
    return slugItems.slice(0, -1).map((item, i) => {
        const parentSlug = `/${join(...slugItems.slice(0, i + 1))}`;
        const parentMdx = getMdxBySlug(parentSlug);
        return {
            title: parentMdx.frontmatter.title,
            slug: parentSlug,
        };
    });    
};

const getMdxBySlug = (slug) => {
    if (REGISTRY[slug] === undefined) {
        const path = join(contentPath, slug);
        const indexPath = join(path, 'index.mdx');
        const fileContents = fs.readFileSync(indexPath, 'utf8');
        const { data, content } = matter(fileContents);
        const nullIfUndef = x => x === undefined ? null : x;
        delete data.date;
        REGISTRY[slug] = {
            frontmatter: data,
            slug: slug,
            path: path,
            indexPath: indexPath,
            content: content,
            crumbs: [
               ...getParentCrumbs(slug),
               {
                   title: data.title,
                   slug: slug,
               }
            ],
        };
    }
    return REGISTRY[slug];
};

export const getCourseBySlug = (slug) => {
    const course = getMdxBySlug(slug);
    return addCourseChapters(course);
};

export const getChapterBySlug = (slug) => {
    const chapter = getMdxBySlug(slug);
    return addChapterLessons(chapter);
};

export const getLessonBySlug = (slug) => {
    return getMdxBySlug(slug);
};

const addChapterLessons = chapter => ({
    lessons: getPathSlugMdxs(chapter),
    ...chapter
});

const addCourseChapters = course => ({
    chapters: getPathSlugMdxs(course).map(addChapterLessons),
    ...course
});

export const getContent = () => {
    const contentMdx = getMdxBySlug(lessenSlug);
    return {
        courses: getPathSlugMdxs(contentMdx).map(addCourseChapters),
        ...contentMdx
    };
};

const compWght = (o1, o2) => {
    return o1.frontmatter.weight - o2.frontmatter.weight;
};

export default function AllCourses({content}) {
    return (
        <Layout crumbs={content.crumbs}>
            {content.courses.sort(compWght).map((course, index) => (
                <div key={index}>
                    <h1>{course.frontmatter.title}</h1>
                    <CourseChapters course={course} />
                </div>
            ))}
        </Layout>
    );
};

export async function getStaticProps() {
    const content = getContent();

    return {
        props: {
            content: content,
        }
    };
}