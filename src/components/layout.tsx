import React from 'react';

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


const Layout = ({ children, crumbs, description=``, tags=[],
                  image=`` }: LayoutProps) => {
    const breadCrumbs = <Crumbs crumbs={ crumbs }/>;
    return (
        <HzhTheme>
            <SEO crumbs={ crumbs } description={ description }
                 tags={ tags } image={ image } />
            <HzhAppBar />
            <div>
                { breadCrumbs }
                <main>{ children }</main>
                <Footer />
            </div>
            <style jsx>{`
                div {
                    padding: ${theme.spacing(2)}px;
                }
                main {
                    margin-bottom: ${theme.spacing(4)}px;
                }
            `}</style>
        </HzhTheme>
    );
};

export default Layout;
