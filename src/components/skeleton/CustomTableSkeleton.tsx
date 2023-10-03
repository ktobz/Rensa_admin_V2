import { MuiTableCell, MuiTableRow } from "lib";
import * as React from "react";
const stickyStyle: React.CSSProperties = {
  position: "sticky",
  left: 0,
  background: "white",
};

export default function CustomTableSkeleton({
  rows,
  columns,
  sticky = false,
}: {
  rows: number;
  columns: number;
  sticky?: boolean;
}) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <MuiTableRow key={index} style={{ padding: "30px 0" }}>
          {[...Array(columns)].map((_, index) => (
            <MuiTableCell
              key={index}
              style={sticky && index === 0 ? stickyStyle : undefined}>
              <div
                style={{
                  width: "95%",
                  height: "20px",
                  borderRadius: "40px",
                  background: "#cccccc77",
                }}></div>
            </MuiTableCell>
          ))}
        </MuiTableRow>
      ))}
    </>
  );
}
