'use client';

const headings = ["Title", "Date", "Type", "Status"];
const data = [
  ["Colm Conneely", "17 February 2025", "Funeral", "Complete"],
  ["Jane Doe", "18 February 2025", "Memorial", "Pending"],
];

import Layout from "./components/Layout/Layout";
import DataTable from "./components/DataTable/DataTable";
import './index.css';

export default function Home() {
  return <Layout />;
  // return  <DataTable headings={headings} data={data}/>;
}
