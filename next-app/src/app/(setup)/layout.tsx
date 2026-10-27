import AppLogo from "@/components/shared/AppLogo";
import AuthGuard from "@/components/shared/AuthGuard";
import SetupStepper from "./_components/SetupStepper";

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard area="setup">
      <div className="flex flex-1 flex-col bg-page">
        <header className="flex items-center border-b border-gray-200 bg-white px-6 py-4">
          <AppLogo size="md" />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
          <SetupStepper />
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

export default SetupLayout;