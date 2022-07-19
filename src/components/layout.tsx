import React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme';
import { styled } from '@mui/system';

import Footer from './footer';
import Crumbs from './crumbs';
import { CrumbProps } from './crumbs';
import HzhAppBar from './appbar';
import SEO from './seo';

export interface LayoutProps {
    children: React.ReactNode;
    crumbs: CrumbProps["crumbs"];
    description?: string;
    tags?: string[];
    image?: string;
}

const HzhContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const HzhMain = styled('main')(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

export const BaseLayout = ({ children, barColor="primary", barElevation=1 }) => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <HzhAppBar color={barColor} elevation={barElevation} />
                { children }
                <Footer />
            </ThemeProvider>
        </>
    );
};

const Layout = ({ children, crumbs, description=``, tags=[],
                  image=`` }: LayoutProps) => {
    const breadCrumbs = <Crumbs crumbs={ crumbs }/>;
    return (
        <BaseLayout>
            <SEO crumbs={ crumbs } description={ description }
                tags={ tags } image={ image } />
            <HzhContainer maxWidth="md">
                { breadCrumbs }
                <HzhMain>{ children }</HzhMain>
            </HzhContainer>
        </BaseLayout>
    );
};

export default Layout;
