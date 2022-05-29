import React from 'react';

import Footer from './footer';
import Crumbs from './crumbs';
import { CrumbProps } from './crumbs';
import HzhAppBar from './appbar';
import HzhTheme from './theme';
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
                    padding: 1rem;
                }
                main {
                    margin-bottom: 2rem;
                }
            `}</style>
        </HzhTheme>
    );
};

export default Layout;
