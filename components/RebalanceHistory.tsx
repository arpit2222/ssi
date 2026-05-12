export function RebalanceHistory({ items }: { items: any[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-panel text-gray-600">
          <tr><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Trades</th><th className="p-3">Fees</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t border-line">
              <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="p-3 font-semibold">{item.status}</td>
              <td className="p-3">{item.trades?.length || 0}</td>
              <td className="p-3">${item.feesCollected || 0}</td>
            </tr>
          ))}
          {!items.length && <tr><td className="p-3 text-gray-500" colSpan={4}>No rebalances yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
