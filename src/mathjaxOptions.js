import katexOptions from "./katexOptions";

const macros = Object.fromEntries(
    Object.entries(katexOptions.macros)
    .map(([macroName, macroDef]) => {
        macroName = macroName.slice(1);
        macroDef = macroDef.replace('\\htmlClass', '\\class');
        const rgx = /#(\d)/g;
        const argNums = [...macroDef.matchAll(rgx)].map(m => parseInt(m[1]));

        macroDef = macroDef.replace('\\color{', '\\color{#');

        if (argNums.length > 0) {
            return [macroName, [macroDef, argNums.length]];
        } else {
            return [macroName, macroDef];
        }
    })
);

const options = {
    tex: {
        macros: {
            ...macros,
            Lrarr: '\\Leftrightarrow',
            htmlId: ['{\\cssId{#1}{#2}}', 2],
            "\\euro": "\\unicode{0x20AC}",
        },
        packages: {'[+]': ['unicode']}
    },
    svg: {
        fontCache: 'none',
    },
    loader: {
      load: ['[tex]/unicode']
    },
};

export default options;
