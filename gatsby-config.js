module.exports = {
    flags: { PRESERVE_WEBPACK_CACHE: true, FAST_DEV: true },
    siteMetadata: {
        organization: {
            name: `Hoe Zit Het?`,
            legalName: `Hoe Zit Het? vzw`,
            founder: `Floris De Feyter`,
            foundingDate: `2019`,
            logo: `https://hoezithet.nu/images/favicon.png`,
        },
        title: `Hoe Zit Het?`,
        siteUrl: `https://hoezithet.nu`,
        description: `Verlichte uitleg wiskunde en fysica`,
        tags: [`uitleg`, `wiskunde`, `fysica`],
        email: `hallo@hoezithet.nu`,
        twitterUsername: `@flo_defeyter`,
        socials: [`https://github.com/hoezithet`, `https://fb.me/hoezithet`],
        lang: `nl`,
    },
    plugins: [
        `gatsby-plugin-typescript`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                excludes: ['/bare/*']
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/images`,
            },
        },
        `gatsby-plugin-image`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Hoe Zit Het?`,
                short_name: `hoezithet`,
                start_url: `/`,
                background_color: `#F4F4F4`,
                theme_color: `#FFB700`,
                display: `minimal-ui`,
                icon: `images/favicon.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-offline`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/content`,
            },
        },
        `gatsby-remark-images`,
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                defaultLayouts: {
                    default: require.resolve(`./src/templates/lesson.tsx`),
                },
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: {
                            isIconAfterHeader: true,
                        },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                    },
                    {
                        resolve: `gatsby-remark-unwrap-images`,
                    },
                ],
                remarkPlugins: [
                    require("remark-math"),
                    [
                        require("remark-html-katex"),
                        require('./src/katexOptions'),
                    ],
                ],
            },
        },
        {
            resolve: `gatsby-theme-material-ui`,
        },
        `gatsby-plugin-material-ui`,
        `gatsby-plugin-catch-links`,
    ],
};
