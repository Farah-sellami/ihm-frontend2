import { Sidebar } from "../../admin/Sidebar";
import { Container } from "../Design";

export const DashboardLayout = ({ children }) => {
  const role = 0;

  return (
    <div className="mt-32">
      <Container className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 shadow-s1 py-8 p-5 rounded-lg mb-4 lg:mb-0">
          <Sidebar role={role} />
        </div>
        <div className="w-full lg:w-3/4 px-5 ml-0 lg:ml-10 rounded-lg">
          {children}
        </div>
      </Container>
    </div>
  );
};
