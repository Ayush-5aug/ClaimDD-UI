const config = {
  projectRatesContractCommitments: {
    headers: ["Description", "Daily Rate"],
    type: ["text", "number"],
    config: "",
    unique: true,
  },

  projectRatesSiteFacilities: {
    headers: ["Description", "Daily Rate"],
    type: ["text", "number"],
    config: "",
    unique: true,
  },

  projectRatesSiteAdministrationStaff: {
    headers: ["Description", "Daily Rate"],
    type: ["text", "number"],
    config: "",
    unique: true,
  },

  projectRatesEquipmentTransport: {
    headers: ["Description", "Daily Rate"],
    type: ["text", "number"],
    config: "",
    unique: true,
  },
  projectRatesUtilities: {
    headers: ["Description", "Rate", "Unit"],
    type: ["text", "number", "text"],
    config: "",
    unique: true,
  },
  tenderRatesMaterial: {
    headers: ["Description", "Rate", "Unit"],
    type: ["text", "number", "text"],
    config: "",
    unique: true,
  },

  tenderRatesLabour: {
    headers: ["Description", "Hourly Rate"],
    config: "",
    type: ["text", "number"],
    unique: true,
  },

  actualRatesLabour: {
    headers: ["Resources", "Trade"],
    config: "date",
    unique: true,
  },

  siteResourcesManpowerAdmin: {
    headers: ["Resources"],
    config: "date",
    unique: false,
  },

  siteResourcesEquipment: {
    headers: ["Resources"],
    config: "date",
    unique: false,
  },

  siteResourcesTransport: {
    headers: ["Resources"],
    config: "date",
    unique: false,
  },

  workResourcesManpowerWork: {
    headers: ["Resources", "Trade"],
    config: "date",
    unique: false,
  },

  workResourcesMaterial: {
    headers: ["Purchase Date", "Resources", "Quantity", "Unit", "Rate"],
    config: "",
    type: ["text", "text", "number", "text", "number"],
    unique: false,
  },

  workResourcesUtilities: {
    headers: ["Description", "Unit"],
    config: "monthlyDate",
    type: ["text", "text"],
    unique: false,
  },

  labourProductivity: {
    headers: ["Trade", "Unit"],
    config: "date",
    unique: false,
  },

  labourDemobilisation: {
    headers: ["Description", "Demobilisation Date", "Quantity", "Unit", "Rate"],
    type: ["text", "text", "number", "text", "number"],
    config: "",
    unique: false,
  },

  labourRemobilisation: {
    headers: ["Description", "Remobilisation Date", "Quantity", "Unit", "Rate"],
    type: ["text", "text", "number", "text", "number"],
    config: "",
    unique: false,
  },
  otherSubcontractorClaims: {
    headers: ["Description", "Amount", "Event ID"],
    type: ["text", "number", "text"],
    config: "",
    unique: false,
  },
  otherDamages: {
    headers: ["Date", "Description", "Amount"],
    type: ["text", "text", "number"],
    config: "",
    unique: false,
  },
  otherUnpaidClaim: {
    headers: ["Description", "Amount", "Due Date", "Settlement Date"],
    type: ["text", "number", "text", "text"],
    config: "",
    unique: false,
  },

  getMonth: {
    "01" : "Jan",
    "02" : "Feb",
    "03" : "Mar",
    "04" : "Apr",
    "05" : "May",
    "06" : "Jun",
    "07" : "Jul",
    "08" : "Aug",
    "09" : "Sep",
    "10" : "Oct",
    "11" : "Nov",
    "12" : "Dec",
  },
};

export default config;
