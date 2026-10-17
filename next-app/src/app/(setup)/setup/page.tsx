import { redirect } from "next/navigation";
import { SETUP_STEPS } from "@/constants";

const SetupPage = () => {
  redirect(SETUP_STEPS[0].href);
};

export default SetupPage;
