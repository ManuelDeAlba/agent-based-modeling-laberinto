export function reshapeArray(array, rows, columns){
    if(rows * columns != array.length) return array;

    let res = [];
    let row = [];

    array.forEach(num => {
        row.push(num);

        if(row.length == columns){
            res.push(row);
            row = [];
        }
    })

    return res;
}