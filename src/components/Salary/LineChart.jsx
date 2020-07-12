import React, {Component} from 'react';
import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends Component {
	render() {
    const {data} = this.props;
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Thu nhập theo ngày"
			},
			axisY: {
				includeZero: true,
				suffix: "đ"
			},
			axisX:{      
        valueFormatString: "DD-MMM" ,
        labelAngle: -50
      },
			data: [{
				type: "line",
        toolTipContent: "Ngày {x}: {y}đ",  
        dataPoints: data
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
export default LineChart;    