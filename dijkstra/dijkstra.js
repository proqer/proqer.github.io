var size = 15;
const changeTable = () => {
	let table = document.getElementById('table');
	let inputSize = document.getElementById('size');
	let res = '';
	size = +inputSize.value;
	size = size <= 16 ? size : 16;
	res += '<tr>';
	res += '<td></td>'
	for (let j = 0; j < size; j++) {
		res += `<td><b>x<sub>${j + 1}</sub></b></td>`;
	}
	res += '</tr>';
	for (let i = 0; i < size; i++) {
		res += '<tr>';
		for (let j = 0; j < size + 1; j++) {
			if (j == 0) {
				res += `<td><b>x<sub>${i + 1}</sub></b></td>`;
			} else {
				res += `<td><div contenteditable>${i == j - 1 ? 0 : '&#8734;'}</div></td>`;
			}
		}
		res += '</tr>';
	}
	res = `<tbody>${res}</tbody>`
	table.innerHTML = res;
}

const getDataFromTable = () => {
	let matrix = new Array(size);
	for (let i = 0; i < size; i++) {
		matrix[i] = new Array(size);
	}
	let table = document.getElementById('table');
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (table.firstElementChild.children[i + 1].children[j + 1].firstElementChild.outerText == '∞') {
				matrix[i][j] = Infinity;
			} else {
				matrix[i][j] = +table.firstElementChild.children[i + 1].children[j + 1].firstElementChild.outerText;
			}
		}
	}
	return matrix;
}

const solve = () => {
	clearRecords();

	let distanceMatrix = getDataFromTable();

	let pathLengthArr = new Array(size);
	pathLengthArr.fill(Infinity);
	pathLengthArr[0] = 0;
	let current = 0;
	addRecord(`d(x<sub>1</sub>) = 0`);

	let isPainted = new Array(size);
	isPainted.fill(false);
	isPainted[0] = true;
	addRecord(`y = x<sub>1</sub>`);

	for (let i = 0; i < size - 1; i++) {
		let min = Infinity;
		let minCoef = 0;

		for (let j = 0; j < size; j++) {
			if (!isPainted[j]) {
				let resStr = `d(x<sub>${j + 1}</sub>) = min{d(x<sub>${j + 1}</sub>), d(x<sub>${current + 1}</sub>) + a(x<sub>${current + 1}</sub>, x<sub>${j + 1}</sub>)} = min{${pathLengthArr[j] == Infinity ? '&#8734;' : pathLengthArr[j]}, ${pathLengthArr[current]} + ${distanceMatrix[current][j] == Infinity ? '&#8734;' : distanceMatrix[current][j]}} = `
				pathLengthArr[j] = Math.min(pathLengthArr[j], pathLengthArr[current] + distanceMatrix[current][j]);
				if (pathLengthArr[j] < min) {
					minCoef = j;
					min = pathLengthArr[j];
				}
				resStr += `${pathLengthArr[j] == Infinity ? '&#8734;' : pathLengthArr[j]}`;
				addRecord(resStr);
			}
		}
		isPainted[minCoef] = true;
		addRecord(`y = x<sub>${minCoef + 1}</sub>`);
		current = minCoef;
		if (distanceMatrix.length - 1 == current) {
			return;
		}
	}
}

const addRecord = (str) => {
	const res = document.getElementById('res');
	res.innerHTML += `<p>${str}</p>`;
}

const clearRecords = () => {
	const res = document.getElementById('res');
	res.innerHTML = '';
}