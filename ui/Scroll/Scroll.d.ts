/**
 * @des 竖向自动滚动
 * @param dom
 * @param distance 每一次运作的距离
 * @param interval 每一次的间隔
 * @returns
 */
declare function Scroll(dom: HTMLDivElement, distance?: number, interval?: number): () => void;
export { Scroll };
