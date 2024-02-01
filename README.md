# FAO Reproducing Charts using Charts.js
This code was made to provide an easy way of reproducing interactive charts for future reports. Based on Observable Plot, a sub-library of D3.js.

## Chart.js
Chart.js has three Chart Types so far,
- Bar Chart
- Scatter Plot
- Stacked Bar Chart
- [ ] https://github.com/FAO-ON/fa2207_charts/issues/5

> How do you use Chart.js?

### Usage of Chart.js

1. Import Chart.js into your JavaScript 
    - You can do this by typing
    - ` import { BarChart, ScatterPlot, StackedBarChart } from "./Chart.js"; `

2. Provide formatting options for the chart you want to create
    - Example format can be seen below:
    ```
    const fig4_1_options = {
        XAxisName: "Board",
        YAxisName: "Per-student Funding ($)",
        legend: [["English Public", "English Catholic", "French Public", "French Catholic"], [fao_blue, fao_light_blue_1, fao_pink, fao_light_pink]],
        fill: "System",
        yAxisRange: [0, 40000],
        percent: false,
        padding: clustered_barchart_padding
    }
    ```

    - Key options with types to note are
    ```
    XAxisName: string,
    YAxisName: string,
    legend: 2D Array of strings with first row being list of Legend Names, Second Rown being associative colours
    fill: string,
    yAxisRange: 2 element array of ints,
    percent: bool,
    padding: double
    ```

3. Declare the chart defining it with what **Chart Type** you want it to be
    - Example format can be seen below:
    ```
    const fig4_1 = new BarChart(fig4_1_options, data);
    ```
> [!NOTE]
> Data must be loaded as a JSON, use `d3.csv()` to load a CSV into a JSON. Learn more about `d3.csv()` [here](https://d3-wiki.readthedocs.io/zh-cn/master/CSV/)

4. Congrats :tada: you have loaded a Chart!
> [!TIP]
> To see this chart please insert it into the HTML. An example of doing this by replacing each chart image with the interactive one can be seen with the code snippet below. 
```
function replaceFig(figId,graphElement){
    const img = document.querySelector('#' + figId + '-image img');
    img.after(graphElement);
    img.style.display = "none";
    } 
```
