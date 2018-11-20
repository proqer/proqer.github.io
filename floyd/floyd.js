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

const solve = () => {
	clearRecords();
	let arr = new Array(size);
	for (let i = 0; i < size; i++) {
		arr[i] = new Array(size);
	}

	let table = document.getElementById('table');
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (table.firstElementChild.children[i + 1].children[j + 1].firstElementChild.outerText == '∞'){
				arr[i][j] = Infinity;
			} else {
				arr[i][j] = +table.firstElementChild.children[i + 1].children[j + 1].firstElementChild.outerText;
			}
		}
	}

	addTable(arr, 0);

	for (let m = 0; m < size > 6 ? 6 : size; m++) {
		let arrNext = new Array(size);
		for (let i = 0; i < size; i++) {
			arrNext[i] = new Array(size);
		}
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (i != j) {
					arrNext[i][j] = Math.min(arr[i][m] + arr[m][j], arr[i][j]);
					addRecord(`d<sup>${m + 1}</sup><sub>${i+1} ${j+1}</sub> = min{d<sup>${m}</sup><sub>${i+1} ${m+1}</sub> + d<sup>${m}</sup><sub>${m+1} ${j+1}</sub>, d<sup>${m}</sup><sub>${i+1} ${j+1}</sub>} = min {${arr[i][m] == Infinity? '&#8734;' : arr[i][m]} + ${arr[m][j] == Infinity? '&#8734;' : arr[m][j]}, ${arr[i][j] == Infinity? '&#8734;' : arr[i][j]}} = ${arrNext[i][j] == Infinity? '&#8734;' : arr[i][j]}`);
				}
				else {
					arrNext[i][j] = 0;
				}
			}
		}
		addTable(arrNext, m+1);
		arr = arrNext;
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
				table += `<td>${arr[i][j - 1] == Infinity? '&#8734;' : arr[i][j - 1]}</td>`;
			}
		}
		table += '</tr>';
	}
table = `<a>D<sup>${m}</sup> = </a><table border="1"><tbody>${table}</tbody></table>`;
	result.innerHTML += table;
}
