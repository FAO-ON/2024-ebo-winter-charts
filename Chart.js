export class Chart{
    options;
    data;
    stroke_options = {stroke: "#ffffff", strokeWidth: 3, strokeOpacity: 0};
    chart_options = {width: 800, className: "sb-chart", marginLeft: 80, marginBottom: 50, marginRight: 0};
    //confides to OOP Principles
    constructor(options, data) {
        this.options = options;
        this.data = data;
    }

    sendStrokeOptions() {
        return this.stroke_options;
    }

    sendChartOptions() {
        return this.chart_options;
    }

}
export class BarChart extends Chart {
    constructor(options, data) {
        super(options, data);
        this.options = options;
    }

    sendBarChartOptions() {
        return this.barchart_options;
    }


    draw() {
        let yName = this.options.YAxisName;
        let xName = this.options.XAxisName;
        let legendDomain = [];
        let legendRange = [];
        for(let i = 0; i < this.options.legend[0].length; i++) {
            legendDomain.push(this.options.legend[0][i]);
            legendRange.push(this.options.legend[1][i]);
        }
        let d = this.data;
        let expandedXName = ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName);
        if (this.options && this.options.XAxisName && this.options.YAxisName) {
            console.log("Drawing bar chart");
            let svg = 
                    Plot.plot({
                        width: super.sendChartOptions().width,
                        height: super.sendChartOptions().height,
                        className:  super.sendChartOptions().className,
                        marginTop: super.sendChartOptions().marginTop,
                        marginBottom: super.sendChartOptions().marginBottom,
                        marginLeft: super.sendChartOptions().marginLeft,
                        marginRight: super.sendChartOptions().marginRight,
                        padding: this.options.padding,
                        x: {label: ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName), tickFormat: d => null},
                        y: {label: this.options.YAxisName, domain: [this.options.yAxisRange[0], this.options.yAxisRange[1]]},
                        marks: [
                            Plot.barY(d, { 
                                x: xName, 
                                y: yName,
                                channels: {"y": yName},
                                sort: {x: "y"},
                                fill: this.options.fill,
                                stroke: super.sendStrokeOptions().stroke,
                                strokeWidth: super.sendStrokeOptions().strokeWidth,
                                strokeOpacity: super.sendStrokeOptions().strokeOpacity,
                                r: this.options.radius,
                                tip: true,
                                title: (d) => expandedXName + " " + `${d[xName]}` + "\n" + yName +  `${Intl.NumberFormat('en-US').format(Math.round(d[yName]))}`,
                            }),
                            Plot.axisY({ labelAnchor: "center", labelArrow: "none", tickFormat: ((this.options.percent == true) ? d => d.toFixed(1) + "%" : d  => Intl.NumberFormat('en-US').format(Math.round(d)))}),
                        ],
                        color: {legend: true, domain: legendDomain, range: legendRange}
                    });
            return svg;
        }
        else {
            // Handle missing or undefined options
            console.error("Options are missing or incorrect.");
        }

    }
    
}

export class ScatterPlot extends Chart {
    constructor(options, data) {
        super(options, data);
        this.options = options;
    }

    scatterplot_options = super.sendChartOptions();

    draw(){
        let yName = this.options.YAxisName;
        let xName = this.options.XAxisName;
        let d = this.data;
        let expandedXName = ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName);
        if (this.options && this.options.XAxisName && this.options.YAxisName) {
            console.log("Drawing scatter plot");
            let svg = 
                    Plot.plot({
                        width: super.sendChartOptions().width,
                        height: super.sendChartOptions().height,
                        className:  super.sendChartOptions().className,
                        marginTop: super.sendChartOptions().marginTop,
                        marginBottom: super.sendChartOptions().marginBottom,
                        marginLeft: super.sendChartOptions().marginLeft,
                        marginRight: super.sendChartOptions().marginRight,
                        padding:  this.options.padding,
                        x: {label: ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName),  domain: [this.options.xAxisDomain[0], this.options.xAxisDomain[1]] },
                        y: {label: this.options.YAxisName, domain: [this.options.yAxisRange[0], this.options.yAxisRange[1]]},
                        marks: [
                            Plot.dot(d, { 
                                x: xName, 
                                y: yName,
                                channels: {"y": yName},
                                sort: {x: "y"},
                                fill: this.options.fill,
                                stroke: super.sendStrokeOptions().stroke,
                                strokeWidth: super.sendStrokeOptions().strokeWidth,
                                strokeOpacity: super.sendStrokeOptions().strokeOpacity,
                                tip: true,
                                title: (d) => expandedXName + " " + `${d[xName]}` + "\n" + yName +  `${Intl.NumberFormat('en-US').format(Math.round(d[yName]))}`  + "\n" + `${d[this.options.fill]}`,
                            }),
                            Plot.axisY({ labelAnchor: "center", labelArrow: "none", tickFormat: ((this.options.percent == true) ? d => d.toFixed(1) + "%" : d  => Intl.NumberFormat('en-US').format(Math.round(d)))}),
                        ],
                    });
            return svg;
        }

    }
}

export class PieChart extends Chart{
    constructor(options, data) {
        super(options, data);
        this.options = options;
    }

    draw(){ 
    }
}

export class StackedBarChart extends Chart {
    constructor(options, data) {
        super(options, data);
        this.options = options;
    }

    sendBarChartOptions() {
        return this.barchart_options;
    }

    includes(array, value){
        for(let i = 0; i < array.length; i++){
            if(array[i] == value){
                return true;
            }
        }
        return false;
    }

    convertToArray(data){
        let array = [];
        for(let i = 0; i < data.length; i++){
            array.push(data[i]);
        }
        return array;
    }

    parseString(xName, tip) {
        let tipString = "";
        for (let i = 0; i < tip.length; i++) {
            // Check if the 'Data' property includes xName
            if (tip[i].Data.includes(xName)) {
                const keys = Object.keys(tip[i]);
                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];
                    const value = tip[i][key];
                    if (typeof value !== 'object') {
                        if (typeof value === "number") {
                            tip[i][key] = Intl.NumberFormat('en-US').format(Math.round(value));
                        }
                        if (j === 1) {
                            tipString += value + ": $";
                        } else if (j === keys.length - 1) {
                            tipString += value + "\n";
                        } else {
                            tipString += value + ", ";
                        }
                    }
                }
            }
        }
        return tipString;
    }
    

    generateTipData(d, xName, yName){
        let tip_data = [];
        for(let i = 0; i < d.length; i++){
            if(d[i][yName] != "Total" && d[i][yName] != "Average"){
                tip_data.push({Data: d[i][xName], Allocation: d[i][yName], Type: yName});
            }
        }
        return tip_data;
    }



    draw() {
        let yName = this.options.YAxisName;
        let xName = this.options.XAxisName;
        let legendDomain = [];
        let legendRange = [];
        let fillInvisible = this.options.fillInvisible;
        let d = this.data;

        let tip_data = this.generateTipData(d, xName, yName);

        let fig_invisible_data = [];
        for(let i = 0; i < d.length; i++){
            if(d[i].System == fillInvisible){
                fig_invisible_data.push(d[i]);
            }
        }


        for(let i = 0; i < this.options.legend[0].length; i++) {
            legendDomain.push(this.options.legend[0][i]);
            legendRange.push(this.options.legend[1][i]);
        }

        let expandedXName = ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName);

        if (this.options && this.options.XAxisName && this.options.YAxisName) {
            console.log("Drawing stacked bar chart");
            let svg = 
                    Plot.plot({
                        width: super.sendChartOptions().width,
                        height: super.sendChartOptions().height,
                        className:  super.sendChartOptions().className,
                        marginTop: super.sendChartOptions().marginTop,
                        marginBottom: super.sendChartOptions().marginBottom,
                        marginLeft: super.sendChartOptions().marginLeft,
                        marginRight: super.sendChartOptions().marginRight,
                        padding: this.options.padding,
                        x: {label: ((this.options.XAxisName == "Board") ? "School Boards" : this.options.XAxisName), tickFormat: d => null},
                        y: {label: this.options.YAxisName, domain: [this.options.yAxisRange[0], this.options.yAxisRange[1]]},
                        marks: [
                            Plot.barY(d, { 
                                x: xName, 
                                y: yName,
                                channels: {"y": fillInvisible},
                                sort: {x: "y"},
                                fill: this.options.fill,
                                stroke: super.sendStrokeOptions().stroke,
                                strokeWidth: super.sendStrokeOptions().strokeWidth,
                                strokeOpacity: super.sendStrokeOptions().strokeOpacity,
                            }),

                            //Invisble Overlay Containing The Total Value
                            
                            Plot.barY(fig_invisible_data,{
                                x: xName,
                                y: fillInvisible,
                                fill: "transparent",
                                channels: {"y": fillInvisible},
                                sort: {x: "y"},
                                stroke: super.sendStrokeOptions().stroke,
                                strokeWidth: super.sendStrokeOptions().strokeWidth,
                                strokeOpacity: super.sendStrokeOptions().strokeOpacity,
                                tip: true,
                                title: (d) => expandedXName + " " + `${d[xName]}` +  "\n" + this.parseString(d[xName], tip_data),
                            }),
                            
                            Plot.axisY({ labelAnchor: "center", labelArrow: "none", tickFormat: ((this.options.percent == true) ? d => d.toFixed(1) + "%" : d  => Intl.NumberFormat('en-US').format(Math.round(d)))}),
                        ],
                        color: {legend: true, domain: legendDomain, range: legendRange}
                    });
            return svg;
        }
        else {
            // Handle missing or undefined options
            console.error("Options are missing or incorrect.");
        }

    }
    
}





