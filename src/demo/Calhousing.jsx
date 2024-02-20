import React, { useRef, useEffect, useState } from 'react';
import styles from './Calhousing.module.scss';
import { readLocalJsonFromPublic } from '../utils/helpers';

import MultiDBrushing from 'multid-brush';

import { initiatePcp, updatePcp } from '../vis/pcp';
import { initiateBoxplot, updateBoxPlot } from '../vis/boxplot';

import * as d3 from 'd3';

const CalHousingDemo = (props) => {

	const width = 1400;
	const height = 1400;
	const canvasRef = useRef(null);
	const pcpRef = useRef(null);

	const datasetId = "data/chousing_small_orthogonal_preprocessed.json";
	const geoJsonId = "geojson/california.geojson";


	const visSizes = {
		pcp: [width * 1.2, height * 0.37],
		boxplot: [width * 0.3, height * 0.26]
	}

	let pcpLineG = null;
	let boxGs = [];

	const featureFullNames = {
		"MedInc": "Median Income",
		"HouseAge": "House Age",
		"AveRooms": "Average Rooms",
		"AveBedrms": "Average Bedrooms",
		"Population": "Population",
		"AveOccup": "Average Occupancy",
		"HousePrice": "House Price"
	}


	let showingOriginal = false;
	let multidbrushing = null;

	let hd = null;

	const statusUpdateCallback = (statusArr, seedPoints) => {
		// TODO
		updatePcp(pcpLineG, hd, statusArr, seedPoints);
		updateBoxPlot(boxGs, hd, statusArr, Object.keys(featureFullNames), visSizes.boxplot[0], visSizes.boxplot[1], 40);
	}
	

	useEffect(() => {
		(async () => {
			let preprocessed;
			let geoJson;
			try { 
				preprocessed = await readLocalJsonFromPublic(datasetId); 
				geoJson = await readLocalJsonFromPublic(geoJsonId);
			}
			catch (error) { console.log(error);}

			const pointRenderingStyle = {
				"style": "dot_map",
				"size": 8,
				"y_inverse": true,
				"x_map_range": d3.extent(preprocessed.ld, d => d[0]),
				"y_map_range": d3.extent(preprocessed.ld, d => d[1]),
				"geoJson": geoJson
			}

			multidbrushing = new MultiDBrushing(
				preprocessed, canvasRef.current, width,
				statusUpdateCallback, pointRenderingStyle
			);

			hd = preprocessed.hd;

			pcpLineG = initiatePcp(pcpRef, preprocessed.hd, preprocessed.md_features.map(d => featureFullNames[d]), 30, visSizes.pcp[0], visSizes.pcp[1]);


			// boxplot
			boxGs = preprocessed.md_features.map((feature, index) => {
				return initiateBoxplot(
					d3.select("#boxplot" +feature), preprocessed.hd, feature, 
					preprocessed.md_features, visSizes.boxplot[0], visSizes.boxplot[1], 40, featureFullNames[feature]
				);
			});

			let statusArr = multidbrushing.getEntireBrushingStatus();
			statusUpdateCallback(statusArr, {
				"points": [],
				"color": "black"
			});

		})();

		
	}, []);

	return (
		<>
			<h1 className={styles.mainTitle}>California Housing Dataset with Distortion-aware brushing</h1>
			<div className={styles.toolContainer}>
				<div className={styles.brushingContainer}>
					<div className={styles.buttonContainer}>
						<button className={styles.clickButton} id={"originalButton"} onClick={(e) => {
							if (!showingOriginal) {
								multidbrushing.temporalReconstructInitialScatterplot();
								showingOriginal = true;
								document.getElementById("originalButton").innerText = "Back to Brushing";
							}
							else {
								multidbrushing.cancelTemporalReconstruction();
								showingOriginal = false;
								document.getElementById("originalButton").innerText = "See Original Embedding";
							}
						}}
						>See Original Embedding</button>
						<button className={styles.clickButton} onClick={() => {
							multidbrushing.addNewBrush();
							let statusArr = multidbrushing.getEntireBrushingStatus();
							statusUpdateCallback(statusArr);
							if (showingOriginal) {
								showingOriginal = false;
								document.getElementById("originalButton").innerText = "See Original Embedding";
							}
						}}
						>Add New Brush</button>
					</div>
					
					<canvas
						className={styles.mainCanvas}
						ref={canvasRef}
						width={width}
						height={height}
						style={{ width: width, height: height }}
					></canvas>
				</div>
				<div className={styles.visContainer}>
					<h3>Parallel Coordinates View</h3>
					<svg id="pcp" width={visSizes.pcp[0]} height={visSizes.pcp[1]} ref={pcpRef}></svg>
					<h3>Attribute View</h3>
					<div 
						className={styles.boxplotContainer}
						style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "10px", marginTop: "10px"}}
					>
						{Object.keys(featureFullNames).map((key, index) => 
							<svg 
								id={"boxplot" + key}
								width={visSizes.boxplot[0]}
								height={visSizes.boxplot[1]}
								key={index}
							></svg>
						)}
					</div>
				</div>
			</div>

		</>
	)

}

export default CalHousingDemo;