import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/data/DataTable';

const DataKerenceng: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'chemical' | 'electric' | 'quality' | 'filter'>('flow');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Kerenceng</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola data tersimpan untuk plant Kerenceng
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="chemical">Chemical</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
            <TabsTrigger value="quality">Analisa Kualitas</TabsTrigger>
            <TabsTrigger value="filter">Unit Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-6">
            <DataTable plant="kerenceng" dataType="flow" />
          </TabsContent>

          <TabsContent value="chemical" className="mt-6">
            <DataTable plant="kerenceng" dataType="chemical" />
          </TabsContent>

          <TabsContent value="electric" className="mt-6">
            <DataTable plant="kerenceng" dataType="electric" />
          </TabsContent>

          <TabsContent value="quality" className="mt-6">
            <DataTable plant="kerenceng" dataType="quality" />
          </TabsContent>

          <TabsContent value="filter" className="mt-6">
            <DataTable plant="kerenceng" dataType="filter" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DataKerenceng;
