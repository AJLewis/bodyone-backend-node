export const findParsableObject = (str: string): string | null => {
	console.log('findParsableObject');

	const startIndex = str.indexOf('{');
	const endIndex = str.lastIndexOf('}');

	if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
		return str.substring(startIndex, endIndex + 1);
	}

	return null;
};