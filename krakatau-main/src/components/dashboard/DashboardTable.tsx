import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { FlowData, ChemicalData, ElectricData } from '@/utils/dataStore';

interface DashboardTableProps {
  flowData: FlowData[];
  chemicalData: ChemicalData[];
  electricData: ElectricData[];
  plant: 'kerenceng' | 'cidanau';
  date: string;
  activeTab: 'flow' | 'chemical' | 'electric';
}

const ITEMS_PER_PAGE = 10;

const DashboardTable: React.FC<DashboardTableProps> = ({
  flowData,
  chemicalData,
  electricData,
  plant,
  date,
  activeTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getActiveData = () => {
    let data: any[] = [];
    switch (activeTab) {
      case 'flow':
        data = flowData;
        break;
      case 'chemical':
        data = chemicalData;
        break;
      case 'electric':
        data = electricData;
        break;
    }
    return data.filter(d => d.date === date && d.plant === plant);
  };

  const filteredData = useMemo(() => {
    const data = getActiveData();
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [flowData, chemicalData, electricData, plant, date, activeTab, searchTerm]);

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

  const renderFlowTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-zebra">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Air Baku Kerenceng (m³)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Air Baku Cipada (m³)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">PS I - WTP (m³)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Total (m³)</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: FlowData) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="p-3 text-sm font-medium">{item.time}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.counter_air_baku_kerenceng)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.counter_air_baku_cipada)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.counter_ps1_wtp)}</td>
              <td className="p-3 text-sm text-right">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {formatNumber(item.counter_air_baku_kerenceng + item.counter_air_baku_cipada + item.counter_ps1_wtp)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChemicalTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-zebra">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Alum S. Bak I (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Alum S. Bak II (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Pemakaian Klorin (kg)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: ChemicalData) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="p-3 text-sm font-medium">{item.time}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.aluminium_sulfat_bak_i)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.aluminium_sulfat_bak_ii)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.pemakaian_klorin)}</td>
              <td className="p-3 text-sm text-right">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {formatNumber(item.aluminium_sulfat_bak_i + item.aluminium_sulfat_bak_ii + item.pemakaian_klorin)}
                </Badge>
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
            <th className="text-left p-3 text-sm font-semibold text-foreground">Waktu</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo I AK O4 - LWBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo II AK 09 - LWBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Trafo I AK O4 - WBP (kWh)</th>
            <th className="text-right p-3 text-sm font-semibold text-foreground">Total (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: ElectricData) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="p-3 text-sm font-medium">{item.time}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_i_ak04_lwbp)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_ii_ak09_lwbp)}</td>
              <td className="p-3 text-sm text-right">{formatNumber(item.trafo_i_ak04_wbp)}</td>
              <td className="p-3 text-sm text-right">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {formatNumber(item.trafo_i_ak04_lwbp + item.trafo_ii_ak09_lwbp + item.trafo_i_ak04_wbp)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTable = () => {
    switch (activeTab) {
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
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold">
              Data Harian - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredData.length} entri untuk {plant.charAt(0).toUpperCase() + plant.slice(1)}
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {paginatedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tidak ada data yang ditemukan</p>
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
  );
};

export default DashboardTable;