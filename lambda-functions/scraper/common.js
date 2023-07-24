const CleanseProduct = (id, title, brand, image, price, priceBefore, packageSize, store, description) => {
    let priceBreak, priceBeforeBreak, tags;
    priceBreak = price.split("$")[1];

    if (priceBefore) {
        priceBeforeBreak = priceBefore.split("$")[1];
    } else {
        priceBeforeBreak = 0;
    }

    let catBreak = store.category.split(" ");
    let nameBreak = title.split(" ");
    let typeBreak = store.type.split(" ");

    tags = [...catBreak, ...nameBreak, ...typeBreak, store.class]

    return {
        id: id,
        title: title,
        brand: brand || "",
        imageUrl: image,
        price: parseFloat(priceBreak),
        priceBefore: parseFloat(priceBeforeBreak),
        packageSize: packageSize,
        tags: tags,
        store: store.store,
        productClass: store.class,
        productType: store.type,
        category: store.category,
        description: description
    }
}

const AsyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

exports.CleanseProduct = CleanseProduct;
exports.AsyncForEach = AsyncForEach;