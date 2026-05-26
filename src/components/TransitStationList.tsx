import type { TransitStop } from '../types/index.js';

interface Props {
  stops: TransitStop[];
}

export function TransitStationList({ stops }: Props) {
  if (stops.length === 0) return null;

  return (
    <div className="card">
      <h3 className="card-title">经停站</h3>
      <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>站名</th>
              <th>预计到达时间</th>
              <th>地址</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((stop, i) => (
              <tr key={i}>
                <td>
                  <span className="tag tag-blue">{stop.operator}</span>
                </td>
                <td>{stop.yjddsj}</td>
                <td className="cell-ellipsis" title={stop.czdz}>{stop.czdz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
