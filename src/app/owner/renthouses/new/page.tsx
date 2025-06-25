'use client';

import { Suspense } from 'react';
import { NewRenthouseForm } from './_components/NewRenthouseForm';

export default function NewRenthousePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewRenthouseForm />
    </Suspense>
  );
}