export function handleSearch(e, searchField, dataset){
    try {
        let value = e.target.value.toLowerCase();
        let result = [];
        result = dataset.filter((data) => {
            let x = data[searchField].toLowerCase();
            return x.search(value) != -1;
        });
        // setFilteredData(result);
        return result
    } catch { }
};

export function sortData(field, filteredData, sortBy){
    let x = [...filteredData];
    if (field !== null) {
        x.sort((a, b) => {
            if (a[field] < b[field]) {
                return sortBy ? 1 : -1;
            }
            if (a[field] > b[field]) {
                return sortBy ? -1 : 1;
            }
            return 0;
        });
    }
    // setFilteredData(x)
    return x
}

