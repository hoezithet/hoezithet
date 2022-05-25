import React from 'react';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

import Footer from './footer';
import Crumbs from './crumbs';
import { CrumbProps } from './crumbs';
import HzhAppBar from './appbar';
import HzhTheme from './theme';
import { theme } from './theme';
import SEO from './seo';

export interface LayoutProps {
    children: React.ReactNode;
    crumbs: CrumbProps["crumbs"];
    description?: string;
    tags?: string[];
    image?: string;
}

const HzhContainer = styled(Container)`
    padding: ${theme.spacing(2)}px;
`;

const HzhMain = styled.main`
    margin-bottom: ${theme.spacing(4)}px;
`;

const Layout = ({ children, crumbs, description=``, tags=[],
                  image=`` }: LayoutProps) => {
    const breadCrumbs = <Crumbs crumbs={ crumbs }/>;
    return (
        <HzhTheme>
            <>
            <SEO crumbs={ crumbs } description={ description }
                 tags={ tags } image={ image } />
            <HzhAppBar />
            <HzhContainer maxWidth="md">
                <>
                { breadCrumbs }
                <HzhMain>{ children }</HzhMain>
                <Footer />
                </>
            </HzhContainer>
            </>
        </HzhTheme>
    );
};

export default Layout;
