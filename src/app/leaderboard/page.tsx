"use client";

import React, { useState } from "react";
import { Filters } from "./filters";
import { LeaderboardTable } from "./LeaderboardTable";

export default function Page() {
  // State für das Ein-/Ausblenden von surrender
  const [hideSurrender, setHideSurrender] = useState(false);

  return (
    <section className='mx-auto max-w-2xl px-4 py-6 space-y-8'>
      {/* Filters-Komponente mit Callback */}
      <Filters
        hideSurrender={hideSurrender}
        onHideSurrenderChange={(value) => setHideSurrender(value)}
      />

      {/* Leaderboard-Tabelle, bekommt hideSurrender als Prop */}
      <LeaderboardTable hideSurrender={hideSurrender} />
    </section>
  );
}
