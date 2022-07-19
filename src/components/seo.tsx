import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { getSrc } from "gatsby-plugin-image"

interface OpenGraphProps {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
}

function OpenGraph({title, description, url, image, siteName}: OpenGraphProps) {
  return (
    <Helmet
        meta={[
          {
            property: `og:title`,
            content: title,
          },
          {
            property: `og:description`,
            content: description,
          },
          {
            property: `og:image`,
            content: image,
          },
          {
            property: `og:url`,
            content: url,
          },
          {
            property: `og:type`,
            content: `website`,
          },
          {
            property: `og:site_name`,
            content: siteName,
          },
        ]}
    />
  );
}

interface TwitterCardProps {
  title: string;
  description: string;
  username: string;
  image: string;
}

function TwitterCard({title, description, image, username}: TwitterCardProps) {
  return (
    <Helmet
      meta={[
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: username,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:image`,
          content: image,
        },
        {
          name: `twitter:description`,
          content: description,
        },
      ]}
    />
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

function JsonOrganization({name, url, logo, email, legalName, foundingDate, founderName, socials}: JsonOrganizationProps) {
  return (
  <Helmet>
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
  </Helmet>
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

function JsonBreadcrumbs({crumbs, baseUrl}: JsonBreadcrumbsProps) {
  const itemList = crumbs.map(({title, slug}, index) => (
    `{
        "@type": "ListItem",
        "position": ${index},
        "name": "${title}",
        "item": "${new URL(slug, baseUrl)}"
     }`
  ));
  return (
  <Helmet>
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
  </Helmet>
  );
}

interface MetaProps {
  description: string;
  keywords: string[];
  author: string;
}

function Meta({description, keywords, author}: MetaProps) {
  return (
    <Helmet
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          name: `keywords`,
          content: `${keywords}`,
        },
        {
          name: `author`,
          content: author
        }
      ]}
    />
  );
}

function SEO({ crumbs, description = ``, tags = null,
               image = `` }: SEOProps) {
    const { site } = useStaticQuery(
      graphql`
        query {
          site {
            siteMetadata {
              organization {
                name
                legalName
                founder
                foundingDate
                logo
              }
              title
              siteUrl
              description
              tags
              email
              twitterUsername
              socials
              lang
            }
          }
        }
      `,
    );
    
    const pageCrumb = crumbs.slice(-1)[0];
    const url = `${new URL(pageCrumb.slug, site.siteMetadata.siteUrl)}`;
    const title = pageCrumb.title;
    const imgUrl = getSrc(image || site.siteMetadata.organization.logo);

    return (
      <>
        <Helmet
          htmlAttributes={{
              lang: site.siteMetadata.lang,
          }}
          title={title}
          titleTemplate={
            title !== site.siteMetadata.title 
            ?
            `%s | ${site.siteMetadata.title}`
            :
            `%s`
          }
        />
        <Meta
          description={description || site.siteMetadata.description}
          keywords={tags || site.siteMetadata.tags}
          author={site.siteMetadata.organization.founder}
        />
        <JsonBreadcrumbs crumbs={crumbs} baseUrl={site.siteMetadata.siteUrl} />
        <JsonOrganization
          name={site.siteMetadata.organization.name}
          url={site.siteMetadata.siteUrl}
          logo={site.siteMetadata.organization.logo}
          email={site.siteMetadata.email}
          legalName={site.siteMetadata.organization.legalName}
          foundingDate={site.siteMetadata.organization.foundingDate}
          founderName={site.siteMetadata.organization.founder}
          socials={site.siteMetadata.socials}
        />
        <TwitterCard
          title={title}
          description={description || site.siteMetadata.description}
          image={imgUrl}
          username={site.siteMetadata.twitterUsername}
        />
        <OpenGraph
          title={title}
          description={description || site.siteMetadata.description}
          image={imgUrl}
          url={url}
          siteName={site.siteMetadata.title}
        />
      </>
    );
}

interface SEOProps {
    crumbs: Breadcrumb[];
    description?: string;
    tags?: string[]|null;
    image?: string;
}

export default SEO;
