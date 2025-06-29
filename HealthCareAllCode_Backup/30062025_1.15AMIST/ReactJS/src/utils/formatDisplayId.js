export const formatDisplayId = (role, id) => {
  const prefixMap = {
    patient: "PAT",
    doctor: "DOC",
    admin: "ADM",
    employee: "EMP",
    invoice: "INV",
  };

  const prefix = prefixMap[role.toLowerCase()] || "USR";
  return `${prefix}-${String(id).padStart(6, "0")}`;
};



// need to add below code to handle the case where the role is not recognized
//import { formatDisplayId } from "../utils/formatDisplayId"; // adjust path as needed

//<td>{formatDisplayId("doctor", doctor.id)}</td>
