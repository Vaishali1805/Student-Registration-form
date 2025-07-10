import fs from "fs";
import path from "path";
import {
  readJsonFile,
  writeData,
  getDataFromCache,
  setDataInCache,
} from "../utils/fileHelpers.js";

const __dirname = path.resolve();

// Handles submission of new student form data
export const submitFormData = async (req, res) => {
  try {
    const { formData } = req.body;
    const data = JSON.parse(formData);
    if (!data) {
      return res
        .status(400)
        .json({ message: "Data not Found", success: false });
    }
    data.profilePath = req.file?.path ? req.file?.path : null;
    data.id = Date.now() + Math.floor(Math.random() * 1000);

    // const studentData = getDataFromCache();
    const studentData = await readJsonFile("userData.json");
    studentData[data.id] = data;
    await writeData("userData.json", studentData);
    // setDataInCache(studentData);
    res.json({ message: "Data submitted Successfully", success: true });
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Handles editing of existing student data
export const editFormData = async (req, res) => {
  try {
    const { id } = req.query;
    const filePath = req.file?.path;
    const editedData = req.body;
    if (!id || !editedData) {
      return res
        .status(400)
        .json({ message: "Data Not Found", success: false });
    }
    // const studentData = getDataFromCache();
    const studentsData = await readJsonFile("userData.json");
    studentsData[id] = {
      ...studentsData[id],
      ...editedData,
    };
    studentsData[id].profilePath = filePath
      ? filePath
      : studentsData[id].profilePath;
    await writeData("userData.json", studentsData);
    // setDataInCache(studentsData);
    res.json({ message: "Data edited Successfully", success: true });
  } catch (error) {
    console.error("Error editing student records:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred", success: false });
  }
};

// Fetches all student records and location data
export const getStudentData = async (req, res) => {
  try {
    // const studentData = getDataFromCache();
    const data = await readJsonFile("userData.json");
    const studentData = Object.values(data);

    const [countries, states, cities] = await Promise.all([
      readJsonFile("countries.json"),
      readJsonFile("states.json"),
      readJsonFile("cities.json"),
    ]);
    res.json({ studentData, countries, states, cities, success: true });
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Dynamically fetches location data based on query parameters
export const getLocationData = async (req, res) => {
  try {
    const { type, countryId, stateId } = req.query;
    let data = [];
    let filtered = [];

    switch (type) {
      case "countries":
        data = await readJsonFile("countries.json");
        return res.json({ countries: data, success: true });

      case "states":
        if (!countryId) {
          return res
            .status(400)
            .json({ error: "countryId is required", success: false });
        }
        data = await readJsonFile("states.json");
        filtered = data.filter((state) => state.countryId == countryId);
        return res.json({ states: filtered, success: true });

      case "cities":
        if (!countryId || !stateId) {
          return res.status(400).json({
            error: "countryId and stateId are required",
            success: false,
          });
        }
        data = await readJsonFile("cities.json");
        filtered = data.filter(
          (city) => city.countryId == countryId && city.stateId == stateId
        );
        return res.json({ cities: filtered, success: true });

      default:
        return res
          .status(400)
          .json({ error: "Invalid type parameter", success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

// Deletes multiple student records
export const deleteStudentRecords = async (req, res) => {
  try {
    const { studentIds } = req.body;
    if (studentIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No IDs provided for deletion", success: false });
    }

    // const studentData = getDataFromCache();
    const studentData = await readJsonFile("userData.json");

    studentIds.map((id) => {
      // Deletes a student's profile image file from the uploads folder
      const profilePath = studentData[id]?.profilePath;
      if (profilePath) {
        let filePath = path.join(__dirname, studentData[id]?.profilePath);
        fs.unlink(filePath, (error) => {
          if (error) console.log("Error deleting Profile", error);
        });
      }
      delete studentData[id]; //delete student from the object
    });
    await writeData("userData.json", studentData);
    // setDataInCache(filteredStudentData);
    res.json({ message: "Rows deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting student records:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred", success: false });
  }
};

// Fetches a single student's data by ID
export const getDataById = async (req, res) => {
  try {
    const { id } = req.query;
    // const studentData = getDataFromCache();
    const studentData = await readJsonFile("userData.json");
    if (!studentData) {
      return res
        .status(400)
        .json({ message: "Data Not Found", success: false });
    }
    res.json({ studentData: studentData[id], success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An unexpected error occurred", success: false });
  }
};
