import React from "react";
import { Breadcrumbs } from '@material-ui/core';
import { Link } from "gatsby-theme-material-ui";
import styled from 'styled-components';


export interface CrumbProps {
    crumbs: {
        slug: string;
        title: string;
    }[];
}

const BreadcrumbLink = styled(Link)`
    color: inherit;
`;

const Crumbs = ({ crumbs }: CrumbProps) => {

    const breadCrumbLinks = crumbs.map(({ slug, title }, index) => {
        if (index < crumbs.length - 1) {
            return (<BreadcrumbLink to={ slug } key={ slug }>
                        { title }
                    </BreadcrumbLink>);
        } else {
            return (<BreadcrumbLink to={ slug } aria-current="page" key={ slug }>
                        { title }
                    </BreadcrumbLink>);
        }
    });

    return (
        <header>
            <Breadcrumbs aria-label="breadcrumb" maxItems={2}>
                { breadCrumbLinks }
            </Breadcrumbs>
        </header>
    );
}

export default Crumbs;
