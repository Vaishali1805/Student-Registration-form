import myCache from "../myCache.js";
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
const __dirname = path.resolve();

// Utility to read and parse a JSON file asynchronously
export const readJsonFile = async (filename) => {
    const filePath = path.join(__dirname, "JSONfiles" ,filename);
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        if (data.trim() === '') return {};
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Failed to read ${filename}: ${error.message}`);
    }
};

// Utility to write data to a JSON file asynchronously
export const writeData = async (filename, data) => {
    const filePath = path.join(__dirname, "JSONfiles", filename);
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Failed to write ${filename}: ${error.message}`);
    }
}

// Utility to retrieve student data from memory cache
export const getDataFromCache = () => {
    const studentData = myCache.get("studentData") || [];
    return studentData;
}

// Utility to store student data in memory cache
export const setDataInCache = (data) => {
    myCache.set("studentData", data);
}

export const getHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}