import xlsx from "xlsx";

export const excelToJson = (data: any) => {
    const file = xlsx.read(data,{cellDates: true})
    const firstPageName = file.SheetNames[0];
    const dataJson = xlsx.utils.sheet_to_json(file.Sheets[firstPageName])
    return dataJson;
};

