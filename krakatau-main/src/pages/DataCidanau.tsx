import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/data/DataTable';

const DataCidanau: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'chemical' | 'electric'>('flow');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Cidanau</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola data tersimpan untuk plant Cidanau
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="chemical">Chemical</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
          </TabsList>

        <TabsContent value="flow" className="mt-6">
            <DataTable plant="cidanau" dataType="flow" />
          </TabsContent>

          <TabsContent value="chemical" className="mt-6">
            <DataTable plant="cidanau" dataType="chemical" />
          </TabsContent>

          <TabsContent value="electric" className="mt-6">
            <DataTable plant="cidanau" dataType="electric" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DataCidanau;
