const cos30 = Math.sqrt(3)/2;

export const isoTopTfm = `rotate(30) skewX(-30) scale(1,${cos30})`;
export const isoLeftTfm = `skewY(30) scale(${cos30},1)`;
export const isoRightTfm = `skewY(-30) scale(${cos30},1)`;
