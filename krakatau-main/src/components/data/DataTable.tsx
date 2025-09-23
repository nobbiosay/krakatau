import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
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
} from '@/utils/dataStore';

interface DataTableProps {
  plant: 'kerenceng' | 'cidanau';
  dataType: 'flow' | 'chemical' | 'electric' | 'quality' | 'filter';
}

const ITEMS_PER_PAGE = 15;

const DataTable: React.FC<DataTableProps> = ({ plant, dataType }) => {
  const { toast } = useToast();
  // Determine which keys to display based on dataType, excluding meta fields
  const metaKeys = new Set(['id','date','time','plant','delta']);
  const allKeys = useMemo(() => {
    const sample = filteredData[0] || {};
    return Object.keys(sample).filter(k => !metaKeys.has(k));
  }, [filteredData]);

  // If you want specific ordering per dataType, define it here; else fall back to allKeys
  const preferredOrder: Record<string, string[]> = {
    flow: [
      'counter_air_baku_kerenceng','counter_air_baku_cipada','counter_ps1_wtp','totalizer_reservoir',
      'ps_iii','ps_iv','ps_v','ps_vi','pt_kti','kp_baru','warnasari','bbs','mandiri_ls',
      'kota_panggung_rawi','apbn','apbd','ps_viii_cipada','internal_wtp_cidanau'
    ],
    chemical: [
      'aluminium_sulfat_bak_i','aluminium_sulfat_bak_ii','flowmeter_kapur','pemakaian_klorin',
      'kianchem','flowmeter_coagulant_aid','konsentrasi_alum_s_bak_i','konsentrasi_alum_s_bak_ii'
    ],
    electric: [
      'trafo_i_ak04_lwbp','trafo_ii_ak09_lwbp','trafo_iii_ak03_lwbp','trafo_iv_ak02_lwbp',
      'ps_i_trafo_i_ak10_lwbp','ps_i_trafo_ii_ak03_lwbp','ps_v_incoming_ba01_lwbp','ps_v_incoming_ba04_lwbp',
      'trafo_i_ak04_wbp','trafo_ii_ak09_wbp','trafo_iii_ak03_wbp','trafo_iv_ak02_wbp',
      'ps_i_trafo_i_ak10_wbp','ps_i_trafo_ii_ak03_wbp','ps_v_incoming_ba01_wbp','ps_v_incoming_ba04_wbp'
    ],
    quality: [
      'jartest_shift_i_ph','jartest_shift_i_dosis_ppm','jartest_shift_i_ppm_aktual',
      'jartest_shift_ii_ph','jartest_shift_ii_dosis_ppm','jartest_shift_ii_ppm_aktual',
      'jartest_shift_iii_ph','jartest_shift_iii_dosis_ppm','jartest_shift_iii_ppm_aktual',
      'lumpur_shift_i_acc_i','lumpur_shift_i_acc_ii','lumpur_shift_i_acc_iii',
      'lumpur_shift_ii_acc_i','lumpur_shift_ii_acc_ii','lumpur_shift_ii_acc_iii',
      'lumpur_shift_iii_acc_i','lumpur_shift_iii_acc_ii','lumpur_shift_iii_acc_iii'
    ],
    filter: [
      'unit_i_1_runtime','unit_i_1_jeda','unit_i_2_runtime','unit_i_2_jeda','unit_i_3_runtime','unit_i_3_jeda','unit_i_4_runtime','unit_i_4_jeda',
      'unit_ii_1_runtime','unit_ii_1_jeda','unit_ii_2_runtime','unit_ii_2_jeda','unit_ii_3_runtime','unit_ii_3_jeda','unit_ii_4_runtime','unit_ii_4_jeda',
      'unit_iii_1_runtime','unit_iii_1_jeda','unit_iii_2_runtime','unit_iii_2_jeda','unit_iii_3_runtime','unit_iii_3_jeda','unit_iii_4_runtime','unit_iii_4_jeda',
      'unit_iv_1_runtime','unit_iv_1_jeda','unit_iv_2_runtime','unit_iv_2_jeda','unit_iv_3_runtime','unit_iv_3_jeda','unit_iv_4_runtime','unit_iv_4_jeda',
      'unit_v_1_runtime','unit_v_1_jeda','unit_v_2_runtime','unit_v_2_jeda','unit_v_3_runtime','unit_v_3_jeda','unit_v_4_runtime','unit_v_4_jeda'
    ],
  };

  const fieldKeys = useMemo(() => {
    const pref = preferredOrder[dataType];
    if (pref) {
      // keep only keys that actually exist in the data
      const present = new Set(allKeys);
      const ordered = pref.filter(k => present.has(k));
      // add any extra keys at the end (future-proof)
      const extras = allKeys.filter(k => !ordered.includes(k));
      return [...ordered, ...extras];
    }
    return allKeys;
  }, [dataType, allKeys]);

  const formatHeader = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])/g, (m) => m.toUpperCase());
  };
const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getData = () => {
    switch (dataType) {
      case 'flow':
        return getFlowData();
      case 'chemical':
        return getChemicalData();
      case 'electric':
        return getElectricData();
      case 'quality':
        return getQualityData();
      case 'filter':
        return getFilterOperationData();
      default:
        return [];
    }
  };

  const saveData = (newData: any[]) => {
    switch (dataType) {
      case 'flow':
        saveFlowData(newData);
        break;
      case 'chemical':
        saveChemicalData(newData);
        break;
      case 'electric':
        saveElectricData(newData);
        break;
      case 'quality':
        saveQualityData(newData);
        break;
      case 'filter':
        saveFilterOperationData(newData);
        break;
    }
  };

  const allData = getData().filter(d => d.plant === plant);
  
  console.log('=== DATA TABLE DEBUG ===');
  console.log('Plant filter:', plant);
  console.log('Data type:', dataType);
  console.log('All data for plant:', allData.map(d => ({id: d.id, plant: d.plant, date: d.date, time: d.time})));
  console.log('=== END DATA TABLE DEBUG ===');

  const filteredData = useMemo(() => {
    let filtered = allData;

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(d => d.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(d => d.date <= endDate);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort by date and time (newest first)
    filtered.sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date);
      if (dateComparison !== 0) return dateComparison;
      return b.time.localeCompare(a.time);
    });

    return filtered;
  }, [allData, startDate, endDate, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleDelete = (id: string) => {
    const updatedData = allData.filter(d => d.id !== id);
    const globalData = getData().filter(d => d.plant !== plant).concat(updatedData);
    saveData(globalData);
    
    toast({
      title: 'Data berhasil dihapus',
      description: 'Data telah dihapus dari sistem',
    });
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast({
        title: 'Tidak ada data untuk diekspor',
        description: 'Silakan sesuaikan filter atau tambah data terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(filteredData[0]).filter(key => key !== 'id');
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => {
          const value = (row as any)[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${plant}-${dataType}-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: 'Export berhasil',
      description: `Data ${dataType} ${plant} berhasil diexport ke CSV`,
    });
  };

  const calculateSummary = () => {
    const summary = {
      totalEntries: filteredData.length,
      totalFlow: 0,
      totalChemical: 0,
      totalElectric: 0,
    };

    filteredData.forEach((item: any) => {
      if (dataType === 'flow') {
        summary.totalFlow += (item.delta || 0);
      } else if (dataType === 'chemical') {
        summary.totalChemical += (item.aluminium_sulfat_bak_i + item.aluminium_sulfat_bak_ii + item.pemakaian_klorin);
      } else if (dataType === 'electric') {
        summary.totalElectric += (item.trafo_i_ak04_lwbp + item.trafo_ii_ak09_lwbp + item.trafo_i_ak04_wbp);
      }
    });

    return summary;
  };

  const summary = calculateSummary();

  const renderFlowTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-zebra">
        <thead>
  <tr className="border-b border-border">
    <th className="text-left p-3 text-sm font-semibold text-foreground">Tanggal</th>
    <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
    {/* Dynamic headers based on dataType */}
    {fieldKeys.map((key) => (
      <th key={key} className="text-right p-3 text-sm font-semibold text-foreground">
        {formatHeader(key)}
      </th>
    ))}
    <th className="text-right p-3 text-sm font-semibold text-foreground">Total</th>
    <th className="text-center p-3 text-sm font-semibold text-foreground">Aksi</th>
  </tr>
</thead>
        <tbody>
  {paginatedData.map((item: any) => {
    const total = fieldKeys.reduce((sum, key) => {
      const v = Number(item[key] ?? 0);
      return sum + (isNaN(v) ? 0 : v);
    }, 0);
    return (
      <tr key={item.id} className="border-b border-border/50">
        <td className="p-3 text-sm">
          {new Date(item.date).toLocaleDateString('id-ID')}
        </td>
        <td className="p-3 text-sm font-medium">{item.time}</td>
        {fieldKeys.map((key) => (
          <td key={key} className="p-3 text-sm text-right">
            {formatNumber(item[key])}
          </td>
        ))}
        <td className="p-3 text-sm text-right">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {formatNumber(total)}
          </Badge>
        </td>
        <td className="p-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm">Edit</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data pada {new Date(item.date).toLocaleDateString('id-ID')} {item.time} akan dihapus. Lanjutkan?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
      </table>
    </div>
  );

  const renderChemicalTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-zebra">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-semibold text-foreground">Tanggal</th>
            <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Alum S. Bak I (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Alum S. Bak II (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Pemakaian Klorin (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Total (kg)</th>
            <th className="text-center p-3 text-sm font-semibold text-foreground">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: ChemicalData) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="p-3 text-sm">
                {new Date(item.date).toLocaleDateString('id-ID')}
              </td>
              <td className="p-3 text-sm font-medium">{item.time}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.aluminium_sulfat_bak_i)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.aluminium_sulfat_bak_ii)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.pemakaian_klorin)}</td>
              <td className="p-3 text-sm text-right">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {formatNumber(item.aluminium_sulfat_bak_i + item.aluminium_sulfat_bak_ii + item.pemakaian_klorin)}
                </Badge>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderElectricTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-zebra">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-semibold text-foreground">Tanggal</th>
            <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo I AK O4 - LWBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo II AK 09 - LWBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo I AK O4 - WBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Total (kWh)</th>
            <th className="text-center p-3 text-sm font-semibold text-foreground">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: ElectricData) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="p-3 text-sm">
                {new Date(item.date).toLocaleDateString('id-ID')}
              </td>
              <td className="p-3 text-sm font-medium">{item.time}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_i_ak04_lwbp)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_ii_ak09_lwbp)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_i_ak04_wbp)}</td>
              <td className="p-3 text-sm text-right">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {formatNumber(item.trafo_i_ak04_lwbp + item.trafo_ii_ak09_lwbp + item.trafo_i_ak04_wbp)}
                </Badge>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTable = () => {
    switch (dataType) {
      case 'flow':
        return renderFlowTable();
      case 'chemical':
        return renderChemicalTable();
      case 'electric':
        return renderElectricTable();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Entri</p>
                <p className="text-xl font-bold">{summary.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {dataType === 'flow' && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Flow (m³)</p>
                  <p className="text-xl font-bold">{formatNumber(summary.totalFlow)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {dataType === 'chemical' && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Chemical (kg)</p>
                  <p className="text-xl font-bold">{formatNumber(summary.totalChemical)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {dataType === 'electric' && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Electric (kWh)</p>
                  <p className="text-xl font-bold">{formatNumber(summary.totalElectric)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters and Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Data {dataType.charAt(0).toUpperCase() + dataType.slice(1)} - {plant.charAt(0).toUpperCase() + plant.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-semibold">
                Tanggal Mulai
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-semibold">
                Tanggal Akhir
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-semibold">
                Cari Data
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 focus-ring"
                />
              </div>
            </div>

            <Button onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-card">
        <CardContent className="px-0">
          {paginatedData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Tidak ada data yang ditemukan</p>
              <p className="text-sm">Sesuaikan filter atau tambah data baru</p>
            </div>
          ) : (
            <>
              {renderTable()}
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} entri
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm font-medium">
                      {currentPage} dari {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;