// Data management utilities for Krakatau Water Solution

export interface FlowData {
  id: string;
  date: string;
  time: string;
  plant: 'kerenceng' | 'cidanau';
  counter_air_baku_kerenceng: number;
  counter_air_baku_cipada: number;
  counter_ps1_wtp: number;
  totalizer_reservoir: number;
  ps_iii: number;
  ps_iv: number;
  ps_v: number;
  ps_vi: number;
  pt_kti: number;
  kp_baru: number;
  warnasari: number;
  bbs: number;
  mandiri_ls: number;
  kota_panggung_rawi: number;
  apbn: number;
  apbd: number;
  ps_viii_cipada: number;
  internal_wtp_cidanau: number;
}

export interface ChemicalData {
  id: string;
  date: string;
  time: string;
  plant: 'kerenceng' | 'cidanau';
  aluminium_sulfat_bak_i: number;
  aluminium_sulfat_bak_ii: number;
  flowmeter_kapur: number;
  pemakaian_klorin: number;
  kianchem: number;
  flowmeter_coagulant_aid: number;
  konsentrasi_alum_s_bak_i: number;
  konsentrasi_alum_s_bak_ii: number;
}

export interface ElectricData {
  id: string;
  date: string;
  time: string;
  plant: 'kerenceng' | 'cidanau';
  trafo_i_ak04_lwbp: number;
  trafo_ii_ak09_lwbp: number;
  trafo_iii_ak03_lwbp: number;
  trafo_iv_ak02_lwbp: number;
  ps_i_trafo_i_ak10_lwbp: number;
  ps_i_trafo_ii_ak03_lwbp: number;
  ps_v_incoming_ba01_lwbp: number;
  ps_v_incoming_ba04_lwbp: number;
  trafo_i_ak04_wbp: number;
  trafo_ii_ak09_wbp: number;
  trafo_iii_ak03_wbp: number;
  trafo_iv_ak02_wbp: number;
  ps_i_trafo_i_ak10_wbp: number;
  ps_i_trafo_ii_ak03_wbp: number;
  ps_v_incoming_ba01_wbp: number;
  ps_v_incoming_ba04_wbp: number;
}

export interface QualityData {
  id: string;
  date: string;
  time: string;
  plant: 'kerenceng' | 'cidanau';
  // JarTest data
  jartest_shift_i_ph: number;
  jartest_shift_i_dosis_ppm: number;
  jartest_shift_i_ppm_aktual: number;
  jartest_shift_ii_ph: number;
  jartest_shift_ii_dosis_ppm: number;
  jartest_shift_ii_ppm_aktual: number;
  jartest_shift_iii_ph: number;
  jartest_shift_iii_dosis_ppm: number;
  jartest_shift_iii_ppm_aktual: number;
  // %Lumpur data
  lumpur_shift_i_acc_i: number;
  lumpur_shift_i_acc_ii: number;
  lumpur_shift_i_acc_iii: number;
  lumpur_shift_ii_acc_i: number;
  lumpur_shift_ii_acc_ii: number;
  lumpur_shift_ii_acc_iii: number;
  lumpur_shift_iii_acc_i: number;
  lumpur_shift_iii_acc_ii: number;
  lumpur_shift_iii_acc_iii: number;
}

export interface FilterOperationData {
  id: string;
  date: string;
  time: string;
  plant: 'kerenceng' | 'cidanau';
  // Filter Unit I
  unit_i_1_runtime: number;
  unit_i_1_jeda: number;
  unit_i_2_runtime: number;
  unit_i_2_jeda: number;
  unit_i_3_runtime: number;
  unit_i_3_jeda: number;
  unit_i_4_runtime: number;
  unit_i_4_jeda: number;
  // Filter Unit II
  unit_ii_1_runtime: number;
  unit_ii_1_jeda: number;
  unit_ii_2_runtime: number;
  unit_ii_2_jeda: number;
  unit_ii_3_runtime: number;
  unit_ii_3_jeda: number;
  unit_ii_4_runtime: number;
  unit_ii_4_jeda: number;
  // Filter Unit III
  unit_iii_1_runtime: number;
  unit_iii_1_jeda: number;
  unit_iii_2_runtime: number;
  unit_iii_2_jeda: number;
  unit_iii_3_runtime: number;
  unit_iii_3_jeda: number;
  unit_iii_4_runtime: number;
  unit_iii_4_jeda: number;
  // Filter Unit IV
  unit_iv_1_runtime: number;
  unit_iv_1_jeda: number;
  unit_iv_2_runtime: number;
  unit_iv_2_jeda: number;
  unit_iv_3_runtime: number;
  unit_iv_3_jeda: number;
  unit_iv_4_runtime: number;
  unit_iv_4_jeda: number;
  // Filter Unit V
  unit_v_1_runtime: number;
  unit_v_1_jeda: number;
  unit_v_2_runtime: number;
  unit_v_2_jeda: number;
  unit_v_3_runtime: number;
  unit_v_3_jeda: number;
  unit_v_4_runtime: number;
  unit_v_4_jeda: number;
}

export interface DashboardSummary {
  flow_usage: number;
  flow_delta: number;
  chemical_usage: number;
  chemical_delta: number;
  electric_usage: number;
  electric_delta: number;
}

// Utility functions
export const computeDelta = (prev: number, now: number): number => {
  return Math.max(0, now - prev);
};

export const sacksToKg = (sacks: number): number => {
  return sacks * 50;
};

export const kgToSacks = (kg: number): number => {
  return Math.round((kg / 50) * 100) / 100;
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

// Mock data generation
export const generateMockData = (plant: 'kerenceng' | 'cidanau', days: number = 7) => {
  const flowData: FlowData[] = [];
  const chemicalData: ChemicalData[] = [];
  const electricData: ElectricData[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    // Generate multiple entries per day (shifts)
    for (let shift = 0; shift < 3; shift++) {
      const hour = 6 + (shift * 8); // 06:00, 14:00, 22:00
      const time = `${hour.toString().padStart(2, '0')}:00`;
      
      // Flow data
      flowData.push({
        id: generateId(),
        date: dateStr,
        time,
        plant,
        counter_air_baku_kerenceng: Math.round(800 + Math.random() * 200),
        counter_air_baku_cipada: Math.round(1000 + Math.random() * 300),
        counter_ps1_wtp: Math.round(900 + Math.random() * 250),
        totalizer_reservoir: Math.round(750 + Math.random() * 150),
        ps_iii: Math.round(100 + Math.random() * 50),
        ps_iv: Math.round(120 + Math.random() * 60),
        ps_v: Math.round(90 + Math.random() * 40),
        ps_vi: Math.round(110 + Math.random() * 55),
        pt_kti: Math.round(200 + Math.random() * 100),
        kp_baru: Math.round(80 + Math.random() * 30),
        warnasari: Math.round(70 + Math.random() * 25),
        bbs: Math.round(95 + Math.random() * 35),
        mandiri_ls: Math.round(85 + Math.random() * 30),
        kota_panggung_rawi: Math.round(150 + Math.random() * 70),
        apbn: Math.round(300 + Math.random() * 150),
        apbd: Math.round(250 + Math.random() * 120),
        ps_viii_cipada: Math.round(180 + Math.random() * 80),
        internal_wtp_cidanau: Math.round(160 + Math.random() * 70),
      });

      // Chemical data
      chemicalData.push({
        id: generateId(),
        date: dateStr,
        time,
        plant,
        aluminium_sulfat_bak_i: Math.round(10 + Math.random() * 20),
        aluminium_sulfat_bak_ii: Math.round(8 + Math.random() * 18),
        flowmeter_kapur: Math.round(2 + Math.random() * 8),
        pemakaian_klorin: Math.round(5 + Math.random() * 15),
        kianchem: Math.round(1 + Math.random() * 5),
        flowmeter_coagulant_aid: Math.round(3 + Math.random() * 7),
        konsentrasi_alum_s_bak_i: Math.round(15 + Math.random() * 10),
        konsentrasi_alum_s_bak_ii: Math.round(12 + Math.random() * 8),
      });

      // Electric data
      electricData.push({
        id: generateId(),
        date: dateStr,
        time,
        plant,
        trafo_i_ak04_lwbp: Math.round(100 + Math.random() * 50),
        trafo_ii_ak09_lwbp: Math.round(90 + Math.random() * 45),
        trafo_iii_ak03_lwbp: Math.round(85 + Math.random() * 40),
        trafo_iv_ak02_lwbp: Math.round(95 + Math.random() * 50),
        ps_i_trafo_i_ak10_lwbp: Math.round(75 + Math.random() * 35),
        ps_i_trafo_ii_ak03_lwbp: Math.round(80 + Math.random() * 40),
        ps_v_incoming_ba01_lwbp: Math.round(110 + Math.random() * 55),
        ps_v_incoming_ba04_lwbp: Math.round(105 + Math.random() * 50),
        trafo_i_ak04_wbp: Math.round(120 + Math.random() * 60),
        trafo_ii_ak09_wbp: Math.round(115 + Math.random() * 55),
        trafo_iii_ak03_wbp: Math.round(100 + Math.random() * 50),
        trafo_iv_ak02_wbp: Math.round(125 + Math.random() * 65),
        ps_i_trafo_i_ak10_wbp: Math.round(90 + Math.random() * 45),
        ps_i_trafo_ii_ak03_wbp: Math.round(95 + Math.random() * 50),
        ps_v_incoming_ba01_wbp: Math.round(135 + Math.random() * 70),
        ps_v_incoming_ba04_wbp: Math.round(130 + Math.random() * 65),
      });
    }
  }

  return { flowData, chemicalData, electricData };
};

// Local storage keys
const STORAGE_KEYS = {
  FLOW_DATA: 'kws_flow_data',
  CHEMICAL_DATA: 'kws_chemical_data',
  ELECTRIC_DATA: 'kws_electric_data',
  QUALITY_DATA: 'kws_quality_data',
  FILTER_OPERATION_DATA: 'kws_filter_operation_data',
};

// Data persistence functions
export const saveFlowData = (data: FlowData[]) => {
  localStorage.setItem(STORAGE_KEYS.FLOW_DATA, JSON.stringify(data));
};

export const getFlowData = (): FlowData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.FLOW_DATA);
  return stored ? JSON.parse(stored) : [];
};

export const saveChemicalData = (data: ChemicalData[]) => {
  localStorage.setItem(STORAGE_KEYS.CHEMICAL_DATA, JSON.stringify(data));
};

export const getChemicalData = (): ChemicalData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CHEMICAL_DATA);
  return stored ? JSON.parse(stored) : [];
};

export const saveElectricData = (data: ElectricData[]) => {
  localStorage.setItem(STORAGE_KEYS.ELECTRIC_DATA, JSON.stringify(data));
};

export const getElectricData = (): ElectricData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ELECTRIC_DATA);
  return stored ? JSON.parse(stored) : [];
};

// Quality data persistence functions
export const saveQualityData = (data: QualityData[]) => {
  localStorage.setItem(STORAGE_KEYS.QUALITY_DATA, JSON.stringify(data));
};

export const getQualityData = (): QualityData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.QUALITY_DATA);
  return stored ? JSON.parse(stored) : [];
};

// Filter operation data persistence functions
export const saveFilterOperationData = (data: FilterOperationData[]) => {
  localStorage.setItem(STORAGE_KEYS.FILTER_OPERATION_DATA, JSON.stringify(data));
};

export const getFilterOperationData = (): FilterOperationData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.FILTER_OPERATION_DATA);
  return stored ? JSON.parse(stored) : [];
};

// Clear all data (for testing purposes)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.FLOW_DATA);
  localStorage.removeItem(STORAGE_KEYS.CHEMICAL_DATA);
  localStorage.removeItem(STORAGE_KEYS.ELECTRIC_DATA);
  localStorage.removeItem(STORAGE_KEYS.QUALITY_DATA);
  localStorage.removeItem(STORAGE_KEYS.FILTER_OPERATION_DATA);
  console.log('=== ALL DATA CLEARED ===');
};
// Initialize with mock data if empty
export const initializeMockData = () => {
  if (getFlowData().length === 0) {
    console.log('=== INITIALIZING MOCK DATA ===');
    const kerencengData = generateMockData('kerenceng');
    const cidanauData = generateMockData('cidanau');
    
    console.log('Generated kerenceng flow data:', kerencengData.flowData.length, 'entries');
    console.log('Generated cidanau flow data:', cidanauData.flowData.length, 'entries');
    
    saveFlowData([...kerencengData.flowData, ...cidanauData.flowData]);
    saveChemicalData([...kerencengData.chemicalData, ...cidanauData.chemicalData]);
    saveElectricData([...kerencengData.electricData, ...cidanauData.electricData]);
    
    console.log('=== MOCK DATA INITIALIZED ===');
  } else {
    console.log('=== EXISTING DATA FOUND, SKIPPING MOCK DATA ===');
    console.log('Current flow data count:', getFlowData().length);
  }
};


// Calculate daily summary
export const calculateDashboardSummary = (
  plant: 'kerenceng' | 'cidanau',
  date: string
): DashboardSummary => {
  const flowData = getFlowData().filter(d => d.plant === plant && d.date === date);
  const chemicalData = getChemicalData().filter(d => d.plant === plant && d.date === date);
  const electricData = getElectricData().filter(d => d.plant === plant && d.date === date);

  const flow_usage = flowData.reduce((sum, d) => sum + d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp, 0);
  const chemical_usage = chemicalData.reduce((sum, d) => sum + d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin, 0);
  const electric_usage = electricData.reduce((sum, d) => sum + d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp + d.trafo_ii_ak09_wbp, 0);

  // Calculate previous day for delta comparison (without recursion)
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = formatDate(prevDate);

  // Get previous day data directly without recursion
  const prevFlowData = getFlowData().filter(d => d.plant === plant && d.date === prevDateStr);
  const prevChemicalData = getChemicalData().filter(d => d.plant === plant && d.date === prevDateStr);
  const prevElectricData = getElectricData().filter(d => d.plant === plant && d.date === prevDateStr);

  const prev_flow_usage = prevFlowData.reduce((sum, d) => sum + d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp, 0);
  const prev_chemical_usage = prevChemicalData.reduce((sum, d) => sum + d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin, 0);
  const prev_electric_usage = prevElectricData.reduce((sum, d) => sum + d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp + d.trafo_ii_ak09_wbp, 0);

  return {
    flow_usage,
    flow_delta: flow_usage - prev_flow_usage,
    chemical_usage,
    chemical_delta: chemical_usage - prev_chemical_usage,
    electric_usage,
    electric_delta: electric_usage - prev_electric_usage,
  };
};