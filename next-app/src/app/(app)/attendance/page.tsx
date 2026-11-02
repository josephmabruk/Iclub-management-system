import type { Metadata } from "next";
import AttendanceContent from "./_components/AttendanceContent";

export const metadata: Metadata = { title: "Attendance" };

const AttendancePage = () => {
  return <AttendanceContent />;
};

export default AttendancePage;
