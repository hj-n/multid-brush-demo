
export async function readLocalJsonFromPublic(filePath) {
	const publicPath = `${process.env.PUBLIC_URL}/${filePath}`;
	const response = await fetch(publicPath);
	const data = await response.json();
	return data;

}