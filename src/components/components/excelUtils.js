import * as XLSX from "xlsx";
import { useEmployees } from "../context/EmployeeContext";
/**
 * Function to export data to Excel
 */
export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
};
/**
 * Validate Email Format
 */
const isValidEmail = (email) => {
  if (!email) return false;
  email = email.replace(/"/g, "").trim(); // Clean email
  console.log("Checking email:", email);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) console.log("Invalid email format:", email);
  return isValid;
};
/**
 * Function to import data from an Excel file
 */
export const importFromExcel = (file, importEmployees) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    // Required columns
    const requiredColumns = [
      "id",
      "name",
      "email",
      "phone_num",
      "emergency_phone_num",
      "pm_id",
      "role_id",
      "address",
      "team_id",
      "roles",
      "profile_pic_url",
    ];
    // Validate imported data
    const validData = jsonData
    .map((row) => {
      let mappedRow = {};
      requiredColumns.forEach((col) => {
        let value = row[col];
        // Ensure correct types (numbers as numbers, empty values as null)
        if (value === undefined || value === "") {
          mappedRow[col] = null; // Convert empty strings to null
        } else if (!isNaN(value) && col !== "phone_num" && col !== "emergency_phone_num") {
          mappedRow[col] = Number(value); // Convert numeric values properly
        } else {
          mappedRow[col] = typeof value === "string" ? value.trim() : value; // :white_check_mark: Fix: Trim only if it's a string
        }
      });
      return mappedRow;
    })
    .filter((emp) => emp.name && emp.phone_num && isValidEmail(emp.email));
    console.log("Valid Data After Filtering:", validData); // Debugging
    if (validData.length === 0) {
      alert("Invalid file format. Ensure all required columns and valid email addresses.");
      return;
    }
    importEmployees(validData); // :white_check_mark: Import only valid data
  };
  reader.readAsArrayBuffer(file);
};
/**
 * Function to fetch data from Google Sheets
 */
export const fetchGoogleSheetData = async (url, importEmployees) => {
  const sheetId = extractSheetId(url);
  if (!sheetId) {
    alert("Invalid Google Sheets URL.");
    return;
  }
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();
    console.log("Raw CSV Data:", text); // Debugging CSV data
    const parsedData = parseCSV(text);
    console.log("Parsed Data:", parsedData); // Debugging parsed JSON data
    // Required columns
    const requiredColumns = [
      "name",
      "email",
      "phone_num",
      "emergency_phone_num",
      "pm_id",
      "role_id",
      "address",
      "team_id",
    ];
    // Validate and clean data
    const validData = parsedData
      .map((row) => {
        let mappedRow = {};
        requiredColumns.forEach((col) => {
          let value = row[col];
          // Ensure correct types
          if (value === undefined || value === "") {
            mappedRow[col] = ""; // Convert empty values to empty strings
          } else if (!isNaN(value) && col !== "phone_num" && col !== "emergency_phone_num") {
            mappedRow[col] = Number(value); // Convert numbers properly
          } else {
            mappedRow[col] = value.trim(); // Clean string values
          }
        });
        // :small_blue_diamond: Remove `id` (Backend auto-generates it)
        // :small_blue_diamond: Add a default password (Temporary fix)
        // :small_blue_diamond: Profile pic is not required, so send null
        mappedRow.password = "DefaultPass123";
        mappedRow.profile_pic = null;
        return mappedRow;
      })
      .filter((emp) => emp.name && emp.phone_num && isValidEmail(emp.email));
    console.log("Valid Data After Filtering:", validData); // Debugging
    if (validData.length === 0) {
      alert("Invalid Google Sheet data. Ensure valid email addresses.");
      return;
    }
    importEmployees(validData); // :white_check_mark: Import only valid data
  } catch (error) {
    console.error("Failed to fetch Google Sheet data:", error);
  }
};
/**
 * Extract Google Sheet ID from URL
 */
const extractSheetId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};
/**
 * Convert CSV text to an array of employees
 */
function parseCSV(text) {
  const rows = text
    .split("\n")
    .map(row => row.split(",").map(value => value.replace(/^"|"$/g, "").trim())); // Remove surrounding quotes
  if (rows.length < 2) {
    console.error("CSV data is empty or incorrect");
    return [];
  }
  // Extract headers and ensure they match required column names
  const headers = rows[0].map(header => header.toLowerCase().replace(/\s+/g, "_")); // Normalize headers
  console.log("CSV Headers (Cleaned):", headers);
  const data = rows.slice(1).map(row => {
    let obj = {};
    row.forEach((value, index) => {
      obj[headers[index]] = value || ""; // Ensure no undefined values
    });
    return obj;
  });
  console.log("Parsed Data (Fully Cleaned):", data);
  return data;
}

export const useImportEmployees = () => {
  const { addEmployee } = useEmployees();
  const importEmployees = async (newEmployees) => {
    for (const employee of newEmployees) {
      try {
        await addEmployee(employee);
      } catch (error) {
        console.error(`Failed to add employee ${employee.name}:`, error);
      }
    }
  };
  return { importEmployees };
};