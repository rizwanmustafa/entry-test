export const API_URL = process.env.MODE === "production"? "http://192.168.18.2:5000": "http://localhost:5000" // TODO: Change the production url depending on conditions

export const SUBJECTS_API_URL = API_URL + "/admin/subjects"