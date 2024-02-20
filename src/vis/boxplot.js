import * as d3 from "d3";

export function initiateBoxplot(svg, hd, featureName, mdFeatures, width, height, margin, fullName) {
	const svgWidth = width - 2 * margin;
	const svgHeight = height - 2 * margin;

	const dataIndex = mdFeatures.indexOf(featureName);
	const axisData = hd.map(d => d[dataIndex]);

	const boxplotG = svg.append("g")
											.attr("transform", `translate(${margin}, ${margin})`);

	const xScale = d3.scaleBand().domain([0, 1]).range([0, svgWidth]);
	

	const q1e = d3.quantile(axisData, 0.25);
	const q3e = d3.quantile(axisData, 0.75);
	const iqre = q3e - q1e;
	const removedOutlier = axisData.filter(v => v >= q1e - 1.5 * iqre && v <= q3e + 1.5 * iqre);
	const yScale = d3.scaleLinear().domain([d3.min(removedOutlier), d3.max(removedOutlier)]).range([svgHeight, 0]);


	const labels = ["unbrushed", "entire"]
	const colors = ["#888888", "#aaaaaa"]

	// axis - x
	boxplotG.append("g")
					.attr("class", "xAxis")
					.attr("transform", `translate(0, ${svgHeight})`)
					.call(d3.axisBottom(xScale).tickFormat((d, i) => labels[i]))
					.selectAll("text")
					.style("text-anchor", "middle")
					.attr("transform", "rotate(0)")
					.attr("font-size", "20px")
	
	// axis - y
	boxplotG.append("g")
					.attr("class", "yAxis")
					.call(d3.axisLeft(yScale))
	

	// boxplot - title
	boxplotG.append("text")
					.attr("class", "boxplotTitle")
					.attr("x", svgWidth / 2)
					.attr("y", -margin / 2)
					.text(fullName)
					.style("text-anchor", "middle")
					.style("font-size", "25px")
											
	boxplotG.selectAll(".box")
					.data([axisData, axisData])
					.enter()
					.append("g")
					.attr("class", "box")
					.each((d, i, nodes) => {
						const boxG = d3.select(nodes[i]);

						const q1 = d3.quantile(d, 0.25);
						const median = d3.quantile(d, 0.5);
						const q3 = d3.quantile(d, 0.75);
						const iqr = q3 - q1;
						const removedOutlier  = d.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
						const min = d3.min(removedOutlier);
						const max = d3.max(removedOutlier);

						boxG.append("rect")
							.attr("x", xScale(i) + xScale.bandwidth() / 4)
							.attr("y", yScale(q3))
							.attr("width", + xScale.bandwidth() / 2)
							.attr("height", yScale(q1) - yScale(q3))
							.attr("fill", colors[i])
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);

						
						boxG.append("line")
								.attr("x1", xScale(i) + xScale.bandwidth() / 2)
								.attr("x2", xScale(i) + xScale.bandwidth() / 2)
								.attr("y1", yScale(min))
								.attr("y2", yScale(q1))
								.attr("stroke", "black")
								.attr("stroke-width", 1)
								.attr("opacity", 1);
						
						boxG.append("line")
								.attr("x1", xScale(i) - 10 + xScale.bandwidth() / 2)
								.attr("x2", xScale(i) + 10 + xScale.bandwidth() / 2)
								.attr("y1", yScale(min))
								.attr("y2", yScale(min))
								.attr("stroke", "black")
								.attr("stroke-width", 1)
								.attr("opacity", 1);

						boxG.append("line")
								.attr("x1", xScale(i) + xScale.bandwidth() / 4)
								.attr("x2", xScale(i) + 3 * xScale.bandwidth() / 4)
								.attr("y1", yScale(median))
								.attr("y2", yScale(median))
								.attr("stroke", "black")
								.attr("stroke-width", 1)
								.attr("opacity", 1);


						
						boxG.append("line")
								.attr("x1", xScale(i) + xScale.bandwidth() / 2)
								.attr("x2", xScale(i) + xScale.bandwidth() / 2)
								.attr("y1", yScale(q3))
								.attr("y2", yScale(max))
								.attr("stroke", "black")
								.attr("stroke-width", 1)
								.attr("opacity", 1);

						boxG.append("line")	
								.attr("x1", xScale(i) - 10 + xScale.bandwidth() / 2)
								.attr("x2", xScale(i) + 10 + xScale.bandwidth() / 2)
								.attr("y1", yScale(max))
								.attr("y2", yScale(max))
								.attr("stroke", "black")
								.attr("stroke-width", 1)
								.attr("opacity", 1);
		
						


								

					});

	
	return boxplotG;
}


export function updateBoxPlot(boxGs, hd, statusArr, featureNames, width, height, margin) {
	const svgWidth = width - 2 * margin;
	const svgHeight = height - 2 * margin;


	const statusArrFiltered = statusArr.filter(status => status.points.length > 0);
	const labels = statusArrFiltered.map((status, i) => `C${i+1}`);
	labels.push("unbrushed", "entire");

	const brushColors = statusArrFiltered.map(status => status.color);
	const colorArr = brushColors.concat(["#aaaaaa", "#888888"]);
	

	const domain = brushColors.map((d, i) => i);
	const xDomain = domain.concat([domain.length, domain.length + 1]);
	


	// domain = domain.filter((d, i) => statusArr[i].points.length > 0);
	// let xDomain = domain.concat([domain.length, domain.length + 1]);


	const xScale = d3.scaleBand().domain(xDomain).range([0, svgWidth]);
	// const labels = domain.map((d, i) => i < domain.length ? `Cluster ${i+1}` : ["unbrushed", "entire"][i - brushColors.length]);

	featureNames.forEach((featureName, index) => {

		const dataIndex = featureNames.indexOf(featureName);
		const axisData = hd.map(d => d[dataIndex]);

		const boxG = boxGs[index];

		const q1e = d3.quantile(axisData, 0.25);
		const q3e = d3.quantile(axisData, 0.75);
		const iqre = q3e - q1e;

		const removedOutlier = axisData.filter(v => v >= q1e - 1.5 * iqre && v <= q3e + 1.5 * iqre);


		const yScale = d3.scaleLinear().domain([d3.min(removedOutlier), d3.max(removedOutlier)]).range([svgHeight, 0]);


		// dataArry

		let dataArr = statusArr.map(status => {
			const data = status.points.map(point => axisData[point]);
			return data;
		});
		dataArr = dataArr.filter(data => data.length > 0);

		const unbrushed = axisData.filter((d, i) => statusArr.every(status => !status.points.includes(i)));
		const dataDomain = dataArr.concat([unbrushed, axisData]);



		// x axis
		boxG.select(".xAxis")
				.call(d3.axisBottom(xScale).tickFormat((d, i) => labels[i]))
				.selectAll("text")
				.style("text-anchor", "middle")
				.attr("transform", "rotate(0)")
				.attr("font-size", "20px")
		
		// boxplot lines
		boxG.selectAll(".box")
		    .remove();

		
		boxG.selectAll(".box")
				.data(dataDomain)
				.enter()
				.append("g")
				.attr("class", "box")
				.each((d, i, nodes) => {
					const boxG = d3.select(nodes[i]);

					const q1 = d3.quantile(d, 0.25);
					const median = d3.quantile(d, 0.5);
					const q3 = d3.quantile(d, 0.75);
					const iqr = q3 - q1;
					const removedOutlier  = d.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
					const min = d3.min(removedOutlier);
					const max = d3.max(removedOutlier);


					boxG.append("rect")
						.attr("x", xScale(i) + xScale.bandwidth() / 4)
						.attr("y", yScale(q3))
						.attr("width", + xScale.bandwidth() / 2)
						.attr("height", yScale(q1) - yScale(q3))
						.attr("fill", colorArr[i])
						.attr("stroke", "black")
						.attr("stroke-width", 1)
						.attr("opacity", 1);
					
					boxG.append("line")
							.attr("x1", xScale(i) + xScale.bandwidth() / 2)
							.attr("x2", xScale(i) + xScale.bandwidth() / 2)
							.attr("y1", yScale(min))
							.attr("y2", yScale(q1))
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);
					
					boxG.append("line")
							.attr("x1", xScale(i) - 10 + xScale.bandwidth() / 2)
							.attr("x2", xScale(i) + 10 + xScale.bandwidth() / 2)
							.attr("y1", yScale(min))
							.attr("y2", yScale(min))
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);

					
					
					boxG.append("line")
							.attr("x1", xScale(i) + xScale.bandwidth() / 4)
							.attr("x2", xScale(i) + 3 * xScale.bandwidth() / 4)
							.attr("y1", yScale(median))
							.attr("y2", yScale(median))
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);

					
					boxG.append("line")
							.attr("x1", xScale(i) + xScale.bandwidth() / 2)
							.attr("x2", xScale(i) + xScale.bandwidth() / 2)
							.attr("y1", yScale(q3))
							.attr("y2", yScale(max))
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);

					boxG.append("line")	
							.attr("x1", xScale(i) - 10 + xScale.bandwidth() / 2)
							.attr("x2", xScale(i) + 10 + xScale.bandwidth() / 2)
							.attr("y1", yScale(max))
							.attr("y2", yScale(max))
							.attr("stroke", "black")
							.attr("stroke-width", 1)
							.attr("opacity", 1);
					


				});


	});

}