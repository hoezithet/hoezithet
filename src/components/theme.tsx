import React from 'react';
import COLORS from '../colors';
import Matomo from './matomo';
import '@fontsource/quicksand';


interface HzhThemeProps {
    children: React.ReactElement;
}


export default function HzhTheme({ children }: HzhThemeProps) {
    return (
        <>
            <Matomo />
            { children }
            <style jsx global>{`
                body: {
                    background-color: ${COLORS.NEAR_WHITE};
                    font-size: 1rem;
                    line-height: 1.5;
                }
                a.anchor: {
                    display: none;
                    margin: 0 0 0 8px;
                }
                h2:hover > .anchor: {
                    display: inline;
                }
                table: {
                    text-align: center;
                    margin: auto;
                    break-inside: avoid;
                    border-collapse: separate;
                }
                table thead: {
                    background-color: ${COLORS.LIGHT_GRAY};
                }
                table td, th: {
                    padding: 16px;
                }
                table th:first-child: {
                     border-radius: .5rem 0 0 0;
                }
                table th:last-child: {
                     border-radius: 0 .5rem 0 0;
                }
                table > tbody > tr:last-child > td:first-child: {
                    border-radius: 0 0 0 .5rem;
                }
                table > tbody > tr:last-child > td:last-child: {
                    border-radius: 0 0 .5rem 0;
                }
                table > tbody > tr:nth-child(odd): {
                    background-color: #eee;
                }
                table > tbody > tr:nth-child(even): {
                    background-color: #f1f1f1;
                }
            `}</style>
        </>
    );
}
