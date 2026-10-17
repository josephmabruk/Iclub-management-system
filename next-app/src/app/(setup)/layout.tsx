import AppLogo from "@/components/shared/AppLogo";

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col bg-page">
      <header className="flex items-center border-b border-gray-200 bg-white px-6 py-4">
        {<AppLogo/>}
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default SetupLayout;