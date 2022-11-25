import {storeURLs, sulpakCategories, technoDomCategories} from "../../types";
import {technoDomParser} from "./technoDomParser";
import {addProductsToDB} from "../../controllers/parserController";
import {sulpakParser} from "./sulpakParser";
import logger from "../../config/logger";


export async function generalParser() {
    await technoDom();
    await sulpak();
}

async function technoDom(): Promise<{ oldProducts: number, newProducts: number, parsedProducts: number }> {
    let oldProducts = 0, newProducts = 0, parsedProducts = 0;

    for (const category in technoDomCategories) {
        logger.info(`TechnoDom Parser: category=${category}`);
        const baseURL = `${storeURLs.techno_dom}/${technoDomCategories[category as keyof typeof technoDomCategories]}`;
        const data = await technoDomParser(baseURL, baseURL, category);
        const {oldProductsTotal, newProductsTotal, parsedTotal} = await addProductsToDB(data);

        oldProducts += oldProductsTotal;
        newProducts += newProductsTotal;
        parsedProducts += parsedTotal;
    }

    logger.info(`General Parsing [TechnoDom]: Found ${oldProducts} old ` +
        `| ${newProducts} new | ${parsedProducts} total parsed | products`);

    return {oldProducts, newProducts, parsedProducts};
}

async function sulpak(): Promise<{ oldProducts: number, newProducts: number, parsedProducts: number }> {
    let oldProducts = 0, newProducts = 0, parsedProducts = 0;

    for (const category in sulpakCategories) {
        logger.info(`Sulpak Parser: category=${category}`);
        const URL = `${storeURLs.sulpak}/f/${sulpakCategories[category as keyof typeof sulpakCategories]}`
        const data = await sulpakParser(URL, storeURLs.sulpak, category);
        const {oldProductsTotal, newProductsTotal, parsedTotal, productsTotal} = await addProductsToDB(data);

        oldProducts += oldProductsTotal;
        newProducts += newProductsTotal;
        parsedProducts += parsedTotal;
    }

    logger.info(`General Parsing [Sulpak]: Found ${oldProducts} old ` +
        `| ${newProducts} new | ${parsedProducts} total parsed | products`);

    return {oldProducts, newProducts, parsedProducts};
}