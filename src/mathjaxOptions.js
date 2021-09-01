import katexOptions from "./katexOptions";

const macros = Object.fromEntries(
    Object.entries(katexOptions.macros)
    .map(([macroName, macroDef]) => {
        const newName = macroName.slice(1);
        const newDef = macroDef.replace('\\htmlClass', '\\class');
        const rgx = /#(\d)/g;
        const argNums = [...newDef.matchAll(rgx)].map(m => parseInt(m[1]));
        
        if (argNums.length > 0) {
            return [newName, [newDef, argNums.length]];
        } else {
            return [newName, newDef];
        }
    })
);

const options = {
    tex: {
        macros: {
            ...macros,
            Lrarr: '\\Leftrightarrow',
        }
    },
    fontCache: 'none',
};

export default options;
