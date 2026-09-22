"use client";

import { Suspense } from "react";
import CustomPackageForm from "@/components/custom-package/CustomPackageForm";

export default function CustomPackagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-secondary-dark to-dark-navy pt-2 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Suspense fallback={null}>
          <CustomPackageForm />
        </Suspense>
      </div>
    </div>
  );
}