import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  FlowData,
  ChemicalData,
  ElectricData,
  QualityData,
  FilterOperationData,
  getFlowData,
  getChemicalData,
  getElectricData,
  getQualityData,
  getFilterOperationData,
  saveFlowData,
  saveChemicalData,
  saveElectricData,
  saveQualityData,
  saveFilterOperationData,
  generateId,
  formatDate,
  formatTime,
} from '@/utils/dataStore';

interface InputFormProps {
  plant: 'kerenceng' | 'cidanau';
}

interface FlowFormData {
  counter_air_baku_kerenceng: string;
  counter_air_baku_cipada: string;
  counter_ps1_wtp: string;
  totalizer_reservoir: string;
  ps_iii: string;
  ps_iv: string;
  ps_v: string;
  ps_vi: string;
  pt_kti: string;
  kp_baru: string;
  warnasari: string;
  bbs: string;
  mandiri_ls: string;
  kota_panggung_rawi: string;
  apbn: string;
  apbd: string;
  ps_viii_cipada: string;
  internal_wtp_cidanau: string;
}

interface ChemicalFormData {
  aluminium_sulfat_bak_i: string;
  aluminium_sulfat_bak_ii: string;
  flowmeter_kapur: string;
  pemakaian_klorin: string;
  kianchem: string;
  flowmeter_coagulant_aid: string;
  konsentrasi_alum_s_bak_i: string;
  konsentrasi_alum_s_bak_ii: string;
}

interface ElectricFormData {
  trafo_i_ak04_lwbp: string;
  trafo_ii_ak09_lwbp: string;
  trafo_iii_ak03_lwbp: string;
  trafo_iv_ak02_lwbp: string;
  ps_i_trafo_i_ak10_lwbp: string;
  ps_i_trafo_ii_ak03_lwbp: string;
  ps_v_incoming_ba01_lwbp: string;
  ps_v_incoming_ba04_lwbp: string;
  trafo_i_ak04_wbp: string;
  trafo_ii_ak09_wbp: string;
  trafo_iii_ak03_wbp: string;
  trafo_iv_ak02_wbp: string;
  ps_i_trafo_i_ak10_wbp: string;
  ps_i_trafo_ii_ak03_wbp: string;
  ps_v_incoming_ba01_wbp: string;
  ps_v_incoming_ba04_wbp: string;
}

interface QualityFormData {
  jartest_shift_i_ph: string;
  jartest_shift_i_dosis_ppm: string;
  jartest_shift_i_ppm_aktual: string;
  jartest_shift_ii_ph: string;
  jartest_shift_ii_dosis_ppm: string;
  jartest_shift_ii_ppm_aktual: string;
  jartest_shift_iii_ph: string;
  jartest_shift_iii_dosis_ppm: string;
  jartest_shift_iii_ppm_aktual: string;
  lumpur_shift_i_acc_i: string;
  lumpur_shift_i_acc_ii: string;
  lumpur_shift_i_acc_iii: string;
  lumpur_shift_ii_acc_i: string;
  lumpur_shift_ii_acc_ii: string;
  lumpur_shift_ii_acc_iii: string;
  lumpur_shift_iii_acc_i: string;
  lumpur_shift_iii_acc_ii: string;
  lumpur_shift_iii_acc_iii: string;
}

interface FilterOperationFormData {
  unit_i_1_runtime: string;
  unit_i_1_jeda: string;
  unit_i_2_runtime: string;
  unit_i_2_jeda: string;
  unit_i_3_runtime: string;
  unit_i_3_jeda: string;
  unit_i_4_runtime: string;
  unit_i_4_jeda: string;
  unit_ii_1_runtime: string;
  unit_ii_1_jeda: string;
  unit_ii_2_runtime: string;
  unit_ii_2_jeda: string;
  unit_ii_3_runtime: string;
  unit_ii_3_jeda: string;
  unit_ii_4_runtime: string;
  unit_ii_4_jeda: string;
  unit_iii_1_runtime: string;
  unit_iii_1_jeda: string;
  unit_iii_2_runtime: string;
  unit_iii_2_jeda: string;
  unit_iii_3_runtime: string;
  unit_iii_3_jeda: string;
  unit_iii_4_runtime: string;
  unit_iii_4_jeda: string;
  unit_iv_1_runtime: string;
  unit_iv_1_jeda: string;
  unit_iv_2_runtime: string;
  unit_iv_2_jeda: string;
  unit_iv_3_runtime: string;
  unit_iv_3_jeda: string;
  unit_iv_4_runtime: string;
  unit_iv_4_jeda: string;
  unit_v_1_runtime: string;
  unit_v_1_jeda: string;
  unit_v_2_runtime: string;
  unit_v_2_jeda: string;
  unit_v_3_runtime: string;
  unit_v_3_jeda: string;
  unit_v_4_runtime: string;
  unit_v_4_jeda: string;
}

const InputForm: React.FC<InputFormProps> = ({ plant }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'flow' | 'chemical' | 'electric' | 'quality' | 'filter'>('flow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [flowForm, setFlowForm] = useState<FlowFormData>({
    counter_air_baku_kerenceng: '',
    counter_air_baku_cipada: '',
    counter_ps1_wtp: '',
    totalizer_reservoir: '',
    ps_iii: '',
    ps_iv: '',
    ps_v: '',
    ps_vi: '',
    pt_kti: '',
    kp_baru: '',
    warnasari: '',
    bbs: '',
    mandiri_ls: '',
    kota_panggung_rawi: '',
    apbn: '',
    apbd: '',
    ps_viii_cipada: '',
    internal_wtp_cidanau: '',
  });

  const [chemicalForm, setChemicalForm] = useState<ChemicalFormData>({
    aluminium_sulfat_bak_i: '',
    aluminium_sulfat_bak_ii: '',
    flowmeter_kapur: '',
    pemakaian_klorin: '',
    kianchem: '',
    flowmeter_coagulant_aid: '',
    konsentrasi_alum_s_bak_i: '',
    konsentrasi_alum_s_bak_ii: '',
  });

  const [electricForm, setElectricForm] = useState<ElectricFormData>({
    trafo_i_ak04_lwbp: '',
    trafo_ii_ak09_lwbp: '',
    trafo_iii_ak03_lwbp: '',
    trafo_iv_ak02_lwbp: '',
    ps_i_trafo_i_ak10_lwbp: '',
    ps_i_trafo_ii_ak03_lwbp: '',
    ps_v_incoming_ba01_lwbp: '',
    ps_v_incoming_ba04_lwbp: '',
    trafo_i_ak04_wbp: '',
    trafo_ii_ak09_wbp: '',
    trafo_iii_ak03_wbp: '',
    trafo_iv_ak02_wbp: '',
    ps_i_trafo_i_ak10_wbp: '',
    ps_i_trafo_ii_ak03_wbp: '',
    ps_v_incoming_ba01_wbp: '',
    ps_v_incoming_ba04_wbp: '',
  });

  const [qualityForm, setQualityForm] = useState<QualityFormData>({
    jartest_shift_i_ph: '',
    jartest_shift_i_dosis_ppm: '',
    jartest_shift_i_ppm_aktual: '',
    jartest_shift_ii_ph: '',
    jartest_shift_ii_dosis_ppm: '',
    jartest_shift_ii_ppm_aktual: '',
    jartest_shift_iii_ph: '',
    jartest_shift_iii_dosis_ppm: '',
    jartest_shift_iii_ppm_aktual: '',
    lumpur_shift_i_acc_i: '',
    lumpur_shift_i_acc_ii: '',
    lumpur_shift_i_acc_iii: '',
    lumpur_shift_ii_acc_i: '',
    lumpur_shift_ii_acc_ii: '',
    lumpur_shift_ii_acc_iii: '',
    lumpur_shift_iii_acc_i: '',
    lumpur_shift_iii_acc_ii: '',
    lumpur_shift_iii_acc_iii: '',
  });

  const [filterForm, setFilterForm] = useState<FilterOperationFormData>({
    unit_i_1_runtime: '',
    unit_i_1_jeda: '',
    unit_i_2_runtime: '',
    unit_i_2_jeda: '',
    unit_i_3_runtime: '',
    unit_i_3_jeda: '',
    unit_i_4_runtime: '',
    unit_i_4_jeda: '',
    unit_ii_1_runtime: '',
    unit_ii_1_jeda: '',
    unit_ii_2_runtime: '',
    unit_ii_2_jeda: '',
    unit_ii_3_runtime: '',
    unit_ii_3_jeda: '',
    unit_ii_4_runtime: '',
    unit_ii_4_jeda: '',
    unit_iii_1_runtime: '',
    unit_iii_1_jeda: '',
    unit_iii_2_runtime: '',
    unit_iii_2_jeda: '',
    unit_iii_3_runtime: '',
    unit_iii_3_jeda: '',
    unit_iii_4_runtime: '',
    unit_iii_4_jeda: '',
    unit_iv_1_runtime: '',
    unit_iv_1_jeda: '',
    unit_iv_2_runtime: '',
    unit_iv_2_jeda: '',
    unit_iv_3_runtime: '',
    unit_iv_3_jeda: '',
    unit_iv_4_runtime: '',
    unit_iv_4_jeda: '',
    unit_v_1_runtime: '',
    unit_v_1_jeda: '',
    unit_v_2_runtime: '',
    unit_v_2_jeda: '',
    unit_v_3_runtime: '',
    unit_v_3_jeda: '',
    unit_v_4_runtime: '',
    unit_v_4_jeda: '',
  });

  const validateForm = (formData: any): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (value && isNaN(Number(value))) {
        newErrors[key] = 'Harus berupa angka';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFlowSubmit = () => {
    if (!validateForm(flowForm)) return false;

    const now = new Date();
    const newData: FlowData = {
      id: generateId(),
      date: formatDate(now),
      time: formatTime(now),
      plant,
      counter_air_baku_kerenceng: Number(flowForm.counter_air_baku_kerenceng) || 0,
      counter_air_baku_cipada: Number(flowForm.counter_air_baku_cipada) || 0,
      counter_ps1_wtp: Number(flowForm.counter_ps1_wtp) || 0,
      totalizer_reservoir: Number(flowForm.totalizer_reservoir) || 0,
      ps_iii: Number(flowForm.ps_iii) || 0,
      ps_iv: Number(flowForm.ps_iv) || 0,
      ps_v: Number(flowForm.ps_v) || 0,
      ps_vi: Number(flowForm.ps_vi) || 0,
      pt_kti: Number(flowForm.pt_kti) || 0,
      kp_baru: Number(flowForm.kp_baru) || 0,
      warnasari: Number(flowForm.warnasari) || 0,
      bbs: Number(flowForm.bbs) || 0,
      mandiri_ls: Number(flowForm.mandiri_ls) || 0,
      kota_panggung_rawi: Number(flowForm.kota_panggung_rawi) || 0,
      apbn: Number(flowForm.apbn) || 0,
      apbd: Number(flowForm.apbd) || 0,
      ps_viii_cipada: Number(flowForm.ps_viii_cipada) || 0,
      internal_wtp_cidanau: Number(flowForm.internal_wtp_cidanau) || 0,
    };

    console.log('=== FLOW DATA SUBMIT DEBUG ===');
    console.log('Plant:', plant);
    console.log('New data:', newData);
    
    const existingData = getFlowData();
    console.log('Existing flow data before save:', existingData.map(d => ({id: d.id, plant: d.plant, date: d.date, time: d.time})));
    
    const updatedData = [...existingData, newData];
    saveFlowData(updatedData);
    
    console.log('Updated flow data after save:', getFlowData().map(d => ({id: d.id, plant: d.plant, date: d.date, time: d.time})));
    console.log('=== END FLOW DEBUG ===');

    // Reset form
    setFlowForm({
      counter_air_baku_kerenceng: '',
      counter_air_baku_cipada: '',
      counter_ps1_wtp: '',
      totalizer_reservoir: '',
      ps_iii: '',
      ps_iv: '',
      ps_v: '',
      ps_vi: '',
      pt_kti: '',
      kp_baru: '',
      warnasari: '',
      bbs: '',
      mandiri_ls: '',
      kota_panggung_rawi: '',
      apbn: '',
      apbd: '',
      ps_viii_cipada: '',
      internal_wtp_cidanau: '',
    });

    return true;
  };

  const handleChemicalSubmit = () => {
    if (!validateForm(chemicalForm)) return false;

    const now = new Date();
    const newData: ChemicalData = {
      id: generateId(),
      date: formatDate(now),
      time: formatTime(now),
      plant,
      aluminium_sulfat_bak_i: Number(chemicalForm.aluminium_sulfat_bak_i) || 0,
      aluminium_sulfat_bak_ii: Number(chemicalForm.aluminium_sulfat_bak_ii) || 0,
      flowmeter_kapur: Number(chemicalForm.flowmeter_kapur) || 0,
      pemakaian_klorin: Number(chemicalForm.pemakaian_klorin) || 0,
      kianchem: Number(chemicalForm.kianchem) || 0,
      flowmeter_coagulant_aid: Number(chemicalForm.flowmeter_coagulant_aid) || 0,
      konsentrasi_alum_s_bak_i: Number(chemicalForm.konsentrasi_alum_s_bak_i) || 0,
      konsentrasi_alum_s_bak_ii: Number(chemicalForm.konsentrasi_alum_s_bak_ii) || 0,
    };

    const existingData = getChemicalData();
    saveChemicalData([...existingData, newData]);

    // Reset form
    setChemicalForm({
      aluminium_sulfat_bak_i: '',
      aluminium_sulfat_bak_ii: '',
      flowmeter_kapur: '',
      pemakaian_klorin: '',
      kianchem: '',
      flowmeter_coagulant_aid: '',
      konsentrasi_alum_s_bak_i: '',
      konsentrasi_alum_s_bak_ii: '',
    });

    return true;
  };

  const handleElectricSubmit = () => {
    if (!validateForm(electricForm)) return false;

    const now = new Date();
    const newData: ElectricData = {
      id: generateId(),
      date: formatDate(now),
      time: formatTime(now),
      plant,
      trafo_i_ak04_lwbp: Number(electricForm.trafo_i_ak04_lwbp) || 0,
      trafo_ii_ak09_lwbp: Number(electricForm.trafo_ii_ak09_lwbp) || 0,
      trafo_iii_ak03_lwbp: Number(electricForm.trafo_iii_ak03_lwbp) || 0,
      trafo_iv_ak02_lwbp: Number(electricForm.trafo_iv_ak02_lwbp) || 0,
      ps_i_trafo_i_ak10_lwbp: Number(electricForm.ps_i_trafo_i_ak10_lwbp) || 0,
      ps_i_trafo_ii_ak03_lwbp: Number(electricForm.ps_i_trafo_ii_ak03_lwbp) || 0,
      ps_v_incoming_ba01_lwbp: Number(electricForm.ps_v_incoming_ba01_lwbp) || 0,
      ps_v_incoming_ba04_lwbp: Number(electricForm.ps_v_incoming_ba04_lwbp) || 0,
      trafo_i_ak04_wbp: Number(electricForm.trafo_i_ak04_wbp) || 0,
      trafo_ii_ak09_wbp: Number(electricForm.trafo_ii_ak09_wbp) || 0,
      trafo_iii_ak03_wbp: Number(electricForm.trafo_iii_ak03_wbp) || 0,
      trafo_iv_ak02_wbp: Number(electricForm.trafo_iv_ak02_wbp) || 0,
      ps_i_trafo_i_ak10_wbp: Number(electricForm.ps_i_trafo_i_ak10_wbp) || 0,
      ps_i_trafo_ii_ak03_wbp: Number(electricForm.ps_i_trafo_ii_ak03_wbp) || 0,
      ps_v_incoming_ba01_wbp: Number(electricForm.ps_v_incoming_ba01_wbp) || 0,
      ps_v_incoming_ba04_wbp: Number(electricForm.ps_v_incoming_ba04_wbp) || 0,
    };

    const existingData = getElectricData();
    saveElectricData([...existingData, newData]);

    // Reset form
    setElectricForm({
      trafo_i_ak04_lwbp: '',
      trafo_ii_ak09_lwbp: '',
      trafo_iii_ak03_lwbp: '',
      trafo_iv_ak02_lwbp: '',
      ps_i_trafo_i_ak10_lwbp: '',
      ps_i_trafo_ii_ak03_lwbp: '',
      ps_v_incoming_ba01_lwbp: '',
      ps_v_incoming_ba04_lwbp: '',
      trafo_i_ak04_wbp: '',
      trafo_ii_ak09_wbp: '',
      trafo_iii_ak03_wbp: '',
      trafo_iv_ak02_wbp: '',
      ps_i_trafo_i_ak10_wbp: '',
      ps_i_trafo_ii_ak03_wbp: '',
      ps_v_incoming_ba01_wbp: '',
      ps_v_incoming_ba04_wbp: '',
    });

    return true;
  };

  const handleQualitySubmit = () => {
    if (!validateForm(qualityForm)) return false;

    const now = new Date();
    const newData: QualityData = {
      id: generateId(),
      date: formatDate(now),
      time: formatTime(now),
      plant,
      jartest_shift_i_ph: Number(qualityForm.jartest_shift_i_ph) || 0,
      jartest_shift_i_dosis_ppm: Number(qualityForm.jartest_shift_i_dosis_ppm) || 0,
      jartest_shift_i_ppm_aktual: Number(qualityForm.jartest_shift_i_ppm_aktual) || 0,
      jartest_shift_ii_ph: Number(qualityForm.jartest_shift_ii_ph) || 0,
      jartest_shift_ii_dosis_ppm: Number(qualityForm.jartest_shift_ii_dosis_ppm) || 0,
      jartest_shift_ii_ppm_aktual: Number(qualityForm.jartest_shift_ii_ppm_aktual) || 0,
      jartest_shift_iii_ph: Number(qualityForm.jartest_shift_iii_ph) || 0,
      jartest_shift_iii_dosis_ppm: Number(qualityForm.jartest_shift_iii_dosis_ppm) || 0,
      jartest_shift_iii_ppm_aktual: Number(qualityForm.jartest_shift_iii_ppm_aktual) || 0,
      lumpur_shift_i_acc_i: Number(qualityForm.lumpur_shift_i_acc_i) || 0,
      lumpur_shift_i_acc_ii: Number(qualityForm.lumpur_shift_i_acc_ii) || 0,
      lumpur_shift_i_acc_iii: Number(qualityForm.lumpur_shift_i_acc_iii) || 0,
      lumpur_shift_ii_acc_i: Number(qualityForm.lumpur_shift_ii_acc_i) || 0,
      lumpur_shift_ii_acc_ii: Number(qualityForm.lumpur_shift_ii_acc_ii) || 0,
      lumpur_shift_ii_acc_iii: Number(qualityForm.lumpur_shift_ii_acc_iii) || 0,
      lumpur_shift_iii_acc_i: Number(qualityForm.lumpur_shift_iii_acc_i) || 0,
      lumpur_shift_iii_acc_ii: Number(qualityForm.lumpur_shift_iii_acc_ii) || 0,
      lumpur_shift_iii_acc_iii: Number(qualityForm.lumpur_shift_iii_acc_iii) || 0,
    };

    const existingData = getQualityData();
    saveQualityData([...existingData, newData]);

    // Reset form
    setQualityForm({
      jartest_shift_i_ph: '',
      jartest_shift_i_dosis_ppm: '',
      jartest_shift_i_ppm_aktual: '',
      jartest_shift_ii_ph: '',
      jartest_shift_ii_dosis_ppm: '',
      jartest_shift_ii_ppm_aktual: '',
      jartest_shift_iii_ph: '',
      jartest_shift_iii_dosis_ppm: '',
      jartest_shift_iii_ppm_aktual: '',
      lumpur_shift_i_acc_i: '',
      lumpur_shift_i_acc_ii: '',
      lumpur_shift_i_acc_iii: '',
      lumpur_shift_ii_acc_i: '',
      lumpur_shift_ii_acc_ii: '',
      lumpur_shift_ii_acc_iii: '',
      lumpur_shift_iii_acc_i: '',
      lumpur_shift_iii_acc_ii: '',
      lumpur_shift_iii_acc_iii: '',
    });

    return true;
  };

  const handleFilterSubmit = () => {
    if (!validateForm(filterForm)) return false;

    const now = new Date();
    const newData: FilterOperationData = {
      id: generateId(),
      date: formatDate(now),
      time: formatTime(now),
      plant,
      unit_i_1_runtime: Number(filterForm.unit_i_1_runtime) || 0,
      unit_i_1_jeda: Number(filterForm.unit_i_1_jeda) || 0,
      unit_i_2_runtime: Number(filterForm.unit_i_2_runtime) || 0,
      unit_i_2_jeda: Number(filterForm.unit_i_2_jeda) || 0,
      unit_i_3_runtime: Number(filterForm.unit_i_3_runtime) || 0,
      unit_i_3_jeda: Number(filterForm.unit_i_3_jeda) || 0,
      unit_i_4_runtime: Number(filterForm.unit_i_4_runtime) || 0,
      unit_i_4_jeda: Number(filterForm.unit_i_4_jeda) || 0,
      unit_ii_1_runtime: Number(filterForm.unit_ii_1_runtime) || 0,
      unit_ii_1_jeda: Number(filterForm.unit_ii_1_jeda) || 0,
      unit_ii_2_runtime: Number(filterForm.unit_ii_2_runtime) || 0,
      unit_ii_2_jeda: Number(filterForm.unit_ii_2_jeda) || 0,
      unit_ii_3_runtime: Number(filterForm.unit_ii_3_runtime) || 0,
      unit_ii_3_jeda: Number(filterForm.unit_ii_3_jeda) || 0,
      unit_ii_4_runtime: Number(filterForm.unit_ii_4_runtime) || 0,
      unit_ii_4_jeda: Number(filterForm.unit_ii_4_jeda) || 0,
      unit_iii_1_runtime: Number(filterForm.unit_iii_1_runtime) || 0,
      unit_iii_1_jeda: Number(filterForm.unit_iii_1_jeda) || 0,
      unit_iii_2_runtime: Number(filterForm.unit_iii_2_runtime) || 0,
      unit_iii_2_jeda: Number(filterForm.unit_iii_2_jeda) || 0,
      unit_iii_3_runtime: Number(filterForm.unit_iii_3_runtime) || 0,
      unit_iii_3_jeda: Number(filterForm.unit_iii_3_jeda) || 0,
      unit_iii_4_runtime: Number(filterForm.unit_iii_4_runtime) || 0,
      unit_iii_4_jeda: Number(filterForm.unit_iii_4_jeda) || 0,
      unit_iv_1_runtime: Number(filterForm.unit_iv_1_runtime) || 0,
      unit_iv_1_jeda: Number(filterForm.unit_iv_1_jeda) || 0,
      unit_iv_2_runtime: Number(filterForm.unit_iv_2_runtime) || 0,
      unit_iv_2_jeda: Number(filterForm.unit_iv_2_jeda) || 0,
      unit_iv_3_runtime: Number(filterForm.unit_iv_3_runtime) || 0,
      unit_iv_3_jeda: Number(filterForm.unit_iv_3_jeda) || 0,
      unit_iv_4_runtime: Number(filterForm.unit_iv_4_runtime) || 0,
      unit_iv_4_jeda: Number(filterForm.unit_iv_4_jeda) || 0,
      unit_v_1_runtime: Number(filterForm.unit_v_1_runtime) || 0,
      unit_v_1_jeda: Number(filterForm.unit_v_1_jeda) || 0,
      unit_v_2_runtime: Number(filterForm.unit_v_2_runtime) || 0,
      unit_v_2_jeda: Number(filterForm.unit_v_2_jeda) || 0,
      unit_v_3_runtime: Number(filterForm.unit_v_3_runtime) || 0,
      unit_v_3_jeda: Number(filterForm.unit_v_3_jeda) || 0,
      unit_v_4_runtime: Number(filterForm.unit_v_4_runtime) || 0,
      unit_v_4_jeda: Number(filterForm.unit_v_4_jeda) || 0,
    };

    const existingData = getFilterOperationData();
    saveFilterOperationData([...existingData, newData]);

    // Reset form
    setFilterForm({
      unit_i_1_runtime: '',
      unit_i_1_jeda: '',
      unit_i_2_runtime: '',
      unit_i_2_jeda: '',
      unit_i_3_runtime: '',
      unit_i_3_jeda: '',
      unit_i_4_runtime: '',
      unit_i_4_jeda: '',
      unit_ii_1_runtime: '',
      unit_ii_1_jeda: '',
      unit_ii_2_runtime: '',
      unit_ii_2_jeda: '',
      unit_ii_3_runtime: '',
      unit_ii_3_jeda: '',
      unit_ii_4_runtime: '',
      unit_ii_4_jeda: '',
      unit_iii_1_runtime: '',
      unit_iii_1_jeda: '',
      unit_iii_2_runtime: '',
      unit_iii_2_jeda: '',
      unit_iii_3_runtime: '',
      unit_iii_3_jeda: '',
      unit_iii_4_runtime: '',
      unit_iii_4_jeda: '',
      unit_iv_1_runtime: '',
      unit_iv_1_jeda: '',
      unit_iv_2_runtime: '',
      unit_iv_2_jeda: '',
      unit_iv_3_runtime: '',
      unit_iv_3_jeda: '',
      unit_iv_4_runtime: '',
      unit_iv_4_jeda: '',
      unit_v_1_runtime: '',
      unit_v_1_jeda: '',
      unit_v_2_runtime: '',
      unit_v_2_jeda: '',
      unit_v_3_runtime: '',
      unit_v_3_jeda: '',
      unit_v_4_runtime: '',
      unit_v_4_jeda: '',
    });

    return true;
  };

  const handleSaveAll = async () => {
    setIsSubmitting(true);
    let successCount = 0;

    const hasFlowData = Object.values(flowForm).some(v => v.trim() !== '');
    const hasChemicalData = Object.values(chemicalForm).some(v => v.trim() !== '');
    const hasElectricData = Object.values(electricForm).some(v => v.trim() !== '');
    const hasQualityData = Object.values(qualityForm).some(v => v.trim() !== '');
    const hasFilterData = Object.values(filterForm).some(v => v.trim() !== '');

    if (!hasFlowData && !hasChemicalData && !hasElectricData && !hasQualityData && !hasFilterData) {
      toast({
        title: 'Tidak ada data untuk disimpan',
        description: 'Silakan isi minimal satu form terlebih dahulu',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (hasFlowData && handleFlowSubmit()) successCount++;
    if (hasChemicalData && handleChemicalSubmit()) successCount++;
    if (hasElectricData && handleElectricSubmit()) successCount++;
    if (hasQualityData && handleQualitySubmit()) successCount++;
    if (hasFilterData && handleFilterSubmit()) successCount++;

    if (successCount > 0) {
      toast({
        title: 'Data berhasil disimpan!',
        description: `${successCount} set data telah disimpan untuk ${plant}`,
      });
    }

    setIsSubmitting(false);
  };

  const flowFields = [
    { key: 'counter_air_baku_kerenceng', label: 'Counter Air Baku Kerenceng', unit: 'm³' },
    { key: 'counter_air_baku_cipada', label: 'Counter Air Baku Cipada', unit: 'm³' },
    { key: 'counter_ps1_wtp', label: 'Counter PS I - WTP', unit: 'm³' },
    { key: 'totalizer_reservoir', label: 'Totalizer Reservoir', unit: 'm³' },
    { key: 'ps_iii', label: 'PS III', unit: 'm³' },
    { key: 'ps_iv', label: 'PS IV', unit: 'm³' },
    { key: 'ps_v', label: 'PS V', unit: 'm³' },
    { key: 'ps_vi', label: 'PS VI', unit: 'm³' },
    { key: 'pt_kti', label: 'PT KTI', unit: 'm³' },
    { key: 'kp_baru', label: 'Kp. Baru', unit: 'm³' },
    { key: 'warnasari', label: 'Warnasari', unit: 'm³' },
    { key: 'bbs', label: 'BBS', unit: 'm³' },
    { key: 'mandiri_ls', label: 'Mandiri LS', unit: 'm³' },
    { key: 'kota_panggung_rawi', label: 'Kota & Panggung Rawi', unit: 'm³' },
    { key: 'apbn', label: 'APBN', unit: 'm³' },
    { key: 'apbd', label: 'APBD', unit: 'm³' },
    { key: 'ps_viii_cipada', label: 'PS VIII Cipada', unit: 'm³' },
    { key: 'internal_wtp_cidanau', label: 'Internal WTP Cidanau', unit: 'm³' },
  ];

  const chemicalFields = [
    { key: 'aluminium_sulfat_bak_i', label: 'Aluminium Sulfat Bak I', unit: 'kg' },
    { key: 'aluminium_sulfat_bak_ii', label: 'Aluminium Sulfat Bak II', unit: 'kg' },
    { key: 'flowmeter_kapur', label: 'Flowmeter Kapur', unit: 'm³' },
    { key: 'pemakaian_klorin', label: 'Pemakaian Klorin', unit: 'kg' },
    { key: 'kianchem', label: 'Kianchem', unit: 'm³' },
    { key: 'flowmeter_coagulant_aid', label: 'Flowmeter Coagulant Aid', unit: 'm³' },
    { key: 'konsentrasi_alum_s_bak_i', label: 'Konsentrasi Alum S.Bak I', unit: '%' },
    { key: 'konsentrasi_alum_s_bak_ii', label: 'Konsentrasi Alum S.Bak II', unit: '%' },
  ];

  const electricFields = [
    { key: 'trafo_i_ak04_lwbp', label: 'Trafo I AK O4 - LWBP', unit: 'kWh' },
    { key: 'trafo_ii_ak09_lwbp', label: 'Trafo II AK 09 – LWBP', unit: 'kWh' },
    { key: 'trafo_iii_ak03_lwbp', label: 'Trafo III AK 03 – LWBP', unit: 'kWh' },
    { key: 'trafo_iv_ak02_lwbp', label: 'Trafo IV AK 02 – LWBP', unit: 'kWh' },
    { key: 'ps_i_trafo_i_ak10_lwbp', label: 'PS I - Trafo I AK 10 – LWBP', unit: 'kWh' },
    { key: 'ps_i_trafo_ii_ak03_lwbp', label: 'PS I - Trafo II AK 03 – LWBP', unit: 'kWh' },
    { key: 'ps_v_incoming_ba01_lwbp', label: 'PS V - Incoming (BA 01) – LWBP', unit: 'kWh' },
    { key: 'ps_v_incoming_ba04_lwbp', label: 'PS V - Incoming (BA 04) – LWBP', unit: 'kWh' },
    { key: 'trafo_i_ak04_wbp', label: 'Trafo I AK O4 – WBP', unit: 'kWh' },
    { key: 'trafo_ii_ak09_wbp', label: 'Trafo II AK 09 – WBP', unit: 'kWh' },
    { key: 'trafo_iii_ak03_wbp', label: 'Trafo III AK 03 – WBP', unit: 'kWh' },
    { key: 'trafo_iv_ak02_wbp', label: 'Trafo IV AK 02 – WBP', unit: 'kWh' },
    { key: 'ps_i_trafo_i_ak10_wbp', label: 'PS I - Trafo I AK 10 – WBP', unit: 'kWh' },
    { key: 'ps_i_trafo_ii_ak03_wbp', label: 'PS I - Trafo II AK 03 – WBP', unit: 'kWh' },
    { key: 'ps_v_incoming_ba01_wbp', label: 'PS V - Incoming (BA 01) – WBP', unit: 'kWh' },
    { key: 'ps_v_incoming_ba04_wbp', label: 'PS V - Incoming (BA 04) - WBP', unit: 'kWh' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Input Data {plant.charAt(0).toUpperCase() + plant.slice(1)}
          </CardTitle>
          <p className="text-muted-foreground">
            Masukkan data operasional untuk flow, chemical, dan electric usage
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="flow">Flow</TabsTrigger>
              <TabsTrigger value="chemical">Chemical</TabsTrigger>
              <TabsTrigger value="electric">Electric</TabsTrigger>
              <TabsTrigger value="quality">Analisa Kualitas</TabsTrigger>
              <TabsTrigger value="filter">Unit Filter</TabsTrigger>
            </TabsList>

            {/* Flow Tab */}
            <TabsContent value="flow" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flowFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`flow-${field.key}`} className="text-sm font-semibold">
                        {field.label} ({field.unit})
                      </Label>
                      <Input
                        id={`flow-${field.key}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={flowForm[field.key as keyof FlowFormData]}
                        onChange={(e) => setFlowForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className={`focus-ring ${errors[field.key] ? 'border-destructive' : ''}`}
                      />
                      {errors[field.key] && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Chemical Tab */}
            <TabsContent value="chemical" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chemicalFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`chemical-${field.key}`} className="text-sm font-semibold">
                        {field.label} ({field.unit})
                      </Label>
                      <Input
                        id={`chemical-${field.key}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={chemicalForm[field.key as keyof ChemicalFormData]}
                        onChange={(e) => setChemicalForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className={`focus-ring ${errors[field.key] ? 'border-destructive' : ''}`}
                      />
                      {errors[field.key] && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Quality Analysis Tab */}
            <TabsContent value="quality" className="mt-6">
              <div className="space-y-6">
                {/* JarTest Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">JarTest Data</h3>
                  <div className="space-y-4">
                    {/* Shift I */}
                    <div>
                      <h4 className="font-medium mb-3">Shift I</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-i-ph">pH</Label>
                          <Input
                            id="jartest-shift-i-ph"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_i_ph}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_i_ph: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-i-dosis">Dosis ppm</Label>
                          <Input
                            id="jartest-shift-i-dosis"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_i_dosis_ppm}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_i_dosis_ppm: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-i-actual">ppm aktual</Label>
                          <Input
                            id="jartest-shift-i-actual"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_i_ppm_aktual}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_i_ppm_aktual: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift II */}
                    <div>
                      <h4 className="font-medium mb-3">Shift II</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-ii-ph">pH</Label>
                          <Input
                            id="jartest-shift-ii-ph"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_ii_ph}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_ii_ph: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-ii-dosis">Dosis ppm</Label>
                          <Input
                            id="jartest-shift-ii-dosis"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_ii_dosis_ppm}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_ii_dosis_ppm: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-ii-actual">ppm aktual</Label>
                          <Input
                            id="jartest-shift-ii-actual"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_ii_ppm_aktual}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_ii_ppm_aktual: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift III */}
                    <div>
                      <h4 className="font-medium mb-3">Shift III</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-iii-ph">pH</Label>
                          <Input
                            id="jartest-shift-iii-ph"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_iii_ph}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_iii_ph: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-iii-dosis">Dosis ppm</Label>
                          <Input
                            id="jartest-shift-iii-dosis"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_iii_dosis_ppm}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_iii_dosis_ppm: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jartest-shift-iii-actual">ppm aktual</Label>
                          <Input
                            id="jartest-shift-iii-actual"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.jartest_shift_iii_ppm_aktual}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, jartest_shift_iii_ppm_aktual: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* %Lumpur Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">%Lumpur Data</h3>
                  <div className="space-y-4">
                    {/* Shift I */}
                    <div>
                      <h4 className="font-medium mb-3">Shift I</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-i-acc-i">Acc I (%)</Label>
                          <Input
                            id="lumpur-shift-i-acc-i"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_i_acc_i}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_i_acc_i: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-i-acc-ii">Acc II (%)</Label>
                          <Input
                            id="lumpur-shift-i-acc-ii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_i_acc_ii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_i_acc_ii: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-i-acc-iii">Acc III (%)</Label>
                          <Input
                            id="lumpur-shift-i-acc-iii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_i_acc_iii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_i_acc_iii: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift II */}
                    <div>
                      <h4 className="font-medium mb-3">Shift II</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-ii-acc-i">Acc I (%)</Label>
                          <Input
                            id="lumpur-shift-ii-acc-i"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_ii_acc_i}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_ii_acc_i: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-ii-acc-ii">Acc II (%)</Label>
                          <Input
                            id="lumpur-shift-ii-acc-ii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_ii_acc_ii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_ii_acc_ii: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-ii-acc-iii">Acc III (%)</Label>
                          <Input
                            id="lumpur-shift-ii-acc-iii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_ii_acc_iii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_ii_acc_iii: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift III */}
                    <div>
                      <h4 className="font-medium mb-3">Shift III</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-iii-acc-i">Acc I (%)</Label>
                          <Input
                            id="lumpur-shift-iii-acc-i"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_iii_acc_i}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_iii_acc_i: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-iii-acc-ii">Acc II (%)</Label>
                          <Input
                            id="lumpur-shift-iii-acc-ii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_iii_acc_ii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_iii_acc_ii: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lumpur-shift-iii-acc-iii">Acc III (%)</Label>
                          <Input
                            id="lumpur-shift-iii-acc-iii"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={qualityForm.lumpur_shift_iii_acc_iii}
                            onChange={(e) => setQualityForm(prev => ({ ...prev, lumpur_shift_iii_acc_iii: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Filter Operation Tab */}
            <TabsContent value="filter" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Data Operasi Unit Filter</h3>
                <div className="space-y-6">
                  {[
                    { unit: 'I', items: ['1', '2', '3', '4'] },
                    { unit: 'II', items: ['1', '2', '3', '4'] },
                    { unit: 'III', items: ['1', '2', '3', '4'] },
                    { unit: 'IV', items: ['1', '2', '3', '4'] },
                    { unit: 'V', items: ['1', '2', '3', '4'] }
                  ].map((unitGroup) => (
                    <div key={unitGroup.unit}>
                      <h4 className="font-medium mb-3">Unit {unitGroup.unit}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {unitGroup.items.map((item) => {
                          const runtimeKey = `unit_${unitGroup.unit.toLowerCase()}_${item}_runtime` as keyof FilterOperationFormData;
                          const jedaKey = `unit_${unitGroup.unit.toLowerCase()}_${item}_jeda` as keyof FilterOperationFormData;
                          
                          return (
                            <div key={item} className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-2">{unitGroup.unit} {item}</h5>
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor={`filter-${runtimeKey}`} className="text-xs">
                                    Runtime (menit)
                                  </Label>
                                  <Input
                                    id={`filter-${runtimeKey}`}
                                    type="number"
                                    placeholder="0"
                                    value={filterForm[runtimeKey]}
                                    onChange={(e) => setFilterForm(prev => ({ ...prev, [runtimeKey]: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`filter-${jedaKey}`} className="text-xs">
                                    Jeda Start/Stop (menit)
                                  </Label>
                                  <Input
                                    id={`filter-${jedaKey}`}
                                    type="number"
                                    placeholder="0"
                                    value={filterForm[jedaKey]}
                                    onChange={(e) => setFilterForm(prev => ({ ...prev, [jedaKey]: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Electric Tab */}
            <TabsContent value="electric" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {electricFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`electric-${field.key}`} className="text-sm font-semibold">
                        {field.label} ({field.unit})
                      </Label>
                      <Input
                        id={`electric-${field.key}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={electricForm[field.key as keyof ElectricFormData]}
                        onChange={(e) => setElectricForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className={`focus-ring ${errors[field.key] ? 'border-destructive' : ''}`}
                      />
                      {errors[field.key] && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSaveAll}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Semua Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputForm;