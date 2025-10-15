"use client";

import React, { memo } from 'react';
import Button from '../../../../components/ui/Button';

interface FuneralHeaderProps {
  onCreateFuneral: (e: React.MouseEvent) => void;
}

const FuneralHeader = memo(({ onCreateFuneral }: FuneralHeaderProps) => {
  return (
    <header className="flex flex-row bg-gray-400 justify-between m-1 rounded-sm">
      <div className="my-2 px-4">
        <h1 className="text-xl font-semibold">Funerals</h1>
      </div>
      
      <Button 
        onClick={onCreateFuneral}
        className="m-2"
        variant="secondary"
      >
        + Create
      </Button>
    </header>
  );
});

FuneralHeader.displayName = 'FuneralHeader';

export default FuneralHeader;