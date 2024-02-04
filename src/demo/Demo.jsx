import React, { useRef, useEffect, useState } from 'react';
import styles from './Demo.module.scss';
import CONSTANTS from "../utils/constants";
import { readLocalJsonFromPublic } from '../utils/helpers';
import MultiDBrushing from "multid-brush";


const Demo = (props) => {

	const [exampleDataId, setExampleDataId] = useState("FashionMNIST-UMAP");
	const [brushingId, setBrushingId] = useState("dab"); // distortion-aware brushing
	const [warning, setWarning] = useState("");
	const width = CONSTANTS.SIZE;
	const height = CONSTANTS.SIZE;
	const brushingsId = Object.keys(CONSTANTS.BRUSHINGS);
	const brushingsName = brushingsId.map((id) => CONSTANTS.BRUSHINGS[id]);

	const exampleDatasets = {
		"FashionMNIST-UMAP": "data/fmnist_small_umap_preprocessed.json",
		"FashionMNIST-PCA": "data/fmnist_small_pca_preprocessed.json",
	}

	// for FASHION-MNIST RENDERING
	// const pointRenderingStyle = {
	// 	"style": "monochrome",
	// 	"inversed": true,
	// 	"width": CONSTANTS.POINTSIZE,
	// 	"height": CONSTANTS.POINTSIZE,
	// 	"pixelWidth": 28,
	// 	"pixelHeight": 28,
	// 	"removeBackground": true,
	// }

	const pointRenderingStyle = {
		"style": "dot",
		"size": CONSTANTS.POINTSIZE
	}

	// const techniqueStyle = {
	// 	"technique": "dab",
	// 	"painterColor": "green",
	// 	"initialPainterRadius": 50,
	// 	"initialRelocationThreshold": 600, // in ms
	// }


	useEffect(() => {
		(async () => {
			let preprocessed;
			try {
				preprocessed = await readLocalJsonFromPublic(exampleDatasets[exampleDataId]);
			}
			catch (error) {
				console.log(error)
				setWarning("Error while loading data!!")
			}
			
			const multidbrushing = new MultiDBrushing(
				preprocessed, canvasRef.current, CONSTANTS.SIZE, 
				pointRenderingStyle,
			);

		})();
	});

	// Load the data from the "data" folder in public



	// const preprocessed =
	const canvasRef = useRef(null);

	// console.log(preprocessed);

	return (
		<>
			<h1 className={styles.mainTitle}>Multidimensional Brushing</h1>
			<div className={styles.container}>
				<div className={styles.canvasContainer}>
					<div className={styles.optionsContainer}>
						<div className={styles.singleOptionContainer}>
							<h3>{"Dataset: "}</h3>
							<select className={styles.dropdown} id="exampleDatasets" name="exampleDatasets" onChange={(e) => {
								setWarning("");
								setExampleDataId(e.target.value);
							}}>
								{Object.keys(exampleDatasets).map((key, index) => {
									return <option key={index} value={key}>{key}</option>
								})}
							</select>
						</div>
						<div className={styles.singleOptionContainer}>
							<h3>{"Brushing technique:"}</h3>
							<select className={styles.dropdown} id="brushings" name="brushings" onChange={(e) => {
								setWarning("");
								setBrushingId(e.target.value);
							}}>
								{brushingsId.map((id, index) => {
									return <option key={index} value={id}>{brushingsName[index]}</option>
								})}
							</select>
						</div>

					</div>
					<div className={styles.warningContainer}>
						{warning !== "" && <p className={styles.warning}>{warning}</p>}
					</div>
					  {warning === "" && 
							<canvas 
								className={styles.mainCanvas} 
								ref={canvasRef} 
								width={width} height={height} 
								style={{width: width / 2, height: height / 2}}
							/>
						}

				</div>
			</div>
			
		</>
	)
}

export default Demo;