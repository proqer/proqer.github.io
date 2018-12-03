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
	addTable(distanceMatrix, `<sup>${0}</sup>`);

	let pastMatrix, pastPathMatrix;
	for (let m = 0; m < size; m++) {
		let currentMatrix = new Array(m + 1);
		let currentPathMatrix = new Array(m + 1);
		for (let i = 0; i < m + 1; i++) {
			currentMatrix[i] = new Array(m + 1);
			currentPathMatrix[i] = new Array(m + 1);
		}
		for (let j = 0; j < m + 1; j++) {
			if (j != m) {
				let min = Infinity;
				let minCoefLeft = m, minCoefMid = 0, minCoefRight = j;
				let argumentsStr = [], argumentsStrNumerical = [];
				for (let i = 0; i < m; i++) {
					let currentArg = distanceMatrix[m][i] + pastMatrix[i][j];
					argumentsStr.push(`d<sup>${0}</sup><sub>${m + 1} ${i + 1}</sub> + d<sup>${m}</sup><sub>${i + 1} ${j + 1}</sub>`);
					argumentsStrNumerical.push(`${distanceMatrix[m][i] == Infinity ? '&#8734;' : distanceMatrix[m][i]} + ${pastMatrix[i][j] == Infinity ? '&#8734;' : pastMatrix[i][j]}`);
					if (min > currentArg) {
						min = currentArg;
						minCoefLeft = m;
						minCoefMid = i;
						minCoefRight = j;
					}
				}
				currentMatrix[m][j] = min;
				if (min == Infinity) {
					currentPathMatrix[m][j] = '( - )';
				} else if (minCoefLeft == minCoefMid) {
					currentPathMatrix[m][j] = `(x<sub>${minCoefMid + 1}</sub>, x<sub>${minCoefRight + 1}</sub>)`;
				} else if (minCoefMid == minCoefRight) {
					currentPathMatrix[m][j] = `(x<sub>${minCoefLeft + 1}</sub>, x<sub>${minCoefMid + 1}</sub>)`;
				}
				else {
					currentPathMatrix[m][j] = `(x<sub>${minCoefLeft + 1}</sub>, x<sub>${minCoefMid + 1}</sub>) - (x<sub>${minCoefMid + 1}</sub>, x<sub>${minCoefRight + 1}</sub>)`;
				}
				addRecord(`d<sup>${m + 1}</sup><sub>${m + 1} ${j + 1}</sub> = min{${argumentsStr.join(', ')}} = min{${argumentsStrNumerical.join(', ')}} = ${min == Infinity ? '&#8734;' : min}`);
			}
			else {
				currentMatrix[m][j] = 0;
				currentPathMatrix[m][j] = ' - ';
			}
		}
		for (let i = 0; i < m + 1; i++) {
			if (i != m) {
				let min = Infinity;
				let minCoefLeft = i, minCoefMid = 0, minCoefRight = m;
				let argumentsStr = [], argumentsStrNumerical = [];
				for (let j = 0; j < m; j++) {
					let currentArg = pastMatrix[i][j] + distanceMatrix[j][m];
					argumentsStr.push(`d<sup>${m}</sup><sub>${i + 1} ${j + 1}</sub> + d<sup>${0}</sup><sub>${j + 1} ${m + 1}</sub>`);
					argumentsStrNumerical.push(`${pastMatrix[i][j] == Infinity ? '&#8734;' : pastMatrix[i][j]} + ${distanceMatrix[j][m] == Infinity ? '&#8734;' : distanceMatrix[j][m]}`);
					if (min > currentArg) {
						min = currentArg;
						minCoefLeft = i;
						minCoefMid = j;
						minCoefRight = m;
					}
				}
				currentMatrix[i][m] = min;
				if (min == Infinity) {
					currentPathMatrix[i][m] = '( - )';
				} else if (minCoefLeft == minCoefMid) {
					currentPathMatrix[i][m] = `(x<sub>${minCoefMid + 1}</sub>, x<sub>${minCoefRight + 1}</sub>)`;
				} else if (minCoefMid == minCoefRight) {
					currentPathMatrix[i][m] = `(x<sub>${minCoefLeft + 1}</sub>, x<sub>${minCoefMid + 1}</sub>)`;
				}
				else {
					currentPathMatrix[i][m] = `(x<sub>${minCoefLeft + 1}</sub>, x<sub>${minCoefMid + 1}</sub>) - (x<sub>${minCoefMid + 1}</sub>, x<sub>${minCoefRight + 1}</sub>)`;
				}
				addRecord(`d<sup>${m + 1}</sup><sub>${i + 1} ${m + 1}</sub> = min{${argumentsStr.join(', ')}} = min{${argumentsStrNumerical.join(', ')}} = ${min == Infinity ? '&#8734;' : min}`);
			}
			else {
				currentMatrix[i][m] = 0;
				currentPathMatrix[i][m] = ' - ';
			}
		}

		for (let i = 0; i < m; i++) {
			for (let j = 0; j < m; j++) {
				if (i != j) {
					if (currentMatrix[i][m] + currentMatrix[m][j] < pastMatrix[i][j]) {
						currentMatrix[i][j] = currentMatrix[i][m] + currentMatrix[m][j];
						currentPathMatrix[i][j] = `(x<sub>${i + 1}</sub>, x<sub>${m + 1}</sub>) - (x<sub>${m + 1}</sub>, x<sub>${j + 1}</sub>)`;
					} else {
						currentMatrix[i][j] = pastMatrix[i][j];
						currentPathMatrix[i][j] = pastPathMatrix[i][j];
					}
					addRecord(`d<sup>${m + 1}</sup><sub>${i + 1} ${j + 1}</sub> = min{d<sup>${m + 1}</sup><sub>${i + 1} ${m + 1}</sub> + d<sup>${m + 1}</sup><sub>${m + 1} ${j + 1}</sub>, d<sup>${m}</sup><sub>${i + 1} ${j + 1}</sub>} = min{${currentMatrix[i][m] == Infinity ? '&#8734;' : currentMatrix[i][m]} + ${currentMatrix[m][j] == Infinity ? '&#8734;' : currentMatrix[m][j]}, ${pastMatrix[i][j] == Infinity ? '&#8734;' : pastMatrix[i][j]}} = ${currentMatrix[i][j] == Infinity ? '&#8734;' : currentMatrix[i][j]}`);
				} else {
					currentMatrix[i][j] = 0;
					currentPathMatrix[i][j] = ' - ';
				}
			}
		}
		addTable(currentMatrix, `<sup>${m + 1}</sup>`);
		addTable(currentPathMatrix, `<sub>${m + 1}</sub>`);
		pastMatrix = currentMatrix;
		pastPathMatrix = currentPathMatrix;
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
	table += '<tr>';
	table += '<td></td>';
	for (let j = 0; j < arr.length; j++) {
		table += `<td><b>x<sub>${j + 1}</sub></b></td>`;
	}
	table += '</tr>';
	for (let i = 0; i < arr.length; i++) {
		table += '<tr>';
		for (let j = 0; j < arr.length + 1; j++) {
			if (j == 0) {
				table += `<td><b>x<sub>${i + 1}</sub></b></td>`;
			} else {
				table += `<td>${arr[i][j - 1] == Infinity ? '&#8734;' : arr[i][j - 1]}</td>`;
			}
		}
		table += '</tr>';
	}
	table = `<div style="display: flex; align-items: center; padding: 5px"><a style="margin-right: 5px">D${m} = </a><table border="1" style="white-space: pre"><tbody>${table}</tbody></table></div>`;
	result.innerHTML += table;
}