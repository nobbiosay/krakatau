import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Download, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import {
  getFlowData,
  getChemicalData,
  getElectricData,
  formatDate,
  FlowData,
  ChemicalData,
  ElectricData,
} from '@/utils/dataStore';

const RekapData: React.FC = () => {
  const [startDate, setStartDate] = useState(formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))); // 7 days ago
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [selectedPlant, setSelectedPlant] = useState<'kerenceng' | 'cidanau' | 'both'>('both');

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getDataInRange = () => {
    const flowData = getFlowData().filter(d => 
      d.date >= startDate && d.date <= endDate &&
      (selectedPlant === 'both' || d.plant === selectedPlant)
    ).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    
    const chemicalData = getChemicalData().filter(d => 
      d.date >= startDate && d.date <= endDate &&
      (selectedPlant === 'both' || d.plant === selectedPlant)
    ).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    
    const electricData = getElectricData().filter(d => 
      d.date >= startDate && d.date <= endDate &&
      (selectedPlant === 'both' || d.plant === selectedPlant)
    ).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    return { flowData, chemicalData, electricData };
  };

  const calculateSummary = () => {
    const { flowData, chemicalData, electricData } = getDataInRange();
    
    const totalFlow = flowData.reduce((sum, d) => sum + d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp, 0);
    const totalChemical = chemicalData.reduce((sum, d) => sum + d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin, 0);
    const totalElectric = electricData.reduce((sum, d) => sum + d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp, 0);

    const avgFlow = flowData.length > 0 ? totalFlow / flowData.length : 0;
    const avgChemical = chemicalData.length > 0 ? totalChemical / chemicalData.length : 0;
    const avgElectric = electricData.length > 0 ? totalElectric / electricData.length : 0;

    return {
      totalFlow,
      totalChemical,
      totalElectric,
      avgFlow,
      avgChemical,
      avgElectric,
      totalEntries: flowData.length + chemicalData.length + electricData.length,
    };
  };

  const exportData = () => {
    const { flowData, chemicalData, electricData } = getDataInRange();
    
    // Create comprehensive CSV matching Excel structure
    const csvLines = [
      'REKAP DATA KRAKATAU WATER SOLUTION',
      `Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`,
      `Plant: ${selectedPlant === 'both' ? 'Kerenceng & Cidanau' : selectedPlant.charAt(0).toUpperCase() + selectedPlant.slice(1)}`,
      '',
      'DATA FLOW (m³)',
      'Tanggal,Jam,Plant,Counter Air Baku Kerenceng,Counter Air Baku Cipada,Counter PS I - WTP,Totalizer Reservoir,PS III,PS IV,PS V,PS VI,PT KTI,Kp. Baru,Warnasari,BBS,Mandiri LS,Kota & Panggung Rawi,APBN,APBD,PS VIII Cipada,Internal WTP Cidanau',
      ...flowData.map(d => 
        `${new Date(d.date).toLocaleDateString('id-ID')},${d.time},${d.plant.charAt(0).toUpperCase() + d.plant.slice(1)},${d.counter_air_baku_kerenceng},${d.counter_air_baku_cipada},${d.counter_ps1_wtp},${d.totalizer_reservoir},${d.ps_iii},${d.ps_iv},${d.ps_v},${d.ps_vi},${d.pt_kti},${d.kp_baru},${d.warnasari},${d.bbs},${d.mandiri_ls},${d.kota_panggung_rawi},${d.apbn},${d.apbd},${d.ps_viii_cipada},${d.internal_wtp_cidanau}`
      ),
      '',
      'DATA CHEMICAL',
      'Tanggal,Jam,Plant,Aluminium Sulfat Bak I (kg),Aluminium Sulfat Bak II (kg),Flowmeter Kapur (m³),Pemakaian Klorin (kg),Kianchem (m³),Flowmeter Coagulant Aid (m³),Konsentrasi Alum S.Bak I (%),Konsentrasi Alum S.Bak II (%)',
      ...chemicalData.map(d => 
        `${new Date(d.date).toLocaleDateString('id-ID')},${d.time},${d.plant.charAt(0).toUpperCase() + d.plant.slice(1)},${d.aluminium_sulfat_bak_i},${d.aluminium_sulfat_bak_ii},${d.flowmeter_kapur},${d.pemakaian_klorin},${d.kianchem},${d.flowmeter_coagulant_aid},${d.konsentrasi_alum_s_bak_i},${d.konsentrasi_alum_s_bak_ii}`
      ),
      '',
      'DATA ELECTRIC (kWh)',
      'Tanggal,Jam,Plant,Trafo I AK O4 - LWBP,Trafo II AK 09 - LWBP,Trafo III AK 03 - LWBP,Trafo IV AK 02 - LWBP,PS I - Trafo I AK 10 - LWBP,PS I - Trafo II AK 03 - LWBP,PS V - Incoming (BA 01) - LWBP,PS V - Incoming (BA 04) - LWBP,Trafo I AK O4 - WBP,Trafo II AK 09 - WBP,Trafo III AK 03 - WBP,Trafo IV AK 02 - WBP,PS I - Trafo I AK 10 - WBP,PS I - Trafo II AK 03 - WBP,PS V - Incoming (BA 01) - WBP,PS V - Incoming (BA 04) - WBP',
      ...electricData.map(d => 
        `${new Date(d.date).toLocaleDateString('id-ID')},${d.time},${d.plant.charAt(0).toUpperCase() + d.plant.slice(1)},${d.trafo_i_ak04_lwbp},${d.trafo_ii_ak09_lwbp},${d.trafo_iii_ak03_lwbp},${d.trafo_iv_ak02_lwbp},${d.ps_i_trafo_i_ak10_lwbp},${d.ps_i_trafo_ii_ak03_lwbp},${d.ps_v_incoming_ba01_lwbp},${d.ps_v_incoming_ba04_lwbp},${d.trafo_i_ak04_wbp},${d.trafo_ii_ak09_wbp},${d.trafo_iii_ak03_wbp},${d.trafo_iv_ak02_wbp},${d.ps_i_trafo_i_ak10_wbp},${d.ps_i_trafo_ii_ak03_wbp},${d.ps_v_incoming_ba01_wbp},${d.ps_v_incoming_ba04_wbp}`
      ),
      '',
      'RINGKASAN',
      `Total Flow Usage,${formatNumber(calculateSummary().totalFlow)} m³`,
      `Total Chemical Usage,${formatNumber(calculateSummary().totalChemical)} kg`,
      `Total Electric Usage,${formatNumber(calculateSummary().totalElectric)} kWh`,
      `Rata-rata Flow,${formatNumber(calculateSummary().avgFlow)} m³`,
      `Rata-rata Chemical,${formatNumber(calculateSummary().avgChemical)} kg`, 
      `Rata-rata Electric,${formatNumber(calculateSummary().avgElectric)} kWh`,
      `Total Entri Data,${calculateSummary().totalEntries}`,
    ];

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-data-${startDate}-${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateDailySummary = () => {
    const { flowData, chemicalData, electricData } = getDataInRange();
    const dailyData: Record<string, { flow: number; chemical: number; electric: number }> = {};

    // Group by date
    flowData.forEach(d => {
      if (!dailyData[d.date]) dailyData[d.date] = { flow: 0, chemical: 0, electric: 0 };
      dailyData[d.date].flow += (d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp);
    });

    chemicalData.forEach(d => {
      if (!dailyData[d.date]) dailyData[d.date] = { flow: 0, chemical: 0, electric: 0 };
      dailyData[d.date].chemical += (d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin);
    });

    electricData.forEach(d => {
      if (!dailyData[d.date]) dailyData[d.date] = { flow: 0, chemical: 0, electric: 0 };
      dailyData[d.date].electric += (d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp);
    });

    return Object.entries(dailyData)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 10); // Show last 10 days
  };

  const getPlantSummary = () => {
    if (selectedPlant !== 'both') return null;

    const kerencengData = {
      flow: getFlowData().filter(d => d.plant === 'kerenceng' && d.date >= startDate && d.date <= endDate),
      chemical: getChemicalData().filter(d => d.plant === 'kerenceng' && d.date >= startDate && d.date <= endDate),
      electric: getElectricData().filter(d => d.plant === 'kerenceng' && d.date >= startDate && d.date <= endDate),
    };

    const cidanauData = {
      flow: getFlowData().filter(d => d.plant === 'cidanau' && d.date >= startDate && d.date <= endDate),
      chemical: getChemicalData().filter(d => d.plant === 'cidanau' && d.date >= startDate && d.date <= endDate),
      electric: getElectricData().filter(d => d.plant === 'cidanau' && d.date >= startDate && d.date <= endDate),
    };

    const kerencengTotal = {
      flow: kerencengData.flow.reduce((sum, d) => sum + d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp, 0),
      chemical: kerencengData.chemical.reduce((sum, d) => sum + d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin, 0),
      electric: kerencengData.electric.reduce((sum, d) => sum + d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp, 0),
    };

    const cidanauTotal = {
      flow: cidanauData.flow.reduce((sum, d) => sum + d.counter_air_baku_kerenceng + d.counter_air_baku_cipada + d.counter_ps1_wtp, 0),
      chemical: cidanauData.chemical.reduce((sum, d) => sum + d.aluminium_sulfat_bak_i + d.aluminium_sulfat_bak_ii + d.pemakaian_klorin, 0),
      electric: cidanauData.electric.reduce((sum, d) => sum + d.trafo_i_ak04_lwbp + d.trafo_ii_ak09_lwbp + d.trafo_i_ak04_wbp, 0),
    };

    return { kerencengTotal, cidanauTotal };
  };

  const summary = calculateSummary();
  const dailySummary = calculateDailySummary();
  const plantComparison = getPlantSummary();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rekap Data</h1>
          <p className="text-muted-foreground">
            Ringkasan dan analisis data operasional berdasarkan rentang waktu
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filter Periode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-sm font-semibold">
                  Tanggal Mulai
                </Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="focus-ring pr-10"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-sm font-semibold">
                  Tanggal Akhir
                </Label>
                <div className="relative">
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="focus-ring pr-10"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plant-select" className="text-sm font-semibold">
                  Plant
                </Label>
                <select
                  id="plant-select"
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus-ring"
                >
                  <option value="both">Semua Plant</option>
                  <option value="kerenceng">Kerenceng</option>
                  <option value="cidanau">Cidanau</option>
                </select>
              </div>

              <Button onClick={exportData} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Flow</p>
                  <p className="text-2xl font-bold">{formatNumber(summary.totalFlow)}</p>
                  <p className="text-xs text-muted-foreground">m³</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Chemical</p>
                  <p className="text-2xl font-bold">{formatNumber(summary.totalChemical)}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Electric</p>
                  <p className="text-2xl font-bold">{formatNumber(summary.totalElectric)}</p>
                  <p className="text-xs text-muted-foreground">kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Entri</p>
                  <p className="text-2xl font-bold">{summary.totalEntries}</p>
                  <p className="text-xs text-muted-foreground">data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Ringkasan Harian</TabsTrigger>
            <TabsTrigger value="average">Rata-rata</TabsTrigger>
            {selectedPlant === 'both' && <TabsTrigger value="comparison">Perbandingan Plant</TabsTrigger>}
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Data Harian (10 Hari Terakhir)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-zebra">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Tanggal</th>
                        <th className="text-right p-3 text-sm font-semibold text-foreground">Flow (m³)</th>
                        <th className="text-right p-3 text-sm font-semibold text-foreground">Chemical (kg)</th>
                        <th className="text-right p-3 text-sm font-semibold text-foreground">Electric (kWh)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailySummary.map(([date, data]) => (
                        <tr key={date} className="border-b border-border/50">
                          <td className="p-3 text-sm font-medium">
                            {new Date(date).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-3 text-sm text-right">{formatNumber(data.flow)}</td>
                          <td className="p-3 text-sm text-right">{formatNumber(data.chemical)}</td>
                          <td className="p-3 text-sm text-right">{formatNumber(data.electric)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="average" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Rata-rata Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(summary.avgFlow)}</p>
                    <p className="text-sm text-muted-foreground">m³ per entri</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Rata-rata Chemical</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{formatNumber(summary.avgChemical)}</p>
                    <p className="text-sm text-muted-foreground">kg per entri</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Rata-rata Electric</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{formatNumber(summary.avgElectric)}</p>
                    <p className="text-sm text-muted-foreground">kWh per entri</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {selectedPlant === 'both' && plantComparison && (
            <TabsContent value="comparison" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Plant Kerenceng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Flow Usage</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {formatNumber(plantComparison.kerencengTotal.flow)} m³
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Chemical Usage</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {formatNumber(plantComparison.kerencengTotal.chemical)} kg
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Electric Usage</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {formatNumber(plantComparison.kerencengTotal.electric)} kWh
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Plant Cidanau</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Flow Usage</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {formatNumber(plantComparison.cidanauTotal.flow)} m³
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Chemical Usage</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {formatNumber(plantComparison.cidanauTotal.chemical)} kg
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Electric Usage</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {formatNumber(plantComparison.cidanauTotal.electric)} kWh
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default RekapData;