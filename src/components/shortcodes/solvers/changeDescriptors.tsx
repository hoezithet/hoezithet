type ChangeDescrType = {
	[key: string]: string|((cgrp: string) => string)
};

const CHANGE_DESCRIPTORS: ChangeDescrType = {
	NO_CHANGE: 'Pas niets aan',

	// ARITHMETIC

	// e.g. 2 + 2 -> 4 or 2 * 2 -> 4
	SIMPLIFY_ARITHMETIC: 'Reken uit',

	// BASICS

	// e.g. 2/-1 -> -2
	DIVISION_BY_NEGATIVE_ONE: 'Er wordt gedeeld door $-1$. Vervang de breuk door het tegengestelde van de teller',
	// e.g. 2/1 -> 2
	DIVISION_BY_ONE: 'Er wordt gedeeld door $1$. Behoud enkel de teller',
	// e.g. x * 0 -> 0
	MULTIPLY_BY_ZERO: 'Er wordt vermenigvuldigd met $0$. Vervang de volledige vermenigvuldiging door $0$',
	// e.g. x * 2 -> 2x
	REARRANGE_COEFF: 'Herorden de coëfficiënten',
	// e.g. x ^ 0 -> 1
	REDUCE_EXPONENT_BY_ZERO: 'Er staat een $0$ in de exponent. Vervang de machtsverheffing door $1$',
	// e.g. 0/1 -> 0
	REDUCE_ZERO_NUMERATOR: 'Er staat een $0$ in de teller. Vervang de breuk door $0$',
	// e.g. 2 + 0 -> 2
	REMOVE_ADDING_ZERO: 'Schrap de optelling met $0$',
	// e.g. x ^ 1 -> x
	REMOVE_EXPONENT_BY_ONE: 'De exponent is gelijk aan $1$, dat hoeven we niet te schrijven',
	// e.g. 1 ^ x -> 1
	REMOVE_EXPONENT_BASE_ONE: 'Schrap de exponent van grondtal $1$',
	// e.g. x * -1 -> -x
	REMOVE_MULTIPLYING_BY_NEGATIVE_ONE: 'Er wordt vermenigvuldigd met $-1$. Vervang de vermenigvuldiging door haar tegengestelde',
	// e.g. x * 1 -> x
	REMOVE_MULTIPLYING_BY_ONE: 'Schrap de vermenigvuldiging met $1$',
	// e.g. 2 - - 3 -> 2 + 3
	RESOLVE_DOUBLE_MINUS: 'Vervang de twee opeenvolgende mintekens door een plus',

	// COLLECT AND COMBINE AND BREAK UP

	// e.g. 2 + x + 3 + x -> 5 + 2x
	COLLECT_AND_COMBINE_LIKE_TERMS: 'Zet de gelijksoortige termen samen en combineer',
	// e.g. x + 2 + x^2 + x + 4 -> x^2 + (x + x) + (4 + 2)
	COLLECT_LIKE_TERMS: 'Zet de gelijksoortige termen samen',

	// MULTIPLYING CONSTANT POWERS
	// e.g. 10^2 * 10^3 -> 10^(2+3)
	COLLECT_CONSTANT_EXPONENTS: 'Zet de exponenten met hetzelfde grondtal samen',

	// ADDING POLYNOMIALS

	// e.g. 2x + x -> 2x + 1x
	ADD_COEFFICIENT_OF_ONE: 'Voeg een coëfficiënt van $1$ toe',
	// e.g. x^2 + x^2 -> 2x^2
	ADD_POLYNOMIAL_TERMS: 'Tel de gelijksoortige termen bij elkaar op',
	// e.g. 2x^2 + 3x^2 + 5x^2 -> (2+3+5)x^2
	GROUP_COEFFICIENTS: 'Zonder de coëfficiënten af',
	// e.g. -x + 2x => -1*x + 2x
	UNARY_MINUS_TO_NEGATIVE_ONE: 'Maak van het minteken een vermenigvuldiging met $-1$',

	// MULTIPLYING POLYNOMIALS

	// e.g. x^2 * x -> x^2 * x^1
	ADD_EXPONENT_OF_ONE: 'Voeg een exponent van $1$ toe',
	// e.g. x^2 * x^3 * x^1 -> x^(2 + 3 + 1)
	COLLECT_POLYNOMIAL_EXPONENTS: 'Zet de exponenten samen',
	// e.g. 2x * 3x -> (2 * 3)(x * x)
	MULTIPLY_COEFFICIENTS: 'Vermenigvuldig de coëfficiënten',
	// e.g. 2x * x -> 2x ^ 2
	MULTIPLY_POLYNOMIAL_TERMS: 'Vermenigvuldig de factoren met hetzelfde grondtal',

	// FRACTIONS

	// e.g. (x + 2)/2 -> x/2 + 2/2
	BREAK_UP_FRACTION: 'Splits de breuk',
	// e.g. -2/-3 => 2/3
	CANCEL_MINUSES: 'Schrap de mintekens',
	// e.g. 2x/2 -> x
	CANCEL_TERMS: 'Schrap de gemeenschappelijke factoren',
	// e.g. 2/6 -> 1/3
	SIMPLIFY_FRACTION: 'Vereenvoudig de breuk',
	// e.g. 2/-3 -> -2/3
	SIMPLIFY_SIGNS: 'Breng het minteken naar de teller',
	// e.g. 15/6 -> (5*3)/(2*3)
	FIND_GCD: 'Zoek de grootste gemene deler',
	// e.g. (5*3)/(2*3) -> 5/2
	CANCEL_GCD: 'Schrap de grootste gemene deler',
	// e.g. 1 2/3 -> 5/3
	CONVERT_MIXED_NUMBER_TO_IMPROPER_FRACTION: 'Zet gemengde breuk om naar één grote breuk',
	// e.g. 1 2/3 -> ((1 * 3) + 2) / 3
	IMPROPER_FRACTION_NUMERATOR: 'Breng het getal vòòr de breuk naar de teller',

	// ADDING FRACTIONS

	// e.g. 1/2 + 1/3 -> 5/6
	ADD_FRACTIONS: 'Tel de breuken op',
	// e.g. (1 + 2)/3 -> 3/3
	ADD_NUMERATORS: 'Tel de tellers op',
	// e.g. (2+1)/5
	COMBINE_NUMERATORS: 'Combineer de tellers',
	// e.g. 2/6 + 1/4 -> (2*2)/(6*2) + (1*3)/(4*3)
	COMMON_DENOMINATOR: 'Maak de breuken gelijknamig',
	// e.g. 3 + 1/2 -> 6/2 + 1/2 (for addition)
	CONVERT_INTEGER_TO_FRACTION: 'Zet het getal om naar een breuk',
	// e.g. 1.2 + 1/2 -> 1.2 + 0.5
	DIVIDE_FRACTION_FOR_ADDITION: 'Zet de breuk om naar een kommagetal om op te tellen',
	// e.g. (2*2)/(6*2) + (1*3)/(4*3) -> (2*2)/12 + (1*3)/12
	MULTIPLY_DENOMINATORS: 'Vermenigvuldig de noemers',
	// e.g. (2*2)/12 + (1*3)/12 -> 4/12 + 3/12
	MULTIPLY_NUMERATORS: 'Vermenigvuldig de tellers',

	// MULTIPLYING FRACTIONS

	// e.g. 1/2 * 2/3 -> 2/6
	MULTIPLY_FRACTIONS: 'Vermenigvuldig de breuken',

	// DIVISION

	// e.g. 2/3/4 -> 2/(3*4)
	SIMPLIFY_DIVISION: 'Vereenvoudig de deling van een deling',
	// e.g. x/(2/3) -> x * 3/2
	MULTIPLY_BY_INVERSE: 'Zet de deling om naar een vermenigvuldiging met het omgekeerde',

	// DISTRIBUTION

	// e.g. 2(x + y) -> 2x + 2y
	DISTRIBUTE: 'Pas de distributiviteit toe',
	// e.g. -(2 + x) -> -2 - x
	DISTRIBUTE_NEGATIVE_ONE: 'Breng het minteken binnen de haakjes',
	// e.g. 2 * 4x + 2*5 --> 8x + 10 (as part of distribution)
	SIMPLIFY_TERMS: 'Vereenvoudig de termen',
	// e.g. (nthRoot(x, 2))^2 -> nthRoot(x, 2) * nthRoot(x, 2)
	// e.g. (2x + 3)^2 -> (2x + 3) (2x + 3)
	EXPAND_EXPONENT: 'Schrijf de macht als een vermenigvuldiging',

	// ABSOLUTE
	// e.g. |-3| -> 3
	ABSOLUTE_VALUE: 'Neem de absolute waarde',

	// ROOTS
	// e.g. nthRoot(x ^ 2, 4) -> nthRoot(x, 2)
	CANCEL_EXPONENT: 'Schrap de exponent',
	// e.g. nthRoot(x ^ 2, 2) -> x
	CANCEL_EXPONENT_AND_ROOT: 'Schrap de exponent en de wortel',
	// e.g. nthRoot(x ^ 4, 2) -> x ^ 2
	CANCEL_ROOT: 'Schrap de wortel',
	// e.g. nthRoot(2, 2) * nthRoot(3, 2) -> nthRoot(2 * 3, 2)
	COMBINE_UNDER_ROOT: 'Zet onder dezelfde wortel',
	// e.g. 2 * 2 * 2 -> 2 ^ 3
	CONVERT_MULTIPLICATION_TO_EXPONENT: 'Zet de vermenigvuldiging om naar een macht',
	// e.g. nthRoot(2 * x) -> nthRoot(2) * nthRoot(x)
	DISTRIBUTE_NTH_ROOT: 'Splits de wortel',
	// e.g. nthRoot(4) * nthRoot(x^2) -> 2 * x
	EVALUATE_DISTRIBUTED_NTH_ROOT: 'Reken de gesplitste wortel uit',
	// e.g. 12 -> 2 * 2 * 3
	FACTOR_INTO_PRIMES: 'Ontbind in priemfactoren',
	// e.g. nthRoot(2 * 2 * 2, 2) -> nthRoot((2 * 2) * 2)
	GROUP_TERMS_BY_ROOT: 'Groepeer de termen per wortel',
	// e.g. nthRoot(4) -> 2
	NTH_ROOT_VALUE: 'Bereken de wortel',
	// e.g. nthRoot(4) + nthRoot(4) = 2*nthRoot(4)
	ADD_NTH_ROOTS: 'Tell de wortels op',
	// e.g. nthRoot(x, 2) * nthRoot(x, 2) -> nthRoot(x^2, 2)
	MULTIPLY_NTH_ROOTS: 'Vermenigvuldig de wortels',

	// SOLVING FOR A VARIABLE

	// e.g. x - 3 = 2 -> x - 3 + 3 = 2 + 3
	ADD_TO_BOTH_SIDES: function (cgrp) {return `Tel aan beide kanten ${cgrp} op`},
	// e.g. 2x = 1 -> (2x)/2 = 1/2
	DIVIDE_FROM_BOTH_SIDES: function (cgrp) {return `Deel beide kanten door ${cgrp}`},
	// e.g. (2/3)x = 1 -> (2/3)x * (3/2) = 1 * (3/2)
	MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION: 'Vermenigvuldig beide kanten met de omgekeerde breuk',
	// e.g. -x = 2 -> -1 * -x = -1 * 2
	MULTIPLY_BOTH_SIDES_BY_NEGATIVE_ONE: 'Vermenigvuldig beide kanten met $-1$',
	// e.g. x/2 = 1 -> (x/2) * 2 = 1 * 2
	MULTIPLY_TO_BOTH_SIDES: function (cgrp) {return `Vermenigvuldig beide kanten met ${cgrp}`},
	// e.g. x + 2 - 1 = 3 -> x + 1 = 3
	SIMPLIFY_LEFT_SIDE: 'Werk de linkerkant uit',
	// e.g. x = 3 - 1 -> x = 2
	SIMPLIFY_RIGHT_SIDE: 'Werk de rechterkerkant uit',
	// e.g. x + 3 = 2 -> x + 3 - 3 = 2 - 3
	SUBTRACT_FROM_BOTH_SIDES: function (cgrp) {return `Trek van beide kanten ${cgrp} af`},
	// e.g. 2 = x -> x = 2
	SWAP_SIDES: 'Wissel de linker- en rechterkant om',
	// e.g. (x - 2) (x + 2) = 0 => x = [-2, 2]
	FIND_ROOTS: 'Zoek de wortels',

	// CONSTANT EQUATION

	// e.g. 2 = 2
	STATEMENT_IS_TRUE: 'Klopt',
	// e.g. 2 = 3
	STATEMENT_IS_FALSE: 'Klopt niet',

	// FACTORING

	// e.g. x^2 - 4x -> x(x - 4)
	FACTOR_SYMBOL: 'Zonder af',
	// e.g. x^2 - 4 -> (x - 2)(x + 2)
	FACTOR_DIFFERENCE_OF_SQUARES: 'Ontbind het merkwaardig product van de vorm $A^2 - B^2$',
	// e.g. x^2 + 2x + 1 -> (x + 1)^2
	FACTOR_PERFECT_SQUARE: 'Ontbind het merkwaardig product van de vorm $A^2 + 2AB + B^2$',
	// e.g. x^2 + 3x + 2 -> (x + 1)(x + 2)
	FACTOR_SUM_PRODUCT_RULE: 'Gebruik som en product om te ontbinden in factoren',
	// e.g. 2x^2 + 4x + 2 -> 2x^2 + 2x + 2x + 2
	BREAK_UP_TERM: 'Splits de term',

	// e.g. 3x^2 + 6x -> 3x ( x + 2 )
	ISOLATE_COMMON_FACTOR: 'Zonder de gemeenschappelijke factor af',
	// e.g. 10x^2 + 125y -> (2 * 5) x + (5 * 5* 5) y
	FACTOR_COEFFS_INTO_PRIMES: 'Ontbind de coëfficiënten in priemfactoren',
	// e.g. 10x^(2m) + 125y -> 10 (x * x * x^m) + 125 y
	FACTORIZE_EXPONENTS: 'Splits de exponenten',
	// e.g. a*(x + 4 - 3) -> a*(x + 1)
	SIMPLIFY_FACTORS: 'Vereenvoudig de factoren',
	// e.g. 3*(x - 1) + 2*(1 - x) -> 3*(x - 1) - 2*(x - 1)
	EQUALIZE_TERM_FACTORS: 'EQUALIZE_TERM_FACTORS',
	// e.g. 3*(x - 1) + 2*(1 - x) -> (x - 1) and (1 - x)
	FIND_OP_FACS: 'FIND_OP_FACS',
	// e.g. 3*(x - 1) + 2*(1 - x) -> 3*(x - 1) + 2*(-1)*(-1 + x)
	NEGATE_OP_FACS: 'NEGATE_OP_FACS',
};

export default CHANGE_DESCRIPTORS;