import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SummaryCards from '@/components/dashboard/SummaryCards';
import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardTable from '@/components/dashboard/DashboardTable';
import {
  getFlowData,
  getChemicalData,
  getElectricData,
  calculateDashboardSummary,
  formatDate,
  clearAllData,
  DashboardSummary,
  FlowData,
  ChemicalData,
  ElectricData,
} from '@/utils/dataStore';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [activePlant, setActivePlant] = useState<'kerenceng' | 'cidanau'>('kerenceng');
  const [activeTableTab, setActiveTableTab] = useState<'flow' | 'chemical' | 'electric'>('flow');
  const [summary, setSummary] = useState<DashboardSummary>({
    flow_usage: 0,
    flow_delta: 0,
    chemical_usage: 0,
    chemical_delta: 0,
    electric_usage: 0,
    electric_delta: 0,
  });
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [chemicalData, setChemicalData] = useState<ChemicalData[]>([]);
  const [electricData, setElectricData] = useState<ElectricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear existing data for testing
    // clearAllData(); // Uncomment this to clear all data
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      updateSummary();
    }
  }, [selectedDate, activePlant, flowData, chemicalData, electricData]);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFlowData(getFlowData());
      setChemicalData(getChemicalData());
      setElectricData(getElectricData());
      setIsLoading(false);
    }, 500);
  };

  const updateSummary = () => {
    const newSummary = calculateDashboardSummary(activePlant, selectedDate);
    setSummary(newSummary);
  };

  const handleApplyDate = () => {
    updateSummary();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const getTodayDate = () => {
    return formatDate(new Date());
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Operasional</h1>
            <p className="text-muted-foreground">
              Monitoring konsumsi flow, chemical, dan electric usage
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filter & Pengaturan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="date-picker" className="text-sm font-semibold">
                  Tanggal
                </Label>
                <div className="relative">
                  <Input
                    id="date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={getTodayDate()}
                    className="focus-ring pr-10"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <Button onClick={handleApplyDate} className="btn-hero">
                Terapkan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plant Tabs */}
        <Tabs value={activePlant} onValueChange={(value) => setActivePlant(value as 'kerenceng' | 'cidanau')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kerenceng">Kerenceng</TabsTrigger>
            <TabsTrigger value="cidanau">Cidanau</TabsTrigger>
          </TabsList>

          <TabsContent value={activePlant} className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards summary={summary} isLoading={isLoading} />

            {/* Charts */}
            <DashboardChart
              flowData={flowData}
              chemicalData={chemicalData}
              electricData={electricData}
              plant={activePlant}
              date={selectedDate}
            />

            {/* Data Table */}
            <Tabs value={activeTableTab} onValueChange={(value) => setActiveTableTab(value as 'flow' | 'chemical' | 'electric')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flow">Flow Data</TabsTrigger>
                <TabsTrigger value="chemical">Chemical Data</TabsTrigger>
                <TabsTrigger value="electric">Electric Data</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTableTab} className="mt-6">
                <DashboardTable
                  flowData={flowData}
                  chemicalData={chemicalData}
                  electricData={electricData}
                  plant={activePlant}
                  date={selectedDate}
                  activeTab={activeTableTab}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;