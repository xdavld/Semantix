"use client";

import React from "react";
import { Filters } from "./filters";
import { LeaderboardTable } from "./LeaderboardTable";

export default function Page() {
  return (
    <section className='mx-auto max-w-2xl px-4 py-6 space-y-8'>
      <Filters />
      <LeaderboardTable />
    </section>
  );
}
