import React, { createContext } from 'react';
import LessonContext from "contexts/lessonContext";
import { ToggleImage } from "components/shortcodes/toggleImage";
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
} from "components/shortcodes/color";
import Toc from "components/toc";
import Layout from "components/layout";
import Sponsors from 'components/sponsors';
import PrintLink from "components/printlink";
import Link from 'next/link';
import Callout from "components/callout";
import SectionCard from "components/sectionCard";
import { lessenSlug, lessenPath, getLessonBySlug, getContent } from "../../../lessen";
import { join } from 'path';
import flatten from "lodash/flatten";
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax/svg.js';
import mathjaxOptions from "mathjaxOptions";
import imageSize from "rehype-img-size";
import Image from 'next/image';


export const shortcodes = {
    Mute,
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
};


const components = (slug) => ({
    a: Link,
    blockquote: Callout,
    img: ({ src, alt }) => {
        return (
            <img
              alt={alt}
              src={require('../../../../content/' + slug + '/' + src).default}
            />
        )
    },
});


export default function LessonTemplate({ lesson }) {
    const frontmatter = lesson.frontmatter;
    const image = frontmatter.image;
    const slug = lesson.slug;
    const crumbs = lesson.crumbs;
    const pdfLink = `${slug.split('/').slice(3, -1).join("-").replace(" ", "_")}.pdf`;

    return (
        <LessonContext.Provider value={{title: frontmatter.title, slug: slug}}>
            <Layout crumbs={ crumbs } description={ frontmatter.description }
                    tags={ frontmatter.tags } image={ image } >
                <h1>{frontmatter.title}</h1>
                {/** <PrintLink to={ pdfLink } /> **/ }
                { /** <Toc>{ tableOfContents }</Toc> **/ }
                <MDXRemote { ...lesson.content } components={{...shortcodes, ...components(slug)}} />
                {/** <PrintLink to={ pdfLink } /> **/ }
                <div>
                    <Sponsors />
                </div>
            </Layout>
        </LessonContext.Provider>
    );
}


export async function getStaticProps({ params }) {
    const slug = join(lessenSlug, params.course, params.chapter, params.lesson);
    const lesson = getLessonBySlug(slug);
    lesson.content = await serialize(
        lesson.content,
        {
            mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [
                    [rehypeMathjax, mathjaxOptions],
                    [imageSize, { dir: join("content", slug) }],
                ],
            },
        }
    );
    return {
        props: {
            lesson: lesson,
        }
    };
}

export async function getStaticPaths() {
  const content = getContent();

  return {
    paths: flatten(content.courses.map((course) => {
         return flatten(course.chapters.map((chapter) => {
             return chapter.lessons.map((lesson) => {
                 return {
                     params: {
                       course: lesson.slug.split('/').at(-3),
                       chapter: lesson.slug.split('/').at(-2),
                       lesson: lesson.slug.split('/').at(-1),
                     },
                 };
             });
         }));
    })),
    fallback: false,
  }
}