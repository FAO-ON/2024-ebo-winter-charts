//import { BarChart, ScatterPlot, StackedBarChart } from "./Chart.js";

/*FAO COLORS */
const fao_gray = '#D9D9D9'
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

let chartOption = {width: 800, height:600, className: "ebo-chart", marginLeft: 50, marginBottom: 100, marginRight: 0};

function replaceFig(figId,graphElement){
    //DOCSTRING: Replaces the image with the graph element
    //figId: the id of the figure
    //graphElement: the graph element to replace the image with
    const img = document.querySelector('#' + figId + '-image img');
    img.after(graphElement);
    img.style.display = "none";
}
function replaceGElem(figId){
    // Find the <g> element using aria-label attribute
    //the g element beased on fig-id
    //ex: fig3-2-image sb-char5 g[aria-label="y-axis label"]


    const gElement = document.querySelector('div#'+figId+'-image.report-chart figure.ebo-chart-figure svg.ebo-chart g[aria-label="y-axis label"]');

    //go inside the g element and find the g element with aria-label="y-axis label"
    //gElement = gElement[0].querySelectorAll('g[aria-label="y-axis label"]');
    // Check if the <g> element is found=
    if (gElement) {
        // Find the <text> element within <g>
        var textElement = gElement.querySelector('text');

        // Check if the <text> element is found
        if (textElement) {
            // Access the text content
            var labelText = textElement.textContent || textElement.innerText;
            //modify the text content to replace the up arrow with nothing
            if(figId == "fig3-2"){
                textElement.textContent = "Ratio dette nette-PIB (en pourcentage)";
            }
            else{
                textElement.textContent = "Ratio intérêt de la dette-revenus (en pourcentage)";
            }
        } else {    
            console.error('No <text> element found within <g>');
        }
    } else {
        console.error('Element with aria-label="y-axis label" not found');
    }
    
};




function displayEveryOtherTickLabel(figId){
    //Display every other tick label
    const gElement = document.querySelector('div#'+figId+'-image.report-chart figure.ebo-chart-figure svg.ebo-chart g[aria-label="x-axis tick label"]');
    for(let i = 0; i < gElement.children.length; i++){
        if(i % 2 != 0){
            gElement.children[i].style.display = "none";
        }
    }
};


//fig 3.2
d3.csv(csv_dir_url + "3_2.csv").then(d => {
    let formatted_d = d.filter(d => d[""] != 0);
    //Map each of the objects in both rows to a new object with the year and the net-debt
    formatted_d = formatted_d.map(d => Object.keys(d).slice(1).map(k => ({Year: k.toString(), "Net-Debt": +d[k]}))).flat();
    formatted_d = formatted_d.filter(d => d["Net-Debt"] != 0);
    //Map the historical data, and then overlay the FAO Projectioc
    let fig3_2_historical = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Historique", Year: k.toString(), "Net-Debt": +d[k]})))[0]
    //Get the objects for the projections
    let fig3_2_projections = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "BRF - Hiver 2024", Year: k.toString(), "Net-Debt": +d[k]})))[1]
    //filter out the 0 values
    fig3_2_projections = fig3_2_projections.filter(d => d["Net-Debt"] != 0);
    fig3_2_historical = fig3_2_historical.filter(d => d["Net-Debt"] != 0);
    const fig3_2 = Plot.plot({
        className:  chartOption.className,
        width: chartOption.width,
        marginBottom: chartOption.marginBottom,
        marginLeft: chartOption.marginLeft,
        x: {tickRotate: 270, label: "Historique", type: "point", padding: 0.2},
        y: {label: "Ratio dette nette-PIB (en pourcentage)", domain: [0, 45], fy: 20},
        marks:[
            Plot.line(fig3_2_historical, {x: "Year", y: "Net-Debt", stroke: black, strokeWidth: 5,  }),
            Plot.line(fig3_2_projections, {x: "Year", y: "Net-Debt", stroke: fao_blue, strokeWidth: 5,}),

            Plot.line([{Year: "2021-22", "Net-Debt": 37.0}, {Year: "2022-23", "Net-Debt": 38.3}], {x: "Year", y: "Net-Debt", stroke: fao_gray, strokeWidth: 1}),
            

            Plot.ruleY([40], {stroke: fao_pink, strokeWidth: 2, strokeDasharray: "5,5"}),

            Plot.text(["Objectif du gouvernement"], {y: 46, dy: 38, dx: -280, fontSize: 14, fill: fao_pink}),
            Plot.text(["Projection"], {y: 0, dy: 90, dx: 330, fontSize: 14}),
            Plot.text(["38,3"], {y: 36.0, dy: 5, dx: 265, fontSize: 14}),
            Plot.text(["37,0"], {y: 36.0, dy: 5, dx: 370, fontSize: 14}),

            Plot.ruleX(["2023-24"], {strokeWidth: 1, dx:-5, strokeDasharray: "5,5"}),
            Plot.ruleY([0], {stroke: black, strokeWidth: 1}),

            Plot.tip([{Year: "1997-98", "Net-Debt": 40},{Year: "1986-87", "Net-Debt": 40},{Year: "1991-92", "Net-Debt": 40},{Year: "2002-03", "Net-Debt": 40}, {Year: "1994-95", "Net-Debt": 40},{Year: "2005-06", "Net-Debt": 40},{Year: "1987-88", "Net-Debt": 40}], Plot.pointer({x: "Year", y: "Net-Debt",  anchor: "bottom", title: (d) => "Objectif du gouvernement : " +  `${d["Net-Debt"]}` + " %", lineHeight: 1})),
            Plot.tip(formatted_d, Plot.pointer(
                {x: "Year", y: "Net-Debt", title: (d) => "Année : " + `${d.Year}` + '\n' + "Ratio dette nette-PIB (%) : " + `${Intl.NumberFormat('fr-CA', { maximumSignificantDigits: 3}).format(d["Net-Debt"])}` + " %", lineHeight: 1}
            )),

        ],
        color: {legend: true, domain: ["Historique", "BRF - Hiver 2024"], range: [black, fao_blue]},
    })
    //constantly check if two tips are being displayed at the same time
    //remove the first tip
    replaceFig("fig3-2",fig3_2);
    replaceGElem("fig3-2");
    displayEveryOtherTickLabel("fig3-2");
    
});


d3.csv(csv_dir_url + "3_3.csv").then(d => {
    let formatted_d = d.filter(d => d["Net-Debt"] != 0);
    formatted_d = formatted_d.map(d => Object.keys(d).slice(1).map(k => ({Year: k.toString(), "Net-Debt": +d[k]}))).flat();
    formatted_d = formatted_d.filter(d => d["Net-Debt"] != 0);
    let fig3_3_historical = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Historical", Year: k.toString(), "Net-Debt": +d[k]})))[0]
    let fig3_3_projections = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "FAO Winter 2024", Year: k.toString(), "Net-Debt": +d[k]})))[1]
    fig3_3_projections = fig3_3_projections.filter(d => d["Net-Debt"] != 0);
    fig3_3_historical = fig3_3_historical.filter(d => d["Net-Debt"] != 0);
    const fig3_3 = Plot.plot({
        className:  chartOption.className,
        width: chartOption.width,
        marginBottom: chartOption.marginBottom,
        marginLeft: chartOption.marginLeft,
        x: {tickRotate: 270, label: "Historique", type: "point", padding: 0.2, },
        y: {label: "Ratio intérêt de la dette-revenus (en pourcentage)", domain: [0, 16], fy: 2},
        marks:[
            Plot.line(fig3_3_historical, {x: "Year", y: "Net-Debt", stroke: black, strokeWidth: 5,  }),
            Plot.line(fig3_3_projections, {x: "Year", y: "Net-Debt", stroke: fao_blue, strokeWidth: 5,}),

            Plot.ruleY([7.5], {stroke: fao_pink, strokeWidth: 2, strokeDasharray: "5,5"}),
            Plot.ruleY([0], {stroke: black, strokeWidth: 1}),
            Plot.ruleX(["2023-24"], {strokeWidth: 1, dx:-7,strokeDasharray: "5,5", length: 10}),

            Plot.text(["Projection"], {y: 0, dy:300, dx:180, fontSize: 14}),
            Plot.text(["Objectif du gouvernement"], {y: 12, dx:-250, dy: 40, fontSize:14, fill: fao_pink, color: fao_pink}),

            //Draw a line going from 2021-22, 5.4 to 2022-23, 6.4
            Plot.line([{Year: "2021-22", "Net-Debt": 5.4}, {Year: "2022-23", "Net-Debt": 6.4}], {x: "Year", y: "Net-Debt", stroke: fao_gray, strokeWidth: 1}),

            Plot.text(["6,4"], {y: 6.4, dx: 115, dy: 110, fontSize: 14, fill: black, color: fao_gray}),
            Plot.text(["6,8"], {y: 6.4, dx: 210, dy: 80, fontSize: 14, fill: black, color: fao_gray}),

            Plot.tip([{Year: "1985-86", "Net-Debt": 7.5}, {Year: "1994-95", "Net-Debt": 7.5},{Year: "1996-97", "Net-Debt": 7.5},{Year: "1998-99", "Net-Debt": 7.5},{Year: "2003-04", "Net-Debt": 7.5},{Year: "2006-07", "Net-Debt": 7.5},{Year: "2010-11", "Net-Debt": 7.5},{Year: "2013-14", "Net-Debt": 7.5},], Plot.pointer({x: "Year", y: "Net-Debt",  anchor: "top", title: (d) => "Objectif due gouvernement : " +  `${Intl.NumberFormat('fr-CA',{maximumSignificantDigits: 3}).format(d["Net-Debt"])}` + " %", lineHeight: 1})),
            Plot.tip(formatted_d, Plot.pointer(
                {x: "Year", y: "Net-Debt", title: (d) => "Année : " + `${d.Year}` + '\n' + "Ratio intérêt de la dette-revenus (%) : " + `${Intl.NumberFormat('fr-CA', { maximumSignificantDigits: 3}).format(d["Net-Debt"])}` + " %", lineHeight: 1.5, lineWidth: "2em",}
            )),

        ],
        color: {legend: true, domain: ["Historique", "BRF - Hiver 2024"], range: [black, fao_blue]},
    })
    replaceFig("fig3-3",fig3_3);
    replaceGElem("fig3-3");
    displayEveryOtherTickLabel("fig3-3");
});


