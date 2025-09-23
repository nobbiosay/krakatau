import React from 'react';
import Layout from '@/components/layout/Layout';
import InputForm from '@/components/input/InputForm';

const InputKerenceng: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Input Data Kerenceng</h1>
          <p className="text-muted-foreground">
            Input data operasional untuk plant Kerenceng
          </p>
        </div>

        <InputForm plant="kerenceng" />
      </div>
    </Layout>
  );
};

export default InputKerenceng;