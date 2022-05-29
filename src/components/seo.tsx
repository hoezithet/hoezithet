import React from 'react';
import Head from 'next/head';
import config from '../config';


interface OpenGraphProps {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
}

const OpenGraph = ({title, description, url, image, siteName}: OpenGraphProps) => {
    return (
        <>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
        </>
    );
}

interface TwitterCardProps {
  title: string;
  description: string;
  username: string;
  image: string;
}

const TwitterCard = ({title, description, image, username}: TwitterCardProps) => {
    return (
        <>
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:creator" content={username} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:image" content={image} />
            <meta property="twitter:description" content={description} />
        </>
    );
}

interface JsonOrganizationProps {
  name: string;
  url: string;
  logo: string;
  email: string;
  legalName: string;
  foundingDate: string;
  founderName: string;
  socials: string[];
}

const JsonOrganization = ({name, url, logo, email, legalName, foundingDate, founderName, socials}: JsonOrganizationProps) => {
    return (
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "${url}",
              "logo": {
                "@type": "ImageObject",
                "url": "${logo}"
              },
              "name": "${name}",
              "legalName": "${legalName}",
              "foundingDate": "${foundingDate}",
              "founders": [
                {
                  "@type": "Person",
                  "name": "${founderName}"
                }],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "${email}"
                },
                "sameAs": [${socials.map(s => `"${s}"`).join(",")}]
              }
            `}
        </script>
    );
}

interface Breadcrumb {
    title: string;
    slug: string;
}

interface JsonBreadcrumbsProps {
  crumbs: Breadcrumb[];
  baseUrl: string;
}

const JsonBreadcrumbs = ({crumbs, baseUrl}: JsonBreadcrumbsProps) => {
    const itemList = crumbs.map(({title, slug}, index) => (
        `{
            "@type": "ListItem",
            "position": ${index},
            "name": "${title}",
            "item": "${new URL(slug, baseUrl)}"
         }`
    ));

    return (
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                ${itemList.join(",")}
            ]
          }
        `}
        </script>
    );
}

interface MetaProps {
  description: string;
  keywords: string[];
  author: string;
}

const Meta = ({description, keywords, author}: MetaProps) => {
    return (
        <>
            <meta property="description" content={description} />
            <meta property="keywords" content={`${keywords}`} />
            <meta property="author" content={author} />
        </>
    );
}

function SEO({ crumbs, description = ``, tags = null,
               image = null }: SEOProps) {
    const site = config.site;

    const pageCrumb = crumbs.slice(-1)[0];
    const url = `${new URL(pageCrumb.slug, config.siteUrl)}`;
    const title = pageCrumb.title;
    const imgUrl = (image || config.organization.logo);

    return (
      <Head>
        <title lang={config.lang}>
            {`${title} | ${config.title}`}
        </title>
        <Meta
          description={description || config.description}
          keywords={tags || config.tags}
          author={config.organization.founder}
        />
        <JsonBreadcrumbs crumbs={crumbs} baseUrl={config.siteUrl} />
        <JsonOrganization
          name={config.organization.name}
          url={config.siteUrl}
          logo={config.organization.logo}
          email={config.email}
          legalName={config.organization.legalName}
          foundingDate={config.organization.foundingDate}
          founderName={config.organization.founder}
          socials={config.socials}
        />
        <TwitterCard
          title={title}
          description={description || config.description}
          image={imgUrl}
          username={config.twitterUsername}
        />
        <OpenGraph
          title={title}
          description={description || config.description}
          image={imgUrl}
          url={url}
          siteName={config.title}
        />
      </Head>
    );
}

interface SEOProps {
    crumbs: Breadcrumb[];
    description?: string;
    tags?: string[]|null;
    image?: string;
}

export default SEO;
