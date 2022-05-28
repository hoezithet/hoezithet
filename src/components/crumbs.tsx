import React from "react";
import Link from 'next/link';


export interface CrumbProps {
    crumbs: {
        slug: string;
        title: string;
    }[];
}


const Crumbs = ({ crumbs }: CrumbProps) => {
    return (
        <header>
            <div aria-label="breadcrumb">
                {crumbs.map(({ slug, title }, index) =>
                    <Link href={slug} aria-current={index < crumbs.length - 1 ? null : "page"} key={index}>
                        <a>{title}</a>
                    </Link>
                 )}
            </div>
            <style jsx>{`
                main {
                    color: inherit;
                }
            `}</style>
        </header>
    );
};

export default Crumbs;
