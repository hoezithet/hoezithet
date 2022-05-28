import React from "react";
import COLORS from '../colors';


interface TocItems {
    children: { items: {url: string; title: string}[] };
}

const Toc = ({ children }: TocItems) => (
    children.items ?
    <div className="root">
        <div>
            Inhoud
        </div>
        <ul>{ children.items.map((item) => <li key={ item.title }><TocLink href={item.url}>{item.title}</TocLink></li>) }</ul>
        <style jsx>{`
            .root {
                margin: 20px 0px;
                color: ${COLORS.GRAY};
            }
            .root div {
                font-weight: bold;
            }
            a {
                text-decoration: none;
                color: ${COLORS.GRAY};
            }
        `}</style>
    </div>
    : null
);

export default Toc ;
