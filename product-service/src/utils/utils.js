module.exports.joinTableById = (productTable, stockTable) => {
    const productsInStock = stockTable.map(({product_id}) => product_id);
    const result = [];

    productTable.forEach(({product_id, price, title, description}) => {
        if (productsInStock.includes(product_id)) {
            result.push({
                id: product_id,
                price,
                title,
                description,
                count: stockTable.find(({product_id: id}) => id === product_id).count
            })
        }
    })
    return result;
}
