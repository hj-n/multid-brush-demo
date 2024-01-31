import React, { useRef, useEffect, useState } from 'react';
import styles from './Demo.module.scss';
import CONSTANTS from "../utils/constants";
import { readLocalJsonFromPublic } from '../utils/helpers';


const Demo = (props) => {

	const [exampleDataId, setExampleDataId] = useState("FashionMNIST-UMAP");
	const [warning, setWarning] = useState("");
	const width = CONSTANTS.SIZE;
	const height = CONSTANTS.SIZE;


	const exampleDatasets = {
		"FashionMNIST-UMAP": "data/fmnist_small_umap_preprocessed.json",
		"FashionMNIST-PCA": "data/fmnist_small_pca_preprocessed.json",
	}

	useEffect(() => {
		(async () => {
			try {
				const data = await readLocalJsonFromPublic(exampleDatasets[exampleDataId]);
				console.log(data);
			}
			catch (error) {
				setWarning("Error while loading data!!")
			}

		})();
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
					<div>
						<select className={styles.dropdown} id="exampleDatasets" name="exampleDatasets" onChange={(e) => {
							setWarning("");
							setExampleDataId(e.target.value);
						}}>
							{Object.keys(exampleDatasets).map((key, index) => {
								return <option key={index} value={key}>{key}</option>
							})}
						</select>
					</div>
					<div className={styles.warningContainer}>
						{warning !== "" && <p className={styles.warning}>{warning}</p>}
					</div>
					  {warning === "" && 
							<canvas className={styles.mainCanvas} ref={canvasRef} width={width} height={height} />
						}

				</div>
			</div>
			
		</>
	)
}

export default Demo;