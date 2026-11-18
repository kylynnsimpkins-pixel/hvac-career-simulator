import Link from "next/link";

const links = [
  ["/profile", "Profile"],
  ["/campus", "Campus"],
  ["/placement-test", "Placement Test"],
  ["/certifications", "Certifications"],
  ["/graduation", "Graduation"],
  ["/residential-career", "Residential Career"],
  ["/commercial-career", "Commercial Career"],
  ["/company-builder", "Company Builder"],
  ["/summary", "Summary"],
];

export default function Home() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">HVAC Career Simulator</h1>
      <ul className="grid grid-cols-2 gap-3">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link className="block rounded border border-slate-600 p-3 hover:bg-slate-800" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
