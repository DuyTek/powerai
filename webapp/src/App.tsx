import { Outlet } from "react-router";
import { AppLayout } from "./components";
import { AppProviders } from "./config/AppProvider";

function App() {
  return (
    <AppProviders>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
