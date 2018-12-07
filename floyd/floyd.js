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

	let pathMatrix = new Array(size);
	for (let i = 0; i < size; i++) {
		pathMatrix[i] = new Array(size);
	}
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (i == j) {
				pathMatrix[i][j] = ' - ';
			} else if (distanceMatrix[i][j] == Infinity) {
				pathMatrix[i][j] = '( - )';
			}
			else {
				pathMatrix[i][j] = `(x<sub>${i + 1}</sub>, x<sub>${j + 1}</sub>)`;
			}
		}
	}

	addTable(distanceMatrix, `<sup>${0}</sup>`);
	addTable(pathMatrix, `<sub>${0}</sub>`);
	
	let arr = distanceMatrix;
	for (let m = 0; m < (size > 6 ? 6 : size); m++) {
		addRecord([...Array(size)].map((item, it) => `d<sup>${m + 1}</sup><sub>${it + 1} ${it + 1}</sub>`).join(' = ') + ' = 0');
		let arrNext = new Array(size);
		let pathMatrixNext = new Array(size);
		for (let i = 0; i < size; i++) {
			arrNext[i] = new Array(size);
			pathMatrixNext[i] = new Array(size);
		}
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (i != j) {
					if (arr[i][m] + arr[m][j] < arr[i][j]) {
						arrNext[i][j] = arr[i][m] + arr[m][j];
						pathMatrixNext[i][j] = `(x<sub>${i + 1}</sub>, x<sub>${m + 1}</sub>) - (x<sub>${m + 1}</sub>, x<sub>${j + 1}</sub>)`;
					} else {
						arrNext[i][j] = arr[i][j];
						pathMatrixNext[i][j] = pathMatrix[i][j];
					}
					addRecord(`d<sup>${m + 1}</sup><sub>${i + 1} ${j + 1}</sub> = min{d<sup>${m}</sup><sub>${i + 1} ${m + 1}</sub> + d<sup>${m}</sup><sub>${m + 1} ${j + 1}</sub>, d<sup>${m}</sup><sub>${i + 1} ${j + 1}</sub>} = min{${arr[i][m] == Infinity ? '&#8734;' : arr[i][m]} + ${arr[m][j] == Infinity ? '&#8734;' : arr[m][j]}, ${arr[i][j] == Infinity ? '&#8734;' : arr[i][j]}} = ${arrNext[i][j] == Infinity ? '&#8734;' : arrNext[i][j]}`);
				}
				else {
					arrNext[i][j] = 0;
					pathMatrixNext[i][j] = ' - ';
				}
			}
		}
		addTable(arrNext, `<sup>${m + 1}</sup>`);
		addTable(pathMatrixNext, `<sub>${m + 1}</sub>`);
		arr = arrNext;
		pathMatrix = pathMatrixNext;
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

const addTable = (arr, m) => {
	const result = document.getElementById('res');
	let table = '';
	// table += '<tr>';
	// table += '<td></td>';
	// for (let j = 0; j < arr.length; j++) {
	// 	table += `<td><b>x<sub>${j + 1}</sub></b></td>`;
	// }
	// table += '</tr>';
	for (let i = 0; i < arr.length; i++) {
		table += '<tr>';
		for (let j = 0; j < arr.length; j++) {
			// if (j == 0) {
			// 	table += `<td><b>x<sub>${i + 1}</sub></b></td>`;
			// } else {
			table += `<td>${arr[i][j] == Infinity ? '&#8734;' : arr[i][j]}</td>`;
			//}
		}
		table += '</tr>';
	}
	table = `<div style="display: flex; align-items: center; padding: 5px; white-space: pre"><a style="margin-right: 5px">D${m} = </a><table class="matrix"><tbody>${table}</tbody></table></div>`;
	result.innerHTML += table;
}