import type { Metadata } from "next";
import TakeAttendance from "./_components/TakeAttendance";

export const metadata: Metadata = { title: "Take attendance" };

const TakeAttendancePage = () => {
  return <TakeAttendance />;
};

export default TakeAttendancePage;
