import React from "react";
import { Breadcrumbs } from "@mui/material";
import { Link } from "gatsby-theme-material-ui";
import { styled } from '@mui/system';

export interface CrumbProps {
    crumbs: {
        slug: string;
        title: string;
    }[];
}

const BreadcrumbLink = styled(Link)({
    color: 'inherit',
    textDecoration: 'none',
});

const Crumbs = ({ crumbs }: CrumbProps) => {
    const breadCrumbLinks = crumbs.map(({ slug, title }, index) => {
        if (index < crumbs.length - 1) {
            return (
                <BreadcrumbLink to={slug} key={slug}>
                    {title}
                </BreadcrumbLink>
            );
        } else {
            return (
                <BreadcrumbLink to={slug} aria-current="page" key={slug}>
                    {title}
                </BreadcrumbLink>
            );
        }
    });

    return (
        <header>
            <Breadcrumbs aria-label="breadcrumb" maxItems={4}>
                {breadCrumbLinks}
            </Breadcrumbs>
        </header>
    );
};

export default Crumbs;
