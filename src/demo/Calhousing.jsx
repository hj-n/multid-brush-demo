import React, { useRef, useEffect, useState } from 'react';
import styles from './Calhousing.module.scss';
import { readLocalJsonFromPublic } from '../utils/helpers';

import MultiDBrushing from 'multid-brush';

import * as d3 from 'd3';

const CalHousingDemo = (props) => {

	const width = 800;
	const height = 800;
	const canvasRef = useRef(null);

	const datasetId = "data/chousing_small_orthogonal_preprocessed.json";
	const geoJsonId = "geojson/california.geojson";



	let multidbrushing = null;

	const statusUpdateCallback = (statusArr) => {
		// TODO
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
				"size": 4,
				"y_inverse": true,
				"x_map_range": d3.extent(preprocessed.ld, d => d[0]),
				"y_map_range": d3.extent(preprocessed.ld, d => d[1]),
				"geoJson": geoJson
			}

			multidbrushing = new MultiDBrushing(
				preprocessed, canvasRef.current, width,
				statusUpdateCallback, pointRenderingStyle
			);

			let statusArr = multidbrushing.getEntireBrushingStatus();
			statusUpdateCallback(statusArr);
		})();

		
	}, []);

	return (
		<>
			<h1 className={styles.mainTitle}>California Housing Dataset with Distortion-aware brushing</h1>
			<div className={styles.toolContainer}>
				<div className={styles.brushingContainer}>
					<canvas
						className={styles.mainCanvas}
						ref={canvasRef}
						width={width}
						height={height}
						style={{ width: width, height: height }}
					></canvas>
				</div>
			</div>

		</>
	)

}

export default CalHousingDemo;