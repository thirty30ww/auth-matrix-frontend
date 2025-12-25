/**
 * 基础图表 VO
 * @param X X 轴数据类型
 * @param Y Y 轴数据类型
 */
export interface BaseChartVO<X, Y> {
    x: X[];
    y: Y[];
}