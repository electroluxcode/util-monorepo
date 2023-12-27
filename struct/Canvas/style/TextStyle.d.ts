import { StandStyle, StandStyleType } from './StandStyle.js';
type FontStyle = '' | 'italic';
type FontWeight = '' | 'bold';
export type TextStyleType = {
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
} & StandStyleType;
declare class TextStyle extends StandStyle {
    fontStyle: FontStyle;
    fontWeight: FontWeight;
    fontSize: number;
    fontFamily: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    constructor(attr?: TextStyleType);
    setOption(attr?: TextStyleType): void;
    apply(ctx: CanvasRenderingContext2D): void;
    setFont(ctx: CanvasRenderingContext2D): void;
}
export { TextStyle };
