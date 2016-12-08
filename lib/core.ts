export interface PixerOptions {
	stripes: number;
}

export interface PixerSize {
	width: number;
	height: number;
}

export interface PixerColors {
	previousRGB: string;
	nextRGB: string;
}

export interface PixerGradientWeight {
	even: number;
	odd: number;
}

export interface PixerApi {
	reflow(): void;
}
