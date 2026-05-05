/**
 * written by Brian McCarthy
 */
// Unit Test Suite - Core Logic Verification
const mockTravelData = {
  beaches: [{ name: 'Beach 1' }, { name: 'Beach 2' }],
  temples: [{ name: 'Temple 1' }],
  countries: [{ name: 'Country 1', cities: [{ name: 'City 1' }] }]
};

function performSearch(query, data) {
  if (!data || !query.trim()) return [];
  const q = query.toLowerCase();
  if (q.includes('beach')) return data.beaches;
  if (q.includes('temple')) return data.temples;
  if (q.includes('country')) return data.countries.flatMap(c => c.cities);
  return [];
}

const tests = [
  { name: "1. Empty query returns empty array", fn: () => performSearch("", mockTravelData).length === 0 },
  { name: "2. Whitespace query returns empty array", fn: () => performSearch("   ", mockTravelData).length === 0 },
  { name: "3. 'beach' query returns beaches", fn: () => performSearch("beach", mockTravelData)[0].name === 'Beach 1' },
  { name: "4. 'BEACH' query is case-insensitive", fn: () => performSearch("BEACH", mockTravelData).length === 2 },
  { name: "5. 'temple' query returns temples", fn: () => performSearch("temple", mockTravelData).length === 1 },
  { name: "6. 'country' query returns cities", fn: () => performSearch("country", mockTravelData).length === 1 },
  { name: "7. Null data handling", fn: () => performSearch("beach", null).length === 0 },
  { name: "8. Random string returns nothing", fn: () => performSearch("xyz", mockTravelData).length === 0 },
];

console.log("--- TRAVELBLOOM UNIT TESTS ---");
tests.forEach(t => {
  const result = t.fn() ? "PASS" : "FAIL";
  console.log(`${t.name}: ${result}`);
});
