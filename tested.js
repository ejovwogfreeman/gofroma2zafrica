[
  {
    date: "2025-03-23",
    amount: 10000,
    orders: 1,
  },
  {
    date: "2025-03-23",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-03-20",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-04-10",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-04-23",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-04-23",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-05-10",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-05-18",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-05-19",
    amount: 20000,
    orders: 1,
  },
  {
    date: "2025-05-19",
    amount: 13000,
    orders: 1,
  },
  {
    date: "2025-05-19",
    amount: 2300,
    orders: 1,
  },
];

// updated
// today: Number(
//   data.data.stats.revenue.breakdown.daily
//     .filter(
//       (d: { date: string; amount: number }) =>
//         d.date === new Date().toISOString().split("T")[0]
//     )
//     .reduce(
//       (sum: number, d: { date: string; amount: number }) =>
//         sum + d.amount,
//       0
//     )
// ),
// thisWeek: Number(
//   data.data.stats.revenue.breakdown.daily
//     .filter((d: { date: string; amount: number }) => {
//       const entryDate = new Date(d.date);
//       const today = new Date();
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday (assuming week starts on Monday)

//       return entryDate >= startOfWeek && entryDate <= today;
//     })
//     .reduce(
//       (sum: number, d: { date: string; amount: number }) =>
//         sum + d.amount,
//       0
//     )
// ),
// thisMonth: Number(
//   data.data.stats.revenue.breakdown.daily
//     .filter((d: { date: string; amount: number }) => {
//       const entryDate = new Date(d.date);
//       const today = new Date();
//       return (
//         entryDate.getFullYear() === today.getFullYear() &&
//         entryDate.getMonth() === today.getMonth()
//       );
//     })
//     .reduce(
//       (sum: number, d: { date: string; amount: number }) =>
//         sum + d.amount,
//       0
//     )
// ),
