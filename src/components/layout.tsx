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

const Layout = ({ children, crumbs, description=``, tags=[],
                  image=`` }: LayoutProps) => {
    const breadCrumbs = <Crumbs crumbs={ crumbs }/>;
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
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
            </ThemeProvider>
        </>
    );
};

export default Layout;
