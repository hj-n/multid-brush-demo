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
		"Wine-PCA": "data/wine_pca_preprocessed.json",
		"MNIST-PCA": "data/mnist_small_pca_preprocessed.json",
	}

	// for FASHION-MNIST RENDERING
	const pointRenderingStyle = {
		"style": "monochrome",
		"size": CONSTANTS.POINTSIZE * 2.5,
		"inversed": true,
		"pixelWidth": 28,
		"pixelHeight": 28,
		"removeBackground": true,
	}

	// const pointRenderingStyle = {
	// 	"style": "dot",
	// 	"size": CONSTANTS.POINTSIZE
	// }

	// const techniqueStyle = {
	// 	"technique": "dab",
	// 	"painterColor": "green",
	// 	"initialPainterRadius": 50,
	// 	"initialRelocationThreshold": 600, // in ms
	// }

	let multidbrushing = null;

	let showingOriginal = false;


	const statusUpdateCallback = (statusArr) => {
		const brushingStatusContainer = document.getElementById("brushingStatusContainer");
		brushingStatusContainer.innerHTML = "";
		
		statusArr.forEach((status) => {
			const color = status.color;
			const isCurrent = status.isCurrent;
			const pointNum = status.points.length;
			const newDiv = document.createElement("div");
			newDiv.innerText = pointNum;

			newDiv.style.backgroundColor = color;
			newDiv.style.width = "40px";
			newDiv.style.height = "40px";
			newDiv.style.margin = "15px";
			newDiv.style.marginTop = "0px";
			newDiv.style.color = "white";
			newDiv.style.fontSize = "20px";

			// place inner text in the middle
			newDiv.style.display = "flex";
			newDiv.style.justifyContent = "center";
			newDiv.style.alignItems = "center";

			if (isCurrent) {
				newDiv.style.border = "5px solid black";
			}
			brushingStatusContainer.appendChild(newDiv);
		})
	}



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
			multidbrushing = new MultiDBrushing(
				preprocessed, canvasRef.current, CONSTANTS.SIZE, 
				statusUpdateCallback, pointRenderingStyle
			);

			let statusArr = multidbrushing.getEntireBrushingStatus();
			statusUpdateCallback(statusArr);
			
		})();

		return () => {
			multidbrushing.unMount();
		}
	}, [exampleDataId]);

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
						<div className={styles.singleOptionContainer}>
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
						<div className={styles.singleOptionContainer}>
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
						</div>
					</div>
					<div className={styles.warningContainer}>
						{warning !== "" && <p className={styles.warning}>{warning}</p>}
					</div>
					  {warning === "" && 
							<div className={styles.brushingContainer}>
								<canvas 
									className={styles.mainCanvas} 
									ref={canvasRef} 
									width={width} height={height} 
									style={{width: width, height: height}}
								/>
								<div id="brushingStatusContainer" className={styles.brushingStatusContainer}></div>
							</div>
						}
				</div>
			</div>
			
		</>
	)
}

export default Demo;