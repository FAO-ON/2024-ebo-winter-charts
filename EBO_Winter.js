import { BarChart, ScatterPlot, StackedBarChart } from "./Chart.js";

/*FAO COLORS */
const fao_blue = '#0f60d5';
const white = '#ffffff';
const fao_dark_blue = '#1a2b4a';
const fao_light_blue_1 = '#9ec2f5';
const fao_light_blue_2 = '#bad1f6';
const fao_light_blue_3 = '#d7e4fa';
const fao_light_blue_4 = '#f1f6fd';
const fao_green = '#b2d235';
const fao_pink = '#e23e94';
const fao_light_pink = "#E6C7D8";
const black = '#000000';
const csv_dir_url = 'ebo-csv/';
const clustered_barchart_padding = 0.3;
const regular_chart_padding = 0.1;

let chartOption = {width: 1000, height:600, className: "sb-chart", marginLeft: 55, marginBottom: 80, marginRight: 0};


function replaceFig(figId,graphElement){
    //DOCSTRING: Replaces the image with the graph element
    //figId: the id of the figure
    //graphElement: the graph element to replace the image with
    const img = document.querySelector('#' + figId + '-image img');
    img.after(graphElement);
    img.style.display = "none";
}




//fig 3.2
d3.csv(csv_dir_url + "3_2.csv").then(d => {
    console.log(d);
    let formatted_d = d.filter(d => d["Net-Debt"] != 0);
    //Map each of the objects in both rows to a new object with the year and the net-debt
    formatted_d = formatted_d.map(d => Object.keys(d).slice(1).map(k => ({Year: k.toString(), "Net-Debt": +d[k]}))).flat();
    formatted_d = formatted_d.filter(d => d["Net-Debt"] != 0);
    console.log(formatted_d);
    //Map the historical data, and then overlay the FAO Projectioc
    let fig3_2_historical = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Historical", Year: k.toString(), "Net-Debt": +d[k]})))[0]
    //Get the objects for the projections
    let fig3_2_projections = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "FAO Winter 2024", Year: k.toString(), "Net-Debt": +d[k]})))[1]
    //filter out the 0 values
    fig3_2_projections = fig3_2_projections.filter(d => d["Net-Debt"] != 0);
    fig3_2_historical = fig3_2_historical.filter(d => d["Net-Debt"] != 0);
    console.log(fig3_2_historical);
    const fig3_2 = Plot.plot({
        /*
        width: chartOption.width,
        height: chartOption.height,
        
        marginTop: chartOption.marginTop,
        marginBottom: chartOption.marginBottom,
        marginLeft: chartOption.marginLeft,
        marginRight: chartOption.marginRight,
        */
        className:  chartOption.className,
        width: 800,
        marginBottom: 100,
        marginLeft: 50,
        x: {label: "Historical", type: "point", padding: 0.2},
        y: {label: "Net Debt-to-GDP Ratio (%)", domain: [0, 45], fy: 5},
        marks:[
            Plot.line(fig3_2_historical, {x: "Year", y: "Net-Debt", stroke: black, strokeWidth: 5,  }),
            Plot.line(fig3_2_projections, {x: "Year", y: "Net-Debt", stroke: fao_blue, strokeWidth: 5,}),
            Plot.ruleY([40], {stroke: fao_pink, strokeWidth: 2, strokeDasharray: "5,5"}),
            Plot.text(["Government Target"], {y: 46, dy: 25, dx: -300, fontSize: 40,  fill: fao_pink, text: d => d, color: fao_pink}),
            Plot.tip(formatted_d, Plot.pointerX(
                {x: "Year", y: "Net-Debt", title: (d) => "Year: " + `${d.Year}` + '\n' + "Net Debt-to-GDP Ratio (%): " + `${d["Net-Debt"]}` + "%", lineHeight: 1}
            )),
            

        ],
        color: {legend: true, domain: ["Historical", "FAO Winter 2024"], range: [black, fao_blue]},
    })
    replaceFig("fig3-2",fig3_2);
});
