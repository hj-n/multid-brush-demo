import * as d3 from 'd3';

export function getPercentile (data, percentile) {
	const sorted = data.sort((a, b) => a - b);
	const index = Math.floor(sorted.length * percentile);
	return sorted[index];
}


export function initiatePcp (pcpRef, data, features, margin, width, height) {

	// draw the axes of parallel coordinates plot
	const svg = d3.select(pcpRef.current)

	const svgWidth = width - 2 * margin;
	const svgHeight = height - 2 * margin;


	const axisDataArr = []
	for (let i = 0; i < features.length; i++) {
		axisDataArr.push(data.map(d => d[i]));
	}
	const axisDomains = axisDataArr.map((axisData, i) => {
		return [getPercentile(axisData, 0.005), getPercentile(axisData, 0.995)]
	})

	const axisG = svg.append("g")
									 .attr("transform", `translate(${margin}, ${margin})`)
	axisG.selectAll(".pcpAxis")
	    .data(features)
		  .enter()
	 	  .append("g")
		  .attr("class", "pcpAxis")
		  .attr("transform", function(d, i) { return "translate(" + (i + 0.5) * (svgWidth / features.length) + ",0)"; })
		  .each(function(d, i) {
				const axisData = data.map(d => d[i]);
			  d3.select(this).call(
				  d3.axisLeft(
					  d3.scaleLinear()
					    .domain(axisDomains[i])
						  .range([svgHeight, 0])
				  )
			  );
		  })

	// render the text as the axis label
	const textG = svg.append("g")
		               .attr("transform", `translate(${margin}, ${margin})`)
	textG.selectAll(".pcpLabel")
	    .data(features)
		  .enter()
		  .append("text")
		  .attr("class", "pcpLabel")
		  .attr("transform", function(d, i) { return "translate(" + (i + 0.5) * (svgWidth / features.length) + "," + (svgHeight + 20) + ")"; })
		  .text(d => d)
		  .style("text-anchor", "middle")
		

	// render the lines
	const lineG = svg.append("g")
		               .attr("transform", `translate(${margin}, ${margin})`)

	lineG.selectAll(".pcpLine")
			 .data(data)
			 .enter()
			 .append("path")
			 .attr("class", "pcpLine")
			 .attr("d", d => {

				 const lineGenerator = d3.line()
					 .x((d, i) => (i + 0.5) * (svgWidth / features.length))
					 .y((d, i) => {
						 
						 const axisData = data.map(d => d[i]);
						 return d3.scaleLinear()
							 				.domain(axisDomains[i])
						 					.range([svgHeight, 0])(d)
					 }
					 )
				 return lineGenerator(d);
			 })
			 .attr("fill", "none")
			 .attr("stroke", "black")
			 .attr("stroke-width", 0.2)
			 .attr("opacity", 0.1)

	return lineG;
}

export function updatePcp (lineG, data, brushingStatus, seedPoints) {

	
	const colorArr = new Array(data.length).fill("black");
	const opacityArr = new Array(data.length).fill(0.1);
	const strokeWidthArr = new Array(data.length).fill(0.2);

	brushingStatus.forEach((status, idx) => {
		status.points.forEach((point) => {
			colorArr[point] = status.color;
			opacityArr[point] = 0.9;
			strokeWidthArr[point] = 0.6;
		});
	});


	if (seedPoints !== undefined)
		seedPoints.points.forEach((point) => {
			colorArr[point] = seedPoints.color;
			opacityArr[point] = 1;
			strokeWidthArr[point] = 2.5;
		})

	lineG.selectAll(".pcpLine")
			 .data(data)
			 .attr("stroke", (d, i) => colorArr[i])
			 .attr("opacity", (d, i) => opacityArr[i])
			 .attr("stroke-width", (d, i) => strokeWidthArr[i])


}